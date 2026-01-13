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
  videoUrl?: string
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
    videoUrl: "",
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
        videoUrl: "",
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
      videoUrl: tutorial.videoUrl || "",
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

  const getVideoEmbedUrl = (url: string) => {
    if (!url) return null

    // YouTube
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/
    const youtubeMatch = url.match(youtubeRegex)
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`
    }

    // Vimeo
    const vimeoRegex = /vimeo\.com\/(\d+)/
    const vimeoMatch = url.match(vimeoRegex)
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`
    }

    return null
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      title: "",
      description: "",
      content: "",
      videoUrl: "",
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

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Video URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, videoUrl: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white/20 border-2 border-white/30 rounded-xl focus:border-[#C9A86A] outline-none text-white placeholder:text-white/50"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  <p className="text-white/50 text-xs mt-1">
                    Paste YouTube or Vimeo URL for video tutorials
                  </p>

                  {/* Live Video Preview */}
                  {formData.videoUrl && getVideoEmbedUrl(formData.videoUrl) && (
                    <div className="mt-3">
                      <p className="text-white/70 text-sm mb-2">
                        Video Preview:
                      </p>
                      <iframe
                        src={getVideoEmbedUrl(formData.videoUrl) || ""}
                        className="w-full h-64 rounded-xl border-2 border-[#C9A86A]/30"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
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
              <div className="space-y-6">
                {tutorials.map((tutorial) => (
                  <div
                    key={tutorial._id}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 transition shadow-xl"
                  >
                    <div
                      className={`${
                        tutorial.videoUrl && getVideoEmbedUrl(tutorial.videoUrl)
                          ? "grid grid-cols-1 lg:grid-cols-2 gap-0"
                          : "p-6"
                      }`}
                    >
                      {/* Video Section - Left Side */}
                      {tutorial.videoUrl &&
                        getVideoEmbedUrl(tutorial.videoUrl) && (
                          <div className="relative h-72 lg:h-full min-h-[300px]">
                            <iframe
                              src={getVideoEmbedUrl(tutorial.videoUrl) || ""}
                              className="absolute inset-0 w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        )}

                      {/* Content Section - Right Side */}
                      <div className="p-6 flex flex-col justify-between">
                        <div>
                          {/* Title & Status */}
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <h3 className="text-2xl font-bold text-white">
                              {tutorial.title}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 ${
                                tutorial.status === "published"
                                  ? "bg-green-500 text-white"
                                  : "bg-yellow-500 text-gray-900"
                              }`}
                            >
                              {tutorial.status.toUpperCase()}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-gray-200 text-base mb-4 leading-relaxed">
                            {tutorial.description}
                          </p>

                          {/* Metadata */}
                          <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
                            <span className="px-3 py-1.5 bg-[#C9A86A] text-white rounded-lg font-medium">
                              {tutorial.category}
                            </span>
                            <span className="text-gray-200 flex items-center gap-1">
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path
                                  fillRule="evenodd"
                                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {tutorial.views} views
                            </span>
                            <span className="text-gray-200 flex items-center gap-1">
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {new Date(
                                tutorial.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(tutorial)}
                            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-lg hover:shadow-blue-600/50"
                          >
                            Edit Tutorial
                          </button>
                          <button
                            onClick={() => handleDelete(tutorial._id)}
                            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition shadow-lg hover:shadow-red-600/50"
                          >
                            Delete
                          </button>
                        </div>
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
