"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, CheckCircle, XCircle, AlertTriangle, FileText } from "lucide-react"

interface StatusTrackerProps {
  status: "submitted" | "under-review" | "approved" | "rejected" | "requires-action"
  lastUpdated: Date
  compact?: boolean
}

export function StatusTracker({ status, lastUpdated, compact = false }: StatusTrackerProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "submitted":
        return {
          icon: <FileText className="h-4 w-4" />,
          label: "Submitted",
          color: "bg-blue-100 text-blue-800 border-blue-200",
          description: "Application received and queued for review",
        }
      case "under-review":
        return {
          icon: <Clock className="h-4 w-4" />,
          label: "Under Review",
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          description: "Being reviewed by government officials",
        }
      case "approved":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          label: "Approved",
          color: "bg-green-100 text-green-800 border-green-200",
          description: "Application approved - QR code available",
        }
      case "rejected":
        return {
          icon: <XCircle className="h-4 w-4" />,
          label: "Rejected",
          color: "bg-red-100 text-red-800 border-red-200",
          description: "Application rejected - see notes for details",
        }
      case "requires-action":
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          label: "Action Required",
          color: "bg-orange-100 text-orange-800 border-orange-200",
          description: "Additional information or documents needed",
        }
      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          label: "Unknown",
          color: "bg-gray-100 text-gray-800 border-gray-200",
          description: "Status unknown",
        }
    }
  }

  const config = getStatusConfig(status)

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {config.icon}
        <Badge className={config.color}>{config.label}</Badge>
        <span className="text-xs text-muted-foreground">{lastUpdated.toLocaleDateString()}</span>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-2">
          {config.icon}
          <Badge className={config.color}>{config.label}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-1">{config.description}</p>
        <p className="text-xs text-muted-foreground">Last updated: {lastUpdated.toLocaleString()}</p>
      </CardContent>
    </Card>
  )
}
