# 🔥 Firebase Setup Guide

## 📋 Step-by-Step Instructions

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `TheLineCricket`
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2. Add Android App
1. Click "Add app" → Select Android
2. **Android package name**: `com.yogin.thelinecricket`
3. **App nickname**: `TheLineCricket Android`
4. Click "Register app"
5. **Download `google-services.json`**
6. **Place it in**: `android/app/google-services.json`

### 3. Add iOS App
1. Click "Add app" → Select iOS
2. **iOS bundle ID**: `com.yogin.thelinecricket`
3. **App nickname**: `TheLineCricket iOS`
4. Click "Register app"
5. **Download `GoogleService-Info.plist`**
6. **Place it in**: `ios/GoogleService-Info.plist`

### 4. Enable Authentication
1. Go to "Authentication" → "Get started"
2. Go to "Sign-in method" tab
3. Enable "Email/Password" provider
4. Click "Save"

### 5. Get Web App Config
1. Click "Add app" → Select Web
2. **App nickname**: `TheLineCricket Web`
3. Click "Register app"
4. **Copy the config object**
5. **Update**: `src/config/environment.js` with the config

### 6. Update Environment Config
Replace the placeholder values in `src/config/environment.js`:

```javascript
FIREBASE_CONFIG: {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_ACTUAL_SENDER_ID",
  appId: "YOUR_ACTUAL_APP_ID"
}
```

## ✅ Verification
After completing all steps:
1. Run `npm start`
2. Check console for Firebase connection success
3. Test authentication flow

## 🔧 Troubleshooting
- Make sure all config files are in correct locations
- Verify package names match exactly
- Check Firebase console for any errors
- Ensure Authentication is enabled
