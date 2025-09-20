"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarInitials } from "@/components/ui/avatar"
import { User, Users, Edit3, Save, X, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { sampleUser } from "@/lib/sample-data"

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState(sampleUser)

  const handleSave = () => {
    // Save profile data logic here
    setIsEditing(false)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return CheckCircle
      case "rejected":
        return AlertCircle
      default:
        return Clock
    }
  }

  const StatusIcon = getStatusIcon(profileData.approvalStatus)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and settings</p>
          </div>
          <Button onClick={() => (isEditing ? handleSave() : setIsEditing(true))} className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        {/* Profile Overview Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl">
                  <AvatarInitials name={profileData.displayName} />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{profileData.displayName}</h2>
                  <Badge className={getStatusColor(profileData.approvalStatus)}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {profileData.approvalStatus.charAt(0).toUpperCase() + profileData.approvalStatus.slice(1)}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{profileData.email}</p>
                <p className="text-sm text-muted-foreground">
                  Member since {new Date(profileData.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Your basic personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="displayName">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="displayName"
                      value={profileData.displayName}
                      onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                    />
                  ) : (
                    <p className="mt-1 text-sm">{profileData.displayName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  ) : (
                    <p className="mt-1 text-sm">{profileData.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  ) : (
                    <p className="mt-1 text-sm">{profileData.phone}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="aadhaar">Aadhaar Number</Label>
                  {isEditing ? (
                    <Input
                      id="aadhaar"
                      value={profileData.aadhaar}
                      onChange={(e) => setProfileData({ ...profileData, aadhaar: e.target.value })}
                    />
                  ) : (
                    <p className="mt-1 text-sm">{profileData.aadhaar}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                {isEditing ? (
                  <Textarea
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    rows={3}
                  />
                ) : (
                  <p className="mt-1 text-sm">{profileData.address}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Emergency Contact
              </CardTitle>
              <CardDescription>Person to contact in case of emergency</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="emergencyName">Contact Name</Label>
                {isEditing ? (
                  <Input
                    id="emergencyName"
                    value={profileData.emergencyContact.name}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        emergencyContact: { ...profileData.emergencyContact, name: e.target.value },
                      })
                    }
                  />
                ) : (
                  <p className="mt-1 text-sm">{profileData.emergencyContact.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="emergencyPhone">Contact Phone</Label>
                {isEditing ? (
                  <Input
                    id="emergencyPhone"
                    value={profileData.emergencyContact.phone}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        emergencyContact: { ...profileData.emergencyContact, phone: e.target.value },
                      })
                    }
                  />
                ) : (
                  <p className="mt-1 text-sm">{profileData.emergencyContact.phone}</p>
                )}
              </div>

              <div>
                <Label htmlFor="emergencyRelation">Relationship</Label>
                {isEditing ? (
                  <Input
                    id="emergencyRelation"
                    value={profileData.emergencyContact.relation}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        emergencyContact: { ...profileData.emergencyContact, relation: e.target.value },
                      })
                    }
                  />
                ) : (
                  <p className="mt-1 text-sm">{profileData.emergencyContact.relation}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Completion Status */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Completion</CardTitle>
            <CardDescription>Complete your profile to improve your health record experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Profile Completion</span>
                <span className="text-sm text-muted-foreground">100%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "100%" }}></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Basic Info</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Contact Details</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Emergency Contact</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Verification</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {isEditing && (
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
          </Button>
        </div>
      )}
    </div>
  )
}