import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.id
    const { resourceId, learningPathId, completed, watchTime, lastPosition } = await request.json()

    const { data: progress, error } = await supabase.from('user_progress').upsert({
      user_id: userId,
      resource_id: resourceId,
      learning_path_id: learningPathId,
      completed,
      watch_time: watchTime,
      last_position: lastPosition || 0,
      completed_at: completed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    }).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Optional: add logic for awarding points/achievements here

    return NextResponse.json({ success: true, progress })
  } catch (error) {
    console.error('Progress API error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
