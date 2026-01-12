"use client"

import axios from "axios"
import gsap from "gsap"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast, { Toaster } from "react-hot-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export default function LoginPage() {
  const router = useRouter()
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
      localStorage.setItem("token", response.data.token)
      toast.success("Welcome back!")
      setTimeout(() => {
        router.push(
          response.data.user.role === "admin" ? "/admin/genres" : "/library"
        )
      }, 1000)
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#1F242E", color: "#FAF7F0" },
          success: { iconTheme: { primary: "#2C5F4F", secondary: "#FAF7F0" } },
        }}
      />

      {/* Left Panel - Illustration & Branding */}
      <div
        ref={leftPanelRef}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1F242E] via-[#2C5F4F] to-[#1F242E] p-12 flex-col justify-between relative overflow-hidden"
      >
        {/* Floating Book Covers */}
        <div className="absolute inset-0 overflow-hidden opacity-50">
          <img
            src="https://covers.openlibrary.org/b/id/8235886-L.jpg"
            alt=""
            className="absolute top-20 left-20 w-32 h-48 rounded-lg shadow-2xl transform rotate-12 animate-float object-cover"
          />
          <img
            src="https://covers.openlibrary.org/b/id/12583098-L.jpg"
            alt=""
            className="absolute top-60 right-32 w-24 h-36 rounded-lg shadow-2xl animate-float-delayed object-cover"
          />
          <img
            src="https://covers.openlibrary.org/b/id/10387084-L.jpg"
            alt=""
            className="absolute bottom-40 left-40 w-36 h-52 rounded-lg shadow-2xl transform -rotate-6 animate-float object-cover"
          />
          <img
            src="https://covers.openlibrary.org/b/id/8225261-L.jpg"
            alt=""
            className="absolute bottom-20 right-20 w-20 h-32 rounded-lg shadow-2xl animate-float-delayed object-cover"
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
              Your Personal Library, Reimagined
            </h2>
            <p className="text-lg text-gray-300">
              Track your reading journey, discover new favorites, and connect
              with a community of book lovers.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-[#C9A86A] mb-1">
                  10K+
                </div>
                <div className="text-sm text-gray-300">Active Readers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-[#C9A86A] mb-1">
                  50K+
                </div>
                <div className="text-sm text-gray-300">Books Tracked</div>
              </div>
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
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-[#FAF7F0]/80 backdrop-blur-md">
        <div className="w-full max-w-md" ref={formRef}>
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2C5F4F] to-[#3A7868] rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            </div>
            <span className="text-xl font-heading font-bold text-[#1F242E]">
              BookWorm
            </span>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-heading font-bold text-[#1F242E] mb-3">
              Welcome Back
            </h1>
            <p className="text-[#85817B] text-lg">
              Continue your reading adventure
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="group cursor-text">
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

            {/* Password Field */}
            <div className="group cursor-text">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-[#1F242E] group-focus-within:text-[#2C5F4F] transition">
                  Password
                </label>
                <button
                  type="button"
                  className="text-sm text-[#2C5F4F] hover:text-[#3A7868] font-medium transition cursor-pointer"
                >
                  Forgot?
                </button>
              </div>
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#85817B] hover:text-[#2C5F4F] transition cursor-pointer"
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#2C5F4F] to-[#3A7868] text-white py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-[#2C5F4F]/20 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-8 cursor-pointer"
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
                <div className="w-full border-t border-[#E8E3D6]"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-sm text-[#85817B] bg-white">or</span>
              </div>
            </div>

            {/* Social Login */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white border-2 border-[#E8E3D6] rounded-2xl hover:border-[#2C5F4F] hover:bg-[#FAF7F0] transition-all duration-300 group cursor-pointer"
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
          <p className="mt-8 text-center text-[#85817B]">
            New to BookWorm?{" "}
            <a
              href="/register"
              className="text-[#2C5F4F] font-semibold hover:text-[#3A7868] transition"
            >
              Create an account
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
