import FloatingBooks from "@/components/FloatingBooks"
import Link from "next/link"

// This is a Server Component - runs on the server for SSR
async function getPopularBooks() {
  try {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    const res = await fetch(`${API_URL}/books?page=1&limit=12`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!res.ok) return []
    const data = await res.json()
    return data.books || []
  } catch (error) {
    console.error("Failed to fetch books:", error)
    return []
  }
}

export default async function LandingPage() {
  const popularBooks = await getPopularBooks()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1F242E] via-[#2C5F4F] to-[#1F242E] relative">
      {/* Floating Books Background */}
      <FloatingBooks />
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#1F242E]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:opacity-80 transition"
            >
              <div className="w-8 h-8 sm:w-10 md:w-12 sm:h-10 md:h-12">
                <img
                  src="/BookWorm.png"
                  alt="BookWorm Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                BookWorm
              </span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/login"
                className="px-3 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 backdrop-blur-sm border border-white/20 text-white text-sm sm:text-base font-semibold rounded-xl transition shadow-lg hover:shadow-white/10"
              >
                <span className="hidden sm:inline">Sign In</span>
                <span className="sm:hidden">Login</span>
              </Link>
              <Link
                href="/register"
                className="px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-[#C9A86A] to-[#B89858] hover:from-[#B89858] hover:to-[#A88747] text-white text-sm sm:text-base font-semibold rounded-xl transition shadow-lg hover:shadow-[#C9A86A]/50 hover:-translate-y-0.5"
              >
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Join</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight px-4">
            Your Personal
            <br />
            <span className="bg-gradient-to-r from-[#C9A86A] to-[#B89858] bg-clip-text text-transparent">
              Reading Journey
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            Track your reading progress, discover personalized recommendations,
            and connect with fellow book lovers in our vibrant community.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#C9A86A] hover:bg-[#B89858] text-white font-semibold rounded-xl transition text-base sm:text-lg shadow-2xl hover:shadow-[#C9A86A]/30 hover:-translate-y-1 text-center"
            >
              Start Reading Free →
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition text-base sm:text-lg backdrop-blur-sm border border-white/20 text-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition">
              <div className="w-12 h-12 bg-[#C9A86A]/20 rounded-xl flex items-center justify-center mb-4">
                <span className="text-3xl">📖</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Track Your Reading
              </h3>
              <p className="text-white/70">
                Organize books into shelves, track your progress, and set annual
                reading goals.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition">
              <div className="w-12 h-12 bg-[#C9A86A]/20 rounded-xl flex items-center justify-center mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Smart Recommendations
              </h3>
              <p className="text-white/70">
                Get personalized book suggestions based on your reading history
                and preferences.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition">
              <div className="w-12 h-12 bg-[#C9A86A]/20 rounded-xl flex items-center justify-center mb-4">
                <span className="text-3xl">⭐</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Rate & Review
              </h3>
              <p className="text-white/70">
                Share your thoughts, rate books, and discover what others are
                reading.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Books */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Popular on BookWorm
            </h2>
            <p className="text-white/70 text-lg">
              Join thousands of readers exploring these trending books
            </p>
          </div>

          {popularBooks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {popularBooks.map((book: any) => (
                <div key={book._id} className="group cursor-pointer">
                  <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 hover:border-[#C9A86A]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#C9A86A]/20 hover:-translate-y-2">
                    <div className="aspect-[3/4] relative">
                      {book.coverImage || book.coverId ? (
                        <img
                          src={
                            book.coverImage ||
                            `https://covers.openlibrary.org/b/id/${book.coverId}-L.jpg`
                          }
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                          <span className="text-4xl">📚</span>
                        </div>
                      )}

                      {/* Rating Badge */}
                      {(book.ratings?.average || 0) > 0 && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm border border-white/20 rounded-lg flex items-center gap-1">
                          <span className="text-yellow-400 text-xs">★</span>
                          <span className="text-white text-xs font-bold">
                            {book.ratings.average.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-white text-sm font-semibold mt-3 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-white/60 text-xs line-clamp-1">
                    {book.author}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-white/60">Loading books...</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/register"
              className="inline-block px-8 py-4 bg-[#C9A86A] hover:bg-[#B89858] text-white font-semibold rounded-xl transition shadow-2xl hover:shadow-[#C9A86A]/30 hover:-translate-y-1"
            >
              Sign Up to Explore More →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#C9A86A]/20 to-[#B89858]/20 backdrop-blur-xl border border-[#C9A86A]/30 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Your Reading Journey?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Join our community and discover your next favorite book today.
          </p>
          <Link
            href="/register"
            className="inline-block px-10 py-4 bg-white text-[#1F242E] hover:bg-white/90 font-bold rounded-xl transition text-lg shadow-2xl hover:-translate-y-1"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/60">
            © {new Date().getFullYear()} BookWorm. Your Personal Reading
            Companion.
          </p>
        </div>
      </footer>
    </div>
  )
}
