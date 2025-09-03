import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
  
  try {
    const { data: recentResources } = await supabase
      .from('resources')
      .select('created_at, title')
      .order('created_at', { ascending: false })
      .limit(5)
    
    const lastUpdate = recentResources?.[0]?.created_at
    const hoursOld = lastUpdate ? 
      (Date.now() - new Date(lastUpdate).getTime()) / (1000 * 60 * 60) : 999
    
    return NextResponse.json({
      lastUpdate,
      hoursOld: Math.round(hoursOld),
      status: hoursOld < 25 ? 'healthy' : 'stale',
      recentVideos: recentResources?.length || 0,
      lastVideos: recentResources?.map(r => r.title.substring(0, 50)) || []
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check status' }, { status: 500 })
  }
}
