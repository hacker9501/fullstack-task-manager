import type { TaskRepository } from "@/domain/repositories/task-repository"
import type { UserRepository } from "@/domain/repositories/user-repository"
import { type UpdateTaskData, type Task, TaskStatus } from "@/domain/entities/task"
import { UserRole } from "@/domain/entities/user"
import { AppError } from "@/utils/app-error"

export class UpdateTaskUseCase {
  constructor(
    private taskRepository: TaskRepository,
    private userRepository: UserRepository,
  ) {}

  async execute(taskId: string, taskData: UpdateTaskData, userId: string, userRole: UserRole): Promise<Task> {
    // Find existing task
    const existingTask = await this.taskRepository.findById(taskId)
    if (!existingTask) {
      throw new AppError("Task not found", 404)
    }

    // Check permissions
    const canEdit =
      userRole === UserRole.ADMIN || existingTask.createdBy === userId || existingTask.assignedTo === userId

    if (!canEdit) {
      throw new AppError("Not authorized to update this task", 403)
    }

    // Validate assigned user if provided
    if (taskData.assignedTo) {
      const assignedUser = await this.userRepository.findById(taskData.assignedTo)
      if (!assignedUser) {
        throw new AppError("Assigned user not found", 404)
      }
    }

    // Set completion date if status is completed
    if (taskData.status === TaskStatus.COMPLETED && existingTask.status !== TaskStatus.COMPLETED) {
      ;(taskData as any).completedAt = new Date()
    }

    const updatedTask = await this.taskRepository.update(taskId, taskData)
    if (!updatedTask) {
      throw new AppError("Failed to update task", 500)
    }

    return updatedTask
  }
}
