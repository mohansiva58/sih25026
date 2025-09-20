"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LanguageSelector } from "@/components/language-selector"
import {
  Heart,
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Eye,
  Download,
  BarChart3,
  AlertTriangle,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface UserApplication {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  aadhaarNumber: string
  submissionDate: string
  status: "pending" | "approved" | "rejected"
  documentsCount: number
  lastUpdated: string
  priority: "high" | "medium" | "low"
  reviewNotes?: string
}

interface DashboardStats {
  totalApplications: number
  pendingReview: number
  approved: number
  rejected: number
  todaySubmissions: number
}

export default function AdminDashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [applications, setApplications] = useState<UserApplication[]>([])
  const [filteredApplications, setFilteredApplications] = useState<UserApplication[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    pendingReview: 0,
    approved: 0,
    rejected: 0,
    todaySubmissions: 0,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is admin (in real app, this would be role-based)
    if (!user) {
      router.push("/auth/login")
      return
    }

    // Mock data for demonstration
    const mockApplications: UserApplication[] = [
      {
        id: "1",
        fullName: "Rajesh Kumar",
        email: "rajesh.kumar@email.com",
        phoneNumber: "+91 9876543210",
        aadhaarNumber: "1234-5678-9012",
        submissionDate: "2024-01-20",
        status: "pending",
        documentsCount: 3,
        lastUpdated: "2024-01-20",
        priority: "high",
      },
      {
        id: "2",
        fullName: "Priya Sharma",
        email: "priya.sharma@email.com",
        phoneNumber: "+91 9876543211",
        aadhaarNumber: "2345-6789-0123",
        submissionDate: "2024-01-19",
        status: "approved",
        documentsCount: 4,
        lastUpdated: "2024-01-19",
        priority: "medium",
      },
      {
        id: "3",
        fullName: "Mohammed Ali",
        email: "mohammed.ali@email.com",
        phoneNumber: "+91 9876543212",
        aadhaarNumber: "3456-7890-1234",
        submissionDate: "2024-01-18",
        status: "rejected",
        documentsCount: 2,
        lastUpdated: "2024-01-18",
        priority: "low",
        reviewNotes: "Incomplete vaccination records. Please resubmit with complete COVID-19 vaccination certificate.",
      },
      {
        id: "4",
        fullName: "Sunita Devi",
        email: "sunita.devi@email.com",
        phoneNumber: "+91 9876543213",
        aadhaarNumber: "4567-8901-2345",
        submissionDate: "2024-01-21",
        status: "pending",
        documentsCount: 5,
        lastUpdated: "2024-01-21",
        priority: "medium",
      },
    ]

    setApplications(mockApplications)
    setFilteredApplications(mockApplications)

    // Calculate stats
    const statsData: DashboardStats = {
      totalApplications: mockApplications.length,
      pendingReview: mockApplications.filter((app) => app.status === "pending").length,
      approved: mockApplications.filter((app) => app.status === "approved").length,
      rejected: mockApplications.filter((app) => app.status === "rejected").length,
      todaySubmissions: mockApplications.filter(
        (app) => new Date(app.submissionDate).toDateString() === new Date().toDateString(),
      ).length,
    }
    setStats(statsData)
    setLoading(false)
  }, [user, router])

  useEffect(() => {
    let filtered = applications

    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.aadhaarNumber.includes(searchTerm),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((app) => app.priority === priorityFilter)
    }

    setFilteredApplications(filtered)
  }, [applications, searchTerm, statusFilter, priorityFilter])

  const handleStatusUpdate = async (applicationId: string, newStatus: "approved" | "rejected", notes?: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? { ...app, status: newStatus, lastUpdated: new Date().toISOString().split("T")[0], reviewNotes: notes }
          : app,
      ),
    )
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
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
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Kerala Health Department</h1>
              <p className="text-sm text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
            <p className="text-muted-foreground">Review and manage migrant worker health record applications</p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              {/* Stats Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                        <p className="text-2xl font-bold">{stats.totalApplications}</p>
                      </div>
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                        <p className="text-2xl font-bold text-yellow-600">{stats.pendingReview}</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Approved</p>
                        <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                        <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                      </div>
                      <XCircle className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Today's Submissions</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.todaySubmissions}</p>
                      </div>
                      <FileText className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Latest health record submissions requiring review</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications.slice(0, 3).map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{app.fullName}</p>
                            <p className="text-sm text-muted-foreground">{app.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(app.status)}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </Badge>
                          <Badge className={getPriorityColor(app.priority)}>
                            {app.priority.charAt(0).toUpperCase() + app.priority.slice(1)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(app.submissionDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Applications Tab */}
            <TabsContent value="applications">
              {/* Filters */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search applications..."
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
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      More Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Applications List */}
              <div className="space-y-4">
                {filteredApplications.map((app) => (
                  <Card key={app.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{app.fullName}</h3>
                            <Badge className={getStatusColor(app.status)}>
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </Badge>
                            <Badge className={getPriorityColor(app.priority)}>
                              {app.priority.charAt(0).toUpperCase() + app.priority.slice(1)} Priority
                            </Badge>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div>
                              <p>
                                <strong>Email:</strong> {app.email}
                              </p>
                              <p>
                                <strong>Phone:</strong> {app.phoneNumber}
                              </p>
                            </div>
                            <div>
                              <p>
                                <strong>Aadhaar:</strong> {app.aadhaarNumber}
                              </p>
                              <p>
                                <strong>Documents:</strong> {app.documentsCount} files
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>Submitted: {new Date(app.submissionDate).toLocaleDateString()}</span>
                            <span>Last Updated: {new Date(app.lastUpdated).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {app.reviewNotes && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-red-800">Review Notes:</p>
                              <p className="text-sm text-red-700">{app.reviewNotes}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-4 border-t">
                        <Link href={`/admin/applications/${app.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Review Details
                          </Button>
                        </Link>

                        {app.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleStatusUpdate(app.id, "approved")}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleStatusUpdate(app.id, "rejected", "Please provide additional documentation")
                              }
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}

                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredApplications.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Applications Found</h3>
                      <p className="text-muted-foreground">No applications match your current filters.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Application Status Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pending Review</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-500 h-2 rounded-full"
                              style={{ width: `${(stats.pendingReview / stats.totalApplications) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{stats.pendingReview}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Approved</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${(stats.approved / stats.totalApplications) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{stats.approved}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Rejected</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-red-500 h-2 rounded-full"
                              style={{ width: `${(stats.rejected / stats.totalApplications) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{stats.rejected}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common administrative tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Export Applications Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Download Bulk Documents
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Admin Users
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Generate Analytics Report
                    </Button>
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
