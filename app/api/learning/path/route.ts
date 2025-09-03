import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { data: { user } } = await supabase.auth.getUser()
    
    // Get learning paths with enrollment status
    const { data: paths, error } = await supabase
      .from('learning_paths')
      .select(`
        *,
        resources(count),
        user_enrollments!left(user_id),
        user_progress(
          completed,
          learning_path_id
        )
      `)
    
    if (error) throw error
    
    // Calculate progress for each path
    const pathsWithProgress = paths?.map(path => {
      const isEnrolled = user ? path.user_enrollments.some((e: any) => e.user_id === user.id) : false
      const completedResources = path.user_progress?.filter((p: any) => p.completed && p.learning_path_id === path.id).length || 0
      const totalResources = path.resources[0]?.count || 0
      const progress = totalResources > 0 ? Math.round((completedResources / totalResources) * 100) : 0
      
      return {
        ...path,
        enrolled: isEnrolled,
        totalResources,
        completedResources,
        progress,
        user_enrollments: undefined, // Remove from response
        user_progress: undefined, // Remove from response
      }
    })
    
    return NextResponse.json(pathsWithProgress)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch learning paths' }, { status: 500 })
  }
}
