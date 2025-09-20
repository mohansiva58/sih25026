"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Syringe, Plus, Calendar, Shield, CheckCircle, Clock, AlertTriangle } from "lucide-react"

const sampleVaccinations = [
  {
    id: "1",
    name: "COVID-19 Booster",
    type: "mRNA",
    manufacturer: "Pfizer-BioNTech",
    dateGiven: "2025-03-15",
    nextDue: "2026-03-15",
    status: "completed",
    location: "Kerala Health Center",
    batchNumber: "FF1234",
    providedBy: "Dr. Sarah Kumar",
    sideEffects: "Mild soreness at injection site",
    immunity: "Active"
  },
  {
    id: "2",
    name: "Influenza (Flu)",
    type: "Quadrivalent",
    manufacturer: "Sanofi",
    dateGiven: "2024-10-01",
    nextDue: "2025-10-01",
    status: "due_soon",
    location: "City Medical Center",
    batchNumber: "FL5678",
    providedBy: "Dr. Raj Menon",
    sideEffects: "None reported",
    immunity: "Waning"
  },
  {
    id: "3",
    name: "Hepatitis B",
    type: "Recombinant",
    manufacturer: "GSK",
    dateGiven: "2020-06-10",
    nextDue: "2030-06-10",
    status: "completed",
    location: "General Hospital",
    batchNumber: "HB9012",
    providedBy: "Dr. Priya Nair",
    sideEffects: "None reported",
    immunity: "Active"
  },
  {
    id: "4",
    name: "Tetanus-Diphtheria",
    type: "Td Booster",
    manufacturer: "Serum Institute",
    dateGiven: "2023-01-20",
    nextDue: "2033-01-20",
    status: "completed",
    location: "Primary Health Center",
    batchNumber: "TD3456",
    providedBy: "Dr. Anand Pillai",
    sideEffects: "Mild fever for 1 day",
    immunity: "Active"
  },
  {
    id: "5",
    name: "Pneumococcal",
    type: "PCV13",
    manufacturer: "Pfizer",
    dateGiven: null,
    nextDue: "2025-12-01",
    status: "recommended",
    location: null,
    batchNumber: null,
    providedBy: null,
    sideEffects: null,
    immunity: "Not Vaccinated"
  }
]

export default function VaccinationsPage() {
  const [vaccinations, setVaccinations] = useState(sampleVaccinations)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "due_soon":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "recommended":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "due_soon":
        return <Clock className="h-4 w-4" />
      case "overdue":
        return <AlertTriangle className="h-4 w-4" />
      case "recommended":
        return <Syringe className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const completedCount = vaccinations.filter(v => v.status === "completed").length
  const dueCount = vaccinations.filter(v => v.status === "due_soon" || v.status === "recommended").length

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not scheduled"
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Syringe className="h-8 w-8 text-blue-600" />
              Vaccination Records
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your immunization history and upcoming vaccination schedules
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Vaccination
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{completedCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Due/Recommended</p>
                  <p className="text-2xl font-bold text-yellow-600">{dueCount}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Immunity</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {vaccinations.filter(v => v.immunity === "Active").length}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Records</p>
                  <p className="text-2xl font-bold text-gray-600">{vaccinations.length}</p>
                </div>
                <Syringe className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vaccination Records */}
        <Card>
          <CardHeader>
            <CardTitle>Immunization History</CardTitle>
            <CardDescription>
              Complete record of your vaccinations and immunization schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vaccinations.map((vaccination) => (
                <div
                  key={vaccination.id}
                  className={`p-4 rounded-lg border-2 ${
                    vaccination.status === "overdue" 
                      ? "border-red-200 bg-red-50" 
                      : vaccination.status === "due_soon"
                      ? "border-yellow-200 bg-yellow-50"
                      : vaccination.status === "recommended"
                      ? "border-blue-200 bg-blue-50"
                      : "border-gray-200 bg-white"
                  } hover:shadow-md transition-all`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className={`p-3 rounded-full ${
                        vaccination.status === "completed" ? "bg-green-100" :
                        vaccination.status === "due_soon" ? "bg-yellow-100" :
                        vaccination.status === "recommended" ? "bg-blue-100" : "bg-gray-100"
                      }`}>
                        <Syringe className={`h-5 w-5 ${
                          vaccination.status === "completed" ? "text-green-600" :
                          vaccination.status === "due_soon" ? "text-yellow-600" :
                          vaccination.status === "recommended" ? "text-blue-600" : "text-gray-600"
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-semibold">{vaccination.name}</h3>
                            <p className="text-muted-foreground">
                              {vaccination.type} • {vaccination.manufacturer}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(vaccination.status)}>
                              {getStatusIcon(vaccination.status)}
                              <span className="ml-1">
                                {vaccination.status === "due_soon" ? "Due Soon" :
                                 vaccination.status.charAt(0).toUpperCase() + vaccination.status.slice(1)}
                              </span>
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-muted-foreground">Date Given</p>
                            <p className="font-semibold">{formatDate(vaccination.dateGiven)}</p>
                          </div>
                          
                          <div>
                            <p className="font-medium text-muted-foreground">Next Due</p>
                            <p className="font-semibold">{formatDate(vaccination.nextDue)}</p>
                          </div>
                          
                          <div>
                            <p className="font-medium text-muted-foreground">Immunity Status</p>
                            <p className={`font-semibold ${
                              vaccination.immunity === "Active" ? "text-green-600" :
                              vaccination.immunity === "Waning" ? "text-yellow-600" :
                              "text-gray-600"
                            }`}>
                              {vaccination.immunity}
                            </p>
                          </div>
                        </div>
                        
                        {vaccination.location && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="font-medium text-muted-foreground">Location</p>
                                <p>{vaccination.location}</p>
                              </div>
                              
                              <div>
                                <p className="font-medium text-muted-foreground">Provided By</p>
                                <p>{vaccination.providedBy}</p>
                              </div>
                              
                              <div>
                                <p className="font-medium text-muted-foreground">Batch Number</p>
                                <p className="font-mono text-xs">{vaccination.batchNumber}</p>
                              </div>
                            </div>
                            
                            {vaccination.sideEffects && (
                              <div className="mt-2">
                                <p className="font-medium text-muted-foreground text-sm">Side Effects</p>
                                <p className="text-sm">{vaccination.sideEffects}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {(vaccination.status === "due_soon" || vaccination.status === "recommended") && (
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule Now
                      </Button>
                      <Button size="sm" variant="outline">
                        More Info
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}