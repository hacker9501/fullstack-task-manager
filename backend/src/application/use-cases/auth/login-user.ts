import type { UserRepository } from "@/domain/repositories/user-repository"
import type { LoginCredentials, AuthTokens, UserProfile } from "@/domain/entities/user"
import { AppError } from "@/utils/app-error"
import { comparePassword } from "@/infrastructure/auth/password-service"
import { generateTokens } from "@/infrastructure/auth/jwt-service"

export class LoginUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(credentials: LoginCredentials): Promise<{ user: UserProfile; tokens: AuthTokens }> {
    // Find user by email
    const user = await this.userRepository.findByEmail(credentials.email)
    if (!user) {
      throw new AppError("Invalid credentials", 401)
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError("Account is deactivated", 401)
    }

    // Verify password
    const isPasswordValid = await comparePassword(credentials.password, user.password)
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401)
    }

    // Generate tokens
    const tokens = generateTokens({ userId: user.id, email: user.email, role: user.role })

    // Return user profile (without password)
    const userProfile: UserProfile = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    }

    return { user: userProfile, tokens }
  }
}
