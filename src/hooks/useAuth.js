// Custom hook for authentication
import { useCallback, useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if user is already authenticated
        if (authService.isUserAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          setUser(currentUser);
          setIsAuthenticated(true);

          // Get user profile from backend
          try {
            const userProfile = await apiService.getCurrentUser();
            setUser(userProfile.user);
          } catch (profileError) {
            console.warn('Failed to get user profile:', profileError);
            // Keep Firebase user if backend fails
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen to auth state changes
    const unsubscribe = authService.addAuthStateListener(async (authState) => {
      setUser(authState.user);
      setIsAuthenticated(authState.isAuthenticated);
      setLoading(false);

      if (authState.isAuthenticated && authState.user) {
        // Get user profile from backend
        try {
          const userProfile = await apiService.getCurrentUser();
          setUser(userProfile.user);
        } catch (profileError) {
          console.warn('Failed to get user profile:', profileError);
        }
      }
    });

    return unsubscribe;
  }, []);

  // Login function
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const result = await authService.login(email, password);
      setUser(result.user);
      setIsAuthenticated(true);

      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Register function
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

      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);

      return { success: true };
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset password function
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

    // Actions
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    refreshToken,
    clearError,

    // Utilities
    isLoggedIn: isAuthenticated && !!user,
    isGuest: !isAuthenticated || !user
  };
};

export default useAuth;
