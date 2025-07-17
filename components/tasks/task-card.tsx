"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, Edit2, Calendar, User, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Task } from "./tasks-content"

interface TaskCardProps {
  task: Task
  isSelected?: boolean
  onSelect?: (taskId: string, checked: boolean) => void
  onComplete?: (task: Task) => void
  onEdit?: (task: Task) => void
  showCheckbox?: boolean
}

export function TaskCard({
  task,
  isSelected = false,
  onSelect,
  onComplete,
  onEdit,
  showCheckbox = false,
}: TaskCardProps) {
  const isOverdue = () => {
    if (task.status === "completed") return false
    const dueDate = new Date(task.due_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return dueDate < today
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50"
      case "medium":
        return "border-yellow-200 bg-yellow-50"
      case "low":
        return "border-green-200 bg-green-50"
      default:
        return "border-gray-200 bg-white"
    }
  }

  const getStatusVariant = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "in-progress":
        return "default"
      case "completed":
        return "success"
      case "overdue":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const handleCompleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onComplete) {
      onComplete(task)
    }
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onEdit) {
      onEdit(task)
    }
  }

  const handleSelectChange = (checked: boolean) => {
    if (onSelect) {
      onSelect(task.id, checked)
    }
  }

  return (
    <Card
      className={cn(
        "group relative transition-all duration-200 hover:shadow-md cursor-pointer",
        getPriorityColor(task.priority),
        isSelected && "ring-2 ring-blue-500 ring-offset-2",
        isOverdue() && "border-red-400 bg-red-50",
      )}
    >
      {/* Selection Checkbox */}
      {showCheckbox && (
        <div className="absolute top-3 left-3 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={handleSelectChange}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Select task: ${task.title}`}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {task.status !== "completed" && onComplete && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCompleteClick}
            className="h-8 w-8 p-0 bg-white/90 hover:bg-green-100 hover:text-green-700 shadow-sm border border-gray-200"
            title="Mark as complete"
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
        {onEdit && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleEditClick}
            className="h-8 w-8 p-0 bg-white/90 hover:bg-blue-100 hover:text-blue-700 shadow-sm border border-gray-200"
            title="Edit task"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <CardContent className={cn("p-4", showCheckbox && "pl-10")}>
        {/* Status Badge */}
        <div className="flex items-start justify-between mb-3">
          <Badge variant={getStatusVariant(task.status)} className="capitalize">
            {task.status.replace("-", " ")}
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              "capitalize text-xs",
              task.priority === "high" && "border-red-200 text-red-700 bg-red-100",
              task.priority === "medium" && "border-yellow-200 text-yellow-700 bg-yellow-100",
              task.priority === "low" && "border-green-200 text-green-700 bg-green-100",
            )}
          >
            {task.priority}
          </Badge>
        </div>

        {/* Title and Description */}
        <div className="space-y-2 mb-4">
          <h3 className={cn("font-semibold text-gray-900 line-clamp-2", isOverdue() && "text-red-700")}>
            {task.title}
          </h3>
          {task.description && <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>}
        </div>

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {task.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {task.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{task.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Due Date */}
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className={cn("text-sm", isOverdue() && "text-red-600 font-medium")}>
            {formatDate(task.due_date)}
            {isOverdue() && <span className="ml-1">⚠️</span>}
          </span>
        </div>

        {/* Owner and Assignees */}
        <div className="space-y-2">
          {task.owner && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={task.owner.avatar || "/placeholder.svg"} alt={task.owner.name} />
                  <AvatarFallback className="text-xs">
                    {task.owner.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600 truncate">{task.owner.name}</span>
              </div>
            </div>
          )}

          {task.assignees && task.assignees.length > 0 && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <div className="flex items-center gap-1">
                {task.assignees.slice(0, 3).map((assignee, index) => (
                  <Avatar key={assignee.id} className="w-6 h-6">
                    <AvatarImage src={assignee.avatar || "/placeholder.svg"} alt={assignee.name} />
                    <AvatarFallback className="text-xs">
                      {assignee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {task.assignees.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-xs text-gray-600">+{task.assignees.length - 3}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
