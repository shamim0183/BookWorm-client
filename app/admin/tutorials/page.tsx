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

const CATEGORIES = [
  "Getting Started",
  "Reading Tips",
  "Book Management",
  "Community",
  "Advanced Features",
]

interface Tutorial {
  _id: string
  title: string
  description: string
  content: string
  category: string
  status: "draft" | "published"
  views: number
  author: {
    _id: string
    name: string
    photoURL?: string
  }
  createdAt: string
}

export default function ManageTutorialsPage() {
  const router = useRouter()
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "Getting Started",
    status: "draft" as "draft" | "published",
  })
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

    fetchTutorials()
  }, [router])

  const fetchTutorials = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${API_URL}/tutorials`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTutorials(response.data.tutorials || [])
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to load tutorials")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.content) {
      toast.error("All fields are required")
      return
    }

    try {
      const token = localStorage.getItem("token")

      if (editingId) {
        await axios.put(`${API_URL}/tutorials/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })

        setSuccessModal({
          isOpen: true,
          title: "Tutorial Updated!",
          message: `"${formData.title}" has been updated successfully.`,
        })
      } else {
        await axios.post(`${API_URL}/tutorials`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        })

        setSuccessModal({
          isOpen: true,
          title: "Tutorial Created!",
          message: `"${formData.title}" has been created successfully.`,
        })
      }

      setFormData({
        title: "",
        description: "",
        content: "",
        category: "Getting Started",
        status: "draft",
      })
      setShowForm(false)
      setEditingId(null)
      fetchTutorials()
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to save tutorial")
    }
  }

  const handleEdit = (tutorial: Tutorial) => {
    setEditingId(tutorial._id)
    setFormData({
      title: tutorial.title,
      description: tutorial.description,
      content: tutorial.content,
      category: tutorial.category,
      status: tutorial.status,
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    const tutorial = tutorials.find((t) => t._id === id)
    if (!tutorial) return

    setConfirmModal({
      isOpen: true,
      title: "Delete Tutorial?",
      message: `Permanently delete "${tutorial.title}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token")
          await axios.delete(`${API_URL}/tutorials/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })

          setSuccessModal({
            isOpen: true,
            title: "Tutorial Deleted!",
            message: "The tutorial has been permanently removed.",
          })

          fetchTutorials()
        } catch (error: any) {
          toast.error(
            error.response?.data?.error || "Failed to delete tutorial"
          )
        }
      },
    })
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      title: "",
      description: "",
      content: "",
      category: "Getting Started",
      status: "draft",
    })
  }

  if (loading) {
    return (
      <ProtectedLayout>
        <PageWrapper className="-mt-16 pt-16">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-white text-xl">Loading tutorials...</div>
          </div>
        </PageWrapper>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <PageWrapper className="-mt-16 pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Manage Tutorials
                </h1>
                <p className="text-white/70 text-lg">
                  Create and manage reading tutorials
                </p>
              </div>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 bg-[#C9A86A] hover:bg-[#B89858] text-white font-semibold rounded-xl transition shadow-lg"
                >
                  + Create Tutorial
                </button>
              )}
            </div>
          </div>

          {/* Create/Edit Form */}
          {showForm && (
            <div className="mb-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">
                {editingId ? "Edit Tutorial" : "Create New Tutorial"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white/20 border-2 border-white/30 rounded-xl focus:border-[#C9A86A] outline-none text-white placeholder:text-white/50"
                    placeholder="Enter tutorial title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Description *
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white/20 border-2 border-white/30 rounded-xl focus:border-[#C9A86A] outline-none text-white placeholder:text-white/50"
                    placeholder="Brief description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Content *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={10}
                    className="w-full px-4 py-2 bg-white/20 border-2 border-white/30 rounded-xl focus:border-[#C9A86A] outline-none text-white placeholder:text-white/50"
                    placeholder="Write your tutorial content here..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-white/20 border-2 border-white/30 rounded-xl focus:border-[#C9A86A] outline-none text-white"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="bg-[#1F242E]">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as "draft" | "published",
                        })
                      }
                      className="w-full px-4 py-2 bg-white/20 border-2 border-white/30 rounded-xl focus:border-[#C9A86A] outline-none text-white"
                    >
                      <option value="draft" className="bg-[#1F242E]">
                        Draft
                      </option>
                      <option value="published" className="bg-[#1F242E]">
                        Published
                      </option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#C9A86A] hover:bg-[#B89858] text-white font-semibold rounded-xl transition shadow-lg"
                  >
                    {editingId ? "Update Tutorial" : "Create Tutorial"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tutorials List */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">
              All Tutorials ({tutorials.length})
            </h2>

            {tutorials.length === 0 ? (
              <p className="text-center text-white/60 py-8">
                No tutorials created yet.
              </p>
            ) : (
              <div className="space-y-4">
                {tutorials.map((tutorial) => (
                  <div
                    key={tutorial._id}
                    className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-white">
                            {tutorial.title}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                              tutorial.status === "published"
                                ? "bg-green-500/20 text-green-300"
                                : "bg-yellow-500/20 text-yellow-300"
                            }`}
                          >
                            {tutorial.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-white/70 mb-3">
                          {tutorial.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-white/50">
                          <span className="px-3 py-1 bg-[#C9A86A]/20 text-[#C9A86A] rounded-lg">
                            {tutorial.category}
                          </span>
                          <span>👁️ {tutorial.views} views</span>
                          <span>
                            {new Date(tutorial.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(tutorial)}
                          className="px-4 py-2 bg-blue-500/80 backdrop-blur-sm hover:bg-blue-500 text-white font-medium rounded-xl text-sm transition shadow-lg hover:shadow-blue-500/50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(tutorial._id)}
                          className="px-4 py-2 bg-red-500/80 backdrop-blur-sm hover:bg-red-500 text-white font-medium rounded-xl text-sm transition shadow-lg hover:shadow-red-500/50"
                        >
                          Delete
                        </button>
                      </div>
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
