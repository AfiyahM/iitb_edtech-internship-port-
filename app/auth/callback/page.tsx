"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("Auth callback error:", error)
          router.push("/auth/login?error=auth_failed")
          return
        }

        if (data.session) {
          // Check if user profile exists
          const { data: profile, error: profileError } = await supabase
            .from("users")
            .select("*")
            .eq("id", data.session.user.id)
            .maybeSingle()

          if (profileError) {
            console.error("Profile check error:", profileError)
          }

          if (!profile) {
            // User doesn't have a profile, redirect to profile setup
            router.push("/auth/setup-profile")
          } else {
            // User has a profile, redirect to dashboard
            router.push("/dashboard")
          }
        } else {
          // No session, redirect to login
          router.push("/auth/login")
        }
      } catch (error) {
        console.error("Auth callback error:", error)
        router.push("/auth/login?error=unexpected_error")
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Completing Sign In</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
          <p className="text-sm text-muted-foreground">
            Please wait while we complete your sign in...
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 