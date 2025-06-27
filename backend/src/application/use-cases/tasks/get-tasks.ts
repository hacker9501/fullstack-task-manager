import type { TaskRepository } from "@/domain/repositories/task-repository"
import type { TaskFilters, TaskWithUsers } from "@/domain/entities/task"
import { UserRole } from "@/domain/entities/user"

export class GetTasksUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(filters: TaskFilters = {}, userId: string, userRole: UserRole): Promise<TaskWithUsers[]> {
    // If user is not admin, only show their tasks
    if (userRole !== UserRole.ADMIN) {
      filters.assignedTo = userId
    }

    return await this.taskRepository.findAll(filters)
  }
}
