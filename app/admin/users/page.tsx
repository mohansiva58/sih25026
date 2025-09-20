"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  Search, 
  Filter, 
  MoreVertical, 
  Shield, 
  UserCheck, 
  UserX, 
  Mail, 
  Phone,
  Calendar,
  MapPin,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Users
} from "lucide-react"

// Reduced sample data for faster loading
const sampleUsers = [
  {
    id: "1",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@gmail.com",
    phone: "+91 9876543210",
    aadhaarId: "1234-5678-9012",
    status: "verified",
    registrationDate: "2025-08-15",
    lastLogin: "2025-09-20",
    location: "Thiruvananthapuram",
    healthRecords: 5,
    role: "citizen",
    profileComplete: 100,
    avatar: "/api/placeholder/40/40"
  },
  {
    id: "2", 
    name: "Priya Nair",
    email: "priya.nair@yahoo.com",
    phone: "+91 9876543211",
    aadhaarId: "2345-6789-0123",
    status: "pending",
    registrationDate: "2025-09-18", 
    lastLogin: "2025-09-19",
    location: "Kochi",
    healthRecords: 2,
    role: "citizen",
    profileComplete: 75,
    avatar: "/api/placeholder/40/40"
  },
  {
    id: "3",
    name: "Dr. Suresh Menon",
    email: "dr.menon@kerala.gov.in",
    phone: "+91 9876543212", 
    aadhaarId: "3456-7890-1234",
    status: "verified",
    registrationDate: "2025-07-10",
    lastLogin: "2025-09-20",
    location: "Kozhikode",
    healthRecords: 0,
    role: "healthcare_provider",
    profileComplete: 100,
    avatar: "/api/placeholder/40/40"
  }
]

const userStats = {
  totalUsers: 12543,
  newThisMonth: 342,
  verifiedUsers: 11789,
  pendingVerification: 567,
  suspendedUsers: 187,
  activeToday: 2341
}

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedRole, setSelectedRole] = useState<string>("all")

  const filteredUsers = sampleUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.aadhaarId.includes(searchTerm)
    
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    
    return matchesSearch && matchesStatus && matchesRole
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      verified: { variant: "default" as const, icon: CheckCircle, text: "Verified" },
      pending: { variant: "secondary" as const, icon: Clock, text: "Pending" },
      suspended: { variant: "destructive" as const, icon: AlertCircle, text: "Suspended" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig]
    if (!config) return null
    
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    )
  }

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { color: "bg-purple-100 text-purple-800", text: "Admin" },
      healthcare_provider: { color: "bg-blue-100 text-blue-800", text: "Healthcare Provider" },
      citizen: { color: "bg-green-100 text-green-800", text: "Citizen" }
    }
    
    const config = roleConfig[role as keyof typeof roleConfig]
    if (!config) return null
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              User Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage system users, verification status, and access controls
            </p>
          </div>
          <Button>
            <Shield className="h-4 w-4 mr-2" />
            Admin Actions
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-blue-600">{userStats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">New This Month</p>
                  <p className="text-2xl font-bold text-green-600">+{userStats.newThisMonth}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Verified</p>
                  <p className="text-2xl font-bold text-emerald-600">{userStats.verifiedUsers.toLocaleString()}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{userStats.pendingVerification}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Suspended</p>
                  <p className="text-2xl font-bold text-red-600">{userStats.suspendedUsers}</p>
                </div>
                <UserX className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Today</p>
                  <p className="text-2xl font-bold text-purple-600">{userStats.activeToday.toLocaleString()}</p>
                </div>
                <Activity className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, email, or Aadhaar ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select 
                  value={selectedStatus} 
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
                
                <select 
                  value={selectedRole} 
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="healthcare_provider">Healthcare Provider</option>
                  <option value="citizen">Citizen</option>
                </select>
                
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>User Directory ({filteredUsers.length})</CardTitle>
            <CardDescription>
              Complete list of system users with verification and access status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{user.name}</h3>
                        {getStatusBadge(user.status)}
                        {getRoleBadge(user.role)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {user.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {user.location}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span>Aadhaar: {user.aadhaarId}</span>
                        <span>Records: {user.healthRecords}</span>
                        <span>Profile: {user.profileComplete}%</span>
                        <span>Last Login: {new Date(user.lastLogin).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600">No users found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or filters
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}