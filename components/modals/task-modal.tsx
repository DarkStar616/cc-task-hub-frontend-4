"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertTriangle, X, Plus } from "lucide-react"
import type { Task, CreateTaskInput, UpdateTaskInput } from "@/src/types/task"
import {
  createTaskSchema,
  updateTaskSchema,
  formatValidationErrors,
  hasManagerPermissions,
} from "@/src/utils/validation"
import { FakeApiService } from "@/lib/fake-api"
import { useToast } from "@/hooks/use-toast"
import { useDepartment } from "@/components/department/department-provider"
import { useAuth } from "@/components/auth/auth-provider"
import { useDepartmentUsers } from "@/hooks/use-api"
import { canCreateTasks, canManageDepartments } from "@/src/types/task"
import { cn } from "@/lib/utils"

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  task?: Task | null
  onTaskUpdate: (task: Task) => void
  onTaskCreate?: (task: Task) => void
  refreshTasks?: () => void
}

const DEPARTMENTS = [
  { id: "dept-1", name: "Maintenance" },
  { id: "dept-2", name: "Housekeeping" },
  { id: "dept-3", name: "Front of House" },
  { id: "dept-4", name: "Activities" },
  { id: "dept-5", name: "Operations" },
  { id: "dept-6", name: "Grounds" },
  { id: "dept-all", name: "All Departments" },
]

