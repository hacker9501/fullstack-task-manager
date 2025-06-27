import type { TaskRepository } from "@/domain/repositories/task-repository"
import type { UserRepository } from "@/domain/repositories/user-repository"
import type { CreateTaskData, Task } from "@/domain/entities/task"
import { AppError } from "@/utils/app-error"

export class CreateTaskUseCase {
  constructor(
    private taskRepository: TaskRepository,
    private userRepository: UserRepository,
  ) {}

  async execute(taskData: CreateTaskData, createdBy: string): Promise<Task> {
    // Validate assigned user if provided
    if (taskData.assignedTo) {
      const assignedUser = await this.userRepository.findById(taskData.assignedTo)
      if (!assignedUser) {
        throw new AppError("Assigned user not found", 404)
      }
    }

    // Validate due date
    if (taskData.dueDate && taskData.dueDate < new Date()) {
      throw new AppError("Due date cannot be in the past", 400)
    }

    return await this.taskRepository.create(taskData, createdBy)
  }
}
