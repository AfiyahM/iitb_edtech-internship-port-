import { supabase } from "@/lib/supabaseClient"

export interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  university: string
  major: string
  graduation_year: string
  career_goal: string
  avatar_url?: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  bio?: string
  skills: string[]
  created_at: string
  updated_at: string
}

export async function signInWithGoogle(): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Starting Google sign-in process...')
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      console.error('Google sign-in error:', error)
      return { success: false, error: error.message }
    }

    console.log('Google sign-in initiated successfully:', data)
    return { success: true }
  } catch (error) {
    console.error('Google sign-in error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Sign-out error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Sign-out error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error || !session) {
      return null
    }

    // Get user profile from users table
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single()

    if (userError || !user) {
      console.error("Error fetching user profile:", userError)
      return null
    }

    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      university: user.university,
      major: user.major,
      graduation_year: user.graduation_year,
      career_goal: user.career_goal,
      skills: user.skills || [],
      avatar_url: user.avatar_url,
      phone: user.phone,
      location: user.location,
      bio: user.bio,
      linkedin: user.linkedin,
      github: user.github,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function updateUserProfile(updates: Partial<UserProfile>): Promise<boolean> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) return false

    const { error } = await supabase
      .from("users")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", session.user.id)

    if (error) {
      console.error("Error updating user profile:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error updating user profile:", error)
    return false
  }
}

export async function uploadAvatar(file: File): Promise<string | null> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) return null

    // Basic validations
    const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10MB
    if (file.size > MAX_FILE_SIZE_BYTES) {
      console.error("Error uploading avatar: file exceeds 10MB limit")
      return null
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      console.error("Error uploading avatar: unsupported image type", file.type)
      return null
    }

    const fileExt = file.name.split(".").pop()
    const fileName = `${session.user.id}/avatar.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true, contentType: file.type, cacheControl: "3600" })

    if (uploadError) {
      console.error("Error uploading avatar:", uploadError)
      return null
    }

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName)

    return data.publicUrl
  } catch (error) {
    console.error("Error uploading avatar:", error)
    return null
  }
}
