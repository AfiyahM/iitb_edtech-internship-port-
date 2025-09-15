import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    // Get all resources for this learning path
    const { data: resources, error } = await supabase
      .from('resources')
      .select('*')
      .eq('learning_path_id', params.id)
      .order('order_index', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // If user is authenticated, get their progress
    if (user) {
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('resource_id, completed, watch_time')
        .eq('user_id', user.id)
        .eq('learning_path_id', params.id)

      // Merge progress with resources
      const resourcesWithProgress = resources?.map(resource => {
        const progress = progressData?.find(p => p.resource_id === resource.id)
        return {
          ...resource,
          completed: progress?.completed || false,
          watchTime: progress?.watch_time || 0
        }
      })

      return NextResponse.json(resourcesWithProgress || [])
    }

    return NextResponse.json(resources || [])
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
