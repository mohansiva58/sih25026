export interface UserProfile {
  uid: string
  email: string
  displayName?: string
  fullName?: string
  phone?: string
  aadhaar?: string
  address?: string
  emergencyContact?: string
  preferredLanguage?: string
  dateOfBirth?: string
  bloodGroup?: string
  medicalConditions?: string[]
  allergies?: string[]
  approvalStatus?: "pending" | "approved" | "rejected"
  createdAt: string
  updatedAt: string
}

export interface HealthRecord {
  id: string
  userId: string
  type: "blood_test" | "x_ray" | "medical_certificate" | "vaccination" | "other"
  title: string
  description?: string
  fileUrl?: string
  fileName?: string
  uploadDate: string
  status: "pending" | "approved" | "rejected"
  reviewNotes?: string
}

export interface QRCode {
  id: string
  userId: string
  data: string
  createdAt: string
  expiresAt?: string
  isActive: boolean
}

// User Profile Management
export const saveUserProfile = (profile: UserProfile) => {
  const profiles = getUserProfiles()
  const existingIndex = profiles.findIndex((p) => p.uid === profile.uid)

  if (existingIndex >= 0) {
    profiles[existingIndex] = { ...profile, updatedAt: new Date().toISOString() }
  } else {
    profiles.push({ ...profile, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
  }

  localStorage.setItem("healthapp_profiles", JSON.stringify(profiles))
}

export const getUserProfile = (uid: string): UserProfile | null => {
  const profiles = getUserProfiles()
  return profiles.find((p) => p.uid === uid) || null
}

export const getUserProfiles = (): UserProfile[] => {
  return JSON.parse(localStorage.getItem("healthapp_profiles") || "[]")
}

// Health Records Management
export const saveHealthRecord = (record: HealthRecord) => {
  const records = getHealthRecords()
  const existingIndex = records.findIndex((r) => r.id === record.id)

  if (existingIndex >= 0) {
    records[existingIndex] = record
  } else {
    records.push(record)
  }

  localStorage.setItem("healthapp_records", JSON.stringify(records))
}

export const getHealthRecords = (userId?: string): HealthRecord[] => {
  const records = JSON.parse(localStorage.getItem("healthapp_records") || "[]")
  return userId ? records.filter((r: HealthRecord) => r.userId === userId) : records
}

export const deleteHealthRecord = (recordId: string) => {
  const records = getHealthRecords()
  const filteredRecords = records.filter((r) => r.id !== recordId)
  localStorage.setItem("healthapp_records", JSON.stringify(filteredRecords))
}

// QR Code Management
export const saveQRCode = (qrCode: QRCode) => {
  const qrCodes = getQRCodes()
  const existingIndex = qrCodes.findIndex((q) => q.id === qrCode.id)

  if (existingIndex >= 0) {
    qrCodes[existingIndex] = qrCode
  } else {
    qrCodes.push(qrCode)
  }

  localStorage.setItem("healthapp_qrcodes", JSON.stringify(qrCodes))
}

export const getQRCodes = (userId?: string): QRCode[] => {
  const qrCodes = JSON.parse(localStorage.getItem("healthapp_qrcodes") || "[]")
  return userId ? qrCodes.filter((q: QRCode) => q.userId === userId) : qrCodes
}

// Initialize demo data
export const initializeDemoData = () => {
  // Only initialize if no data exists
  if (!localStorage.getItem("healthapp_demo_initialized")) {
    // Create demo admin user
    const demoUsers = [
      {
        uid: "admin-001",
        email: "admin@kerala.gov.in",
        password: "admin123",
        displayName: "Government Admin",
        createdAt: new Date().toISOString(),
      },
      {
        uid: "demo-user-001",
        email: "demo@example.com",
        password: "demo123",
        displayName: "Demo User",
        createdAt: new Date().toISOString(),
      },
    ]

    localStorage.setItem("healthapp_users", JSON.stringify(demoUsers))
    localStorage.setItem("healthapp_demo_initialized", "true")
  }
}
