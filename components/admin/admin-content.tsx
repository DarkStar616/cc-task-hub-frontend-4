"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Users, Database, Shield } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { useApi } from "@/hooks/use-api"
import { API_ENDPOINTS } from "@/lib/supabase"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export function AdminContent() {
  const { hasRole } = useAuth()

  // 🔌 API Integration Point - Connect to your backend in Replit
  const { data: adminData, loading } = useApi(`${API_ENDPOINTS.users}/admin`)

  if (!hasRole(["god", "admin"])) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Access Restricted</h3>
          <p className="text-gray-500">Admin panel is available for administrators only.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-coot-navy">Admin Panel</h1>
        <p className="text-gray-600 mt-1">System administration and user management</p>
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "User Management", icon: Users, description: "Manage users and roles" },
          { title: "System Settings", icon: Settings, description: "Configure system preferences" },
          { title: "Data Management", icon: Database, description: "Backup and data operations" },
        ].map((action) => (
          <Card key={action.title} className="card-playful">
            <CardHeader>
              <CardTitle className="text-coot-navy flex items-center gap-2">
                <action.icon className="w-5 h-5" />
                {action.title}
              </CardTitle>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Database className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-500 text-center text-sm mb-4">No admin data available yet</p>
              <Button variant="outline" className="btn-secondary" disabled>
                Configure
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Admin Dashboard - Empty State */}
      <Card className="card-playful">
        <CardHeader>
          <CardTitle className="text-coot-navy">System Overview</CardTitle>
          <CardDescription>System status and administrative controls</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Settings className="w-16 h-16 text-gray-300 mb-6" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Admin features coming soon</h3>
          <p className="text-gray-500 text-center mb-6 max-w-md">
            Connect your backend to access user management, system configuration, and administrative tools.
          </p>
          <div className="text-xs text-gray-400 bg-gray-50 px-4 py-3 rounded-lg border">
            🔌 API Integration Points:
            <br />• GET {API_ENDPOINTS.users} - User management
            <br />• POST {API_ENDPOINTS.users} - Create user
            <br />• PUT {API_ENDPOINTS.users}/[id]/role - Update user role
            <br />• GET /api/v1/system/settings - System configuration
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
