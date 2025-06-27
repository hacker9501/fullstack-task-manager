import type { UserRepository } from "@/domain/repositories/user-repository"
import type { User, CreateUserData, UpdateUserData, UserProfile } from "@/domain/entities/user"
import { UserModel } from "@/infrastructure/db/models/user-model"
import { AppError } from "@/utils/app-error"

export class MongooseUserRepository implements UserRepository {
  async create(userData: CreateUserData): Promise<User> {
    try {
      const user = new UserModel(userData)
      const savedUser = await user.save()
      return this.mapToEntity(savedUser)
    } catch (error: any) {
      if (error.code === 11000) {
        throw new AppError("User with this email already exists", 400)
      }
      throw new AppError("Failed to create user", 500)
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const user = await UserModel.findById(id)
      return user ? this.mapToEntity(user) : null
    } catch (error) {
      return null
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await UserModel.findOne({ email: email.toLowerCase() })
      return user ? this.mapToEntity(user) : null
    } catch (error) {
      return null
    }
  }

  async findAll(): Promise<UserProfile[]> {
    try {
      const users = await UserModel.find({ isActive: true }).select("-password")
      return users.map((user) => this.mapToProfile(user))
    } catch (error) {
      throw new AppError("Failed to fetch users", 500)
    }
  }

  async update(id: string, userData: UpdateUserData): Promise<User | null> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        id,
        { ...userData, updatedAt: new Date() },
        { new: true, runValidators: true },
      )
      return user ? this.mapToEntity(user) : null
    } catch (error: any) {
      if (error.code === 11000) {
        throw new AppError("Email already exists", 400)
      }
      throw new AppError("Failed to update user", 500)
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await UserModel.findByIdAndUpdate(id, { isActive: false }, { new: true })
      return !!result
    } catch (error) {
      return false
    }
  }

  async exists(email: string): Promise<boolean> {
    try {
      const user = await UserModel.findOne({ email: email.toLowerCase() })
      return !!user
    } catch (error) {
      return false
    }
  }

  private mapToEntity(userDoc: any): User {
    return {
      id: userDoc._id.toString(),
      email: userDoc.email,
      password: userDoc.password,
      name: userDoc.name,
      role: userDoc.role,
      isActive: userDoc.isActive,
      createdAt: userDoc.createdAt,
      updatedAt: userDoc.updatedAt,
    }
  }

  private mapToProfile(userDoc: any): UserProfile {
    return {
      id: userDoc._id.toString(),
      email: userDoc.email,
      name: userDoc.name,
      role: userDoc.role,
      isActive: userDoc.isActive,
      createdAt: userDoc.createdAt,
    }
  }
}
