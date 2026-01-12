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

  const formRef = useRef<HTMLDivElement>(null)

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
    <div className="min-h-screen" style={{ backgroundColor: "#FAF7F0" }}>
      <Toaster position="top-right" />

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left: Decorative Bookshelf */}
          <div className="hidden lg:block">
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80"
                alt="Library"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F242E]/90 via-[#1F242E]/50 to-transparent flex items-end p-12">
                <div>
                  <h2 className="text-4xl font-heading font-bold text-white mb-4">
                    Welcome Back, Reader
                  </h2>
                  <p className="text-gray-200 text-lg">
                    Continue your literary adventure where you left off.
                  </p>
                  <p className="text-gray-300 text-sm mt-4 italic">
                    "A reader lives a thousand lives before he dies."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div ref={formRef}>
            <div className="text-center lg:text-left mb-8">
              <div className="text-6xl mb-4">📚</div>
              <h1
                className="text-5xl font-heading font-bold mb-3"
                style={{ color: "#1F242E" }}
              >
                Welcome Back
              </h1>
              <p className="text-lg" style={{ color: "#85817B" }}>
                Sign in to continue your reading journey
              </p>
            </div>

            <div
              className="bg-white rounded-2xl shadow-lg p-8 border"
              style={{ borderColor: "#E8E3D6" }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#1F242E" }}
                  >
                    Email Address
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
                      placeholder="Enter your password"
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
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-lg font-medium text-white transition hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "#084935" }}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <p
                className="mt-6 text-center text-sm"
                style={{ color: "#85817B" }}
              >
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="font-semibold hover:underline"
                  style={{ color: "#084935" }}
                >
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
