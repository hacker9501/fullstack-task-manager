import axios, { type AxiosInstance, type AxiosResponse } from "axios"
import type { ApiResponse } from "@/types"

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.removeToken()
          window.location.href = "/"
        }
        return Promise.reject(error)
      },
    )
  }

  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  }

  private removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
  }

  // Auth methods
  async login(credentials: { email: string; password: string }): Promise<ApiResponse> {
    const response = await this.api.post("/auth/login", credentials)
    return response.data
  }

  async register(userData: { email: string; password: string; name: string }): Promise<ApiResponse> {
    const response = await this.api.post("/auth/register", userData)
    return response.data
  }

  async getProfile(): Promise<ApiResponse> {
    const response = await this.api.get("/auth/profile")
    return response.data
  }

  // Task methods
  async getTasks(filters?: any): Promise<ApiResponse> {
    const response = await this.api.get("/tasks", { params: filters })
    return response.data
  }

  async getTask(id: string): Promise<ApiResponse> {
    const response = await this.api.get(`/tasks/${id}`)
    return response.data
  }

  async createTask(taskData: any): Promise<ApiResponse> {
    const response = await this.api.post("/tasks", taskData)
    return response.data
  }

  async updateTask(id: string, taskData: any): Promise<ApiResponse> {
    const response = await this.api.put(`/tasks/${id}`, taskData)
    return response.data
  }

  async deleteTask(id: string): Promise<ApiResponse> {
    const response = await this.api.delete(`/tasks/${id}`)
    return response.data
  }

  async getTaskStats(): Promise<ApiResponse> {
    const response = await this.api.get("/tasks/stats")
    return response.data
  }

  // User methods
  async getUsers(): Promise<ApiResponse> {
    const response = await this.api.get("/users")
    return response.data
  }
}

export const apiService = new ApiService()
