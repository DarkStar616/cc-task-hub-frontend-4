import { z } from "zod"

// Task priority enum
export const TaskPrioritySchema = z.enum(["low", "medium", "high", "urgent"])

// Task status enum
export const TaskStatusSchema = z.enum(["pending", "in-progress", "completed", "overdue"])

// User role enum
export const UserRoleSchema = z.enum(["employee", "supervisor", "manager", "admin"])

// Base task schema for common fields
export const BaseTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().optional(),
  priority: TaskPrioritySchema,
  status: TaskStatusSchema.optional().default("pending"),
  due_date: z.string().optional(),
  owner: z.string().min(1, "Owner is required"),
  assigned_to: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  department: z.string().min(1, "Department is required"),
})

// Create task schema with required department_id
export const createTaskSchema = BaseTaskSchema.extend({
  department_id: z.string().uuid("Department ID must be a valid UUID"),
})

// Update task schema (department_id optional for updates)
export const updateTaskSchema = BaseTaskSchema.extend({
  department_id: z.string().uuid("Department ID must be a valid UUID").optional(),
})

// Task response schema
export const TaskSchema = BaseTaskSchema.extend({
  id: z.string().uuid(),
  department_id: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string(),
})

// User schema
export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  role: UserRoleSchema,
  department: z.string().min(1, "Department is required"),
  avatar_color: z.string().optional(),
  initials: z.string().optional(),
})

// Department schema
export const DepartmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Department name is required"),
  description: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string(),
})

// API response schemas
export const ApiSuccessSchema = z.object({
  success: z.literal(true),
  data: z.any(),
  message: z.string().optional(),
})

export const ApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  code: z.string().optional(),
})

// Permission validation
export const hasManagerPermissions = (role: string): boolean => {
  return ["manager", "admin"].includes(role.toLowerCase())
}

export const hasSupervisorPermissions = (role: string): boolean => {
  return ["supervisor", "manager", "admin"].includes(role.toLowerCase())
}

// Validation error formatter
export const formatValidationErrors = (error: z.ZodError): Record<string, string> => {
  const errors: Record<string, string> = {}

  error.errors.forEach((err) => {
    const path = err.path.join(".")
    errors[path] = err.message
  })

  return errors
}

// Type exports
export type TaskPriority = z.infer<typeof TaskPrioritySchema>
export type TaskStatus = z.infer<typeof TaskStatusSchema>
export type UserRole = z.infer<typeof UserRoleSchema>
export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type Task = z.infer<typeof TaskSchema>
export type User = z.infer<typeof UserSchema>
export type Department = z.infer<typeof DepartmentSchema>
