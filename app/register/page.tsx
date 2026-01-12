"use client"

import axios from "axios"
import gsap from "gsap"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast, { Toaster } from "react-hot-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const formRef = useRef<HTMLDivElement>(null)

  // Subtle GSAP animation
  useEffect(() => {
    if (formRef.current) {
      gsap.from(formRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
      })
    }
  }, [])

  const passwordChecks = {
    minLength: formData.password.length >= 6,
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasLowerCase: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
  }

  const allChecksPassed = Object.values(passwordChecks).every(Boolean)

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
    if (!photoFile) return ""
    const formData = new FormData()
    formData.append("image", photoFile)
    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
        formData
      )
      return response.data.data.url
    } catch (error) {
      toast.error("Image upload failed")
      return ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!allChecksPassed) {
      toast.error("Please meet all password requirements")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    setLoading(true)
    try {
      const photoURL = await uploadToImgBB()
      const response = await axios.post(`${API_URL}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        photoURL,
      })
      localStorage.setItem("token", response.data.token)
      toast.success("Registration successful!")
      setTimeout(() => {
        router.push(response.data.user.role === "admin" ? "/admin" : "/library")
      }, 1000)
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF7F0" }}>
      <Toaster position="top-right" />

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left: Decorative Bookshelf */}
          <div className="hidden lg:block">
            <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80"
                alt="Library"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F242E]/90 via-[#1F242E]/50 to-transparent flex items-end p-12">
                <div>
                  <h2 className="text-4xl font-heading font-bold text-white mb-4">
                    Start Your Reading Journey
                  </h2>
                  <p className="text-gray-200 text-lg">
                    Track your books, discover new favorites, and connect with
                    fellow readers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div ref={formRef}>
            <div className="text-center lg:text-left mb-8">
              <h1
                className="text-5xl font-heading font-bold mb-3"
                style={{ color: "#1F242E" }}
              >
                Join BookWorm
              </h1>
              <p className="text-lg" style={{ color: "#85817B" }}>
                Create your account to get started
              </p>
            </div>

            <div
              className="bg-white rounded-2xl shadow-lg p-8 border"
              style={{ borderColor: "#E8E3D6" }}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Photo Upload - Minimal */}
                <div
                  className="flex items-center gap-4 pb-5 border-b"
                  style={{ borderColor: "#F5F2EB" }}
                >
                  <div
                    className="w-16 h-16 rounded-full overflow-hidden"
                    style={{ backgroundColor: "#F5F2EB" }}
                  >
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ color: "#85817B" }}
                      >
                        <svg
                          className="w-8 h-8"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <label
                    className="cursor-pointer px-5 py-2 rounded-lg text-sm font-medium transition hover:opacity-80"
                    style={{ backgroundColor: "#084935", color: "white" }}
                  >
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Name */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#1F242E" }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border outline-none focus:ring-2 transition"
                    style={{ borderColor: "#E0DDD8", backgroundColor: "white" }}
                    placeholder="Enter your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#1F242E" }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border outline-none focus:ring-2 transition"
                    style={{ borderColor: "#E0DDD8" }}
                    placeholder="your@email.com"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#1F242E" }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full px-4 py-3 pr-12 rounded-lg border outline-none focus:ring-2 transition"
                      style={{ borderColor: "#E0DDD8" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      style={{ color: "#85817B" }}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="mt-3 text-xs space-y-1">
                      {Object.entries({
                        "At least 6 characters": passwordChecks.minLength,
                        "One uppercase letter": passwordChecks.hasUpperCase,
                        "One lowercase letter": passwordChecks.hasLowerCase,
                        "One number": passwordChecks.hasNumber,
                      }).map(([text, passed]) => (
                        <p
                          key={text}
                          style={{ color: passed ? "#10b981" : "#9ca3af" }}
                        >
                          {passed ? "✓" : "○"} {text}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#1F242E" }}
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 pr-12 rounded-lg border outline-none focus:ring-2 transition"
                      style={{ borderColor: "#E0DDD8" }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      style={{ color: "#85817B" }}
                    >
                      {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-lg font-medium text-white transition hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "#084935" }}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <p
                className="mt-6 text-center text-sm"
                style={{ color: "#85817B" }}
              >
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-semibold hover:underline"
                  style={{ color: "#084935" }}
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
