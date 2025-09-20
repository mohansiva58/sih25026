import QRCode from "qrcode"

export interface HealthRecordQR {
  recordId: string
  userId: string
  type: "master" | "document" | "profile"
  data: any
  generatedAt: string
}

export async function generateQRCode(data: HealthRecordQR): Promise<string> {
  try {
    const qrData = JSON.stringify({
      id: data.recordId,
      userId: data.userId,
      type: data.type,
      timestamp: data.generatedAt,
      // Add verification hash for security
      hash: await generateHash(data),
    })

    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: "M",
      type: "image/png",
      quality: 0.92,
      margin: 1,
      color: {
        dark: "#059669", // Primary color
        light: "#FFFFFF",
      },
      width: 256,
    })

    return qrCodeDataURL
  } catch (error) {
    console.error("Error generating QR code:", error)
    throw new Error("Failed to generate QR code")
  }
}

async function generateHash(data: HealthRecordQR): Promise<string> {
  const encoder = new TextEncoder()
  const dataString = JSON.stringify(data)
  const dataBuffer = encoder.encode(dataString)
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export async function verifyQRCode(qrData: string): Promise<boolean> {
  try {
    const parsed = JSON.parse(qrData)
    // Implement verification logic here
    return true
  } catch (error) {
    return false
  }
}
