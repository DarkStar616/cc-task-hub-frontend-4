"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, UserPlus, Trash2, X } from "lucide-react"
import { FakeApiService } from "@/lib/fake-api"
import { useToast } from "@/hooks/use-toast"
import { useDepartment } from "@/components/department/department-provider"
import type { Task } from "./tasks-content"

interface BulkActionsToolbarProps {
  selectedTasks: Task[]
  onClearSelection: () => void
  onRefresh: () => void
}

export function BulkActionsToolbar({ selectedTasks, onClearSelection, onRefresh }: BulkActionsToolbarProps) {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedAssignee, setSelectedAssignee] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)

  const { toast } = useToast()
  const { department } = useDepartment()

  // Don't show toolbar if no tasks selected
  if (selectedTasks.length === 0) {
    return null
  }

  // Check if tasks are from different departments
  const departments = [...new Set(selectedTasks.map((task) => task.department))]
  const crossDepartment = departments.length > 1

  // Count completable tasks (not already completed)
  const completableTasks = selectedTasks.filter((task) => task.status !== "completed")

  const handleMarkComplete = async () => {
    if (completableTasks.length === 0) return

    setIsProcessing(true)
    try {
      const results = await Promise.allSettled(completableTasks.map((task) => FakeApiService.completeTask(task.id)))

      const successful = results.filter((result) => result.status === "fulfilled").length
      const failed = results.filter((result) => result.status === "rejected").length

      if (successful > 0) {
        toast({
          title: `${successful} Task${successful === 1 ? "" : "s"} Completed! ✅`,
          description: `Successfully marked ${successful} task${successful === 1 ? "" : "s"} as completed.`,
          variant: "success",
        })
      }

      if (failed > 0) {
        toast({
          title: "Some tasks failed to complete",
          description: `${failed} task${failed === 1 ? "" : "s"} could not be completed. Please try again.`,
          variant: "destructive",
        })
      }

      onRefresh()
      onClearSelection()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete tasks. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAssign = async () => {
    if (!selectedAssignee) return

    setIsProcessing(true)
    try {
      const results = await Promise.allSettled(
        selectedTasks.map((task) => FakeApiService.assignTask(task.id, selectedAssignee)),
      )

      const successful = results.filter((result) => result.status === "fulfilled").length
      const failed = results.filter((result) => result.status === "rejected").length

      if (successful > 0) {
        toast({
          title: `${successful} Task${successful === 1 ? "" : "s"} Assigned! 👤`,
          description: `Successfully assigned ${successful} task${successful === 1 ? "" : "s"}.`,
          variant: "success",
        })
      }

      if (failed > 0) {
        toast({
          title: "Some assignments failed",
          description: `${failed} task${failed === 1 ? "" : "s"} could not be assigned. Please try again.`,
          variant: "destructive",
        })
      }

      onRefresh()
      onClearSelection()
      setIsAssignModalOpen(false)
      setSelectedAssignee("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign tasks. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDelete = async () => {
    setIsProcessing(true)
    try {
      const results = await Promise.allSettled(selectedTasks.map((task) => FakeApiService.deleteTask(task.id)))

      const successful = results.filter((result) => result.status === "fulfilled").length
      const failed = results.filter((result) => result.status === "rejected").length

      if (successful > 0) {
        toast({
          title: `${successful} Task${successful === 1 ? "" : "s"} Deleted! 🗑️`,
          description: `Successfully deleted ${successful} task${successful === 1 ? "" : "s"}.`,
          variant: "success",
        })
      }

      if (failed > 0) {
        toast({
          title: "Some deletions failed",
          description: `${failed} task${failed === 1 ? "" : "s"} could not be deleted. Please try again.`,
          variant: "destructive",
        })
      }

      onRefresh()
      onClearSelection()
      setIsDeleteModalOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete tasks. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      {/* Bulk Actions Toolbar */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-in slide-in-from-top-2 duration-200">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {selectedTasks.length} selected
            </Badge>
            {crossDepartment && (
              <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50">
                Multiple departments
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Mark Complete */}
            {completableTasks.length > 0 && (
              <Button
                size="sm"
                onClick={handleMarkComplete}
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="w-4 h-4 mr-1" />
                Complete ({completableTasks.length})
              </Button>
            )}

            {/* Assign */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsAssignModalOpen(true)}
              disabled={isProcessing}
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <UserPlus className="w-4 h-4 mr-1" />
              Assign
            </Button>

            {/* Delete */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={isProcessing}
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>

            {/* Clear Selection */}
            <Button size="sm" variant="ghost" onClick={onClearSelection} className="text-gray-600">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Assign Modal */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Tasks</DialogTitle>
            <DialogDescription>
              Assign {selectedTasks.length} selected task{selectedTasks.length === 1 ? "" : "s"} to a team member.
              {crossDepartment && (
                <span className="block mt-2 text-amber-600">
                  ⚠️ Selected tasks are from multiple departments: {departments.join(", ")}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Assignee</label>
              <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team member..." />
                </SelectTrigger>
                <SelectContent>
                  {/* Mock assignees - in real app, filter by department */}
                  <SelectItem value="john-doe">John Doe</SelectItem>
                  <SelectItem value="jane-smith">Jane Smith</SelectItem>
                  <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                  <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignModalOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={!selectedAssignee || isProcessing}>
              {isProcessing ? "Assigning..." : "Assign Tasks"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tasks</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedTasks.length} selected task
              {selectedTasks.length === 1 ? "" : "s"}? This action cannot be undone.
              {crossDepartment && (
                <span className="block mt-2 text-amber-600">
                  ⚠️ Tasks from multiple departments will be deleted: {departments.join(", ")}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isProcessing}>
              {isProcessing ? "Deleting..." : "Delete Tasks"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
