"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Clock, Calendar, Coffee, LogOut, Loader2 } from "lucide-react"
import { ReminderModal } from "./reminder-modal"
import { ReminderCard } from "./reminder-card"
import { useToast } from "@/hooks/use-toast"

// TODO(v0): replace with real useReminders() once backend is wired
const mockRemindersData = [
  {
    id: "1",
    title: "Clock in at 8:00",
    description: "Daily work reminder",
    time: "08:00",
    recurrence: "daily",
    channels: ["inapp"],
    status: "active",
  },
  {
    id: "2",
    title: "Daily meeting at 9:00",
    description: "Team standup",
    time: "09:00",
    recurrence: "weekdays",
    channels: ["inapp"],
    status: "active",
  },
]

function useRemindersMock() {
  const [data, setData] = useState(mockRemindersData)
  const refetch = () => setData([...data])
  const createReminder = async (rem: any) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newReminder = {
      id: Date.now().toString(),
      title: rem.text || rem.title,
      description: rem.description || `${rem.recurrence} reminder`,
      time: rem.time,
      recurrence: rem.recurrence,
      channels: rem.channels || ["inapp"],
      status: "active",
    }
    setData((prev) => [newReminder, ...prev])
  }
  const updateReminder = async (id: string, rem: any) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    setData((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              title: rem.text || rem.title || r.title,
              description: rem.description || r.description,
              time: rem.time || r.time,
              recurrence: rem.recurrence || r.recurrence,
              channels: rem.channels || r.channels,
            }
          : r,
      ),
    )
  }
  const deleteReminder = async (id: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    setData((prev) => prev.filter((r) => r.id !== id))
  }
  return { data, createReminder, updateReminder, deleteReminder, refetch }
}

const quickTemplates = [
  {
    id: "daily-clock-in",
    title: "Clock in at 8:00",
    time: "08:00",
    recurrence: "daily",
    description: "Daily work reminder",
    icon: Clock,
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
  },
  {
    id: "daily-meeting",
    title: "Daily meeting at 9:00",
    time: "09:00",
    recurrence: "weekdays",
    description: "Team standup meeting",
    icon: Calendar,
    color: "bg-green-50 border-green-200 hover:bg-green-100",
  },
  {
    id: "lunch-break",
    title: "Lunch break reminder",
    time: "12:00",
    recurrence: "weekdays",
    description: "Time for lunch break",
    icon: Coffee,
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
  },
  {
    id: "end-of-day",
    title: "End of workday - clock out",
    time: "17:00",
    recurrence: "weekdays",
    description: "Time to clock out",
    icon: LogOut,
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
  },
]

export function RemindersContent() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingReminder, setEditingReminder] = useState<any>(null)
  const [creatingTemplate, setCreatingTemplate] = useState<string | null>(null)
  const { data: reminders, createReminder, updateReminder, deleteReminder } = useRemindersMock()
  const { toast } = useToast()

  const handleCreateReminder = async (data: any) => {
    try {
      if (editingReminder) {
        await updateReminder(editingReminder.id, data)
        toast({
          title: "Reminder updated",
          description: `"${data.text}" has been updated successfully.`,
        })
        setEditingReminder(null)
      } else {
        await createReminder(data)
        toast({
          title: "Reminder created",
          description: `"${data.text}" has been added to your reminders.`,
        })
      }
      setModalOpen(false)
    } catch (error) {
      toast({
        title: "Failed to save reminder",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleTemplateClick = async (template: (typeof quickTemplates)[0]) => {
    try {
      setCreatingTemplate(template.id)

      await createReminder({
        title: template.title,
        description: template.description,
        time: template.time,
        recurrence: template.recurrence,
        channels: ["inapp"],
      })

      toast({
        title: "Reminder scheduled!",
        description: `"${template.title}" has been added to your active reminders.`,
      })
    } catch (error) {
      toast({
        title: "Failed to create reminder",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setCreatingTemplate(null)
    }
  }

  const handleEditReminder = (reminder: any) => {
    setEditingReminder(reminder)
    setModalOpen(true)
  }

  const handleDeleteReminder = async (id: string) => {
    await deleteReminder(id)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingReminder(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reminders</h1>
          <p className="text-muted-foreground">Manage your daily reminders and notifications</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Reminder
        </Button>
      </div>

      {/* Quick Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickTemplates.map((template) => {
              const Icon = template.icon
              const isCreating = creatingTemplate === template.id

              return (
                <Button
                  key={template.id}
                  variant="outline"
                  className={`h-auto p-4 flex flex-col items-center gap-3 ${template.color} transition-colors`}
                  onClick={() => handleTemplateClick(template)}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  ) : (
                    <Icon className="h-6 w-6 text-muted-foreground" />
                  )}
                  <div className="text-center">
                    <div className="font-medium text-sm">{template.title}</div>
                    <div className="text-xs text-muted-foreground capitalize">{template.recurrence}</div>
                  </div>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Active Reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Active Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          {reminders.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No reminders yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first reminder using the templates above or the "New Reminder" button.
              </p>
              <Button onClick={() => setModalOpen(true)} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Reminder
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reminders.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  onEdit={handleEditReminder}
                  onDelete={handleDeleteReminder}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reminder Modal */}
      <ReminderModal
        open={modalOpen}
        onClose={handleCloseModal}
        onCreate={handleCreateReminder}
        editingReminder={editingReminder}
      />
    </div>
  )
}
