"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

export default function ClockPage() {
  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <Card>
          <CardHeader className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-coot-teal" />
            <CardTitle className="text-2xl">Clock In/Out</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <h2 className="text-3xl font-bold text-coot-navy">Coming Soon</h2>
            <p className="mt-4 text-lg italic text-gray-600">We're hard at work on this feature—check back soon!</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
