"use client"

import { useState } from "react"

interface BookCardProps {
  libraryEntry: any
  onUpdateProgress?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onViewDetails?: () => void
}

export default function BookCard({
  libraryEntry,
  onUpdateProgress,
  onEdit,
  onDelete,
  onViewDetails,
}: BookCardProps) {
  const [imageError, setImageError] = useState(false)
  const book = libraryEntry.book

  // Determine cover image URL
  const getCoverImage = () => {
    if (imageError) return null
    if (book.coverImage) return book.coverImage
    if (book.coverId)
      return `https://covers.openlibrary.org/b/id/${book.coverId}-L.jpg`
    return null
  }

  const coverImage = getCoverImage()

  // Get shelf badge color
  const getShelfColor = () => {
    switch (libraryEntry.shelf) {
      case "wantToRead":
        return "bg-blue-500/20 text-blue-300 border-blue-400/30"
      case "currentlyReading":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-400/30"
      case "read":
        return "bg-green-500/20 text-green-300 border-green-400/30"
      default:
        return "bg-white/20 text-white border-white/30"
    }
  }

  const getShelfLabel = () => {
    switch (libraryEntry.shelf) {
      case "wantToRead":
        return "Want to Read"
      case "currentlyReading":
        return "Reading"
      case "read":
        return "Completed"
      default:
        return libraryEntry.shelf
    }
  }

  const progressPercentage = libraryEntry.progress?.percentage || 0

  return (
    <div
      className="group relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 hover:border-[#C9A86A]/50 hover:shadow-2xl hover:shadow-[#C9A86A]/20 transition-all duration-300 cursor-pointer"
      onClick={onViewDetails}
    >
      {/* Book Cover */}
      <div className="relative aspect-3/4 bg-gradient-to-br from-[#2C5F4F]/50 to-[#1F242E]/50 overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={book.title}
            className="w-full h-full group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-16 h-16 text-white/30"
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

        {/* Compact Badges - Top Right, Horizontal */}
        <div className="absolute top-2 right-2 flex flex-row gap-1 items-center">
          {/* Shelf Badge - More compact */}
          <span
            className={`px-2 py-0.5 text-[10px] font-bold rounded-md border backdrop-blur-sm ${getShelfColor()}`}
          >
            {getShelfLabel()}
          </span>

          {/* Rating Badge - Compact Glassmorphism */}
          {(book.ratings?.average || book.averageRating) > 0 && (
            <div className="px-2 py-0.5 bg-black/50 backdrop-blur-md border border-white/20 rounded-md flex items-center gap-0.5 shadow-lg">
              <span className="text-yellow-400 text-[10px]">★</span>
              <span className="text-white text-[10px] font-bold">
                {(book.ratings?.average || book.averageRating).toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar (for Currently Reading) */}
        {libraryEntry.shelf === "currentlyReading" &&
          progressPercentage > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
              <div
                className="h-full bg-gradient-to-r from-[#C9A86A] to-[#B89858] transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          )}
      </div>

      {/* Book Info */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
          {book.title}
        </h3>
        <p className="text-white/60 text-xs line-clamp-1 mb-3">{book.author}</p>

        {/* Progress Text */}
        {libraryEntry.shelf === "currentlyReading" && (
          <div className="flex items-center justify-between text-xs mb-3">
            <span className="text-white/70">
              {libraryEntry.progress?.pagesRead || 0} /{" "}
              {libraryEntry.progress?.totalPages || 0} pages
            </span>
            <span className="text-[#C9A86A] font-semibold">
              {progressPercentage}%
            </span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {libraryEntry.shelf === "currentlyReading" && onUpdateProgress && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onUpdateProgress()
              }}
              className="flex-1 px-3 py-1.5 bg-[#C9A86A]/60 hover:bg-[#C9A86A]/80 text-white text-xs font-semibold rounded-lg transition border border-[#C9A86A]/50 backdrop-blur-sm cursor-pointer"
            >
              Update
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="px-3 py-1.5 bg-red-600/60 hover:bg-red-600/80 text-white text-xs font-semibold rounded-lg transition border border-red-500/50 backdrop-blur-sm cursor-pointer"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
