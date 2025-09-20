"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LanguageSelector } from "@/components/language-selector"
import {
  Heart,
  Bot,
  Camera,
  FileText,
  MapPin,
  Phone,
  Clock,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Upload,
  Mic,
  Search,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { generateHealthAdvice, findNearbyHealthcare, type HealthAnalysis } from "@/lib/ai-health-assistant"
import Image from "next/image"

export default function AIAssistantPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [symptoms, setSymptoms] = useState("")
  const [analysis, setAnalysis] = useState<HealthAnalysis | null>(null)
  const [healthAdvice, setHealthAdvice] = useState("")
  const [nearbyHealthcare, setNearbyHealthcare] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)

  const handleSymptomAnalysis = async () => {
    if (!symptoms.trim()) return

    setLoading(true)
    try {
      const advice = await generateHealthAdvice(symptoms, "Kerala")
      setHealthAdvice(advice)

      // Also find nearby healthcare
      const healthcare = await findNearbyHealthcare("Kerala", "hospital")
      setNearbyHealthcare(healthcare)
    } catch (error) {
      console.error("Error analyzing symptoms:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // In a real implementation, this would use OCR to extract text from the image
    // and then analyze it with AI
    setLoading(true)
    try {
      // Mock analysis for demonstration
      const mockAnalysis: HealthAnalysis = {
        diseaseDetection: {
          possibleConditions: ["Viral Fever", "Common Cold"],
          severity: "low",
          confidence: 0.75,
          recommendations: [
            "Rest and stay hydrated",
            "Monitor temperature regularly",
            "Consult doctor if symptoms worsen",
          ],
        },
        symptoms: {
          identified: ["Fever", "Headache", "Body ache"],
          category: "respiratory",
          urgency: "routine",
        },
        medications: {
          interactions: [],
          recommendations: ["Paracetamol for fever", "Plenty of fluids"],
          warnings: ["Avoid aspirin if under 18"],
        },
        nextSteps: {
          immediateActions: ["Rest", "Stay hydrated", "Monitor symptoms"],
          followUpCare: ["Consult doctor if fever persists beyond 3 days"],
          preventiveMeasures: ["Wash hands frequently", "Avoid crowded places", "Wear mask"],
        },
      }

      setAnalysis(mockAnalysis)
    } catch (error) {
      console.error("Error analyzing image:", error)
    } finally {
      setLoading(false)
    }
  }

  const startVoiceRecording = () => {
    setIsRecording(true)
    // Mock voice recording - in real implementation, use Web Speech API
    setTimeout(() => {
      setIsRecording(false)
      setSymptoms((prev) => prev + " I have been feeling tired and have a headache for the past two days.")
    }, 3000)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return "bg-red-100 text-red-800 border-red-200"
      case "urgent":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  if (!user) {
    router.push("/auth/login")
    return null
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Kerala Health Records</h1>
              <p className="text-sm text-muted-foreground">AI Health Assistant</p>
            </div>
          </Link>
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Bot className="h-8 w-8 text-primary" />
              AI Health Assistant
            </h2>
            <p className="text-muted-foreground">
              Get instant health insights, disease detection, and medical advice powered by AI
            </p>
          </div>

          <Tabs defaultValue="symptoms" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="symptoms">Symptom Analysis</TabsTrigger>
              <TabsTrigger value="document">Document Analysis</TabsTrigger>
              <TabsTrigger value="healthcare">Find Healthcare</TabsTrigger>
            </TabsList>

            {/* Symptom Analysis Tab */}
            <TabsContent value="symptoms">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      Describe Your Symptoms
                    </CardTitle>
                    <CardDescription>Tell us about your symptoms and get AI-powered health insights</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Describe your symptoms in detail... (e.g., I have fever, headache, and body ache for 2 days)"
                          value={symptoms}
                          onChange={(e) => setSymptoms(e.target.value)}
                          rows={4}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={startVoiceRecording}
                          disabled={isRecording}
                          className="self-start bg-transparent"
                        >
                          <Mic className={`h-4 w-4 ${isRecording ? "text-red-500" : ""}`} />
                          {isRecording ? "Recording..." : "Voice"}
                        </Button>
                      </div>
                    </div>

                    <Button onClick={handleSymptomAnalysis} disabled={loading || !symptoms.trim()} className="w-full">
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Bot className="h-4 w-4 mr-2" />
                          Analyze Symptoms
                        </>
                      )}
                    </Button>

                    {healthAdvice && (
                      <Alert className="border-blue-200 bg-blue-50">
                        <Bot className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                          <div className="whitespace-pre-wrap">{healthAdvice}</div>
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {nearbyHealthcare.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Nearby Healthcare
                      </CardTitle>
                      <CardDescription>Healthcare facilities near you</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {nearbyHealthcare.map((facility, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <h4 className="font-semibold">{facility.name}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{facility.address}</p>
                            <div className="flex items-center gap-4 text-sm">
                              {facility.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {facility.phone}
                                </span>
                              )}
                              {facility.distance && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {facility.distance}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {facility.services.slice(0, 3).map((service: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {service}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Document Analysis Tab */}
            <TabsContent value="document">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Upload Medical Document
                    </CardTitle>
                    <CardDescription>Upload a photo of your medical report for AI analysis</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Upload Medical Report</h3>
                      <p className="text-muted-foreground mb-4">
                        Take a photo or upload an image of your medical report, prescription, or test results
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="document-upload"
                      />
                      <label htmlFor="document-upload">
                        <Button variant="outline" className="cursor-pointer bg-transparent">
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Image
                        </Button>
                      </label>
                    </div>

                    {uploadedImage && (
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">Uploaded Document:</h4>
                          <Image
                            src={uploadedImage || "/placeholder.svg"}
                            alt="Uploaded medical document"
                            width={300}
                            height={200}
                            className="rounded-lg object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {loading && (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-2">Analyzing document...</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {analysis && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        AI Analysis Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Disease Detection */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Disease Detection
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getSeverityColor(analysis.diseaseDetection.severity)}>
                              {analysis.diseaseDetection.severity.toUpperCase()} Risk
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Confidence: {Math.round(analysis.diseaseDetection.confidence * 100)}%
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">Possible Conditions:</p>
                            <ul className="text-sm text-muted-foreground list-disc list-inside">
                              {analysis.diseaseDetection.possibleConditions.map((condition, idx) => (
                                <li key={idx}>{condition}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Symptoms */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Symptoms Analysis
                        </h4>
                        <div className="space-y-2">
                          <Badge className={getUrgencyColor(analysis.symptoms.urgency)}>
                            {analysis.symptoms.urgency.toUpperCase()}
                          </Badge>
                          <div>
                            <p className="text-sm font-medium mb-1">Identified Symptoms:</p>
                            <div className="flex flex-wrap gap-1">
                              {analysis.symptoms.identified.map((symptom, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {symptom}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Recommendations
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium mb-1">Immediate Actions:</p>
                            <ul className="text-sm text-muted-foreground list-disc list-inside">
                              {analysis.nextSteps.immediateActions.map((action, idx) => (
                                <li key={idx}>{action}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">Follow-up Care:</p>
                            <ul className="text-sm text-muted-foreground list-disc list-inside">
                              {analysis.nextSteps.followUpCare.map((care, idx) => (
                                <li key={idx}>{care}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <Alert className="border-yellow-200 bg-yellow-50">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <AlertDescription className="text-yellow-800">
                          <strong>Disclaimer:</strong> This AI analysis is for informational purposes only. Always
                          consult with qualified healthcare professionals for proper medical diagnosis and treatment.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Find Healthcare Tab */}
            <TabsContent value="healthcare">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Find Healthcare Services
                    </CardTitle>
                    <CardDescription>Locate nearby hospitals, clinics, and pharmacies</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Input
                        placeholder="Enter your location (e.g., Thiruvananthapuram)"
                        defaultValue="Thiruvananthapuram, Kerala"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="justify-start bg-transparent">
                        <MapPin className="h-4 w-4 mr-2" />
                        Hospitals
                      </Button>
                      <Button variant="outline" className="justify-start bg-transparent">
                        <Heart className="h-4 w-4 mr-2" />
                        Clinics
                      </Button>
                      <Button variant="outline" className="justify-start bg-transparent">
                        <FileText className="h-4 w-4 mr-2" />
                        Pharmacies
                      </Button>
                      <Button variant="outline" className="justify-start bg-transparent">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Emergency
                      </Button>
                    </div>

                    <Button className="w-full">
                      <Search className="h-4 w-4 mr-2" />
                      Search Healthcare
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Contacts</CardTitle>
                    <CardDescription>Important emergency numbers for Kerala</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Emergency Services</p>
                          <p className="text-sm text-muted-foreground">Police, Fire, Medical</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">108</p>
                          <Button variant="ghost" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Health Helpline</p>
                          <p className="text-sm text-muted-foreground">Kerala Health Department</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">104</p>
                          <Button variant="ghost" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Women Helpline</p>
                          <p className="text-sm text-muted-foreground">24/7 Support</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">1091</p>
                          <Button variant="ghost" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Child Helpline</p>
                          <p className="text-sm text-muted-foreground">Child Protection</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">1098</p>
                          <Button variant="ghost" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
