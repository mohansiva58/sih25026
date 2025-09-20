"use client"

import { useState, useMemo, memo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, User, Plus, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

const sampleAppointments = [
  {
    id: "1",
    title: "General Checkup",
    doctor: "Dr. Sarah Kumar",
    specialty: "General Medicine",
    date: "2025-09-22",
    time: "10:30 AM",
    duration: "30 minutes",
    location: "Kerala General Hospital",
    address: "MG Road, Kochi",
    status: "confirmed",
    type: "in-person"
  },
  {
    id: "2", 
    title: "Cardiology Consultation",
    doctor: "Dr. Raj Menon",
    specialty: "Cardiology",
    date: "2025-09-25",
    time: "02:15 PM", 
    duration: "45 minutes",
    location: "Heart Care Center",
    address: "Marine Drive, Ernakulam",
    status: "confirmed",
    type: "in-person"
  },
  {
    id: "3",
    title: "Follow-up Consultation",
    doctor: "Dr. Priya Nair",
    specialty: "Endocrinology",
    date: "2025-09-28",
    time: "11:00 AM",
    duration: "20 minutes", 
    location: "Telemedicine",
    address: "Virtual Consultation",
    status: "pending",
    type: "virtual"
  },
  {
    id: "4",
    title: "Blood Test Results",
    doctor: "Dr. Anand Pillai", 
    specialty: "Pathology",
    date: "2025-09-18",
    time: "09:00 AM",
    duration: "15 minutes",
    location: "City Diagnostic Center", 
    address: "Palarivattom, Kochi",
    status: "completed",
    type: "in-person"
  }
]

function AppointmentsPage() {
  const [appointments, setAppointments] = useState(sampleAppointments)
  const [searchTerm, setSearchTerm] = useState("")

  // Memoized filtered appointments for better performance
  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment =>
      appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [appointments, searchTerm])

  // Memoized stats
  const appointmentStats = useMemo(() => {
    const today = appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0])
    const upcoming = appointments.filter(apt => new Date(apt.date) > new Date())
    const completed = appointments.filter(apt => apt.status === "completed")
    
    return { 
      today: today.length,
      upcoming: upcoming.length, 
      completed: completed.length,
      total: appointments.length
    }
  }, [appointments])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    return type === "virtual" 
      ? "bg-purple-100 text-purple-800"
      : "bg-blue-100 text-blue-800"
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              Medical Appointments
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your medical appointments and consultations
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Book Appointment
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold text-blue-600">{appointmentStats.upcoming}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold text-green-600">{appointmentStats.total}</p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-gray-600">{appointmentStats.completed}</p>
                </div>
                <User className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Virtual</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {appointments.filter(apt => apt.type === "virtual").length}
                  </p>
                </div>
                <MapPin className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search appointments, doctors, or specialties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Appointments</CardTitle>
            <CardDescription>
              Manage and track your medical appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-start justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors"
                >
                  <div className="flex gap-4">
                    <div className="p-3 rounded-full bg-blue-100">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <div>
                        <h3 className="font-semibold text-lg">{appointment.title}</h3>
                        <p className="text-muted-foreground">
                          with {appointment.doctor} • {appointment.specialty}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(appointment.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {appointment.time} ({appointment.duration})
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {appointment.location}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {appointment.address}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </Badge>
                      <Badge variant="outline" className={getTypeColor(appointment.type)}>
                        {appointment.type === "virtual" ? "Virtual" : "In-Person"}
                      </Badge>
                    </div>
                    
                    {appointment.status === "confirmed" && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Reschedule
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default memo(AppointmentsPage)