"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, User, LogOut, Clock, Menu } from "lucide-react"
import { cn } from "@/lib/utils"

const roleColors = {
  god: "bg-coot-red text-white",
  admin: "bg-coot-teal text-white",
  manager: "bg-coot-navy text-white",
  user: "bg-coot-yellow text-coot-navy",
  guest: "bg-white text-coot-navy border border-gray-300",
} as const

const roleLabels = {
  god: "God",
  admin: "Admin",
  manager: "Manager",
  user: "User",
  guest: "Guest",
} as const

interface TopNavigationProps {
  onToggleSidebar: () => void
}

export function TopNavigation({ onToggleSidebar }: TopNavigationProps) {
  const router = useRouter()
  const { profile, signOut, hasRole } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [isClockedIn] = useState(true) // Mock clocked in state

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    console.log("Searching for:", searchQuery)
  }

  const canSearch = hasRole(["god", "admin"])

  return (
    <header className="app-header">
      <div className="flex h-full items-center gap-4 px-4">
        {/* Sidebar Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="h-9 w-9 p-0 hover:bg-gray-100 focus:ring-2 focus:ring-coot-teal"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="flex-1 flex items-center gap-4">
          {canSearch && (
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="search"
                  placeholder="Search tasks, SOPs, users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9 text-sm rounded-lg border-gray-200 focus:border-coot-teal focus:ring-coot-teal"
                  aria-label="Global search"
                />
              </div>
            </form>
          )}
        </div>

        <div className="flex items-center gap-3">
          {profile && (
            <>
              {/* Role Badge with Status Dot */}
              <div className="relative">
                <Badge
                  variant="secondary"
                  className={cn(roleColors[profile.role], "font-medium px-3 py-1 rounded-full text-xs shadow-sm")}
                >
                  {roleLabels[profile.role]}
                </Badge>
                {isClockedIn && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-white animate-pulse" />
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full focus-visible ring-2 ring-coot-teal ring-offset-2"
                    aria-label="User menu"
                  >
                    <Avatar className="h-9 w-9 border border-gray-200">
                      <AvatarImage
                        src={profile.avatar_url || "/placeholder.svg"}
                        alt={profile.full_name || profile.email}
                      />
                      <AvatarFallback className="bg-coot-teal text-white font-semibold text-xs">
                        {profile.full_name
                          ? profile.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : profile.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isClockedIn && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white flex items-center justify-center">
                        <Clock className="w-1.5 h-1.5 text-white" />
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">
                      {profile?.full_name || "User"}
                      <span className="text-xs text-orange-500 ml-2">(Mock Mode)</span>
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">{profile?.email}</p>
                    {isClockedIn && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <span className="text-xs text-green-600 font-medium">Clocked In</span>
                      </div>
                    )}
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => router.push("/profile")} className="focus-visible">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={async () => {
                      await signOut()
                      router.push("/login")
                    }}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 focus-visible"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
