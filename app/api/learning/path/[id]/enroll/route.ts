import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Check if already enrolled
    const { data: existingEnrollment } = await supabase
      .from('user_enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('learning_path_id', params.id)
      .single()
    
    if (existingEnrollment) {
      return NextResponse.json({ message: 'Already enrolled' })
    }
    
    // Enroll user
    const { error } = await supabase
      .from('user_enrollments')
      .insert({
        user_id: user.id,
        learning_path_id: params.id
      })
    
    if (error) throw error
    
    // Check for multi-path achievement
    await checkMultiPathAchievement(supabase, user.id)
    
    return NextResponse.json({ message: 'Successfully enrolled' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to enroll' }, { status: 500 })
  }
}

async function checkMultiPathAchievement(supabase: any, userId: string) {
  const { count } = await supabase
    .from('user_enrollments')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
  
  if (count >= 3) {
    const { data: achievement } = await supabase
      .from('achievements')
      .select('id')
      .eq('type', 'multiple_paths')
      .single()
    
    if (achievement) {
      await supabase
        .from('user_achievements')
        .upsert({
          user_id: userId,
          achievement_id: achievement.id,
          current_progress: count
        })
    }
  }
}
