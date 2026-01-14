"use client"

import axios from "axios"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function ActivityFeed() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeed()
  }, [])

  const fetchFeed = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/social/feed?limit=20`
      )
      setActivities(res.data)
    } catch (error) {
      console.error("Error fetching feed:", error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityMessage = (activity) => {
    switch (activity.type) {
      case "added_book":
        return "added a book to their library"
      case "reviewed_book":
        return "reviewed a book"
      case "updated_progress":
        return "updated reading progress"
      case "followed_user":
        return "followed a user"
      default:
        return "did something"
    }
  }

  const formatTime = (date) => {
    const now = new Date()
    const activityDate = new Date(date)
    const diffMs = now - activityDate
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  if (loading) {
    return (
      <div className="bg-[#1F242E] rounded-xl p-6">
        <div className="text-white/60 text-center py-4">
          Loading activity feed...
        </div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="bg-[#1F242E] rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Activity Feed</h2>
        <div className="text-white/60 text-center py-8">
          <p className="mb-2">No activities yet</p>
          <p className="text-sm">
            Follow users to see their reading activities here
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#1F242E] rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Activity Feed</h2>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity._id}
            className="flex gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition"
          >
            {/* User Avatar */}
            <Link href={`/users/${activity.user._id}`}>
              <div className="w-10 h-10 rounded-full bg-[#C9A86A] flex items-center justify-center overflow-hidden shrink-0 cursor-pointer">
                {activity.user.photoURL ? (
                  <img
                    src={activity.user.photoURL}
                    alt={activity.user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-sm font-semibold">
                    {activity.user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </Link>

            {/* Activity Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/users/${activity.user._id}`}
                    className="font-semibold text-white hover:text-[#C9A86A] transition"
                  >
                    {activity.user.name}
                  </Link>
                  <span className="text-white/60 text-sm ml-2">
                    {getActivityMessage(activity)}
                  </span>
                </div>
                <span className="text-xs text-white/40 shrink-0">
                  {formatTime(activity.createdAt)}
                </span>
              </div>

              {/* Book Info (if applicable) */}
              {activity.book && (
                <Link href={`/books/${activity.book._id}`}>
                  <div className="mt-2 flex items-center gap-3 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition cursor-pointer">
                    {activity.book.coverUrl && (
                      <img
                        src={activity.book.coverUrl}
                        alt={activity.book.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">
                        {activity.book.title}
                      </p>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
