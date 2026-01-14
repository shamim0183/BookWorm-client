"use client"

import PageWrapper from "@/components/PageWrapper"
import ProtectedLayout from "@/components/ProtectedLayout"
import { useAuth } from "@/lib/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Redirect non-admin users
    if (user && user.role !== "admin") {
      router.push("/library")
      toast.error("Access denied. Admin only.")
    } else if (user) {
      loadData()
    }
  }, [user, router])

  const loadData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) throw new Error("Failed to fetch stats")

      const data = await response.json()
      setStats(data.stats)
    } catch (error) {
      toast.error("Failed to load dashboard")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <ProtectedLayout>
        <PageWrapper className="-mt-16 pt-16">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-white text-xl">Loading dashboard...</div>
          </div>
        </PageWrapper>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <PageWrapper className="-mt-16 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-white/70 text-lg">
              Overview stats and management
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:border-[#C9A86A]/50 hover:shadow-2xl hover:shadow-[#C9A86A]/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-[#C9A86A]/20 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#C9A86A]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-[#C9A86A] text-4xl font-bold mb-2">
                {stats.totalBooks}
              </div>
              <div className="text-white/80 text-sm font-medium">
                Total Books
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-400/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-blue-400 text-4xl font-bold mb-2">
                {stats.totalUsers}
              </div>
              <div className="text-white/80 text-sm font-medium">
                Total Users
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:border-yellow-400/50 hover:shadow-2xl hover:shadow-yellow-400/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-yellow-400 text-4xl font-bold mb-2">
                {stats.pendingReviews}
              </div>
              <div className="text-white/80 text-sm font-medium">
                Pending Reviews
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:border-green-400/50 hover:shadow-2xl hover:shadow-green-400/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-400/20 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-green-400 text-4xl font-bold mb-2">
                +{stats.newUsersThisMonth}
              </div>
              <div className="text-white/80 text-sm font-medium">
                New Users This Month
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => router.push("/admin/books")}
                className="p-6 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#C9A86A]/50 rounded-2xl transition-all text-left group"
              >
                <div className="w-12 h-12 bg-[#C9A86A]/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-[#C9A86A]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  Add New Book
                </h3>
                <p className="text-white/60 text-sm">
                  Add a new book to the collection
                </p>
              </button>

              <button
                onClick={() => router.push("/admin/reviews")}
                className="p-6 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-yellow-400/50 rounded-2xl transition-all text-left group"
              >
                <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  Moderate Reviews
                </h3>
                <p className="text-white/60 text-sm">
                  Approve or delete pending reviews
                </p>
              </button>

              <button
                onClick={() => router.push("/admin/users")}
                className="p-6 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-blue-400/50 rounded-2xl transition-all text-left group"
              >
                <div className="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  Manage Users
                </h3>
                <p className="text-white/60 text-sm">
                  View and manage user roles
                </p>
              </button>
            </div>
          </div>
        </div>
      </PageWrapper>
    </ProtectedLayout>
  )
}
