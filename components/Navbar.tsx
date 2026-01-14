"use client"

import { useAuth } from "@/lib/AuthContext"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isActive = (path: string) => pathname === path

  // User navigation links
  const userLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "My Library", href: "/library" },
    { name: "Browse Books", href: "/browse" },
    { name: "Tutorials", href: "/tutorials" },
  ]

  // Admin navigation links
  const adminLinks = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Books", href: "/admin/books" },
    { name: "Genres", href: "/admin/genres" },
    { name: "Users", href: "/admin/users" },
    { name: "Reviews", href: "/admin/reviews" },
    { name: "Tutorials", href: "/admin/tutorials" },
  ]

  const links = user?.role === "admin" ? adminLinks : userLinks

  return (
    <nav className="bg-[#1F242E] border-b border-white/10 sticky top-0 z-50 backdrop-blur-lg bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href={user?.role === "admin" ? "/admin/dashboard" : "/library"}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              <img
                src="/BookWorm.png"
                alt="BookWorm"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-heading font-bold text-white hidden sm:block">
              BookWorm
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? "bg-[#C9A86A] text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#C9A86A] flex items-center justify-center overflow-hidden">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-sm font-semibold">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="text-white text-sm font-medium hidden sm:block">
                {user?.name}
              </span>
              <svg
                className="w-4 h-4 text-white/80"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-[#1F242E] border-2 border-[#C9A86A]/30 rounded-xl shadow-2xl overflow-hidden">
                {/* User Info */}
                <div className="px-3 sm:px-4 py-3 sm:py-4 border-b border-white/10 bg-gradient-to-br from-[#2C5F4F]/20 to-transparent">
                  <p className="text-sm sm:text-base font-bold text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1 truncate">
                    {user?.email}
                  </p>
                  <div className="mt-2 sm:mt-3">
                    <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 bg-[#C9A86A] text-white text-xs font-bold uppercase rounded-lg">
                      {user?.role}
                    </span>
                  </div>
                </div>
                {/* Profile Link */}
                <Link
                  href="/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left font-medium text-white hover:bg-white/5 transition-all duration-200 flex items-center gap-2 sm:gap-3 cursor-pointer group"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-[#C9A86A] group-hover:text-[#B89858] transition"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-sm sm:text-base group-hover:translate-x-1 transition-transform">
                    My Profile
                  </span>
                </Link>
                {/* Logout Button */}
                <button
                  onClick={() => {
                    logout()
                    setProfileDropdownOpen(false)
                  }}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left font-medium text-white hover:bg-white/5 transition-all duration-200 flex items-center gap-2 sm:gap-3 cursor-pointer group"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 group-hover:text-red-300 transition"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="text-sm sm:text-base group-hover:translate-x-1 transition-transform">
                    Logout
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.href)
                      ? "bg-[#C9A86A] text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
