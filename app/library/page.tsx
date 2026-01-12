"use client"

import AddBookModal from "@/components/AddBookModal"
import BookCard from "@/components/BookCard"
import ProgressUpdateModal from "@/components/ProgressUpdateModal"
import ProtectedLayout from "@/components/ProtectedLayout"
import { getLibrary, getStats, removeFromLibrary } from "@/lib/api"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function LibraryPage() {
  const [library, setLibrary] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeShelf, setActiveShelf] = useState<
    "all" | "wantToRead" | "currentlyReading" | "read"
  >("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [progressModalEntry, setProgressModalEntry] = useState<any>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [libraryData, statsData] = await Promise.all([
        getLibrary(),
        getStats(),
      ])
      setLibrary(libraryData.library || [])
      setStats(statsData.stats || null)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (entry: any) => {
    if (!confirm("Remove this book from your library?")) return

    try {
      await removeFromLibrary(entry._id)
      toast.success("Book removed!")
      loadData()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const filteredLibrary =
    activeShelf === "all"
      ? library
      : library.filter((entry) => entry.shelf === activeShelf)

  const getShelfCount = (shelf: string) => {
    return library.filter((entry) => entry.shelf === shelf).length
  }

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Loading your library...</div>
        </div>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      {/* Override background to match login page */}
      <div className="min-h-screen bg-gradient-to-br from-[#1F242E] via-[#2C5F4F] to-[#1F242E] -mt-16 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with glassmorphism */}
          <div className="mb-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            <h1 className="text-4xl font-bold text-white mb-2">My Library</h1>
            <p className="text-white/70 text-lg">Track your reading journey</p>
          </div>

          {/* Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:border-[#C9A86A]/50 hover:shadow-2xl hover:shadow-[#C9A86A]/20 transition-all">
                <div className="text-[#C9A86A] text-4xl font-bold mb-2">
                  {stats.totalBooks}
                </div>
                <div className="text-white/80 text-sm font-medium">
                  Total Books
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:border-yellow-400/50 hover:shadow-2xl hover:shadow-yellow-400/20 transition-all">
                <div className="text-yellow-400 text-4xl font-bold mb-2">
                  {stats.byShelf?.currentlyReading || 0}
                </div>
                <div className="text-white/80 text-sm font-medium">
                  Currently Reading
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:border-green-400/50 hover:shadow-2xl hover:shadow-green-400/20 transition-all">
                <div className="text-green-400 text-4xl font-bold mb-2">
                  {stats.byShelf?.read || 0}
                </div>
                <div className="text-white/80 text-sm font-medium">
                  Completed
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-400/20 transition-all">
                <div className="text-blue-400 text-4xl font-bold mb-2">
                  {stats.totalPagesRead || 0}
                </div>
                <div className="text-white/80 text-sm font-medium">
                  Pages Read
                </div>
              </div>
            </div>
          )}

          {/* Shelf Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setActiveShelf("all")}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  activeShelf === "all"
                    ? "bg-[#C9A86A] text-white shadow-lg shadow-[#C9A86A]/30"
                    : "bg-white/10 backdrop-blur-sm border border-white/20 text-white/70 hover:bg-white/20 hover:text-white"
                }`}
              >
                All ({library.length})
              </button>
              <button
                onClick={() => setActiveShelf("wantToRead")}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  activeShelf === "wantToRead"
                    ? "bg-[#C9A86A] text-white shadow-lg shadow-[#C9A86A]/30"
                    : "bg-white/10 backdrop-blur-sm border border-white/20 text-white/70 hover:bg-white/20 hover:text-white"
                }`}
              >
                Want to Read ({getShelfCount("wantToRead")})
              </button>
              <button
                onClick={() => setActiveShelf("currentlyReading")}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  activeShelf === "currentlyReading"
                    ? "bg-[#C9A86A] text-white shadow-lg shadow-[#C9A86A]/30"
                    : "bg-white/10 backdrop-blur-sm border border-white/20 text-white/70 hover:bg-white/20 hover:text-white"
                }`}
              >
                Currently Reading ({getShelfCount("currentlyReading")})
              </button>
              <button
                onClick={() => setActiveShelf("read")}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  activeShelf === "read"
                    ? "bg-[#C9A86A] text-white shadow-lg shadow-[#C9A86A]/30"
                    : "bg-white/10 backdrop-blur-sm border border-white/20 text-white/70 hover:bg-white/20 hover:text-white"
                }`}
              >
                Read ({getShelfCount("read")})
              </button>
            </div>

            {/* Add Book Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-2 bg-[#C9A86A] hover:bg-[#B89858] text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-[#C9A86A]/30 hover:-translate-y-0.5"
            >
              + Add Book
            </button>
          </div>

          {/* Book Grid */}
          {filteredLibrary.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredLibrary.map((entry) => (
                <BookCard
                  key={entry._id}
                  libraryEntry={entry}
                  onUpdateProgress={() => setProgressModalEntry(entry)}
                  onDelete={() => handleDelete(entry)}
                  onViewDetails={() => {
                    // TODO: Implement detail modal
                    console.log("View details", entry)
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-white/30"
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
              <h2 className="text-2xl font-bold text-white mb-2">
                {activeShelf === "all"
                  ? "Your library is empty"
                  : `No books in "${
                      activeShelf === "wantToRead"
                        ? "Want to Read"
                        : activeShelf === "currentlyReading"
                        ? "Currently Reading"
                        : "Read"
                    }"`}
              </h2>
              <p className="text-white/60 mb-6">
                Start building your reading collection!
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-8 py-3 bg-[#C9A86A] hover:bg-[#B89858] text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-[#C9A86A]/30 hover:-translate-y-0.5 inline-block"
              >
                Add Your First Book
              </button>
            </div>
          )}
        </div>

        {/* Modals */}
        <AddBookModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={loadData}
        />

        <ProgressUpdateModal
          isOpen={!!progressModalEntry}
          onClose={() => setProgressModalEntry(null)}
          onSuccess={loadData}
          libraryEntry={progressModalEntry}
        />
      </div>
    </ProtectedLayout>
  )
}
