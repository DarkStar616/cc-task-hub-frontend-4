"use client"

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useDepartment } from "@/components/department/department-provider"
import { useDepartmentData } from "@/hooks/use-api"
import { CheckCircle, Clock, AlertTriangle, Users, Calendar, FileText, Building2 } from "lucide-react"

export function DashboardContent() {
  const { department } = useDepartment()
  const { loading, isDepartmentFiltered } = useDepartmentData("/api/dashboard")

  // Mock data that would be filtered by department
  const stats = {
    activeTasks: isDepartmentFiltered ? 8 : 24,
    completedToday: isDepartmentFiltered ? 3 : 12,
    overdueTasks: isDepartmentFiltered ? 2 : 5,
    teamMembers: isDepartmentFiltered ? 6 : 28,
  }

  return (
    <div className="space-y-6">
      {/* Department Context Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-coot-navy">Dashboard</h1>
          <div className="flex items-center gap-2 mt-2">
            <Building2 className="w-4 h-4 text-coot-teal" />
            <span className="text-sm text-gray-600">
              {isDepartmentFiltered ? `Viewing: ${department}` : "Viewing: All Departments"}
            </span>
            {isDepartmentFiltered && (
              <Badge variant="secondary" className="bg-coot-teal/10 text-coot-teal">
                Filtered
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Clock className="h-4 w-4 text-coot-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-coot-navy">{stats.activeTasks}</div>
            <p className="text-xs text-gray-600">
              {isDepartmentFiltered ? `In ${department}` : "Across all departments"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-coot-navy">{stats.completedToday}</div>
            <p className="text-xs text-gray-600">
              {isDepartmentFiltered ? `In ${department}` : "Across all departments"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-coot-navy">{stats.overdueTasks}</div>
            <p className="text-xs text-gray-600">
              {isDepartmentFiltered ? `In ${department}` : "Across all departments"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-coot-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-coot-navy">{stats.teamMembers}</div>
            <p className="text-xs text-gray-600">
              {isDepartmentFiltered ? `In ${department}` : "Across all departments"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-coot-teal" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              {isDepartmentFiltered ? `Latest updates in ${department}` : "Latest updates across all departments"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-sm text-gray-500">Loading activity...</div>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Task completed</p>
                      <p className="text-xs text-gray-600">
                        {isDepartmentFiltered ? department : "Maintenance"} • 2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-4 h-4 text-coot-teal" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">New task assigned</p>
                      <p className="text-xs text-gray-600">
                        {isDepartmentFiltered ? department : "Housekeeping"} • 4 hours ago
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-coot-teal" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common actions for {isDepartmentFiltered ? department : "all departments"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/tasks">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Clock className="w-4 h-4 mr-2" />
                  Create New Task
                </Button>
              </Link>
              <Link href="/calendar">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
              </Link>
              <Link href="/sops">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  View SOPs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
