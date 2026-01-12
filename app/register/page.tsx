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

  // GSAP Animation
  useEffect(() => {
    if (formRef.current) {
      gsap.from(formRef.current.children, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
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
    <div className="min-h-screen bg-cream">
      <Toaster position="top-right" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-md mx-auto" ref={formRef}>
          <div className="text-center mb-8">
            <h1 className="text-5xl font-heading font-bold text-charcoal-dark mb-2">
              Join BookWorm
            </h1>
            <p className="text-charcoal">Create your account to get started</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Photo Upload */}
              <div className="flex flex-col items-center pb-6 border-b border-gray-100">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-cream-dark mb-4 border-4 border-forest">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-charcoal">
                      <svg
                        className="w-12 h-12"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  )}
                </div>
                <label className="cursor-pointer px-6 py-2.5 bg-forest text-white rounded-full hover:bg-forest-light transition-all transform hover:-translate-y-0.5 font-medium text-sm shadow-md">
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
                <label className="block text-sm font-medium text-charcoal-dark mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent outline-none transition"
                  placeholder="Enter your name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-charcoal-dark mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent outline-none transition"
                  placeholder="your@email.com"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-charcoal-dark mb-2">
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
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent outline-none transition"
                    placeholder="Min 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal hover:text-charcoal-dark transition"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-3 space-y-1.5 text-xs bg-gray-50 p-3 rounded-lg">
                    {Object.entries({
                      "At least 6 characters": passwordChecks.minLength,
                      "One uppercase letter": passwordChecks.hasUpperCase,
                      "One lowercase letter": passwordChecks.hasLowerCase,
                      "One number": passwordChecks.hasNumber,
                    }).map(([text, passed]) => (
                      <p
                        key={text}
                        className={
                          passed
                            ? "text-green-600 font-medium"
                            : "text-gray-400"
                        }
                      >
                        {passed ? "✓" : "○"} {text}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-charcoal-dark mb-2">
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
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent outline-none transition"
                    placeholder="Re-enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal hover:text-charcoal-dark transition"
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <p
                    className={`mt-2 text-xs font-medium ${
                      formData.password === formData.confirmPassword
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formData.password === formData.confirmPassword
                      ? "✓ Passwords match"
                      : "✗ Passwords do not match"}{" "}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-forest text-white py-3.5 rounded-full font-medium text-base hover:bg-forest-light transform hover:-translate-y-0.5 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-charcoal">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Gmail Login */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
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
                <span className="font-medium text-charcoal-dark">
                  Sign up with Google
                </span>
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-charcoal">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-forest font-semibold hover:underline"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
