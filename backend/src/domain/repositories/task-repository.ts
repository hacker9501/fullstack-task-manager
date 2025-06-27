import type { Task, CreateTaskData, UpdateTaskData, TaskFilters, TaskWithUsers } from "@/domain/entities/task"

export interface TaskRepository {
  create(taskData: CreateTaskData, createdBy: string): Promise<Task>
  findById(id: string): Promise<TaskWithUsers | null>
  findAll(filters?: TaskFilters): Promise<TaskWithUsers[]>
  findByUserId(userId: string, filters?: TaskFilters): Promise<TaskWithUsers[]>
  update(id: string, taskData: UpdateTaskData): Promise<Task | null>
  delete(id: string): Promise<boolean>
  countByStatus(): Promise<Record<string, number>>
}
