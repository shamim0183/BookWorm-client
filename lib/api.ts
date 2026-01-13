import axios from "axios"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Helper to get auth token
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

// Helper to create auth headers
const authHeaders = () => {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ============ LIBRARY API ============

export const getLibrary = async (shelf?: string) => {
  try {
    const params = shelf ? { shelf } : {}
    const response = await axios.get(`${API_BASE_URL}/library`, {
      headers: authHeaders(),
      params,
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to fetch library")
  }
}

export const addToLibrary = async (
  bookId: string,
  shelf: string,
  totalPages?: number
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/library`,
      { bookId, shelf, totalPages },
      { headers: authHeaders() }
    )
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to add to library")
  }
}

export const updateProgress = async (entryId: string, pagesRead: number) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/library/${entryId}/progress`,
      { pagesRead },
      { headers: authHeaders() }
    )
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to update progress")
  }
}

export const removeFromLibrary = async (entryId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/library/${entryId}`, {
      headers: authHeaders(),
    })
    return response.data
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to remove from library"
    )
  }
}

// ============ BOOK API ============

export const searchBooks = async (query: string, page = 1, limit = 20) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/books`, {
      params: { search: query, page, limit },
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to search books")
  }
}

export const getBook = async (bookId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/books/${bookId}`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to fetch book")
  }
}

export const createBook = async (bookData: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/books`, bookData, {
      headers: authHeaders(),
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to create book")
  }
}

export const updateBook = async (bookId: string, bookData: any) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/books/${bookId}`,
      bookData,
      {
        headers: authHeaders(),
      }
    )
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to update book")
  }
}

export const deleteBook = async (bookId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/books/${bookId}`, {
      headers: authHeaders(),
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to delete book")
  }
}

// ============ UPLOAD API ============

export const uploadBookCover = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append("image", file)

    const response = await axios.post(
      `${API_BASE_URL}/upload/book-cover`,
      formData,
      {
        headers: {
          ...authHeaders(),
          "Content-Type": "multipart/form-data",
        },
      }
    )
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to upload image")
  }
}

// ============ STATS API ============

export const getStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stats`, {
      headers: authHeaders(),
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to fetch stats")
  }
}

// ============ GENRE API ============

export const getGenres = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/genres`)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to fetch genres")
  }
}

export const createGenre = async (genreData: {
  name: string
  description?: string
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/genres`, genreData, {
      headers: authHeaders(),
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to create genre")
  }
}

export const updateGenre = async (
  genreId: string,
  genreData: { name?: string; description?: string }
) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/genres/${genreId}`,
      genreData,
      { headers: authHeaders() }
    )
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to update genre")
  }
}

export const deleteGenre = async (genreId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/genres/${genreId}`, {
      headers: authHeaders(),
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to delete genre")
  }
}
