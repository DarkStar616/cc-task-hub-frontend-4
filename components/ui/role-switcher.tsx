"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Settings, Crown, Shield, Users, User, Eye } from "lucide-react"
import type { UserRole } from "@/lib/supabase"

interface RoleSwitcherProps {
  currentRole: UserRole
  onRoleChange: (role: UserRole) => void
}

const roleConfig = {
  god: { label: "God", icon: Crown, color: "bg-coot-red text-white" },
  admin: { label: "Admin", icon: Shield, color: "bg-coot-teal text-white" },
  manager: { label: "Manager", icon: Users, color: "bg-coot-navy text-white" },
  user: { label: "User", icon: User, color: "bg-coot-yellow text-coot-navy" },
  guest: { label: "Guest", icon: Eye, color: "bg-white text-coot-navy border border-gray-300" },
}

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)

  const CurrentIcon = roleConfig[currentRole].icon

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-white shadow-lg border-2 border-orange-200 hover:border-orange-300">
            <Settings className="w-4 h-4 mr-2" />
            <span className="text-sm">Demo Role:</span>
            <Badge className={`ml-2 ${roleConfig[currentRole].color}`}>
              <CurrentIcon className="w-3 h-3 mr-1" />
              {roleConfig[currentRole].label}
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {Object.entries(roleConfig).map(([role, config]) => {
            const Icon = config.icon
            return (
              <DropdownMenuItem
                key={role}
                onClick={() => {
                  onRoleChange(role as UserRole)
                  setIsOpen(false)
                }}
                className={currentRole === role ? "bg-gray-100" : ""}
              >
                <Icon className="w-4 h-4 mr-2" />
                <span>{config.label}</span>
                {currentRole === role && <span className="ml-auto text-xs">✓</span>}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
