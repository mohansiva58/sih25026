// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app"
import { getAuth, Auth } from "firebase/auth"
import { getFirestore, Firestore } from "firebase/firestore"
import { getStorage, FirebaseStorage } from "firebase/storage"
import { getAnalytics, Analytics } from "firebase/analytics"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Validate required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
]

const missingEnvVars = requiredEnvVars.filter(
  envVar => !process.env[envVar]
)

if (missingEnvVars.length > 0) {
  console.warn('Missing Firebase environment variables:', missingEnvVars)
  console.warn('Please check your .env.local file and ensure all required Firebase variables are set')
}

// Initialize Firebase
let app: FirebaseApp | undefined
let auth: Auth | undefined
let db: Firestore | undefined
let storage: FirebaseStorage | undefined
let analytics: Analytics | undefined

try {
  app = initializeApp(firebaseConfig)
  
  // Initialize Firebase services
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
  
  // Initialize Analytics (only in browser environment)
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) {
    analytics = getAnalytics(app)
  }
  
  console.log('Firebase initialized successfully')
} catch (error) {
  console.error('Firebase initialization error:', error)
  console.warn('Firebase services will not be available')
}

export { auth, db, storage, analytics }
export default app
