import { connectDatabase } from "@/infrastructure/db/connection"
import { UserModel } from "@/infrastructure/db/models/user-model"
import { TaskModel } from "@/infrastructure/db/models/task-model"
import { hashPassword } from "@/infrastructure/auth/password-service"
import { UserRole, TaskStatus, TaskPriority } from "@/domain/entities/user"
import { logger } from "@/utils/logger"

async function seedDatabase() {
  try {
    await connectDatabase()

    // Check if users already exist
    const userCount = await UserModel.countDocuments()
    if (userCount > 0) {
      logger.info("Database already seeded")
      return
    }

    // Create admin user
    const adminPassword = await hashPassword("admin123")
    const adminUser = await UserModel.create({
      email: "admin@example.com",
      password: adminPassword,
      name: "Admin User",
      role: UserRole.ADMIN,
    })

    // Create regular user
    const userPassword = await hashPassword("user123")
    const regularUser = await UserModel.create({
      email: "user@example.com",
      password: userPassword,
      name: "Regular User",
      role: UserRole.USER,
    })

    // Create sample tasks
    await TaskModel.create([
      {
        title: "Setup Development Environment",
        description: "Install and configure all necessary development tools",
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.HIGH,
        createdBy: adminUser._id,
        assignedTo: regularUser._id,
        completedAt: new Date(),
      },
      {
        title: "Design Database Schema",
        description: "Create the database schema for the task management system",
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        createdBy: adminUser._id,
        assignedTo: regularUser._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
      {
        title: "Implement Authentication",
        description: "Add user authentication with JWT tokens",
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        createdBy: adminUser._id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      },
      {
        title: "Write API Documentation",
        description: "Document all API endpoints with examples",
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        createdBy: regularUser._id,
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
      },
    ])

    logger.info("✅ Database seeded successfully")
    logger.info("Demo users created:")
    logger.info("Admin: admin@example.com / admin123")
    logger.info("User: user@example.com / user123")
  } catch (error) {
    logger.error("Failed to seed database:", error)
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase().then(() => process.exit(0))
}

export { seedDatabase }
