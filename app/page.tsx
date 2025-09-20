"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LanguageSelector } from "@/components/language-selector"
import { Heart, Shield, QrCode, Users, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Kerala Health Records</h1>
              <p className="text-sm text-muted-foreground">Digital Health Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            {user ? (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link href="/auth/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            Secure Digital Health Records for <span className="text-primary">Migrant Workers</span>
          </h2>
          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
            Streamlined health record management with government approval workflow, multilingual support, and QR-based
            instant access for healthcare providers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/register">
                  <Button size="lg" className="text-lg px-8">
                    Get Started
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Key Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Government Approval</CardTitle>
                <CardDescription>
                  Real-time approval workflow with Kerala Health Department for entry clearance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <QrCode className="h-12 w-12 text-primary mb-4" />
                <CardTitle>QR Code Access</CardTitle>
                <CardDescription>
                  Instant health record access for hospitals and volunteers through secure QR codes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Multilingual Support</CardTitle>
                <CardDescription>
                  Available in Malayalam, Hindi, Bengali, Tamil, and English for accessibility
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Register & Upload</h4>
              <p className="text-muted-foreground">
                Create your account and upload health documents, reports, and medical history
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Government Review</h4>
              <p className="text-muted-foreground">Kerala Health Department reviews your records for entry approval</p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Access & Track</h4>
              <p className="text-muted-foreground">
                Get QR codes for instant access and track your health journey in Kerala
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-card/50">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">Kerala Health Records</span>
          </div>
          <p className="text-muted-foreground mb-4">
            Empowering migrant workers with secure, accessible digital health management
          </p>
          <p className="text-sm text-muted-foreground">
            © 2024 Kerala Health Records. Built for the welfare of migrant workers.
          </p>
        </div>
      </footer>
    </div>
  )
}
