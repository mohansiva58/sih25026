"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LanguageSelector } from "@/components/language-selector"
import {
  Heart,
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"

interface ApplicationDetails {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  aadhaarNumber: string
  dateOfBirth: string
  gender: string
  address: string
  emergencyContact: string
  preferredLanguage: string
  submissionDate: string
  status: "pending" | "approved" | "rejected"
  priority: "high" | "medium" | "low"
  reviewNotes?: string
  documents: Array<{
    id: string
    type: string
    name: string
    description: string
    uploadDate: string
    files: Array<{
      name: string
      type: string
      size: number
      url: string
    }>
  }>
  healthInfo: {
    symptoms?: string
    medications?: string
    medicalHistory?: string
  }
}

export default function ApplicationDetailsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [application, setApplication] = useState<ApplicationDetails | null>(null)
  const [reviewNotes, setReviewNotes] = useState("")
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    // Mock data for demonstration
    const mockApplication: ApplicationDetails = {
      id: params.id as string,
      fullName: "Rajesh Kumar",
      email: "rajesh.kumar@email.com",
      phoneNumber: "+91 9876543210",
      aadhaarNumber: "1234-5678-9012",
      dateOfBirth: "1985-06-15",
      gender: "male",
      address: "123 Main Street, Village Name, District, State - 123456",
      emergencyContact: "+91 9876543211",
      preferredLanguage: "hi",
      submissionDate: "2024-01-20",
      status: "pending",
      priority: "high",
      documents: [
        {
          id: "doc-1",
          type: "blood-test",
          name: "Blood Test Results",
          description: "Complete Blood Count and Lipid Profile",
          uploadDate: "2024-01-20",
          files: [{ name: "blood-test-results.pdf", type: "application/pdf", size: 245760, url: "#" }],
        },
        {
          id: "doc-2",
          type: "vaccination-certificate",
          name: "COVID-19 Vaccination Certificate",
          description: "Both doses completed",
          uploadDate: "2024-01-20",
          files: [{ name: "covid-vaccine-cert.jpg", type: "image/jpeg", size: 156432, url: "#" }],
        },
        {
          id: "doc-3",
          type: "health-checkup",
          name: "General Health Checkup",
          description: "Annual health checkup report",
          uploadDate: "2024-01-20",
          files: [{ name: "health-checkup.pdf", type: "application/pdf", size: 512000, url: "#" }],
        },
      ],
      healthInfo: {
        symptoms: "No current symptoms. Feeling healthy and ready for work.",
        medications: "No regular medications. Occasional paracetamol for headaches.",
        medicalHistory: "No major medical history. Had appendectomy in 2010.",
      },
    }

    setApplication(mockApplication)
    setReviewNotes(mockApplication.reviewNotes || "")
    setLoading(false)
  }, [user, router, params.id])

  const handleStatusUpdate = async (newStatus: "approved" | "rejected") => {
    if (!application) return

    setUpdating(true)
    try {
      // In real app, this would be an API call
      setApplication((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              reviewNotes: reviewNotes,
            }
          : null,
      )

      setSuccess(`Application ${newStatus} successfully!`)

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/admin")
      }, 2000)
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setUpdating(false)
    }
  }

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Application Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested application could not be found.</p>
          <Link href="/admin">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Application Review</h1>
              <p className="text-sm text-muted-foreground">{application.fullName}</p>
            </div>
          </div>
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="container mx-auto max-w-6xl">
          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Application Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Application Overview
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                      <Badge className={getPriorityColor(application.priority)}>
                        {application.priority.charAt(0).toUpperCase() + application.priority.slice(1)} Priority
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Full Name:</span>
                        <span className="text-sm">{application.fullName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Email:</span>
                        <span className="text-sm">{application.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Phone:</span>
                        <span className="text-sm">{application.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Date of Birth:</span>
                        <span className="text-sm">{new Date(application.dateOfBirth).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Aadhaar:</span>
                        <span className="text-sm">{application.aadhaarNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Gender:</span>
                        <span className="text-sm">
                          {application.gender.charAt(0).toUpperCase() + application.gender.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Emergency Contact:</span>
                        <span className="text-sm">{application.emergencyContact}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Preferred Language:</span>
                        <span className="text-sm">{application.preferredLanguage.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="text-sm font-medium">Address:</span>
                        <p className="text-sm text-muted-foreground">{application.address}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Health Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Health Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {application.healthInfo.symptoms && (
                    <div>
                      <h4 className="font-medium mb-2">Current Symptoms:</h4>
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        {application.healthInfo.symptoms}
                      </p>
                    </div>
                  )}
                  {application.healthInfo.medications && (
                    <div>
                      <h4 className="font-medium mb-2">Current Medications:</h4>
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        {application.healthInfo.medications}
                      </p>
                    </div>
                  )}
                  {application.healthInfo.medicalHistory && (
                    <div>
                      <h4 className="font-medium mb-2">Medical History:</h4>
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        {application.healthInfo.medicalHistory}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle>Uploaded Documents</CardTitle>
                  <CardDescription>Review all submitted health documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {application.documents.map((doc) => (
                      <div key={doc.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{doc.name}</h4>
                            <p className="text-sm text-muted-foreground">{doc.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {doc.type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          {doc.files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />
                                <div>
                                  <p className="text-sm font-medium">{file.name}</p>
                                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Review Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Review Actions</CardTitle>
                  <CardDescription>Make a decision on this application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reviewNotes">Review Notes</Label>
                    <Textarea
                      id="reviewNotes"
                      placeholder="Add notes about your review decision..."
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      rows={4}
                    />
                  </div>

                  {application.status === "pending" && (
                    <div className="flex flex-col gap-2">
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleStatusUpdate("approved")}
                        disabled={updating}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {updating ? "Approving..." : "Approve Application"}
                      </Button>
                      <Button variant="destructive" onClick={() => handleStatusUpdate("rejected")} disabled={updating}>
                        <XCircle className="h-4 w-4 mr-2" />
                        {updating ? "Rejecting..." : "Reject Application"}
                      </Button>
                    </div>
                  )}

                  {application.status !== "pending" && (
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">This application has been {application.status}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Application Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Application Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Application Submitted</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(application.submissionDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Under Review</p>
                        <p className="text-xs text-muted-foreground">In progress</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Documents:</span>
                    <span className="text-sm font-medium">{application.documents.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Files:</span>
                    <span className="text-sm font-medium">
                      {application.documents.reduce((acc, doc) => acc + doc.files.length, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Submission Date:</span>
                    <span className="text-sm font-medium">
                      {new Date(application.submissionDate).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
