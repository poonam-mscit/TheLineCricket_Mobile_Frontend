// Redux slice for profile state management
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';

// Transform backend data to frontend format - matches database users table
const transformUserData = (rawData) => {
  console.log('🔄 Transform: Raw data:', rawData);
  
  // Extract profile data if it exists (from user_profiles table)
  const profile = rawData.profile || {};
  
  const transformed = {
    // Database users table columns
    id: rawData.id || '',
    firebase_uid: rawData.firebase_uid || '',
    firebase_email: rawData.firebase_email || '',
    cognito_user_id: rawData.cognito_user_id || '',
    email: rawData.email || '',
    username: rawData.username || '',
    is_verified: rawData.is_verified || false,
    is_active: rawData.is_active !== undefined ? rawData.is_active : true,
    auth_provider: rawData.auth_provider || '',
    created_at: rawData.created_at || '',
    updated_at: rawData.updated_at || '',
    
    // Profile data (from user_profiles table)
    fullName: profile.full_name || '',
    avatar: profile.profile_image_url || '',
    bio: profile.bio || '',
    location: profile.location || '',
    organization: profile.organization || '',
    age: profile.age || null,
    gender: profile.gender || '',
    contact_number: profile.contact_number || '',
    batting_skill: profile.batting_skill || 0,
    bowling_skill: profile.bowling_skill || 0,
    fielding_skill: profile.fielding_skill || 0,
    
    // Stats transformation
    stats: {
      posts: rawData.posts_count || 0,
      matches: profile.stats?.total_matches || 0,
      followers: rawData.followers_count || 0,
      following: rawData.following_count || 0,
      wins: rawData.wins_count || 0,
      losses: rawData.losses_count || 0,
      winRate: rawData.win_rate || 0,
      totalRuns: profile.stats?.total_runs || 0,
      totalWickets: profile.stats?.total_wickets || 0,
      bestScore: profile.stats?.highest_score || 0,
      bestBowling: profile.stats?.best_bowling_figures || '0/0',
      achievements: profile.achievements?.length || 0
    },
    
    // Skills transformation
    skills: {
      batting: profile.batting_skill || 0,
      bowling: profile.bowling_skill || 0,
      fielding: profile.fielding_skill || 0
    },
    
    // Cricket stats transformation
    cricketStats: {
      batting: {
        totalRuns: profile.stats?.total_runs || 0,
        matches: profile.stats?.total_matches || 0,
        centuries: profile.stats?.centuries || 0,
        halfCenturies: profile.stats?.half_centuries || 0,
        average: profile.stats?.batting_average || 0,
        highestScore: profile.stats?.highest_score || 0,
        strikeRate: profile.stats?.batting_strike_rate || 0
      },
      bowling: {
        matches: profile.stats?.total_matches || 0,
        overs: profile.stats?.total_overs || 0,
        wickets: profile.stats?.total_wickets || 0,
        hatTricks: profile.stats?.hat_tricks || 0,
        bestFigures: profile.stats?.best_bowling_figures || '0/0',
        average: profile.stats?.bowling_average || 0,
        economy: profile.stats?.bowling_economy || 0
      },
      fielding: {
        matches: profile.stats?.total_matches || 0,
        catches: profile.stats?.catches || 0,
        stumpings: profile.stats?.stumpings || 0,
        runOuts: profile.stats?.run_outs || 0
      }
    },
    
    // Experience transformation
    experience: profile.experiences?.map(exp => ({
      id: exp.id,
      title: exp.title,
      organization: exp.role,
      duration: exp.duration,
      description: exp.description
    })) || [],
    
    // Achievements transformation
    achievements: profile.achievements?.map(ach => ({
      id: ach.id,
      title: ach.title,
      year: ach.year,
      description: ach.description
    })) || [],
    
    // Awards transformation (if available)
    awards: profile.awards?.map(award => ({
      id: award.id,
      title: award.title,
      organization: award.organization,
      year: award.year,
      description: award.description
    })) || []
  };
  
  console.log('🔄 Transform: Transformed data:', transformed);
  return transformed;
};

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
  
  // Profile data - matches database users table structure
  profile: {
    // Database users table columns
    id: null,
    firebase_uid: '',
    firebase_email: '',
    cognito_user_id: '',
    email: '',
    username: '',
    is_verified: false,
    is_active: true,
    auth_provider: '',
    created_at: '',
    updated_at: '',
    
    // Profile data (from user_profiles table)
    fullName: '',
    bio: '',
    location: '',
    organization: '',
    age: null,
    gender: '',
    contact_number: '',
    avatar: null,
    coverImage: null,
    
    // Skills (from user_profiles table)
    batting_skill: 0,
    bowling_skill: 0,
    fielding_skill: 0,
    
    // Stats
    stats: {
      posts: 0,
      matches: 0,
      followers: 0,
      following: 0,
      wins: 0,
      losses: 0
    },
    
    // Additional frontend fields
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
      console.log('🔄 Redux: fetchCurrentUser called');
      const response = await apiService.getCurrentUser();
      console.log('✅ Redux: fetchCurrentUser response:', response);
      return response;
    } catch (error) {
      console.error('❌ Redux: fetchCurrentUser error:', error);
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
        console.log('🔄 Redux: fetchCurrentUser.fulfilled - action.payload:', action.payload);
        // Extract user data from the wrapped response
        const rawUserData = action.payload.user || action.payload;
        console.log('🔄 Redux: Raw userData:', rawUserData);
        
        // Transform backend data to frontend format
        const userData = transformUserData(rawUserData);
        console.log('🔄 Redux: Transformed userData:', userData);
        
        state.currentUser = userData;
        state.profile = { ...state.profile, ...userData };
        state.lastUpdated = new Date().toISOString();
        console.log('🔄 Redux: Updated state.currentUser:', state.currentUser);
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
