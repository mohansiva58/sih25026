"use client"

import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle } from "lucide-react"

export function AuthStatus() {
  const { isFirebaseConfigured } = useAuth()

  if (isFirebaseConfigured) {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        Firebase Connected
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
      <AlertCircle className="w-3 h-3 mr-1" />
      Demo Mode
    </Badge>
  )
}