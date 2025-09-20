"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Plus, Calendar, Clock, Pill, Activity, CheckCircle, AlertTriangle } from "lucide-react"

const sampleReminders = [
  {
    id: "1",
    title: "Take Blood Pressure Medication",
    type: "medication",
    time: "08:00 AM",
    frequency: "Daily",
    status: "active",
    nextDue: "Today",
    icon: Pill
  },
  {
    id: "2",
    title: "Doctor Appointment - Cardiology",
    type: "appointment",
    time: "02:30 PM",
    frequency: "One-time",
    status: "upcoming",
    nextDue: "Tomorrow",
    icon: Calendar
  },
  {
    id: "3",
    title: "Weekly Weight Check",
    type: "health-check",
    time: "07:00 AM",
    frequency: "Weekly",
    status: "active",
    nextDue: "Monday",
    icon: Activity
  },
  {
    id: "4",
    title: "Flu Vaccination Due",
    type: "vaccination",
    time: "Any time",
    frequency: "Yearly",
    status: "overdue",
    nextDue: "3 days ago",
    icon: AlertTriangle
  }
]

export default function RemindersPage() {
  const [reminders, setReminders] = useState(sampleReminders)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800"
      case "upcoming":
        return "bg-green-100 text-green-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const markCompleted = (id: string) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, status: "completed" } : r
    ))
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Bell className="h-8 w-8 text-blue-600" />
              Health Reminders
            </h1>
            <p className="text-muted-foreground mt-2">
              Stay on top of your medications, appointments, and health checkups
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Reminder
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {reminders.filter(r => r.status === "active").length}
                  </p>
                </div>
                <Bell className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold text-green-600">
                    {reminders.filter(r => r.status === "upcoming").length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">
                    {reminders.filter(r => r.status === "overdue").length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {reminders.filter(r => r.status === "completed").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reminders List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Reminders</CardTitle>
            <CardDescription>
              Manage your health reminders and track completion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reminders.map((reminder) => {
                const Icon = reminder.icon
                return (
                  <div
                    key={reminder.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      reminder.status === "overdue" 
                        ? "border-red-200 bg-red-50" 
                        : reminder.status === "completed"
                        ? "border-gray-200 bg-gray-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${
                        reminder.status === "overdue" 
                          ? "bg-red-100" 
                          : reminder.status === "completed"
                          ? "bg-gray-100"
                          : "bg-blue-100"
                      }`}>
                        <Icon className={`h-5 w-5 ${
                          reminder.status === "overdue" 
                            ? "text-red-600" 
                            : reminder.status === "completed"
                            ? "text-gray-600"
                            : "text-blue-600"
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{reminder.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {reminder.time}
                          </span>
                          <span>•</span>
                          <span>{reminder.frequency}</span>
                          <span>•</span>
                          <span>Next: {reminder.nextDue}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(reminder.status)}>
                        {reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1)}
                      </Badge>
                      {reminder.status !== "completed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markCompleted(reminder.id)}
                          className="hover:bg-green-50 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark Done
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}