"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export interface ClockSession {
  id: string
  user_id: string
  user_name?: string
  user_avatar?: string
  clock_in_time: string
  clock_out_time?: string
  duration_minutes?: number
  status: "active" | "completed"
  created_at: string
  updated_at: string
}

export interface ClockSessionsResponse {
  sessions: ClockSession[]
  current_session?: ClockSession
  total_hours_today: number
  team_status?: TeamMemberStatus[]
}

export interface TeamMemberStatus {
  user_id: string
  user_name: string
  user_avatar?: string
  department: string
  current_session?: ClockSession
  status: "clocked_in" | "clocked_out"
  clock_in_time?: string
  working_duration?: number
}

export interface ClockSessionsOptions {
  today?: boolean
  department?: string
  includeTeam?: boolean
}

export function useClockSessions(userId?: string, options: ClockSessionsOptions = {}) {
  const [data, setData] = useState<ClockSessionsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchSessions = async () => {
    if (!userId && !options.includeTeam) return

    try {
      setIsLoading(true)
      setError(null)

      // TODO: Replace with actual API call
      // const params = new URLSearchParams()
      // if (userId) params.append('user_id', userId)
      // if (options.today) params.append('today', 'true')
      // if (options.department) params.append('department', options.department)
      // if (options.includeTeam) params.append('include_team', 'true')
      // const response = await fetch(`/api/v1/clock_sessions?${params}`)
      // if (!response.ok) throw new Error('Failed to fetch sessions')
      // const data = await response.json()

      // Mock API simulation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockTeamStatus: TeamMemberStatus[] = options.includeTeam
        ? [
            {
              user_id: "user_1",
              user_name: "Alice Johnson",
              user_avatar: "/placeholder-user.jpg",
              department: "Housekeeping",
              status: "clocked_in",
              clock_in_time: "2024-01-09T08:30:00Z",
              working_duration: 120, // 2 hours
              current_session: {
                id: "session_alice",
                user_id: "user_1",
                user_name: "Alice Johnson",
                clock_in_time: "2024-01-09T08:30:00Z",
                status: "active",
                created_at: "2024-01-09T08:30:00Z",
                updated_at: "2024-01-09T08:30:00Z",
              },
            },
            {
              user_id: "user_2",
              user_name: "Bob Smith",
              user_avatar: "/placeholder-user.jpg",
              department: "Front-of-House",
              status: "clocked_out",
            },
            {
              user_id: "user_3",
              user_name: "Carol Davis",
              user_avatar: "/placeholder-user.jpg",
              department: "Kitchen",
              status: "clocked_in",
              clock_in_time: "2024-01-09T09:00:00Z",
              working_duration: 90, // 1.5 hours
              current_session: {
                id: "session_carol",
                user_id: "user_3",
                user_name: "Carol Davis",
                clock_in_time: "2024-01-09T09:00:00Z",
                status: "active",
                created_at: "2024-01-09T09:00:00Z",
                updated_at: "2024-01-09T09:00:00Z",
              },
            },
            {
              user_id: "user_4",
              user_name: "David Wilson",
              user_avatar: "/placeholder-user.jpg",
              department: "Maintenance",
              status: "clocked_out",
            },
            {
              user_id: "user_5",
              user_name: "Emma Brown",
              user_avatar: "/placeholder-user.jpg",
              department: "Front-of-House",
              status: "clocked_in",
              clock_in_time: "2024-01-09T07:45:00Z",
              working_duration: 165, // 2.75 hours
              current_session: {
                id: "session_emma",
                user_id: "user_5",
                user_name: "Emma Brown",
                clock_in_time: "2024-01-09T07:45:00Z",
                status: "active",
                created_at: "2024-01-09T07:45:00Z",
                updated_at: "2024-01-09T07:45:00Z",
              },
            },
          ]
        : []

      const mockData: ClockSessionsResponse = {
        sessions: userId
          ? [
              {
                id: "session_1",
                user_id: userId,
                clock_in_time: "2024-01-09T08:30:00Z",
                clock_out_time: "2024-01-09T17:30:00Z",
                duration_minutes: 540,
                status: "completed",
                created_at: "2024-01-09T08:30:00Z",
                updated_at: "2024-01-09T17:30:00Z",
              },
              {
                id: "session_2",
                user_id: userId,
                clock_in_time: "2024-01-08T08:15:00Z",
                clock_out_time: "2024-01-08T17:45:00Z",
                duration_minutes: 570,
                status: "completed",
                created_at: "2024-01-08T08:15:00Z",
                updated_at: "2024-01-08T17:45:00Z",
              },
              {
                id: "session_3",
                user_id: userId,
                clock_in_time: "2024-01-07T08:45:00Z",
                clock_out_time: "2024-01-07T17:15:00Z",
                duration_minutes: 510,
                status: "completed",
                created_at: "2024-01-07T08:45:00Z",
                updated_at: "2024-01-07T17:15:00Z",
              },
            ]
          : [],
        current_session: userId
          ? {
              id: "session_current",
              user_id: userId,
              clock_in_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
              status: "active",
              created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            }
          : undefined,
        total_hours_today: 8.5,
        team_status: mockTeamStatus,
      }

      setData(mockData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch clock sessions"
      setError(errorMessage)
      toast({
        title: "Error loading clock data",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [userId, options.today, options.department, options.includeTeam])

  return {
    data,
    isLoading,
    error,
    refetch: fetchSessions,
    currentSession: data?.current_session,
    sessions: data?.sessions || [],
    totalHoursToday: data?.total_hours_today || 0,
    teamStatus: data?.team_status || [],
  }
}

export async function clockIn(userId: string): Promise<ClockSession> {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/v1/clock_sessions', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ user_id: userId })
    // })
    // if (!response.ok) throw new Error('Failed to clock in')
    // const session = await response.json()

    // Mock API simulation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newSession: ClockSession = {
      id: `session_${Date.now()}`,
      user_id: userId,
      clock_in_time: new Date().toISOString(),
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return newSession
  } catch (error) {
    throw new Error("Failed to clock in. Please try again.")
  }
}

export async function clockOut(sessionId: string): Promise<ClockSession> {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/v1/clock_sessions/${sessionId}/clock_out`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' }
    // })
    // if (!response.ok) throw new Error('Failed to clock out')
    // const session = await response.json()

    // Mock API simulation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const clockInTime = new Date(Date.now() - 8 * 60 * 60 * 1000) // 8 hours ago
    const clockOutTime = new Date()
    const durationMs = clockOutTime.getTime() - clockInTime.getTime()
    const durationMinutes = Math.floor(durationMs / (1000 * 60))

    const updatedSession: ClockSession = {
      id: sessionId,
      user_id: "current_user",
      clock_in_time: clockInTime.toISOString(),
      clock_out_time: clockOutTime.toISOString(),
      duration_minutes: durationMinutes,
      status: "completed",
      created_at: clockInTime.toISOString(),
      updated_at: clockOutTime.toISOString(),
    }

    return updatedSession
  } catch (error) {
    throw new Error("Failed to clock out. Please try again.")
  }
}
