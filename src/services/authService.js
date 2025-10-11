// Authentication service layer
import { handleApiError } from '../utils/errorHandler';
import apiClient from './apiClient';
import firebaseAuthService from './firebaseAuthService';
import tokenService from './tokenService';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.listeners = [];
    this.authMethod = 'firebase'; // Firebase only
    this.isInitialized = false;
    this.initializationPromise = null;
  }

  /**
   * Initialize authentication state from Firebase
   */
  async initializeAuth() {
    // Prevent multiple initializations
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._performInitialization();
    return this.initializationPromise;
  }

  async _performInitialization() {
    try {
      console.log('🔄 Initializing authentication...');
      
      // Check if Firebase user is already authenticated
      if (firebaseAuthService.isUserAuthenticated()) {
        this.currentUser = firebaseAuthService.getCurrentUser();
        this.isAuthenticated = true;
        
        // Verify token is still valid
        try {
          await this.refreshToken();
        } catch (error) {
          console.warn('Token refresh failed, clearing auth state:', error);
          await this._clearAuthState();
        }
      } else {
        // Clear any stale tokens
        await tokenService.clearTokens();
        this.currentUser = null;
        this.isAuthenticated = false;
      }
      
      this.isInitialized = true;
      this.notifyListeners();
      console.log('✅ Authentication initialized');
    } catch (error) {
      console.error('❌ Firebase auth initialization error:', error);
      await this._clearAuthState();
      this.isInitialized = true;
      this.notifyListeners();
    }
  }

  /**
   * Clear authentication state
   */
  async _clearAuthState() {
    this.currentUser = null;
    this.isAuthenticated = false;
    await tokenService.clearTokens();
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
        authMethod: this.authMethod
      });
    });
  }


  /**
   * Register new user with Firebase authentication
   */
  async register(email, password, userData = {}) {
    try {
      console.log('🔄 Starting user registration...');
      this.authMethod = 'firebase';
      
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      const result = await firebaseAuthService.register(email, password, userData);
      
      // Update current user state
      this.currentUser = result.user;
      this.isAuthenticated = true;
      this.notifyListeners();
      
      console.log('✅ User registration successful');
      return result;
    } catch (error) {
      console.error('❌ Firebase registration error:', error);
      
      // Clear any partial state
      await this._clearAuthState();
      
      // Re-throw with user-friendly message
      if (error.message.includes('email-already-in-use')) {
        throw new Error('An account with this email already exists');
      } else if (error.message.includes('weak-password')) {
        throw new Error('Password is too weak. Please choose a stronger password');
      } else if (error.message.includes('invalid-email')) {
        throw new Error('Please enter a valid email address');
      } else if (error.message.includes('network')) {
        throw new Error('Network error. Please check your internet connection');
      }
      
      throw error;
    }
  }


  /**
   * Sign in with Firebase authentication
   */
  async login(email, password) {
    try {
      console.log('🔄 Starting user login...');
      this.authMethod = 'firebase';
      
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      const result = await firebaseAuthService.login(email, password);
      
      // Update current user state
      this.currentUser = result.user;
      this.isAuthenticated = true;
      this.notifyListeners();
      
      console.log('✅ User login successful');
      return result;
    } catch (error) {
      console.error('❌ Firebase login error:', error);
      
      // Clear any partial state
      await this._clearAuthState();
      
      // Re-throw with user-friendly message
      if (error.message.includes('user-not-found')) {
        throw new Error('No account found with this email address');
      } else if (error.message.includes('wrong-password')) {
        throw new Error('Incorrect password');
      } else if (error.message.includes('user-disabled')) {
        throw new Error('This account has been disabled');
      } else if (error.message.includes('too-many-requests')) {
        throw new Error('Too many failed attempts. Please try again later');
      } else if (error.message.includes('network')) {
        throw new Error('Network error. Please check your internet connection');
      }
      
      throw error;
    }
  }


  /**
   * Sign out user with Firebase
   */
  async logout() {
    try {
      console.log('🔄 Starting user logout...');
      this.authMethod = 'firebase';
      
      const result = await firebaseAuthService.logout();
      
      // Update state
      this.currentUser = null;
      this.isAuthenticated = false;
      this.notifyListeners();
      
      console.log('✅ User logout successful');
      return result;
    } catch (error) {
      console.error('❌ Firebase logout error:', error);
      
      // Force clear local state even if Firebase logout fails
      await this._clearAuthState();
      this.notifyListeners();
      
      // Don't throw error for logout - always succeed locally
      return {
        success: true,
        message: 'Logged out successfully'
      };
    }
  }

  /**
   * Send password reset email with Firebase
   */
  async resetPassword(email) {
    try {
      return await firebaseAuthService.resetPassword(email);
    } catch (error) {
      console.error('Firebase password reset error:', error);
      throw error;
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
      console.log('🔄 Fetching user profile...');
      
      if (!this.isAuthenticated) {
        throw new Error('User must be authenticated to fetch profile');
      }
      
      const response = await apiClient.get('/api/users/me');
      console.log('✅ User profile fetched successfully');
      return response.data.user;
    } catch (error) {
      console.error('❌ Get user profile error:', error);
      
      // Handle specific error cases
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        // Token might be expired, try to refresh
        try {
          await this.refreshToken();
          const response = await apiClient.get('/api/users/me');
          return response.data.user;
        } catch (refreshError) {
          console.error('❌ Token refresh failed:', refreshError);
          await this._clearAuthState();
          this.notifyListeners();
          throw new Error('Session expired. Please login again.');
        }
      }
      
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(profileData) {
    try {
      console.log('🔄 Updating user profile...');
      
      if (!this.isAuthenticated) {
        throw new Error('User must be authenticated to update profile');
      }
      
      if (!profileData || Object.keys(profileData).length === 0) {
        throw new Error('Profile data is required');
      }
      
      const response = await apiClient.put('/api/users/profile', profileData);
      console.log('✅ User profile updated successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Update profile error:', error);
      
      // Handle specific error cases
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        // Token might be expired, try to refresh
        try {
          await this.refreshToken();
          const response = await apiClient.put('/api/users/profile', profileData);
          return response.data;
        } catch (refreshError) {
          console.error('❌ Token refresh failed:', refreshError);
          await this._clearAuthState();
          this.notifyListeners();
          throw new Error('Session expired. Please login again.');
        }
      }
      
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Refresh Firebase token
   */
  async refreshToken() {
    try {
      console.log('🔄 Refreshing Firebase token...');
      
      if (!this.isAuthenticated || !this.currentUser) {
        throw new Error('No authenticated user to refresh token for');
      }
      
      const token = await firebaseAuthService.getFirebaseIdToken();
      
      if (!token) {
        throw new Error('Failed to get Firebase token');
      }
      
      // Sync with backend to get new JWT
      try {
        const response = await apiClient.post('/api/firebase/verify-token', {
          id_token: token,
          firebase_uid: this.currentUser.uid,
          email: this.currentUser.email,
          displayName: this.currentUser.displayName
        });
        
        if (response.data.success) {
          const { jwt_token } = response.data.data;
          await tokenService.setTokens(jwt_token, jwt_token);
          console.log('✅ Token refreshed successfully');
          return token;
        } else {
          throw new Error('Backend token refresh failed');
        }
      } catch (backendError) {
        console.error('❌ Backend token sync failed:', backendError);
        // Still return the Firebase token even if backend sync fails
        return token;
      }
    } catch (error) {
      console.error('❌ Firebase token refresh error:', error);
      throw error;
    }
  }

  /**
   * Get current auth method (always Firebase)
   */
  getAuthMethod() {
    return 'firebase';
  }

  /**
   * Check if authentication is initialized
   */
  isInitialized() {
    return this.isInitialized;
  }

  /**
   * Sync Firebase user with backend
   */
  async syncFirebaseUserWithBackend(firebaseUser) {
    try {
      console.log('🔄 Syncing Firebase user with backend...');
      
      if (!firebaseUser) {
        throw new Error('Firebase user is required for sync');
      }
      
      const idToken = await firebaseUser.getIdToken();
      
      // Sync with backend to get JWT token
      const response = await apiClient.post('/api/firebase/verify-token', {
        id_token: idToken,
        firebase_uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName
      });
      
      if (response.data.success) {
        const { jwt_token } = response.data.data;
        await tokenService.setTokens(jwt_token, jwt_token);
        
        // Update current user state
        this.currentUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          ...firebaseUser
        };
        this.isAuthenticated = true;
        this.notifyListeners();
        
        console.log('✅ Firebase user synced with backend successfully');
        return {
          user: this.currentUser,
          token: jwt_token,
          success: true
        };
      } else {
        throw new Error('Backend sync failed');
      }
    } catch (error) {
      console.error('❌ Firebase user sync error:', error);
      throw error;
    }
  }

  /**
   * Cleanup method to remove listeners
   */
  cleanup() {
    console.log('🧹 Cleaning up auth service...');
    this.listeners = [];
    this.initializationPromise = null;
  }
}

// Create and export singleton instance
export const authService = new AuthService();
export default authService;
