import type { UserRepository } from "@/domain/repositories/user-repository"
import { type CreateUserData, type User, UserRole } from "@/domain/entities/user"
import { AppError } from "@/utils/app-error"
import { hashPassword } from "@/infrastructure/auth/password-service"

export class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userData: CreateUserData): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email)
    if (existingUser) {
      throw new AppError("User with this email already exists", 400)
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password)

    // Create user with default role
    const newUserData: CreateUserData = {
      ...userData,
      password: hashedPassword,
      role: userData.role || UserRole.USER,
    }

    return await this.userRepository.create(newUserData)
  }
}
