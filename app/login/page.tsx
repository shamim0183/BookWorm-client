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

  const containerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        ease: "power3.out",
      })

      gsap.from(formRef.current?.children || [], {
        opacity: 0,
        x: -20,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.4,
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
      toast.success("Login successful!")

      setTimeout(() => {
        router.push(response.data.user.role === "admin" ? "/admin" : "/library")
      }, 1000)
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen relative flex items-center justify-center py-12 px-4"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1920&q=80")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1F242E]/95 via-[#084935]/90 to-[#1F242E]/95 backdrop-blur-sm"></div>

      <Toaster position="top-right" />

      <div ref={containerRef} className="max-w-md w-full relative z-10">
        {/* Logo/Title Animation */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-heading font-bold text-white mb-2">
            📚
          </h1>
          <h2 className="text-4xl font-heading font-bold text-white">
            Welcome Back
          </h2>
          <p className="text-gray-300 mt-2">
            Sign in to continue your reading journey
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-white/20">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084935] focus:border-transparent outline-none transition"
                placeholder="your@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#084935] focus:border-transparent outline-none transition"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#084935] to-[#2C5F4F] text-white py-3.5 rounded-full font-medium text-lg hover:shadow-xl transform hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-[#084935] font-semibold hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>

        {/* Decorative Element */}
        <div className="mt-8 text-center">
          <p className="text-gray-300 text-sm">
            "A reader lives a thousand lives before he dies"
          </p>
          <p className="text-gray-400 text-xs mt-1">- George R.R. Martin</p>
        </div>
      </div>
    </div>
  )
}
