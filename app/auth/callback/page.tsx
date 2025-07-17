"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth callback error:", error)
          router.push("/")
          return
        }

        if (data.session) {
          // Successful authentication
          router.push("/")
        } else {
          // No session found
          router.push("/")
        }
      } catch (error) {
        console.error("Unexpected error:", error)
        router.push("/")
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-coot-light">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  )
}
