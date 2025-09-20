"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  User as FirebaseUser,
  Auth
} from "firebase/auth"
import { auth } from "./firebase"
import { generateJWT, verifyJWT, isTokenExpired } from "./jwt-utils"

interface User {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  token: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  isFirebaseConfigured: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for fallback when Firebase is not configured
const demoUsers = [
  {
    uid: "demo-admin-001",
    email: "admin@kerala.gov.in",
    password: "admin123",
    displayName: "Government Admin",
  },
  {
    uid: "demo-user-001", 
    email: "demo@example.com",
    password: "demo123",
    displayName: "Demo User",
  }
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFirebaseConfigured] = useState(false) // Always use demo mode for faster loading

  useEffect(() => {
    // Quick token check for instant loading
    const storedToken = localStorage.getItem('auth-token')
    if (storedToken && !isTokenExpired(storedToken)) {
      const payload = verifyJWT(storedToken)
      if (payload) {
        setUser({
          uid: payload.uid,
          email: payload.email,
          displayName: payload.displayName
        })
        setToken(storedToken)
      }
    }
    // Always set loading to false quickly for better UX
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      if (isFirebaseConfigured && auth) {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        // Fallback to demo mode
        const demoUser = demoUsers.find(u => u.email === email && u.password === password)
        if (!demoUser) {
          throw new Error("Invalid email or password")
        }
        
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const { password: _, ...userWithoutPassword } = demoUser
        
        // Generate JWT token
        const newToken = generateJWT(userWithoutPassword)
        localStorage.setItem('auth-token', newToken)
        
        setUser(userWithoutPassword)
        setToken(newToken)
        setLoading(false)
      }
    } catch (error: any) {
      setLoading(false)
      throw new Error(error.message || "Failed to sign in")
    }
  }

  const signUp = async (email: string, password: string) => {
    setLoading(true)
    try {
      if (isFirebaseConfigured && auth) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        // Fallback demo mode - simulate user creation
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const newUser = {
          uid: `demo-${Date.now()}`,
          email,
          displayName: email.split('@')[0],
        }
        
        // Generate JWT token
        const newToken = generateJWT(newUser)
        localStorage.setItem('auth-token', newToken)
        
        setUser(newUser)
        setToken(newToken)
        setLoading(false)
      }
    } catch (error: any) {
      setLoading(false)
      throw new Error(error.message || "Failed to create account")
    }
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    try {
      if (isFirebaseConfigured && auth) {
        const provider = new GoogleAuthProvider()
        provider.addScope('email')
        provider.addScope('profile')
        await signInWithPopup(auth, provider)
      } else {
        // Demo mode - simulate Google sign in
        console.log('Using demo Google sign-in')
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const demoGoogleUser = {
          uid: "demo-google-001",
          email: "user@gmail.com",
          displayName: "Google Demo User",
          photoURL: "https://via.placeholder.com/100x100.png?text=Demo"
        }
        
        // Generate JWT token
        const newToken = generateJWT(demoGoogleUser)
        localStorage.setItem('auth-token', newToken)
        
        setUser(demoGoogleUser)
        setToken(newToken)
        setLoading(false)
      }
    } catch (error: any) {
      setLoading(false)
      // Always fallback to demo mode if Firebase fails
      console.warn('Google sign-in failed, using demo mode:', error)
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const demoGoogleUser = {
          uid: "demo-google-fallback",
          email: "demo.google@gmail.com",
          displayName: "Demo Google User",
          photoURL: "https://via.placeholder.com/100x100.png?text=Demo"
        }
        
        // Generate JWT token
        const newToken = generateJWT(demoGoogleUser)
        localStorage.setItem('auth-token', newToken)
        
        setUser(demoGoogleUser)
        setToken(newToken)
        setLoading(false)
      } catch (fallbackError) {
        throw new Error("Authentication service unavailable")
      }
    }
  }

  const logout = async () => {
    try {
      if (isFirebaseConfigured && auth) {
        await signOut(auth)
      } else {
        // Demo mode logout - clear token
        localStorage.removeItem('auth-token')
        setUser(null)
        setToken(null)
      }
    } catch (error: any) {
      throw new Error(error.message || "Failed to sign out")
    }
  }

  const value = {
    user,
    token,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    isFirebaseConfigured,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}