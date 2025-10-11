// Firebase Authentication Service
import {
  createUserWithEmailAndPassword,
  getIdToken,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import apiClient from './apiClient';
import { auth } from './firebase';
import tokenService from './tokenService';

class FirebaseAuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.listeners = [];
    this.authStateUnsubscribe = null;
    
    // Initialize auth state listener
    this.initializeAuthStateListener();
  }

  /**
   * Initialize Firebase auth state listener
   */
  initializeAuthStateListener() {
    this.authStateUnsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔥 Firebase auth state changed:', firebaseUser ? 'User signed in' : 'User signed out');
      
      if (firebaseUser) {
        this.currentUser = firebaseUser;
        this.isAuthenticated = true;
        
        // Sync with backend
        try {
          await this.syncWithBackend(firebaseUser);
        } catch (error) {
          console.error('❌ Failed to sync with backend:', error);
          // Don't sign out user, just log the error
        }
      } else {
        this.currentUser = null;
        this.isAuthenticated = false;
        // Clear tokens when user signs out
        await tokenService.clearTokens();
      }
      
      this.notifyListeners();
    });
  }

  /**
   * Add auth state change listener
   */
  addAuthStateListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  /**
   * Notify all listeners of auth state changes
   */
  notifyListeners() {
    this.listeners.forEach(listener => {
      listener({
        user: this.currentUser,
        isAuthenticated: this.isAuthenticated,
        authMethod: 'firebase'
      });
    });
  }

  /**
   * Sync Firebase user with backend
   */
  async syncWithBackend(firebaseUser) {
    try {
      const idToken = await getIdToken(firebaseUser);
      
      // Check if user exists in backend
      const response = await apiClient.post('/api/firebase/verify-token', {
        id_token: idToken,
        firebase_uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName
      });

      if (response.data.success) {
        // Store backend JWT token
        const { jwt_token } = response.data.data;
        await tokenService.setTokens(jwt_token, jwt_token);
        console.log('✅ Firebase user synced with backend');
      }
    } catch (error) {
      console.error('❌ Backend sync failed:', error);
      throw error;
    }
  }

  /**
   * Firebase login with email and password
   */
  async login(email, password) {
    try {
      console.log('🔥 Firebase login attempt for:', email);
      
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get Firebase ID token
      const idToken = await getIdToken(firebaseUser);
      console.log('🔥 Firebase ID token obtained');
      
      // Sync with backend
      console.log('🔄 Syncing with backend...');
      const response = await apiClient.post('/api/firebase/verify-token', {
        id_token: idToken,
        firebase_uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName
      });

      console.log('📡 Backend response:', response.data);

      if (response.data.success) {
        // Store backend JWT token
        const { jwt_token } = response.data.data;
        await tokenService.setTokens(jwt_token, jwt_token);
        
        console.log('✅ Firebase login successful');
        return {
          success: true,
          user: firebaseUser,
          message: 'Firebase login successful'
        };
      } else {
        throw new Error(response.data.error || 'Backend sync failed');
      }
    } catch (error) {
      console.error('❌ Firebase login error:', error);
      console.error('🔍 Error details:', error.message);
      console.error('📚 Stack trace:', error.stack);
      throw new Error(this.getFirebaseErrorMessage(error));
    }
  }

  /**
   * Firebase registration with email and password
   */
  async register(email, password, userData = {}) {
    try {
      console.log('🔥 Firebase registration attempt for:', email);
      
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      if (userData.username && userData.username.length < 3) {
        throw new Error('Username must be at least 3 characters long');
      }
      
      if (userData.age && (userData.age < 13 || userData.age > 120)) {
        throw new Error('Age must be between 13 and 120');
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      console.log('🔥 Firebase user created');
      
      // Update Firebase user profile if display name provided
      if (userData.fullName) {
        await updateProfile(firebaseUser, {
          displayName: userData.fullName
        });
        console.log('🔥 Firebase profile updated');
      }
      
      // Get Firebase ID token
      const idToken = await getIdToken(firebaseUser);
      console.log('🔥 Firebase ID token obtained');
      
      // Sync with backend
      console.log('🔄 Syncing with backend...');
      
      // Add a small delay to ensure network is ready
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await apiClient.post('/api/firebase/signup', {
        id_token: idToken,
        firebase_uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: userData.fullName || firebaseUser.displayName,
        username: userData.username,
        age: userData.age,
        location: userData.location,
        profile_type: userData.profileType || 'player'
      });

      console.log('📡 Backend response:', response.data);

      if (response.data.success) {
        // Store backend JWT token
        const { jwt_token } = response.data.data;
        await tokenService.setTokens(jwt_token, jwt_token);
        
        console.log('✅ Firebase registration successful');
        return {
          success: true,
          user: firebaseUser,
          message: 'Firebase registration successful'
        };
      } else {
        throw new Error(response.data.error || 'Backend sync failed');
      }
    } catch (error) {
      console.error('❌ Firebase registration error:', error);
      console.error('🔍 Error details:', error.message);
      console.error('📚 Stack trace:', error.stack);
      throw new Error(this.getFirebaseErrorMessage(error));
    }
  }

  /**
   * Firebase logout
   */
  async logout() {
    try {
      console.log('🔥 Firebase logout');
      
      await signOut(auth);
      
      // Clear stored tokens
      await tokenService.clearTokens();
      
      console.log('✅ Firebase logout successful');
      return {
        success: true,
        message: 'Firebase logout successful'
      };
    } catch (error) {
      console.error('❌ Firebase logout error:', error);
      throw new Error('Failed to logout from Firebase');
    }
  }

  /**
   * Get current Firebase user
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isUserAuthenticated() {
    return this.isAuthenticated;
  }

  /**
   * Get Firebase ID token
   */
  async getFirebaseIdToken() {
    if (this.currentUser) {
      return await getIdToken(this.currentUser);
    }
    return null;
  }

  /**
   * Send password reset email
   */
  async resetPassword(email) {
    try {
      // Firebase handles password reset
      await sendPasswordResetEmail(auth, email);
      
      return {
        success: true,
        message: 'Password reset email sent'
      };
    } catch (error) {
      console.error('❌ Firebase password reset error:', error);
      throw new Error(this.getFirebaseErrorMessage(error));
    }
  }

  /**
   * Get user-friendly error messages
   */
  getFirebaseErrorMessage(error) {
    const errorCode = error.code;
    
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      case 'auth/invalid-credential':
        return 'Invalid credentials. Please check your email and password';
      case 'auth/operation-not-allowed':
        return 'This sign-in method is not enabled';
      case 'auth/requires-recent-login':
        return 'Please sign in again to complete this action';
      case 'auth/credential-already-in-use':
        return 'This credential is already associated with a different account';
      case 'auth/invalid-verification-code':
        return 'Invalid verification code';
      case 'auth/invalid-verification-id':
        return 'Invalid verification ID';
      case 'auth/missing-verification-code':
        return 'Verification code is required';
      case 'auth/missing-verification-id':
        return 'Verification ID is required';
      case 'auth/quota-exceeded':
        return 'Quota exceeded. Please try again later';
      case 'auth/captcha-check-failed':
        return 'Captcha verification failed';
      case 'auth/invalid-phone-number':
        return 'Invalid phone number';
      case 'auth/missing-phone-number':
        return 'Phone number is required';
      case 'auth/invalid-credential':
        return 'Invalid credentials';
      default:
        return error.message || 'Authentication failed. Please try again';
    }
  }

  /**
   * Cleanup method
   */
  cleanup() {
    if (this.authStateUnsubscribe) {
      this.authStateUnsubscribe();
    }
  }
}

// Create and export singleton instance
export const firebaseAuthService = new FirebaseAuthService();
export default firebaseAuthService;
