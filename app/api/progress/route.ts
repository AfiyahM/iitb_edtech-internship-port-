import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { resourceId, learningPathId, completed, watchTime } = await request.json()
    
    // Update or create progress record
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        resource_id: resourceId,
        learning_path_id: learningPathId,
        completed,
        watch_time: watchTime,
        completed_at: completed ? new Date().toISOString() : null
      })
    
    if (error) throw error
    
    if (completed) {
      // Update user stats
      await updateUserStats(supabase, user.id, watchTime)
      
      // Check achievements
      await checkAchievements(supabase, user.id, learningPathId)
    }
    
    return NextResponse.json({ message: 'Progress updated' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
  }
}

async function updateUserStats(supabase: any, userId: string, watchTime: number) {
  const { data: stats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (stats) {
    await supabase
      .from('user_stats')
      .update({
        total_points: stats.total_points + 100,
        total_watch_time: stats.total_watch_time + watchTime,
        last_activity: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
  } else {
    await supabase
      .from('user_stats')
      .insert({
        user_id: userId,
        total_points: 100,
        total_watch_time: watchTime,
        study_streak: 1
      })
  }
}

async function checkAchievements(supabase: any, userId: string, learningPathId: string) {
  // Check first video achievement
  const { count: videoCount } = await supabase
    .from('user_progress')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .eq('completed', true)
  
  if (videoCount === 1) {
    await awardAchievement(supabase, userId, 'first_video')
  }
  
  // Check watch time achievement
  const { data: stats } = await supabase
    .from('user_stats')
    .select('total_watch_time')
    .eq('user_id', userId)
    .single()
  
  if (stats?.total_watch_time >= 18000) { // 5 hours
    await awardAchievement(supabase, userId, 'watch_time')
  }
  
  // Check path completion
  const { data: pathResources, error: pathError } = await supabase
    .from('resources')
    .select('id')
    .eq('learning_path_id', learningPathId)
  
  const { count: completedInPath } = await supabase
    .from('user_progress')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .eq('learning_path_id', learningPathId)
    .eq('completed', true)
  
  if (pathResources && completedInPath === pathResources.length) {
    await awardAchievement(supabase, userId, 'path_completion')
    
    // Update paths completed in stats
    await supabase
      .from('user_stats')
      .update({ paths_completed: supabase.raw('paths_completed + 1') })
      .eq('user_id', userId)
  }
}

async function awardAchievement(supabase: any, userId: string, type: string) {
  const { data: achievement } = await supabase
    .from('achievements')
    .select('*')
    .eq('type', type)
    .single()
  
  if (achievement) {
    await supabase
      .from('user_achievements')
      .upsert({
        user_id: userId,
        achievement_id: achievement.id,
        current_progress: achievement.requirement_value
      })
    
    // Add points to user stats
    await supabase
      .from('user_stats')
      .update({
        total_points: supabase.raw(`total_points + ${achievement.points_reward}`)
      })
      .eq('user_id', userId)
  }
}
