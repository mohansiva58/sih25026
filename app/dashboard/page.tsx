"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  QrCode,
  Clock,
  CheckCircle,
  XCircle,
  Upload,
  Bot,
  Bell,
  Calendar,
  Activity,
  Heart,
  Thermometer,
  Droplets,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import {
  sampleUser,
  sampleHealthRecords,
  sampleAppointments,
  sampleReminders,
  sampleHealthMetrics,
} from "@/lib/sample-data"

export default function DashboardPage() {
  const { user } = useAuth()

  const currentUser = sampleUser
  const recentRecords = sampleHealthRecords.slice(0, 3)
  const upcomingAppointments = sampleAppointments.filter((apt) => apt.status === "confirmed").slice(0, 2)
  const activeReminders = sampleReminders.filter((rem) => rem.isActive).slice(0, 3)
  const latestMetrics = sampleHealthMetrics[0]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return CheckCircle
      case "rejected":
        return XCircle
      default:
        return Clock
    }
  }

  const StatusIcon = getStatusIcon(currentUser.approvalStatus)

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {currentUser.displayName}!</h1>
          <p className="text-muted-foreground">Manage your health records and track your wellness journey</p>
        </div>

        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <StatusIcon className="h-5 w-5" />
                  Kerala Entry Approval Status
                </CardTitle>
                <CardDescription>Current status of your health clearance application</CardDescription>
              </div>
              <Badge className={getStatusColor(currentUser.approvalStatus)}>
                {currentUser.approvalStatus.charAt(0).toUpperCase() + currentUser.approvalStatus.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {currentUser.approvalStatus === "approved" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  ✅ Congratulations! Your health clearance has been approved for entry into Kerala.
                </p>
                <p className="text-green-700 text-sm mt-1">
                  You can now travel freely within Kerala. Keep your QR code handy for verification.
                </p>
              </div>
            )}
            {currentUser.approvalStatus === "pending" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  Your application is under review by the Kerala Health Department. You will be notified once the review
                  is complete.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Upload Documents</h3>
              <p className="text-sm text-muted-foreground mb-4">Add health reports and certificates</p>
              <Link href="/health/upload">
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Upload
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <QrCode className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">My QR Code</h3>
              <p className="text-sm text-muted-foreground mb-4">Access your health QR codes</p>
              <Link href="/qr-codes">
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  View QR
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">AI Health Assistant</h3>
              <p className="text-sm text-muted-foreground mb-4">Get personalized health insights</p>
              <Link href="/ai-assistant">
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Ask AI
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Appointments</h3>
              <p className="text-sm text-muted-foreground mb-4">Schedule and manage appointments</p>
              <Link href="/appointments">
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Schedule
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                Blood Pressure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestMetrics.bloodPressure.systolic}/{latestMetrics.bloodPressure.diastolic}
              </div>
              <p className="text-xs text-muted-foreground">mmHg - Normal range</p>
              <Progress value={75} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                Heart Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestMetrics.heartRate}</div>
              <p className="text-xs text-muted-foreground">bpm - Healthy</p>
              <Progress value={80} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-orange-500" />
                Temperature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestMetrics.temperature}°F</div>
              <p className="text-xs text-muted-foreground">Normal body temperature</p>
              <Progress value={60} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                Blood Sugar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestMetrics.bloodSugar}</div>
              <p className="text-xs text-muted-foreground">mg/dL - Normal</p>
              <Progress value={70} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Appointments
              </CardTitle>
              <CardDescription>Your scheduled medical appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{appointment.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.date} at {appointment.time}
                      </p>
                      <p className="text-sm text-muted-foreground">Dr. {appointment.doctor}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
                <Link href="/appointments">
                  <Button variant="outline" className="w-full bg-transparent">
                    View All Appointments
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Recent Health Activity
              </CardTitle>
              <CardDescription>Your latest health record updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRecords.map((record) => (
                  <div key={record.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{record.type}</p>
                      <p className="text-sm text-muted-foreground">{record.hospital}</p>
                      <p className="text-sm text-muted-foreground">{record.date}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {record.results}
                    </Badge>
                  </div>
                ))}
                <Link href="/health/records">
                  <Button variant="outline" className="w-full bg-transparent">
                    View All Records
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Active Reminders
            </CardTitle>
            <CardDescription>Your health reminders and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeReminders.map((reminder) => (
                <div key={reminder.id} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Bell className="h-4 w-4 text-orange-500" />
                    <span className="font-medium text-sm">{reminder.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{reminder.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{reminder.time}</span>
                    <Badge variant="outline" className="text-xs">
                      {reminder.frequency}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/reminders">
                <Button variant="outline" className="w-full bg-transparent">
                  Manage All Reminders
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
