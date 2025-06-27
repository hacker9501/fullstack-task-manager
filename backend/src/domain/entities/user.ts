export interface User {
  id: string
  email: string
  password: string
  name: string
  role: UserRole
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export interface CreateUserData {
  email: string
  password: string
  name: string
  role?: UserRole
}

export interface UpdateUserData {
  email?: string
  name?: string
  role?: UserRole
  isActive?: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken?: string
}

export interface UserProfile {
  id: string
  email: string
  name: string
  role: UserRole
  isActive: boolean
  createdAt: Date
}
