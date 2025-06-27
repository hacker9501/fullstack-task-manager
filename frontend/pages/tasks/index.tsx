"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import type { Task } from "@/types"
import { apiService } from "@/services/api"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useAuth } from "@/hooks/useAuth"
import toast from "react-hot-toast"
import { format } from "date-fns"
import Link from "next/link"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    fetchTasks()
  }, [filter])

  const fetchTasks = async () => {
    try {
      const filters = filter !== "all" ? { status: filter } : {}
      const response = await apiService.getTasks(filters)

      if (response.success) {
        setTasks(response.data.tasks)
      }
    } catch (error) {
      toast.error("Failed to fetch tasks")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return
    }

    try {
      const response = await apiService.deleteTask(taskId)
      if (response.success) {
        setTasks(tasks.filter((task) => task.id !== taskId))
        toast.success("Task deleted successfully")
      }
    } catch (error) {
      toast.error("Failed to delete task")
    }
  }

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const response = await apiService.updateTask(taskId, { status: newStatus })
      if (response.success) {
        setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus as Task["status"] } : task)))
        toast.success("Task status updated")
      }
    } catch (error) {
      toast.error("Failed to update task status")
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
            <p className="mt-2 text-sm text-gray-700">Manage your tasks and track progress</p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link href="/tasks/new" className="btn btn-primary">
              Add Task
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6">
          <div className="flex space-x-4">
            {["all", "pending", "in_progress", "completed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  filter === status ? "bg-primary-100 text-primary-700" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {status === "all" ? "All" : status.replace("_", " ").toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks List */}
        <div className="mt-8 flow-root">
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No tasks found</p>
              <Link href="/tasks/new" className="mt-4 btn btn-primary">
                Create your first task
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[task.status]}`}
                        >
                          {task.status.replace("_", " ")}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      {task.description && <p className="mt-2 text-sm text-gray-600">{task.description}</p>}
                      <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Created by: {task.createdByUser.name}</span>
                        {task.assignedUser && <span>Assigned to: {task.assignedUser.name}</span>}
                        <span>Created: {format(new Date(task.createdAt), "MMM dd, yyyy")}</span>
                        {task.dueDate && <span>Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}</span>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* Status dropdown */}
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded-md px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <Link
                        href={`/tasks/${task.id}`}
                        className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                      >
                        Edit
                      </Link>

                      {(user?.role === "admin" || task.createdBy === user?.id) && (
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
