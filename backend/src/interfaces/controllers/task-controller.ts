import type { Request, Response } from "express"
import { CreateTaskUseCase } from "@/application/use-cases/tasks/create-task"
import { GetTasksUseCase } from "@/application/use-cases/tasks/get-tasks"
import { UpdateTaskUseCase } from "@/application/use-cases/tasks/update-task"
import { DeleteTaskUseCase } from "@/application/use-cases/tasks/delete-task"
import { MongooseTaskRepository } from "@/infrastructure/db/repositories/mongoose-task-repository"
import { MongooseUserRepository } from "@/infrastructure/db/repositories/mongoose-user-repository"
import { AppError } from "@/utils/app-error"
import { logger } from "@/utils/logger"
import { createTaskSchema, updateTaskSchema, taskFiltersSchema } from "@/interfaces/validators/task-validators"

export class TaskController {
  private taskRepository = new MongooseTaskRepository()
  private userRepository = new MongooseUserRepository()
  private createTaskUseCase = new CreateTaskUseCase(this.taskRepository, this.userRepository)
  private getTasksUseCase = new GetTasksUseCase(this.taskRepository)
  private updateTaskUseCase = new UpdateTaskUseCase(this.taskRepository, this.userRepository)
  private deleteTaskUseCase = new DeleteTaskUseCase(this.taskRepository)

  createTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = createTaskSchema.parse(req.body)
      const userId = (req as any).user.userId

      const task = await this.createTaskUseCase.execute(validatedData, userId)

      logger.info(`Task created: ${task.id} by user: ${userId}`)

      res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: { task },
      })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        })
      } else {
        logger.error("Create task error:", error)
        res.status(500).json({
          success: false,
          message: "Internal server error",
        })
      }
    }
  }

  getTasks = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters = taskFiltersSchema.parse(req.query)
      const userId = (req as any).user.userId
      const userRole = (req as any).user.role

      const tasks = await this.getTasksUseCase.execute(filters, userId, userRole)

      res.status(200).json({
        success: true,
        data: {
          tasks,
          count: tasks.length,
        },
      })
    } catch (error) {
      logger.error("Get tasks error:", error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }

  getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const userId = (req as any).user.userId
      const userRole = (req as any).user.role

      const task = await this.taskRepository.findById(id)

      if (!task) {
        res.status(404).json({
          success: false,
          message: "Task not found",
        })
        return
      }

      // Check permissions
      const canView = userRole === "admin" || task.createdBy === userId || task.assignedTo === userId

      if (!canView) {
        res.status(403).json({
          success: false,
          message: "Not authorized to view this task",
        })
        return
      }

      res.status(200).json({
        success: true,
        data: { task },
      })
    } catch (error) {
      logger.error("Get task by ID error:", error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }

  updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const validatedData = updateTaskSchema.parse(req.body)
      const userId = (req as any).user.userId
      const userRole = (req as any).user.role

      const task = await this.updateTaskUseCase.execute(id, validatedData, userId, userRole)

      logger.info(`Task updated: ${task.id} by user: ${userId}`)

      res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: { task },
      })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        })
      } else {
        logger.error("Update task error:", error)
        res.status(500).json({
          success: false,
          message: "Internal server error",
        })
      }
    }
  }

  deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const userId = (req as any).user.userId
      const userRole = (req as any).user.role

      await this.deleteTaskUseCase.execute(id, userId, userRole)

      logger.info(`Task deleted: ${id} by user: ${userId}`)

      res.status(200).json({
        success: true,
        message: "Task deleted successfully",
      })
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        })
      } else {
        logger.error("Delete task error:", error)
        res.status(500).json({
          success: false,
          message: "Internal server error",
        })
      }
    }
  }

  getTaskStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.taskRepository.countByStatus()

      res.status(200).json({
        success: true,
        data: { stats },
      })
    } catch (error) {
      logger.error("Get task stats error:", error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
      })
    }
  }
}
