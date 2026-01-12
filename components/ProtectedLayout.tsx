"use client"

import { useAuth } from "@/lib/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Footer from "./Footer"
import LoadingSpinner from "./LoadingSpinner"
import Navbar from "./Navbar"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1F242E] via-[#2C5F4F] to-[#1F242E]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
