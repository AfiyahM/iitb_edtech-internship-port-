import { createClient } from "@supabase/supabase-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
//import type { Database } from "@/types/database"

// ✅ Use environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Singleton Supabase Client wrapper
class SupabaseClient {
  private static instance: ReturnType<typeof createClientComponentClient<Database>> | null = null

  public static getInstance() {
    if (!SupabaseClient.instance) {
      // For client-side components (uses Next.js auth helpers + cookies)
      SupabaseClient.instance = createClientComponentClient<Database>()
      
      // 👉 If you only need anon/public access without auth, use:
      // SupabaseClient.instance = createClient<Database>(supabaseUrl, supabaseAnonKey)
    }
    return SupabaseClient.instance
  }
}

// ✅ Export singleton instance
export const supabase = SupabaseClient.getInstance()
export type Database = {
  public: {
    Tables: Record<string, unknown>
    Views: Record<string, unknown>
    Functions: Record<string, unknown>
    Enums: Record<string, unknown>
  }
}

// ---------------- Types ----------------
export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  university: string
  major: string
  graduation_year: string
  career_goal: string
  created_at: string
  updated_at: string
}

export interface Internship {
  id: string
  title: string
  company: string
  location: string
  type: string
  duration: string
  salary: string
  description: string
  requirements: string[]
  skills: string[]
  posted_date: string
  application_deadline: string
  created_at: string
}

export interface Application {
  id: string
  user_id: string
  internship_id: string
  status: "pending" | "accepted" | "rejected" | "interview"
  applied_date: string
  notes: string
  created_at: string
}

export interface Resume {
  id: string
  user_id: string
  content: any // JSON content of the resume
  score: number
  feedback: string[]
  created_at: string
  updated_at: string
}

export interface MockInterview {
  id: string
  user_id: string
  type: "technical" | "behavioral" | "system_design"
  questions: any[]
  responses: any[]
  score: number
  feedback: string
  duration: number
  completed_at: string
  created_at: string
}
