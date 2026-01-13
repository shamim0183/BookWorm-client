"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface Genre {
  _id: string
  name: string
}

interface Book {
  _id: string
  title: string
  author: string
  description?: string
  totalPages?: number
  publishedYear?: number
  coverImage?: string
  genres: { _id: string; name: string }[]
}

interface EditBookModalProps {
  isOpen: boolean
  onClose: () => void
  book: Book
  genres: Genre[]
  onSuccess: () => void
}

export default function EditBookModal({
  isOpen,
  onClose,
  book,
  genres,
  onSuccess,
}: EditBookModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    totalPages: 0,
    publishedYear: new Date().getFullYear(),
    coverImage: "",
    genres: [] as string[],
  })
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (book && isOpen) {
      setFormData({
        title: book.title,
        author: book.author,
        description: book.description || "",
        totalPages: book.totalPages || 0,
        publishedYear: book.publishedYear || new Date().getFullYear(),
        coverImage: book.coverImage || "",
        genres: book.genres.map((g) => g._id),
      })
      setCoverFile(null)
    }
  }, [book, isOpen])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    const uploadFormData = new FormData()
    uploadFormData.append("image", file)

    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        `${API_URL}/upload/image`,
        uploadFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      setFormData({ ...formData, coverImage: response.data.url })
      toast.success("Image uploaded!")
    } catch (error) {
      toast.error("Image upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setSaving(true)
    try {
      // Upload cover image first if new file selected
      let finalCoverImage = formData.coverImage
      if (coverFile) {
        const uploadFormData = new FormData()
        uploadFormData.append("image", coverFile)
        const token = localStorage.getItem("token")
        const uploadResponse = await axios.post(
          `${API_URL}/upload/image`,
          uploadFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        finalCoverImage = uploadResponse.data.url
      }

      // Update book with final cover image URL
      const token = localStorage.getItem("token")
      await axios.put(
        `${API_URL}/books/${book._id}`,
        { ...formData, coverImage: finalCoverImage },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      toast.success("Book updated successfully!")
      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update book")
    } finally {
      setSaving(false)
    }
  }

  const toggleGenre = (genreId: string) => {
    setFormData({
      ...formData,
      genres: formData.genres.includes(genreId)
        ? formData.genres.filter((id) => id !== genreId)
        : [...formData.genres, genreId],
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl bg-[#1F242E]/95 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200 my-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Edit Book</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-2xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Author */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 mb-2">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#C9A86A]"
                required
              />
            </div>
            <div>
              <label className="block text-white/80 mb-2">
                Author <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#C9A86A]"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-white/80 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#C9A86A] resize-none"
            />
          </div>

          {/* Pages & Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 mb-2">Total Pages</label>
              <input
                type="number"
                value={formData.totalPages}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalPages: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#C9A86A]"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-2">Published Year</label>
              <input
                type="number"
                value={formData.publishedYear}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    publishedYear:
                      parseInt(e.target.value) || new Date().getFullYear(),
                  })
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#C9A86A]"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-white/80 mb-2">Cover Image</label>
            <div className="space-y-3">
              <input
                type="text"
                value={formData.coverImage}
                onChange={(e) =>
                  setFormData({ ...formData, coverImage: e.target.value })
                }
                placeholder="Or enter image URL"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#C9A86A]"
              />
              <div className="flex items-center gap-3">
                <label className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white cursor-pointer transition">
                  {uploading ? "Uploading..." : "Upload Image"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setCoverFile(e.target.files[0])
                        handleImageUpload(e.target.files[0])
                      }
                    }}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {formData.coverImage && (
                  <img
                    src={formData.coverImage}
                    alt="Cover preview"
                    className="h-16 w-12 object-cover rounded-lg border-2 border-white/20"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Genres */}
          <div>
            <label className="block text-white/80 mb-2">
              Genres <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre._id}
                  type="button"
                  onClick={() => toggleGenre(genre._id)}
                  className={`px-4 py-2 rounded-lg font-medium transition cursor-pointer ${
                    formData.genres.includes(genre._id)
                      ? "bg-[#C9A86A] text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
            {formData.genres.length === 0 && (
              <p className="text-red-400 text-sm mt-2">
                Please select at least one genre
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving || uploading || formData.genres.length === 0}
              className="flex-1 px-6 py-3 bg-[#C9A86A] hover:bg-[#B89858] disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition cursor-pointer"
            >
              {saving ? "Updating..." : "Update Book"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
