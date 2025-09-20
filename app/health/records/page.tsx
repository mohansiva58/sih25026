"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LanguageSelector } from "@/components/language-selector"
import { Heart, FileText, Search, Download, Eye, Calendar, QrCode } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface HealthRecord {
  id: string
  documentType: string
  description: string
  uploadDate: string
  status: "pending-review" | "approved" | "rejected"
  files: Array<{
    name: string
    type: string
    size: number
    url: string
  }>
  qrCodeGenerated: boolean
}

export default function HealthRecordsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<HealthRecord[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    // Mock data for demonstration
    const mockRecords: HealthRecord[] = [
      {
        id: "1",
        documentType: "blood-test",
        description: "Complete Blood Count and Lipid Profile",
        uploadDate: "2024-01-15",
        status: "approved",
        files: [{ name: "blood-test-results.pdf", type: "application/pdf", size: 245760, url: "#" }],
        qrCodeGenerated: true,
      },
      {
        id: "2",
        documentType: "vaccination-certificate",
        description: "COVID-19 Vaccination Certificate",
        uploadDate: "2024-01-10",
        status: "approved",
        files: [{ name: "covid-vaccine-cert.jpg", type: "image/jpeg", size: 156432, url: "#" }],
        qrCodeGenerated: true,
      },
      {
        id: "3",
        documentType: "medical-report",
        description: "General Health Checkup Report",
        uploadDate: "2024-01-20",
        status: "pending-review",
        files: [{ name: "health-checkup.pdf", type: "application/pdf", size: 512000, url: "#" }],
        qrCodeGenerated: false,
      },
    ]

    setRecords(mockRecords)
    setFilteredRecords(mockRecords)
    setLoading(false)
  }, [user, router])

  useEffect(() => {
    let filtered = records

    if (searchTerm) {
      filtered = filtered.filter(
        (record) =>
          record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.documentType.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((record) => record.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((record) => record.documentType === typeFilter)
    }

    setFilteredRecords(filtered)
  }, [records, searchTerm, statusFilter, typeFilter])

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

  const formatDocumentType = (type: string) => {
    return type.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())
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
              <p className="text-sm text-muted-foreground">Health Records</p>
            </div>
          </Link>
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Your Health Records</h2>
            <p className="text-muted-foreground">
              View and manage all your uploaded health documents and their approval status
            </p>
          </div>

          {/* Filters and Search */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending-review">Pending Review</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="medical-report">Medical Report</SelectItem>
                    <SelectItem value="vaccination-certificate">Vaccination Certificate</SelectItem>
                    <SelectItem value="blood-test">Blood Test</SelectItem>
                    <SelectItem value="x-ray">X-Ray/Scan</SelectItem>
                    <SelectItem value="prescription">Prescription</SelectItem>
                    <SelectItem value="health-checkup">Health Checkup</SelectItem>
                  </SelectContent>
                </Select>

                <Link href="/health/upload">
                  <Button className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Upload New
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Records List */}
          <div className="space-y-6">
            {filteredRecords.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Records Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {records.length === 0
                      ? "You haven't uploaded any health documents yet."
                      : "No records match your current filters."}
                  </p>
                  {records.length === 0 && (
                    <Link href="/health/upload">
                      <Button>Upload Your First Document</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredRecords.map((record) => (
                <Card key={record.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{record.description}</h3>
                          <Badge className={getStatusColor(record.status)}>
                            {record.status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Badge>
                          {record.qrCodeGenerated && (
                            <Badge variant="outline" className="text-primary border-primary">
                              <QrCode className="h-3 w-3 mr-1" />
                              QR Generated
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {formatDocumentType(record.documentType)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(record.uploadDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Files */}
                    <div className="space-y-2 mb-4">
                      <h4 className="font-medium text-sm">Attached Files:</h4>
                      {record.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-primary/10 rounded flex items-center justify-center">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
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

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {record.qrCodeGenerated && (
                        <Link href="/qr-codes">
                          <Button variant="outline" size="sm">
                            <QrCode className="h-4 w-4 mr-2" />
                            View QR Code
                          </Button>
                        </Link>
                      )}
                      {record.status === "rejected" && (
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Re-upload
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
