import type { z } from "zod"
import type { TaskSchema, UserSchema, DepartmentSchema } from "@/src/utils/validation"

// Core types from Zod schemas
export type Task = z.infer<typeof TaskSchema>
export type User = z.infer<typeof UserSchema>
export type Department = z.infer<typeof DepartmentSchema>

// Task-specific types
export interface TaskWithRelations extends Task {
  owner_details?: User
  assignee_details?: User[]
  department_details?: Department
}

// Form types
export interface TaskFormData {
  title: string
  description?: string
  priority: "low" | "medium" | "high" | "urgent"
  status?: "pending" | "in-progress" | "completed" | "overdue"
  due_date?: string
  owner: string
  assigned_to: string[]
  tags: string[]
  department: string
  department_id: string
}

// API types
export interface TaskCreateRequest extends TaskFormData {}

export interface TaskUpdateRequest extends Partial<TaskFormData> {
  id: string
}

export interface TaskResponse {
  success: boolean
  data?: Task
  error?: string
  message?: string
}

export interface TaskListResponse {
  success: boolean
  data?: Task[]
  error?: string
  total?: number
  page?: number
  limit?: number
}

// Permission helpers
export const canCreateTasks = (role: string): boolean => {
  return ["manager", "admin"].includes(role.toLowerCase())
}

export const canEditTasks = (role: string): boolean => {
  return ["supervisor", "manager", "admin"].includes(role.toLowerCase())
}

export const canDeleteTasks = (role: string): boolean => {
  return ["manager", "admin"].includes(role.toLowerCase())
}

export const canManageDepartments = (role: string): boolean => {
  return ["manager", "admin"].includes(role.toLowerCase())
}

export const canAssignTasks = (role: string): boolean => {
  return ["supervisor", "manager", "admin"].includes(role.toLowerCase())
}

// Filter types
export interface TaskFilters {
  status?: string[]
  priority?: string[]
  department?: string
  assignee?: string
  owner?: string
  due_date_from?: string
  due_date_to?: string
  search?: string
}

// Sort types
export interface TaskSort {
  field: "title" | "priority" | "due_date" | "created_at" | "updated_at"
  direction: "asc" | "desc"
}

// Bulk action types
export interface BulkTaskAction {
  action: "complete" | "delete" | "assign" | "update_priority" | "update_department"
  task_ids: string[]
  data?: Record<string, any>
}

export interface BulkTaskResponse {
  success: boolean
  updated_count: number
  failed_count: number
  errors?: Array<{
    task_id: string
    error: string
  }>
}
