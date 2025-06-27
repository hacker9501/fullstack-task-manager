import jwt from "jsonwebtoken"
import type { AuthTokens } from "@/domain/entities/user"

interface TokenPayload {
  userId: string
  email: string
  role: string
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"

export const generateTokens = (payload: TokenPayload): AuthTokens => {
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: "task-manager-api",
    audience: "task-manager-client",
  })

  return {
    accessToken,
  }
}

export const verifyToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: "task-manager-api",
      audience: "task-manager-client",
    }) as any

    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    }
  } catch (error) {
    throw new Error("Invalid token")
  }
}

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.decode(token) as any
    if (!decoded) return null

    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    }
  } catch (error) {
    return null
  }
}
