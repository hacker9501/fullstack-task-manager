export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  isActive: boolean
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  assignedTo?: string
  createdBy: string
  dueDate?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
  assignedUser?: {
    id: string
    name: string
    email: string
  }
  createdByUser: {
    id: string
    name: string
    email: string
  }
}

export interface AuthTokens {
  accessToken: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
}

export interface CreateTaskData {
  title: string
  description?: string
  priority?: Task["priority"]
  assignedTo?: string
  dueDate?: string
}

export interface UpdateTaskData {
  title?: string
  description?: string
  status?: Task["status"]
  priority?: Task["priority"]
  assignedTo?: string
  dueDate?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  errors?: any
}
