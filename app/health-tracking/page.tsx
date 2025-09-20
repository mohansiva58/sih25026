"use client"

import { useState, useMemo, memo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, Heart, Thermometer, Droplets, Scale, TrendingUp, TrendingDown, Plus, Calendar } from "lucide-react"

const sampleMetrics = [
  {
    id: "1",
    name: "Blood Pressure",
    value: "120/80",
    unit: "mmHg",
    status: "normal",
    lastUpdated: "2025-09-20",
    trend: "stable",
    icon: Heart,
    target: "< 120/80",
    history: [
      { date: "2025-09-20", systolic: 120, diastolic: 80 },
      { date: "2025-09-19", systolic: 118, diastolic: 78 }
    ]
  },
  {
    id: "2",
    name: "Heart Rate", 
    value: "72",
    unit: "bpm",
    status: "normal",
    lastUpdated: "2025-09-20",
    trend: "down",
    icon: Activity,
    target: "60-100 bpm",
    history: [
      { date: "2025-09-20", value: 72 },
      { date: "2025-09-19", value: 75 }
    ]
  },
  {
    id: "3",
    name: "Body Temperature",
    value: "98.6",
    unit: "°F",
    status: "normal",
    lastUpdated: "2025-09-20",
    trend: "stable",
    icon: Thermometer,
    target: "97.8-99.1°F",
    history: [
      { date: "2025-09-20", value: 98.6 },
      { date: "2025-09-19", value: 98.4 },
      { date: "2025-09-18", value: 98.7 },
      { date: "2025-09-17", value: 98.5 },
      { date: "2025-09-16", value: 98.6 }
    ]
  },
  {
    id: "4",
    name: "Blood Sugar",
    value: "95",
    unit: "mg/dL",
    status: "normal",
    lastUpdated: "2025-09-20",
    trend: "up",
    icon: Droplets,
    target: "70-100 mg/dL",
    history: [
      { date: "2025-09-20", value: 95 },
      { date: "2025-09-19", value: 92 },
      { date: "2025-09-18", value: 89 },
      { date: "2025-09-17", value: 91 },
      { date: "2025-09-16", value: 88 }
    ]
  },
  {
    id: "5",
    name: "Weight",
    value: "70.5",
    unit: "kg",
    status: "normal",
    lastUpdated: "2025-09-19",
    trend: "down",
    icon: Scale,
    target: "65-75 kg",
    history: [
      { date: "2025-09-19", value: 70.5 },
      { date: "2025-09-17", value: 70.8 },
      { date: "2025-09-15", value: 71.0 },
      { date: "2025-09-13", value: 71.2 },
      { date: "2025-09-11", value: 71.5 }
    ]
  }
]

const weeklyGoals = [
  { name: "Daily Steps", current: 8750, target: 10000, unit: "steps" },
  { name: "Exercise Minutes", current: 180, target: 150, unit: "min" },
  { name: "Water Intake", current: 6.5, target: 8, unit: "glasses" },
  { name: "Sleep Hours", current: 7.2, target: 8, unit: "hours" }
]

function HealthTrackingPage() {
  const [selectedMetric, setSelectedMetric] = useState(sampleMetrics[0])

  // Memoized metric calculations
  const metricStats = useMemo(() => {
    const normal = sampleMetrics.filter(m => m.status === "normal").length
    const warning = sampleMetrics.filter(m => m.status === "warning").length  
    const critical = sampleMetrics.filter(m => m.status === "critical").length
    
    return { normal, warning, critical, total: sampleMetrics.length }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case "stable":
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />
      default:
        return null
    }
  }

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Activity className="h-8 w-8 text-blue-600" />
              Health Tracking
            </h1>
            <p className="text-muted-foreground mt-2">
              Monitor your vital signs and track your wellness progress
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Reading
          </Button>
        </div>

        {/* Weekly Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Health Goals</CardTitle>
            <CardDescription>
              Track your progress towards weekly wellness targets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {weeklyGoals.map((goal, index) => {
                const progress = calculateProgress(goal.current, goal.target)
                const isCompleted = goal.current >= goal.target
                
                return (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{goal.name}</h4>
                      {isCompleted && (
                        <Badge className="bg-green-100 text-green-800">
                          Complete
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Progress value={progress} className="h-2" />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{goal.current} {goal.unit}</span>
                        <span>{goal.target} {goal.unit}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Vital Signs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {sampleMetrics.map((metric) => {
            const Icon = metric.icon
            return (
              <Card 
                key={metric.id}
                className={`cursor-pointer transition-colors ${
                  selectedMetric.id === metric.id ? "border-blue-500 bg-blue-50" : "hover:border-gray-300"
                }`}
                onClick={() => setSelectedMetric(metric)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-full ${
                      metric.status === "normal" ? "bg-green-100" : 
                      metric.status === "warning" ? "bg-yellow-100" : "bg-red-100"
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        metric.status === "normal" ? "text-green-600" : 
                        metric.status === "warning" ? "text-yellow-600" : "text-red-600"
                      }`} />
                    </div>
                    {getTrendIcon(metric.trend)}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm">{metric.name}</h3>
                    <p className="text-2xl font-bold">
                      {metric.value} <span className="text-sm text-muted-foreground">{metric.unit}</span>
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(metric.status)}>
                        {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(metric.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Detailed View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Selected Metric Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <selectedMetric.icon className="h-5 w-5" />
                {selectedMetric.name} Details
              </CardTitle>
              <CardDescription>
                Current reading and target range information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Reading</p>
                  <p className="text-2xl font-bold">
                    {selectedMetric.value} {selectedMetric.unit}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Target Range</p>
                  <p className="text-lg font-semibold">{selectedMetric.target}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(selectedMetric.status)}>
                    {selectedMetric.status.charAt(0).toUpperCase() + selectedMetric.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trend</p>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(selectedMetric.trend)}
                    <span className="text-sm font-medium">{selectedMetric.trend}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Last Updated</p>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(selectedMetric.lastUpdated).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button size="sm" className="flex-1">
                  Add New Reading
                </Button>
                <Button size="sm" variant="outline">
                  View History
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Readings</CardTitle>
              <CardDescription>
                {selectedMetric.name} history for the past 5 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedMetric.history.map((reading, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">
                        {new Date(reading.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(reading.date).toLocaleDateString('en-US', {
                          weekday: 'short'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {'systolic' in reading && 'diastolic' in reading 
                          ? `${reading.systolic}/${reading.diastolic}` 
                          : reading.value
                        } {selectedMetric.unit}
                      </p>
                      {index === 0 && (
                        <Badge variant="outline" className="text-xs">
                          Latest
                        </Badge>
                      )}
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

export default memo(HealthTrackingPage)