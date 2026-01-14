"use client"

import PageWrapper from "@/components/PageWrapper"
import ProtectedLayout from "@/components/ProtectedLayout"
import { useAuth } from "@/lib/AuthContext"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState("")
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    photoURL: user?.photoURL || "",
  })

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const uploadToImgBB = async () => {
    if (!photoFile) return formData.photoURL
    const data = new FormData()
    data.append("image", photoFile)
    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
        data
      )
      return response.data.data.url
    } catch (error) {
      toast.error("Image upload failed")
      return formData.photoURL
    }
  }

  const handlePhotoUpload = () => {
    if (!photoFile) return
    setShowPhotoModal(false)
    toast.success(
      "Photo selected! Click 'Save Changes' below to update your profile."
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")

      // Upload photo if changed
      const photoURL = await uploadToImgBB()

      const response = await axios.put(
        `${API_URL}/auth/profile`,
        { ...formData, photoURL },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      // Update localStorage with new user data
      localStorage.setItem("user", JSON.stringify(response.data.user))

      // Update auth context
      updateUser(response.data.user)

      toast.success("Profile updated successfully!")
      setEditing(false)
      setPhotoFile(null)
      setPhotoPreview("")
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      photoURL: user?.photoURL || "",
    })
    setEditing(false)
    setPhotoFile(null)
    setPhotoPreview("")
  }

  return (
    <ProtectedLayout>
      <PageWrapper className="-mt-16 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
            <p className="text-gray-300">Manage your account information</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
            {/* Cover Image */}
            <div className="h-32 bg-gradient-to-r from-[#2C5F4F] to-[#C9A86A]"></div>

            {/* Profile Content */}
            <div className="relative px-8 pb-8">
              {/* Avatar */}
              <div className="absolute -top-16 left-8">
                {editing ? (
                  <button
                    onClick={() => setShowPhotoModal(true)}
                    className="relative w-32 h-32 rounded-full bg-white/10 border-4 border-[#1F242E] overflow-hidden cursor-pointer hover:border-[#C9A86A] transition-all group"
                  >
                    {formData.photoURL ? (
                      <img
                        src={formData.photoURL}
                        alt={formData.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#C9A86A] flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">
                          {formData.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg
                        className="w-10 h-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  </button>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-white/10 border-4 border-[#1F242E] overflow-hidden">
                    {formData.photoURL ? (
                      <img
                        src={formData.photoURL}
                        alt={formData.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#C9A86A] flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">
                          {formData.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Edit Button */}
              <div className="pt-20 flex justify-end">
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-6 py-2.5 bg-[#C9A86A] hover:bg-[#B89858] text-white font-semibold rounded-xl transition cursor-pointer flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Profile
                  </button>
                ) : null}
              </div>

              {/* Profile Form */}
              {!editing ? (
                <div className="space-y-6 mt-4">
                  {/* Name */}
                  <div>
                    <label className="text-sm font-medium text-gray-400">
                      Name
                    </label>
                    <p className="text-xl font-semibold text-white mt-1">
                      {user?.name}
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-sm font-medium text-gray-400">
                      Email
                    </label>
                    <p className="text-xl font-semibold text-white mt-1">
                      {user?.email}
                    </p>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="text-sm font-medium text-gray-400">
                      Role
                    </label>
                    <div className="mt-2">
                      <span className="inline-block px-4 py-2 bg-[#C9A86A] text-white font-bold uppercase rounded-lg">
                        {user?.role}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl focus:border-[#C9A86A] outline-none text-white"
                      required
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl focus:border-[#C9A86A] outline-none text-white"
                      required
                    />
                  </div>

                  {/* Photo URL */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Photo URL
                    </label>
                    <input
                      type="url"
                      value={formData.photoURL}
                      onChange={(e) =>
                        setFormData({ ...formData, photoURL: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl focus:border-[#C9A86A] outline-none text-white"
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-[#C9A86A] hover:bg-[#B89858] text-white font-semibold rounded-xl transition cursor-pointer disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </PageWrapper>

      {/* Photo Upload Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              Upload Profile Photo
            </h2>

            {/* File Input */}
            <div className="mb-6">
              <label
                htmlFor="photo-upload"
                className="block w-full cursor-pointer"
              >
                <div className="border-2 border-dashed border-white/30 rounded-xl p-8 text-center hover:border-[#C9A86A] transition-colors">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-[#C9A86A]"
                    />
                  ) : (
                    <div className="space-y-3">
                      <svg
                        className="w-16 h-16 mx-auto text-white/50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <p className="text-white font-medium">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-white/60 text-sm">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handlePhotoUpload}
                disabled={!photoFile}
                className="flex-1 px-6 py-3 bg-[#C9A86A] hover:bg-[#B89858] text-white font-semibold rounded-xl transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Select Photo
              </button>
              <button
                onClick={() => {
                  setShowPhotoModal(false)
                  setPhotoFile(null)
                  setPhotoPreview("")
                }}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedLayout>
  )
}
