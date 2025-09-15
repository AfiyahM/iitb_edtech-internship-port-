import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // ✅ no await needed, just pass cookies directly
    const supabase = createRouteHandlerClient({ cookies })

    // Get user (treat missing session as anonymous, not error)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.warn('[learning-paths] auth warning:', userError.message)
    }

    // Fetch learning paths with resource counts
    const { data: paths, error: pathsError } = await supabase
      .from('learning_paths')
      .select('*, resources(count)')
      .eq('is_active', true)

    if (pathsError) {
      console.error('[learning-paths] paths error:', pathsError.message)
      return NextResponse.json([], { status: 200 })
    }

    // For anonymous users
    if (!user) {
      const anonPaths = (paths || []).map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        category: p.category,
        difficulty: p.difficulty || 'Beginner',
        estimatedTime: p.estimated_time || '4-6 weeks',
        skills: p.skills || [],
        color: p.color || 'bg-blue-500',
        rating: p.rating || 4.5,
        students: Math.floor(Math.random() * 1000) + 500,
        instructor: p.instructor || 'Expert Instructors',
        enrolled: false,
        totalResources: p.resources?.[0]?.count || 0,
        completedResources: 0,
        progress: 0
      }))

      return NextResponse.json(anonPaths, { status: 200 })
    }

    // For authenticated users
    const userId = user.id
    const [enrollResult, progressResult] = await Promise.all([
      supabase.from('user_enrollments')
        .select('learning_path_id, completed_at')
        .eq('user_id', userId),
      supabase.from('user_progress')
        .select('learning_path_id, completed')
        .eq('user_id', userId)
    ])

    const enrollments = enrollResult.data || []
    const progress = progressResult.data || []

    const formattedPaths = (paths || []).map((p) => {
      const enrollment = enrollments.find((e) => e.learning_path_id === p.id)
      const pathProgress = progress.filter((pr) => pr.learning_path_id === p.id)
      const completedCount = pathProgress.filter((pr) => pr.completed === true).length
      const totalCount = p.resources?.[0]?.count || 0
      const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

      return {
        id: p.id,
        title: p.title,
        description: p.description,
        category: p.category,
        difficulty: p.difficulty || 'Beginner',
        estimatedTime: p.estimated_time || '4-6 weeks',
        skills: p.skills || [],
        color: p.color || 'bg-blue-500',
        rating: p.rating || 4.5,
        students: Math.floor(Math.random() * 1000) + 500,
        instructor: p.instructor || 'Expert Instructors',
        enrolled: !!enrollment,
        completed: !!enrollment?.completed_at,
        totalResources: totalCount,
        completedResources: completedCount,
        progress: progressPercent
      }
    })

    return NextResponse.json(formattedPaths, { status: 200 })

  } catch (error) {
    console.error('[learning-paths] unhandled error:', error)
    return NextResponse.json([], { status: 200 })
  }
}
