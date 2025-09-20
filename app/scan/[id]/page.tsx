"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LanguageSelector } from "@/components/language-selector"
import { Heart, User, FileText, Phone, MapPin, Calendar, AlertTriangle, ArrowLeft, Download, Eye } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface PatientRecord {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  emergencyContact: string
  dateOfBirth: string
  gender: string
  address: string
  approvalStatus: "approved" | "pending" | "rejected"
  lastUpdated: string
  qrType: "master" | "document" | "profile"
  healthInfo: {
    symptoms?: string
    medications?: string
    medicalHistory?: string
    allergies?: string
  }
  documents: Array<{
    id: string
    type: string
    name: string
    uploadDate: string
    status: "approved" | "pending" | "rejected"
    files: Array<{
      name: string
      type: string
      size: number
      url: string
    }>
  }>
  emergencyInfo: {
    bloodType?: string
    chronicConditions?: string[]
    emergencyMedications?: string[]
  }
}

export default function QRRecordPage() {
  const params = useParams()
  const [patientRecord, setPatientRecord] = useState<PatientRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchPatientRecord = async () => {
      try {
        // Mock patient data based on QR ID
        const mockPatient: PatientRecord = {
          id: params.id as string,
          fullName: "Rajesh Kumar",
          email: "rajesh.kumar@email.com",
          phoneNumber: "+91 9876543210",
          emergencyContact: "+91 9876543211",
          dateOfBirth: "1985-06-15",
          gender: "male",
          address: "123 Main Street, Village Name, District, State - 123456",
          approvalStatus: "approved",
          lastUpdated: "2024-01-20",
          qrType: "master",
          healthInfo: {
            symptoms: "No current symptoms. Feeling healthy and ready for work.",
            medications: "No regular medications. Occasional paracetamol for headaches.",
            medicalHistory: "No major medical history. Had appendectomy in 2010.",
            allergies: "No known allergies",
          },
          documents: [
            {
              id: "doc-1",
              type: "blood-test",
              name: "Blood Test Results",
              uploadDate: "2024-01-20",
              status: "approved",
              files: [{ name: "blood-test-results.pdf", type: "application/pdf", size: 245760, url: "#" }],
            },
            {
              id: "doc-2",
              type: "vaccination-certificate",
              name: "COVID-19 Vaccination Certificate",
              uploadDate: "2024-01-20",
              status: "approved",
              files: [{ name: "covid-vaccine-cert.jpg", type: "image/jpeg", size: 156432, url: "#" }],
            },
            {
              id: "doc-3",
              type: "health-checkup",
              name: "General Health Checkup",
              uploadDate: "2024-01-20",
              status: "approved",
              files: [{ name: "health-checkup.pdf", type: "application/pdf", size: 512000, url: "#" }],
            },
          ],
          emergencyInfo: {
            bloodType: "O+",
            chronicConditions: ["Hypertension"],
            emergencyMedications: ["Amlodipine 5mg"],
          },
        }

        setPatientRecord(mockPatient)
      } catch (error) {
        setError("Failed to load patient record")
      } finally {
        setLoading(false)
      }
    }

    fetchPatientRecord()
  }, [params.id])

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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !patientRecord) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/scan" className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Scanner
              </Button>
            </Link>
            <LanguageSelector />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Record Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested patient record could not be found or accessed.</p>
            <Link href="/scan">
              <Button>Back to Scanner</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/scan">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Scanner
              </Button>
            </Link>
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Patient Record</h1>
              <p className="text-sm text-muted-foreground">{patientRecord.fullName}</p>
            </div>
          </div>
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="container mx-auto max-w-6xl">
          {/* Patient Overview */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Patient Information
                </CardTitle>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(patientRecord.approvalStatus)}>
                    {patientRecord.approvalStatus.charAt(0).toUpperCase() + patientRecord.approvalStatus.slice(1)}
                  </Badge>
                  <Badge variant="outline">
                    {patientRecord.qrType.charAt(0).toUpperCase() + patientRecord.qrType.slice(1)} Access
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Personal Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Name:</span>
                      <span className="text-sm">{patientRecord.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">DOB:</span>
                      <span className="text-sm">{new Date(patientRecord.dateOfBirth).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Gender:</span>
                      <span className="text-sm">
                        {patientRecord.gender.charAt(0).toUpperCase() + patientRecord.gender.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Contact Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Phone:</span>
                      <span className="text-sm">{patientRecord.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Emergency:</span>
                      <span className="text-sm">{patientRecord.emergencyContact}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="text-sm font-medium">Address:</span>
                        <p className="text-sm text-muted-foreground">{patientRecord.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Emergency Info
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Blood Type:</span>
                      <span className="text-sm font-bold text-red-600">{patientRecord.emergencyInfo.bloodType}</span>
                    </div>
                    {patientRecord.emergencyInfo.chronicConditions && (
                      <div>
                        <span className="text-sm font-medium">Chronic Conditions:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {patientRecord.emergencyInfo.chronicConditions.map((condition, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Health Information */}
            <Card>
              <CardHeader>
                <CardTitle>Health Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {patientRecord.healthInfo.symptoms && (
                  <div>
                    <h4 className="font-medium mb-2">Current Symptoms:</h4>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                      {patientRecord.healthInfo.symptoms}
                    </p>
                  </div>
                )}
                {patientRecord.healthInfo.medications && (
                  <div>
                    <h4 className="font-medium mb-2">Current Medications:</h4>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                      {patientRecord.healthInfo.medications}
                    </p>
                  </div>
                )}
                {patientRecord.healthInfo.medicalHistory && (
                  <div>
                    <h4 className="font-medium mb-2">Medical History:</h4>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                      {patientRecord.healthInfo.medicalHistory}
                    </p>
                  </div>
                )}
                {patientRecord.healthInfo.allergies && (
                  <div>
                    <h4 className="font-medium mb-2">Allergies:</h4>
                    <p className="text-sm text-muted-foreground bg-red-50 border border-red-200 p-3 rounded-lg">
                      {patientRecord.healthInfo.allergies}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Medical Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Medical Documents</CardTitle>
                <CardDescription>Available health records and certificates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientRecord.documents.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{doc.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {doc.type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(doc.status)} variant="outline">
                          {doc.status}
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

          {/* Emergency Alert */}
          {patientRecord.emergencyInfo.emergencyMedications &&
            patientRecord.emergencyInfo.emergencyMedications.length > 0 && (
              <Alert className="mt-6 border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Emergency Medications:</strong> {patientRecord.emergencyInfo.emergencyMedications.join(", ")}
                </AlertDescription>
              </Alert>
            )}

          {/* Access Log */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Access Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <p>Record accessed: {new Date().toLocaleString()}</p>
                <p>QR Code ID: {patientRecord.id}</p>
                <p>Access Type: {patientRecord.qrType} record</p>
                <p>Last Updated: {new Date(patientRecord.lastUpdated).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
