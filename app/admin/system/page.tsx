"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Server, 
  Database, 
  Wifi, 
  HardDrive, 
  Cpu, 
  MemoryStick,
  Activity,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Settings,
  Monitor,
  Shield,
  Clock,
  Users,
  FileText,
  Download,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react"

const systemMetrics = {
  servers: [
    {
      id: "web-01",
      name: "Web Server 01", 
      status: "healthy",
      uptime: "99.98%",
      cpu: 45,
      memory: 67,
      disk: 78,
      location: "Primary DC",
      lastCheck: "2 minutes ago"
    },
    {
      id: "web-02",
      name: "Web Server 02",
      status: "healthy", 
      uptime: "99.95%",
      cpu: 52,
      memory: 71,
      disk: 82,
      location: "Primary DC",
      lastCheck: "1 minute ago"
    },
    {
      id: "db-01",
      name: "Database Server",
      status: "warning",
      uptime: "99.87%", 
      cpu: 78,
      memory: 89,
      disk: 65,
      location: "Primary DC",
      lastCheck: "30 seconds ago"
    },
    {
      id: "cache-01", 
      name: "Cache Server",
      status: "healthy",
      uptime: "99.99%",
      cpu: 23,
      memory: 45,
      disk: 34,
      location: "Secondary DC", 
      lastCheck: "1 minute ago"
    }
  ],
  services: [
    {
      name: "Authentication Service",
      status: "healthy",
      responseTime: "95ms",
      requestsPerMin: 1250,
      errorRate: "0.02%"
    },
    {
      name: "Document Processing",
      status: "healthy", 
      responseTime: "340ms",
      requestsPerMin: 89,
      errorRate: "0.15%"
    },
    {
      name: "QR Code Generator",
      status: "healthy",
      responseTime: "120ms", 
      requestsPerMin: 234,
      errorRate: "0.01%"
    },
    {
      name: "Firebase Integration",
      status: "warning",
      responseTime: "1.2s",
      requestsPerMin: 45,
      errorRate: "2.1%"
    },
    {
      name: "SMS Notification",
      status: "healthy",
      responseTime: "450ms",
      requestsPerMin: 156,
      errorRate: "0.05%" 
    }
  ],
  database: {
    totalRecords: 125430,
    activeConnections: 24,
    queryResponseTime: "45ms",
    storageUsed: "78%",
    backupStatus: "completed",
    lastBackup: "2025-09-20 02:00:00"
  },
  security: {
    activeThreats: 0,
    blockedAttempts: 127,
    lastSecurityScan: "2025-09-20 01:00:00",
    vulnerabilities: 2,
    patchLevel: "current"
  }
}

const recentActivity = [
  {
    id: "1",
    type: "info",
    message: "System backup completed successfully",
    timestamp: "2025-09-20 02:15:23",
    service: "Database"
  },
  {
    id: "2", 
    type: "warning",
    message: "High memory usage detected on DB server",
    timestamp: "2025-09-20 01:45:12",
    service: "Database Server"
  },
  {
    id: "3",
    type: "success", 
    message: "Security scan completed - no vulnerabilities found",
    timestamp: "2025-09-20 01:00:00",
    service: "Security"
  },
  {
    id: "4",
    type: "info",
    message: "Cache server restarted for maintenance",
    timestamp: "2025-09-19 23:30:00",
    service: "Cache Server"
  },
  {
    id: "5",
    type: "error",
    message: "Firebase API rate limit exceeded", 
    timestamp: "2025-09-19 22:15:44",
    service: "Firebase Integration"
  }
]

