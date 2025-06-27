import type { TaskRepository } from "@/domain/repositories/task-repository"
import { UserRole } from "@/domain/entities/user"
import { AppError } from "@/utils/app-error"

export class DeleteTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(taskId: string, userId: string, userRole: UserRole): Promise<void> {
    // Find existing task
    const existingTask = await this.taskRepository.findById(taskId)
    if (!existingTask) {
      throw new AppError("Task not found", 404)
    }

    // Check permissions - only admin or task creator can delete
    const canDelete = userRole === UserRole.ADMIN || existingTask.createdBy === userId

    if (!canDelete) {
      throw new AppError("Not authorized to delete this task", 403)
    }

    const deleted = await this.taskRepository.delete(taskId)
    if (!deleted) {
      throw new AppError("Failed to delete task", 500)
    }
  }
}
