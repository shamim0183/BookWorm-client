"use client"

import PageWrapper from "@/components/PageWrapper"
import ProtectedLayout from "@/components/ProtectedLayout"
import { useEffect, useState } from "react"

export default function TutorialsPage() {
  const [tutorials, setTutorials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Load from API when backend is ready
    // For now, use placeholder data
    const placeholderTutorials = [
      {
        _id: "1",
        title: "How to Build a Reading Habit",
        videoId: "dQw4w9WgXcQ", // Replace with real YouTube video IDs
        description:
          "Learn effective strategies to build and maintain a consistent reading habit.",
      },
      {
        _id: "2",
        title: "Speed Reading Techniques",
        videoId: "dQw4w9WgXcQ",
        description:
          "Discover how to read faster while maintaining comprehension.",
      },
      {
        _id: "3",
        title: "Book Review Writing Tips",
        videoId: "dQw4w9WgXcQ",
        description: "Learn how to write engaging and helpful book reviews.",
      },
      {
        _id: "4",
        title: "Finding Your Next Great Read",
        videoId: "dQw4w9WgXcQ",
        description: "Tips for discovering books you'll love.",
      },
      {
        _id: "5",
        title: "Note-Taking for Readers",
        videoId: "dQw4w9WgXcQ",
        description: "Effective methods for taking notes while reading.",
      },
      {
        _id: "6",
        title: "Classic Literature Guide",
        videoId: "dQw4w9WgXcQ",
        description: "Getting started with classic literature.",
      },
      {
        _id: "7",
        title: "Building a Home Library",
        videoId: "dQw4w9WgXcQ",
        description: "Tips for organizing and curating your book collection.",
      },
      {
        _id: "8",
        title: "Reading Multiple Books at Once",
        videoId: "dQw4w9WgXcQ",
        description: "Strategies for juggling multiple books effectively.",
      },
      {
        _id: "9",
        title: "Genre Exploration Guide",
        videoId: "dQw4w9WgXcQ",
        description: "Discover new genres and expand your reading horizons.",
      },
      {
        _id: "10",
        title: "Book Club Best Practices",
        videoId: "dQw4w9WgXcQ",
        description: "How to run a successful book club.",
      },
    ]
    setTutorials(placeholderTutorials)
    setLoading(false)
  }, [])

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
                    src={`https://www.youtube.com/embed/${tutorial.videoId}`}
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
