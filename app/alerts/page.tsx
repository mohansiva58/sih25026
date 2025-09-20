"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Bell, Shield, Activity, CheckCircle, X, Info, AlertCircle } from "lucide-react"

const sampleAlerts = [
  {
    id: "1",
    title: "High Blood Pressure Reading",
    message: "Your recent blood pressure reading (150/95) is above normal range. Please consult your doctor.",
    type: "critical",
    category: "health-metric",
    timestamp: "2025-09-20T10:30:00Z",
    isRead: false,
    actions: ["Contact Doctor", "View Details"]
  },
  {
    id: "2", 
    title: "Medication Reminder - Overdue",
    message: "You missed your blood pressure medication scheduled for 8:00 AM today.",
    type: "warning", 
    category: "medication",
    timestamp: "2025-09-20T12:00:00Z",
    isRead: false,
    actions: ["Mark as Taken", "Reschedule"]
  },
  {
    id: "3",
    title: "Upcoming Appointment",
    message: "You have a cardiology appointment tomorrow at 2:15 PM with Dr. Raj Menon.",
    type: "info",
    category: "appointment", 
    timestamp: "2025-09-19T18:00:00Z",
    isRead: true,
    actions: ["View Details", "Set Reminder"]
  },
  {
    id: "4",
    title: "Health Record Updated",
    message: "Your blood test results from City Diagnostic Center have been added to your health records.",
    type: "success",
    category: "record",
    timestamp: "2025-09-19T14:22:00Z", 
    isRead: false,
    actions: ["View Results"]
  },
  {
    id: "5",
    title: "System Maintenance Notice",
    message: "Scheduled maintenance on September 25th from 12:00 AM to 2:00 AM. Services may be temporarily unavailable.",
    type: "info",
    category: "system",
    timestamp: "2025-09-18T09:00:00Z",
    isRead: true,
    actions: ["More Info"]
  }
]

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(sampleAlerts)
  const [filter, setFilter] = useState("all")

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-5 w-5" />
      case "warning": 
        return <AlertCircle className="h-5 w-5" />
      case "info":
        return <Info className="h-5 w-5" />
      case "success":
        return <CheckCircle className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-50 border-red-200 text-red-800"
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800"
      case "success":
        return "bg-green-50 border-green-200 text-green-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "info":
        return "bg-blue-100 text-blue-800"
      case "success":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const markAsRead = (id: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, isRead: true } : alert
    ))
  }

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id))
  }

  const filteredAlerts = alerts.filter(alert => {
    if (filter === "all") return true
    if (filter === "unread") return !alert.isRead
    return alert.type === filter
  })

  const unreadCount = alerts.filter(alert => !alert.isRead).length
  const criticalCount = alerts.filter(alert => alert.type === "critical").length

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              Health Alerts
            </h1>
            <p className="text-muted-foreground mt-2">
              Stay informed about your health status and important notifications
            </p>
          </div>
          <Button variant="outline" onClick={() => setAlerts(alerts.map(a => ({ ...a, isRead: true })))}>
            Mark All as Read
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Alerts</p>
                  <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
                </div>
                <Bell className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Unread</p>
                  <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Critical</p>
                  <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold text-green-600">{alerts.length}</p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2 flex-wrap">
              {["all", "unread", "critical", "warning", "info", "success"].map((filterType) => (
                <Button
                  key={filterType}
                  variant={filter === filterType ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(filterType)}
                  className={filter === filterType ? "bg-blue-600 hover:bg-blue-700" : ""}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Notifications</CardTitle>
            <CardDescription>
              Review and manage your health-related alerts and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">No alerts found</h3>
                  <p className="text-muted-foreground">
                    {filter === "all" ? "You're all caught up!" : `No ${filter} alerts at this time.`}
                  </p>
                </div>
              ) : (
                filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-2 ${getAlertColor(alert.type)} ${
                      !alert.isRead ? "border-l-4" : ""
                    } transition-all hover:shadow-md`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3 flex-1">
                        <div className={`p-2 rounded-full ${
                          alert.type === "critical" ? "bg-red-100" :
                          alert.type === "warning" ? "bg-yellow-100" :
                          alert.type === "success" ? "bg-green-100" : "bg-blue-100"
                        }`}>
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className={`font-semibold ${!alert.isRead ? "font-bold" : ""}`}>
                              {alert.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <Badge className={getBadgeColor(alert.type)}>
                                {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                              </Badge>
                              {!alert.isRead && (
                                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                              )}
                            </div>
                          </div>
                          
                          <p className={`text-sm mb-3 ${!alert.isRead ? "font-medium" : ""}`}>
                            {alert.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(alert.timestamp)}
                            </span>
                            
                            <div className="flex gap-2">
                              {alert.actions.map((action, index) => (
                                <Button key={index} size="sm" variant="outline" className="text-xs">
                                  {action}
                                </Button>
                              ))}
                              
                              {!alert.isRead && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => markAsRead(alert.id)}
                                  className="text-xs"
                                >
                                  Mark as Read
                                </Button>
                              )}
                              
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => dismissAlert(alert.id)}
                                className="text-xs hover:text-red-600"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}