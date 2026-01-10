import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
  || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 
  || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
  || ''

// Debug logging (will show in browser console)
if (typeof window !== 'undefined') {
  console.log('Supabase URL configured:', !!supabaseUrl);
  console.log('Supabase Key configured:', !!supabaseAnonKey);
}

// Create client only if credentials are provided
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const isSupabaseConfigured = () => !!(supabaseUrl && supabaseAnonKey && supabase)
