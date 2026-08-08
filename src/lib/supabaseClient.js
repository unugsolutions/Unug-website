// Supabase client singleton shared across the app. Credentials come from env vars.
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "Supabase credentials are missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY) to your .env.local file."
  )
}

export const supabase = createClient(supabaseUrl || "http://localhost:54321", supabaseKey || "")
