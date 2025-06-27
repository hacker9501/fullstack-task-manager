"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import type { User, LoginCredentials, RegisterData } from "@/types"
import { apiService } from "@/services/api"
import toast from "react-hot-toast"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setLoading(false)
        return
      }

      const response = await apiService.getProfile()
      if (response.success) {
        setUser(response.data.user)
      } else {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    } catch (error) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await apiService.login(credentials)

      if (response.success) {
        const { user, tokens } = response.data
        localStorage.setItem("token", tokens.accessToken)
        localStorage.setItem("user", JSON.stringify(user))
        setUser(user)
        toast.success("Login successful!")
        return true
      } else {
        toast.error(response.message || "Login failed")
        return false
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed"
      toast.error(message)
      return false
    }
  }

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      const response = await apiService.register(userData)

      if (response.success) {
        toast.success("Registration successful! Please login.")
        return true
      } else {
        toast.error(response.message || "Registration failed")
        return false
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed"
      toast.error(message)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    toast.success("Logged out successfully")
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
