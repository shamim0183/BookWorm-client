"use client"

import { useAuth } from "@/lib/AuthContext"
import { signInWithGoogle } from "@/lib/auth"
import axios from "axios"
import gsap from "gsap"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export default function LoginPage() {
  const router = useRouter()
  const { login: authLogin } = useAuth()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
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
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.3,
      })
    })

    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData)
      const token = response.data.token
      const user = response.data.user

      // Store token and user data in localStorage
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      // Also store token in cookie for middleware (7 days expiry)
      document.cookie = `token=${token}; path=/; max-age=${
        7 * 24 * 60 * 60
      }; SameSite=Strict`

      // Show success message
      toast.success("Login successful! Redirecting...")

      // Redirect based on role - AuthContext will pick up the changes
      window.location.href =
        user.role === "admin" ? "/admin/dashboard" : "/library"
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Invalid credentials")
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      const { user, idToken } = await signInWithGoogle()

      // Sync with backend
      const response = await axios.post(`${API_URL}/auth/firebase`, {
        firebaseToken: idToken,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
      })

      const token = response.data.token
      const userData = response.data.user

      // Store token and user data in localStorage
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(userData))

      // Also store token in cookie for middleware (7 days expiry)
      document.cookie = `token=${token}; path=/; max-age=${
        7 * 24 * 60 * 60
      }; SameSite=Strict`

      // Show success message
      toast.success("Login successful! Redirecting...")

      // Redirect based on role - AuthContext will pick up the changes
      window.location.href =
        userData.role === "admin" ? "/admin/dashboard" : "/library"
    } catch (error: any) {
      toast.error(error.message || "Google sign-in failed")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1F242E] via-[#2C5F4F] to-[#1F242E] flex relative overflow-hidden">
      {/* Floating Book Covers - Behind Both Panels */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        {/* Large Books */}
        <img
          src="https://covers.openlibrary.org/b/id/8235886-L.jpg"
          alt=""
          className="absolute top-20 left-20 w-40 h-56 rounded-lg shadow-2xl transform rotate-12 animate-float object-cover"
        />
        <img
          src="https://covers.openlibrary.org/b/id/10387084-L.jpg"
          alt=""
          className="absolute bottom-40 left-40 w-44 h-60 rounded-lg shadow-2xl transform -rotate-6 animate-float object-cover"
        />
        <img
          src="https://covers.openlibrary.org/b/id/12549326-L.jpg"
          alt=""
          className="absolute top-40 right-16 w-40 h-56 rounded-lg shadow-2xl transform rotate-[-15deg] animate-float-delayed object-cover"
        />

        {/* Medium Books */}
        <img
          src="https://covers.openlibrary.org/b/id/12583098-L.jpg"
          alt=""
          className="absolute top-60 right-32 w-32 h-44 rounded-lg shadow-2xl animate-float-delayed object-cover transform rotate-3"
        />
        <img
          src="https://covers.openlibrary.org/b/id/10677563-L.jpg"
          alt=""
          className="absolute bottom-1/3 left-1/4 w-32 h-48 rounded-lg shadow-2xl transform -rotate-12 animate-float-delayed object-cover"
        />
        <img
          src="https://covers.openlibrary.org/b/id/7884916-L.jpg"
          alt=""
          className="absolute top-1/3 right-1/4 w-28 h-40 rounded-lg shadow-2xl animate-float object-cover transform rotate-6"
        />
        <img
          src="https://covers.openlibrary.org/b/id/8465165-L.jpg"
          alt=""
          className="absolute bottom-32 right-1/3 w-32 h-46 rounded-lg shadow-2xl transform rotate-8 animate-float object-cover"
        />
        <img
          src="https://covers.openlibrary.org/b/id/10521270-L.jpg"
          alt=""
          className="absolute top-1/2 left-16 w-30 h-42 rounded-lg shadow-2xl transform -rotate-8 animate-float-delayed object-cover"
        />

        {/* Small Books */}
        <img
          src="https://covers.openlibrary.org/b/id/8225261-L.jpg"
          alt=""
          className="absolute bottom-20 right-20 w-20 h-32 rounded-lg shadow-2xl animate-float-delayed object-cover transform rotate-[-5deg]"
        />
        <img
          src="https://covers.openlibrary.org/b/id/8231357-L.jpg"
          alt=""
          className="absolute top-1/4 left-1/3 w-24 h-34 rounded-lg shadow-2xl animate-float object-cover transform rotate-12"
        />
        <img
          src="https://covers.openlibrary.org/b/id/7659574-L.jpg"
          alt=""
          className="absolute bottom-1/4 right-1/4 w-22 h-32 rounded-lg shadow-2xl animate-float-delayed object-cover transform -rotate-10"
        />
        <img
          src="https://covers.openlibrary.org/b/id/8418735-L.jpg"
          alt=""
          className="absolute top-3/4 left-1/2 w-20 h-30 rounded-lg shadow-2xl animate-float object-cover transform rotate-15"
        />

        {/* Center Feature Book */}
        <img
          src="https://covers.openlibrary.org/b/id/12919193-L.jpg"
          alt=""
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 rounded-lg shadow-2xl animate-float object-cover transform rotate-[-8deg] opacity-40"
        />
      </div>

      {/* Left Panel - Illustration & Branding */}
      <div
        ref={leftPanelRef}
        className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between relative z-10"
      >
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
            Your Personal Library, Reimagined
          </h2>
          <p className="text-lg text-gray-300">
            Track your reading journey, discover new favorites, and connect with
            a community of book lovers.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="text-3xl font-bold text-[#C9A86A] mb-1">10K+</div>
              <div className="text-sm text-gray-300">Active Readers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="text-3xl font-bold text-[#C9A86A] mb-1">50K+</div>
              <div className="text-sm text-gray-300">Books Tracked</div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <blockquote className="text-white/80 italic text-lg">
            "Reading is a conversation. All books talk. But a good book listens
            as well."
          </blockquote>
          <p className="text-white/60 mt-2">— Mark Haddon</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-10 lg:p-14 relative z-10">
        <div
          className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
          ref={formRef}
        >
          {/* Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-[#C9A86A] rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            </div>
            <span className="text-xl font-heading font-bold text-white">
              BookWorm
            </span>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-4xl font-heading font-bold text-white mb-3">
              Welcome Back
            </h1>
            <p className="text-gray-200 text-lg">
              Continue your reading adventure
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="group cursor-text">
              <label className="block text-sm font-semibold text-white mb-2 group-focus-within:text-[#C9A86A] transition">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 group-focus-within:text-[#C9A86A] transition-colors">
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
                  className="w-full pl-12 pr-4 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl focus:border-[#C9A86A] focus:bg-white/30 outline-none transition-all text-white placeholder:text-white/50"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group cursor-text">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-white group-focus-within:text-[#C9A86A] transition">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 group-focus-within:text-[#C9A86A] transition z-10">
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
                  className="w-full pl-12 pr-12 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl focus:border-[#C9A86A] focus:bg-white/30 outline-none transition-all text-white placeholder:text-white/50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-[#C9A86A] transition cursor-pointer z-10"
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
              <button
                type="button"
                className="text-sm text-white/80 hover:text-[#C9A86A] font-medium transition cursor-pointer mt-2 text-right w-full"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C9A86A] hover:bg-[#B89858] text-white py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-[#C9A86A]/30 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6 cursor-pointer"
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
                  Signing you in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 py-1 bg-[#1F242E]/80 text-white/90 font-medium rounded-full border border-white/20">
                  or
                </span>
              </div>
            </div>

            {/* Social Login */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white border-2 border-[#E8E3D6] rounded-2xl hover:border-[#2C5F4F] hover:bg-[#FAF7F0] transition-all duration-300 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-white/80">
            New to BookWorm?{" "}
            <a
              href="/register"
              className="text-[#C9A86A] font-semibold hover:text-[#B89858] transition underline decoration-[#C9A86A]/50 hover:decoration-[#B89858]"
            >
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
