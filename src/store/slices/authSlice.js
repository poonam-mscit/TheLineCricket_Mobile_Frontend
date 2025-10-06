// Redux slice for authentication state management
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  lastLogin: null,
  sessionExpiry: null,
  refreshToken: null,
  profile: null,
  preferences: {
    notifications: true,
    darkMode: false,
    language: 'en'
  }
};

// Async thunks for authentication actions
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const result = await authService.login(email, password);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const result = await authService.register(
        userData.email,
        userData.password,
        userData
      );
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const result = await authService.logout();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email, { rejectWithValue }) => {
    try {
      const result = await authService.resetPassword(email);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const result = await authService.updateUserProfile(profileData);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const refreshUserToken = createAsyncThunk(
  'auth/refreshUserToken',
  async (_, { rejectWithValue }) => {
    try {
      const newToken = await authService.refreshToken();
      return { token: newToken };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const result = await authService.getCurrentUser();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const syncUserWithBackend = createAsyncThunk(
  'auth/syncUserWithBackend',
  async (firebaseUser, { rejectWithValue }) => {
    try {
      // Use authService to sync with backend
      const result = await authService.syncFirebaseUserWithBackend(firebaseUser);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Set user data (for Firebase auth state changes)
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    
    // Set authentication state
    setAuthState: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    
    // Update user profile locally
    updateProfileLocal: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    
    // Update user preferences
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    
    // Set session expiry
    setSessionExpiry: (state, action) => {
      state.sessionExpiry = action.payload;
    },
    
    // Reset auth state
    resetAuthState: (state) => {
      return { ...initialState };
    },
    
    // Set last login
    setLastLogin: (state, action) => {
      state.lastLogin = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login user
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.lastLogin = new Date().toISOString();
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      })
      
      // Register user
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.lastLogin = new Date().toISOString();
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      })
      
      // Logout user
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.profile = null;
        state.lastLogin = null;
        state.sessionExpiry = null;
        state.refreshToken = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Reset password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Refresh user token
      .addCase(refreshUserToken.fulfilled, (state, action) => {
        state.refreshToken = action.payload.token;
      })
      .addCase(refreshUserToken.rejected, (state, action) => {
        state.error = action.payload;
        // Optionally logout user if token refresh fails
        state.isAuthenticated = false;
        state.user = null;
      })
      
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.user;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Sync user with backend
      .addCase(syncUserWithBackend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncUserWithBackend.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.user;
        state.error = null;
      })
      .addCase(syncUserWithBackend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Export actions
export const {
  clearError,
  setLoading,
  setUser,
  setAuthState,
  updateProfileLocal,
  updatePreferences,
  setSessionExpiry,
  resetAuthState,
  setLastLogin
} = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectUserProfile = (state) => state.auth.profile;
export const selectUserPreferences = (state) => state.auth.preferences;
export const selectLastLogin = (state) => state.auth.lastLogin;
export const selectSessionExpiry = (state) => state.auth.sessionExpiry;

// Export reducer
export default authSlice.reducer;
