// Clock Session Types
export interface ClockSession {
  id: string
  user_id: string
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
}

// Existing types...
export interface User {
  id: string
  email: string
  full_name: string
  role: string
  department: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  title: string
  description?: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "in-progress" | "completed" | "overdue"
  due_date?: string
  owner: string
  assigned_to: string[]
  tags: string[]
  department: string
  department_id: string
  created_at: string
  updated_at: string
}

export interface Department {
  id: string
  name: string
  description?: string
  color?: string
  created_at: string
  updated_at: string
}

export interface SOP {
  id: string
  title: string
  description?: string
  department: string
  file_url: string
  file_name: string
  file_size: number
  uploaded_by: string
  tags: string[]
  version: string
  status: "active" | "archived"
  created_at: string
  updated_at: string
}

export interface Reminder {
  id: string
  title: string
  description?: string
  time: string
  recurrence: "daily" | "weekdays" | "custom"
  channels: string[]
  status: "active" | "inactive"
  user_id: string
  created_at: string
  updated_at: string
}
