import { Router } from "express"
import { AuthController } from "@/interfaces/controllers/auth-controller"
import { authMiddleware } from "@/middleware/auth-middleware"

const router = Router()
const authController = new AuthController()

// Public routes
router.post("/register", authController.register)
router.post("/login", authController.login)

// Protected routes
router.get("/profile", authMiddleware, authController.profile)

export { router as authRoutes }
