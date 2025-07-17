"use client"

import { useState, useEffect } from "react"
import { useDepartment } from "@/components/department/department-provider"

interface UseTasksCountReturn {
  count: number
  loading: boolean
  error: string | null
}

export function useTasksCount(): UseTasksCountReturn {
  const { department } = useDepartment()
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        setLoading(true)
        setError(null)

        // Build query params
        const params = new URLSearchParams()
        if (department !== "All Departments") {
          params.append("department", department)
        }
        params.append("countOnly", "true")

        const response = await fetch(`/api/v1/tasks?${params.toString()}`)

        if (!response.ok) {
          throw new Error("Failed to fetch tasks count")
        }

        const data = await response.json()
        setCount(data.count || 0)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
        setCount(0)
      } finally {
        setLoading(false)
      }
    }

    fetchCount()
  }, [department])

  return { count, loading, error }
}

// Mock implementation for demo purposes
export function useTasksCountMock(): UseTasksCountReturn {
  const { department } = useDepartment()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [department])

  // Mock counts by department
  const mockCounts = {
    "All Departments": 47,
    Maintenance: 12,
    Housekeeping: 8,
    "Front-of-House": 15,
    Activities: 6,
    Operations: 4,
    Grounds: 2,
  }

  return {
    count: mockCounts[department] || 0,
    loading,
    error: null,
  }
}
