"use client"

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
    <div className="min-h-screen bg-[#0F1419] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-[#1F242E] rounded-xl p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-[#C9A86A] flex items-center justify-center overflow-hidden">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {user.name}
              </h1>
              <p className="text-white/60 mb-4">{user.email}</p>

              {/* Stats */}
              <div className="flex gap-6 justify-center sm:justify-start">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#C9A86A]">
                    {user.followerCount || 0}
                  </div>
                  <div className="text-sm text-white/60">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#C9A86A]">
                    {user.followingCount || 0}
                  </div>
                  <div className="text-sm text-white/60">Following</div>
                </div>
              </div>
            </div>

            {/* Follow Button */}
            {!isOwnProfile && (
              <button
                onClick={handleFollow}
                disabled={followLoading}
                className={`px-6 py-2 rounded-lg font-semibold transition cursor-pointer ${
                  user.isFollowing
                    ? "bg-white/10 text-white hover:bg-white/20"
                    : "bg-[#C9A86A] text-white hover:bg-[#B89858]"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {followLoading
                  ? "Loading..."
                  : user.isFollowing
                  ? "Following"
                  : "Follow"}
              </button>
            )}
          </div>
        </div>

        {/* Activity Section */}
        <div className="bg-[#1F242E] rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <p className="text-white/60 text-center py-8">
            No recent activity to show
          </p>
        </div>
      </div>
    </div>
  )
}
