# Firebase Setup Guide for Kerala Health Records

## 🚀 Complete Firebase Configuration

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `kerala-health-records` (or your preferred name)
4. Enable Google Analytics (optional but recommended)
5. Click "Create project"

### Step 2: Add Web App

1. In your Firebase project dashboard, click the web icon (`</>`)
2. Enter app nickname: `Kerala Health Records Web App`
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the Firebase configuration object

### Step 3: Configure Authentication

1. In Firebase Console, go to **Build > Authentication**
2. Click "Get started"
3. Go to **Sign-in method** tab
4. Enable the following providers:

   **Email/Password:**
   - Click "Email/Password"
   - Enable both "Email/Password" and "Email link (passwordless sign-in)"
   - Save

   **Google:**
   - Click "Google"
   - Enable the toggle
   - Select your project support email
   - Save

### Step 4: Configure Authorized Domains

1. Still in **Authentication > Settings > Authorized domains**
2. Add the following domains:
   - `localhost` (for development)
   - `127.0.0.1` (for development)
   - Your production domain when ready

### Step 5: Update Environment Variables

1. Copy your Firebase config from Step 2
2. Update `.env.local` file in your project root:

```env
# Replace these with your actual Firebase project values
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### Step 6: Set up Firestore (Optional)

1. Go to **Build > Firestore Database**
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

### Step 7: Configure Security Rules (Optional)

For Firestore, set up basic security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow admins to read all user data
    match /users/{userId} {
      allow read: if request.auth != null && 
        request.auth.token.email == 'admin@kerala.gov.in';
    }
  }
}
```

### Step 8: Test Your Setup

1. Restart your development server: `pnpm dev`
2. Open `http://localhost:3000/auth/login`
3. You should see "Firebase Connected" status instead of "Demo Mode"
4. Test both email/password and Google sign-in

## 🔧 Troubleshooting

### Common Issues:

1. **CONFIGURATION_NOT_FOUND Error:**
   - Check that all environment variables are set correctly
   - Ensure `.env.local` file is in the project root
   - Restart the development server after changing env vars

2. **Google Sign-in Not Working:**
   - Verify Google provider is enabled in Firebase Console
   - Check that localhost is in authorized domains
   - Ensure your domain is correctly configured

3. **Environment Variables Not Loading:**
   - Environment variable names must start with `NEXT_PUBLIC_`
   - File should be named `.env.local` exactly
   - No spaces around the `=` sign

### Development vs Production

**Development (.env.local):**
- Use localhost domains
- Test mode security rules
- Development API keys

**Production (.env.production):**
- Use your actual domain
- Production security rules
- Production API keys

## 📱 Current Fallback System

If Firebase is not configured, the app automatically falls back to demo mode with:
- Demo credentials: `demo@example.com` / `demo123`
- Admin credentials: `admin@kerala.gov.in` / `admin123`
- Simulated Google sign-in

## 🎯 Next Steps

1. Follow the setup steps above
2. Test authentication with your Firebase project
3. Configure Firestore for user data storage
4. Set up proper security rules for production
5. Deploy to production with environment variables

---

**Need Help?** The app includes helpful status indicators and will work in demo mode until Firebase is properly configured.