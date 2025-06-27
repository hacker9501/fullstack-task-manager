import { z } from "zod"
import { TaskStatus, TaskPriority } from "@/domain/entities/task"

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long").trim(),
  description: z.string().max(1000, "Description is too long").trim().optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  assignedTo: z.string().optional(),
  dueDate: z
    .string()
    .datetime()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
})

export const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long").trim().optional(),
  description: z.string().max(1000, "Description is too long").trim().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  assignedTo: z.string().optional(),
  dueDate: z
    .string()
    .datetime()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
})

export const taskFiltersSchema = z.object({
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  assignedTo: z.string().optional(),
  createdBy: z.string().optional(),
  dueDateFrom: z
    .string()
    .datetime()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  dueDateTo: z
    .string()
    .datetime()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
})

export type CreateTaskRequest = z.infer<typeof createTaskSchema>
export type UpdateTaskRequest = z.infer<typeof updateTaskSchema>
export type TaskFiltersRequest = z.infer<typeof taskFiltersSchema>
