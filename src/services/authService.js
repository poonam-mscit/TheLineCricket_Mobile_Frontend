// Authentication service layer
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { handleApiError, handleFirebaseError } from '../utils/errorHandler';
import apiClient from './apiClient';
import { auth } from './firebase';
import tokenService from './tokenService';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.listeners = [];
    
    // Listen to Firebase auth state changes
    this.setupAuthStateListener();
  }

  /**
   * Setup Firebase auth state listener
   */
  setupAuthStateListener() {
    onAuthStateChanged(auth, async (user) => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
      
      if (user) {
        // Get Firebase ID token
        const idToken = await user.getIdToken();
        
        // Store tokens
        await tokenService.setTokens(idToken, idToken); // Using same token for both
        
        // Sync user with backend
        await this.syncUserWithBackend(user);
      } else {
        // Clear tokens when user signs out
        await tokenService.clearTokens();
      }
      
      // Notify listeners
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
        isAuthenticated: this.isAuthenticated
      });
    });
  }

  /**
   * Sync Firebase user with backend
   */
  async syncUserWithBackend(firebaseUser) {
    try {
      const userData = {
        firebase_uid: firebaseUser.uid,
        firebase_email: firebaseUser.email,
        email: firebaseUser.email,
        username: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        is_verified: firebaseUser.emailVerified,
        auth_provider: 'firebase'
      };

      // Try to get user from backend first
      try {
        const response = await apiClient.get('/auth/me');
        return response.data;
      } catch (error) {
        // If user doesn't exist, create them
        if (error.response?.status === 404) {
          const response = await apiClient.post('/auth/firebase/signup', userData);
          return response.data;
        }
        throw error;
      }
    } catch (error) {
      console.error('Failed to sync user with backend:', error);
      throw error;
    }
  }

  /**
   * Register new user with email and password
   */
  async register(email, password, userData = {}) {
    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Firebase profile
      if (userData.fullName) {
        await updateProfile(user, {
          displayName: userData.fullName
        });
      }

      // Prepare backend user data
      const backendUserData = {
        firebase_uid: user.uid,
        firebase_email: user.email,
        email: user.email,
        username: userData.username || user.email.split('@')[0],
        full_name: userData.fullName || user.displayName,
        age: userData.age ? parseInt(userData.age) : null,
        location: userData.location || null,
        contact_number: userData.contactNumber || null,
        profile_type: userData.profileType || 'player',
        is_verified: user.emailVerified,
        auth_provider: 'firebase'
      };

      // Create user in backend
      const response = await apiClient.post('/auth/firebase/signup', backendUserData);
      
      return {
        success: true,
        user: response.data.user,
        message: 'Registration successful'
      };
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.code && error.code.startsWith('auth/')) {
        throw new Error(handleFirebaseError(error));
      } else {
        throw new Error(handleApiError(error));
      }
    }
  }

  /**
   * Sign in with email and password
   */
  async login(email, password) {
    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get Firebase ID token
      const idToken = await user.getIdToken();
      
      // Store tokens
      await tokenService.setTokens(idToken, idToken);

      // Get user data from backend
      const response = await apiClient.get('/auth/me');
      
      return {
        success: true,
        user: response.data.user,
        message: 'Login successful'
      };
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.code && error.code.startsWith('auth/')) {
        throw new Error(handleFirebaseError(error));
      } else {
        throw new Error(handleApiError(error));
      }
    }
  }

  /**
   * Sign out user
   */
  async logout() {
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear stored tokens
      await tokenService.clearTokens();
      
      return {
        success: true,
        message: 'Logout successful'
      };
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Failed to logout');
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: 'Password reset email sent'
      };
    } catch (error) {
      console.error('Password reset error:', error);
      throw new Error(handleFirebaseError(error));
    }
  }

  /**
   * Get current user
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
   * Get user profile from backend
   */
  async getUserProfile() {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data.user;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(profileData) {
    try {
      const response = await apiClient.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Refresh Firebase token
   */
  async refreshToken() {
    try {
      if (this.currentUser) {
        const newToken = await this.currentUser.getIdToken(true);
        await tokenService.setTokens(newToken, newToken);
        return newToken;
      }
      throw new Error('No user logged in');
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const authService = new AuthService();
export default authService;
