"use client"

import { useEffect } from "react"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type?: "success" | "info" | "warning"
}

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  type = "success",
}: SuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      // Auto-close after 2.5 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 2500)
      return () => {
        document.body.style.overflow = "unset"
        clearTimeout(timer)
      }
    } else {
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const colors = {
    success: {
      bg: "bg-green-500/20",
      border: "border-green-500/50",
      icon: "✅",
      iconBg: "bg-green-500/20",
    },
    info: {
      bg: "bg-blue-500/20",
      border: "border-blue-500/50",
      icon: "ℹ️",
      iconBg: "bg-blue-500/20",
    },
    warning: {
      bg: "bg-yellow-500/20",
      border: "border-yellow-500/50",
      icon: "⚠️",
      iconBg: "bg-yellow-500/20",
    },
  }

  const currentColors = colors[type]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#1F242E]/95 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Icon */}
        <div
          className={`w-20 h-20 mx-auto mb-4 ${currentColors.iconBg} ${currentColors.border} border-2 rounded-2xl flex items-center justify-center text-4xl`}
        >
          {currentColors.icon}
        </div>

        {/* Title */}
        <h3 className="text-3xl font-bold text-white text-center mb-3">
          {title}
        </h3>

        {/* Message */}
        <p className="text-white/80 text-center text-lg mb-6">{message}</p>

        {/* Auto-close indicator */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold rounded-xl transition-all cursor-pointer"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  )
}
