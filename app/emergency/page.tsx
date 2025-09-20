"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, MapPin, User, Clock, AlertTriangle, Heart, Shield, Siren, Hospital } from "lucide-react"

const emergencyContacts = [
  {
    id: "1",
    name: "Emergency Medical Services",
    number: "108",
    type: "ambulance",
    description: "24/7 emergency medical response",
    icon: Siren,
    color: "bg-red-500"
  },
  {
    id: "2", 
    name: "Kerala Health Helpline",
    number: "1056",
    type: "health",
    description: "Medical consultation and health support",
    icon: Heart,
    color: "bg-blue-500"
  },
  {
    id: "3",
    name: "Police Emergency",
    number: "100", 
    type: "police",
    description: "Police emergency response",
    icon: Shield,
    color: "bg-gray-600"
  },
  {
    id: "4",
    name: "Fire Services",
    number: "101",
    type: "fire",
    description: "Fire emergency response",
    icon: AlertTriangle,
    color: "bg-orange-500"
  }
]

const personalContacts = [
  {
    id: "1",
    name: "Dr. Sarah Kumar",
    number: "+91 98765 43210",
    relationship: "Primary Doctor",
    hospital: "Kerala General Hospital",
    specialty: "General Medicine"
  },
  {
    id: "2",
    name: "Priya Krishnan",
    number: "+91 98765 43211", 
    relationship: "Emergency Contact (Spouse)",
    hospital: null,
    specialty: null
  },
  {
    id: "3",
    name: "Raj Menon",
    number: "+91 98765 43212",
    relationship: "Emergency Contact (Brother)",
    hospital: null,
    specialty: null
  }
]

const nearbyHospitals = [
  {
    id: "1",
    name: "Kerala General Hospital",
    address: "MG Road, Kochi, Kerala 682001",
    distance: "2.5 km",
    phone: "+91 484 2360721",
    type: "Government",
    services: ["Emergency", "ICU", "Cardiology", "Neurology"]
  },
  {
    id: "2",
    name: "Amrita Institute of Medical Sciences",
    address: "AIMS Ponekkara, Kochi, Kerala 682041", 
    distance: "8.2 km",
    phone: "+91 484 2801234",
    type: "Private",
    services: ["Emergency", "Trauma", "Heart Surgery", "Oncology"]
  },
  {
    id: "3",
    name: "Medical Trust Hospital",
    address: "M.G Road, Kochi, Kerala 682016",
    distance: "3.1 km", 
    phone: "+91 484 2358001",
    type: "Private",
    services: ["Emergency", "ICU", "Orthopedics", "Gastroenterology"]
  }
]

export default function EmergencyPage() {
  const [isEmergency, setIsEmergency] = useState(false)

  const handleEmergencyCall = (number: string) => {
    // In a real app, this would initiate a call
    window.open(`tel:${number}`)
  }

  const getLocationAndCall = () => {
    setIsEmergency(true)
    // In a real app, this would get location and call emergency services
    setTimeout(() => {
      handleEmergencyCall("108")
      setIsEmergency(false)
    }, 2000)
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Phone className="h-8 w-8 text-red-600" />
            Emergency Support
          </h1>
          <p className="text-muted-foreground mt-2">
            Quick access to emergency services and important contacts
          </p>
        </div>

        {/* Emergency Button */}
        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-red-100 rounded-full">
                  <Siren className="h-12 w-12 text-red-600" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-red-800">Medical Emergency</h2>
                <p className="text-red-700 mb-4">
                  Press the button below for immediate emergency medical assistance
                </p>
              </div>
              <Button
                onClick={getLocationAndCall}
                disabled={isEmergency}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-bold h-auto"
              >
                {isEmergency ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                    Calling Emergency Services...
                  </>
                ) : (
                  <>
                    <Phone className="h-5 w-5 mr-2" />
                    Call Emergency (108)
                  </>
                )}
              </Button>
              <p className="text-sm text-red-600">
                This will share your location and call emergency medical services
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Services */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Hotlines</CardTitle>
            <CardDescription>
              Essential emergency contact numbers for immediate assistance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emergencyContacts.map((contact) => {
                const Icon = contact.icon
                return (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 ${contact.color} rounded-full`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{contact.name}</h3>
                        <p className="text-sm text-muted-foreground">{contact.description}</p>
                        <p className="text-2xl font-bold text-gray-900">{contact.number}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleEmergencyCall(contact.number)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Emergency Contacts */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Contacts</CardTitle>
              <CardDescription>
                Your doctors and emergency contacts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {personalContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{contact.name}</h4>
                        <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                        {contact.hospital && (
                          <p className="text-xs text-muted-foreground">{contact.hospital}</p>
                        )}
                        <p className="text-sm font-mono">{contact.number}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEmergencyCall(contact.number)}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full">
                  <User className="h-4 w-4 mr-2" />
                  Add Emergency Contact
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Nearby Hospitals */}
          <Card>
            <CardHeader>
              <CardTitle>Nearby Hospitals</CardTitle>
              <CardDescription>
                Emergency medical facilities in your area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nearbyHospitals.map((hospital) => (
                  <div
                    key={hospital.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{hospital.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {hospital.distance}
                          </div>
                          <Badge variant="outline">
                            {hospital.type}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleEmergencyCall(hospital.phone)}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {hospital.address}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {hospital.services.map((service, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Medical Information Card */}
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Important Medical Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-yellow-800">Blood Type</p>
                <p className="text-yellow-700">O+ (Positive)</p>
              </div>
              <div>
                <p className="font-medium text-yellow-800">Allergies</p>
                <p className="text-yellow-700">Penicillin, Shellfish</p>
              </div>
              <div>
                <p className="font-medium text-yellow-800">Current Medications</p>
                <p className="text-yellow-700">Lisinopril 10mg, Metformin 500mg</p>
              </div>
              <div>
                <p className="font-medium text-yellow-800">Medical Conditions</p>
                <p className="text-yellow-700">Hypertension, Type 2 Diabetes</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Note:</strong> This information will be shared with emergency responders to provide appropriate care.
                Keep this information updated in your profile settings.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}