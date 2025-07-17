"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth/auth-provider"
import { useDepartment } from "@/components/department/department-provider"
import { AlertTriangle, Upload, X, Globe, Building2 } from "lucide-react"

interface SOPUploadModalProps {
  open: boolean
  onClose: () => void
  onUpload: (data: any) => Promise<void>
}

const DEPARTMENTS = ["Housekeeping", "Front-of-House", "Kitchen", "Maintenance", "Administration"]

export function SOPUploadModal({ open, onClose, onUpload }: SOPUploadModalProps) {
  const { user } = useAuth()
  const { department: currentDepartment } = useDepartment()
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: currentDepartment || "",
    file: null as File | null,
  })

  // Permission checks
  const canUploadGlobal = user?.role === "God" || user?.role === "Admin"
  const isManager = user?.role === "Manager"

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, file }))
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.department || !formData.file) {
      return
    }

    // Permission check for Global uploads
    if (formData.department === "GLOBAL" && !canUploadGlobal) {
      return
    }

    try {
      setLoading(true)

      const sopData = {
        ...formData,
        tags,
        fileSize: `${(formData.file.size / 1024 / 1024).toFixed(1)} MB`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await onUpload(sopData)

      // Reset form
      setFormData({
        title: "",
        description: "",
        department: currentDepartment || "",
        file: null,
      })
      setTags([])
      setTagInput("")
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = formData.title && formData.description && formData.department && formData.file

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload New SOP</DialogTitle>
          <DialogDescription>Add a new Standard Operating Procedure to the company library.</DialogDescription>
        </DialogHeader>

        {/* Permission warning for Managers */}
        {isManager && !canUploadGlobal && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Note:</strong> As a Manager, you can only upload SOPs for your department. Global SOPs require
              Admin access.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., Daily Cleaning Checklist"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Brief description of this SOP..."
              rows={3}
              required
            />
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Select
              value={formData.department}
              onValueChange={(value) => handleInputChange("department", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {dept}
                    </div>
                  </SelectItem>
                ))}
                {canUploadGlobal && (
                  <SelectItem value="GLOBAL">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-600 font-medium">Global</span>
                    </div>
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add tags..."
                className="flex-1"
              />
              <Button type="button" onClick={addTag} variant="outline" size="sm">
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:bg-destructive hover:text-destructive-foreground rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file">File *</Label>
            <Input id="file" type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" required />
            <p className="text-xs text-muted-foreground">Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)</p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !isFormValid} className="gap-2">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload SOP
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
