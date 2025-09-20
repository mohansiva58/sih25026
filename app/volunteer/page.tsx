"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LanguageSelector } from "@/components/language-selector"
import { Heart, Users, QrCode, Phone, MapPin, CheckCircle, Stethoscope } from "lucide-react"
import Link from "next/link"

export default function VolunteerPortalPage() {
  const [volunteerInfo, setVolunteerInfo] = useState({
    name: "",
    organization: "",
    phone: "",
    location: "",
    specialization: "",
  })
  const [patientUpdate, setPatientUpdate] = useState({
    patientId: "",
    updateType: "",
    notes: "",
    recommendations: "",
  })
  const [success, setSuccess] = useState("")

  const handleVolunteerRegistration = (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess("Volunteer registration submitted successfully!")
    // Reset form
    setVolunteerInfo({
      name: "",
      organization: "",
      phone: "",
      location: "",
      specialization: "",
    })
  }

  const handlePatientUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess("Patient update recorded successfully!")
    // Reset form
    setPatientUpdate({
      patientId: "",
      updateType: "",
      notes: "",
      recommendations: "",
    })
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
              <p className="text-sm text-muted-foreground">Volunteer Portal</p>
            </div>
          </Link>
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Volunteer Portal</h2>
            <p className="text-muted-foreground">Support migrant workers with health assistance and record updates</p>
          </div>

          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Volunteer Registration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Volunteer Registration
                </CardTitle>
                <CardDescription>Register as a healthcare volunteer to assist migrant workers</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVolunteerRegistration} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={volunteerInfo.name}
                      onChange={(e) => setVolunteerInfo((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization/Hospital</Label>
                    <Input
                      id="organization"
                      placeholder="Your organization or hospital name"
                      value={volunteerInfo.organization}
                      onChange={(e) => setVolunteerInfo((prev) => ({ ...prev, organization: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 9876543210"
                      value={volunteerInfo.phone}
                      onChange={(e) => setVolunteerInfo((prev) => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="Your current location in Kerala"
                      value={volunteerInfo.location}
                      onChange={(e) => setVolunteerInfo((prev) => ({ ...prev, location: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Select
                      value={volunteerInfo.specialization}
                      onValueChange={(value) => setVolunteerInfo((prev) => ({ ...prev, specialization: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general-medicine">General Medicine</SelectItem>
                        <SelectItem value="nursing">Nursing</SelectItem>
                        <SelectItem value="pharmacy">Pharmacy</SelectItem>
                        <SelectItem value="first-aid">First Aid</SelectItem>
                        <SelectItem value="mental-health">Mental Health</SelectItem>
                        <SelectItem value="community-health">Community Health</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Register as Volunteer
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common volunteer tasks and tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/scan">
                  <Button className="w-full justify-start" size="lg">
                    <QrCode className="h-5 w-5 mr-3" />
                    Scan Patient QR Code
                  </Button>
                </Link>

                <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                  <Phone className="h-5 w-5 mr-3" />
                  Emergency Contacts
                </Button>

                <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                  <MapPin className="h-5 w-5 mr-3" />
                  Find Nearby Healthcare
                </Button>

                <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                  <Stethoscope className="h-5 w-5 mr-3" />
                  Health Guidelines
                </Button>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Emergency Numbers</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Emergency Services:</span>
                      <span className="font-bold text-red-600">108</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Health Helpline:</span>
                      <span className="font-bold text-primary">104</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Women Helpline:</span>
                      <span className="font-bold text-primary">1091</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Patient Update Form */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Patient Health Update
              </CardTitle>
              <CardDescription>Record health updates and recommendations for patients</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePatientUpdate} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientId">Patient ID *</Label>
                    <Input
                      id="patientId"
                      placeholder="Enter patient ID or scan QR"
                      value={patientUpdate.patientId}
                      onChange={(e) => setPatientUpdate((prev) => ({ ...prev, patientId: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="updateType">Update Type *</Label>
                    <Select
                      value={patientUpdate.updateType}
                      onValueChange={(value) => setPatientUpdate((prev) => ({ ...prev, updateType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select update type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Medical Consultation</SelectItem>
                        <SelectItem value="medication">Medication Update</SelectItem>
                        <SelectItem value="test-results">Test Results</SelectItem>
                        <SelectItem value="follow-up">Follow-up Visit</SelectItem>
                        <SelectItem value="emergency">Emergency Treatment</SelectItem>
                        <SelectItem value="referral">Hospital Referral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Medical Notes *</Label>
                  <textarea
                    id="notes"
                    className="w-full min-h-[100px] p-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    placeholder="Enter detailed medical notes, symptoms, observations..."
                    value={patientUpdate.notes}
                    onChange={(e) => setPatientUpdate((prev) => ({ ...prev, notes: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recommendations">Recommendations</Label>
                  <textarea
                    id="recommendations"
                    className="w-full min-h-[80px] p-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    placeholder="Treatment recommendations, follow-up instructions..."
                    value={patientUpdate.recommendations}
                    onChange={(e) => setPatientUpdate((prev) => ({ ...prev, recommendations: e.target.value }))}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Record Patient Update
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
