"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Clock, CheckCircle, XCircle, Search, Filter, Eye, User } from "lucide-react"
import { useRouter } from "next/navigation"

interface MigrationRequest {
  id: string
  applicantName: string
  email: string
  phone: string
  aadhaar: string
  sourceState: string
  destination: string
  purpose: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  documents: {
    healthCertificate: boolean
    covidTest: boolean
    vaccination: boolean
    identity: boolean
  }
  healthScore: number
  riskLevel: "low" | "medium" | "high"
}

export default function MigrationRequestsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [requests, setRequests] = useState<MigrationRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<MigrationRequest[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<MigrationRequest | null>(null)

  useEffect(() => {
    if (!user || user.email !== "admin@kerala.gov.in") {
      router.push("/dashboard")
      return
    }

    // Generate demo migration requests
    const demoRequests: MigrationRequest[] = [
      {
        id: "MR-2024-001",
        applicantName: "Rajesh Kumar",
        email: "rajesh.kumar@email.com",
        phone: "+91 9876543210",
        aadhaar: "1234-5678-9012",
        sourceState: "Tamil Nadu",
        destination: "Kochi, Kerala",
        purpose: "Employment - IT Sector",
        status: "pending",
        submittedAt: "2024-01-15T10:30:00Z",
        documents: {
          healthCertificate: true,
          covidTest: true,
          vaccination: true,
          identity: true,
        },
        healthScore: 85,
        riskLevel: "low",
      },
      {
        id: "MR-2024-002",
        applicantName: "Priya Sharma",
        email: "priya.sharma@email.com",
        phone: "+91 9876543211",
        aadhaar: "2345-6789-0123",
        sourceState: "Karnataka",
        destination: "Thiruvananthapuram, Kerala",
        purpose: "Education - Medical College",
        status: "approved",
        submittedAt: "2024-01-14T14:20:00Z",
        reviewedAt: "2024-01-15T09:15:00Z",
        reviewedBy: "Dr. Admin",
        documents: {
          healthCertificate: true,
          covidTest: true,
          vaccination: true,
          identity: true,
        },
        healthScore: 92,
        riskLevel: "low",
      },
      {
        id: "MR-2024-003",
        applicantName: "Mohammed Ali",
        email: "mohammed.ali@email.com",
        phone: "+91 9876543212",
        aadhaar: "3456-7890-1234",
        sourceState: "Andhra Pradesh",
        destination: "Kozhikode, Kerala",
        purpose: "Business - Trade",
        status: "rejected",
        submittedAt: "2024-01-13T16:45:00Z",
        reviewedAt: "2024-01-14T11:30:00Z",
        reviewedBy: "Dr. Admin",
        documents: {
          healthCertificate: false,
          covidTest: true,
          vaccination: false,
          identity: true,
        },
        healthScore: 65,
        riskLevel: "medium",
      },
      {
        id: "MR-2024-004",
        applicantName: "Anita Reddy",
        email: "anita.reddy@email.com",
        phone: "+91 9876543213",
        aadhaar: "4567-8901-2345",
        sourceState: "Telangana",
        destination: "Ernakulam, Kerala",
        purpose: "Employment - Healthcare",
        status: "pending",
        submittedAt: "2024-01-15T08:15:00Z",
        documents: {
          healthCertificate: true,
          covidTest: true,
          vaccination: true,
          identity: true,
        },
        healthScore: 88,
        riskLevel: "low",
      },
    ]

    setRequests(demoRequests)
    setFilteredRequests(demoRequests)
  }, [user, router])

  useEffect(() => {
    let filtered = requests

    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter)
    }

    setFilteredRequests(filtered)
  }, [requests, searchTerm, statusFilter])

  const handleStatusUpdate = (requestId: string, newStatus: "approved" | "rejected") => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: newStatus,
              reviewedAt: new Date().toISOString(),
              reviewedBy: user?.displayName || "Admin",
            }
          : request,
      ),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const pendingCount = requests.filter((r) => r.status === "pending").length
  const approvedCount = requests.filter((r) => r.status === "approved").length
  const rejectedCount = requests.filter((r) => r.status === "rejected").length

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Migration Requests</h1>
            <p className="text-muted-foreground">Review and manage interstate migration applications</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold">{approvedCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold">{rejectedCount}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{requests.length}</p>
                </div>
                <User className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Migration Applications</CardTitle>
            <CardDescription>Review and process interstate migration requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Health Score</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.applicantName}</p>
                        <p className="text-sm text-muted-foreground">{request.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{request.sourceState}</TableCell>
                    <TableCell>{request.destination}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRiskColor(request.riskLevel)}>
                        {request.riskLevel.charAt(0).toUpperCase() + request.riskLevel.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${request.healthScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{request.healthScore}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(request.submittedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Migration Request Details</DialogTitle>
                              <DialogDescription>
                                Review application details for {request.applicantName}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedRequest && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Personal Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <p>
                                        <strong>Name:</strong> {selectedRequest.applicantName}
                                      </p>
                                      <p>
                                        <strong>Email:</strong> {selectedRequest.email}
                                      </p>
                                      <p>
                                        <strong>Phone:</strong> {selectedRequest.phone}
                                      </p>
                                      <p>
                                        <strong>Aadhaar:</strong> {selectedRequest.aadhaar}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">Migration Details</h4>
                                    <div className="space-y-2 text-sm">
                                      <p>
                                        <strong>From:</strong> {selectedRequest.sourceState}
                                      </p>
                                      <p>
                                        <strong>To:</strong> {selectedRequest.destination}
                                      </p>
                                      <p>
                                        <strong>Purpose:</strong> {selectedRequest.purpose}
                                      </p>
                                      <p>
                                        <strong>Risk Level:</strong>
                                        <Badge className={`ml-2 ${getRiskColor(selectedRequest.riskLevel)}`}>
                                          {selectedRequest.riskLevel}
                                        </Badge>
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-2">Document Status</h4>
                                  <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(selectedRequest.documents).map(([doc, status]) => (
                                      <div key={doc} className="flex items-center gap-2">
                                        {status ? (
                                          <CheckCircle className="h-4 w-4 text-green-500" />
                                        ) : (
                                          <XCircle className="h-4 w-4 text-red-500" />
                                        )}
                                        <span className="text-sm capitalize">
                                          {doc.replace(/([A-Z])/g, " $1").trim()}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {selectedRequest.status === "pending" && (
                                  <div className="flex gap-2 pt-4 border-t">
                                    <Button
                                      onClick={() => {
                                        handleStatusUpdate(selectedRequest.id, "approved")
                                        setSelectedRequest(null)
                                      }}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Approve
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={() => {
                                        handleStatusUpdate(selectedRequest.id, "rejected")
                                        setSelectedRequest(null)
                                      }}
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {request.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(request.id, "approved")}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusUpdate(request.id, "rejected")}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
