"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Clock, MessageSquare, Phone, MoreVertical, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ReminderCardProps {
  reminder: {
    id: string
    title: string
    description: string
    time: string
    recurrence: string
    channels: string[]
    status: string
  }
  onEdit: (reminder: any) => void
  onDelete: (id: string) => void
}

export function ReminderCard({ reminder, onEdit, onDelete }: ReminderCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await onDelete(reminder.id)
      toast({
        title: "Reminder deleted",
        description: `"${reminder.title}" has been removed from your reminders.`,
      })
    } catch (error) {
      toast({
        title: "Failed to delete reminder",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = () => {
    onEdit(reminder)
  }

  return (
    <Card className="relative group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm">{reminder.title}</h3>
              <Badge variant={reminder.status === "active" ? "default" : "secondary"} className="text-xs">
                {reminder.status}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground">{reminder.description}</p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(reminder.time)}
              </div>
              <div className="capitalize">{reminder.recurrence}</div>
            </div>

            <div className="flex items-center gap-2">
              {reminder.channels.map((channel) => (
                <Badge key={channel} variant="outline" className="text-xs flex items-center gap-1">
                  {channel === "inapp" ? (
                    <>
                      <MessageSquare className="h-3 w-3" />
                      In-App
                    </>
                  ) : (
                    <>
                      <Phone className="h-3 w-3" />
                      WhatsApp
                    </>
                  )}
                </Badge>
              ))}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={isDeleting}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="cursor-pointer text-destructive focus:text-destructive"
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}
