import { AuthProvider } from "@/lib/AuthContext"
import type { Metadata } from "next"
import { Toaster } from "react-hot-toast"
import "./globals.css"

export const metadata: Metadata = {
  title: "BookWorm - Your Personal Reading Tracker",
  description:
    "Discover books, track reading, write reviews, get recommendations",
  icons: {
    icon: "/favicon.png",
  },
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
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: "rgba(31, 36, 46, 0.95)",
                backdropFilter: "blur(12px)",
                color: "#fff",
                padding: "16px 24px",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
                fontSize: "15px",
                fontWeight: "500",
                maxWidth: "500px",
              },
              success: {
                iconTheme: {
                  primary: "#10B981",
                  secondary: "#fff",
                },
                style: {
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                },
              },
              error: {
                iconTheme: {
                  primary: "#EF4444",
                  secondary: "#fff",
                },
                style: {
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                },
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
