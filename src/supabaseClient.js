import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'VITE_SUPABASE_URL atau VITE_SUPABASE_ANON_KEY belum diatur. Cek file .env kamu.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
