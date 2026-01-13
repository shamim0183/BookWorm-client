"use client"

import PageWrapper from "@/components/PageWrapper"
import ProtectedLayout from "@/components/ProtectedLayout"
import {
  createBook,
  deleteBook,
  getGenres,
  searchBooks,
  updateBook,
  uploadBookCover,
} from "@/lib/api"
import { useAuth } from "@/lib/AuthContext"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

interface Genre {
  _id: string
  name: string
}

interface Book {
  _id: string
  title: string
  author: string
  description?: string
  coverImage?: string
  coverId?: number
  totalPages?: number
  genres: Genre[]
}

export default function AdminBooksPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [selectedBook, setSelectedBook] = useState<any>(null)
  const [showManualForm, setShowManualForm] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/library")
      toast.error("Access denied. Admin only.")
    } else if (user) {
      fetchBooks()
      fetchGenres()
    }
  }, [user, router])

  const fetchBooks = async () => {
    try {
      const data = await searchBooks("")
      setBooks(data.books || [])
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const fetchGenres = async () => {
    try {
      const data = await getGenres()
      setGenres(data.genres || [])
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setSearching(true)
    try {
      const response = await axios.get(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(
          searchQuery
        )}&limit=10`
      )
      setSearchResults(response.data.docs || [])
    } catch (error) {
      toast.error("Search failed")
    } finally {
      setSearching(false)
    }
  }

  const handleSelectOpenLibraryBook = (book: any) => {
    setSelectedBook({
      title: book.title,
      author: book.author_name?.[0] || "Unknown",
      isbn: book.isbn?.[0] || "",
      coverId: book.cover_i,
      olid: book.key,
      publishYear: book.first_publish_year,
      description: book.first_sentence?.[0] || "",
      selectedGenres: [],
      totalPages: book.number_of_pages_median || 0,
    })
    setSearchResults([])
    setSearchQuery("")
    setShowManualForm(false)
  }

  const handleStartManualAdd = () => {
    setSelectedBook({
      title: "",
      author: "",
      description: "",
      coverImage: "",
      totalPages: 0,
      selectedGenres: [],
    })
    setShowManualForm(true)
    setSearchResults([])
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const data = await uploadBookCover(file)
      setSelectedBook({
        ...selectedBook,
        coverImage: data.url,
      })
      toast.success("Cover uploaded!")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleAddOrUpdateBook = async () => {
    if (!selectedBook) return

    try {
      const bookData = {
        title: selectedBook.title,
        author: selectedBook.author,
        description: selectedBook.description,
        coverImage: selectedBook.coverImage,
        coverId: selectedBook.coverId,
        totalPages: selectedBook.totalPages || 0,
        genres: selectedBook.selectedGenres,
      }

      if (editingBook) {
        await updateBook(editingBook._id, bookData)
        toast.success("Book updated!")
      } else {
        await createBook(bookData)
        toast.success("Book added!")
      }

      setSelectedBook(null)
      setShowManualForm(false)
      setEditingBook(null)
      fetchBooks()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleEdit = (book: Book) => {
    setEditingBook(book)
    setSelectedBook({
      title: book.title,
      author: book.author,
      description: book.description || "",
      coverImage: book.coverImage || "",
      coverId: book.coverId,
      totalPages: book.totalPages || 0,
      selectedGenres: book.genres.map((g) => g._id),
    })
    setShowManualForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this book?")) return

    try {
      await deleteBook(id)
      toast.success("Book deleted!")
      fetchBooks()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const getCoverUrl = (book: any) => {
    if (book.coverImage) return book.coverImage
    if (book.coverId)
      return `https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`
    return ""
  }

  return (
    <ProtectedLayout>
      <PageWrapper className="-mt-16 pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            <h1 className="text-4xl font-bold text-white mb-2">Manage Books</h1>
            <p className="text-white/70 text-lg">
              Add books from OpenLibrary or manually with custom covers
            </p>
          </div>

          {/* OpenLibrary Search */}
          <div className="mb-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Search OpenLibrary
            </h2>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl focus:border-[#C9A86A] focus:bg-white/30 outline-none transition-all text-white placeholder:text-white/50"
                placeholder="Search by title, author, or ISBN..."
              />
              <button
                type="submit"
                disabled={searching}
                className="px-6 py-3 bg-[#C9A86A] hover:bg-[#B89858] disabled:opacity-50 text-white font-semibold rounded-xl transition-all"
              >
                {searching ? "Searching..." : "Search"}
              </button>
              <button
                type="button"
                onClick={handleStartManualAdd}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all"
              >
                + Manual Add
              </button>
            </form>

            {searchResults.length > 0 && (
              <div className="mt-6 space-y-3 max-h-96 overflow-y-auto">
                <p className="text-sm text-white/70">
                  Found {searchResults.length} results:
                </p>
                {searchResults.map((book, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 cursor-pointer transition"
                    onClick={() => handleSelectOpenLibraryBook(book)}
                  >
                    {book.cover_i && (
                      <img
                        src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded shadow-sm"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{book.title}</h3>
                      <p className="text-sm text-white/60">
                        by {book.author_name?.[0] || "Unknown"}
                      </p>
                      {book.first_publish_year && (
                        <p className="text-xs text-white/50">
                          Published: {book.first_publish_year}
                        </p>
                      )}
                    </div>
                    <button className="px-4 py-2 bg-[#C9A86A] text-white rounded-xl text-sm hover:bg-[#B89858]">
                      Select
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add/Edit Book Form */}
          {selectedBook && (
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-6">
                {editingBook ? "Edit Book" : "Add Book Details"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={selectedBook.title}
                    onChange={(e) =>
                      setSelectedBook({
                        ...selectedBook,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-white/20 border-2 border-white/30 rounded-xl focus:border-[#C9A86A] outline-none text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Author *
                  </label>
                  <input
                    type="text"
                    required
                    value={selectedBook.author}
                    onChange={(e) =>
                      setSelectedBook({
                        ...selectedBook,
                        author: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-white/20 border-2 border-white/30 rounded-xl focus:border-[#C9A86A] outline-none text-white placeholder:text-white/50"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Description
                </label>
                <textarea
                  value={selectedBook.description || ""}
                  onChange={(e) =>
                    setSelectedBook({
                      ...selectedBook,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-white/20 border-2 border-white/30 rounded-xl focus:border-[#C9A86A] outline-none text-white placeholder:text-white/50"
                  rows={3}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Total Pages
                </label>
                <input
                  type="number"
                  value={selectedBook.totalPages || ""}
                  onChange={(e) =>
                    setSelectedBook({
                      ...selectedBook,
                      totalPages: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 bg-white/20 border-2 border-white/30 rounded-xl focus:border-[#C9A86A] outline-none text-white placeholder:text-white/50"
                />
              </div>

              {showManualForm && (
                <>
                  {/* Cover URL Input - Works immediately */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Cover Image URL
                    </label>
                    <input
                      type="url"
                      value={selectedBook.coverImage || ""}
                      onChange={(e) =>
                        setSelectedBook({
                          ...selectedBook,
                          coverImage: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-white/20 border-2 border-white/30 rounded-xl focus:border-[#C9A86A] outline-none text-white placeholder:text-white/50"
                      placeholder="https://example.com/cover.jpg"
                    />
                    <p className="text-xs text-white/50 mt-1">
                      Paste any image URL here (works immediately)
                    </p>
                  </div>

                  {/* File Upload - Requires Firebase Storage */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Or Upload Cover Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      disabled={uploading}
                      className="w-full px-4 py-2 bg-white/20 border-2 border-white/30 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#C9A86A] file:text-white hover:file:bg-[#B89858]"
                    />
                    <p className="text-xs text-white/50 mt-1">
                      Upload from your device (requires Firebase Storage setup)
                    </p>
                    {selectedBook.coverImage && (
                      <img
                        src={selectedBook.coverImage}
                        alt="Cover preview"
                        className="mt-4 w-32 h-48 object-cover rounded-xl shadow-lg"
                      />
                    )}
                  </div>
                </>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Select Genres
                </label>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <button
                      key={genre._id}
                      type="button"
                      onClick={() => {
                        const isSelected = selectedBook.selectedGenres.includes(
                          genre._id
                        )
                        setSelectedBook({
                          ...selectedBook,
                          selectedGenres: isSelected
                            ? selectedBook.selectedGenres.filter(
                                (id: string) => id !== genre._id
                              )
                            : [...selectedBook.selectedGenres, genre._id],
                        })
                      }}
                      className={`px-4 py-2 rounded-xl text-sm transition ${
                        selectedBook.selectedGenres.includes(genre._id)
                          ? "bg-[#C9A86A] text-white"
                          : "bg-white/20 text-white hover:bg-white/30"
                      }`}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleAddOrUpdateBook}
                  className="px-6 py-3 bg-[#C9A86A] hover:bg-[#B89858] text-white font-semibold rounded-xl transition-all"
                >
                  {editingBook ? "Update Book" : "Add Book"}
                </button>
                <button
                  onClick={() => {
                    setSelectedBook(null)
                    setShowManualForm(false)
                    setEditingBook(null)
                  }}
                  className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Books List */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">
              All Books ({books.length})
            </h2>
            {books.length === 0 ? (
              <p className="text-center text-white/60 py-8">
                No books yet. Add your first one above!
              </p>
            ) : (
              <div className="grid gap-4">
                {books.map((book) => (
                  <div
                    key={book._id}
                    className="flex items-center gap-4 p-4 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition"
                  >
                    {getCoverUrl(book) && (
                      <img
                        src={getCoverUrl(book)}
                        alt={book.title}
                        className="w-20 h-28 object-cover rounded-xl shadow"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">
                        {book.title}
                      </h3>
                      <p className="text-sm text-white/70">by {book.author}</p>
                      {book.description && (
                        <p className="text-xs text-white/60 mt-1 line-clamp-2">
                          {book.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {book.genres.map((genre) => (
                          <span
                            key={genre._id}
                            className="px-2 py-1 bg-[#C9A86A]/30 text-white text-xs rounded"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(book)}
                        className="px-4 py-2 bg-blue-500/80 backdrop-blur-sm hover:bg-blue-500 text-white font-medium rounded-xl text-sm transition shadow-lg hover:shadow-blue-500/50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="px-4 py-2 bg-red-500/80 backdrop-blur-sm hover:bg-red-500 text-white font-medium rounded-xl text-sm transition shadow-lg hover:shadow-red-500/50"
                      >
                        Delete
                      </button>
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
