"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LanguageSelector } from "@/components/language-selector"
import { Heart, Clock, CheckCircle, XCircle, AlertTriangle, FileText, QrCode, Bell, Calendar, User } from "lucide-react"
import Link from "next/link"

interface StatusUpdate {
  id: string
  timestamp: Date
  status: "submitted" | "under-review" | "approved" | "rejected" | "requires-action"
  message: string
  details?: string
}

interface ApplicationStatus {
  id: string
  currentStatus: "submitted" | "under-review" | "approved" | "rejected" | "requires-action"
  submittedDate: Date
  lastUpdated: Date
  reviewerNotes?: string
  qrCodeGenerated: boolean
  documentsComplete: boolean
  updates: StatusUpdate[]
}

export default function StatusTrackingPage() {
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<StatusUpdate[]>([])

  useEffect(() => {
    // Simulate fetching application status
    const fetchStatus = async () => {
      setLoading(true)
      // Mock data - in real app, fetch from Firebase
      const mockStatus: ApplicationStatus = {
        id: "KHR-2024-001234",
        currentStatus: "under-review",
        submittedDate: new Date("2024-01-15"),
        lastUpdated: new Date("2024-01-18"),
        reviewerNotes: "Additional medical documents required for verification",
        qrCodeGenerated: false,
        documentsComplete: false,
        updates: [
          {
            id: "1",
            timestamp: new Date("2024-01-15T10:30:00"),
            status: "submitted",
            message: "Application submitted successfully",
            details: "All basic information has been received",
          },
          {
            id: "2",
            timestamp: new Date("2024-01-16T14:20:00"),
            status: "under-review",
            message: "Application under government review",
            details: "Your application is being reviewed by the health department",
          },
          {
            id: "3",
            timestamp: new Date("2024-01-18T09:15:00"),
            status: "requires-action",
            message: "Additional documents required",
            details: "Please upload recent blood test reports and vaccination certificate",
          },
        ],
      }

      setApplicationStatus(mockStatus)
      setNotifications(mockStatus.updates.slice(-2)) // Show last 2 updates as notifications
      setLoading(false)
    }

    fetchStatus()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "under-review":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "requires-action":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "under-review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "requires-action":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "submitted":
        return "Submitted"
      case "under-review":
        return "Under Review"
      case "approved":
        return "Approved"
      case "rejected":
        return "Rejected"
      case "requires-action":
        return "Action Required"
      default:
        return "Unknown"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading application status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Kerala Health Records</h1>
              <p className="text-sm text-muted-foreground">Application Status</p>
            </div>
          </Link>
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Application Status</h2>
            <p className="text-muted-foreground">Track your health record application progress in real-time</p>
          </div>

          {/* Notifications */}
          {notifications.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Updates
              </h3>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <Alert key={notification.id} className="border-blue-200 bg-blue-50">
                    <Bell className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{notification.message}</p>
                          {notification.details && <p className="text-sm mt-1">{notification.details}</p>}
                        </div>
                        <span className="text-xs text-blue-600">{notification.timestamp.toLocaleDateString()}</span>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          )}

          {applicationStatus && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Current Status */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Application Overview
                    </CardTitle>
                    <CardDescription>Application ID: {applicationStatus.id}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Current Status */}
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(applicationStatus.currentStatus)}
                        <div>
                          <p className="font-semibold">Current Status</p>
                          <p className="text-sm text-muted-foreground">
                            Last updated: {applicationStatus.lastUpdated.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(applicationStatus.currentStatus)}>
                        {getStatusText(applicationStatus.currentStatus)}
                      </Badge>
                    </div>

                    {/* Reviewer Notes */}
                    {applicationStatus.reviewerNotes && (
                      <Alert className="border-orange-200 bg-orange-50">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <AlertDescription className="text-orange-800">
                          <p className="font-medium">Reviewer Notes:</p>
                          <p className="mt-1">{applicationStatus.reviewerNotes}</p>
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Progress Timeline */}
                    <div>
                      <h4 className="font-semibold mb-4">Application Timeline</h4>
                      <div className="space-y-4">
                        {applicationStatus.updates.map((update, index) => (
                          <div key={update.id} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              {getStatusIcon(update.status)}
                              {index < applicationStatus.updates.length - 1 && (
                                <div className="w-px h-8 bg-border mt-2"></div>
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium">{update.message}</p>
                                <Badge variant="outline" className="text-xs">
                                  {getStatusText(update.status)}
                                </Badge>
                              </div>
                              {update.details && <p className="text-sm text-muted-foreground mb-2">{update.details}</p>}
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {update.timestamp.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Manage your application</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {applicationStatus.currentStatus === "requires-action" && (
                      <Link href="/health/upload">
                        <Button className="w-full justify-start">
                          <FileText className="h-4 w-4 mr-2" />
                          Upload Documents
                        </Button>
                      </Link>
                    )}

                    {applicationStatus.currentStatus === "approved" && applicationStatus.qrCodeGenerated && (
                      <Link href="/qr-codes">
                        <Button className="w-full justify-start">
                          <QrCode className="h-4 w-4 mr-2" />
                          View QR Code
                        </Button>
                      </Link>
                    )}

                    <Link href="/dashboard">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <User className="h-4 w-4 mr-2" />
                        Back to Dashboard
                      </Button>
                    </Link>

                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Bell className="h-4 w-4 mr-2" />
                      Notification Settings
                    </Button>
                  </CardContent>
                </Card>

                {/* Application Details */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Application Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Submitted:</span>
                      <span>{applicationStatus.submittedDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Documents:</span>
                      <Badge variant={applicationStatus.documentsComplete ? "default" : "secondary"}>
                        {applicationStatus.documentsComplete ? "Complete" : "Incomplete"}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">QR Code:</span>
                      <Badge variant={applicationStatus.qrCodeGenerated ? "default" : "secondary"}>
                        {applicationStatus.qrCodeGenerated ? "Generated" : "Pending"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
