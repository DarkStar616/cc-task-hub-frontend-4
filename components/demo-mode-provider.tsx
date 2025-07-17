"use client"

import type React from "react"

import { useAuth } from "@/components/auth/auth-provider"
import { RoleSwitcher } from "@/components/ui/role-switcher"

export function DemoModeProvider({ children }: { children: React.ReactNode }) {
  const { profile, switchRole } = useAuth()

  return (
    <>
      {children}
      <RoleSwitcher currentRole={profile?.role || "manager"} onRoleChange={switchRole} />
    </>
  )
}
