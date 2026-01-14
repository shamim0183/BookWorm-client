"use client"

import FloatingBooks from "@/components/FloatingBooks"
import PageWrapper from "@/components/PageWrapper"
import ProtectedLayout from "@/components/ProtectedLayout"
import { useAuth } from "@/lib/AuthContext"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

interface UserProfile {
  _id: string
  name: string
  email: string
  photoURL?: string
  followerCount: number
  followingCount: number
  isFollowing: boolean
}

export default function UserProfilePage() {
  const { id } = useParams()
  const router = useRouter()
  const { user: currentUser } = useAuth()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [followLoading, setFollowLoading] = useState(false)

  useEffect(() => {
    if (id) {
      fetchUserProfile()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get<UserProfile>(
        `${process.env.NEXT_PUBLIC_API_URL}/social/profile/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setUser(res.data)
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async () => {
    if (!user) return

    setFollowLoading(true)
    try {
      const token = localStorage.getItem("token")
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      if (user.isFollowing) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/social/unfollow/${id}`,
          config
        )
        toast.success("Unfollowed successfully")
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/social/follow/${id}`,
          {},
          config
        )
        toast.success("Followed successfully")
      }
      fetchUserProfile()
    } catch (error: unknown) {
      console.error("Follow error:", error)
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Action failed")
      } else {
        toast.error("Action failed")
      }
    } finally {
      setFollowLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1419] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0F1419] flex items-center justify-center">
        <div className="text-white">User not found</div>
      </div>
    )
  }

  const isOwnProfile = currentUser?._id === id

  return (
    <ProtectedLayout>
      <PageWrapper >
        <div className="min-h-screen bg-gradient-to-br from-[#1a4d4d] via-[#0F1419] to-[#1a3d3d] py-8 px-4 relative overflow-hidden -mt-8">
          {/* Floating Books Background */}
          <FloatingBooks />

          <div className="max-w-3xl mx-auto relative z-10">
            {/* Back Button */}
            <button
              onClick={() => router.push("/dashboard")}
              className="cursor-pointer mb-4 flex items-center gap-2 text-white/80 hover:text-white transition group"
            >
              <svg
                className="w-5 h-5 transform group-hover:-translate-x-1 transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="font-medium">Back to Dashboard</span>
            </button>

            {/* Profile Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 mb-6 shadow-2xl">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#C9A86A] to-[#B89858] flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl sm:text-4xl font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* User Info & Stats */}
                <div className="flex-1 min-w-0">
                  {/* Name & Email */}
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 truncate">
                    {user.name}
                  </h1>
                  <p className="text-white/50 text-sm mb-4 truncate">
                    {user.email}
                  </p>

                  {/* Stats Row */}
                  <div className="flex gap-8 mb-4">
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-[#C9A86A]">
                        {user.followerCount || 0}
                      </div>
                      <div className="text-xs sm:text-sm text-white/60">
                        Followers
                      </div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-[#C9A86A]">
                        {user.followingCount || 0}
                      </div>
                      <div className="text-xs sm:text-sm text-white/60">
                        Following
                      </div>
                    </div>
                  </div>
                </div>

                {/* Follow Button */}
                {!isOwnProfile && (
                  <div className="shrink-0">
                    <button
                      onClick={handleFollow}
                      disabled={followLoading}
                      className={`px-5 py-2 rounded-lg font-semibold text-sm transition cursor-pointer ${
                        user.isFollowing
                          ? "bg-white/10 text-white hover:bg-white/15 border border-white/20"
                          : "bg-gradient-to-r from-[#C9A86A] to-[#B89858] text-white hover:shadow-lg hover:shadow-[#C9A86A]/30"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {followLoading
                        ? "Loading..."
                        : user.isFollowing
                        ? "Following"
                        : "Follow"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6">
                Recent Activity
              </h2>
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white/30"
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
                <p className="text-white/40 text-sm">
                  No recent activity to show
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </ProtectedLayout>
  )
}
