"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { SOPUploadModal } from "@/components/modals/sop-upload-modal"
import { useSOPs } from "@/hooks/use-sops"
import { useAuth } from "@/components/auth/auth-provider"
import { useDepartment } from "@/components/department/department-provider"
import { useToast } from "@/hooks/use-toast"
import { Upload, Search, FileText, Globe, Building2, Info, Download, Eye } from "lucide-react"

export function SOPsContent() {
  const { user } = useAuth()
  const { department } = useDepartment()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  // Get all SOPs from hook
  const { data: allSops, loading, error, fetchSOPs, uploadSOP } = useSOPs()

  const dept = department
  const label = department ?? "All Departments"

  // RBAC filtering logic
  let visibleSops = allSops
  if (user?.role === "User") {
    visibleSops = allSops.filter((s) => s.department === dept || s.department === "GLOBAL")
  } else if (user?.role === "Manager") {
    // Managers see everything
    visibleSops = allSops
  }
  // Admin/God also see everything (no additional filtering needed)

  // Apply search filter to visible SOPs
  const filteredSops = visibleSops.filter(
    (sop) =>
      sop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sop.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Fetch SOPs when department changes
  useEffect(() => {
    fetchSOPs({ department: dept })
  }, [dept, fetchSOPs])

  const handleUploadSOP = async (sopData: any) => {
    try {
      await uploadSOP(sopData)
      toast({
        title: "SOP uploaded successfully",
        description: `"${sopData.title}" has been added to the SOPs library.`,
      })
      setUploadModalOpen(false)
      // Refresh SOPs list
      fetchSOPs({ department: dept })
    } catch (error) {
      toast({
        title: "Failed to upload SOP",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleViewSOP = (sop: any) => {
    // TODO: Implement SOP viewer
    toast({
      title: "Opening SOP",
      description: `Opening "${sop.title}"...`,
    })
  }

  const handleDownloadSOP = (sop: any) => {
    // TODO: Implement SOP download
    toast({
      title: "Downloading SOP",
      description: `Downloading "${sop.title}"...`,
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load SOPs. Please try again later.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {label} SOPs ({filteredSops.length})
          </h1>
          <p className="text-muted-foreground">
            {department && department !== "All Departments"
              ? `Procedures for ${department} + Global policies`
              : "All company procedures and documentation"}
          </p>
        </div>

        {/* Upload button - only for Admin/God */}
        {["Admin", "God"].includes(user?.role || "") && (
          <Button onClick={() => setUploadModalOpen(true)} className="gap-2">
            <Upload className="h-4 w-4" />
            Upload SOP
          </Button>
        )}
      </div>

      {/* Filter Banner */}
      {department && department !== "All Departments" && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Filtered View:</strong> Showing {department} + Global policies.
          </AlertDescription>
        </Alert>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search SOPs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* SOPs Grid */}
      {filteredSops.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No SOPs found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? `No SOPs match "${searchQuery}"`
                : department && department !== "All Departments"
                  ? `No SOPs available for ${department}`
                  : "No SOPs have been uploaded yet"}
            </p>
            {["Admin", "God"].includes(user?.role || "") && (
              <Button onClick={() => setUploadModalOpen(true)} variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload First SOP
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSops.map((sop) => (
            <Card key={sop.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{sop.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">{sop.description}</CardDescription>
                  </div>
                  <Badge
                    variant={sop.department === "GLOBAL" ? "default" : "secondary"}
                    className={
                      sop.department === "GLOBAL"
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : "bg-gray-100 text-gray-800 border-gray-200"
                    }
                  >
                    {sop.department === "GLOBAL" ? (
                      <>
                        <Globe className="h-3 w-3 mr-1" />
                        Global
                      </>
                    ) : (
                      <>
                        <Building2 className="h-3 w-3 mr-1" />
                        {sop.department}
                      </>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1 mb-3">
                  {sop.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <span>Updated {new Date(sop.updatedAt).toLocaleDateString()}</span>
                  <span>{sop.fileSize}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleViewSOP(sop)} className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDownloadSOP(sop)} className="flex-1">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <SOPUploadModal open={uploadModalOpen} onClose={() => setUploadModalOpen(false)} onUpload={handleUploadSOP} />
    </div>
  )
}
