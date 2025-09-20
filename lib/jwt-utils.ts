interface JWTPayload {
  uid: string
  email: string
  displayName?: string
  exp: number
  iat: number
}

export function generateJWT(user: { uid: string; email: string; displayName?: string }): string {
  const payload: JWTPayload = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
  }

  // Simple base64 encoding for demo (in production, use proper JWT library)
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const payloadEncoded = btoa(JSON.stringify(payload))
  const signature = btoa(`signature_${payload.uid}_${payload.exp}`) // Demo signature

  return `${header}.${payloadEncoded}.${signature}`
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const payload = JSON.parse(atob(parts[1]))

    // Check if token is expired
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload
  } catch (error) {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = verifyJWT(token)
  return !payload || payload.exp < Math.floor(Date.now() / 1000)
}
