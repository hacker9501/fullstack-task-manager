import type { Request, Response } from "express"
import { RegisterUserUseCase } from "@/application/use-cases/auth/register-user"
import { LoginUserUseCase } from "@/application/use-cases/auth/login-user"
import { MongooseUserRepository } from "@/infrastructure/db/repositories/mongoose-user-repository"
import { AppError } from "@/utils/app-error"
import { logger } from "@/utils/logger"
import { registerSchema, loginSchema } from "@/interfaces/validators/auth-validators"

export class AuthController {
  private userRepository = new MongooseUserRepository()
  private registerUserUseCase = new RegisterUserUseCase(this.userRepository)
  private loginUserUseCase = new LoginUserUseCase(this.userRepository)

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = registerSchema.parse(req.body)

      const user = await this.registerUserUseCase.execute(validatedData)

      logger.info(`User registered: ${user.email}`)

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
      })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        })
      } else {
        logger.error("Registration error:", error)
        res.status(500).json({
          success: false,
          message: "Internal server error",
        })
      }
    }
  }

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = loginSchema.parse(req.body)

      const result = await this.loginUserUseCase.execute(validatedData)

      logger.info(`User logged in: ${result.user.email}`)

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: result.user,
          tokens: result.tokens,
        },
      })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        })
      } else {
        logger.error("Login error:", error)
        res.status(500).json({
          success: false,
          message: "Internal server error",
        })
      }
    }
  }

  profile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.userId
      const user = await this.userRepository.findById(userId)

      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        })
        return
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
          },
        },
      })
    } catch (error) {
      logger.error("Profile error:", error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }
}
