import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data: resources, error } = await supabase
      .from('resources')
      .select(`
        *,
        user_progress!left(completed, watch_time)
      `)
      .eq('learning_path_id', params.id)
      .order('order_index')
    
    if (error) throw error
    
    // Add completion status for current user
    const resourcesWithProgress = resources?.map(resource => ({
      ...resource,
      completed: user ? resource.user_progress?.some((p: any) => p.completed) : false,
      watchTime: user ? resource.user_progress?.[0]?.watch_time || 0 : 0,
      user_progress: undefined, // Remove from response
    }))
    
    return NextResponse.json(resourcesWithProgress)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 })
  }
}
