"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { LanguageSelector } from "@/components/language-selector"
import {
  Heart,
  QrCode,
  Camera,
  User,
  FileText,
  Phone,
  MapPin,
  Calendar,
  AlertTriangle,
  Stethoscope,
} from "lucide-react"
import Link from "next/link"

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
  }>
  emergencyInfo: {
    bloodType?: string
    chronicConditions?: string[]
    emergencyMedications?: string[]
  }
}

export default function QRScanPage() {
  const [scannedData, setScannedData] = useState("")
  const [patientRecord, setPatientRecord] = useState<PatientRecord | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [accessType, setAccessType] = useState<"hospital" | "volunteer" | "emergency">("hospital")
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isScanning, setIsScanning] = useState(false)

  const handleManualEntry = async () => {
    if (!scannedData.trim()) {
      setError("Please enter a QR code or patient ID")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Mock patient data for demonstration
      const mockPatient: PatientRecord = {
        id: "patient-123",
        fullName: "Rajesh Kumar",
        email: "rajesh.kumar@email.com",
        phoneNumber: "+91 9876543210",
        emergencyContact: "+91 9876543211",
        dateOfBirth: "1985-06-15",
        gender: "male",
        address: "123 Main Street, Village Name, District, State - 123456",
        approvalStatus: "approved",
        lastUpdated: "2024-01-20",
        healthInfo: {
          symptoms: "No current symptoms. Feeling healthy.",
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
          },
          {
            id: "doc-2",
            type: "vaccination-certificate",
            name: "COVID-19 Vaccination Certificate",
            uploadDate: "2024-01-20",
            status: "approved",
          },
          {
            id: "doc-3",
            type: "health-checkup",
            name: "General Health Checkup",
            uploadDate: "2024-01-20",
            status: "approved",
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
      setError("Failed to retrieve patient record. Please check the QR code or patient ID.")
    } finally {
      setLoading(false)
    }
  }

  const startCamera = async () => {
    try {
      setIsScanning(true)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      setError("Unable to access camera. Please enter QR code manually.")
      setIsScanning(false)
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
    }
    setIsScanning(false)
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Kerala Health Records</h1>
              <p className="text-sm text-muted-foreground">Healthcare Provider Access</p>
            </div>
          </Link>
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Patient Record Access</h2>
            <p className="text-muted-foreground">Scan QR code or enter patient ID to access health records</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* QR Scanner */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  QR Code Scanner
                </CardTitle>
                <CardDescription>Scan patient's QR code or enter manually</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Access Type Selection */}
                <div className="space-y-2">
                  <Label>Access Type</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={accessType === "hospital" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAccessType("hospital")}
                    >
                      <Stethoscope className="h-4 w-4 mr-2" />
                      Hospital
                    </Button>
                    <Button
                      variant={accessType === "volunteer" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAccessType("volunteer")}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Volunteer
                    </Button>
                    <Button
                      variant={accessType === "emergency" ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => setAccessType("emergency")}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Emergency
                    </Button>
                  </div>
                </div>

                {/* Camera Scanner */}
                {isScanning ? (
                  <div className="space-y-4">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-64 bg-black rounded-lg" />
                    <div className="flex gap-2">
                      <Button onClick={stopCamera} variant="outline" className="flex-1 bg-transparent">
                        Stop Camera
                      </Button>
                      <Button onClick={() => setScannedData("mock-qr-data")} className="flex-1">
                        Simulate Scan
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Scan QR Code</h3>
                    <p className="text-muted-foreground mb-4">Point your camera at the patient's QR code</p>
                    <Button onClick={startCamera}>
                      <Camera className="h-4 w-4 mr-2" />
                      Start Camera
                    </Button>
                  </div>
                )}

                {/* Manual Entry */}
                <div className="space-y-2">
                  <Label htmlFor="qrData">Or Enter QR Code / Patient ID</Label>
                  <div className="flex gap-2">
                    <Input
                      id="qrData"
                      placeholder="Enter QR code data or patient ID"
                      value={scannedData}
                      onChange={(e) => setScannedData(e.target.value)}
                    />
                    <Button onClick={handleManualEntry} disabled={loading}>
                      {loading ? "Loading..." : "Search"}
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Patient Information */}
            {patientRecord && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Patient Information
                    </CardTitle>
                    <Badge className={getStatusColor(patientRecord.approvalStatus)}>
                      {patientRecord.approvalStatus.charAt(0).toUpperCase() + patientRecord.approvalStatus.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Name:</span>
                        <span className="text-sm">{patientRecord.fullName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Phone:</span>
                        <span className="text-sm">{patientRecord.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">DOB:</span>
                        <span className="text-sm">{new Date(patientRecord.dateOfBirth).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Gender:</span>
                        <span className="text-sm">
                          {patientRecord.gender.charAt(0).toUpperCase() + patientRecord.gender.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Emergency:</span>
                        <span className="text-sm">{patientRecord.emergencyContact}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Blood Type:</span>
                        <span className="text-sm font-bold text-red-600">{patientRecord.emergencyInfo.bloodType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="text-sm font-medium">Address:</span>
                        <p className="text-sm text-muted-foreground">{patientRecord.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Information */}
                  {accessType === "emergency" && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Emergency Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Blood Type:</span>
                          <span className="ml-2 font-bold text-red-600">{patientRecord.emergencyInfo.bloodType}</span>
                        </div>
                        {patientRecord.emergencyInfo.chronicConditions && (
                          <div>
                            <span className="font-medium">Chronic Conditions:</span>
                            <span className="ml-2">{patientRecord.emergencyInfo.chronicConditions.join(", ")}</span>
                          </div>
                        )}
                        {patientRecord.emergencyInfo.emergencyMedications && (
                          <div>
                            <span className="font-medium">Emergency Medications:</span>
                            <span className="ml-2">{patientRecord.emergencyInfo.emergencyMedications.join(", ")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Detailed Health Information */}
          {patientRecord && (
            <div className="mt-6 space-y-6">
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
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
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
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {patientRecord.documents.map((doc) => (
                      <div key={doc.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <h4 className="font-medium text-sm">{doc.name}</h4>
                          </div>
                          <Badge className={getStatusColor(doc.status)} variant="outline">
                            {doc.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {doc.type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                        <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
                          View Document
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle>Healthcare Actions</CardTitle>
                  <CardDescription>Record new information or update patient status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button>
                      <FileText className="h-4 w-4 mr-2" />
                      Add Treatment Record
                    </Button>
                    <Button variant="outline">
                      <User className="h-4 w-4 mr-2" />
                      Update Patient Info
                    </Button>
                    <Button variant="outline">
                      <Phone className="h-4 w-4 mr-2" />
                      Contact Emergency
                    </Button>
                    {accessType === "hospital" && (
                      <Button variant="outline">
                        <Stethoscope className="h-4 w-4 mr-2" />
                        Schedule Follow-up
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Instructions */}
          {!patientRecord && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>How to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <QrCode className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">1. Scan QR Code</h4>
                    <p className="text-sm text-muted-foreground">
                      Ask the patient to show their health QR code and scan it with the camera
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">2. Access Records</h4>
                    <p className="text-sm text-muted-foreground">
                      View patient's health information, medical history, and documents
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">3. Update Records</h4>
                    <p className="text-sm text-muted-foreground">
                      Add treatment information, prescriptions, or update patient status
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
