"use client"

import { useState, useEffect, memo } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LanguageSelector } from "@/components/language-selector"
import { Heart, QrCode, Download, Share2, Copy, CheckCircle } from "lucide-react"
import Link from "next/link"
import { generateQRCode, type HealthRecordQR } from "@/lib/qr-generator"
import Image from "next/image"

function QRCodesPage() {
  const { user } = useAuth()
  const [masterQR, setMasterQR] = useState<string>("")
  const [documentQRs, setDocumentQRs] = useState<Array<{ id: string; type: string; qr: string; name: string }>>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<string>("")

  useEffect(() => {
    // AppLayout already handles auth checks and redirects, no need to duplicate here
    if (user) {
      generateQRCodes()
    }
  }, [user])

  const generateQRCodes = async () => {
    try {
      setLoading(true)

      // Generate Master QR Code
      const masterData: HealthRecordQR = {
        recordId: `master-${user?.uid}`,
        userId: user?.uid || "",
        type: "master",
        data: {
          userEmail: user?.email,
          profileType: "complete",
          accessLevel: "full",
        },
        generatedAt: new Date().toISOString(),
      }

      const masterQRCode = await generateQRCode(masterData)
      setMasterQR(masterQRCode)

      // Generate Document-specific QR Codes (mock data for now)
      const mockDocuments = [
        { id: "doc-1", type: "medical-report", name: "Blood Test Results" },
        { id: "doc-2", type: "vaccination-certificate", name: "COVID-19 Vaccination" },
        { id: "doc-3", type: "health-checkup", name: "General Health Checkup" },
      ]

      const documentQRPromises = mockDocuments.map(async (doc) => {
        const docData: HealthRecordQR = {
          recordId: doc.id,
          userId: user?.uid || "",
          type: "document",
          data: {
            documentType: doc.type,
            documentName: doc.name,
            accessLevel: "document-specific",
          },
          generatedAt: new Date().toISOString(),
        }

        const qrCode = await generateQRCode(docData)
        return {
          id: doc.id,
          type: doc.type,
          name: doc.name,
          qr: qrCode,
        }
      })

      const documentQRCodes = await Promise.all(documentQRPromises)
      setDocumentQRs(documentQRCodes)
    } catch (error) {
      console.error("Error generating QR codes:", error)
    } finally {
      setLoading(false)
    }
  }

  const downloadQR = (qrCode: string, filename: string) => {
    const link = document.createElement("a")
    link.href = qrCode
    link.download = `${filename}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const copyQRLink = async (qrId: string) => {
    const link = `${window.location.origin}/scan/${qrId}`
    await navigator.clipboard.writeText(link)
    setCopied(qrId)
    setTimeout(() => setCopied(""), 2000)
  }

  const shareQR = async (qrCode: string, title: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Kerala Health Records - ${title}`,
          text: "Access my health records",
          url: qrCode,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    }
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
              <p className="text-sm text-muted-foreground">QR Code Access</p>
            </div>
          </Link>
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Your QR Codes</h2>
            <p className="text-muted-foreground">
              Use these QR codes to provide instant access to your health records for hospitals and volunteers
            </p>
          </div>

          <Tabs defaultValue="master" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="master">Master QR Code</TabsTrigger>
              <TabsTrigger value="documents">Document QR Codes</TabsTrigger>
            </TabsList>

            {/* Master QR Code */}
            <TabsContent value="master">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <QrCode className="h-5 w-5" />
                        Master Health QR Code
                      </CardTitle>
                      <CardDescription>
                        Complete access to all your health records and profile information
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="flex flex-col items-center">
                      <div className="bg-white p-4 rounded-lg border-2 border-primary/20 mb-4">
                        {masterQR && (
                          <Image
                            src={masterQR || "/placeholder.svg"}
                            alt="Master QR Code"
                            width={200}
                            height={200}
                            className="rounded-lg"
                          />
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => downloadQR(masterQR, "master-health-qr")}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => copyQRLink("master")}>
                          {copied === "master" ? (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          ) : (
                            <Copy className="h-4 w-4 mr-2" />
                          )}
                          {copied === "master" ? "Copied!" : "Copy Link"}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => shareQR(masterQR, "Master Health Records")}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">What this QR code provides:</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Complete health profile and personal information
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          All uploaded medical documents and reports
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Current medications and treatment history
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Emergency contact information
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Government approval status
                        </li>
                      </ul>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                        <h4 className="font-semibold text-blue-800 mb-2">Usage Instructions:</h4>
                        <p className="text-sm text-blue-700">
                          Show this QR code to healthcare providers, hospitals, or authorized volunteers for instant
                          access to your complete health profile. This code updates automatically when you add new
                          documents.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Document-specific QR Codes */}
            <TabsContent value="documents">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Document-Specific QR Codes</CardTitle>
                    <CardDescription>Individual QR codes for specific health documents and reports</CardDescription>
                  </CardHeader>
                </Card>

                {documentQRs.map((doc) => (
                  <Card key={doc.id}>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-3 gap-6 items-center">
                        <div className="flex flex-col items-center">
                          <div className="bg-white p-3 rounded-lg border border-gray-200 mb-3">
                            <Image
                              src={doc.qr || "/placeholder.svg"}
                              alt={`QR Code for ${doc.name}`}
                              width={120}
                              height={120}
                              className="rounded"
                            />
                          </div>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" onClick={() => downloadQR(doc.qr, `${doc.type}-qr`)}>
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => copyQRLink(doc.id)}>
                              {copied === doc.id ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => shareQR(doc.qr, doc.name)}>
                              <Share2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <h3 className="text-lg font-semibold mb-2">{doc.name}</h3>
                          <Badge variant="outline" className="mb-3">
                            {doc.type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Badge>
                          <p className="text-sm text-muted-foreground mb-3">
                            This QR code provides access only to this specific document and related information.
                          </p>
                          <div className="text-xs text-muted-foreground">
                            Generated: {new Date().toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {documentQRs.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <QrCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Document QR Codes Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Upload health documents to generate individual QR codes for each document
                      </p>
                      <Link href="/health/upload">
                        <Button>Upload Documents</Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

export default memo(QRCodesPage)
