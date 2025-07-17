"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Sparkles } from "lucide-react"

interface OnboardingMessageProps {
  onClose: () => void
}

export function OnboardingMessage({ onClose }: OnboardingMessageProps) {
  const { profile } = useAuth()

  const getWelcomeMessage = () => {
    const name = profile?.full_name?.split(" ")[0] || "there"

    return `Hey ${name}! 🦆 You're in development mode as a Manager. All features are accessible for UI testing!`
  }

  return (
    <Card className="mb-6 border-coot-teal bg-gradient-to-r from-coot-teal/5 to-coot-yellow/5 animate-slide-up">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-coot-teal" />
            <CardTitle className="text-lg text-coot-navy">Welcome to Task Hub!</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-white/50 focus-visible"
            aria-label="Close welcome message"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base text-gray-700">{getWelcomeMessage()}</CardDescription>
        <div className="mt-4 flex gap-2">
          <Button size="sm" className="btn-primary" onClick={onClose}>
            Let's go! 🎯
          </Button>
          <Button variant="outline" size="sm" onClick={onClose} className="btn-secondary bg-transparent">
            Maybe later
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
