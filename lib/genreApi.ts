import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token")
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

// ===== GENRE ENDPOINTS =====
export const getGenres = async () => {
  const response = await axios.get(`${API_URL}/genres`)
  return response.data
}

export const createGenre = async (genreData: {
  name: string
  description?: string
}) => {
  const response = await axios.post(
    `${API_URL}/genres`,
    genreData,
    getAuthHeaders()
  )
  return response.data
}

export const updateGenre = async (
  id: string,
  genreData: { name?: string; description?: string }
) => {
  const response = await axios.put(
    `${API_URL}/genres/${id}`,
    genreData,
    getAuthHeaders()
  )
  return response.data
}

export const deleteGenre = async (id: string) => {
  const response = await axios.delete(
    `${API_URL}/genres/${id}`,
    getAuthHeaders()
  )
  return response.data
}
