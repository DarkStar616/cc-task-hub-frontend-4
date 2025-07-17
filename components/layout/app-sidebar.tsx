"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { CootClubLogo } from "@/components/ui/coot-club-logo"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DepartmentSwitcher } from "@/components/department/department-switcher"
import { useTasksCountMock } from "@/hooks/use-tasks-count"
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Clock,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  CheckSquare,
  Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { UserRole } from "@/lib/supabase"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    roles: ["god", "admin", "manager", "user", "guest"] as UserRole[],
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: CheckSquare,
    roles: ["god", "admin", "manager", "user"] as UserRole[],
    showBadge: true,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
    roles: ["god", "admin", "manager", "user"] as UserRole[],
  },
  {
    title: "SOPs",
    url: "/sops",
    icon: FileText,
    roles: ["god", "admin", "manager", "user"] as UserRole[],
  },
  {
    title: "Clock In/Out",
    url: "/clock",
    icon: Clock,
    roles: ["god", "admin", "manager", "user"] as UserRole[],
  },
  {
    title: "Staff Roster",
    url: "/staff-roster",
    icon: Users,
    roles: ["god", "admin", "manager"] as UserRole[],
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
    roles: ["god", "admin", "manager"] as UserRole[],
  },
  {
    title: "Admin",
    url: "/admin",
    icon: Settings,
    roles: ["god", "admin"] as UserRole[],
  },
  {
    title: "Reminders",
    url: "/reminders",
    icon: Bell,
    roles: ["god", "admin", "manager", "user"] as UserRole[],
  },
]

interface AppSidebarProps {
  collapsed: boolean
  mobileOpen: boolean
  onNavigate: () => void
}

export function AppSidebar({ collapsed, mobileOpen, onNavigate }: AppSidebarProps) {
  const { profile, signOut, hasRole } = useAuth()
  const pathname = usePathname()
  const { count: tasksCount, loading: tasksLoading } = useTasksCountMock()

  const filteredItems = navigationItems.filter((item) => hasRole(item.roles))

  return (
    <div className={cn("app-sidebar", collapsed && "collapsed", mobileOpen && "mobile-open")}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200">
        <CootClubLogo className="w-8 h-8 flex-shrink-0" />
        {!collapsed && (
          <div className="min-w-0">
            <h2 className="font-bold text-coot-navy text-lg truncate">Task Hub</h2>
            <p className="text-xs text-gray-500 font-medium truncate">Coot Club</p>
          </div>
        )}
      </div>

      {/* Department Switcher */}
      <div className="border-b border-gray-200">
        <DepartmentSwitcher collapsed={collapsed} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const isActive = pathname === item.url
          return (
            <Link
              key={item.title}
              href={item.url}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                "hover:bg-coot-teal/10 hover:text-coot-teal focus:outline-none focus:ring-2 focus:ring-coot-teal focus:ring-offset-2",
                isActive && "bg-coot-teal/15 text-coot-teal border border-coot-teal/20",
                collapsed && "justify-center",
              )}
              title={collapsed ? item.title : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <span className="font-medium text-sm truncate">{item.title}</span>
                  {item.showBadge && !tasksLoading && (
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-coot-teal/10 text-coot-teal border-coot-teal/20 text-xs px-2 py-0.5"
                    >
                      {tasksCount}
                    </Badge>
                  )}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200">
        <Button
          onClick={signOut}
          variant="ghost"
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700",
            collapsed && "justify-center",
          )}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium text-sm">Sign Out</span>}
        </Button>
      </div>
    </div>
  )
}
