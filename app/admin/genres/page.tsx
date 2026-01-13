"use client"

import ConfirmModal from "@/components/ConfirmModal"
import PageWrapper from "@/components/PageWrapper"
import ProtectedLayout from "@/components/ProtectedLayout"
import { createGenre, deleteGenre, getGenres, updateGenre } from "@/lib/api"
import { useAuth } from "@/lib/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

interface Genre {
  _id: string
  name: string
  description: string
}

export default function AdminGenresPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [genres, setGenres] = useState<Genre[]>([])
  const [formData, setFormData] = useState({ name: "", description: "" })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} })

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/library")
      toast.error("Access denied. Admin only.")
    } else if (user) {
      fetchGenres()
    }
  }, [user, router])

  const fetchGenres = async () => {
    try {
      const data = await getGenres()
      setGenres(data.genres || [])
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingId) {
        await updateGenre(editingId, formData)
        toast.success("Genre updated!")
      } else {
        await createGenre(formData)
        toast.success("Genre created!")
      }
      setFormData({ name: "", description: "" })
      setEditingId(null)
      fetchGenres()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleDelete = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Genre?",
      message:
        "This will remove the genre. Books using this genre will keep their link.",
      onConfirm: async () => {
        try {
          await deleteGenre(id)
          toast.success("Genre deleted successfully!")
          fetchGenres()
        } catch (error: any) {
          toast.error(error.message)
        }
      },
    })
  }

  return (
    <ProtectedLayout>
      <PageWrapper className="-mt-16 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Manage Genres
            </h1>
            <p className="text-white/70 text-lg">
              Create and manage book categories
            </p>
          </div>

          {/* Form */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {editingId ? "Edit Genre" : "Add New Genre"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Genre Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl focus:border-[#C9A86A] focus:bg-white/30 outline-none transition-all text-white placeholder:text-white/50"
                  placeholder="e.g., Science Fiction"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl focus:border-[#C9A86A] focus:bg-white/30 outline-none transition-all text-white placeholder:text-white/50"
                  rows={3}
                  placeholder="Optional description for this genre"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#C9A86A] hover:bg-[#B89858] text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-[#C9A86A]/30"
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
                    className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">
              All Genres ({genres.length})
            </h2>
            {genres.length === 0 ? (
              <p className="text-center text-white/60 py-8">
                No genres yet. Create your first one above!
              </p>
            ) : (
              <div className="space-y-3">
                {genres.map((genre) => (
                  <div
                    key={genre._id}
                    className="flex items-start justify-between p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-lg">
                        {genre.name}
                      </h3>
                      {genre.description && (
                        <p className="text-sm text-white/60 mt-1">
                          {genre.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => {
                          setEditingId(genre._id)
                          setFormData({
                            name: genre.name,
                            description: genre.description,
                          })
                        }}
                        className="px-4 py-2 bg-blue-500/80 backdrop-blur-sm hover:bg-blue-500 text-white font-medium rounded-xl transition text-sm shadow-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(genre._id)}
                        className="px-4 py-2 bg-red-500/80 backdrop-blur-sm hover:bg-red-500 text-white font-medium rounded-xl transition text-sm shadow-lg"
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

        {/* Confirm Modal */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
          onConfirm={confirmModal.onConfirm}
          title={confirmModal.title}
          message={confirmModal.message}
          type="danger"
        />
      </PageWrapper>
    </ProtectedLayout>
  )
}
