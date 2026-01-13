"use client"

import PageWrapper from "@/components/PageWrapper"
import ProtectedLayout from "@/components/ProtectedLayout"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface Book {
  _id: string
  title: string
  author: string
  coverImage: string
  description: string
  genres: { _id: string; name: string }[]
  totalPages: number
  publishedYear: number
  averageRating?: number
  ratings?: {
    average: number
    count: number
  }
  totalShelved: number
}

interface Review {
  _id: string
  user: {
    _id: string
    name: string
    photoURL?: string
  }
  rating: number
  comment: string
  createdAt: string
}

interface LibraryEntry {
  _id: string
  shelf: "wantToRead" | "currentlyReading" | "read"
  progress?: {
    totalPages: number
    pagesRead: number
    percentage: number
  }
}

export default function BookDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.id as string

  const [book, setBook] = useState<Book | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [libraryEntry, setLibraryEntry] = useState<LibraryEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, reviewText: "" })
  const [pagesRead, setPagesRead] = useState(0)

  useEffect(() => {
    if (bookId) {
      fetchBookDetails()
      fetchReviews()
      fetchLibraryStatus()
    }
  }, [bookId])

  const fetchBookDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/books/${bookId}`)
      setBook(response.data.book)
    } catch (error) {
      toast.error("Failed to load book details")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Get cover image URL with fallback to OpenLibrary
  const getCoverImageUrl = () => {
    if (!book) return ""
    if (book.coverImage) return book.coverImage
    if ((book as any).coverId) {
      return `https://covers.openlibrary.org/b/id/${
        (book as any).coverId
      }-L.jpg`
    }
    return ""
  }

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${API_URL}/reviews?bookId=${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setReviews(response.data.reviews || [])
    } catch (error) {
      console.error("Failed to load reviews:", error)
    }
  }

  const fetchLibraryStatus = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${API_URL}/library`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const entry = response.data.library.find(
        (item: any) => item.book._id === bookId
      )
      setLibraryEntry(entry || null)
      if (entry?.progress) {
        setPagesRead(entry.progress.pagesRead)
      }
    } catch (error) {
      console.error("Failed to load library status:", error)
    }
  }

  const handleAddToLibrary = async (shelf: string) => {
    try {
      const token = localStorage.getItem("token")
      await axios.post(
        `${API_URL}/library`,
        {
          bookId,
          shelf,
          totalPages:
            shelf === "currentlyReading" ? book?.totalPages : undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success(`Added to ${shelf.replace(/([A-Z])/g, " $1")}`)
      fetchLibraryStatus()
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to add to library")
    }
  }

  const handleRemoveFromLibrary = async () => {
    if (!libraryEntry) return
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`${API_URL}/library/${libraryEntry._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success("Removed from library")
      setLibraryEntry(null)
    } catch (error) {
      toast.error("Failed to remove from library")
    }
  }

  const handleUpdateProgress = async () => {
    if (!libraryEntry || !book) return
    try {
      const token = localStorage.getItem("token")
      await axios.put(
        `${API_URL}/library/${libraryEntry._id}/progress`,
        { pagesRead },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success("Progress updated!")
      fetchLibraryStatus()
    } catch (error) {
      toast.error("Failed to update progress")
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      await axios.post(
        `${API_URL}/reviews`,
        {
          bookId,
          rating: reviewForm.rating,
          comment: reviewForm.reviewText,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success("Review submitted!")
      setShowReviewForm(false)
      setReviewForm({ rating: 5, reviewText: "" })
      fetchReviews()
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to submit review")
    }
  }

  const renderStars = (
    rating: number,
    interactive = false,
    onRate?: (rating: number) => void
  ) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={() => interactive && onRate && onRate(star)}
            className={`${
              interactive ? "cursor-pointer hover:scale-110 transition" : ""
            }`}
            disabled={!interactive}
          >
            <svg
              className={`w-6 h-6 ${
                star <= rating
                  ? "text-yellow-400 fill-current"
                  : "text-gray-400"
              }`}
              fill={star <= rating ? "currentColor" : "none"}
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
          </button>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <ProtectedLayout>
        <PageWrapper className="-mt-16 pt-16">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-white text-xl">Loading book details...</div>
          </div>
        </PageWrapper>
      </ProtectedLayout>
    )
  }

  if (!book) {
    return (
      <ProtectedLayout>
        <PageWrapper className="-mt-16 pt-16">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Book not found
              </h2>
              <button
                onClick={() => router.push("/browse")}
                className="px-6 py-3 bg-[#C9A86A] hover:bg-[#B89858] text-white font-semibold rounded-xl transition"
              >
                Browse Books
              </button>
            </div>
          </div>
        </PageWrapper>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#1F242E", color: "#FAF7F0" },
          success: { iconTheme: { primary: "#2C5F4F", secondary: "#FAF7F0" } },
        }}
      />
      <PageWrapper className="-mt-16 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.push("/browse")}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-6 group transition-all cursor-pointer"
          >
            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
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
            <span className="font-medium">Back to Browse Books</span>
          </button>

          {/* Book Header */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Book Cover */}
              <div className="lg:col-span-1">
                <div className="relative aspect-2/3 w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#2C5F4F]/50 to-[#1F242E]/50">
                  {getCoverImageUrl() ? (
                    <img
                      src={getCoverImageUrl()}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                        e.currentTarget.nextElementSibling?.classList.remove(
                          "hidden"
                        )
                      }}
                    />
                  ) : null}
                  <div className={getCoverImageUrl() ? "hidden" : ""}>
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-24 h-24 text-white/30"
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
                  </div>
                </div>
              </div>

              {/* Book Info */}
              <div className="lg:col-span-2">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {book.title}
                </h1>
                <p className="text-2xl text-white/80 mb-4">by {book.author}</p>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-6">
                  {renderStars(book.ratings?.average || 0)}
                  <span className="text-white/70">
                    {book.ratings?.average?.toFixed(1) || "No ratings"} (
                    {reviews.length} reviews)
                  </span>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {book.genres.map((genre) => (
                    <span
                      key={genre._id}
                      className="px-3 py-1 bg-[#C9A86A] text-white rounded-lg text-sm font-medium"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                {/* Details */}
                <div className="flex gap-6 text-white/70 mb-6">
                  <span>{book.totalPages} pages</span>
                  <span>Published {book.publishedYear}</span>
                  <span>{book.totalShelved} readers</span>
                </div>

                {/* Library Actions */}
                <div className="space-y-4">
                  {!libraryEntry ? (
                    <div>
                      <p className="text-white/70 mb-3">Add to your library:</p>
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => handleAddToLibrary("wantToRead")}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition cursor-pointer"
                        >
                          Want to Read
                        </button>
                        <button
                          onClick={() => handleAddToLibrary("currentlyReading")}
                          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition cursor-pointer"
                        >
                          Currently Reading
                        </button>
                        <button
                          onClick={() => handleAddToLibrary("read")}
                          className="px-6 py-3 bg-[#C9A86A] hover:bg-[#B89858] text-white font-semibold rounded-xl transition cursor-pointer"
                        >
                          Finished
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-white font-semibold">
                          In your library:{" "}
                          <span className="text-[#C9A86A]">
                            {libraryEntry.shelf === "wantToRead"
                              ? "Want to Read"
                              : libraryEntry.shelf === "currentlyReading"
                              ? "Currently Reading"
                              : "Finished"}
                          </span>
                        </p>
                        <button
                          onClick={handleRemoveFromLibrary}
                          className="text-red-400 hover:text-red-300 text-sm cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>

                      {/* Shelf Switching Buttons */}
                      <div className="mb-4">
                        <p className="text-white/70 text-sm mb-2">Move to:</p>
                        <div className="flex flex-wrap gap-2">
                          {libraryEntry.shelf !== "wantToRead" && (
                            <button
                              onClick={() => handleAddToLibrary("wantToRead")}
                              className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-sm font-medium rounded-lg transition border border-blue-400/30 cursor-pointer"
                            >
                              Want to Read
                            </button>
                          )}
                          {libraryEntry.shelf !== "currentlyReading" && (
                            <button
                              onClick={() =>
                                handleAddToLibrary("currentlyReading")
                              }
                              className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-300 text-sm font-medium rounded-lg transition border border-green-400/30 cursor-pointer"
                            >
                              Currently Reading
                            </button>
                          )}
                          {libraryEntry.shelf !== "read" && (
                            <button
                              onClick={() => handleAddToLibrary("read")}
                              className="px-4 py-2 bg-[#C9A86A]/20 hover:bg-[#C9A86A]/30 text-[#C9A86A] text-sm font-medium rounded-lg transition border border-[#C9A86A]/30 cursor-pointer"
                            >
                              Finished
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Progress Tracker for Currently Reading */}
                      {libraryEntry.shelf === "currentlyReading" && (
                        <div className="space-y-3 pt-3 border-t border-white/20">
                          <p className="text-white/70 text-sm mb-2">
                            Reading Progress:
                          </p>
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              value={pagesRead}
                              onChange={(e) =>
                                setPagesRead(Number(e.target.value))
                              }
                              max={book.totalPages}
                              min={0}
                              className="w-24 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white"
                            />
                            <span className="text-white/70">
                              / {book.totalPages} pages
                            </span>
                            <button
                              onClick={handleUpdateProgress}
                              className="px-4 py-2 bg-[#C9A86A] hover:bg-[#B89858] text-white rounded-lg transition cursor-pointer"
                            >
                              Update
                            </button>
                          </div>
                          {libraryEntry.progress && (
                            <div className="w-full bg-white/20 rounded-full h-3">
                              <div
                                className="bg-[#C9A86A] h-3 rounded-full transition-all"
                                style={{
                                  width: `${libraryEntry.progress.percentage}%`,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8 pt-8 border-t border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">
                Description
              </h2>
              <p className="text-white/80 leading-relaxed">
                {book.description}
              </p>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Reviews ({reviews.length})
              </h2>
              {!showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="px-6 py-3 bg-[#C9A86A] hover:bg-[#B89858] text-white font-semibold rounded-xl transition cursor-pointer"
                >
                  Write a Review
                </button>
              )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <form
                onSubmit={handleSubmitReview}
                className="bg-white/10 rounded-xl p-6 mb-6"
              >
                <h3 className="text-xl font-semibold text-white mb-4">
                  Your Review
                </h3>
                <div className="mb-4">
                  <label className="block text-white/80 mb-2">Rating</label>
                  {renderStars(reviewForm.rating, true, (rating) =>
                    setReviewForm({ ...reviewForm, rating })
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-white/80 mb-2">Review</label>
                  <textarea
                    value={reviewForm.reviewText}
                    onChange={(e) =>
                      setReviewForm({
                        ...reviewForm,
                        reviewText: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder:text-white/50 min-h-[120px]"
                    placeholder="Share your thoughts about this book..."
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#C9A86A] hover:bg-[#B89858] text-white font-semibold rounded-xl transition cursor-pointer"
                  >
                    Submit Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <p className="text-center text-white/60 py-8">
                No reviews yet. Be the first to review this book!
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-white/10 rounded-xl p-6 hover:bg-white/15 transition"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#C9A86A] flex items-center justify-center text-white font-bold shrink-0">
                        {review.user.photoURL ? (
                          <img
                            src={review.user.photoURL}
                            alt={review.user.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          review.user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">
                            {review.user.name}
                          </h4>
                          <span className="text-white/60 text-sm">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mb-2">{renderStars(review.rating)}</div>
                        <p className="text-white/80">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </PageWrapper>
    </ProtectedLayout>
  )
}
