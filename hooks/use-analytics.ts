"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

// Analytics data types
export interface TaskAnalytics {
  total_tasks: number
  completed_tasks: number
  pending_tasks: number
  overdue_tasks: number
  completion_rate: number
  average_completion_time_hours: number
}

export interface UserProductivity {
  total_users: number
  active_users: number
  tasks_per_user: number
  completion_rate_by_user: Array<{
    user_id: string
    user_name: string
    completion_rate: number
    total_tasks: number
  }>
}

export interface TimeTracking {
  total_hours_logged: number
  average_hours_per_day: number
  peak_activity_hour: number
  department_hours: Array<{
    department: string
    total_hours: number
    average_per_user: number
  }>
}

export interface DepartmentMetrics {
  department: string
  task_completion_rate: number
  average_response_time_hours: number
  active_users: number
  total_tasks: number
}

export interface AnalyticsData {
  task_analytics: TaskAnalytics
  user_productivity: UserProductivity
  time_tracking: TimeTracking
  department_metrics: DepartmentMetrics[]
  period_start: string
  period_end: string
  generated_at: string
}

export interface AnalyticsQueryParams {
  metric_type?: "tasks" | "users" | "time" | "departments" | "all"
  department?: string
  user_id?: string
  period_start?: string
  period_end?: string
}

export interface UseAnalyticsReturn {
  data: AnalyticsData | null
  error: string | null
  isLoading: boolean
  refetch: () => Promise<void>
}

// Mock analytics data for development
const mockAnalyticsData: AnalyticsData = {
  task_analytics: {
    total_tasks: 156,
    completed_tasks: 124,
    pending_tasks: 28,
    overdue_tasks: 4,
    completion_rate: 79.5,
    average_completion_time_hours: 18.5,
  },
  user_productivity: {
    total_users: 24,
    active_users: 18,
    tasks_per_user: 6.5,
    completion_rate_by_user: [
      { user_id: "1", user_name: "Alice Johnson", completion_rate: 95.2, total_tasks: 21 },
      { user_id: "2", user_name: "Bob Smith", completion_rate: 87.3, total_tasks: 16 },
      { user_id: "3", user_name: "Carol Davis", completion_rate: 92.1, total_tasks: 19 },
      { user_id: "4", user_name: "David Wilson", completion_rate: 78.4, total_tasks: 14 },
      { user_id: "5", user_name: "Emma Brown", completion_rate: 89.7, total_tasks: 18 },
    ],
  },
  time_tracking: {
    total_hours_logged: 1248,
    average_hours_per_day: 7.2,
    peak_activity_hour: 10,
    department_hours: [
      { department: "Housekeeping", total_hours: 456, average_per_user: 8.1 },
      { department: "Front-of-House", total_hours: 392, average_per_user: 7.8 },
      { department: "Kitchen", total_hours: 284, average_per_user: 6.9 },
      { department: "Maintenance", total_hours: 116, average_per_user: 7.3 },
    ],
  },
  department_metrics: [
    {
      department: "Housekeeping",
      task_completion_rate: 85.2,
      average_response_time_hours: 2.4,
      active_users: 8,
      total_tasks: 45,
    },
    {
      department: "Front-of-House",
      task_completion_rate: 91.7,
      average_response_time_hours: 1.8,
      active_users: 6,
      total_tasks: 38,
    },
    {
      department: "Kitchen",
      task_completion_rate: 76.3,
      average_response_time_hours: 3.2,
      active_users: 5,
      total_tasks: 32,
    },
    {
      department: "Maintenance",
      task_completion_rate: 88.9,
      average_response_time_hours: 4.1,
      active_users: 3,
      total_tasks: 18,
    },
  ],
  period_start: "2024-01-01T00:00:00Z",
  period_end: "2024-01-31T23:59:59Z",
  generated_at: new Date().toISOString(),
}

export function useAnalytics(params: AnalyticsQueryParams = {}): UseAnalyticsReturn {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Build query string from params
      const queryParams = new URLSearchParams()
      if (params.metric_type) queryParams.append("metric_type", params.metric_type)
      if (params.department) queryParams.append("department", params.department)
      if (params.user_id) queryParams.append("user_id", params.user_id)
      if (params.period_start) queryParams.append("period_start", params.period_start)
      if (params.period_end) queryParams.append("period_end", params.period_end)

      const queryString = queryParams.toString()
      const url = `/api/v1/analytics${queryString ? `?${queryString}` : ""}`

      // TODO: Replace with actual API call
      // const response = await fetch(url, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}` // Add auth token
      //   }
      // })
      //
      // if (!response.ok) {
      //   throw new Error(`Analytics fetch failed: ${response.statusText}`)
      // }
      //
      // const result = await response.json()
      // setData(result.analytics)

      // Mock API call with realistic delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Filter mock data based on department if specified
      const filteredData = { ...mockAnalyticsData }
      if (params.department && params.department !== "All Departments") {
        filteredData.department_metrics = filteredData.department_metrics.filter(
          (dept) => dept.department === params.department,
        )
        filteredData.time_tracking.department_hours = filteredData.time_tracking.department_hours.filter(
          (dept) => dept.department === params.department,
        )
      }

      setData(filteredData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch analytics data"
      setError(errorMessage)
      toast({
        title: "Analytics Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const refetch = async () => {
    await fetchAnalytics()
  }

  useEffect(() => {
    fetchAnalytics()
  }, [params.department, params.metric_type, params.user_id, params.period_start, params.period_end])

  return {
    data,
    error,
    isLoading,
    refetch,
  }
}
