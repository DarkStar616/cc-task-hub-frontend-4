"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter, X } from "lucide-react"

interface SearchAndFiltersProps {
  search: string
  status: string
  priority: string
  onSearchChange: (search: string) => void
  onStatusChange: (status: string) => void
  onPriorityChange: (priority: string) => void
  onClearFilters: () => void
}

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "Pending", label: "Pending" },
  { value: "In-Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Overdue", label: "Overdue" },
] as const

const priorityOptions = [
  { value: "all", label: "All Priority" },
  { value: "High", label: "High" },
  { value: "Medium", label: "Medium" },
  { value: "Low", label: "Low" },
] as const

export function SearchAndFilters({
  search,
  status,
  priority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onClearFilters,
}: SearchAndFiltersProps) {
  const hasActiveFilters = !!search || status !== "all" || priority !== "all"

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search tasks by title or tag..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-10"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 space-y-3 sm:space-y-0 sm:flex sm:gap-3">
          {/* Status Filter */}
          <div className="flex-1">
            <Select value={status} onValueChange={onStatusChange}>
              <SelectTrigger className="filter-button h-10">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority Filter */}
          <div className="flex-1">
            <Select value={priority} onValueChange={onPriorityChange}>
              <SelectTrigger className="filter-button h-10">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <SelectValue placeholder="Priority" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="h-10 px-4 text-gray-600 hover:text-gray-900 bg-transparent"
          >
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
