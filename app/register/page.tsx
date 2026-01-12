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

  const leftPanelRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(leftPanelRef.current, {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })

      gsap.from(formRef.current?.children || [], {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.3,
      })
    })

    return () => ctx.revert()
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
      toast.success("Account created successfully!")
      setTimeout(() => {
        router.push(
          response.data.user.role === "admin" ? "/admin/genres" : "/library"
        )
      }, 1000)
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-row-reverse">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#1F242E", color: "#FAF7F0" },
          success: { iconTheme: { primary: "#2C5F4F", secondary: "#FAF7F0" } },
        }}
      />

      {/* Right Panel - Illustration & Benefits */}
      <div
        ref={leftPanelRef}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2C5F4F] via-[#3A7868] to-[#2C5F4F] p-12 flex-col justify-between relative overflow-hidden"
      >
        {/* Floating Book Covers */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <img
            src="https://covers.openlibrary.org/b/id/7884916-M.jpg"
            alt=""
            className="absolute top-32 right-20 w-28 h-40 rounded-lg shadow-2xl animate-float object-cover"
          />
          <img
            src="https://covers.openlibrary.org/b/id/10677563-M.jpg"
            alt=""
            className="absolute top-60 left-32 w-32 h-48 rounded-lg shadow-2xl transform rotate-45 animate-float-delayed object-cover"
          />
          <img
            src="https://covers.openlibrary.org/b/id/8231346-M.jpg"
            alt=""
            className="absolute bottom-40 right-40 w-36 h-52 rounded-lg shadow-2xl animate-float object-cover"
          />
          <img
            src="https://covers.openlibrary.org/b/id/12677815-M.jpg"
            alt=""
            className="absolute bottom-24 left-24 w-24 h-36 rounded-lg shadow-2xl transform -rotate-12 animate-float-delayed object-cover"
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-[#C9A86A] rounded-xl flex items-center justify-center">
              <svg
                className="w-7 h-7 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            </div>
            <span className="text-2xl font-heading font-bold text-white">
              BookWorm
            </span>
          </div>

          <div className="space-y-6 max-w-md">
            <h2 className="text-4xl font-heading font-bold text-white leading-tight">
              Start Your Reading Journey Today
            </h2>
            <p className="text-lg text-gray-200">
              Join thousands of readers who are transforming the way they
              discover and track books.
            </p>

            <div className="space-y-4 pt-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-[#C9A86A]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    Track Your Progress
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Monitor your reading journey with detailed statistics and
                    insights
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-[#C9A86A]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    Personalized Recommendations
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Discover books tailored to your reading preferences
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-[#C9A86A]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    Join the Community
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Connect with fellow book lovers and share reviews
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-center">
          <p className="text-white/60 text-sm">
            Trusted by 10,000+ readers worldwide
          </p>
        </div>
      </div>

      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md" ref={formRef}>
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2C5F4F] to-[#3A7868] rounded-lg flex items-center justify-center text-xl">
              📚
            </div>
            <span className="text-xl font-heading font-bold text-[#1F242E]">
              BookWorm
            </span>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-heading font-bold text-[#1F242E] mb-3">
              Create Account
            </h1>
            <p className="text-[#85817B] text-lg">
              Begin your literary adventure
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Photo Upload */}
            <div className="flex justify-center mb-6">
              <div className="relative group cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#2C5F4F] to-[#3A7868] flex items-center justify-center border-4 border-white shadow-xl group-hover:shadow-2xl transition-shadow">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-white text-center">
                        <svg
                          className="w-10 h-10 mx-auto mb-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <span className="text-xs">Photo</span>
                      </div>
                    )}
                  </div>
                </label>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#C9A86A] rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    className="w-4 h-4 text-white"
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
              </div>
            </div>

            {/* Name */}
            <div className="group">
              <label className="block text-sm font-semibold text-[#1F242E] mb-2 group-focus-within:text-[#2C5F4F] transition">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#85817B] group-focus-within:text-[#2C5F4F] transition">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-4 bg-[#FAF7F0] border-2 border-[#E8E3D6] rounded-2xl focus:border-[#2C5F4F] focus:bg-white outline-none transition-all text-[#1F242E]"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div className="group">
              <label className="block text-sm font-semibold text-[#1F242E] mb-2 group-focus-within:text-[#2C5F4F] transition">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#85817B] group-focus-within:text-[#2C5F4F] transition">
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-4 bg-[#FAF7F0] border-2 border-[#E8E3D6] rounded-2xl focus:border-[#2C5F4F] focus:bg-white outline-none transition-all text-[#1F242E]"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <label className="block text-sm font-semibold text-[#1F242E] mb-2 group-focus-within:text-[#2C5F4F] transition">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#85817B] group-focus-within:text-[#2C5F4F] transition">
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-12 pr-12 py-4 bg-[#FAF7F0] border-2 border-[#E8E3D6] rounded-2xl focus:border-[#2C5F4F] focus:bg-white outline-none transition-all text-[#1F242E]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#85817B] hover:text-[#2C5F4F] transition"
                >
                  {showPassword ? (
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
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
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {formData.password && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries({
                    "6+ chars": passwordChecks.minLength,
                    Uppercase: passwordChecks.hasUpperCase,
                    Lowercase: passwordChecks.hasLowerCase,
                    Number: passwordChecks.hasNumber,
                  }).map(([text, passed]) => (
                    <span
                      key={text}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                        passed
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {passed ? "✓" : "○"} {text}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="group">
              <label className="block text-sm font-semibold text-[#1F242E] mb-2 group-focus-within:text-[#2C5F4F] transition">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#85817B] group-focus-within:text-[#2C5F4F] transition">
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
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
                  className="w-full pl-12 pr-12 py-4 bg-[#FAF7F0] border-2 border-[#E8E3D6] rounded-2xl focus:border-[#2C5F4F] focus:bg-white outline-none transition-all text-[#1F242E]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#85817B] hover:text-[#2C5F4F] transition"
                >
                  {showConfirmPassword ? (
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
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
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.25 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {formData.confirmPassword && (
                <p
                  className={`mt-2 text-xs font-medium flex items-center gap-1.5 ${
                    formData.password === formData.confirmPassword
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formData.password === formData.confirmPassword
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#2C5F4F] to-[#3A7868] text-white py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-[#2C5F4F]/20 transformhover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating your account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E8E3D6]"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-sm text-[#85817B] bg-white">or</span>
              </div>
            </div>

            {/* Social Login */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white border-2 border-[#E8E3D6] rounded-2xl hover:border-[#2C5F4F] hover:bg-[#FAF7F0] transition-all duration-300 group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-semibold text-[#1F242E] group-hover:text-[#2C5F4F] transition">
                Continue with Google
              </span>
            </button>
          </form>

          {/* Sign In Link */}
          <p className="mt-8 text-center text-[#85817B]">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#2C5F4F] font-semibold hover:text-[#3A7868] transition"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(-5deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
