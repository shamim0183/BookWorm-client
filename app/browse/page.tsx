"use client"

import PageWrapper from "@/components/PageWrapper"
import ProtectedLayout from "@/components/ProtectedLayout"
import { searchBooks } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function BrowseBooksPage() {
  const router = useRouter()
  const [allBooks, setAllBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const booksPerPage = 20

  useEffect(() => {
    loadBooks(currentPage)
  }, [currentPage])

  // Client-side search filter
  const getFilteredBooks = () => {
    if (!searchQuery.trim()) {
      return allBooks
    }

    const query = searchQuery.toLowerCase()
    return allBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    )
  }

  const books = getFilteredBooks()

  const loadBooks = async () => {
    try {
      setLoading(true)
      const data = await searchBooks("") // Get all books
      setAllBooks(data.books || [])
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <ProtectedLayout>
        <PageWrapper className="-mt-16 pt-16">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-white text-xl">Loading books...</div>
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
            <h1 className="text-4xl font-bold text-white mb-2">Browse Books</h1>
            <p className="text-white/70 text-lg">
              Discover your next great read from our collection
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <div className="flex gap-4 flex-wrap">
              {/* Search Bar */}
              <div className="flex-1 min-w-[300px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title or author..."
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl focus:border-[#C9A86A] focus:bg-white/30 outline-none transition-all text-white placeholder:text-white/50"
                />
              </div>

              {/* Clear Button */}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all border border-white/20"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-white/70">
              Found {books.length} {books.length === 1 ? "book" : "books"}
            </p>
          </div>

          {/* Book Grid */}
          {books.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {books.map((book) => (
                <div
                  key={book._id}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 hover:border-[#C9A86A]/50 hover:shadow-2xl hover:shadow-[#C9A86A]/20 transition-all group cursor-pointer"
                  onClick={() => router.push(`/books/${book._id}`)}
                >
                  {/* Book Cover */}
                  <div className="aspect-[2/3] bg-white/5 overflow-hidden relative">
                    {book.coverImage || book.coverId ? (
                      <img
                        src={
                          book.coverImage ||
                          `https://covers.openlibrary.org/b/id/${book.coverId}-L.jpg`
                        }
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-16 h-16 text-white/20"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Book Info */}
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1 group-hover:text-[#C9A86A] transition">
                      {book.title}
                    </h3>
                    <p className="text-white/60 text-xs line-clamp-1">
                      {book.author}
                    </p>
                  </div>
                </div>
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
                No books found
              </h2>
              <p className="text-white/60 mb-6">
                Try adjusting your search or browse all books
              </p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  loadBooks()
                }}
                className="px-8 py-3 bg-[#C9A86A] hover:bg-[#B89858] text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-[#C9A86A]/30 hover:-translate-y-0.5 inline-block"
              >
                View All Books
              </button>
            </div>
          )}
        </div>
      </PageWrapper>
    </ProtectedLayout>
  )
}
