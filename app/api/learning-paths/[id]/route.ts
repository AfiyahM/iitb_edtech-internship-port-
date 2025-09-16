import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

interface ProgressItem {
  resource_id: string
  completed: boolean
  learning_path_id: string
}

interface EnrollmentItem {
  learning_path_id: string
  completed_at: string | null
}

interface ResourceItem {
  id: string
  count?: number
}

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) {
      console.error('User fetch error:', userError.message)
      return NextResponse.json({ error: userError.message }, { status: 500 })
    }

    // For non-authenticated users, return all paths with default values
    if (!user) {
      const { data: paths, error: pathsError } = await supabase
        .from('learning_paths')
        .select(`
          *,
          resources(count)
        `)
        .eq('is_active', true)

      if (pathsError) {
        return NextResponse.json({ error: pathsError.message }, { status: 500 })
      }

      const formattedPaths = paths?.map(path => ({
        id: path.id,
        title: path.title,
        description: path.description,
        category: path.category,
        difficulty: path.difficulty || 'Beginner',
        estimatedTime: path.estimated_time || '4-6 weeks',
        skills: path.skills || [],
        color: path.color || 'bg-blue-500',
        icon: 'Video',
        rating: path.rating || 4.5,
        students: Math.floor(Math.random() * 1000) + 500,
        instructor: path.instructor || 'Expert Instructors',
        enrolled: false,
        completed: false,
        totalResources: path.resources?.[0]?.count || 0,
        completedResources: 0,
        progress: 0
      })) || []

      return NextResponse.json(formattedPaths)
    }

    // For authenticated users
    const userId = user.id

    // Get user's enrolled paths
    const { data: enrolledPaths, error: enrolledError } = await supabase
      .from('user_enrollments')
      .select('learning_path_id, completed_at')
      .eq('user_id', userId)

    if (enrolledError) {
      return NextResponse.json({ error: enrolledError.message }, { status: 500 })
    }

    // Get all active learning paths with resources
    const { data: paths, error: pathsError } = await supabase
      .from('learning_paths')
      .select(`
        *,
        resources(count)
      `)
      .eq('is_active', true)

    if (pathsError) {
      return NextResponse.json({ error: pathsError.message }, { status: 500 })
    }

    // Get user's progress on all resources
    const { data: progressData, error: progressError } = await supabase
      .from('user_progress')
      .select('resource_id, completed, learning_path_id')
      .eq('user_id', userId)

    if (progressError) {
      return NextResponse.json({ error: progressError.message }, { status: 500 })
    }

    // ✅ FIXED: Properly format learning paths with user-specific data
    const formattedPaths = paths?.map(path => {
      const enrollment = (enrolledPaths as EnrollmentItem[])?.find(
        (enroll: EnrollmentItem) => enroll.learning_path_id === path.id
      )
      
      // ✅ FIXED: Filter progress by learning path ID instead of resource ID comparison
      const pathProgress = (progressData as ProgressItem[])?.filter(
        (progress: ProgressItem) => progress.learning_path_id === path.id
      ) || []
      
      const completedResources = pathProgress.filter(
        (progress: ProgressItem) => progress.completed === true
      ).length
      
      const totalResources = path.resources?.[0]?.count || 0
      const progressPercent = totalResources > 0 ? Math.round((completedResources / totalResources) * 100) : 0

      return {
        id: path.id,
        title: path.title,
        description: path.description,
        category: path.category,
        difficulty: path.difficulty || 'Beginner',
        estimatedTime: path.estimated_time || '4-6 weeks',
        skills: path.skills || [],
        color: path.color || 'bg-blue-500',
        icon: 'Video',
        rating: path.rating || 4.5,
        students: Math.floor(Math.random() * 1000) + 500,
        instructor: path.instructor || 'Expert Instructors',
        enrolled: !!enrollment,
        completed: !!enrollment?.completed_at,
        totalResources: totalResources,
        completedResources: completedResources,
        progress: progressPercent
      }
    }) || []

    return NextResponse.json(formattedPaths)

  } catch (error) {
    console.error('Learning paths API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
