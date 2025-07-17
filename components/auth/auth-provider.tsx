"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { User } from "@supabase/supabase-js"
import type { UserProfile, UserRole } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
  hasRole: (roles: UserRole[]) => boolean
  switchRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>("manager")

  // Mock user data for development - role can be switched for demo
  const mockUser: User = {
    id: "mock-user-123",
    email: "demo@cootclub.com",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    aud: "authenticated",
    role: "authenticated",
    user_metadata: {
      full_name: "Demo User",
      role: currentRole,
    },
    app_metadata: {},
    identities: [],
    email_confirmed_at: new Date().toISOString(),
    phone_confirmed_at: null,
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    recovery_sent_at: null,
    new_email: null,
    invited_at: null,
    action_link: null,
    email_change_sent_at: null,
    new_phone: null,
    phone_change_sent_at: null,
    phone: null,
    is_anonymous: false,
  }

  const mockProfile: UserProfile = {
    id: "mock-user-123",
    email: "demo@cootclub.com",
    role: currentRole,
    full_name: "Demo User",
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const signOut = async () => {
    console.log("🚫 Mock sign out - Auth temporarily disabled")
  }

  const hasRole = (roles: UserRole[]): boolean => {
    return roles.includes(currentRole)
  }

  const switchRole = (role: UserRole) => {
    setCurrentRole(role)
  }

  const value = {
    user: mockUser,
    profile: mockProfile,
    loading: false,
    signOut,
    hasRole,
    switchRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
