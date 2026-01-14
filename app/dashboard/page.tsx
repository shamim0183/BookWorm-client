"use client"

import GenrePieChart from "@/components/GenrePieChart"
import MonthlyBooksChart from "@/components/MonthlyBooksChart"
import PageWrapper from "@/components/PageWrapper"
import ProtectedLayout from "@/components/ProtectedLayout"
import ReadingChallenge from "@/components/ReadingChallenge"
import ReadingStreakCard from "@/components/ReadingStreakCard"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [currentlyReading, setCurrentlyReading] = useState<any[]>([])
  const [enhancedStats, setEnhancedStats] = useState<any>(null)
  const [readingGoal, setReadingGoal] = useState<any>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      // Get recommendations and basic stats
      const recResponse = await axios.get(`${API_URL}/recommendations`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Get library for currently reading books
      const libraryResponse = await axios.get(`${API_URL}/library`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Get detailed stats
      const statsResponse = await axios.get(`${API_URL}/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Get enhanced stats for charts
      const enhancedStatsResponse = await axios.get(
        `${API_URL}/stats/enhanced`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      // Get reading goal
      const goalResponse = await axios.get(`${API_URL}/goals`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setRecommendations(recResponse.data.recommendations || [])
      setStats(statsResponse.data.stats || {})
      setEnhancedStats(enhancedStatsResponse.data.data || null)
      setReadingGoal(goalResponse.data.goal || null)

      // Filter currently reading books
      const reading = (libraryResponse.data.library || [])
        .filter((entry: any) => entry.shelf === "currently-reading")
        .slice(0, 3)
      setCurrentlyReading(reading)
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to load dashboard")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateGoal = async (targetBooks: number) => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        `${API_URL}/goals`,
        { targetBooks },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setReadingGoal(response.data.goal)
      toast.success("Reading goal updated!")
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update goal")
    }
  }

  if (loading) {
    return (
      <ProtectedLayout>
        <PageWrapper>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#C9A86A]"></div>
          </div>
        </PageWrapper>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <PageWrapper>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back! 📚
          </h1>
          <p className="text-white/70">Your personalized reading dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="text-3xl font-bold text-[#C9A86A] mb-1">
              {stats?.booksRead || 0}
            </div>
            <div className="text-white/70 text-sm">Books Read</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {stats?.currentlyReading || 0}
            </div>
            <div className="text-white/70 text-sm">Currently Reading</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="text-3xl font-bold text-yellow-400 mb-1">
              {stats?.averageRating?.toFixed(1) || "0.0"}
            </div>
            <div className="text-white/70 text-sm">Avg Rating</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="text-3xl font-bold text-green-400 mb-1">
              {stats?.totalPagesRead || 0}
            </div>
            <div className="text-white/70 text-sm">Pages Read</div>
          </div>
        </div>

        {/* Currently Reading Section */}
        {currentlyReading.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Continue Reading
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentlyReading.map((entry) => (
                <div
                  key={entry._id}
                  onClick={() => router.push(`/books/${entry.book._id}`)}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition cursor-pointer"
                >
                  <div className="flex gap-4">
                    <img
                      src={entry.book.coverImage || "/placeholder-book.png"}
                      alt={entry.book.title}
                      className="w-16 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
                        {entry.book.title}
                      </h3>
                      <p className="text-white/60 text-xs mb-2">
                        {entry.book.author}
                      </p>
                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-white/70">
                          <span>
                            {entry.progress?.pagesRead || 0} /{" "}
                            {entry.progress?.totalPages || 0}
                          </span>
                          <span className="text-[#C9A86A] font-semibold">
                            {entry.progress?.percentage || 0}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#C9A86A] to-[#B89858]"
                            style={{
                              width: `${entry.progress?.percentage || 0}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reading Challenge Section */}
        {(readingGoal || enhancedStats) && (
          <div className="mb-8">
            <ReadingChallenge
              currentBooks={readingGoal?.currentBooks || 0}
              targetBooks={readingGoal?.targetBooks || 50}
              year={new Date().getFullYear()}
              onUpdateGoal={handleUpdateGoal}
            />
          </div>
        )}

        {/* Charts Grid */}
        {enhancedStats && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Your Reading Stats
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {enhancedStats.genreBreakdown &&
                enhancedStats.genreBreakdown.length > 0 && (
                  <GenrePieChart data={enhancedStats.genreBreakdown} />
                )}
              {enhancedStats.monthlyBooks && (
                <MonthlyBooksChart data={enhancedStats.monthlyBooks} />
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <ReadingStreakCard streak={enhancedStats.readingStreak || 0} />

              {/* Additional Stats Cards */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <div className="text-3xl font-bold text-[#C9A86A] mb-2">
                  {enhancedStats.booksThisYear || 0}
                </div>
                <div className="text-white font-semibold mb-1">
                  Books This Year
                </div>
                <div className="text-white/60 text-sm">
                  {new Date().getFullYear()} reading progress
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {(enhancedStats.totalPages || 0).toLocaleString()}
                </div>
                <div className="text-white font-semibold mb-1">Total Pages</div>
                <div className="text-white/60 text-sm">
                  Across all books read
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Recommended For You
          </h2>
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recommendations.map((book) => (
                <div
                  key={book._id}
                  onClick={() => router.push(`/books/${book._id}`)}
                  className="group cursor-pointer"
                >
                  <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 hover:border-[#C9A86A]/50 transition-all duration-300">
                    <img
                      src={book.coverImage || "/placeholder-book.png"}
                      alt={book.title}
                      className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {book.recommendationReason && (
                      <div className="absolute top-2 left-2 right-2">
                        <div className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg line-clamp-2">
                          {book.recommendationReason}
                        </div>
                      </div>
                    )}
                  </div>
                  <h3 className="text-white text-sm font-semibold mt-2 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-white/60 text-xs line-clamp-1">
                    {book.author}
                  </p>
                  {book.ratings?.average > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-yellow-400 text-xs">★</span>
                      <span className="text-white/70 text-xs">
                        {book.ratings.average.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
              <p className="text-white/60">
                Start reading books to get personalized recommendations!
              </p>
              <button
                onClick={() => router.push("/browse")}
                className="mt-4 px-6 py-3 bg-[#C9A86A] hover:bg-[#B89858] text-white font-semibold rounded-xl transition"
              >
                Browse Books
              </button>
            </div>
          )}
        </div>
      </PageWrapper>
    </ProtectedLayout>
  )
}
