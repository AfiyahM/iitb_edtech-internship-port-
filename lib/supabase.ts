import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
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
