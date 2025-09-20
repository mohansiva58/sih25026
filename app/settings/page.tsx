"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, Bell, Shield, User, Globe, Moon, Sun, Smartphone, Mail, Phone } from "lucide-react"

interface SettingItem {
  id: string
  label: string
  type: "input" | "toggle" | "select"
  value: string | boolean
  options?: string[]
}

interface SettingsCategory {
  id: string
  name: string
  icon: any
  settings: SettingItem[]
}

const settingsCategories: SettingsCategory[] = [
  {
    id: "profile",
    name: "Profile & Account",
    icon: User,
    settings: [
      { id: "name", label: "Full Name", type: "input", value: "Arjun Krishnan" },
      { id: "email", label: "Email Address", type: "input", value: "arjun.k@email.com" },
      { id: "phone", label: "Phone Number", type: "input", value: "+91 98765 43210" },
      { id: "emergency_contact", label: "Emergency Contact", type: "input", value: "+91 98765 43211" }
    ]
  },
  {
    id: "notifications", 
    name: "Notifications",
    icon: Bell,
    settings: [
      { id: "medication_reminders", label: "Medication Reminders", type: "toggle", value: true },
      { id: "appointment_alerts", label: "Appointment Alerts", type: "toggle", value: true },
      { id: "health_alerts", label: "Health Status Alerts", type: "toggle", value: true },
      { id: "system_updates", label: "System Updates", type: "toggle", value: false },
      { id: "email_notifications", label: "Email Notifications", type: "toggle", value: true },
      { id: "sms_notifications", label: "SMS Notifications", type: "toggle", value: false }
    ]
  },
  {
    id: "privacy",
    name: "Privacy & Security",
    icon: Shield,
    settings: [
      { id: "two_factor", label: "Two-Factor Authentication", type: "toggle", value: false },
      { id: "data_sharing", label: "Allow Data Sharing for Research", type: "toggle", value: true },
      { id: "location_tracking", label: "Location Tracking", type: "toggle", value: false },
      { id: "biometric_access", label: "Biometric Access", type: "toggle", value: true }
    ]
  },
  {
    id: "preferences",
    name: "App Preferences",
    icon: Settings,
    settings: [
      { id: "language", label: "Language", type: "select", value: "English", options: ["English", "Malayalam", "Hindi"] },
      { id: "theme", label: "Theme", type: "select", value: "Light", options: ["Light", "Dark", "System"] },
      { id: "date_format", label: "Date Format", type: "select", value: "DD/MM/YYYY", options: ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"] },
      { id: "units", label: "Measurement Units", type: "select", value: "Metric", options: ["Metric", "Imperial"] }
    ]
  }
]

export default function SettingsPage() {
  const [activeCategory, setActiveCategory] = useState("profile")
  const [settings, setSettings] = useState(() => {
    const initialSettings: Record<string, any> = {}
    settingsCategories.forEach(category => {
      category.settings.forEach(setting => {
        initialSettings[setting.id] = setting.value
      })
    })
    return initialSettings
  })

  const handleToggle = (settingId: string) => {
    setSettings(prev => ({
      ...prev,
      [settingId]: !prev[settingId]
    }))
  }

  const handleInputChange = (settingId: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [settingId]: value
    }))
  }

  const activeSettings = settingsCategories.find(cat => cat.id === activeCategory)

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Settings className="h-8 w-8 text-blue-600" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your account preferences and application settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Categories Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {settingsCategories.map((category) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                        activeCategory === category.id
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{category.name}</span>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Settings Content */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {activeSettings && <activeSettings.icon className="h-5 w-5" />}
                {activeSettings?.name}
              </CardTitle>
              <CardDescription>
                {activeCategory === "profile" && "Manage your personal information and account details"}
                {activeCategory === "notifications" && "Control how and when you receive notifications"}
                {activeCategory === "privacy" && "Configure privacy and security settings"}
                {activeCategory === "preferences" && "Customize your app experience"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {activeSettings?.settings.map((setting) => (
                  <div key={setting.id} className="space-y-2">
                    {setting.type === "toggle" && (
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <Label className="font-medium">{setting.label}</Label>
                          {setting.id === "two_factor" && (
                            <p className="text-sm text-muted-foreground">
                              Add an extra layer of security to your account
                            </p>
                          )}
                          {setting.id === "data_sharing" && (
                            <p className="text-sm text-muted-foreground">
                              Help improve healthcare by sharing anonymous data
                            </p>
                          )}
                        </div>
                        <Switch
                          checked={settings[setting.id]}
                          onCheckedChange={() => handleToggle(setting.id)}
                        />
                      </div>
                    )}

                    {setting.type === "input" && (
                      <div className="space-y-2">
                        <Label className="font-medium">{setting.label}</Label>
                        <Input
                          value={settings[setting.id]}
                          onChange={(e) => handleInputChange(setting.id, e.target.value)}
                          className="max-w-md"
                        />
                      </div>
                    )}

                    {setting.type === "select" && (
                      <div className="space-y-2">
                        <Label className="font-medium">{setting.label}</Label>
                        <select
                          value={settings[setting.id]}
                          onChange={(e) => handleInputChange(setting.id, e.target.value)}
                          className="max-w-md p-2 border rounded-md"
                        >
                          {(setting as SettingItem & { options: string[] }).options?.map((option: string) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                ))}

                {/* Additional sections for specific categories */}
                {activeCategory === "notifications" && (
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Notification Channels</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Push Notifications</span>
                        <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Email</span>
                        <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">SMS</span>
                        <Badge className="bg-gray-100 text-gray-800">Disabled</Badge>
                      </div>
                    </div>
                  </div>
                )}

                {activeCategory === "privacy" && (
                  <div className="mt-8 space-y-4">
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-900 mb-2">Data Export</h4>
                      <p className="text-sm text-yellow-800 mb-3">
                        Download a copy of your health data for personal records or transfer to another provider.
                      </p>
                      <Button size="sm" variant="outline" className="border-yellow-300">
                        Request Data Export
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-900 mb-2">Delete Account</h4>
                      <p className="text-sm text-red-800 mb-3">
                        Permanently delete your account and all associated health data. This action cannot be undone.
                      </p>
                      <Button size="sm" variant="outline" className="border-red-300 text-red-700">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                )}

                {activeCategory === "preferences" && (
                  <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">App Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Version:</span>
                        <span className="ml-2 font-medium">2.1.0</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Build:</span>
                        <span className="ml-2 font-medium">20250920.1</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Update:</span>
                        <span className="ml-2 font-medium">Sep 20, 2025</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Platform:</span>
                        <span className="ml-2 font-medium">Web App</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="mt-8 flex gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
                <Button variant="outline">
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}