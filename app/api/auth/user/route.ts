import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookieStore = cookies()
const supabase = createRouteHandlerClient({ 
  cookies: () => cookieStore 
})

    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return NextResponse.json({ 
        authenticated: false, 
        error: error?.message || 'No user'
      }, { status: 401 })
    }

    return NextResponse.json({ 
      authenticated: true, 
      user: { 
        id: user.id, 
        email: user.email 
      }
    })
  } catch (error) {
    return NextResponse.json({ 
      authenticated: false, 
      error: 'Server error' 
    }, { status: 500 })
  }
}