export function TaskModal({ isOpen, onClose, task, onTaskUpdate, onTaskCreate, refreshTasks }: TaskModalProps) {
  const { toast } = useToast()
  const { currentDepartment } = useDepartment()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [newTag, setNewTag] = useState("")

  // Permission checks
  const canCreate = user ? canCreateTasks(user.role) : false
  const canManageDepts = user ? canManageDepartments(user.role) : false
  const isManagerOrAbove = user ? hasManagerPermissions(user.role) : false

  const [formData, setFormData] = useState<CreateTaskInput>({
    title: "",
    description: "",
    priority: "medium",
    due_date: "",
    owner: "",
    assigned_to: [],
    tags: [],
    department: currentDepartment,
    department_id: DEPARTMENTS.find((d) => d.name === currentDepartment)?.id || "",
  })

  // Fetch users based on selected department
  const { users: departmentUsers, loading: usersLoading, error: usersError } = useDepartmentUsers(formData.department)

  // Reset form when task changes or modal opens
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        due_date: task.due_date || "",
        owner: task.owner,
        assigned_to: task.assigned_to,
        tags: task.tags,
        department: task.department,
        department_id: task.department_id,
      })
    } else {
      const defaultDeptId = DEPARTMENTS.find((d) => d.name === currentDepartment)?.id || ""
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        due_date: "",
        owner: "",
        assigned_to: [],
        tags: [],
        department: currentDepartment,
        department_id: defaultDeptId,
      })
    }
    setValidationErrors({})
  }, [task, currentDepartment, isOpen])

  // Handle department change and preserve owner if still valid
  const handleDepartmentChange = (newDepartment: string) => {
    const departmentId = DEPARTMENTS.find((d) => d.name === newDepartment)?.id || ""
    setFormData((prev) => ({
      ...prev,
      department: newDepartment,
      department_id: departmentId,
    }))
  }

  // Update owner selection when department users change
  useEffect(() => {
    if (departmentUsers.length > 0 && formData.owner) {
      const isOwnerStillValid = departmentUsers.some((user) => user.id === formData.owner)

      if (!isOwnerStillValid) {
        setFormData((prev) => ({
          ...prev,
          owner: departmentUsers[0]?.id || "",
        }))
      }
    }
  }, [departmentUsers, formData.owner])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Permission check for creation
    if (!task && !canCreate) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to create tasks. Only Managers and above can create tasks.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setValidationErrors({})

    try {
      // Validate form data with Zod
      let validatedData: CreateTaskInput | UpdateTaskInput

      if (task) {
        // For updates, use update schema
        validatedData = updateTaskSchema.parse(formData)
      } else {
        // For creation, use create schema (requires department_id)
        validatedData = createTaskSchema.parse(formData)
      }

      let result
      if (task) {
        result = await FakeApiService.updateTask(task.id, validatedData as UpdateTaskInput)
      } else {
        result = await FakeApiService.createTask(validatedData as CreateTaskInput)
      }

      if (result.success) {
        const updatedTask: Task = {
          id: task?.id || result.data.id,
          ...formData,
          status: task?.status || "pending",
          created_at: task?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        // Update local state
        if (task) {
          onTaskUpdate(updatedTask)
        } else if (onTaskCreate) {
          onTaskCreate(updatedTask)
        }

        // Refresh task list
        if (refreshTasks) {
          refreshTasks()
        }

        toast({
          title: task ? "Task Updated! ✅" : "Task Created! 🎯",
          description: task
            ? "Task has been successfully updated."
            : `New task created for ${formData.department} and assigned to ${formData.assigned_to.length} user(s).`,
          variant: "success",
        })
        onClose()
      }
    } catch (error) {
      console.error("Task submission error:", error)

      if (error instanceof Error && error.name === "ZodError") {
        // Handle Zod validation errors
        const zodError = error as any
        const formattedErrors = formatValidationErrors(zodError)
        setValidationErrors(formattedErrors)

        toast({
          title: "Validation Error",
          description: "Please check the form for errors and try again.",
          variant: "destructive",
        })
      } else {
        // Handle API errors
        let errorMessage = "Failed to save task. Please try again."
        if (error instanceof Error) {
          if (error.message.includes("403") || error.message.includes("Forbidden")) {
            errorMessage = "You don't have permission to perform this action."
          } else if (error.message.includes("Invalid department")) {
            errorMessage = "Invalid department selected. Please choose a valid department."
          } else {
            errorMessage = error.message
          }
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleAssignee = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      assigned_to: prev.assigned_to.includes(userId)
        ? prev.assigned_to.filter((id) => id !== userId)
        : [...prev.assigned_to, userId],
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  // Show permission warning for non-managers trying to create tasks
  const showPermissionWarning = !task && !canCreate

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {task ? "Edit Task" : "Create New Task"}
            {showPermissionWarning && <Shield className="w-4 h-4 text-amber-500" />}
          </DialogTitle>
        </DialogHeader>

        {/* Permission Warning */}
        {showPermissionWarning && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Access Restricted:</strong> Only Managers and above can create new tasks. Please contact your
              manager if you need to create a task.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title..."
              required
              disabled={showPermissionWarning}
              className={validationErrors.title ? "border-red-500" : ""}
            />
            {validationErrors.title && <p className="text-sm text-red-600">{validationErrors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the task..."
              rows={3}
              disabled={showPermissionWarning}
              className={validationErrors.description ? "border-red-500" : ""}
            />
            {validationErrors.description && <p className="text-sm text-red-600">{validationErrors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value as any }))}
                disabled={showPermissionWarning}
              >
                <SelectTrigger className={validationErrors.priority ? "border-red-500" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.priority && <p className="text-sm text-red-600">{validationErrors.priority}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData((prev) => ({ ...prev, due_date: e.target.value }))}
                disabled={showPermissionWarning}
                className={validationErrors.due_date ? "border-red-500" : ""}
              />
              {validationErrors.due_date && <p className="text-sm text-red-600">{validationErrors.due_date}</p>}
            </div>
          </div>

          {/* Department Selector - Only visible to Managers+ */}
          {isManagerOrAbove && (
            <div className="space-y-2">
              <Label>Department</Label>
              <Select
                value={formData.department}
                onValueChange={handleDepartmentChange}
                disabled={showPermissionWarning}
              >
                <SelectTrigger className={validationErrors.department ? "border-red-500" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.department && <p className="text-sm text-red-600">{validationErrors.department}</p>}
              {validationErrors.department_id && (
                <p className="text-sm text-red-600">{validationErrors.department_id}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label>Owner</Label>
            <Select
              value={formData.owner}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, owner: value }))}
              disabled={usersLoading || showPermissionWarning}
            >
              <SelectTrigger className={validationErrors.owner ? "border-red-500" : ""}>
                <SelectValue>
                  {usersLoading ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      <span>Loading users...</span>
                    </div>
                  ) : formData.owner && departmentUsers.find((u) => u.id === formData.owner) ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="w-5 h-5">
                        <AvatarFallback
                          className={cn(
                            "text-xs text-white",
                            departmentUsers.find((u) => u.id === formData.owner)?.avatar_color,
                          )}
                        >
                          {departmentUsers.find((u) => u.id === formData.owner)?.initials}
                        </AvatarFallback>
                      </Avatar>
                      {departmentUsers.find((u) => u.id === formData.owner)?.name}
                    </div>
                  ) : (
                    "Select owner..."
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {usersError ? (
                  <SelectItem value="_disabled_" disabled>
                    Error loading users
                  </SelectItem>
                ) : departmentUsers.length === 0 && !usersLoading ? (
                  <SelectItem value="_disabled_" disabled>
                    No users found
                  </SelectItem>
                ) : (
                  departmentUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-5 h-5">
                          <AvatarFallback className={cn("text-xs text-white", user.avatar_color)}>
                            {user.initials}
                          </AvatarFallback>
                        </Avatar>
                        {user.name}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {validationErrors.owner && <p className="text-sm text-red-600">{validationErrors.owner}</p>}
          </div>

          <div className="space-y-3">
            <Label>Assigned To</Label>
            {usersLoading ? (
              <div className="flex items-center justify-center p-4 border rounded-lg">
                <LoadingSpinner size="sm" />
                <span className="ml-2">Loading users...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {departmentUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => !showPermissionWarning && toggleAssignee(user.id)}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg border transition-colors",
                      showPermissionWarning ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                      formData.assigned_to.includes(user.id)
                        ? "border-coot-teal bg-coot-teal/10"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className={cn("text-xs text-white", user.avatar_color)}>
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{user.name}</span>
                    {formData.assigned_to.includes(user.id) && <span className="ml-auto text-coot-teal">✓</span>}
                  </div>
                ))}
              </div>
            )}
            {validationErrors.assigned_to && <p className="text-sm text-red-600">{validationErrors.assigned_to}</p>}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                disabled={showPermissionWarning}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm" disabled={showPermissionWarning}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => !showPermissionWarning && removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            )}
            {validationErrors.tags && <p className="text-sm text-red-600">{validationErrors.tags}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || usersLoading || showPermissionWarning} className="btn-primary">
              {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
