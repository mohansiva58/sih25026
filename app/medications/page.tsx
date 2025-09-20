"use client"

import { useState, useMemo, memo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Pill, Plus, Clock, AlertCircle, CheckCircle, Calendar, Bell } from "lucide-react"

// Optimized minimal sample data for faster loading
const sampleMedications = [
  {
    id: "1",
    name: "Lisinopril",
    type: "ACE Inhibitor",
    dosage: "10mg",
    frequency: "Once daily",
    status: "active",
    adherence: 95,
    refillDate: "2025-10-15",
    pillsRemaining: 28
  },
  {
    id: "2", 
    name: "Metformin",
    type: "Biguanide",
    dosage: "500mg",
    frequency: "Twice daily",
    status: "active",
    adherence: 88,
    refillDate: "2025-09-25",
    pillsRemaining: 8
  }
]

const todayReminders = [
  { id: "1", medication: "Lisinopril 10mg", time: "08:00", taken: true },
  { id: "2", medication: "Metformin 500mg", time: "08:00", taken: true },
  { id: "3", medication: "Metformin 500mg", time: "20:00", taken: false }
]

function MedicationsPage() {
  const [selectedMedication, setSelectedMedication] = useState<string | null>(null)
  
  // Memoized calculations for better performance
  const totalAdherence = useMemo(() => {
    const activeMeds = sampleMedications.filter(med => med.status === "active")
    if (activeMeds.length === 0) return 0
    const total = activeMeds.reduce((sum, med) => sum + med.adherence, 0)
    return Math.round(total / activeMeds.length)
  }, [])

  const medicationsNeedingRefill = useMemo(() => 
    sampleMedications.filter(med => med.pillsRemaining <= 10), 
    []
  )

  const getStatusBadge = (status: string) => {
    const configs = {
      active: { variant: "default" as const, text: "Active", icon: CheckCircle },
      as_needed: { variant: "secondary" as const, text: "As Needed", icon: Clock },
      completed: { variant: "outline" as const, text: "Completed", icon: CheckCircle }
    }
    
    const config = configs[status as keyof typeof configs]
    if (!config) return null
    
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Pill className="h-8 w-8 text-blue-600" />
              My Medications
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your prescriptions, dosages, and medication schedule
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Medication
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Medications</p>
                  <p className="text-2xl font-bold text-blue-600">{sampleMedications.length}</p>
                </div>
                <Pill className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Adherence Rate</p>
                  <p className="text-2xl font-bold text-green-600">{totalAdherence}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Doses</p>
                  <p className="text-2xl font-bold text-purple-600">{todayReminders.length}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Need Refill</p>
                  <p className="text-2xl font-bold text-yellow-600">{medicationsNeedingRefill.length}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Today's Schedule
              </CardTitle>
              <CardDescription>
                Your medication reminders for today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayReminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{reminder.medication}</p>
                      <p className="text-sm text-muted-foreground">{reminder.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {reminder.taken ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Taken
                        </Badge>
                      ) : (
                        <Button size="sm" variant="outline">
                          Mark Taken
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current Medications */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Current Medications
              </CardTitle>
              <CardDescription>
                All active prescriptions and supplements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sampleMedications.map((medication) => (
                  <div key={medication.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">{medication.name}</h3>
                          {getStatusBadge(medication.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{medication.type}</span>
                          <span>•</span>
                          <span>{medication.dosage}</span>
                          <span>•</span>
                          <span>{medication.frequency}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Adherence</p>
                        <div className="flex items-center gap-2">
                          <Progress value={medication.adherence} className="flex-1" />
                          <span className="text-sm font-medium">{medication.adherence}%</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Pills Remaining</p>
                        <p className={`text-lg font-semibold ${
                          medication.pillsRemaining <= 10 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {medication.pillsRemaining}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Next Refill</p>
                        <p className="text-sm">{new Date(medication.refillDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Bell className="h-4 w-4 mr-1" />
                        Set Reminder
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4 mr-1" />
                        Refill Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default memo(MedicationsPage)