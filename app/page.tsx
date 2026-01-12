"use client"

import LoadingSpinner from "@/components/LoadingSpinner"
import { useAuth } from "@/lib/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login")
      } else if (user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/library")
      }
    }
  }, [user, loading, router])

  return <LoadingSpinner fullScreen />
}
