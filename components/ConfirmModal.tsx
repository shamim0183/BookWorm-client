"use client"

import { useEffect } from "react"

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: "danger" | "warning" | "info"
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
}: ConfirmModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  const colors = {
    danger: {
      bg: "bg-red-500/20",
      border: "border-red-500/50",
      button: "bg-red-500/80 hover:bg-red-500",
      icon: "🗑️",
    },
    warning: {
      bg: "bg-yellow-500/20",
      border: "border-yellow-500/50",
      button: "bg-yellow-500/80 hover:bg-yellow-500",
      icon: "⚠️",
    },
    info: {
      bg: "bg-blue-500/20",
      border: "border-blue-500/50",
      button: "bg-blue-500/80 hover:bg-blue-500",
      icon: "ℹ️",
    },
  }

  const currentColors = colors[type]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#1F242E]/95 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Icon */}
        <div
          className={`w-16 h-16 mx-auto mb-4 ${currentColors.bg} ${currentColors.border} border-2 rounded-2xl flex items-center justify-center text-3xl`}
        >
          {currentColors.icon}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white text-center mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-white/70 text-center mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold rounded-xl transition-all cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`flex-1 px-6 py-3 ${currentColors.button} backdrop-blur-sm text-white font-semibold rounded-xl transition-all shadow-lg cursor-pointer`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
