import { Router } from "express"
import { authMiddleware } from "@/middleware/auth-middleware"
import { roleMiddleware } from "@/middleware/role-middleware"
import { MongooseUserRepository } from "@/infrastructure/db/repositories/mongoose-user-repository"
import { UserRole } from "@/domain/entities/user"

const router = Router()
const userRepository = new MongooseUserRepository()

// All user routes require authentication
router.use(authMiddleware)

// Get all users (admin only)
router.get("/", roleMiddleware([UserRole.ADMIN]), async (req, res) => {
  try {
    const users = await userRepository.findAll()
    res.status(200).json({
      success: true,
      data: { users },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
})

export { router as userRoutes }
