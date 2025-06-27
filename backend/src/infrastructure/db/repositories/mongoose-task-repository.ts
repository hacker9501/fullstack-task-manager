import type { TaskRepository } from "@/domain/repositories/task-repository"
import {
  type Task,
  type CreateTaskData,
  type UpdateTaskData,
  type TaskFilters,
  type TaskWithUsers,
  TaskStatus,
} from "@/domain/entities/task"
import { TaskModel } from "@/infrastructure/db/models/task-model"
import { AppError } from "@/utils/app-error"

export class MongooseTaskRepository implements TaskRepository {
  async create(taskData: CreateTaskData, createdBy: string): Promise<Task> {
    try {
      const task = new TaskModel({
        ...taskData,
        createdBy,
      })
      const savedTask = await task.save()
      return this.mapToEntity(savedTask)
    } catch (error) {
      throw new AppError("Failed to create task", 500)
    }
  }

  async findById(id: string): Promise<TaskWithUsers | null> {
    try {
      const task = await TaskModel.findById(id).populate("assignedTo", "name email").populate("createdBy", "name email")

      return task ? this.mapToEntityWithUsers(task) : null
    } catch (error) {
      return null
    }
  }

  async findAll(filters: TaskFilters = {}): Promise<TaskWithUsers[]> {
    try {
      const query = this.buildQuery(filters)

      const tasks = await TaskModel.find(query)
        .populate("assignedTo", "name email")
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })

      return tasks.map((task) => this.mapToEntityWithUsers(task))
    } catch (error) {
      throw new AppError("Failed to fetch tasks", 500)
    }
  }

  async findByUserId(userId: string, filters: TaskFilters = {}): Promise<TaskWithUsers[]> {
    try {
      const query = {
        ...this.buildQuery(filters),
        $or: [{ assignedTo: userId }, { createdBy: userId }],
      }

      const tasks = await TaskModel.find(query)
        .populate("assignedTo", "name email")
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })

      return tasks.map((task) => this.mapToEntityWithUsers(task))
    } catch (error) {
      throw new AppError("Failed to fetch user tasks", 500)
    }
  }

  async update(id: string, taskData: UpdateTaskData): Promise<Task | null> {
    try {
      const task = await TaskModel.findByIdAndUpdate(
        id,
        { ...taskData, updatedAt: new Date() },
        { new: true, runValidators: true },
      )
      return task ? this.mapToEntity(task) : null
    } catch (error) {
      throw new AppError("Failed to update task", 500)
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await TaskModel.findByIdAndDelete(id)
      return !!result
    } catch (error) {
      return false
    }
  }

  async countByStatus(): Promise<Record<string, number>> {
    try {
      const counts = await TaskModel.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ])

      const result: Record<string, number> = {}
      Object.values(TaskStatus).forEach((status) => {
        result[status] = 0
      })

      counts.forEach((item) => {
        result[item._id] = item.count
      })

      return result
    } catch (error) {
      throw new AppError("Failed to count tasks by status", 500)
    }
  }

  private buildQuery(filters: TaskFilters): any {
    const query: any = {}

    if (filters.status) {
      query.status = filters.status
    }

    if (filters.priority) {
      query.priority = filters.priority
    }

    if (filters.assignedTo) {
      query.assignedTo = filters.assignedTo
    }

    if (filters.createdBy) {
      query.createdBy = filters.createdBy
    }

    if (filters.dueDateFrom || filters.dueDateTo) {
      query.dueDate = {}
      if (filters.dueDateFrom) {
        query.dueDate.$gte = filters.dueDateFrom
      }
      if (filters.dueDateTo) {
        query.dueDate.$lte = filters.dueDateTo
      }
    }

    return query
  }

  private mapToEntity(taskDoc: any): Task {
    return {
      id: taskDoc._id.toString(),
      title: taskDoc.title,
      description: taskDoc.description,
      status: taskDoc.status,
      priority: taskDoc.priority,
      assignedTo: taskDoc.assignedTo?.toString(),
      createdBy: taskDoc.createdBy.toString(),
      dueDate: taskDoc.dueDate,
      completedAt: taskDoc.completedAt,
      createdAt: taskDoc.createdAt,
      updatedAt: taskDoc.updatedAt,
    }
  }

  private mapToEntityWithUsers(taskDoc: any): TaskWithUsers {
    const baseTask = this.mapToEntity(taskDoc)

    return {
      ...baseTask,
      assignedUser: taskDoc.assignedTo
        ? {
            id: taskDoc.assignedTo._id.toString(),
            name: taskDoc.assignedTo.name,
            email: taskDoc.assignedTo.email,
          }
        : undefined,
      createdByUser: {
        id: taskDoc.createdBy._id.toString(),
        name: taskDoc.createdBy.name,
        email: taskDoc.createdBy.email,
      },
    }
  }
}
