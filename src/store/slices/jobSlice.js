// Redux slice for job state management
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';

// Initial state
const initialState = {
  // Jobs data
  jobs: [],
  currentJob: null,
  
  // Loading states
  loading: {
    jobs: false,
    currentJob: false,
    creating: false,
    updating: false,
    deleting: false,
    applying: false,
    saving: false
  },
  
  // Error states
  errors: {
    jobs: null,
    currentJob: null,
    creating: null,
    updating: null,
    deleting: null,
    applying: null,
    saving: null
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
    salary_range: null,
    experience_level: null,
    job_type: null
  },
  
  // Last updated timestamp
  lastUpdated: null
};

// Async thunks for job actions
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiService.getJobs(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchJobById = createAsyncThunk(
  'jobs/fetchJobById',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await apiService.getJobById(jobId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await apiService.createJob(jobData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ jobId, jobData }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateJob(jobId, jobData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await apiService.deleteJob(jobId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const applyToJob = createAsyncThunk(
  'jobs/applyToJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await apiService.applyToJob(jobId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveJob = createAsyncThunk(
  'jobs/saveJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await apiService.saveJob(jobId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const unsaveJob = createAsyncThunk(
  'jobs/unsaveJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await apiService.unsaveJob(jobId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Job slice
const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state, action) => {
      const errorType = action.payload || 'all';
      if (errorType === 'all') {
        state.errors = {
          jobs: null,
          currentJob: null,
          creating: null,
          updating: null,
          deleting: null,
          applying: null,
          saving: null
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
        salary_range: null,
        experience_level: null,
        job_type: null
      };
    },
    
    // Set current job
    setCurrentJob: (state, action) => {
      state.currentJob = action.payload;
    },
    
    // Clear current job
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    
    // Reset job state
    resetJobState: (state) => {
      return { ...initialState };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading.jobs = true;
        state.errors.jobs = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading.jobs = false;
        state.jobs = action.payload.jobs || [];
        state.pagination = action.payload.pagination || state.pagination;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading.jobs = false;
        state.errors.jobs = action.payload;
      })
      
      // Fetch job by ID
      .addCase(fetchJobById.pending, (state) => {
        state.loading.currentJob = true;
        state.errors.currentJob = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading.currentJob = false;
        state.currentJob = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading.currentJob = false;
        state.errors.currentJob = action.payload;
      })
      
      // Create job
      .addCase(createJob.pending, (state) => {
        state.loading.creating = true;
        state.errors.creating = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.jobs.unshift(action.payload);
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading.creating = false;
        state.errors.creating = action.payload;
      })
      
      // Update job
      .addCase(updateJob.pending, (state) => {
        state.loading.updating = true;
        state.errors.updating = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading.updating = false;
        const index = state.jobs.findIndex(job => job.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        if (state.currentJob && state.currentJob.id === action.payload.id) {
          state.currentJob = action.payload;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading.updating = false;
        state.errors.updating = action.payload;
      })
      
      // Delete job
      .addCase(deleteJob.pending, (state) => {
        state.loading.deleting = true;
        state.errors.deleting = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading.deleting = false;
        state.jobs = state.jobs.filter(job => job.id !== action.payload.id);
        if (state.currentJob && state.currentJob.id === action.payload.id) {
          state.currentJob = null;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading.deleting = false;
        state.errors.deleting = action.payload;
      })
      
      // Apply to job
      .addCase(applyToJob.fulfilled, (state, action) => {
        const index = state.jobs.findIndex(job => job.id === action.payload.jobId);
        if (index !== -1) {
          state.jobs[index].applications_count = (state.jobs[index].applications_count || 0) + 1;
          state.jobs[index].has_applied = true;
        }
        if (state.currentJob && state.currentJob.id === action.payload.jobId) {
          state.currentJob.applications_count = (state.currentJob.applications_count || 0) + 1;
          state.currentJob.has_applied = true;
        }
        state.lastUpdated = new Date().toISOString();
      })
      
      // Save job
      .addCase(saveJob.fulfilled, (state, action) => {
        const index = state.jobs.findIndex(job => job.id === action.payload.jobId);
        if (index !== -1) {
          state.jobs[index].is_saved = true;
        }
        if (state.currentJob && state.currentJob.id === action.payload.jobId) {
          state.currentJob.is_saved = true;
        }
        state.lastUpdated = new Date().toISOString();
      })
      
      // Unsave job
      .addCase(unsaveJob.fulfilled, (state, action) => {
        const index = state.jobs.findIndex(job => job.id === action.payload.jobId);
        if (index !== -1) {
          state.jobs[index].is_saved = false;
        }
        if (state.currentJob && state.currentJob.id === action.payload.jobId) {
          state.currentJob.is_saved = false;
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
  setCurrentJob,
  clearCurrentJob,
  resetJobState
} = jobSlice.actions;

// Export reducer
export default jobSlice.reducer;

// Selectors
export const selectJobs = (state) => state.jobs.jobs;
export const selectCurrentJob = (state) => state.jobs.currentJob;
export const selectJobLoading = (state) => state.jobs.loading;
export const selectJobErrors = (state) => state.jobs.errors;
export const selectJobFilters = (state) => state.jobs.filters;
export const selectJobPagination = (state) => state.jobs.pagination;
export const selectLastUpdated = (state) => state.jobs.lastUpdated;
