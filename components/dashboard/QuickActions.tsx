"use client"

import type React from "react"

import Link from "next/link"
import { Plus, Calendar, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ActionButtonProps {
  icon: React.ReactNode
  title: string
  description: string
  onClick?: () => void
}

function ActionButton({ icon, title, description, onClick }: ActionButtonProps) {
  return (
    <Button
      variant="outline"
      className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-accent bg-transparent"
      onClick={onClick}
    >
      <div className="text-primary">{icon}</div>
      <div className="text-center">
        <div className="font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
    </Button>
  )
}

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/tasks/new">
            <ActionButton
              icon={<Plus className="h-6 w-6" />}
              title="Create New Task"
              description="Add a new task to your list"
            />
          </Link>
          <Link href="/calendar">
            <ActionButton
              icon={<Calendar className="h-6 w-6" />}
              title="Schedule Meeting"
              description="Book a meeting or appointment"
            />
          </Link>
          <Link href="/sops">
            <ActionButton
              icon={<FileText className="h-6 w-6" />}
              title="View SOPs"
              description="Access standard procedures"
            />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
