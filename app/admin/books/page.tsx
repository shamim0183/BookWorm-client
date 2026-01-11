"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface Genre {
  _id: string
  name: string
}

interface Book {
  _id: string
  title: string
  author: string
  coverId?: number
  genres: Genre[]
}

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [selectedBook, setSelectedBook] = useState<any>(null)

  useEffect(() => {
    fetchBooks()
    fetchGenres()
  }, [])

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${API_URL}/books`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setBooks(response.data.books)
    } catch (error) {
      toast.error("Failed to fetch books")
    }
  }

  const fetchGenres = async () => {
    try {
      const response = await axios.get(`${API_URL}/genres`)
      setGenres(response.data.genres)
    } catch (error) {
      console.error("Failed to fetch genres")
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

  const handleSelectBook = (book: any) => {
    setSelectedBook({
      title: book.title,
      author: book.author_name?.[0] || "Unknown",
      isbn: book.isbn?.[0] || "",
      coverId: book.cover_i,
      olid: book.key,
      publishYear: book.first_publish_year,
      description: book.first_sentence?.[0] || "",
      selectedGenres: [],
    })
    setSearchResults([])
    setSearchQuery("")
  }

  const handleAddBook = async () => {
    if (!selectedBook) return

    const token = localStorage.getItem("token")
    try {
      await axios.post(
        `${API_URL}/books`,
        {
          title: selectedBook.title,
          author: selectedBook.author,
          isbn: selectedBook.isbn,
          coverId: selectedBook.coverId,
          olid: selectedBook.olid,
          publishYear: selectedBook.publishYear,
          description: selectedBook.description,
          genres: selectedBook.selectedGenres,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      toast.success("Book added!")
      setSelectedBook(null)
      fetchBooks()
    } catch (error) {
      toast.error("Failed to add book")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this book?")) return

    const token = localStorage.getItem("token")
    try {
      await axios.delete(`${API_URL}/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success("Book deleted!")
      fetchBooks()
    } catch (error) {
      toast.error("Failed to delete")
    }
  }

  const getCoverUrl = (coverId: number, size: string = "M") => {
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`
  }

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-heading font-bold text-charcoal-dark mb-8 fade-in">
          Manage Books
        </h1>

        {/* OpenLibrary Search */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 border border-gray-200 card-shadow">
          <h2 className="text-2xl font-heading font-semibold text-charcoal-dark mb-6">
            Search OpenLibrary
          </h2>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md"
              placeholder="Search by title, author, or ISBN..."
            />
            <button
              type="submit"
              disabled={searching}
              className="btn-primary disabled:opacity-50"
            >
              {searching ? "Searching..." : "Search"}
            </button>
          </form>

          {searchResults.length > 0 && (
            <div className="mt-6 space-y-3 max-h-96 overflow-y-auto">
              <p className="text-sm text-charcoal-light font-medium">
                Found {searchResults.length} results:
              </p>
              {searchResults.map((book, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-md hover:bg-cream-dark cursor-pointer transition slide-in"
                  onClick={() => handleSelectBook(book)}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {book.cover_i && (
                    <img
                      src={getCoverUrl(book.cover_i, "S")}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded shadow-sm"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-charcoal-dark">
                      {book.title}
                    </h3>
                    <p className="text-sm text-charcoal">
                      by {book.author_name?.[0] || "Unknown"}
                    </p>
                    {book.first_publish_year && (
                      <p className="text-xs text-charcoal-light">
                        Published: {book.first_publish_year}
                      </p>
                    )}
                  </div>
                  <button className="px-4 py-2 bg-teal text-white rounded-md text-sm hover:bg-opacity-90">
                    Select
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Book Form */}
        {selectedBook && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8 border border-gray-200 card-shadow fade-in">
            <h2 className="text-2xl font-heading font-semibold text-charcoal-dark mb-6">
              Add Book Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-charcoal-dark mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={selectedBook.title}
                  onChange={(e) =>
                    setSelectedBook({ ...selectedBook, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal-dark mb-2">
                  Author *
                </label>
                <input
                  type="text"
                  value={selectedBook.author}
                  onChange={(e) =>
                    setSelectedBook({ ...selectedBook, author: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-charcoal-dark mb-2">
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
                    className={`px-4 py-2 rounded-md text-sm transition ${
                      selectedBook.selectedGenres.includes(genre._id)
                        ? "bg-forest text-white"
                        : "bg-cream-dark text-charcoal hover:bg-forest hover:text-white"
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={handleAddBook} className="btn-primary">
                Add Book
              </button>
              <button
                onClick={() => setSelectedBook(null)}
                className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-opacity-90"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Books List */}
        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200 card-shadow">
          <h2 className="text-2xl font-heading font-semibold text-charcoal-dark mb-6">
            All Books ({books.length})
          </h2>
          {books.length === 0 ? (
            <p className="text-center text-charcoal py-8">
              No books yet. Add your first one above!
            </p>
          ) : (
            <div className="grid gap-4">
              {books.map((book, index) => (
                <div
                  key={book._id}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-md hover:bg-cream-dark transition slide-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {book.coverId && (
                    <img
                      src={getCoverUrl(book.coverId)}
                      alt={book.title}
                      className="w-20 h-28 object-cover rounded shadow"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-heading text-lg font-semibold text-charcoal-dark">
                      {book.title}
                    </h3>
                    <p className="text-sm text-charcoal">by {book.author}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {book.genres.map((genre) => (
                        <span
                          key={genre._id}
                          className="px-2 py-1 bg-cream-dark text-charcoal text-xs rounded"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-opacity-90 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
