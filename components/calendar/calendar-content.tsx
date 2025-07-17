"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Plus } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { useApi } from "@/hooks/use-api"
import { API_ENDPOINTS } from "@/lib/supabase"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export function CalendarContent() {
  const { hasRole } = useAuth()

  // 🔌 API Integration Point - Connect to your backend in Replit
  const { data: events, loading } = useApi(API_ENDPOINTS.calendar)

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-coot-navy">Calendar</h1>
          <p className="text-gray-600 mt-1">Schedule and track your events</p>
        </div>

        {hasRole(["god", "admin", "manager", "user"]) && (
          <Button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            New Event
          </Button>
        )}
      </div>

      {/* Calendar View - Empty State */}
      <Card className="card-playful">
        <CardHeader>
          <CardTitle className="text-coot-navy">Calendar View</CardTitle>
          <CardDescription>Your scheduled events and deadlines</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-20">
          <Calendar className="w-20 h-20 text-gray-300 mb-6" />
          <h3 className="text-xl font-semibold text-gray-600 mb-3">Calendar coming soon</h3>
          <p className="text-gray-500 text-center mb-6 max-w-lg">
            Connect your backend to display calendar events, task deadlines, and team schedules. The calendar will show
            all your important dates in one place.
          </p>
          <div className="text-xs text-gray-400 bg-gray-50 px-4 py-3 rounded-lg border">
            🔌 API Integration Points:
            <br />• GET {API_ENDPOINTS.calendar}/events - Fetch calendar events
            <br />• POST {API_ENDPOINTS.calendar}/events - Create event
            <br />• GET {API_ENDPOINTS.tasks}?due_date=today - Task deadlines
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
