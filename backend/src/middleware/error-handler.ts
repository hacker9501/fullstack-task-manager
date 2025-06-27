import type { Request, Response, NextFunction } from "express"
import { AppError } from "@/utils/app-error"
import { logger } from "@/utils/logger"

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  logger.error("Error:", {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  })

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    })
    return
  }

  // Mongoose validation error
  if (error.name === "ValidationError") {
    res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.message,
    })
    return
  }

  // Mongoose cast error
  if (error.name === "CastError") {
    res.status(400).json({
      success: false,
      message: "Invalid ID format",
    })
    return
  }

  // JWT errors
  if (error.name === "JsonWebTokenError") {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    })
    return
  }

  if (error.name === "TokenExpiredError") {
    res.status(401).json({
      success: false,
      message: "Token expired",
    })
    return
  }

  // Default error
  res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && {
      error: error.message,
      stack: error.stack,
    }),
  })
}
