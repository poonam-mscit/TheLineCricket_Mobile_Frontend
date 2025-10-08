// Redux slice for profile state management
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';

// Initial state
const initialState = {
  // Current user profile
  currentUser: null,
  
  // Profile being viewed
  viewedProfile: null,
  
  // Loading states
  loading: {
    currentUser: false,
    viewedProfile: false,
    updating: false,
    creating: false,
    deleting: false
  },
  
  // Error states
  errors: {
    currentUser: null,
    viewedProfile: null,
    updating: null,
    creating: null,
    deleting: null
  },
  
  // Profile data
  profile: {
    id: null,
    username: '',
    fullName: '',
    email: '',
    bio: '',
    location: '',
    avatar: null,
    coverImage: null,
    stats: {
      posts: 0,
      matches: 0,
      followers: 0,
      following: 0,
      wins: 0,
      losses: 0
    },
    skills: {
      batting: 0,
      bowling: 0,
      fielding: 0,
      overall: 0
    },
    achievements: [],
    isFollowing: false,
    isOwnProfile: false,
    joinedDate: null
  },
  
  // Form states
  isEditing: false,
  isCreating: false,
  isDeleting: false,
  
  // Last updated timestamp
  lastUpdated: null
};

// Async thunks for profile actions
export const fetchCurrentUser = createAsyncThunk(
  'profile/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getCurrentUser();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiService.getUserProfile(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createUserProfile = createAsyncThunk(
  'profile/createUserProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await apiService.createUserProfile(profileData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await apiService.updateUserProfile(profileData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUserProfile = createAsyncThunk(
  'profile/deleteUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiService.deleteUserProfile(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadProfilePhoto = createAsyncThunk(
  'profile/uploadProfilePhoto',
  async (imageData, { rejectWithValue }) => {
    try {
      const response = await apiService.uploadProfilePhoto(imageData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Profile slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state, action) => {
      const errorType = action.payload || 'all';
      if (errorType === 'all') {
        state.errors = {
          currentUser: null,
          viewedProfile: null,
          updating: null,
          creating: null,
          deleting: null
        };
      } else {
        state.errors[errorType] = null;
      }
    },
    
    // Set editing state
    setEditing: (state, action) => {
      state.isEditing = action.payload;
    },
    
    // Set creating state
    setCreating: (state, action) => {
      state.isCreating = action.payload;
    },
    
    // Set deleting state
    setDeleting: (state, action) => {
      state.isDeleting = action.payload;
    },
    
    // Update profile locally (for optimistic updates)
    updateProfileLocal: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    
    // Reset profile state
    resetProfile: (state) => {
      return { ...initialState };
    },
    
    // Set viewed profile
    setViewedProfile: (state, action) => {
      state.viewedProfile = action.payload;
    },
    
    // Clear viewed profile
    clearViewedProfile: (state) => {
      state.viewedProfile = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading.currentUser = true;
        state.errors.currentUser = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading.currentUser = false;
        state.currentUser = action.payload;
        state.profile = { ...state.profile, ...action.payload };
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading.currentUser = false;
        state.errors.currentUser = action.payload;
      })
      
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading.viewedProfile = true;
        state.errors.viewedProfile = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading.viewedProfile = false;
        state.viewedProfile = action.payload;
        state.profile = { ...state.profile, ...action.payload };
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading.viewedProfile = false;
        state.errors.viewedProfile = action.payload;
      })
      
      // Create user profile
      .addCase(createUserProfile.pending, (state) => {
        state.loading.creating = true;
        state.errors.creating = null;
        state.isCreating = true;
      })
      .addCase(createUserProfile.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.isCreating = false;
        state.currentUser = action.payload;
        state.profile = { ...state.profile, ...action.payload };
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createUserProfile.rejected, (state, action) => {
        state.loading.creating = false;
        state.isCreating = false;
        state.errors.creating = action.payload;
      })
      
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading.updating = true;
        state.errors.updating = null;
        state.isEditing = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading.updating = false;
        state.isEditing = false;
        state.currentUser = action.payload;
        state.profile = { ...state.profile, ...action.payload };
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading.updating = false;
        state.isEditing = false;
        state.errors.updating = action.payload;
      })
      
      // Delete user profile
      .addCase(deleteUserProfile.pending, (state) => {
        state.loading.deleting = true;
        state.errors.deleting = null;
        state.isDeleting = true;
      })
      .addCase(deleteUserProfile.fulfilled, (state) => {
        state.loading.deleting = false;
        state.isDeleting = false;
        state.currentUser = null;
        state.profile = initialState.profile;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deleteUserProfile.rejected, (state, action) => {
        state.loading.deleting = false;
        state.isDeleting = false;
        state.errors.deleting = action.payload;
      })
      
      // Upload profile photo
      .addCase(uploadProfilePhoto.pending, (state) => {
        state.loading.updating = true;
        state.errors.updating = null;
      })
      .addCase(uploadProfilePhoto.fulfilled, (state, action) => {
        state.loading.updating = false;
        state.profile.avatar = action.payload.avatar;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(uploadProfilePhoto.rejected, (state, action) => {
        state.loading.updating = false;
        state.errors.updating = action.payload;
      });
  }
});

// Export actions
export const {
  clearError,
  setEditing,
  setCreating,
  setDeleting,
  updateProfileLocal,
  resetProfile,
  setViewedProfile,
  clearViewedProfile
} = profileSlice.actions;

// Export reducer
export default profileSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.profile.currentUser;
export const selectViewedProfile = (state) => state.profile.viewedProfile;
export const selectProfile = (state) => state.profile.profile;
export const selectProfileLoading = (state) => state.profile.loading;
export const selectProfileErrors = (state) => state.profile.errors;
export const selectIsEditing = (state) => state.profile.isEditing;
export const selectIsCreating = (state) => state.profile.isCreating;
export const selectIsDeleting = (state) => state.profile.isDeleting;
export const selectLastUpdated = (state) => state.profile.lastUpdated;
