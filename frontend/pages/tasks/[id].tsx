"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { apiService } from "@/services/api"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useAuth } from "@/hooks/useAuth"
import type { Task, User } from "@/types"
import toast from "react-hot-toast"

const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  assignedTo: z.string().optional(),
  dueDate: z.string().optional(),
})

type UpdateTaskFormData = z.infer<typeof updateTaskSchema>

export default function EditTaskPage() {
  const [loading, setLoading] = useState(false)
  const [taskLoading, setTaskLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [task, setTask] = useState<Task | null>(null)
  const { user } = useAuth()
  const router = useRouter()
  const { id } = router.query

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateTaskFormData>({
    resolver: zodResolver(updateTaskSchema),
  })

  useEffect(() => {
    if (id) {
      fetchTask()
    }
  }, [id])

  useEffect(() => {
    if (user?.role === "admin") {
      fetchUsers()
    }
  }, [user])

  const fetchTask = async () => {
    try {
      const response = await apiService.getTask(id as string)
      if (response.success) {
        const taskData = response.data.task
        setTask(taskData)

        // Reset form with task data
        reset({
          title: taskData.title,
          description: taskData.description || "",
          status: taskData.status,
          priority: taskData.priority,
          assignedTo: taskData.assignedTo || "",
          dueDate: taskData.dueDate ? taskData.dueDate.split("T")[0] : "",
        })
      } else {
        toast.error("Task not found")
        router.push("/tasks")
      }
    } catch (error) {
      toast.error("Failed to fetch task")
      router.push("/tasks")
    } finally {
      setTaskLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await apiService.getUsers()
      if (response.success) {
        setUsers(response.data.users)
      }
    } catch (error) {
      console.error("Failed to fetch users")
    }
  }

  const onSubmit = async (data: UpdateTaskFormData) => {
    setLoading(true)
    try {
      const taskData = {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      }

      const response = await apiService.updateTask(id as string, taskData)

      if (response.success) {
        toast.success("Task updated successfully")
        router.push("/tasks")
      } else {
        toast.error(response.message || "Failed to update task")
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to update task"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (taskLoading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!task) {
    return (
      <ProtectedRoute>
        <div className="text-center py-12">
          <p className="text-gray-500">Task not found</p>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Edit Task</h1>
            <p className="mt-2 text-sm text-gray-700">Update task details</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input {...register("title")} type="text" className="mt-1 input" placeholder="Enter task title" />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className="mt-1 input"
                placeholder="Enter task description"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select {...register("status")} className="mt-1 input">
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>}
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select {...register("priority")} className="mt-1 input">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                {errors.priority && <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <input {...register("dueDate")} type="date" className="mt-1 input" />
              {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>}
            </div>

            {user?.role === "admin" && users.length > 0 && (
              <div>
                <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">
                  Assign To
                </label>
                <select {...register("assignedTo")} className="mt-1 input">
                  <option value="">Select user (optional)</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                {errors.assignedTo && <p className="mt-1 text-sm text-red-600">{errors.assignedTo.message}</p>}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button type="button" onClick={() => router.push("/tasks")} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn btn-primary disabled:opacity-50">
                {loading ? "Updating..." : "Update Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}
