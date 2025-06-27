import type { Request, Response, NextFunction } from "express"
import type { UserRole } from "@/domain/entities/user"

export const roleMiddleware = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const userRole = (req as any).user?.role

      if (!userRole || !allowedRoles.includes(userRole)) {
        res.status(403).json({
          success: false,
          message: "Insufficient permissions",
        })
        return
      }

      next()
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }
}
