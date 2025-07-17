"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TeamStatusCard } from "./team-status-card"
import { Clock, Play, Square, Timer, AlertTriangle, RefreshCw, Shield, LogIn } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { useDepartment } from "@/components/department/department-provider"
import { useClockSessions, clockIn, clockOut } from "@/hooks/use-clock-sessions"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export function ClockContent() {
  const { profile } = useAuth()
  const { department } = useDepartment()
  const { toast } = useToast()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isMutating, setIsMutating] = useState(false)

  // Determine user roles
  const isGuest = profile?.role === "Guest" || !profile?.role
  const isUser = ["User", "Manager", "Admin", "God"].includes(profile?.role || "")
  const isManagerPlus = ["Manager", "Admin", "God"].includes(profile?.role || "")

  // Personal clock sessions (only for users who can clock)
  const { data, isLoading, error, refetch, currentSession, sessions, totalHoursToday } = useClockSessions(
    isUser ? profile?.id : undefined,
    {
      today: true,
    },
  )

  // Team sessions for managers+ (optional)
  const {
    data: teamData,
    isLoading: teamLoading,
    teamStatus,
  } = useClockSessions(undefined, {
    today: true,
    department: department || undefined,
    includeTeam: isManagerPlus,
  })

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleClockIn = async () => {
    if (!profile?.id || isMutating || !isUser) return

    try {
      setIsMutating(true)
      await clockIn(profile.id)

      toast({
        title: "Clocked In Successfully! 🎯",
        description: `Welcome back, ${profile?.full_name?.split(" ")[0]}! Have a productive day.`,
      })

      // Refetch sessions to update UI
      await refetch()
    } catch (error) {
      toast({
        title: "Clock In Failed",
        description: error instanceof Error ? error.message : "Couldn't clock in – please try again.",
        variant: "destructive",
      })
    } finally {
      setIsMutating(false)
    }
  }

  const handleClockOut = async () => {
    if (!currentSession?.id || isMutating || !isUser) return

    try {
      setIsMutating(true)
      await clockOut(currentSession.id)

      toast({
        title: "Clocked Out Successfully! 👋",
        description: "Great work today! See you tomorrow.",
      })

      // Refetch sessions to update UI
      await refetch()
    } catch (error) {
      toast({
        title: "Clock Out Failed",
        description: error instanceof Error ? error.message : "Couldn't clock out – please try again.",
        variant: "destructive",
      })
    } finally {
      setIsMutating(false)
    }
  }

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "0h"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const getWorkingDuration = () => {
    if (!currentSession?.clock_in_time) return "0h"
    const clockInTime = new Date(currentSession.clock_in_time)
    const now = new Date()
    const durationMs = now.getTime() - clockInTime.getTime()
    const durationMinutes = Math.floor(durationMs / (1000 * 60))
    return formatDuration(durationMinutes)
  }

  // Guest access restriction
  if (isGuest) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-coot-navy">Time Clock</h1>
          <p className="text-gray-600 mt-1">Track your work hours</p>
        </div>

        <Alert className="border-amber-200 bg-amber-50">
          <LogIn className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Access Required:</strong> Please log in with a valid account to access the Time Clock. Contact your
            administrator if you need help with your account.
          </AlertDescription>
        </Alert>

        <Card className="card-playful">
          <CardContent className="p-8 text-center">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <div className="text-5xl font-bold text-gray-400 mb-2 font-mono">
              {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
            <div className="text-lg text-gray-500 mb-8">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <p className="text-gray-500">Please log in to use the time clock</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-coot-navy">Time Clock</h1>
        <p className="text-gray-600 mt-1">Track your work hours</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Couldn't load your time entries. Please refresh.
            <Button
              variant="ghost"
              size="sm"
              onClick={refetch}
              className="ml-2 h-auto p-1 text-destructive hover:text-destructive"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Current Status */}
      {!isLoading && currentSession && isUser && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium text-green-800">
                You are clocked in since {formatTime(currentSession.clock_in_time)}
              </span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Time & Actions */}
      <Card className="card-playful">
        <CardContent className="p-8 text-center">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="w-16 h-16 rounded-full mx-auto" />
              <Skeleton className="h-12 w-48 mx-auto" />
              <Skeleton className="h-6 w-64 mx-auto" />
              <Skeleton className="h-12 w-32 mx-auto" />
            </div>
          ) : (
            <>
              <Clock className="w-16 h-16 text-coot-teal mx-auto mb-6" />
              <div className="text-5xl font-bold text-coot-navy mb-2 font-mono">
                {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
              <div className="text-lg text-gray-600 mb-8">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              <div className="flex gap-4 justify-center">
                {isUser && (
                  <>
                    {!currentSession ? (
                      <Button
                        onClick={handleClockIn}
                        disabled={isMutating || isLoading}
                        className={cn(
                          "btn-primary text-lg px-8 py-4 h-auto",
                          !isMutating && "animate-pulse hover:animate-none hover:scale-105 transition-all duration-200",
                        )}
                      >
                        {isMutating ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-3" />
                            Clocking In...
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5 mr-3" />
                            Clock In
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleClockOut}
                        disabled={isMutating || isLoading}
                        variant="outline"
                        className={cn(
                          "btn-secondary text-lg px-8 py-4 h-auto border-2",
                          !isMutating && "hover:scale-105 transition-all duration-200",
                        )}
                      >
                        {isMutating ? (
                          <>
                            <LoadingSpinner size="sm" className="mr-3" />
                            Clocking Out...
                          </>
                        ) : (
                          <>
                            <Square className="w-5 h-5 mr-3" />
                            Clock Out
                          </>
                        )}
                      </Button>
                    )}
                  </>
                )}

                {!isUser && (
                  <div className="text-gray-500 text-center">
                    <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Only logged-in users can clock in/out.</p>
                    <p className="text-sm">Contact your administrator for access.</p>
                  </div>
                )}
              </div>

              {currentSession && isUser && (
                <div className="mt-6 p-4 bg-coot-teal/10 rounded-xl">
                  <div className="flex items-center justify-center gap-2 text-coot-teal">
                    <Timer className="w-4 h-4" />
                    <span className="font-medium">
                      Working for {getWorkingDuration()} since {formatTime(currentSession.clock_in_time)}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Team Status - Only for Managers+ */}
      {isManagerPlus && <TeamStatusCard teamStatus={teamStatus} isLoading={teamLoading} />}

      {/* Time Entries - Only for users who can clock */}
      {isUser && (
        <Card className="card-playful">
          <CardHeader>
            <CardTitle className="text-coot-navy">Recent Time Entries</CardTitle>
            <CardDescription>Your clock in/out history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-2 h-2 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-12 rounded-full" />
                  </div>
                ))}
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No time entries yet</p>
                <p className="text-sm">Clock in to start tracking your time</p>
              </div>
            ) : (
              sessions.map((session, index) => {
                const isToday = new Date(session.clock_in_time).toDateString() === new Date().toDateString()
                const isYesterday =
                  new Date(session.clock_in_time).toDateString() ===
                  new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()

                let dateLabel = new Date(session.clock_in_time).toLocaleDateString()
                if (isToday) dateLabel = "Today"
                else if (isYesterday) dateLabel = "Yesterday"

                return (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          session.status === "active" ? "bg-green-500 animate-pulse" : "bg-coot-teal",
                        )}
                      />
                      <div>
                        <p className="font-medium text-sm">{dateLabel}</p>
                        <p className="text-xs text-gray-500">
                          {formatTime(session.clock_in_time)} -{" "}
                          {session.clock_out_time ? formatTime(session.clock_out_time) : "Still working"}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn(
                        session.status === "active" ? "bg-green-100 text-green-800" : "bg-coot-teal/10 text-coot-teal",
                      )}
                    >
                      {session.status === "active" ? getWorkingDuration() : formatDuration(session.duration_minutes)}
                    </Badge>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      )}

      {/* Mobile FAB - Only for users who can clock */}
      {isUser && (
        <div className="fixed bottom-6 right-6 lg:hidden">
          <Button
            onClick={currentSession ? handleClockOut : handleClockIn}
            disabled={isMutating || isLoading}
            size="lg"
            className={cn(
              "w-16 h-16 rounded-full shadow-lg",
              currentSession ? "bg-red-500 hover:bg-red-600" : "btn-primary",
              !isMutating && !isLoading && "animate-bounce hover:animate-none",
            )}
          >
            {isMutating ? (
              <LoadingSpinner size="sm" />
            ) : currentSession ? (
              <Square className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
