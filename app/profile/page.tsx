"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { User, Camera } from "lucide-react"

interface UserProfile {
  name: string
  email: string
  avatarUrl?: string
}

export default function ProfilePage() {
  const { profile } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userData, setUserData] = useState<UserProfile>({
    name: "",
    email: "",
    avatarUrl: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("")

  useEffect(() => {
    // Mock API call - replace with real API
    const fetchUserData = async () => {
      try {
        // const user = await api.getUser()
        // Mock data from auth profile
        const mockUser = {
          name: profile?.full_name || "",
          email: profile?.email || "",
          avatarUrl: profile?.avatar_url || "",
        }
        setUserData(mockUser)
        setAvatarPreview(mockUser.avatarUrl || "")
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [profile, toast])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!userData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!userData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive",
        })
        return
      }

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive",
        })
        return
      }

      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSaving(true)
    try {
      // Mock API call - replace with real API
      // await api.updateUser({
      //   name: userData.name,
      //   email: userData.email,
      //   avatarFile: avatarFile
      // })

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6 p-6">
          <Card>
            <CardContent className="flex items-center justify-center py-16">
              <LoadingSpinner />
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader className="flex items-center gap-2">
            <User className="w-5 h-5 text-coot-teal" />
            <CardTitle className="text-2xl">Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24 border-2 border-gray-200">
                  <AvatarImage src={avatarPreview || "/placeholder.svg"} alt="Profile picture" />
                  <AvatarFallback className="bg-coot-teal text-white text-xl">
                    {userData.name
                      ? userData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : userData.email[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <Label htmlFor="avatar-upload" asChild>
                    <Button type="button" variant="outline" size="sm" className="cursor-pointer bg-transparent">
                      <Camera className="w-4 h-4 mr-2" />
                      Change Avatar
                    </Button>
                  </Label>
                </div>
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={userData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={errors.name ? "border-red-500 focus:border-red-500" : ""}
                  placeholder="Enter your full name"
                  required
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500 focus:border-red-500" : ""}
                  placeholder="Enter your email address"
                  required
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={saving} className="bg-coot-teal hover:bg-coot-teal/90 text-white">
                  {saving ? (
                    <>
                      <LoadingSpinner className="w-4 h-4 mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
