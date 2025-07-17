"use client"

import { useState, useEffect } from "react"
import { useDepartment } from "@/components/department/department-provider"

// User interface for API responses
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  department: string
  created_at: string
  updated_at: string
}

// Mock users data for development
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@cootclub.com",
    avatar: "/placeholder-user.jpg",
    role: "manager",
    department: "Maintenance",
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "2",
    name: "Mike Johnson",
    email: "mike.johnson@cootclub.com",
    avatar: "/placeholder-user.jpg",
    role: "employee",
    department: "Maintenance",
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "3",
    name: "Sarah Wilson",
    email: "sarah.wilson@cootclub.com",
    avatar: "/placeholder-user.jpg",
    role: "employee",
    department: "Maintenance",
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "4",
    name: "Lisa Brown",
    email: "lisa.brown@cootclub.com",
    avatar: "/placeholder-user.jpg",
    role: "manager",
    department: "Housekeeping",
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "5",
    name: "Maria Garcia",
    email: "maria.garcia@cootclub.com",
    avatar: "/placeholder-user.jpg",
    role: "employee",
    department: "Housekeeping",
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "6",
    name: "David Lee",
    email: "david.lee@cootclub.com",
    avatar: "/placeholder-user.jpg",
    role: "manager",
    department: "Front-of-House",
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "7",
    name: "Emma Davis",
    email: "emma.davis@cootclub.com",
    avatar: "/placeholder-user.jpg",
    role: "employee",
    department: "Front-of-House",
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "8",
    name: "Tom Wilson",
    email: "tom.wilson@cootclub.com",
    avatar: "/placeholder-user.jpg",
    role: "employee",
    department: "Front-of-House",
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "9",
    name: "Amy Chen",
    email: "amy.chen@cootclub.com",
    avatar: "/placeholder-user.jpg",
    role: "manager",
    department: "Activities",
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "10",
    name: "Robert Taylor",
    email: "robert.taylor@cootclub.com",
    avatar: "/placeholder-user.jpg",
    role: "employee",
    department: "Activities",
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "11",
    name: "Jennifer White",
    email: "jennifer.white@cootclub.com",
    avatar: "/placeholder-user.jpg",
    role: "manager",
    department: "Operations",
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "12",
    name: "Kevin Brown",
    email: "kevin.brown@cootclub.com",
    avatar: "/placeholder-user.jpg",
    role: "employee",
    department: "Operations",
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "13",
    name: "Carlos Rodriguez",
    email: "carlos.rodriguez@cootclub.com",
    avatar: "/placeholder-user.jpg",
    role: "manager",
    department: "Grounds",
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "14",
    name: "James Miller",
    email: "james.miller@cootclub.com",
    avatar: "/placeholder-user.jpg",
    role: "employee",
    department: "Grounds",
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z",
  },
]

// 🔌 Generic API hook - Connect to your backend in Replit
export function useApi<T>(endpoint: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { department } = useDepartment()

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Build URL with department filter
      const url = new URL(endpoint, window.location.origin)
      if (department !== "All Departments") {
        url.searchParams.set("department", department)
      }

      // 🔌 TODO: Replace with actual API call in Replit
      // const response = await fetch(url.toString(), options)
      // if (!response.ok) throw new Error('API call failed')
      // const result = await response.json()
      // setData(result)

      // Placeholder: Show loading state for now
      console.log(`🔌 API Call Placeholder: ${url.toString()}`)
      console.log(`🔌 Department Filter: ${department}`)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate loading
      setData(null) // No data until backend is connected
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [endpoint, department]) // Re-fetch when department changes

  return { data, loading, error, refetch: () => fetchData() }
}

// 🔌 Mutation hook for POST/PUT/DELETE operations
export function useMutation<T>(endpoint: string, method: "POST" | "PUT" | "DELETE" = "POST") {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { department } = useDepartment()

  const mutate = async (data?: any) => {
    try {
      setLoading(true)
      setError(null)

      // Build URL with department filter for context
      const url = new URL(endpoint, window.location.origin)
      if (department !== "All Departments") {
        url.searchParams.set("department", department)
      }

      // 🔌 TODO: Replace with actual API call in Replit
      // const response = await fetch(url.toString(), {
      //   method,
      //   headers: { 'Content-Type': 'application/json' },
      //   body: data ? JSON.stringify({
      //     ...data,
      //     department: department !== "All Departments" ? department : undefined
      //   }) : undefined
      // })
      // if (!response.ok) throw new Error('API call failed')
      // return await response.json()

      // Placeholder: Log the operation
      console.log(`🔌 API Mutation Placeholder: ${method} ${url.toString()}`)
      console.log(`🔌 Department Context: ${department}`, data)
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate operation
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { mutate, loading, error }
}

// Helper hook for department-aware data fetching
export function useDepartmentData<T>(endpoint: string, options?: RequestInit) {
  const { department } = useDepartment()
  const { data, loading, error, refetch } = useApi<T>(endpoint, options)

  return {
    data,
    loading,
    error,
    refetch,
    department,
    isDepartmentFiltered: department !== "All Departments",
  }
}

// Hook to fetch all users
export function useUsers(): { users: User[]; loading: boolean; error: string | null; refetch: () => void } {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/users', {
      //   headers: {
      //     'Authorization': `Bearer ${getAuthToken()}`
      //   }
      // })
      // if (!response.ok) throw new Error('Failed to fetch users')
      // const data = await response.json()
      // setUsers(data.users || [])

      // For now, use mock data
      setUsers(mockUsers)
    } catch (err) {
      setError("Failed to fetch users")
      console.error("Error fetching users:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  }
}

// Hook to fetch users by department
export function useDepartmentUsers(selectedDepartment?: string): {
  users: User[]
  loading: boolean
  error: string | null
} {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDepartmentUsers = async () => {
      if (!selectedDepartment) {
        setUsers([])
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 200))

        // TODO: Replace with actual API call
        // const url = new URL('/api/v1/users', window.location.origin)
        // if (selectedDepartment !== 'All Departments') {
        //   url.searchParams.set('department', selectedDepartment)
        // }
        // const response = await fetch(url.toString(), {
        //   headers: {
        //     'Authorization': `Bearer ${getAuthToken()}`
        //   }
        // })
        // if (!response.ok) throw new Error('Failed to fetch department users')
        // const data = await response.json()
        // setUsers(data.users || [])

        // For now, filter mock data by department
        let filteredUsers = mockUsers
        if (selectedDepartment !== "All Departments") {
          filteredUsers = mockUsers.filter((user) => user.department === selectedDepartment)
        }

        setUsers(filteredUsers)
      } catch (err) {
        setError("Failed to fetch department users")
        console.error("Error fetching department users:", err)
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    fetchDepartmentUsers()
  }, [selectedDepartment])

  return {
    users,
    loading,
    error,
  }
}
