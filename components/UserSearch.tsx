"use client"

import axios from "axios"
import Link from "next/link"
import { useState } from "react"

interface UserResult {
  _id: string
  name: string
  email: string
  photoURL?: string
  followers?: string[]
}

export default function UserSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<UserResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const searchUsers = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setShowResults(false)
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/social/users/search?q=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setResults(res.data)
      setShowResults(true)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    searchUsers(value)
  }

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          onFocus={() => query && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          placeholder="Search users..."
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#C9A86A]"
        />
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full mt-2 w-full bg-[#0F1419] border-2 border-[#C9A86A]/30 rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50">
          {loading ? (
            <div className="p-4 text-white/60 text-center">Searching...</div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((user) => (
                <Link
                  key={user._id}
                  href={`/users/${user._id}`}
                  className="flex items-center gap-3 p-3 hover:bg-[#C9A86A]/10 rounded-lg transition cursor-pointer border-b border-white/5 last:border-0"
                >
                  <div className="w-10 h-10 rounded-full bg-[#C9A86A] flex items-center justify-center overflow-hidden shrink-0">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {user.name}
                    </p>
                    <p className="text-white/60 text-sm truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="text-xs text-[#C9A86A]">
                    {user.followers?.length || 0} followers
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-white/60 text-center">No users found</div>
          )}
        </div>
      )}
    </div>
  )
}
