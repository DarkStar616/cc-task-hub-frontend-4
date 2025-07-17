"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Task } from "./tasks-content"

interface FilterChipsProps {
  status: "all" | Task["status"]
  priority: "all" | Task["priority"]
  onStatusChange: (status: "all" | Task["status"]) => void
  onPriorityChange: (priority: "all" | Task["priority"]) => void
}

export function FilterChips({ status, priority, onStatusChange, onPriorityChange }: FilterChipsProps) {
  const hasActiveFilters = status !== "all" || priority !== "all"

  if (!hasActiveFilters) {
    return null
  }

  const handleRemoveStatus = () => {
    onStatusChange("all")
  }

  const handleRemovePriority = () => {
    onPriorityChange("all")
  }

  const formatStatus = (status: Task["status"]) => {
    return status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const formatPriority = (priority: Task["priority"]) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1)
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-gray-600 font-medium">Active filters:</span>

      {/* Status Filter Chip */}
      {status !== "all" && (
        <Badge
          variant="outline"
          className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 transition-colors duration-200 pr-1"
        >
          <span className="mr-1">Status: {formatStatus(status)}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRemoveStatus}
            className="h-4 w-4 p-0 hover:bg-blue-300 rounded-full ml-1"
            aria-label={`Remove status filter: ${status}`}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {/* Priority Filter Chip */}
      {priority !== "all" && (
        <Badge variant="outline" className={cn("transition-colors duration-200 pr-1", getPriorityColor(priority))}>
          <span className="mr-1">Priority: {formatPriority(priority)}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRemovePriority}
            className={cn(
              "h-4 w-4 p-0 rounded-full ml-1",
              priority === "high" && "hover:bg-red-300",
              priority === "medium" && "hover:bg-yellow-300",
              priority === "low" && "hover:bg-green-300",
            )}
            aria-label={`Remove priority filter: ${priority}`}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
    </div>
  )
}
