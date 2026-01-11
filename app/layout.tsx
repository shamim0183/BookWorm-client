import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "BookWorm - Your Personal Reading Tracker",
  description:
    "Discover books, track reading, write reviews, get recommendations",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  )
}
