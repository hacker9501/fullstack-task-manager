"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"
import { useRouter } from "next/router"

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/tasks" className="text-xl font-bold text-primary-600">
                TaskManager
              </Link>
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/tasks"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    router.pathname === "/tasks"
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Tasks
                </Link>
                <Link
                  href="/tasks/new"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    router.pathname === "/tasks/new"
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  New Task
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
              <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">{user?.role}</span>
              <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
