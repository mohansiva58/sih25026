"use client"

import type React from "react"
import { memo } from "react"
import { useAuth } from "@/lib/auth-context"
import { SidebarNavigation } from "./sidebar-navigation"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

interface AppLayoutProps {
  children: React.ReactNode
}

const MemoizedSidebar = memo(SidebarNavigation)

function AppLayoutComponent({ children }: AppLayoutProps) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  // Pages that don't need sidebar (auth pages, landing page)
  const publicPages = ["/", "/auth/login", "/auth/register"]
  const isPublicPage = publicPages.includes(pathname)

  // Simplified redirect logic - only redirect after a short delay for better UX
  useEffect(() => {
    if (!loading && !user && !isPublicPage) {
      const timer = setTimeout(() => {
        router.push("/auth/login")
      }, 100) // Small delay to prevent flash
      return () => clearTimeout(timer)
    }
  }, [user, loading, isPublicPage, router, pathname])

  // Minimal loading spinner for better perceived performance
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  // Show sidebar for authenticated users on non-public pages
  if (user && !isPublicPage) {
    return (
      <div className="min-h-screen bg-background">
        <MemoizedSidebar />
        {/* Main content with proper spacing for sidebar */}
        <main className="md:ml-72 min-h-screen">
          <div className="p-4 md:p-6 pt-16 md:pt-6">
            {children}
          </div>
        </main>
      </div>
    )
  }

  // Public pages without sidebar
  return <div className="min-h-screen bg-background">{children}</div>
}

export const AppLayout = memo(AppLayoutComponent)
