export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assignedTo?: string // User ID
  createdBy: string // User ID
  dueDate?: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export interface CreateTaskData {
  title: string
  description?: string
  priority?: TaskPriority
  assignedTo?: string
  dueDate?: Date
}

export interface UpdateTaskData {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  assignedTo?: string
  dueDate?: Date
}

export interface TaskFilters {
  status?: TaskStatus
  priority?: TaskPriority
  assignedTo?: string
  createdBy?: string
  dueDateFrom?: Date
  dueDateTo?: Date
}

export interface TaskWithUsers extends Task {
  assignedUser?: {
    id: string
    name: string
    email: string
  }
  createdByUser: {
    id: string
    name: string
    email: string
  }
}
