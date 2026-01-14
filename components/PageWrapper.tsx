"use client"

import { ReactNode } from "react"
import FloatingBooks from "./FloatingBooks"

interface PageWrapperProps {
  children: ReactNode
  className?: string
}

/**
 * Consistent page wrapper with dark gradient background and floating books
 * Used across all pages for unified theming
 */
export default function PageWrapper({
  children,
  className = "",
}: PageWrapperProps) {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-[#1F242E] via-[#2C5F4F] to-[#1F242E] relative py-8 ${className}`}
    >
      <FloatingBooks />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
