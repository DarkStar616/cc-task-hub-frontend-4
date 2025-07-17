"use client"

import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, Check, Edit2, Plus, List, LayoutGrid, User } from "lucide-react"
import { useTasks } from "@/hooks/use-tasks"
import { FakeApiService } from "@/lib/fake-api"
import { useToast } from "@/hooks/use-toast"
import { TaskModal } from "@/components/modals/task-modal"
import { TaskCard } from "./task-card"
import { BulkActionsToolbar } from "./bulk-actions-toolbar"
import { FilterChips } from "./filter-chips"
import { EmptyState } from "./empty-state"
import { useAuth } from "@/components/auth/auth-provider"
import { useDepartment } from "@/components/department/department-provider"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface Task {
  id: string
  title: string
  description?: string
  status: "pending" | "in-progress" | "completed" | "overdue"
  priority: "high" | "medium" | "low"
  due_date: string
  owner?: {
    id: string
    name: string
    avatar?: string
  }
  assignees?: Array<{
    id: string
    name: string
    avatar?: string
  }>
  department?: {
    id: string
    name: string
  }
  tags: string[]
  created_at: string
  updated_at: string
}

type ViewMode = "table" | "grid"

export function TasksContent() {
  /* ------------------------------------------------------------------ */
  /* local filter state                                                  */
  /* ------------------------------------------------------------------ */
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<"all" | Task["status"]>("all")
  const [priority, setPriority] = useState<"all" | Task["priority"]>("all")
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<ViewMode>("table")

  const { toast } = useToast()
  const { hasRole } = useAuth()
  const { department } = useDepartment()

  // Check permissions
  const canCreateTasks = hasRole(["god", "admin", "manager"])
  const canPerformBulkActions = hasRole(["god", "admin", "manager"])

  /* ------------------------------------------------------------------ */
  /* data                                                                */
  /* ------------------------------------------------------------------ */
  const {
    tasks = [],
    loading,
    error,
    refetch,
  } = useTasks({
    search,
    status: status === "all" ? undefined : status,
    priority: priority === "all" ? undefined : priority,
  })

  /* ------------------------------------------------------------------ */
  /* derived list after client-side filtering (double safety)           */
  /* ------------------------------------------------------------------ */
  const filtered = tasks.filter((task) => {
    // Safe property access with fallbacks
    const taskTitle = task?.title ?? ""
    const taskDescription = task?.description ?? ""
    const taskTags = task?.tags ?? []
    const taskStatus = task?.status ?? "pending"
    const taskPriority = task?.priority ?? "low"
    const taskDepartmentName = task?.department?.name ?? ""
    const taskOwnerName = task?.owner?.name ?? ""

    const searchMatch =
      taskTitle.toLowerCase().includes(search.toLowerCase()) ||
      taskDescription.toLowerCase().includes(search.toLowerCase()) ||
      taskDepartmentName.toLowerCase().includes(search.toLowerCase()) ||
      taskOwnerName.toLowerCase().includes(search.toLowerCase()) ||
      taskTags.some((tag) => (tag ?? "").toLowerCase().includes(search.toLowerCase()))

    const statusMatch = status === "all" || taskStatus === status
    const priorityMatch = priority === "all" || taskPriority === priority

    return searchMatch && statusMatch && priorityMatch
  })

  // Get selected tasks
  const selectedTasks = filtered.filter((task) => selectedTaskIds.has(task?.id ?? ""))

  // Check if we have active filters or search
  const hasActiveFilters = status !== "all" || priority !== "all"
  const hasActiveSearch = search.trim().length > 0

  /* ------------------------------------------------------------------ */
  /* selection helpers                                                   */
  /* ------------------------------------------------------------------ */
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTaskIds(new Set(filtered.map((task) => task?.id ?? "").filter(Boolean)))
    } else {
      setSelectedTaskIds(new Set())
    }
  }

  const handleSelectTask = (taskId: string, checked: boolean) => {
    if (!taskId) return

    const newSelection = new Set(selectedTaskIds)
    if (checked) {
      newSelection.add(taskId)
    } else {
      newSelection.delete(taskId)
    }
    setSelectedTaskIds(newSelection)
  }

  const clearSelection = () => {
    setSelectedTaskIds(new Set())
  }

  // Check if all visible tasks are selected
  const allSelected = filtered.length > 0 && filtered.every((task) => selectedTaskIds.has(task?.id ?? ""))
  const someSelected = selectedTaskIds.size > 0 && !allSelected

  /* ------------------------------------------------------------------ */
  /* helpers                                                             */
  /* ------------------------------------------------------------------ */
  const variantForStatus = (s: Task["status"]) =>
    (
      ({
        pending: "secondary",
        "in-progress": "default",
        completed: "success",
        overdue: "destructive",
      }) as const
    )[s] || "secondary"

  const isOverdue = (task: Task) => {
    if (!task || task.status === "completed") return false
    const dueDate = task.due_date ? new Date(task.due_date) : null
    if (!dueDate) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return dueDate < today
  }

  const handleClear = () => {
    setSearch("")
    setStatus("all")
    setPriority("all")
    clearSelection()
  }

  const handleCompleteTask = async (task: Task) => {
    if (!task?.id) return

    try {
      const result = await FakeApiService.completeTask(task.id)
      if (result.success) {
        toast({
          title: "Task Completed! ✅",
          description: `"${task?.title ?? "Task"}" has been marked as completed.`,
          variant: "success",
        })
        refetch()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsTaskModalOpen(true)
  }

  const handleTaskUpdate = (updatedTask: Task) => {
    refetch()
    setEditingTask(null)
    setIsTaskModalOpen(false)
  }

  const handleCreateTask = () => {
    setEditingTask(null)
    setIsTaskModalOpen(true)
  }

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "No date"

    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch {
      return "Invalid date"
    }
  }

  const getOwnerInitials = (name: string | null | undefined) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const renderAssignees = (assignees: Task["assignees"]) => {
    if (!assignees || assignees.length === 0) {
      return (
        <div className="flex items-center text-gray-400 text-sm">
          <User className="w-4 h-4 mr-1" />
          <span>Unassigned</span>
        </div>
      )
    }

    const displayCount = 3
    const visibleAssignees = assignees.slice(0, displayCount)
    const remainingCount = assignees.length - displayCount

    return (
      <div className="flex items-center gap-1">
        {visibleAssignees.map((assignee, index) => (
          <Avatar key={assignee?.id ?? index} className="w-6 h-6">
            <AvatarImage src={assignee?.avatar || "/placeholder.svg"} alt={assignee?.name ?? "User"} />
            <AvatarFallback className="text-xs">{getOwnerInitials(assignee?.name)}</AvatarFallback>
          </Avatar>
        ))}
        {remainingCount > 0 && (
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
            +{remainingCount}
          </div>
        )}
      </div>
    )
  }

  /* ------------------------------------------------------------------ */
  /* render                                                              */
  /* ------------------------------------------------------------------ */
  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <p className="font-semibold">Failed to load tasks</p>
        <p className="text-sm text-red-500">{error}</p>
        <Button onClick={refetch} variant="outline" className="mt-4 bg-transparent">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button and View Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600">
            Manage and track tasks for{" "}
            {department === "All Departments" ? "all departments" : (department ?? "Unknown Department")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              size="sm"
              variant={viewMode === "table" ? "default" : "ghost"}
              onClick={() => setViewMode("table")}
              className={cn(
                "h-8 px-3",
                viewMode === "table" ? "bg-white shadow-sm" : "hover:bg-gray-200 text-gray-600",
              )}
            >
              <List className="w-4 h-4 mr-1" />
              Table
            </Button>
            <Button
              size="sm"
              variant={viewMode === "grid" ? "default" : "ghost"}
              onClick={() => setViewMode("grid")}
              className={cn("h-8 px-3", viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200 text-gray-600")}
            >
              <LayoutGrid className="w-4 h-4 mr-1" />
              Cards
            </Button>
          </div>

          {/* Create Task Button */}
          {canCreateTasks && (
            <Button onClick={handleCreateTask} className="bg-coot-teal hover:bg-coot-teal/90">
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          )}
        </div>
      </div>

      {/* search + filters */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <Input
          placeholder="Search tasks, departments, owners, or tags…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="lg:max-w-sm"
        />

        {/* status filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full lg:w-auto bg-transparent">
              Status <MoreHorizontal className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={status} onValueChange={setStatus}>
              <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="in-progress">In Progress</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="completed">Completed</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="overdue">Overdue</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* priority filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full lg:w-auto bg-transparent">
              Priority <MoreHorizontal className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by priority</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={priority} onValueChange={setPriority}>
              <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="high">High</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="medium">Medium</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="low">Low</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" onClick={handleClear} className="lg:ml-auto">
          Clear Filters
        </Button>
      </div>

      {/* Filter Chips */}
      <FilterChips status={status} priority={priority} onStatusChange={setStatus} onPriorityChange={setPriority} />

      {/* Bulk Actions Toolbar */}
      {canPerformBulkActions && (
        <BulkActionsToolbar selectedTasks={selectedTasks} onClearSelection={clearSelection} onRefresh={refetch} />
      )}

      {/* Content based on view mode */}
      {loading ? (
        <div className="p-12 text-center text-gray-500">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        /* Empty State */
        <EmptyState
          hasFilters={hasActiveFilters}
          hasSearch={hasActiveSearch}
          onCreateTask={handleCreateTask}
          onClearFilters={handleClear}
          canCreateTasks={canCreateTasks}
          department={department ?? "Unknown Department"}
        />
      ) : viewMode === "grid" ? (
        /* Grid/Card View */
        <div className="space-y-4">
          {/* Select All for Grid View */}
          {canPerformBulkActions && (
            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <Checkbox
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected
                }}
                onCheckedChange={handleSelectAll}
                aria-label="Select all tasks"
              />
              <span className="text-sm text-gray-600">Select all {filtered.length} tasks</span>
            </div>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((task) => (
              <TaskCard
                key={task?.id ?? Math.random()}
                task={task}
                isSelected={selectedTaskIds.has(task?.id ?? "")}
                onSelect={canPerformBulkActions ? handleSelectTask : undefined}
                onComplete={handleCompleteTask}
                onEdit={handleEditTask}
                showCheckbox={canPerformBulkActions}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Table View */
        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="overflow-auto max-h-[70vh] relative">
            <Table>
              {/* Sticky Header */}
              <TableHeader className="sticky top-0 bg-white z-20 shadow-sm border-b">
                <TableRow className="hover:bg-transparent">
                  {/* Select All Checkbox - Only for managers+ */}
                  {canPerformBulkActions && (
                    <TableHead className="font-semibold text-gray-900 bg-white w-12">
                      <Checkbox
                        checked={allSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = someSelected
                        }}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all tasks"
                      />
                    </TableHead>
                  )}
                  <TableHead className="font-semibold text-gray-900 bg-white">Title</TableHead>
                  <TableHead className="font-semibold text-gray-900 bg-white hidden md:table-cell">
                    Description
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 bg-white">Status</TableHead>
                  <TableHead className="font-semibold text-gray-900 bg-white">Priority</TableHead>
                  <TableHead className="font-semibold text-gray-900 bg-white">Department</TableHead>
                  <TableHead className="font-semibold text-gray-900 bg-white">Owner</TableHead>
                  <TableHead className="font-semibold text-gray-900 bg-white">Assigned To</TableHead>
                  <TableHead className="font-semibold text-gray-900 bg-white">Due Date</TableHead>
                  <TableHead className="font-semibold text-gray-900 bg-white w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody>
                {filtered.map((task) => (
                  <TableRow
                    key={task?.id ?? Math.random()}
                    className={cn(
                      "group transition-colors duration-200 ease-in-out hover:bg-gray-50",
                      isOverdue(task) && "border-l-4 border-l-red-400 bg-red-50/30",
                      selectedTaskIds.has(task?.id ?? "") && "bg-blue-50/50 hover:bg-blue-50/70",
                    )}
                  >
                    {/* Row Checkbox - Only for managers+ */}
                    {canPerformBulkActions && (
                      <TableCell>
                        <Checkbox
                          checked={selectedTaskIds.has(task?.id ?? "")}
                          onCheckedChange={(checked) => handleSelectTask(task?.id ?? "", checked as boolean)}
                          aria-label={`Select task: ${task?.title ?? "Unknown Task"}`}
                        />
                      </TableCell>
                    )}

                    {/* Title Column */}
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className={cn(isOverdue(task) && "text-red-700")}>{task?.title ?? "Untitled Task"}</span>
                        {/* Show description on mobile when hidden column is not visible */}
                        <div className="md:hidden text-sm text-gray-600 line-clamp-2 mt-1">
                          {task?.description ?? "No description"}
                        </div>
                        {(task?.tags ?? []).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(task?.tags ?? []).slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag ?? "Tag"}
                              </Badge>
                            ))}
                            {(task?.tags ?? []).length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{(task?.tags ?? []).length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Description Column - Hidden on mobile */}
                    <TableCell className="hidden md:table-cell max-w-xs">
                      <span className="text-sm text-gray-600 line-clamp-2">
                        {task?.description ?? "No description"}
                      </span>
                    </TableCell>

                    {/* Status Column */}
                    <TableCell>
                      <Badge variant={variantForStatus(task?.status ?? "pending")} className="capitalize">
                        {(task?.status ?? "pending").replace("-", " ")}
                      </Badge>
                    </TableCell>

                    {/* Priority Column */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "capitalize",
                          (task?.priority ?? "low") === "high" && "border-red-200 text-red-700 bg-red-50",
                          (task?.priority ?? "low") === "medium" && "border-yellow-200 text-yellow-700 bg-yellow-50",
                          (task?.priority ?? "low") === "low" && "border-green-200 text-green-700 bg-green-50",
                        )}
                      >
                        {task?.priority ?? "low"}
                      </Badge>
                    </TableCell>

                    {/* Department Column */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {task?.department?.name ?? "No Department"}
                        </Badge>
                      </div>
                    </TableCell>

                    {/* Owner Column */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage
                            src={task?.owner?.avatar || "/placeholder.svg"}
                            alt={task?.owner?.name ?? "Owner"}
                          />
                          <AvatarFallback className="text-xs">{getOwnerInitials(task?.owner?.name)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm truncate max-w-20">{task?.owner?.name ?? "Unassigned"}</span>
                      </div>
                    </TableCell>

                    {/* Assigned To Column */}
                    <TableCell>{renderAssignees(task?.assignees)}</TableCell>

                    {/* Due Date Column */}
                    <TableCell>
                      <span className={cn("text-sm", isOverdue(task) && "text-red-600 font-medium")}>
                        {formatDate(task?.due_date)}
                        {isOverdue(task) && <span className="ml-1 text-red-500">⚠️</span>}
                      </span>
                    </TableCell>

                    {/* Actions Column */}
                    <TableCell>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {(task?.status ?? "pending") !== "completed" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCompleteTask(task)}
                            className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-700"
                            title="Mark as complete"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditTask(task)}
                          className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700"
                          title="Edit task"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Task Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false)
          setEditingTask(null)
        }}
        task={editingTask}
        onTaskUpdate={handleTaskUpdate}
      />
    </div>
  )
}

export default TasksContent
