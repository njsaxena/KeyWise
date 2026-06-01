import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Lazy initialization to prevent build-time errors
let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local"
    );
  }
  
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  }
  
  return supabaseInstance;
}

export function createServerSupabaseClient(): SupabaseClient {
  if (!supabaseUrl) {
    throw new Error(
      "Missing Supabase URL. Ensure NEXT_PUBLIC_SUPABASE_URL is set in your .env.local"
    );
  }

  if (!supabaseServiceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Set it in your .env.local for server-side Supabase operations."
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey as string, {
    auth: {
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
