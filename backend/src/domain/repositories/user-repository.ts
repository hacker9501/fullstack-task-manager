import type { User, CreateUserData, UpdateUserData, UserProfile } from "@/domain/entities/user"

export interface UserRepository {
  create(userData: CreateUserData): Promise<User>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findAll(): Promise<UserProfile[]>
  update(id: string, userData: UpdateUserData): Promise<User | null>
  delete(id: string): Promise<boolean>
  exists(email: string): Promise<boolean>
}
