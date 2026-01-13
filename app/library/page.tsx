"use client"

import BookCard from "@/components/BookCard"
import PageWrapper from "@/components/PageWrapper"
import ProgressUpdateModal from "@/components/ProgressUpdateModal"
import ProtectedLayout from "@/components/ProtectedLayout"
import { getLibrary, getStats, removeFromLibrary } from "@/lib/api"
import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function LibraryPage() {
  const [library, setLibrary] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeShelf, setActiveShelf] = useState<
    "all" | "wantToRead" | "currentlyReading" | "read"
  >("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEntry, setSelectedEntry] = useState<any>(null)
  const [progressModalEntry, setProgressModalEntry] = useState<any>(null)
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean
    entry: any
  }>({ isOpen: false, entry: null })

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
    setDeleteConfirmModal({ isOpen: true, entry })
  }

  const confirmDelete = async () => {
    const entry = deleteConfirmModal.entry
    setDeleteConfirmModal({ isOpen: false, entry: null })

    try {
      await removeFromLibrary(entry._id)
      toast.success("Book removed!")
      loadData()
      setSelectedEntry(null)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleShelfChange = async (shelf: string) => {
    if (!selectedEntry) return
    try {
      const token = localStorage.getItem("token")
      // Use the POST route which handles updates when entry exists
      await axios.post(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        }/library`,
        {
          bookId: selectedEntry.book._id,
          shelf,
          totalPages:
            shelf === "currentlyReading"
              ? selectedEntry.book.totalPages
              : undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success(`Moved to ${shelf.replace(/([A-Z])/g, " $1")}`)
      loadData()
      setSelectedEntry(null)
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update shelf")
    }
  }

  // Debounced search filter
  const getFilteredLibrary = useCallback(() => {
    let filtered =
      activeShelf === "all"
        ? library
        : library.filter((entry) => entry.shelf === activeShelf)

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (entry) =>
          entry.book.title.toLowerCase().includes(query) ||
          entry.book.author.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [library, activeShelf, searchQuery])

  const filteredLibrary = getFilteredLibrary()

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
      <PageWrapper className="-mt-16 pt-16">
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

          {/* Shelf Tabs and Search */}
          <div className="flex flex-col gap-4 mb-6">
            {/* Search Bar */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50"
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
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your library by title or author..."
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl focus:border-[#C9A86A] focus:bg-white/15 outline-none transition-all text-white placeholder:text-white/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Shelf Filter Tabs */}
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
                  onViewDetails={() => setSelectedEntry(entry)}
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {searchQuery
                  ? "No books found"
                  : activeShelf === "all"
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
                {searchQuery
                  ? `No books match "${searchQuery}" in your library`
                  : "Browse books and add them to your collection!"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => (window.location.href = "/browse")}
                  className="px-8 py-3 bg-[#C9A86A] hover:bg-[#B89858] text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-[#C9A86A]/30 hover:-translate-y-0.5 inline-block"
                >
                  Browse Books
                </button>
              )}
            </div>
          )}
        </div>

        {/* Modals */}
        {/* Book Management Modal */}
        {selectedEntry && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1F242E] border-2 border-[#C9A86A]/30 rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">
                {selectedEntry.book.title}
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-white/70 text-sm mb-3">Current shelf:</p>
                  <p className="text-[#C9A86A] font-semibold mb-4">
                    {selectedEntry.shelf === "wantToRead"
                      ? "Want to Read"
                      : selectedEntry.shelf === "currentlyReading"
                      ? "Currently Reading"
                      : "Read"}
                  </p>
                </div>

                <div>
                  <p className="text-white/70 text-sm mb-3">Move to:</p>
                  <div className="flex flex-col gap-2">
                    {selectedEntry.shelf !== "wantToRead" && (
                      <button
                        onClick={() => handleShelfChange("wantToRead")}
                        className="px-4 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-medium rounded-xl transition border border-blue-400/30 cursor-pointer text-left"
                      >
                        📘 Want to Read
                      </button>
                    )}
                    {selectedEntry.shelf !== "currentlyReading" && (
                      <button
                        onClick={() => handleShelfChange("currentlyReading")}
                        className="px-4 py-3 bg-green-600/20 hover:bg-green-600/30 text-green-300 font-medium rounded-xl transition border border-green-400/30 cursor-pointer text-left"
                      >
                        📖 Currently Reading
                      </button>
                    )}
                    {selectedEntry.shelf !== "read" && (
                      <button
                        onClick={() => handleShelfChange("read")}
                        className="px-4 py-3 bg-[#C9A86A]/20 hover:bg-[#C9A86A]/30 text-[#C9A86A] font-medium rounded-xl transition border border-[#C9A86A]/30 cursor-pointer text-left"
                      >
                        ✅ Read
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/20 flex gap-3">
                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(selectedEntry)
                    }}
                    className="px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-300 font-medium rounded-xl transition border border-red-400/30 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Update Modal */}
        <ProgressUpdateModal
          isOpen={!!progressModalEntry}
          onClose={() => setProgressModalEntry(null)}
          onSuccess={loadData}
          libraryEntry={progressModalEntry}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={deleteConfirmModal.isOpen}
          onClose={() => setDeleteConfirmModal({ isOpen: false, entry: null })}
          onConfirm={confirmDelete}
          title="Remove Book"
          message="Are you sure you want to remove this book from your library? This action cannot be undone."
        />
      </PageWrapper>
    </ProtectedLayout>
  )
}
