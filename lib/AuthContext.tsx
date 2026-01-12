"use client"

import axios from "axios"
import { useRouter } from "next/navigation"
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface User {
  _id: string
  name: string
  email: string
  role: "user" | "admin"
  photoURL?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (token: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          // Verify token and get user data
          const response = await axios.get(`${API_URL}/auth/verify`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          setUser(response.data.user)
        } catch (error) {
          console.error("Auth verification failed:", error)
          localStorage.removeItem("token")
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (token: string) => {
    localStorage.setItem("token", token)
    try {
      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUser(response.data.user)
    } catch (error) {
      console.error("Login failed:", error)
      localStorage.removeItem("token")
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    router.push("/login")
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
