import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    // 1. Get the authenticated user's session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    // 2. Get the full resume data object from the request
    const resumeData = await req.json();

    // 3. Perform an "upsert" on your 'resumes' table.
    // This will create a new row if one doesn't exist for the user,
    // or update the existing one if it does.
    const { error: resumeSaveError } = await supabase
      .from('resumes')
      .upsert(
        {
          user_id: userId,
          content: resumeData, // Store the whole object in the 'content' jsonb column
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' } // Use the user_id as the conflict target for the upsert
      );

    if (resumeSaveError) {
      // If there's an error, throw it to be caught by the catch block
      throw resumeSaveError;
    }

    // 4. Also update the main 'profiles' table with some key details
    // This is useful for displaying user info elsewhere in your app without parsing the JSON
    const { personal, education } = resumeData;
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        first_name: personal.firstName,
        last_name: personal.lastName,
        email: personal.email,
        phone: personal.phone,
        location: personal.location,
        linkedin: personal.linkedin,
        github: personal.github,
        university: education.university,
        major: education.major,
        graduation_year: education.graduation,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (profileError) {
      // Log this error but don't fail the whole request, as the main resume data was saved.
      console.error('Could not update profile table:', profileError);
    }

    return NextResponse.json({ success: true, message: 'Resume saved successfully!' });

  } catch (error: any) {
    console.error('Error saving resume:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
}