"use client"

import PageWrapper from "@/components/PageWrapper"
import ProtectedLayout from "@/components/ProtectedLayout"
import axios from "axios"
import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export default function TutorialsPage() {
  const [tutorials, setTutorials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTutorials()
  }, [])

  const fetchTutorials = async () => {
    try {
      const response = await axios.get(`${API_URL}/tutorials`)
      setTutorials(response.data.tutorials || [])
    } catch (error: any) {
      toast.error("Failed to load tutorials")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    if (!url) return ""

    // If it's already just an ID (11 characters, alphanumeric with dash/underscore)
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
      return url
    }

    // Extract from youtube.com URLs
    const youtubeMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    )
    if (youtubeMatch) {
      return youtubeMatch[1]
    }

    // Extract from embed URLs
    const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/)
    if (embedMatch) {
      return embedMatch[1]
    }

    return url // Return as-is if no pattern matches
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
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#1F242E", color: "#FAF7F0" },
          error: { iconTheme: { primary: "#ef4444", secondary: "#FAF7F0" } },
        }}
      />
      <PageWrapper className="-mt-16 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Reading Tutorials
            </h1>
            <p className="text-white/70 text-lg">
              Learn tips and tricks to enhance your reading experience
            </p>
          </div>

          {/* Tutorial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((tutorial) => (
              <div
                key={tutorial._id}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 hover:border-[#C9A86A]/50 hover:shadow-2xl hover:shadow-[#C9A86A]/20 transition-all group"
              >
                {/* Video Embed */}
                <div className="relative aspect-video bg-black/30">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(
                      tutorial.videoUrl
                    )}`}
                    title={tutorial.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#C9A86A] transition">
                    {tutorial.title}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {tutorial.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State (if no tutorials) */}
          {tutorials.length === 0 && (
            <div className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-white/30"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                No tutorials available
              </h2>
              <p className="text-white/60">
                Check back later for reading tips and tutorials!
              </p>
            </div>
          )}
        </div>
      </PageWrapper>
    </ProtectedLayout>
  )
}
