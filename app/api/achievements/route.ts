import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // ✅ Correct way: Pass cookies function directly
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { user } } = await supabase.auth.getUser()
    
    // Mock achievements data
    const achievements = [
      {
        id: "1",
        title: "First Steps",
        description: "Complete your first video",
        icon: "Play",
        color: "text-blue-600",
        earned: true,
        progress: 100
      },
      {
        id: "2",
        title: "Dedicated Learner", 
        description: "Watch 5 hours of content",
        icon: "Clock",
        color: "text-purple-600",
        earned: false,
        progress: 40,
        requirement: "Watch 5 hours of content"
      }
    ]
    
    return NextResponse.json(achievements)
  } catch (error) {
  if (error instanceof Error) {
    console.error('API Error:', error.message)
    return NextResponse.json({ error: 'Failed to fetch data', details: error.message }, { status: 500 })
  } else {
    console.error('Unknown error:', error)
    return NextResponse.json({ error: 'Unknown server error' }, { status: 500 })
  }
}

}
