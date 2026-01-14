"use client"

import { useEffect, useState } from "react"

interface FloatingBook {
  id: number
  image: string
  size: number
  left: number
  top: number
  rotation: number
  duration: number
  delay: number
}

export default function FloatingBooks() {
  const [books, setBooks] = useState<FloatingBook[]>([])

  useEffect(() => {
    // Generate random floating books on mount/refresh
    // OpenLibrary has millions of covers - generate truly random IDs
    const generatedBooks: FloatingBook[] = Array.from(
      { length: 15 },
      (_, i) => {
        // Generate random cover ID from OpenLibrary
        // Valid range: ~8000000-10000000 for quality covers
        const randomCoverId = Math.floor(Math.random() * 2000000) + 8000000

        return {
          id: i,
          image: `https://covers.openlibrary.org/b/id/${randomCoverId}-M.jpg`,
          size: Math.random() * 80 + 60, // 60-140px (more variety)
          left: Math.random() * 110 - 5, // -5% to 105% (books can go slightly off-screen)
          top: Math.random() * 110 - 5, // -5% to 105% (more vertical spread)
          rotation: Math.random() * 90 - 45, // -45 to +45 degrees (tilted left/right)
          duration: Math.random() * 10 + 15, // 15-25 seconds
          delay: Math.random() * -20, // Start at different times
        }
      }
    )

    setBooks(generatedBooks)
  }, []) // Empty dependency = regenerates on every mount/refresh

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-15">
      {books.map((book) => (
        <div
          key={book.id}
          className="absolute animate-float"
          style={{
            left: `${book.left}%`,
            top: `${book.top}%`,
            width: `${book.size}px`,
            height: `${book.size * 1.5}px`,
            transform: `rotate(${book.rotation}deg)`,
            animationDuration: `${book.duration}s`,
            animationDelay: `${book.delay}s`,
          }}
        >
          <img
            src={book.image}
            alt="Floating book"
            className="w-full h-full object-cover rounded-lg shadow-2xl opacity-80"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.style.display = "none"
            }}
          />
        </div>
      ))}
    </div>
  )
}
