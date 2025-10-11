// Custom hook for authentication
import { useCallback, useEffect, useState } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authMethod, setAuthMethod] = useState('firebase');

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        setError(null);

        // Initialize auth service
        await authService.initializeAuth();

        // Check if user is already authenticated
        if (authService.isUserAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Handle network errors specifically
        if (error.message.includes('network') || error.message.includes('timeout')) {
          setError('Network error. Please check your internet connection.');
        } else {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen to auth state changes
    const unsubscribe = authService.addAuthStateListener(async (authState) => {
      setUser(authState.user);
      setIsAuthenticated(authState.isAuthenticated);
      setAuthMethod(authState.authMethod || 'firebase');
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Firebase login function
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const result = await authService.login(email, password);
      setUser(result.user);
      setIsAuthenticated(true);
      setAuthMethod('firebase');

      return result;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Firebase register function
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const result = await authService.register(
        userData.email,
        userData.password,
        userData
      );
      setUser(result.user);
      setIsAuthenticated(true);
      setAuthMethod('firebase');

      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Firebase logout function
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      setAuthMethod('firebase');

      return { success: true };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Firebase reset password function
  const resetPassword = useCallback(async (email) => {
    try {
      setError(null);
      return await authService.resetPassword(email);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, []);

  // Update profile function
  const updateProfile = useCallback(async (profileData) => {
    try {
      setLoading(true);
      setError(null);

      const result = await authService.updateUserProfile(profileData);
      setUser(result.user);

      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    try {
      return await authService.refreshToken();
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }, []);


  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    user,
    isAuthenticated,
    loading,
    error,
    authMethod,

    // Firebase Actions
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    refreshToken,
    clearError,

    // Utilities
    isLoggedIn: isAuthenticated && !!user,
    isGuest: !isAuthenticated || !user,
    isFirebaseAuth: authMethod === 'firebase',
    isBackendAuth: authMethod === 'backend',
    isHybridAuth: true  // Uses Firebase + Backend
  };
};

export default useAuth;
