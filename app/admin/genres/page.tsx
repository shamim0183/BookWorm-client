"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface Genre {
  _id: string
  name: string
  description: string
}

export default function AdminGenresPage() {
  const [genres, setGenres] = useState<Genre[]>([])
  const [formData, setFormData] = useState({ name: "", description: "" })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGenres()
  }, [])

  const fetchGenres = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${API_URL}/genres`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setGenres(response.data.genres)
    } catch (error) {
      toast.error("Failed to fetch genres")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = localStorage.getItem("token")
    const method = editingId ? "put" : "post"
    const url = editingId
      ? `${API_URL}/genres/${editingId}`
      : `${API_URL}/genres`

    try {
      await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      toast.success(editingId ? "Genre updated!" : "Genre created!")
      setFormData({ name: "", description: "" })
      setEditingId(null)
      fetchGenres()
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Operation failed")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this genre?")) return

    const token = localStorage.getItem("token")
    try {
      await axios.delete(`${API_URL}/genres/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success("Genre deleted!")
      fetchGenres()
    } catch (error) {
      toast.error("Failed to delete")
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <Toaster position="top-right" />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-heading font-bold text-charcoal-dark mb-8">
          Manage Genres
        </h1>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-heading font-semibold text-charcoal-dark mb-6">
            {editingId ? "Edit Genre" : "Add New Genre"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-dark mb-2">
                Genre Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-forest outline-none"
                placeholder="e.g., Science Fiction"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-dark mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-forest outline-none"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-forest text-white rounded-md hover:bg-opacity-90 transition"
              >
                {editingId ? "Update" : "Create"} Genre
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null)
                    setFormData({ name: "", description: "" })
                  }}
                  className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-opacity-90 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <h2 className="text-2xl font-heading font-semibold text-charcoal-dark mb-6">
            All Genres ({genres.length})
          </h2>
          {genres.length === 0 ? (
            <p className="text-center text-charcoal py-8">
              No genres yet. Create your first one above!
            </p>
          ) : (
            <div className="space-y-3">
              {genres.map((genre) => (
                <div
                  key={genre._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-md hover:bg-cream-dark transition"
                >
                  <div>
                    <h3 className="font-medium text-charcoal-dark">
                      {genre.name}
                    </h3>
                    {genre.description && (
                      <p className="text-sm text-charcoal mt-1">
                        {genre.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(genre._id)
                        setFormData({
                          name: genre.name,
                          description: genre.description,
                        })
                      }}
                      className="px-4 py-2 bg-teal text-white rounded-md hover:bg-opacity-90 transition text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(genre._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-opacity-90 transition text-sm"
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
    </div>
  )
}
