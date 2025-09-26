import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  avatar_url?: string
  university?: string
  major?: string
  skills?: string[]
  profile_completion: number
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const supabase = createClientComponentClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  // Calculate profile completion percentage
  let completion = 0
  const fields = [
    data.first_name,
    data.last_name,
    data.university,
    data.major,
    data.skills?.length > 0,
    data.avatar_url
  ]
  
  const completedFields = fields.filter(Boolean).length
  completion = Math.round((completedFields / fields.length) * 100)

  return {
    ...data,
    profile_completion: completion
  }
}

export const getUserStats = async (userId: string) => {
  const supabase = createClientComponentClient()
  
  // Get application count
  const { count: applicationCount } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  // Get interview count
  const { count: interviewCount } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'interview')

  // Get saved internships count
  const { count: savedCount } = await supabase
    .from('saved_internships')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  return {
    applications: applicationCount || 0,
    interviews: interviewCount || 0,
    saved: savedCount || 0
  }
}