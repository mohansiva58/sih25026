"use client"

import { useState, useMemo, useCallback, memo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Home,
  User,
  Upload,
  FileText,
  QrCode,
  Bell,
  Bot,
  Calendar,
  AlertTriangle,
  Syringe,
  Activity,
  Heart,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Clock,
  MessageSquare,
  Pill,
  Stethoscope,
  Phone,
} from "lucide-react"

const navigationItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "My Profile", href: "/profile", icon: User },
  { name: "Upload Documents", href: "/health/upload", icon: Upload },
  { name: "Health Records", href: "/health/records", icon: FileText },
  { name: "My QR Code", href: "/qr-codes", icon: QrCode },
  { name: "Reminders", href: "/reminders", icon: Bell },
  { name: "AI Support", href: "/ai-assistant", icon: Bot },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Alerts", href: "/alerts", icon: AlertTriangle },
  { name: "Vaccinations", href: "/vaccinations", icon: Syringe },
  { name: "Health Tracking", href: "/health-tracking", icon: Activity },
  { name: "Medications", href: "/medications", icon: Pill },
  { name: "Emergency", href: "/emergency", icon: Phone },
  { name: "Chat History", href: "/chat-history", icon: MessageSquare },
]

const adminItems = [
  { name: "Admin Dashboard", href: "/admin", icon: Shield },
  { name: "Migration Requests", href: "/admin/migration-requests", icon: Clock },
  { name: "User Management", href: "/admin/users", icon: User },
  { name: "System Health", href: "/admin/system", icon: Stethoscope },
]

interface SidebarNavigationProps {
  className?: string
}

export const SidebarNavigation = memo(function SidebarNavigation({ className }: SidebarNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Memoize admin check to prevent recalculation
  const isAdmin = useMemo(() => user?.email === "admin@kerala.gov.in", [user?.email])
  
  // Memoize navigation items to prevent array recreation
  const items = useMemo(() => 
    isAdmin ? [...navigationItems, ...adminItems] : navigationItems, 
    [isAdmin]
  )

  // Memoize logout handler
  const handleLogout = useCallback(async () => {
    await logout()
    setIsOpen(false)
  }, [logout])

  // Memoize close handler
  const handleClose = useCallback(() => setIsOpen(false), [])

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={handleClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-72 bg-white text-gray-900 transform transition-transform duration-300 ease-in-out border-r border-gray-200 shadow-lg",
          "md:translate-x-0", // Always visible on medium screens and up
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0", // Toggle on mobile, always visible on desktop
          className,
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Kerala Health</h1>
                <p className="text-sm text-gray-600">Digital Records</p>
              </div>
            </div>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-gray-900">{user.displayName || user.email}</p>
                  <p className="text-sm text-gray-600 truncate">{user.email}</p>
                </div>
                {isAdmin && (
                  <Badge variant="secondary" className="bg-emerald-600 text-white">
                    Admin
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-3">
              {items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive ? "bg-emerald-600 text-white" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="space-y-2">
              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>

            {/* Get the App Button */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-white border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white"
              >
                <Phone className="h-4 w-4 mr-2" />
                Get the App
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
})
