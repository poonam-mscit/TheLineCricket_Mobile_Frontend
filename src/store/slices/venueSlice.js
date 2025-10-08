// Redux slice for venue state management
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';

// Initial state
const initialState = {
  // Venues data
  venues: [],
  currentVenue: null,
  
  // Loading states
  loading: {
    venues: false,
    currentVenue: false,
    creating: false,
    updating: false,
    deleting: false,
    booking: false
  },
  
  // Error states
  errors: {
    venues: null,
    currentVenue: null,
    creating: null,
    updating: null,
    deleting: null,
    booking: null
  },
  
  // Pagination
  pagination: {
    page: 1,
    hasMore: true,
    total: 0
  },
  
  // Filters
  filters: {
    location: null,
    capacity: null,
    price_range: null,
    amenities: null,
    availability: null
  },
  
  // Last updated timestamp
  lastUpdated: null
};

// Async thunks for venue actions
export const fetchVenues = createAsyncThunk(
  'venues/fetchVenues',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiService.getVenues(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchVenueById = createAsyncThunk(
  'venues/fetchVenueById',
  async (venueId, { rejectWithValue }) => {
    try {
      const response = await apiService.getVenueById(venueId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createVenue = createAsyncThunk(
  'venues/createVenue',
  async (venueData, { rejectWithValue }) => {
    try {
      const response = await apiService.createVenue(venueData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateVenue = createAsyncThunk(
  'venues/updateVenue',
  async ({ venueId, venueData }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateVenue(venueId, venueData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteVenue = createAsyncThunk(
  'venues/deleteVenue',
  async (venueId, { rejectWithValue }) => {
    try {
      const response = await apiService.deleteVenue(venueId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const bookVenue = createAsyncThunk(
  'venues/bookVenue',
  async ({ venueId, bookingData }, { rejectWithValue }) => {
    try {
      const response = await apiService.bookVenue(venueId, bookingData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Venue slice
const venueSlice = createSlice({
  name: 'venues',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state, action) => {
      const errorType = action.payload || 'all';
      if (errorType === 'all') {
        state.errors = {
          venues: null,
          currentVenue: null,
          creating: null,
          updating: null,
          deleting: null,
          booking: null
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
        location: null,
        capacity: null,
        price_range: null,
        amenities: null,
        availability: null
      };
    },
    
    // Set current venue
    setCurrentVenue: (state, action) => {
      state.currentVenue = action.payload;
    },
    
    // Clear current venue
    clearCurrentVenue: (state) => {
      state.currentVenue = null;
    },
    
    // Reset venue state
    resetVenueState: (state) => {
      return { ...initialState };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch venues
      .addCase(fetchVenues.pending, (state) => {
        state.loading.venues = true;
        state.errors.venues = null;
      })
      .addCase(fetchVenues.fulfilled, (state, action) => {
        state.loading.venues = false;
        state.venues = action.payload.venues || [];
        state.pagination = action.payload.pagination || state.pagination;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchVenues.rejected, (state, action) => {
        state.loading.venues = false;
        state.errors.venues = action.payload;
      })
      
      // Fetch venue by ID
      .addCase(fetchVenueById.pending, (state) => {
        state.loading.currentVenue = true;
        state.errors.currentVenue = null;
      })
      .addCase(fetchVenueById.fulfilled, (state, action) => {
        state.loading.currentVenue = false;
        state.currentVenue = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchVenueById.rejected, (state, action) => {
        state.loading.currentVenue = false;
        state.errors.currentVenue = action.payload;
      })
      
      // Create venue
      .addCase(createVenue.pending, (state) => {
        state.loading.creating = true;
        state.errors.creating = null;
      })
      .addCase(createVenue.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.venues.unshift(action.payload);
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createVenue.rejected, (state, action) => {
        state.loading.creating = false;
        state.errors.creating = action.payload;
      })
      
      // Update venue
      .addCase(updateVenue.pending, (state) => {
        state.loading.updating = true;
        state.errors.updating = null;
      })
      .addCase(updateVenue.fulfilled, (state, action) => {
        state.loading.updating = false;
        const index = state.venues.findIndex(venue => venue.id === action.payload.id);
        if (index !== -1) {
          state.venues[index] = action.payload;
        }
        if (state.currentVenue && state.currentVenue.id === action.payload.id) {
          state.currentVenue = action.payload;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateVenue.rejected, (state, action) => {
        state.loading.updating = false;
        state.errors.updating = action.payload;
      })
      
      // Delete venue
      .addCase(deleteVenue.pending, (state) => {
        state.loading.deleting = true;
        state.errors.deleting = null;
      })
      .addCase(deleteVenue.fulfilled, (state, action) => {
        state.loading.deleting = false;
        state.venues = state.venues.filter(venue => venue.id !== action.payload.id);
        if (state.currentVenue && state.currentVenue.id === action.payload.id) {
          state.currentVenue = null;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deleteVenue.rejected, (state, action) => {
        state.loading.deleting = false;
        state.errors.deleting = action.payload;
      })
      
      // Book venue
      .addCase(bookVenue.pending, (state) => {
        state.loading.booking = true;
        state.errors.booking = null;
      })
      .addCase(bookVenue.fulfilled, (state, action) => {
        state.loading.booking = false;
        const index = state.venues.findIndex(venue => venue.id === action.payload.venueId);
        if (index !== -1) {
          state.venues[index].bookings_count = (state.venues[index].bookings_count || 0) + 1;
        }
        if (state.currentVenue && state.currentVenue.id === action.payload.venueId) {
          state.currentVenue.bookings_count = (state.currentVenue.bookings_count || 0) + 1;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(bookVenue.rejected, (state, action) => {
        state.loading.booking = false;
        state.errors.booking = action.payload;
      });
  }
});

// Export actions
export const {
  clearError,
  setFilters,
  clearFilters,
  setCurrentVenue,
  clearCurrentVenue,
  resetVenueState
} = venueSlice.actions;

// Export reducer
export default venueSlice.reducer;

// Selectors
export const selectVenues = (state) => state.venues.venues;
export const selectCurrentVenue = (state) => state.venues.currentVenue;
export const selectVenueLoading = (state) => state.venues.loading;
export const selectVenueErrors = (state) => state.venues.errors;
export const selectVenueFilters = (state) => state.venues.filters;
export const selectVenuePagination = (state) => state.venues.pagination;
export const selectLastUpdated = (state) => state.venues.lastUpdated;
