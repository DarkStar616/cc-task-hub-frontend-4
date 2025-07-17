"use client"

import { useState, useEffect } from "react"
import { useDepartment } from "@/components/department/department-provider"

export interface Task {
  id: string
  title: string
  description?: string
  status: "pending" | "in-progress" | "completed" | "overdue"
  priority: "high" | "medium" | "low"
  due_date: string
  owner: {
    id: string
    name: string
    avatar?: string
  }
  assignees: Array<{
    id: string
    name: string
    avatar?: string
  }>
  tags: string[]
  department: string
  created_at: string
  updated_at: string
}

interface UseTasksParams {
  search?: string
  status?: string
  priority?: string
}

interface UseTasksReturn {
  tasks: Task[]
  loading: boolean
  error: string | null
  refetch: () => void
}

// Mock data for development
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Fix broken pool filter",
    description: "Pool filter system needs immediate repair",
    status: "pending",
    priority: "high",
    due_date: "2024-01-15",
    owner: { id: "1", name: "John Smith", avatar: "/placeholder-user.jpg" },
    assignees: [
      { id: "2", name: "Mike Johnson", avatar: "/placeholder-user.jpg" },
      { id: "3", name: "Sarah Wilson", avatar: "/placeholder-user.jpg" },
    ],
    tags: ["urgent", "maintenance"],
    department: "Maintenance",
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-10T10:00:00Z",
  },
  {
    id: "2",
    title: "Clean guest rooms 201-210",
    description: "Deep cleaning required for checkout rooms",
    status: "in-progress",
    priority: "medium",
    due_date: "2024-01-16",
    owner: { id: "4", name: "Lisa Brown", avatar: "/placeholder-user.jpg" },
    assignees: [{ id: "5", name: "Maria Garcia", avatar: "/placeholder-user.jpg" }],
    tags: ["cleaning", "guest-rooms"],
    department: "Housekeeping",
    created_at: "2024-01-11T09:00:00Z",
    updated_at: "2024-01-11T14:30:00Z",
  },
  {
    id: "3",
    title: "Setup dining room for event",
    description: "Prepare main dining room for corporate event",
    status: "completed",
    priority: "high",
    due_date: "2024-01-14",
    owner: { id: "6", name: "David Lee", avatar: "/placeholder-user.jpg" },
    assignees: [
      { id: "7", name: "Emma Davis", avatar: "/placeholder-user.jpg" },
      { id: "8", name: "Tom Wilson", avatar: "/placeholder-user.jpg" },
    ],
    tags: ["event", "setup"],
    department: "Front-of-House",
    created_at: "2024-01-12T08:00:00Z",
    updated_at: "2024-01-14T16:00:00Z",
  },
  {
    id: "4",
    title: "Organize bingo night",
    description: "Weekly bingo event for residents",
    status: "pending",
    priority: "low",
    due_date: "2024-01-18",
    owner: { id: "9", name: "Amy Chen", avatar: "/placeholder-user.jpg" },
    assignees: [{ id: "10", name: "Robert Taylor", avatar: "/placeholder-user.jpg" }],
    tags: ["activities", "weekly"],
    department: "Activities",
    created_at: "2024-01-13T11:00:00Z",
    updated_at: "2024-01-13T11:00:00Z",
  },
  {
    id: "5",
    title: "Update resident database",
    description: "Monthly database maintenance and updates",
    status: "overdue",
    priority: "medium",
    due_date: "2024-01-12",
    owner: { id: "11", name: "Jennifer White", avatar: "/placeholder-user.jpg" },
    assignees: [{ id: "12", name: "Kevin Brown", avatar: "/placeholder-user.jpg" }],
    tags: ["database", "monthly"],
    department: "Operations",
    created_at: "2024-01-05T09:00:00Z",
    updated_at: "2024-01-05T09:00:00Z",
  },
  {
    id: "6",
    title: "Trim hedges and lawn care",
    description: "Weekly grounds maintenance",
    status: "in-progress",
    priority: "low",
    due_date: "2024-01-17",
    owner: { id: "13", name: "Carlos Rodriguez", avatar: "/placeholder-user.jpg" },
    assignees: [{ id: "14", name: "James Miller", avatar: "/placeholder-user.jpg" }],
    tags: ["landscaping", "weekly"],
    department: "Grounds",
    created_at: "2024-01-14T07:00:00Z",
    updated_at: "2024-01-14T10:00:00Z",
  },
]

export function useTasks({ search = "", status = "all", priority = "all" }: UseTasksParams = {}): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { department } = useDepartment()

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // In a real app, this would be an API call
      // const response = await fetch(`/api/v1/tasks?department=${department}&search=${search}&status=${status}&priority=${priority}`)
      // const data = await response.json()

      // For now, filter mock data
      let filteredTasks = [...mockTasks]

      // Filter by department
      if (department !== "All Departments") {
        filteredTasks = filteredTasks.filter((task) => task.department === department)
      }

      // Filter by search
      if (search) {
        filteredTasks = filteredTasks.filter(
          (task) =>
            task.title.toLowerCase().includes(search.toLowerCase()) ||
            task.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())),
        )
      }

      // Filter by status
      if (status !== "all") {
        filteredTasks = filteredTasks.filter((task) => task.status === status)
      }

      // Filter by priority
      if (priority !== "all") {
        filteredTasks = filteredTasks.filter((task) => task.priority === priority)
      }

      setTasks(filteredTasks)
    } catch (err) {
      setError("Failed to fetch tasks")
      console.error("Error fetching tasks:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [department, search, status, priority])

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
  }
}

// Alias for testing/mock usage
export const useTasksMock = useTasks
