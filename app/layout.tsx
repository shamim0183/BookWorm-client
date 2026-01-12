import { AuthProvider } from "@/lib/AuthContext"
import type { Metadata } from "next"
import { Toaster } from "react-hot-toast"
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
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: "#1F242E", color: "#FAF7F0" },
              success: {
                iconTheme: { primary: "#2C5F4F", secondary: "#FAF7F0" },
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
