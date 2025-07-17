"use client"

// 🚫 TEMPORARILY DISABLED: This component is not used while auth is disabled
// Will be re-enabled when Supabase Auth is restored

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CootClubLogo } from "@/components/ui/coot-club-logo"
import { Mail, AlertCircle } from "lucide-react"

export function AuthModal() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate @cootclub.com domain
    if (!email.endsWith("@cootclub.com")) {
      setError("Please use your @cootclub.com email address")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")

    try {
      // ✅ CONNECTED: Using your Supabase backend for authentication
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          // Additional options for your backend
          data: {
            domain_restriction: "@cootclub.com",
          },
        },
      })

      if (error) throw error

      setMessage("Check your email for the login link!")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-coot-light to-white p-4">
      <div className="w-full max-w-md">
        <div className="card-playful p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CootClubLogo className="w-16 h-16" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-coot-navy">Welcome to Task Hub</h1>
              <p className="text-gray-600 mt-2">Ready to dive in? Let's get you signed in! 🦆</p>
            </div>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.name@cootclub.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-gray-200 focus:border-coot-teal focus:ring-coot-teal"
                  required
                  disabled={loading}
                  aria-describedby={error ? "error-message" : undefined}
                />
              </div>
            </div>

            <Button type="submit" className="w-full btn-primary h-12 text-lg" disabled={loading}>
              {loading ? "Sending magic link..." : "Sign in with Coot Club Email"}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" id="error-message">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert className="border-coot-teal bg-coot-teal/5">
              <Mail className="h-4 w-4 text-coot-teal" />
              <AlertDescription className="text-coot-teal">{message}</AlertDescription>
            </Alert>
          )}

          <div className="text-center text-sm text-gray-500">
            <p>Only @cootclub.com email addresses are allowed</p>
          </div>
        </div>
      </div>
    </div>
  )
}
