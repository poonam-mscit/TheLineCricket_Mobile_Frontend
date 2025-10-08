// Redux slice for community state management
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';

// Initial state
const initialState = {
  // Communities data
  communities: [],
  currentCommunity: null,
  
  // Loading states
  loading: {
    communities: false,
    currentCommunity: false,
    creating: false,
    updating: false,
    deleting: false,
    joining: false,
    leaving: false
  },
  
  // Error states
  errors: {
    communities: null,
    currentCommunity: null,
    creating: null,
    updating: null,
    deleting: null,
    joining: null,
    leaving: null
  },
  
  // Pagination
  pagination: {
    page: 1,
    hasMore: true,
    total: 0
  },
  
  // Filters
  filters: {
    category: null,
    location: null,
    member_count: null,
    activity_level: null
  },
  
  // Last updated timestamp
  lastUpdated: null
};

// Async thunks for community actions
export const fetchCommunities = createAsyncThunk(
  'communities/fetchCommunities',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiService.getCommunities(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCommunityById = createAsyncThunk(
  'communities/fetchCommunityById',
  async (communityId, { rejectWithValue }) => {
    try {
      const response = await apiService.getCommunityById(communityId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCommunity = createAsyncThunk(
  'communities/createCommunity',
  async (communityData, { rejectWithValue }) => {
    try {
      const response = await apiService.createCommunity(communityData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCommunity = createAsyncThunk(
  'communities/updateCommunity',
  async ({ communityId, communityData }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateCommunity(communityId, communityData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCommunity = createAsyncThunk(
  'communities/deleteCommunity',
  async (communityId, { rejectWithValue }) => {
    try {
      const response = await apiService.deleteCommunity(communityId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const joinCommunity = createAsyncThunk(
  'communities/joinCommunity',
  async (communityId, { rejectWithValue }) => {
    try {
      const response = await apiService.joinCommunity(communityId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const leaveCommunity = createAsyncThunk(
  'communities/leaveCommunity',
  async (communityId, { rejectWithValue }) => {
    try {
      const response = await apiService.leaveCommunity(communityId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Community slice
const communitySlice = createSlice({
  name: 'communities',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state, action) => {
      const errorType = action.payload || 'all';
      if (errorType === 'all') {
        state.errors = {
          communities: null,
          currentCommunity: null,
          creating: null,
          updating: null,
          deleting: null,
          joining: null,
          leaving: null
        };
      } else {
        state.errors[errorType] = null;
      }
    },
    
    // Set filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // Clear filters
    clearFilters: (state) => {
      state.filters = {
        category: null,
        location: null,
        member_count: null,
        activity_level: null
      };
    },
    
    // Set current community
    setCurrentCommunity: (state, action) => {
      state.currentCommunity = action.payload;
    },
    
    // Clear current community
    clearCurrentCommunity: (state) => {
      state.currentCommunity = null;
    },
    
    // Reset community state
    resetCommunityState: (state) => {
      return { ...initialState };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch communities
      .addCase(fetchCommunities.pending, (state) => {
        state.loading.communities = true;
        state.errors.communities = null;
      })
      .addCase(fetchCommunities.fulfilled, (state, action) => {
        state.loading.communities = false;
        state.communities = action.payload.communities || [];
        state.pagination = action.payload.pagination || state.pagination;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchCommunities.rejected, (state, action) => {
        state.loading.communities = false;
        state.errors.communities = action.payload;
      })
      
      // Fetch community by ID
      .addCase(fetchCommunityById.pending, (state) => {
        state.loading.currentCommunity = true;
        state.errors.currentCommunity = null;
      })
      .addCase(fetchCommunityById.fulfilled, (state, action) => {
        state.loading.currentCommunity = false;
        state.currentCommunity = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchCommunityById.rejected, (state, action) => {
        state.loading.currentCommunity = false;
        state.errors.currentCommunity = action.payload;
      })
      
      // Create community
      .addCase(createCommunity.pending, (state) => {
        state.loading.creating = true;
        state.errors.creating = null;
      })
      .addCase(createCommunity.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.communities.unshift(action.payload);
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createCommunity.rejected, (state, action) => {
        state.loading.creating = false;
        state.errors.creating = action.payload;
      })
      
      // Update community
      .addCase(updateCommunity.pending, (state) => {
        state.loading.updating = true;
        state.errors.updating = null;
      })
      .addCase(updateCommunity.fulfilled, (state, action) => {
        state.loading.updating = false;
        const index = state.communities.findIndex(community => community.id === action.payload.id);
        if (index !== -1) {
          state.communities[index] = action.payload;
        }
        if (state.currentCommunity && state.currentCommunity.id === action.payload.id) {
          state.currentCommunity = action.payload;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateCommunity.rejected, (state, action) => {
        state.loading.updating = false;
        state.errors.updating = action.payload;
      })
      
      // Delete community
      .addCase(deleteCommunity.pending, (state) => {
        state.loading.deleting = true;
        state.errors.deleting = null;
      })
      .addCase(deleteCommunity.fulfilled, (state, action) => {
        state.loading.deleting = false;
        state.communities = state.communities.filter(community => community.id !== action.payload.id);
        if (state.currentCommunity && state.currentCommunity.id === action.payload.id) {
          state.currentCommunity = null;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deleteCommunity.rejected, (state, action) => {
        state.loading.deleting = false;
        state.errors.deleting = action.payload;
      })
      
      // Join community
      .addCase(joinCommunity.fulfilled, (state, action) => {
        const index = state.communities.findIndex(community => community.id === action.payload.communityId);
        if (index !== -1) {
          state.communities[index].members_count = (state.communities[index].members_count || 0) + 1;
          state.communities[index].is_member = true;
        }
        if (state.currentCommunity && state.currentCommunity.id === action.payload.communityId) {
          state.currentCommunity.members_count = (state.currentCommunity.members_count || 0) + 1;
          state.currentCommunity.is_member = true;
        }
        state.lastUpdated = new Date().toISOString();
      })
      
      // Leave community
      .addCase(leaveCommunity.fulfilled, (state, action) => {
        const index = state.communities.findIndex(community => community.id === action.payload.communityId);
        if (index !== -1) {
          state.communities[index].members_count = Math.max((state.communities[index].members_count || 1) - 1, 0);
          state.communities[index].is_member = false;
        }
        if (state.currentCommunity && state.currentCommunity.id === action.payload.communityId) {
          state.currentCommunity.members_count = Math.max((state.currentCommunity.members_count || 1) - 1, 0);
          state.currentCommunity.is_member = false;
        }
        state.lastUpdated = new Date().toISOString();
      });
  }
});

// Export actions
export const {
  clearError,
  setFilters,
  clearFilters,
  setCurrentCommunity,
  clearCurrentCommunity,
  resetCommunityState
} = communitySlice.actions;

// Export reducer
export default communitySlice.reducer;

// Selectors
export const selectCommunities = (state) => state.communities.communities;
export const selectCurrentCommunity = (state) => state.communities.currentCommunity;
export const selectCommunityLoading = (state) => state.communities.loading;
export const selectCommunityErrors = (state) => state.communities.errors;
export const selectCommunityFilters = (state) => state.communities.filters;
export const selectCommunityPagination = (state) => state.communities.pagination;
export const selectLastUpdated = (state) => state.communities.lastUpdated;
