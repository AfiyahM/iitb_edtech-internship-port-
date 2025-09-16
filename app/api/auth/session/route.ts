import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    // This will refresh the session if it exists
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return NextResponse.json(
        { error: 'No active session' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      session: {
        user: {
          id: session.user.id,
          email: session.user.email,
        },
        expires: session.expires_at
      }
    });
  } catch (error) {
    console.error('Session refresh error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh session' },
      { status: 500 }
    );
  }
}
