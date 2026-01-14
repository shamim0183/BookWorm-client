"use client"

import axios from "axios"
import Link from "next/link"
import { useState } from "react"

export default function UserSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const searchUsers = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([])
      setShowResults(false)
      return
    }

    setLoading(true)
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/social/users/search?q=${searchQuery}`
      )
      setResults(res.data)
      setShowResults(true)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
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
        <div className="absolute top-full mt-2 w-full bg-[#1F242E] border border-white/20 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50">
          {loading ? (
            <div className="p-4 text-white/60 text-center">Searching...</div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((user) => (
                <Link
                  key={user._id}
                  href={`/users/${user._id}`}
                  className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-[#C9A86A] flex items-center justify-center overflow-hidden">
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
                  <div className="text-xs text-white/40">
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
