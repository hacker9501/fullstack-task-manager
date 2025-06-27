import mongoose, { Schema, type Document } from "mongoose"
import { type Task, TaskStatus, TaskPriority } from "@/domain/entities/task"

export interface TaskDocument extends Omit<Task, "id">, Document {
  _id: mongoose.Types.ObjectId
}

const taskSchema = new Schema<TaskDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.PENDING,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dueDate: {
      type: Date,
      required: false,
    },
    completedAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        return ret
      },
    },
  },
)

// Indexes
taskSchema.index({ status: 1 })
taskSchema.index({ priority: 1 })
taskSchema.index({ assignedTo: 1 })
taskSchema.index({ createdBy: 1 })
taskSchema.index({ dueDate: 1 })
taskSchema.index({ createdAt: -1 })

export const TaskModel = mongoose.model<TaskDocument>("Task", taskSchema)
