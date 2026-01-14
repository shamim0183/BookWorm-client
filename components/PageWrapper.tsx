"use client"

import { ReactNode } from "react"

interface PageWrapperProps {
  children: ReactNode
  className?: string
}

/**
 * Consistent page wrapper with dark gradient background and floating books
 * Used across all pages for unified theming
 */
export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 py-8">
      {children}
    </main>
  )
}
