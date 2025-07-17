"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Search, Filter } from "lucide-react"

interface EmptyStateProps {
  hasFilters: boolean
  hasSearch: boolean
  onCreateTask?: () => void
  onClearFilters?: () => void
  canCreateTasks: boolean
  department: string
}

export function EmptyState({
  hasFilters,
  hasSearch,
  onCreateTask,
  onClearFilters,
  canCreateTasks,
  department,
}: EmptyStateProps) {
  // Different messages based on context
  const getEmptyStateContent = () => {
    if (hasFilters || hasSearch) {
      return {
        icon: Search,
        title: "No tasks match your filters",
        description: "Try adjusting your search terms or filters to find what you're looking for.",
        action: onClearFilters && (
          <Button onClick={onClearFilters} variant="outline" className="mt-4 bg-transparent">
            <Filter className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        ),
      }
    }

    return {
      icon: Plus,
      title: "No tasks here—create one!",
      description: `Get started by creating your first task${
        department !== "All Departments" ? ` for ${department}` : ""
      }.`,
      action: canCreateTasks && onCreateTask && (
        <Button onClick={onCreateTask} className="bg-coot-teal hover:bg-coot-teal/90 mt-4">
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      ),
    }
  }

  const { icon: Icon, title, description, action } = getEmptyStateContent()

  return (
    <Card className="border-dashed border-2 border-gray-200">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>

        <p className="text-gray-600 mb-6 max-w-md leading-relaxed">{description}</p>

        {action}

        {!canCreateTasks && !hasFilters && !hasSearch && (
          <p className="text-sm text-gray-500 mt-4">Contact your manager to create tasks for this department.</p>
        )}
      </CardContent>
    </Card>
  )
}
