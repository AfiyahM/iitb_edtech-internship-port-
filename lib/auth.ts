import { supabase } from "./supabase"

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
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile, error } = await supabase.from("users").select("*").eq("id", user.id).single()

    if (error) {
      console.error("Error fetching user profile:", error)
      return null
    }

    return profile
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function updateUserProfile(updates: Partial<UserProfile>): Promise<boolean> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return false

    const { error } = await supabase
      .from("users")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", user.id)

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
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const fileExt = file.name.split(".").pop()
    const fileName = `${user.id}.${fileExt}`

    const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file, { upsert: true })

    if (uploadError) {
      console.error("Error uploading avatar:", uploadError)
      return null
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName)

    return data.publicUrl
  } catch (error) {
    console.error("Error uploading avatar:", error)
    return null
  }
}
