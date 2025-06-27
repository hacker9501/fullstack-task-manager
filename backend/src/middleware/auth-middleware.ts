import type { Request, Response, NextFunction } from "express"
import { verifyToken } from "@/infrastructure/auth/jwt-service"
import { logger } from "@/utils/logger"

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Access token is required",
      })
      return
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    const decoded = verifyToken(token)

    // Add user info to request object
    ;(req as any).user = decoded

    next()
  } catch (error) {
    logger.error("Auth middleware error:", error)
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    })
  }
}