export default function AdminSystemPage() {
  const [refreshing, setRefreshing] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h")

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setRefreshing(false)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      healthy: { variant: "default" as const, icon: CheckCircle, text: "Healthy", color: "text-green-600" },
      warning: { variant: "secondary" as const, icon: AlertTriangle, text: "Warning", color: "text-yellow-600" },
      error: { variant: "destructive" as const, icon: AlertTriangle, text: "Error", color: "text-red-600" }
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

  const getActivityIcon = (type: string) => {
    const icons = {
      info: { icon: Monitor, color: "text-blue-600" },
      warning: { icon: AlertTriangle, color: "text-yellow-600" }, 
      success: { icon: CheckCircle, color: "text-green-600" },
      error: { icon: AlertTriangle, color: "text-red-600" }
    }
    
    const config = icons[type as keyof typeof icons] || icons.info
    const Icon = config.icon
    return <Icon className={`h-4 w-4 ${config.color}`} />
  }

  const getUtilizationColor = (usage: number) => {
    if (usage >= 90) return "bg-red-500"
    if (usage >= 75) return "bg-yellow-500"
    if (usage >= 50) return "bg-blue-500"
    return "bg-green-500"
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Monitor className="h-8 w-8 text-blue-600" />
              System Health
            </h1>
            <p className="text-muted-foreground mt-2">
              Monitor system performance, security, and infrastructure status
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Overall Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">System Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-xl font-bold text-green-600">Operational</p>
                  </div>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold text-blue-600">2,341</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                  <p className="text-2xl font-bold text-emerald-600">99.98%</p>
                </div>
                <Activity className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Security</p>
                  <p className="text-2xl font-bold text-purple-600">Secure</p>
                </div>
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="servers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="servers">Servers</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="servers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Server Infrastructure
                </CardTitle>
                <CardDescription>
                  Real-time server performance and utilization metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {systemMetrics.servers.map((server) => (
                    <div key={server.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold">{server.name}</h3>
                            {getStatusBadge(server.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Uptime: {server.uptime}</span>
                            <span>Location: {server.location}</span>
                            <span>Last Check: {server.lastCheck}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium flex items-center gap-1">
                              <Cpu className="h-4 w-4" />
                              CPU Usage
                            </span>
                            <span className="text-sm font-medium">{server.cpu}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getUtilizationColor(server.cpu)}`}
                              style={{ width: `${server.cpu}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium flex items-center gap-1">
                              <MemoryStick className="h-4 w-4" />
                              Memory
                            </span>
                            <span className="text-sm font-medium">{server.memory}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getUtilizationColor(server.memory)}`}
                              style={{ width: `${server.memory}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium flex items-center gap-1">
                              <HardDrive className="h-4 w-4" />
                              Disk
                            </span>
                            <span className="text-sm font-medium">{server.disk}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getUtilizationColor(server.disk)}`}
                              style={{ width: `${server.disk}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  Application Services
                </CardTitle>
                <CardDescription>
                  Service health and performance monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemMetrics.services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          service.status === 'healthy' ? 'bg-green-500' : 
                          service.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        } animate-pulse`}></div>
                        <div>
                          <h3 className="font-semibold">{service.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Response: {service.responseTime}</span>
                            <span>Requests/min: {service.requestsPerMin}</span>
                            <span>Error Rate: {service.errorRate}</span>
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(service.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Health
                </CardTitle>
                <CardDescription>
                  Database performance and storage metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Records</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {systemMetrics.database.totalRecords.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Connections</p>
                      <p className="text-2xl font-bold text-green-600">
                        {systemMetrics.database.activeConnections}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Query Response Time</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {systemMetrics.database.queryResponseTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Storage Used</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {systemMetrics.database.storageUsed}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Backup Status</p>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <p className="text-lg font-semibold text-green-600 capitalize">
                          {systemMetrics.database.backupStatus}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Last Backup</p>
                      <p className="text-sm text-gray-600">
                        {new Date(systemMetrics.database.lastBackup).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Status
                </CardTitle>
                <CardDescription>
                  System security monitoring and threat detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold text-green-800">No Active Threats</h3>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        System is secure with no detected threats
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Blocked Attempts (24h)</p>
                      <p className="text-2xl font-bold text-red-600">{systemMetrics.security.blockedAttempts}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Vulnerabilities</p>
                      <p className="text-2xl font-bold text-yellow-600">{systemMetrics.security.vulnerabilities}</p>
                      <p className="text-xs text-muted-foreground">2 low-priority items</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Last Security Scan</p>
                      <p className="text-lg font-semibold">
                        {new Date(systemMetrics.security.lastSecurityScan).toLocaleString()}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Patch Level</p>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <p className="text-lg font-semibold text-green-600 capitalize">
                          {systemMetrics.security.patchLevel}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent System Activity
            </CardTitle>
            <CardDescription>
              Latest system events, alerts, and maintenance activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{activity.service}</span>
                      <span>•</span>
                      <span>{new Date(activity.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}