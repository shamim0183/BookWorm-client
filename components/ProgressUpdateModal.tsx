"use client"

import { updateProgress } from "@/lib/api"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

interface ProgressUpdateModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  libraryEntry: any
}

export default function ProgressUpdateModal({
  isOpen,
  onClose,
  onSuccess,
  libraryEntry,
}: ProgressUpdateModalProps) {
  // Early return BEFORE any hooks to ensure consistent hook count
  if (!isOpen || !libraryEntry) return null

  const currentProgress = libraryEntry?.progress?.pagesRead || 0

  const [pagesRead, setPagesRead] = useState(currentProgress)
  const [loading, setLoading] = useState(false)

  // Update pagesRead when modal opens with different entry
  useEffect(() => {
    if (isOpen && libraryEntry) {
      setPagesRead(libraryEntry.progress?.pagesRead || 0)
    }
  }, [isOpen, libraryEntry])

  const totalPages =
    libraryEntry?.book?.totalPages || libraryEntry?.progress?.totalPages || 0
  const percentage =
    totalPages > 0 ? Math.round((pagesRead / totalPages) * 100) : 0

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if book has totalPages set
    if (!totalPages || totalPages === 0) {
      toast.error(
        "This book doesn't have total pages set. Please ask admin to update the book details."
      )
      return
    }

    if (pagesRead < 0 || pagesRead > totalPages) {
      toast.error("Invalid page number")
      return
    }

    setLoading(true)
    try {
      await updateProgress(libraryEntry._id, pagesRead, totalPages)
      toast.success("Progress updated!")
      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl max-w-md w-full">
        {/* Header */}
        <div className="bg-[#1F242E]/90 backdrop-blur-xl border-b border-white/10 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Update Progress</h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition"
            >
              <svg
                className="w-6 h-6"
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
          </div>
          <p className="text-white/60 text-sm mt-1 line-clamp-1">
            {libraryEntry.book?.title}
          </p>
        </div>

        {/* Content */}
        <form onSubmit={handleUpdate} className="p-6 space-y-6">
          {/* Progress Display */}
          <div className="text-center">
            <div className="text-5xl font-bold text-[#C9A86A] mb-2">
              {percentage}%
            </div>
            <div className="text-white/70 text-sm">
              {pagesRead} / {totalPages} pages
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C9A86A] to-[#B89858] transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Pages Read Input */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Pages Read
            </label>
            <input
              type="number"
              min="0"
              max={totalPages}
              value={pagesRead}
              onChange={(e) => setPagesRead(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl focus:border-[#C9A86A] focus:bg-white/30 outline-none transition-all text-white text-center text-xl font-semibold"
            />
          </div>

          {/* Range Slider */}
          <div>
            <input
              type="range"
              min="0"
              max={totalPages}
              value={pagesRead}
              onChange={(e) => setPagesRead(parseInt(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C9A86A] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:bg-[#B89858] [&::-webkit-slider-thumb]:transition"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPagesRead(Math.min(pagesRead + 10, totalPages))}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition border border-white/20"
            >
              +10
            </button>
            <button
              type="button"
              onClick={() => setPagesRead(Math.min(pagesRead + 50, totalPages))}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition border border-white/20"
            >
              +50
            </button>
            <button
              type="button"
              onClick={() => setPagesRead(totalPages)}
              className="px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 text-sm font-medium rounded-lg transition border border-green-400/30"
            >
              Finished
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#C9A86A] hover:bg-[#B89858] disabled:opacity-50 text-white font-semibold rounded-xl transition"
          >
            {loading ? "Updating..." : "Update Progress"}
          </button>
        </form>
      </div>
    </div>
  )
}
