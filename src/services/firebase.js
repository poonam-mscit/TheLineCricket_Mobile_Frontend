// Firebase configuration and initialization
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import environment from '../config/environment';

// Firebase configuration with error handling
let firebaseConfig;
try {
  firebaseConfig = environment.FIREBASE_CONFIG;
  if (!firebaseConfig) {
    throw new Error('FIREBASE_CONFIG not found in environment');
  }
} catch (error) {
  console.error('Firebase configuration error:', error);
  // Fallback configuration
  firebaseConfig = {
    apiKey: "AIzaSyDJ_Vh_J0BHUEsRX3PexJWWjk2PbqhDZo0",
    authDomain: "linecricket-1a2b3.firebaseapp.com",
    projectId: "linecricket-1a2b3",
    storageBucket: "linecricket-1a2b3.firebasestorage.app",
    messagingSenderId: "1080197808632",
    appId: "1:1080197808632:android:d80a3dbfea3c0a58d3d60d"
  };
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
