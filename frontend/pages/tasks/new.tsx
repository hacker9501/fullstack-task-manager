"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { apiService } from "@/services/api"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useAuth } from "@/hooks/useAuth"
import type { User } from "@/types"
import toast from "react-hot-toast"

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  assignedTo: z.string().optional(),
  dueDate: z.string().optional(),
})

type CreateTaskFormData = z.infer<typeof createTaskSchema>

export default function NewTaskPage() {
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const { user } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      priority: "medium",
    },
  })

  useEffect(() => {
    if (user?.role === "admin") {
      fetchUsers()
    }
  }, [user])

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

  const onSubmit = async (data: CreateTaskFormData) => {
    setLoading(true)
    try {
      const taskData = {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      }

      const response = await apiService.createTask(taskData)

      if (response.success) {
        toast.success("Task created successfully")
        router.push("/tasks")
      } else {
        toast.error(response.message || "Failed to create task")
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to create task"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Create New Task</h1>
            <p className="mt-2 text-sm text-gray-700">Fill in the details to create a new task</p>
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

              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input {...register("dueDate")} type="date" className="mt-1 input" />
                {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>}
              </div>
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
                {loading ? "Creating..." : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}
