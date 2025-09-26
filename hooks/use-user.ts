"use client"

import { useState, useEffect } from "react"
import { getCurrentUser, type UserProfile } from "@/lib/auth"

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true)
        setError(null) // Clear any previous errors
        const userData = await getCurrentUser()
        setUser(userData)
      } catch (err) {
        // Don't set error for authentication failures - learning paths work without auth
        console.warn("User authentication failed, but app continues to work:", err)
        setUser(null)
        setError(null) // Don't show error to user for auth failures
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const refreshUser = async () => {
    try {
      setError(null) // Clear any previous errors
      const userData = await getCurrentUser()
      setUser(userData)
    } catch (err) {
      // Don't set error for authentication failures - learning paths work without auth
      console.warn("User refresh failed, but app continues to work:", err)
      setUser(null)
      setError(null) // Don't show error to user for auth failures
    }
  }

  return { user, loading, error, refreshUser }
}
