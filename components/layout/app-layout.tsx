"use client"

import type React from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { AppSidebar } from "./app-sidebar"
import { TopNavigation } from "./top-navigation"
import { OnboardingMessage } from "./onboarding-message"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { profile } = useAuth()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Show onboarding message for new sessions
    const hasSeenOnboarding = sessionStorage.getItem("hasSeenOnboarding")
    if (!hasSeenOnboarding && profile) {
      setShowOnboarding(true)
      sessionStorage.setItem("hasSeenOnboarding", "true")
    }

    // Check if mobile and set initial sidebar state
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) {
        setSidebarCollapsed(true)
        setSidebarMobileOpen(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [profile])

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarMobileOpen(!sidebarMobileOpen)
    } else {
      setSidebarCollapsed(!sidebarCollapsed)
    }
  }

  const closeMobileSidebar = () => {
    if (isMobile) {
      setSidebarMobileOpen(false)
    }
  }

  return (
    <div className="app-layout">
      <AppSidebar collapsed={sidebarCollapsed} mobileOpen={sidebarMobileOpen} onNavigate={closeMobileSidebar} />

      {/* Mobile overlay */}
      {isMobile && sidebarMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={closeMobileSidebar} />
      )}

      <div className={cn("app-main", sidebarCollapsed && "sidebar-collapsed")}>
        <TopNavigation onToggleSidebar={toggleSidebar} />
        <main className="app-content">
          <div className="container-responsive">
            {showOnboarding && <OnboardingMessage onClose={() => setShowOnboarding(false)} />}
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
