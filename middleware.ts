import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - critical for maintaining auth state
  const { data: { session } } = await supabase.auth.getSession()
  
  console.log('🔗 Middleware auth check:', { 
    path: req.nextUrl.pathname, 
    hasSession: !!session 
  })

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/learning-paths/:path*/enroll'
  ]
}
