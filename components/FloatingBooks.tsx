"use client"

/**
 * Reusable FloatingBooks component for background animations
 * Displays floating book covers with different sizes and animations
 * Used across all pages for consistent theming
 */
export default function FloatingBooks() {
  const books = [
    // Large books
    {
      url: "https://covers.openlibrary.org/b/id/8235886-L.jpg",
      size: "w-40 h-56",
      position: "top-20 left-20",
      animation: "animate-float",
      rotation: "rotate-12",
    },
    {
      url: "https://covers.openlibrary.org/b/id/10387084-L.jpg",
      size: "w-44 h-60",
      position: "bottom-40 left-40",
      animation: "animate-float",
      rotation: "-rotate-6",
    },
    {
      url: "https://covers.openlibrary.org/b/id/12549326-L.jpg",
      size: "w-40 h-56",
      position: "top-40 right-16",
      animation: "animate-float-delayed",
      rotation: "rotate-[-15deg]",
    },

    // Medium books
    {
      url: "https://covers.openlibrary.org/b/id/12583098-L.jpg",
      size: "w-32 h-44",
      position: "top-60 right-32",
      animation: "animate-float-delayed",
      rotation: "rotate-3",
    },
    {
      url: "https://covers.openlibrary.org/b/id/10677563-L.jpg",
      size: "w-32 h-48",
      position: "bottom-1/3 left-1/4",
      animation: "animate-float-delayed",
      rotation: "-rotate-12",
    },
    {
      url: "https://covers.openlibrary.org/b/id/7884916-L.jpg",
      size: "w-28 h-40",
      position: "top-1/3 right-1/4",
      animation: "animate-float",
      rotation: "rotate-6",
    },
    {
      url: "https://covers.openlibrary.org/b/id/8465165-L.jpg",
      size: "w-32 h-46",
      position: "bottom-32 right-1/3",
      animation: "animate-float",
      rotation: "rotate-8",
    },
    {
      url: "https://covers.openlibrary.org/b/id/10521270-L.jpg",
      size: "w-30 h-42",
      position: "top-1/2 left-16",
      animation: "animate-float-delayed",
      rotation: "-rotate-8",
    },

    // Small books
    {
      url: "https://covers.openlibrary.org/b/id/8225261-L.jpg",
      size: "w-20 h-32",
      position: "bottom-20 right-20",
      animation: "animate-float-delayed",
      rotation: "rotate-[-5deg]",
    },
    {
      url: "https://covers.openlibrary.org/b/id/8231357-L.jpg",
      size: "w-24 h-34",
      position: "top-1/4 left-1/3",
      animation: "animate-float",
      rotation: "rotate-12",
    },
    {
      url: "https://covers.openlibrary.org/b/id/7659574-L.jpg",
      size: "w-22 h-32",
      position: "bottom-1/4 right-1/4",
      animation: "animate-float-delayed",
      rotation: "-rotate-10",
    },
    {
      url: "https://covers.openlibrary.org/b/id/8418735-L.jpg",
      size: "w-20 h-30",
      position: "top-3/4 left-1/2",
      animation: "animate-float",
      rotation: "rotate-15",
    },

    // Center feature book
    {
      url: "https://covers.openlibrary.org/b/id/12919193-L.jpg",
      size: "w-48 h-64",
      position: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      animation: "animate-float",
      rotation: "rotate-[-8deg]",
      opacity: "opacity-40",
    },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden opacity-40 pointer-events-none">
      {books.map((book, index) => (
        <img
          key={index}
          src={book.url}
          alt=""
          className={`absolute ${book.size} ${book.position} ${
            book.animation
          } ${book.rotation} ${
            book.opacity || ""
          } rounded-lg shadow-2xl object-cover`}
          loading="lazy"
        />
      ))}
    </div>
  )
}
