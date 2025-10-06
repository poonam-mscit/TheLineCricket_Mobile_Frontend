// Firebase connection test
import { signInAnonymously } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export const testFirebaseConnection = async () => {
  try {
    console.log('🔥 Testing Firebase connection...');
    
    // Test Authentication
    console.log('🔐 Testing Firebase Auth...');
    const authResult = await signInAnonymously(auth);
    console.log('✅ Firebase Auth connected:', authResult.user.uid);
    
    // Test Firestore
    console.log('📊 Testing Firestore...');
    const testDoc = doc(db, 'test', 'connection');
    await setDoc(testDoc, {
      timestamp: new Date().toISOString(),
      message: 'Firebase connection test successful'
    });
    console.log('✅ Firestore connected and working');
    
    // Sign out from anonymous auth
    await auth.signOut();
    console.log('✅ Firebase test completed successfully');
    
    return true;
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error);
    return false;
  }
};

export const testFirebaseAuth = async () => {
  try {
    console.log('🔐 Testing Firebase Auth only...');
    const authResult = await signInAnonymously(auth);
    console.log('✅ Firebase Auth working:', authResult.user.uid);
    await auth.signOut();
    return true;
  } catch (error) {
    console.error('❌ Firebase Auth test failed:', error);
    return false;
  }
};
