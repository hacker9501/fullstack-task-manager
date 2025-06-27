import { z } from "zod"
import { UserRole } from "@/domain/entities/user"

export const registerSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password is too long"),
  name: z.string().min(1, "Name is required").max(100, "Name is too long").trim(),
  role: z.nativeEnum(UserRole).optional(),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
})

export type RegisterRequest = z.infer<typeof registerSchema>
export type LoginRequest = z.infer<typeof loginSchema>
