import { createClient } from "@supabase/supabase-js"

// --------------------------------------------------
// 1.  Environment variables (may be undefined in dev)
// --------------------------------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// --------------------------------------------------
// 2.  Create a real client only if both are present
// --------------------------------------------------
function createMockClient() {
  /*  Minimal mock that satisfies the auth calls we use
      while auth is temporarily disabled.              */
  return {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
      signInWithOtp: async () => ({ error: null }),
      signOut: async () => ({ error: null }),
    },
  } as const
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      })
    : (createMockClient() as ReturnType<typeof createMockClient>)

/* ------------------------------------------------------------------
   NOTE:
   • During "Auth Disabled / Mock User" mode, env vars are typically
     missing inside the Vercel build process, which used to throw
     "supabaseUrl is required."
   • The mock client prevents that error while keeping the same
     public API surface (auth.getSession, signInWithOtp, etc.).
   • When you're ready to re-enable Supabase Auth, simply ensure
     the two NEXT_PUBLIC_SUPABASE_* environment variables are set
     and remove the temporary mock logic if desired.
------------------------------------------------------------------- */

// -------------------------
// 3.  Shared helper types
// -------------------------
export type UserRole = "god" | "admin" | "manager" | "user" | "guest"

export interface UserProfile {
  id: string
  email: string
  role: UserRole
  full_name?: string | null
  avatar_url?: string | null
  created_at: string
  updated_at: string
}

// -------------------------
// 4.  API endpoint map
// -------------------------
export const API_ENDPOINTS = {
  auth: "/api/v1/auth",
  users: "/api/v1/users",
  tasks: "/api/v1/tasks",
  sops: "/api/v1/sops",
  analytics: "/api/v1/analytics",
  reminders: "/api/v1/reminders",
  search: "/api/v1/search",
  clock: "/api/v1/clock",
  calendar: "/api/v1/calendar",
} as const

// Helper for domain check (unchanged)
export const isValidCootClubEmail = (email: string): boolean => email.endsWith("@cootclub.com")
