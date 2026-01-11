export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-6xl font-heading font-bold text-charcoal-dark mb-4">
          📚 BookWorm
        </h1>
        <p className="text-xl text-charcoal mb-8">
          Your Personal Reading Tracker & Book Discovery App
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="px-8 py-3 bg-forest text-white rounded-lg hover:bg-opacity-90 transition font-medium"
          >
            Login
          </a>
          <a
            href="/register"
            className="px-8 py-3 bg-teal text-white rounded-lg hover:bg-opacity-90 transition font-medium"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  )
}
