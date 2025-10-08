// Redux slice for match state management
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';

// Initial state
const initialState = {
  // Matches data
  matches: [],
  currentMatch: null,
  
  // Loading states
  loading: {
    matches: false,
    currentMatch: false,
    creating: false,
    updating: false,
    deleting: false
  },
  
  // Error states
  errors: {
    matches: null,
    currentMatch: null,
    creating: null,
    updating: null,
    deleting: null
  },
  
  // Pagination
  pagination: {
    page: 1,
    hasMore: true,
    total: 0
  },
  
  // Filters
  filters: {
    match_type: null,
    location: null,
    skill_level: null,
    date_range: null
  },
  
  // Last updated timestamp
  lastUpdated: null
};

// Async thunks for match actions
export const fetchMatches = createAsyncThunk(
  'matches/fetchMatches',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiService.getMatches(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMatchById = createAsyncThunk(
  'matches/fetchMatchById',
  async (matchId, { rejectWithValue }) => {
    try {
      const response = await apiService.getMatchById(matchId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createMatch = createAsyncThunk(
  'matches/createMatch',
  async (matchData, { rejectWithValue }) => {
    try {
      const response = await apiService.createMatch(matchData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateMatch = createAsyncThunk(
  'matches/updateMatch',
  async ({ matchId, matchData }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateMatch(matchId, matchData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteMatch = createAsyncThunk(
  'matches/deleteMatch',
  async (matchId, { rejectWithValue }) => {
    try {
      const response = await apiService.deleteMatch(matchId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const joinMatch = createAsyncThunk(
  'matches/joinMatch',
  async (matchId, { rejectWithValue }) => {
    try {
      const response = await apiService.joinMatch(matchId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const leaveMatch = createAsyncThunk(
  'matches/leaveMatch',
  async (matchId, { rejectWithValue }) => {
    try {
      const response = await apiService.leaveMatch(matchId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Match slice
const matchSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state, action) => {
      const errorType = action.payload || 'all';
      if (errorType === 'all') {
        state.errors = {
          matches: null,
          currentMatch: null,
          creating: null,
          updating: null,
          deleting: null
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
        match_type: null,
        location: null,
        skill_level: null,
        date_range: null
      };
    },
    
    // Set current match
    setCurrentMatch: (state, action) => {
      state.currentMatch = action.payload;
    },
    
    // Clear current match
    clearCurrentMatch: (state) => {
      state.currentMatch = null;
    },
    
    // Reset match state
    resetMatchState: (state) => {
      return { ...initialState };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch matches
      .addCase(fetchMatches.pending, (state) => {
        state.loading.matches = true;
        state.errors.matches = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading.matches = false;
        state.matches = action.payload.matches || [];
        state.pagination = action.payload.pagination || state.pagination;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading.matches = false;
        state.errors.matches = action.payload;
      })
      
      // Fetch match by ID
      .addCase(fetchMatchById.pending, (state) => {
        state.loading.currentMatch = true;
        state.errors.currentMatch = null;
      })
      .addCase(fetchMatchById.fulfilled, (state, action) => {
        state.loading.currentMatch = false;
        state.currentMatch = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchMatchById.rejected, (state, action) => {
        state.loading.currentMatch = false;
        state.errors.currentMatch = action.payload;
      })
      
      // Create match
      .addCase(createMatch.pending, (state) => {
        state.loading.creating = true;
        state.errors.creating = null;
      })
      .addCase(createMatch.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.matches.unshift(action.payload);
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createMatch.rejected, (state, action) => {
        state.loading.creating = false;
        state.errors.creating = action.payload;
      })
      
      // Update match
      .addCase(updateMatch.pending, (state) => {
        state.loading.updating = true;
        state.errors.updating = null;
      })
      .addCase(updateMatch.fulfilled, (state, action) => {
        state.loading.updating = false;
        const index = state.matches.findIndex(match => match.id === action.payload.id);
        if (index !== -1) {
          state.matches[index] = action.payload;
        }
        if (state.currentMatch && state.currentMatch.id === action.payload.id) {
          state.currentMatch = action.payload;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateMatch.rejected, (state, action) => {
        state.loading.updating = false;
        state.errors.updating = action.payload;
      })
      
      // Delete match
      .addCase(deleteMatch.pending, (state) => {
        state.loading.deleting = true;
        state.errors.deleting = null;
      })
      .addCase(deleteMatch.fulfilled, (state, action) => {
        state.loading.deleting = false;
        state.matches = state.matches.filter(match => match.id !== action.payload.id);
        if (state.currentMatch && state.currentMatch.id === action.payload.id) {
          state.currentMatch = null;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deleteMatch.rejected, (state, action) => {
        state.loading.deleting = false;
        state.errors.deleting = action.payload;
      })
      
      // Join match
      .addCase(joinMatch.fulfilled, (state, action) => {
        const index = state.matches.findIndex(match => match.id === action.payload.matchId);
        if (index !== -1) {
          state.matches[index].players_count = (state.matches[index].players_count || 0) + 1;
          state.matches[index].is_joined = true;
        }
        if (state.currentMatch && state.currentMatch.id === action.payload.matchId) {
          state.currentMatch.players_count = (state.currentMatch.players_count || 0) + 1;
          state.currentMatch.is_joined = true;
        }
        state.lastUpdated = new Date().toISOString();
      })
      
      // Leave match
      .addCase(leaveMatch.fulfilled, (state, action) => {
        const index = state.matches.findIndex(match => match.id === action.payload.matchId);
        if (index !== -1) {
          state.matches[index].players_count = Math.max((state.matches[index].players_count || 1) - 1, 0);
          state.matches[index].is_joined = false;
        }
        if (state.currentMatch && state.currentMatch.id === action.payload.matchId) {
          state.currentMatch.players_count = Math.max((state.currentMatch.players_count || 1) - 1, 0);
          state.currentMatch.is_joined = false;
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
  setCurrentMatch,
  clearCurrentMatch,
  resetMatchState
} = matchSlice.actions;

// Export reducer
export default matchSlice.reducer;

// Selectors
export const selectMatches = (state) => state.matches.matches;
export const selectCurrentMatch = (state) => state.matches.currentMatch;
export const selectMatchLoading = (state) => state.matches.loading;
export const selectMatchErrors = (state) => state.matches.errors;
export const selectMatchFilters = (state) => state.matches.filters;
export const selectMatchPagination = (state) => state.matches.pagination;
export const selectLastUpdated = (state) => state.matches.lastUpdated;
