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
        const userData = await getCurrentUser()
        setUser(userData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch user")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const refreshUser = async () => {
    try {
      const userData = await getCurrentUser()
      setUser(userData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh user")
    }
  }

  return { user, loading, error, refreshUser }
}
