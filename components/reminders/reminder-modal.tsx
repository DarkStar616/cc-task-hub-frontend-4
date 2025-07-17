"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock, Repeat, MessageSquare, Phone, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ReminderModalProps {
  open: boolean
  onClose: () => void
  onCreate: (data: ReminderFormData) => void
  editingReminder?: any
}

interface ReminderFormData {
  text: string
  time: string
  recurrence: "daily" | "weekdays" | "custom"
  channels: string[]
  description?: string
}

export function ReminderModal({ open, onClose, onCreate, editingReminder }: ReminderModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ReminderFormData>({
    text: "",
    time: "",
    recurrence: "daily",
    channels: ["inapp"],
    description: "",
  })
  const { toast } = useToast()

  // Pre-populate form when editing
  useEffect(() => {
    if (editingReminder) {
      setFormData({
        text: editingReminder.title || "",
        time: editingReminder.time || "",
        recurrence: editingReminder.recurrence || "daily",
        channels: editingReminder.channels || ["inapp"],
        description: editingReminder.description || "",
      })
    } else {
      setFormData({
        text: "",
        time: "",
        recurrence: "daily",
        channels: ["inapp"],
        description: "",
      })
    }
  }, [editingReminder, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.text.trim() || !formData.time) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (formData.channels.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one notification channel.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      await onCreate(formData)
    } catch (error) {
      console.error("Failed to save reminder:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChannelChange = (channel: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      channels: checked ? [...prev.channels, channel] : prev.channels.filter((c) => c !== channel),
    }))
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingReminder ? "Edit Reminder" : "Create New Reminder"}</DialogTitle>
          <DialogDescription>
            {editingReminder
              ? "Update your reminder settings below."
              : "Set up a new reminder with your preferred time and notification settings."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text">Reminder Text *</Label>
            <Input
              id="text"
              placeholder="Enter reminder text..."
              value={formData.text}
              onChange={(e) => setFormData((prev) => ({ ...prev, text: e.target.value }))}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Optional description..."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time *</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                className="pl-10"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recurrence">Recurrence</Label>
            <Select
              value={formData.recurrence}
              onValueChange={(value: "daily" | "weekdays" | "custom") =>
                setFormData((prev) => ({ ...prev, recurrence: value }))
              }
              disabled={loading}
            >
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Repeat className="h-4 w-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekdays">Weekdays</SelectItem>
                <SelectItem value="custom">Custom...</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Notification Channels *</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inapp"
                  checked={formData.channels.includes("inapp")}
                  onCheckedChange={(checked) => handleChannelChange("inapp", checked as boolean)}
                  disabled={loading}
                />
                <Label htmlFor="inapp" className="flex items-center gap-2 cursor-pointer">
                  <MessageSquare className="h-4 w-4" />
                  In-App
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="whatsapp"
                  checked={formData.channels.includes("whatsapp")}
                  onCheckedChange={(checked) => handleChannelChange("whatsapp", checked as boolean)}
                  disabled={loading}
                />
                <Label htmlFor="whatsapp" className="flex items-center gap-2 cursor-pointer">
                  <Phone className="h-4 w-4" />
                  WhatsApp
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.text.trim() || !formData.time}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingReminder ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
