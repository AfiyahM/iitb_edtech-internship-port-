import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error('Supabase URL and ANON key must be set in environment variables')
}

export const supabaseServer = createClient(url, anonKey)

export default supabaseServer
