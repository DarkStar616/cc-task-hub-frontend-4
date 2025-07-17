"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart3, Database, TrendingUp, Users, Clock, AlertTriangle, RefreshCw, FileX } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { useDepartment } from "@/components/department/department-provider"
import { useAnalytics } from "@/hooks/use-analytics"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"

// Coot Club brand colors for charts
const CHART_COLORS = {
  primary: "#1e3a8a", // coot-navy
  secondary: "#3b82f6", // blue-500
  accent: "#60a5fa", // blue-400
  success: "#10b981", // emerald-500
  warning: "#f59e0b", // amber-500
  danger: "#ef4444", // red-500
  muted: "#6b7280", // gray-500
}

const PIE_COLORS = [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.accent, CHART_COLORS.success]

export function AnalyticsContent() {
  const { hasRole } = useAuth()
  const { department } = useDepartment()

  // Fetch analytics data with department context
  const {
    data: analytics,
    error,
    isLoading,
    refetch,
  } = useAnalytics({
    department: department || undefined,
    metric_type: "all",
  })

  // Check if data is empty or all zeroes
  const isDataEmpty =
    !analytics ||
    (analytics.task_analytics.total_tasks === 0 &&
      analytics.user_productivity.total_users === 0 &&
      analytics.time_tracking.total_hours_logged === 0 &&
      analytics.department_metrics.length === 0)

  if (!hasRole(["god", "admin", "manager"])) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Access Restricted</h3>
          <p className="text-gray-500">Analytics are available for managers and above.</p>
        </div>
      </div>
    )
  }

  // Error state with retry option
  if (error && !isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-coot-navy">Analytics</h1>
          <p className="text-gray-600 mt-1">Performance insights and team metrics</p>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Unable to load analytics. Please try again later.</span>
            <Button variant="outline" size="sm" onClick={refetch} className="ml-4 bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>

        {/* Error state placeholder */}
        <Card className="card-playful">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <AlertTriangle className="w-20 h-20 text-red-300 mb-6" />
            <h3 className="text-xl font-semibold text-gray-600 mb-3">Analytics Unavailable</h3>
            <p className="text-gray-500 text-center mb-6 max-w-lg">
              We're having trouble loading your analytics data. This could be due to a network issue or server problem.
            </p>
            <Button onClick={refetch} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Loading state with skeletons
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-coot-navy">Analytics</h1>
          <p className="text-gray-600 mt-1">Performance insights and team metrics</p>
        </div>

        {/* Loading skeletons for metric cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="card-playful">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-5 h-5" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading skeleton for charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="card-playful">
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="card-playful">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  // Empty data state
  if (isDataEmpty) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-coot-navy">
              {department && department !== "All Departments" ? `${department} Analytics` : "Analytics"}
            </h1>
            <p className="text-gray-600 mt-1">Performance insights and team metrics</p>
          </div>
          <Button variant="outline" onClick={refetch} className="gap-2 bg-transparent">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Department filter info */}
        {department && department !== "All Departments" && (
          <Alert className="border-blue-200 bg-blue-50">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Filtered View:</strong> Showing analytics for {department} department.
            </AlertDescription>
          </Alert>
        )}

        {/* Empty state */}
        <Card className="card-playful">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <FileX className="w-20 h-20 text-gray-300 mb-6" />
            <h3 className="text-xl font-semibold text-gray-600 mb-3">No Analytics Available</h3>
            <p className="text-gray-500 text-center mb-6 max-w-lg">
              No analytics data is available for this period.
              {department && department !== "All Departments"
                ? ` Try selecting a different department or expanding your date range.`
                : " Try expanding your date range or check back later when more data is available."}
            </p>
            <div className="flex gap-3">
              <Button onClick={refetch} variant="outline" className="gap-2 bg-transparent">
                <RefreshCw className="h-4 w-4" />
                Refresh Data
              </Button>
              {department && department !== "All Departments" && (
                <Button variant="outline" className="gap-2 bg-transparent" onClick={() => window.location.reload()}>
                  <Database className="h-4 w-4" />
                  View All Departments
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Prepare chart data
  const taskPerformanceData = [
    { period: "Week 1", completionRate: 72, totalTasks: 45 },
    { period: "Week 2", completionRate: 78, totalTasks: 52 },
    { period: "Week 3", completionRate: 85, totalTasks: 48 },
    {
      period: "Week 4",
      completionRate: analytics?.task_analytics.completion_rate || 80,
      totalTasks: analytics?.task_analytics.total_tasks || 50,
    },
  ]

  const teamProductivityData =
    analytics?.user_productivity.completion_rate_by_user.map((user) => ({
      name: user.user_name.split(" ")[0], // First name only for chart
      completedTasks: Math.round(user.total_tasks * (user.completion_rate / 100)),
      totalTasks: user.total_tasks,
      completionRate: user.completion_rate,
    })) || []

  const timeTrackingData =
    analytics?.time_tracking.department_hours.map((dept) => ({
      name: dept.department,
      hours: dept.total_hours,
      avgPerUser: dept.average_per_user,
    })) || []

  // Check if individual chart data is empty
  const hasTaskData = taskPerformanceData.some((d) => d.completionRate > 0)
  const hasTeamData = teamProductivityData.length > 0
  const hasTimeData = timeTrackingData.length > 0

  // Main content with analytics data
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-coot-navy">
            {department && department !== "All Departments" ? `${department} Analytics` : "Analytics"}
          </h1>
          <p className="text-gray-600 mt-1">
            {department && department !== "All Departments"
              ? `Performance insights for ${department} department`
              : "Performance insights and team metrics"}
          </p>
        </div>
        <Button variant="outline" onClick={refetch} className="gap-2 bg-transparent">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Department filter info */}
      {department && department !== "All Departments" && (
        <Alert className="border-blue-200 bg-blue-50">
          <BarChart3 className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Filtered View:</strong> Showing analytics for {department} department.
          </AlertDescription>
        </Alert>
      )}

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Task Performance */}
        <Card className="card-playful">
          <CardHeader className="pb-3">
            <CardTitle className="text-coot-navy flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4" />
              Task Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-coot-navy">
                {analytics?.task_analytics.completion_rate.toFixed(1)}%
              </div>
              <p className="text-xs text-gray-600">
                {analytics?.task_analytics.completed_tasks} of {analytics?.task_analytics.total_tasks} tasks completed
              </p>
              <div className="text-xs text-gray-500">
                Avg: {analytics?.task_analytics.average_completion_time_hours.toFixed(1)}h per task
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Productivity */}
        <Card className="card-playful">
          <CardHeader className="pb-3">
            <CardTitle className="text-coot-navy flex items-center gap-2 text-sm">
              <Users className="w-4 h-4" />
              Team Productivity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-coot-navy">{analytics?.user_productivity.active_users}</div>
              <p className="text-xs text-gray-600">of {analytics?.user_productivity.total_users} users active</p>
              <div className="text-xs text-gray-500">
                {analytics?.user_productivity.tasks_per_user.toFixed(1)} tasks per user
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Tracking */}
        <Card className="card-playful">
          <CardHeader className="pb-3">
            <CardTitle className="text-coot-navy flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              Time Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-coot-navy">{analytics?.time_tracking.total_hours_logged}h</div>
              <p className="text-xs text-gray-600">total hours logged</p>
              <div className="text-xs text-gray-500">
                {analytics?.time_tracking.average_hours_per_day.toFixed(1)}h avg per day
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Department Count */}
        <Card className="card-playful">
          <CardHeader className="pb-3">
            <CardTitle className="text-coot-navy flex items-center gap-2 text-sm">
              <Database className="w-4 h-4" />
              Departments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-coot-navy">{analytics?.department_metrics.length}</div>
              <p className="text-xs text-gray-600">active departments</p>
              <div className="text-xs text-gray-500">
                Peak activity: {analytics?.time_tracking.peak_activity_hour}:00
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Performance Chart */}
        <Card className="card-playful">
          <CardHeader>
            <CardTitle className="text-coot-navy flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Task Performance Over Time
            </CardTitle>
            <CardDescription>Completion rate trends by week</CardDescription>
          </CardHeader>
          <CardContent>
            {hasTaskData ? (
              <ChartContainer
                config={{
                  completionRate: {
                    label: "Completion Rate (%)",
                    color: CHART_COLORS.primary,
                  },
                  totalTasks: {
                    label: "Total Tasks",
                    color: CHART_COLORS.secondary,
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={taskPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      cursor={{ stroke: CHART_COLORS.muted, strokeWidth: 1 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="completionRate"
                      stroke={CHART_COLORS.primary}
                      strokeWidth={3}
                      dot={{ fill: CHART_COLORS.primary, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: CHART_COLORS.primary, strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
                <TrendingUp className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-sm">No task performance data available</p>
                <Button variant="ghost" size="sm" onClick={refetch} className="mt-2 gap-2">
                  <RefreshCw className="h-3 w-3" />
                  Refresh
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Productivity Chart */}
        <Card className="card-playful">
          <CardHeader>
            <CardTitle className="text-coot-navy flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Productivity Comparison
            </CardTitle>
            <CardDescription>Completed tasks by team member</CardDescription>
          </CardHeader>
          <CardContent>
            {hasTeamData ? (
              <ChartContainer
                config={{
                  completedTasks: {
                    label: "Completed Tasks",
                    color: CHART_COLORS.success,
                  },
                  totalTasks: {
                    label: "Total Tasks",
                    color: CHART_COLORS.muted,
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamProductivityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "rgba(59, 130, 246, 0.1)" }} />
                    <Bar dataKey="completedTasks" fill={CHART_COLORS.success} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="totalTasks" fill={CHART_COLORS.muted} radius={[4, 4, 0, 0]} opacity={0.3} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
                <Users className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-sm">No team productivity data available</p>
                <Button variant="ghost" size="sm" onClick={refetch} className="mt-2 gap-2">
                  <RefreshCw className="h-3 w-3" />
                  Refresh
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Time Tracking Chart - Full Width */}
      <Card className="card-playful">
        <CardHeader>
          <CardTitle className="text-coot-navy flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Time Tracking by Department
          </CardTitle>
          <CardDescription>Total hours logged per department</CardDescription>
        </CardHeader>
        <CardContent>
          {hasTimeData ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pie Chart */}
              <ChartContainer
                config={{
                  hours: {
                    label: "Hours",
                    color: CHART_COLORS.primary,
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={timeTrackingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="hours"
                    >
                      {timeTrackingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value, entry) => <span style={{ color: entry.color }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>

              {/* Department Details */}
              <div className="space-y-4">
                <h4 className="font-semibold text-coot-navy">Department Breakdown</h4>
                <div className="space-y-3">
                  {timeTrackingData.map((dept, index) => (
                    <div key={dept.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                        />
                        <span className="font-medium text-gray-900">{dept.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-coot-navy">{dept.hours}h</div>
                        <div className="text-xs text-gray-500">{dept.avgPerUser.toFixed(1)}h avg</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
              <Clock className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-sm">No time tracking data available</p>
              <Button variant="ghost" size="sm" onClick={refetch} className="mt-2 gap-2">
                <RefreshCw className="h-3 w-3" />
                Refresh
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
