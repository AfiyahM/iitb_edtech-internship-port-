import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Await params in Next.js 15+
    const { id: learningPathId } = await params
    console.log('[enroll] Starting enrollment process for path:', learningPathId)
    
    const cookieStore = cookies()
const supabase = createRouteHandlerClient({ 
  cookies: () => cookieStore 
})
    // Check authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('[enroll] Auth error:', userError)
      return NextResponse.json({ 
        error: 'Authentication failed',
        details: userError.message 
      }, { status: 401 })
    }
    
    if (!user) {
      console.error('[enroll] No user found')
      return NextResponse.json({ 
        error: 'User not authenticated' 
      }, { status: 401 })
    }

    console.log('[enroll] User authenticated:', user.id)
    const userId = user.id

    // Validate learning path exists
    const { data: learningPath, error: pathError } = await supabase
      .from('learning_paths')
      .select('id, title')
      .eq('id', learningPathId)
      .single()

    if (pathError || !learningPath) {
      console.error('[enroll] Learning path not found:', pathError)
      return NextResponse.json({ 
        error: 'Learning path not found',
        details: pathError?.message 
      }, { status: 404 })
    }

    // Check if already enrolled
    const { data: existingEnrollment, error: checkError } = await supabase
      .from('user_enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('learning_path_id', learningPathId)
      .maybeSingle()

    if (checkError) {
      console.error('[enroll] Error checking enrollment:', checkError)
      return NextResponse.json({ 
        error: 'Database error',
        details: checkError.message 
      }, { status: 500 })
    }

    if (existingEnrollment) {
      console.log('[enroll] User already enrolled')
      return NextResponse.json({ 
        success: true,
        message: 'Already enrolled',
        enrolled: true 
      }, { status: 200 })
    }

    // Create enrollment
    const { data: enrollment, error: enrollError } = await supabase
      .from('user_enrollments')
      .insert({
        user_id: userId,
        learning_path_id: learningPathId,
        enrolled_at: new Date().toISOString()
      })
      .select()
      .single()

    if (enrollError) {
      console.error('[enroll] Insert error:', enrollError)
      return NextResponse.json({ 
        error: 'Failed to create enrollment',
        details: enrollError.message,
        code: enrollError.code 
      }, { status: 500 })
    }

    console.log('[enroll] Enrollment successful:', enrollment)
    
    return NextResponse.json({ 
      success: true,
      message: 'Successfully enrolled',
      enrolled: true,
      enrollment 
    }, { status: 201 })

  } catch (error) {
    console.error('[enroll] Unhandled error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
