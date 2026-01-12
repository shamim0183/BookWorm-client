export default function LoadingSpinner({
  fullScreen = false,
  size = "md",
}: {
  fullScreen?: boolean
  size?: "sm" | "md" | "lg"
}) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  const spinner = (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} border-4 border-[#C9A86A]/30 border-t-[#C9A86A] rounded-full animate-spin`}
      ></div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1F242E] via-[#2C5F4F] to-[#1F242E] flex items-center justify-center">
        <div className="text-center">
          {spinner}
          <p className="mt-4 text-white/80 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return spinner
}
