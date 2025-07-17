import { describe, it, expect } from "vitest"
import { z } from "zod"
import {
  createTaskSchema,
  updateTaskSchema,
  TaskSchema,
  formatValidationErrors,
  hasManagerPermissions,
  hasSupervisorPermissions,
} from "@/src/utils/validation"
import { canCreateTasks, canManageDepartments } from "@/src/types/task"

describe("Task Validation", () => {
  describe("createTaskSchema", () => {
    it("should require department_id as a valid UUID", () => {
      const invalidTask = {
        title: "Test Task",
        priority: "medium",
        owner: "user-123",
        department: "Maintenance",
        // Missing department_id
      }

      expect(() => createTaskSchema.parse(invalidTask)).toThrow()

      try {
        createTaskSchema.parse(invalidTask)
      } catch (error) {
        expect(error).toBeInstanceOf(z.ZodError)
        const zodError = error as z.ZodError
        expect(zodError.errors.some((err) => err.path.includes("department_id"))).toBe(true)
        expect(zodError.errors.some((err) => err.message.includes("required"))).toBe(true)
      }
    })

    it("should reject invalid UUID format for department_id", () => {
      const invalidTask = {
        title: "Test Task",
        priority: "medium",
        owner: "user-123",
        department: "Maintenance",
        department_id: "invalid-uuid-format",
      }

      expect(() => createTaskSchema.parse(invalidTask)).toThrow()

      try {
        createTaskSchema.parse(invalidTask)
      } catch (error) {
        expect(error).toBeInstanceOf(z.ZodError)
        const zodError = error as z.ZodError
        expect(
          zodError.errors.some((err) => err.path.includes("department_id") && err.message.includes("valid UUID")),
        ).toBe(true)
      }
    })

    it("should accept valid task data with proper UUID", () => {
      const validTask = {
        title: "Test Task",
        description: "Test description",
        priority: "medium",
        owner: "user-123",
        department: "Maintenance",
        department_id: "550e8400-e29b-41d4-a716-446655440000",
        assigned_to: ["user-456"],
        tags: ["urgent", "maintenance"],
        due_date: "2024-12-31",
      }

      expect(() => createTaskSchema.parse(validTask)).not.toThrow()

      const result = createTaskSchema.parse(validTask)
      expect(result.department_id).toBe("550e8400-e29b-41d4-a716-446655440000")
      expect(result.title).toBe("Test Task")
    })

    it("should validate required fields", () => {
      const incompleteTask = {
        // Missing title
        priority: "medium",
        department: "Maintenance",
        department_id: "550e8400-e29b-41d4-a716-446655440000",
      }

      expect(() => createTaskSchema.parse(incompleteTask)).toThrow()

      try {
        createTaskSchema.parse(incompleteTask)
      } catch (error) {
        const zodError = error as z.ZodError
        expect(zodError.errors.some((err) => err.path.includes("title"))).toBe(true)
        expect(zodError.errors.some((err) => err.path.includes("owner"))).toBe(true)
      }
    })

    it("should validate priority enum values", () => {
      const invalidPriorityTask = {
        title: "Test Task",
        priority: "invalid-priority",
        owner: "user-123",
        department: "Maintenance",
        department_id: "550e8400-e29b-41d4-a716-446655440000",
      }

      expect(() => createTaskSchema.parse(invalidPriorityTask)).toThrow()
    })
  })

  describe("updateTaskSchema", () => {
    it("should make department_id optional for updates", () => {
      const updateData = {
        title: "Updated Task",
        priority: "high",
        // No department_id required for updates
      }

      expect(() => updateTaskSchema.parse(updateData)).not.toThrow()
    })

    it("should still validate UUID format if department_id is provided", () => {
      const updateData = {
        title: "Updated Task",
        department_id: "invalid-uuid",
      }

      expect(() => updateTaskSchema.parse(updateData)).toThrow()
    })
  })

  describe("formatValidationErrors", () => {
    it("should format Zod errors into user-friendly messages", () => {
      try {
        createTaskSchema.parse({
          title: "",
          priority: "invalid",
          department_id: "not-a-uuid",
        })
      } catch (error) {
        const zodError = error as z.ZodError
        const formatted = formatValidationErrors(zodError)

        expect(typeof formatted).toBe("object")
        expect(Object.keys(formatted).length).toBeGreaterThan(0)

        // Check that error messages are strings
        Object.values(formatted).forEach((message) => {
          expect(typeof message).toBe("string")
          expect(message.length).toBeGreaterThan(0)
        })
      }
    })
  })

  describe("Permission Functions", () => {
    describe("hasManagerPermissions", () => {
      it("should return true for manager role", () => {
        expect(hasManagerPermissions("manager")).toBe(true)
        expect(hasManagerPermissions("Manager")).toBe(true)
        expect(hasManagerPermissions("MANAGER")).toBe(true)
      })

      it("should return true for admin role", () => {
        expect(hasManagerPermissions("admin")).toBe(true)
        expect(hasManagerPermissions("Admin")).toBe(true)
        expect(hasManagerPermissions("ADMIN")).toBe(true)
      })

      it("should return false for lower roles", () => {
        expect(hasManagerPermissions("employee")).toBe(false)
        expect(hasManagerPermissions("supervisor")).toBe(false)
        expect(hasManagerPermissions("")).toBe(false)
        expect(hasManagerPermissions("invalid")).toBe(false)
      })
    })

    describe("hasSupervisorPermissions", () => {
      it("should return true for supervisor and above", () => {
        expect(hasSupervisorPermissions("supervisor")).toBe(true)
        expect(hasSupervisorPermissions("manager")).toBe(true)
        expect(hasSupervisorPermissions("admin")).toBe(true)
      })

      it("should return false for employee role", () => {
        expect(hasSupervisorPermissions("employee")).toBe(false)
      })
    })

    describe("canCreateTasks", () => {
      it("should only allow managers and admins to create tasks", () => {
        expect(canCreateTasks("manager")).toBe(true)
        expect(canCreateTasks("admin")).toBe(true)
        expect(canCreateTasks("supervisor")).toBe(false)
        expect(canCreateTasks("employee")).toBe(false)
      })
    })

    describe("canManageDepartments", () => {
      it("should only allow managers and admins to manage departments", () => {
        expect(canManageDepartments("manager")).toBe(true)
        expect(canManageDepartments("admin")).toBe(true)
        expect(canManageDepartments("supervisor")).toBe(false)
        expect(canManageDepartments("employee")).toBe(false)
      })
    })
  })

  describe("TaskSchema", () => {
    it("should validate complete task objects", () => {
      const completeTask = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        title: "Complete Task",
        description: "Task description",
        priority: "high",
        status: "pending",
        due_date: "2024-12-31",
        owner: "user-123",
        assigned_to: ["user-456", "user-789"],
        tags: ["urgent", "maintenance"],
        department: "Maintenance",
        department_id: "550e8400-e29b-41d4-a716-446655440001",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      }

      expect(() => TaskSchema.parse(completeTask)).not.toThrow()

      const result = TaskSchema.parse(completeTask)
      expect(result.id).toBe(completeTask.id)
      expect(result.department_id).toBe(completeTask.department_id)
    })

    it("should require all mandatory fields for complete task", () => {
      const incompleteTask = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        title: "Incomplete Task",
        // Missing required fields
      }

      expect(() => TaskSchema.parse(incompleteTask)).toThrow()
    })
  })

  describe("Integration Tests", () => {
    it("should validate complete task creation flow", () => {
      // Step 1: Validate creation input
      const createInput = {
        title: "Integration Test Task",
        description: "Testing the complete flow",
        priority: "medium",
        owner: "user-123",
        department: "Maintenance",
        department_id: "550e8400-e29b-41d4-a716-446655440000",
        assigned_to: ["user-456"],
        tags: ["test"],
        due_date: "2024-12-31",
      }

      const validatedInput = createTaskSchema.parse(createInput)
      expect(validatedInput.department_id).toBe(createInput.department_id)

      // Step 2: Simulate API response validation
      const apiResponse = {
        ...validatedInput,
        id: "550e8400-e29b-41d4-a716-446655440001",
        status: "pending",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      }

      const validatedResponse = TaskSchema.parse(apiResponse)
      expect(validatedResponse.id).toBe(apiResponse.id)
      expect(validatedResponse.department_id).toBe(createInput.department_id)
    })

    it("should handle validation errors gracefully", () => {
      const invalidInput = {
        title: "",
        priority: "invalid",
        department_id: "not-a-uuid",
      }

      try {
        createTaskSchema.parse(invalidInput)
      } catch (error) {
        const zodError = error as z.ZodError
        const formatted = formatValidationErrors(zodError)

        expect(formatted).toHaveProperty("title")
        expect(formatted).toHaveProperty("priority")
        expect(formatted).toHaveProperty("department_id")
        expect(formatted).toHaveProperty("owner")
      }
    })
  })
})
