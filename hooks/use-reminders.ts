"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export interface Reminder {
  id: string
  text: string
  time: string
  recurrence: "daily" | "weekdays" | "custom"
  channels: {
    inApp: boolean
    whatsapp: boolean
  }
  isActive: boolean
  createdAt: string
  userId: string
}

export interface CreateReminderData {
  text: string
  time: string
  recurrence: "daily" | "weekdays" | "custom"
  channels: string[]
}

// Mock API functions - replace with actual API calls
const mockCreateReminder = async (data: CreateReminderData): Promise<Reminder> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    id: Date.now().toString(),
    text: data.text,
    time: data.time,
    recurrence: data.recurrence,
    channels: {
      inApp: data.channels.includes("inapp"),
      whatsapp: data.channels.includes("whatsapp"),
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    userId: "current-user-id",
  }
}

const mockFetchReminders = async (): Promise<Reminder[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return [
    {
      id: "1",
      text: "Daily standup meeting",
      time: "09:00",
      recurrence: "weekdays",
      channels: { inApp: true, whatsapp: false },
      isActive: true,
      createdAt: "2024-01-15T09:00:00Z",
      userId: "current-user-id",
    },
    {
      id: "2",
      text: "Take medication",
      time: "20:00",
      recurrence: "daily",
      channels: { inApp: true, whatsapp: true },
      isActive: true,
      createdAt: "2024-01-14T20:00:00Z",
      userId: "current-user-id",
    },
  ]
}

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const { toast } = useToast()

  const fetchReminders = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/reminders')
      // const data = await response.json()
      const data = await mockFetchReminders()
      setReminders(data)
    } catch (error) {
      console.error("Failed to fetch reminders:", error)
      toast({
        title: "Error",
        description: "Failed to load reminders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createReminder = async (data: CreateReminderData): Promise<Reminder> => {
    try {
      setCreating(true)
      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/reminders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // })
      // const newReminder = await response.json()
      const newReminder = await mockCreateReminder(data)

      setReminders((prev) => [newReminder, ...prev])
      return newReminder
    } catch (error) {
      console.error("Failed to create reminder:", error)
      throw error
    } finally {
      setCreating(false)
    }
  }

  const refreshReminderList = () => {
    fetchReminders()
  }

  useEffect(() => {
    fetchReminders()
  }, [])

  return {
    reminders,
    loading,
    creating,
    createReminder,
    refreshReminderList,
    fetchReminders,
  }
}
