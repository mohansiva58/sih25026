"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LanguageSelector } from "@/components/language-selector"
import { Heart, CheckCircle, Upload, FileText, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CompleteProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [progress, setProgress] = useState(25)

  // AppLayout already handles auth checks and redirects, no need to duplicate here

  const steps = [
    {
      id: 1,
      title: "Account Created",
      description: "Your account has been successfully created",
      icon: CheckCircle,
      completed: true,
    },
    {
      id: 2,
      title: "Upload Health Documents",
      description: "Upload your medical reports and health certificates",
      icon: Upload,
      completed: false,
      action: () => router.push("/health/upload"),
    },
    {
      id: 3,
      title: "Complete Medical History",
      description: "Fill in your medical history and current medications",
      icon: FileText,
      completed: false,
      action: () => router.push("/health/history"),
    },
    {
      id: 4,
      title: "Submit for Approval",
      description: "Submit your profile for government review",
      icon: User,
      completed: false,
      action: () => router.push("/approval/submit"),
    },
  ]

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
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
              <p className="text-sm text-muted-foreground">Digital Health Management</p>
            </div>
          </Link>
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Complete Your Profile</h2>
            <p className="text-muted-foreground">
              Follow these steps to complete your health profile and get approval for Kerala entry
            </p>
          </div>

          {/* Progress Bar */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{progress}%</span>
                </div>
                Profile Completion
              </CardTitle>
              <CardDescription>Complete all steps to submit your profile for government approval</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="w-full" />
            </CardContent>
          </Card>

          {/* Welcome Alert */}
          <Alert className="mb-8 border-primary/20 bg-primary/5">
            <CheckCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-primary">
              Welcome! Your account has been created successfully. Complete the remaining steps to get started.
            </AlertDescription>
          </Alert>

          {/* Steps */}
          <div className="grid gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <Card key={step.id} className={step.completed ? "border-primary/20 bg-primary/5" : ""}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-12 w-12 rounded-full flex items-center justify-center ${
                          step.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>

                      <div>
                        {step.completed ? (
                          <div className="flex items-center gap-2 text-primary">
                            <CheckCircle className="h-5 w-5" />
                            <span className="text-sm font-medium">Completed</span>
                          </div>
                        ) : step.action ? (
                          <Button onClick={step.action}>Start</Button>
                        ) : (
                          <Button variant="outline" disabled>
                            Pending
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Next Steps */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>What happens next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">Upload your health documents</p>
                  <p className="text-sm text-muted-foreground">
                    Medical reports, vaccination certificates, and health checkup results
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium">Complete your medical history</p>
                  <p className="text-sm text-muted-foreground">
                    Past diseases, current medications, and ongoing treatments
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium">Government review</p>
                  <p className="text-sm text-muted-foreground">
                    Kerala Health Department will review your profile for approval
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-bold text-primary">4</span>
                </div>
                <div>
                  <p className="font-medium">Get your QR codes</p>
                  <p className="text-sm text-muted-foreground">
                    Access QR codes for hospitals and volunteers once approved
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
