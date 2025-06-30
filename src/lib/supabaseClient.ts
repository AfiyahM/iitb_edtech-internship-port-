import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zooismbsebfafvyvcmbu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpvb2lzbWJzZWJmYWZ2eXZjbWJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NjEzMjgsImV4cCI6MjA2NjQzNzMyOH0.lOEjuCscNoaUoU-vcUMgL2JZCUCX2N2ai-X4B7_Kcqk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
