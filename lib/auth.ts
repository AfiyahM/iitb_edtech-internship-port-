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

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session || !session.user) {
      console.error("Session error:", sessionError)
      return null
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle()

    if (error) {
      console.error("Profile fetch error:", error)
      return null
    }

    return data
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
      .from("profiles") // ✅ fixed table name
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

    const fileExt = file.name.split(".").pop()
    const fileName = `${session.user.id}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true })

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
