"use client"

import ConfirmModal from "@/components/ConfirmModal"
import PageWrapper from "@/components/PageWrapper"
import ProtectedLayout from "@/components/ProtectedLayout"
import SuccessModal from "@/components/SuccessModal"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface Review {
  _id: string
  rating: number
  comment: string
  status: "pending" | "approved" | "rejected"
  user: {
    _id: string
    name: string
    photoURL?: string
  }
  book: {
    _id: string
    title: string
    author: string
  }
  createdAt: string
}

export default function ModerateReviewsPage() {
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} })
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean
    title: string
    message: string
  }>({ isOpen: false, title: "", message: "" })

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userStr = localStorage.getItem("user")

    if (!token || !userStr) {
      router.push("/login")
      return
    }

    const user = JSON.parse(userStr)
    if (user.role !== "admin") {
      router.push("/library")
      toast.error("Access denied. Admin only.")
      return
    }

    fetchReviews()
  }, [router])

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredReviews(reviews)
    } else {
      setFilteredReviews(reviews.filter((r) => r.status === statusFilter))
    }
  }, [statusFilter, reviews])

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${API_URL}/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setReviews(response.data.reviews || [])
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to load reviews")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (
    reviewId: string,
    newStatus: "approved" | "rejected"
  ) => {
    const review = reviews.find((r) => r._id === reviewId)
    if (!review) return

    setConfirmModal({
      isOpen: true,
      title: `${newStatus === "approved" ? "Approve" : "Reject"} Review?`,
      message: `${newStatus === "approved" ? "Approve" : "Reject"} ${
        review.user.name
      }'s review of "${review.book.title}"?`,
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token")
          await axios.put(
            `${API_URL}/reviews/${reviewId}/status`,
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } }
          )

          setSuccessModal({
            isOpen: true,
            title: `Review ${
              newStatus === "approved" ? "Approved" : "Rejected"
            }!`,
            message: `The review has been ${newStatus}.`,
          })

          fetchReviews()
        } catch (error: any) {
          toast.error(error.response?.data?.error || "Failed to update review")
        }
      },
    })
  }

  const handleDelete = async (reviewId: string) => {
    const review = reviews.find((r) => r._id === reviewId)
    if (!review) return

    setConfirmModal({
      isOpen: true,
      title: "Delete Review?",
      message: `Permanently delete ${review.user.name}'s review of "${review.book.title}"? This cannot be undone.`,
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token")
          await axios.delete(`${API_URL}/reviews/${reviewId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })

          setSuccessModal({
            isOpen: true,
            title: "Review Deleted!",
            message: "The review has been permanently removed.",
          })

          fetchReviews()
        } catch (error: any) {
          toast.error(error.response?.data?.error || "Failed to delete review")
        }
      },
    })
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? "text-yellow-400" : "text-gray-400"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <ProtectedLayout>
        <PageWrapper className="-mt-16 pt-16">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-white text-xl">Loading reviews...</div>
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
            <h1 className="text-4xl font-bold text-white mb-2">
              Moderate Reviews
            </h1>
            <p className="text-white/70 text-lg">
              Manage and moderate user book reviews
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex gap-3">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-6 py-2 rounded-xl font-medium transition ${
                statusFilter === "all"
                  ? "bg-[#C9A86A] text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              All ({reviews.length})
            </button>
            <button
              onClick={() => setStatusFilter("approved")}
              className={`px-6 py-2 rounded-xl font-medium transition ${
                statusFilter === "approved"
                  ? "bg-green-500 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              Approved ({reviews.filter((r) => r.status === "approved").length})
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-6 py-2 rounded-xl font-medium transition ${
                statusFilter === "pending"
                  ? "bg-yellow-500 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              Pending ({reviews.filter((r) => r.status === "pending").length})
            </button>
            <button
              onClick={() => setStatusFilter("rejected")}
              className={`px-6 py-2 rounded-xl font-medium transition ${
                statusFilter === "rejected"
                  ? "bg-red-500 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              Rejected ({reviews.filter((r) => r.status === "rejected").length})
            </button>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-12 text-center">
                <p className="text-white/60 text-lg">
                  No reviews{" "}
                  {statusFilter !== "all"
                    ? `with status "${statusFilter}"`
                    : "yet"}
                  .
                </p>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      {/* User Info */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#C9A86A] flex items-center justify-center overflow-hidden">
                          {review.user.photoURL ? (
                            <img
                              src={review.user.photoURL}
                              alt={review.user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-semibold">
                              {review.user.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {review.user.name}
                          </p>
                          <p className="text-white/50 text-sm">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Book & Rating */}
                      <p className="text-white/70 text-sm mb-2">
                        Review for:{" "}
                        <span className="text-white font-medium">
                          {review.book.title}
                        </span>{" "}
                        by {review.book.author}
                      </p>
                      {renderStars(review.rating)}

                      {/* Comment */}
                      <p className="text-white/90 mt-3">{review.comment}</p>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        review.status === "approved"
                          ? "bg-green-500/20 text-green-300"
                          : review.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {review.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                    {review.status !== "approved" && (
                      <button
                        onClick={() =>
                          handleStatusChange(review._id, "approved")
                        }
                        className="px-4 py-2 bg-green-500/80 backdrop-blur-sm hover:bg-green-500 text-white font-medium rounded-xl text-sm transition shadow-lg hover:shadow-green-500/50"
                      >
                        Approve
                      </button>
                    )}
                    {review.status !== "rejected" && (
                      <button
                        onClick={() =>
                          handleStatusChange(review._id, "rejected")
                        }
                        className="px-4 py-2 bg-yellow-500/80 backdrop-blur-sm hover:bg-yellow-500 text-white font-medium rounded-xl text-sm transition shadow-lg hover:shadow-yellow-500/50"
                      >
                        Reject
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="px-4 py-2 bg-red-500/80 backdrop-blur-sm hover:bg-red-500 text-white font-medium rounded-xl text-sm transition shadow-lg hover:shadow-red-500/50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Confirm Modal */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
          onConfirm={confirmModal.onConfirm}
          title={confirmModal.title}
          message={confirmModal.message}
          type="warning"
        />

        {/* Success Modal */}
        <SuccessModal
          isOpen={successModal.isOpen}
          onClose={() => setSuccessModal({ ...successModal, isOpen: false })}
          title={successModal.title}
          message={successModal.message}
          type="success"
        />
      </PageWrapper>
    </ProtectedLayout>
  )
}
