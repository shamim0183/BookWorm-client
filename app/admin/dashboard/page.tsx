import ProtectedLayout from "@/components/ProtectedLayout"

export default function AdminDashboard() {
  return (
    <ProtectedLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-[#C9A86A]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-[#C9A86A]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Admin Dashboard
          </h1>
          <p className="text-white/60 text-lg mb-8">
            Overview stats and management - Coming in Phase 6!
          </p>
          <div className="inline-block px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
            <p className="text-white/80 text-sm">
              This page will feature total books, users, pending reviews, and
              charts
            </p>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
