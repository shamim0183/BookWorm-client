"use client"

import {
  addToLibrary,
  createBook,
  searchBooks,
  uploadBookCover,
} from "@/lib/api"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

interface AddBookModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AddBookModal({
  isOpen,
  onClose,
  onSuccess,
}: AddBookModalProps) {
  const [mode, setMode] = useState<"search" | "create">("search")
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)

  // Create mode state
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [description, setDescription] = useState("")
  const [totalPages, setTotalPages] = useState("")
  const [shelf, setShelf] = useState("wantToRead")
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      resetForm()
    }
  }, [isOpen])

  const resetForm = () => {
    setMode("search")
    setSearchQuery("")
    setSearchResults([])
    setTitle("")
    setAuthor("")
    setDescription("")
    setTotalPages("")
    setShelf("wantToRead")
    setCoverFile(null)
    setCoverPreview(null)
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setSearching(true)
    try {
      const data = await searchBooks(searchQuery)
      setSearchResults(data.books || [])
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSearching(false)
    }
  }

  const handleAddExistingBook = async (book: any) => {
    setLoading(true)
    try {
      await addToLibrary(
        book._id,
        shelf,
        totalPages ? parseInt(totalPages) : undefined
      )
      toast.success("Book added to library!")
      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB")
        return
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file")
        return
      }
      setCoverFile(file)
      setCoverPreview(URL.createObjectURL(file))
    }
  }

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !author) {
      toast.error("Title and author are required")
      return
    }

    setLoading(true)
    try {
      let coverImageUrl = ""

      // Upload cover image if provided
      if (coverFile) {
        setUploading(true)
        const uploadData = await uploadBookCover(coverFile)
        coverImageUrl = uploadData.url
        setUploading(false)
      }

      // Create the book
      const bookData = {
        title,
        author,
        description,
        coverImage: coverImageUrl,
      }

      const response = await createBook(bookData)
      const newBook = response.book

      // Add to user's library
      await addToLibrary(
        newBook._id,
        shelf,
        totalPages ? parseInt(totalPages) : undefined
      )

      toast.success("Book created and added to library!")
      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1F242E] border border-white/20 rounded-3xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Add Book to Library</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition"
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

        {/* Search Mode Only for Users */}
        <div className="space-y-6">
          <p className="text-white/70 text-sm mb-4">
            Search for books in our library and add them to your reading list
          </p>

          {/* Search Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search by title or author..."
              className="flex-1 px-4 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl focus:border-[#C9A86A] focus:bg-white/30 outline-none transition-all text-white placeholder:text-white/50"
            />
            <button
              onClick={handleSearch}
              disabled={searching}
              className="px-6 py-3 bg-[#C9A86A] hover:bg-[#B89858] disabled:opacity-50 text-white font-medium rounded-xl transition"
            >
              {searching ? "..." : "Search"}
            </button>
          </div>

          {/* Shelf Selection for Search */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Add to Shelf
            </label>
            <select
              value={shelf}
              onChange={(e) => setShelf(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl focus:border-[#C9A86A] outline-none text-white"
            >
              <option value="wantToRead" className="bg-[#1F242E]">
                Want to Read
              </option>
              <option value="currentlyReading" className="bg-[#1F242E]">
                Currently Reading
              </option>
              <option value="read" className="bg-[#1F242E]">
                Read
              </option>
            </select>
          </div>

          {shelf === "currentlyReading" && (
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Total Pages
              </label>
              <input
                type="number"
                value={totalPages}
                onChange={(e) => setTotalPages(e.target.value)}
                placeholder="300"
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl focus:border-[#C9A86A] outline-none text-white placeholder:text-white/50"
              />
            </div>
          )}

          {/* Search Results */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {searchResults.length > 0 ? (
              searchResults.map((book) => (
                <div
                  key={book._id}
                  className="flex gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition cursor-pointer"
                  onClick={() => handleAddExistingBook(book)}
                >
                  <div className="w-16 h-20 bg-white/10 rounded flex-shrink-0 overflow-hidden">
                    {book.coverImage || book.coverId ? (
                      <img
                        src={
                          book.coverImage ||
                          `https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`
                        }
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-white/30"
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
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{book.title}</h4>
                    <p className="text-white/60 text-sm">{book.author}</p>
                  </div>
                </div>
              ))
            ) : searchQuery && !searching ? (
              <p className="text-white/40 text-center py-8">
                No books found. Try a different search.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
