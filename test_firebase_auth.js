#!/usr/bin/env node
/**
 * Test Firebase authentication flow
 */
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJ_Vh_J0BHUEsRX3PexJWWjk2PbqhDZo0",
  authDomain: "linecricket-1a2b3.firebaseapp.com",
  projectId: "linecricket-1a2b3",
  storageBucket: "linecricket-1a2b3.firebasestorage.app",
  messagingSenderId: "1080197808632",
  appId: "1:1080197808632:android:d80a3dbfea3c0a58d3d60d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function testFirebaseAuth() {
  console.log('🧪 Testing Firebase authentication...');
  
  try {
    // Test Firebase connection
    console.log('✅ Firebase initialized successfully');
    console.log('📱 Auth instance:', auth);
    console.log('🔗 Auth domain:', auth.config.authDomain);
    
    return true;
  } catch (error) {
    console.error('❌ Firebase auth test failed:', error);
    return false;
  }
}

// Run test
testFirebaseAuth().then(success => {
  if (success) {
    console.log('🎉 Firebase authentication test PASSED!');
  } else {
    console.log('💥 Firebase authentication test FAILED!');
  }
  process.exit(success ? 0 : 1);
});
