"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Clock, UserCheck, UserX } from "lucide-react"
import type { TeamMemberStatus } from "@/hooks/use-clock-sessions"

interface TeamStatusCardProps {
  teamStatus: TeamMemberStatus[]
  isLoading: boolean
}

export function TeamStatusCard({ teamStatus, isLoading }: TeamStatusCardProps) {
  const formatDuration = (minutes?: number) => {
    if (!minutes) return "0h"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const formatTime = (timeString?: string) => {
    if (!timeString) return ""
    return new Date(timeString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const activeMembers = teamStatus.filter((member) => member.status === "clocked_in")
  const inactiveMembers = teamStatus.filter((member) => member.status === "clocked_out")

  if (isLoading) {
    return (
      <Card className="card-playful">
        <CardHeader>
          <CardTitle className="text-coot-navy flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (teamStatus.length === 0) {
    return (
      <Card className="card-playful">
        <CardHeader>
          <CardTitle className="text-coot-navy flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No team members found</p>
            <p className="text-sm">Team status will appear here when available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card-playful">
      <CardHeader>
        <CardTitle className="text-coot-navy flex items-center gap-2">
          <Users className="w-5 h-5" />
          Team Status
          <Badge variant="secondary" className="ml-auto">
            {activeMembers.length} active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Active Members */}
        {activeMembers.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <UserCheck className="w-4 h-4 text-green-600" />
              <h3 className="font-medium text-green-800">Currently Working ({activeMembers.length})</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeMembers.map((member) => (
                <div
                  key={member.user_id}
                  className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={member.user_avatar || "/placeholder.svg"} alt={member.user_name} />
                    <AvatarFallback className="bg-green-100 text-green-800">
                      {member.user_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-green-900 truncate">{member.user_name}</p>
                    <div className="flex items-center gap-2 text-xs text-green-700">
                      <Clock className="w-3 h-3" />
                      <span>Since {formatTime(member.clock_in_time)}</span>
                      <span>•</span>
                      <span>{member.department}</span>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    {formatDuration(member.working_duration)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inactive Members */}
        {inactiveMembers.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <UserX className="w-4 h-4 text-gray-500" />
              <h3 className="font-medium text-gray-700">Off Duty ({inactiveMembers.length})</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {inactiveMembers.map((member) => (
                <div
                  key={member.user_id}
                  className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={member.user_avatar || "/placeholder.svg"} alt={member.user_name} />
                    <AvatarFallback className="bg-gray-100 text-gray-600">
                      {member.user_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{member.user_name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{member.department}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                    Off
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
