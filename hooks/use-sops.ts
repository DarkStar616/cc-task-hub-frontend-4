"use client"

import { useState, useCallback } from "react"

export interface SOP {
  id: string
  title: string
  description: string
  department: string
  tags: string[]
  fileSize: string
  createdAt: string
  updatedAt: string
  createdBy: string
}

type FetchOptions = {
  department?: string
  search?: string
  tags?: string[]
}

// Mock SOPs data with proper department scoping
const mockSOPsData: SOP[] = [
  {
    id: "1",
    title: "Daily Cleaning Checklist",
    description: "Comprehensive daily cleaning procedures for guest rooms and common areas",
    department: "Housekeeping",
    tags: ["cleaning", "daily", "checklist"],
    fileSize: "2.1 MB",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    createdBy: "admin@cootclub.com",
  },
  {
    id: "2",
    title: "Guest Check-in Procedures",
    description: "Step-by-step guide for processing guest arrivals and room assignments",
    department: "Front-of-House",
    tags: ["checkin", "guests", "procedures"],
    fileSize: "1.8 MB",
    createdAt: "2024-01-14T14:30:00Z",
    updatedAt: "2024-01-14T14:30:00Z",
    createdBy: "manager@cootclub.com",
  },
  {
    id: "3",
    title: "Emergency Response Protocol",
    description: "Critical procedures for handling emergency situations and evacuations",
    department: "GLOBAL",
    tags: ["emergency", "safety", "protocol"],
    fileSize: "3.2 MB",
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T09:15:00Z",
    createdBy: "admin@cootclub.com",
  },
  {
    id: "4",
    title: "Food Safety Guidelines",
    description: "Health and safety standards for food preparation and storage",
    department: "Kitchen",
    tags: ["food", "safety", "health"],
    fileSize: "2.7 MB",
    createdAt: "2024-01-12T16:45:00Z",
    updatedAt: "2024-01-12T16:45:00Z",
    createdBy: "chef@cootclub.com",
  },
  {
    id: "5",
    title: "IT Security Policy",
    description: "Company-wide information technology security guidelines and best practices",
    department: "GLOBAL",
    tags: ["security", "IT", "policy"],
    fileSize: "1.5 MB",
    createdAt: "2024-01-11T11:20:00Z",
    updatedAt: "2024-01-11T11:20:00Z",
    createdBy: "admin@cootclub.com",
  },
  {
    id: "6",
    title: "Laundry Processing Guide",
    description: "Detailed instructions for processing and managing guest laundry services",
    department: "Housekeeping",
    tags: ["laundry", "processing", "guide"],
    fileSize: "1.9 MB",
    createdAt: "2024-01-10T13:10:00Z",
    updatedAt: "2024-01-10T13:10:00Z",
    createdBy: "supervisor@cootclub.com",
  },
  {
    id: "7",
    title: "Customer Service Standards",
    description: "Excellence standards and communication guidelines for guest interactions",
    department: "Front-of-House",
    tags: ["service", "standards", "communication"],
    fileSize: "2.3 MB",
    createdAt: "2024-01-09T08:30:00Z",
    updatedAt: "2024-01-09T08:30:00Z",
    createdBy: "manager@cootclub.com",
  },
]

export function useSOPs() {
  const [data, setData] = useState<SOP[]>(mockSOPsData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSOPs = useCallback(async (options: FetchOptions = {}) => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      let filteredSOPs = [...mockSOPsData]

      // Department filtering: show department-specific + GLOBAL SOPs
      if (options.department && options.department !== "All Departments") {
        filteredSOPs = filteredSOPs.filter(
          (sop) => sop.department === options.department || sop.department === "GLOBAL",
        )
      }

      // Search filtering
      if (options.search) {
        const searchLower = options.search.toLowerCase()
        filteredSOPs = filteredSOPs.filter(
          (sop) =>
            sop.title.toLowerCase().includes(searchLower) ||
            sop.description.toLowerCase().includes(searchLower) ||
            sop.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
        )
      }

      // Tags filtering
      if (options.tags && options.tags.length > 0) {
        filteredSOPs = filteredSOPs.filter((sop) => options.tags!.some((tag) => sop.tags.includes(tag)))
      }

      setData(filteredSOPs)
    } catch (err) {
      setError("Failed to fetch SOPs")
      console.error("Error fetching SOPs:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const uploadSOP = useCallback(async (sopData: Omit<SOP, "id" | "createdBy">) => {
    try {
      setLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newSOP: SOP = {
        ...sopData,
        id: Date.now().toString(),
        createdBy: "current-user@cootclub.com",
      }

      // Add to mock data
      mockSOPsData.unshift(newSOP)
      setData((prev) => [newSOP, ...prev])
    } catch (err) {
      setError("Failed to upload SOP")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateSOP = useCallback(async (id: string, updates: Partial<SOP>) => {
    try {
      setLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedSOP = { ...updates, updatedAt: new Date().toISOString() }

      // Update in mock data
      const index = mockSOPsData.findIndex((sop) => sop.id === id)
      if (index !== -1) {
        mockSOPsData[index] = { ...mockSOPsData[index], ...updatedSOP }
      }

      setData((prev) => prev.map((sop) => (sop.id === id ? { ...sop, ...updatedSOP } : sop)))
    } catch (err) {
      setError("Failed to update SOP")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteSOP = useCallback(async (id: string) => {
    try {
      setLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Remove from mock data
      const index = mockSOPsData.findIndex((sop) => sop.id === id)
      if (index !== -1) {
        mockSOPsData.splice(index, 1)
      }

      setData((prev) => prev.filter((sop) => sop.id !== id))
    } catch (err) {
      setError("Failed to delete SOP")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    data,
    loading,
    error,
    fetchSOPs,
    uploadSOP,
    updateSOP,
    deleteSOP,
  }
}
