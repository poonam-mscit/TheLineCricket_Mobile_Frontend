// Redux slice for API state management
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';

// Initial state
const initialState = {
  // Connection state
  isConnected: false,
  lastConnected: null,
  connectionError: null,
  
  // API call states
  loading: {
    posts: false,
    matches: false,
    messages: false,
    notifications: false,
    search: false,
    profile: false
  },
  
  // Error states
  errors: {
    posts: null,
    matches: null,
    messages: null,
    notifications: null,
    search: null,
    profile: null
  },
  
  // Cached data
  cache: {
    posts: [],
    matches: [],
    messages: [],
    notifications: [],
    searchResults: [],
    userProfiles: {}
  },
  
  // Pagination
  pagination: {
    posts: { page: 1, hasMore: true },
    matches: { page: 1, hasMore: true },
    messages: { page: 1, hasMore: true },
    notifications: { page: 1, hasMore: true }
  },
  
  // Last updated timestamps
  lastUpdated: {
    posts: null,
    matches: null,
    messages: null,
    notifications: null
  }
};

// Async thunks for API actions
export const testConnection = createAsyncThunk(
  'api/testConnection',
  async (_, { rejectWithValue }) => {
    try {
      const result = await apiService.testConnection();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPosts = createAsyncThunk(
  'api/fetchPosts',
  async ({ page = 1, perPage = 20, refresh = false }, { rejectWithValue, getState }) => {
    try {
      const result = await apiService.getFeedPosts(page, perPage);
      return { ...result, page, refresh };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPost = createAsyncThunk(
  'api/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const result = await apiService.createPost(postData);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const togglePostLike = createAsyncThunk(
  'api/togglePostLike',
  async (postId, { rejectWithValue }) => {
    try {
      const result = await apiService.togglePostLike(postId);
      return { postId, result };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMatches = createAsyncThunk(
  'api/fetchMatches',
  async ({ filters = {}, page = 1, perPage = 20, refresh = false }, { rejectWithValue }) => {
    try {
      const result = await apiService.getMatches(filters);
      return { ...result, page, refresh };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createMatch = createAsyncThunk(
  'api/createMatch',
  async (matchData, { rejectWithValue }) => {
    try {
      const result = await apiService.createMatch(matchData);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const joinMatch = createAsyncThunk(
  'api/joinMatch',
  async (matchId, { rejectWithValue }) => {
    try {
      const result = await apiService.joinMatch(matchId);
      return { matchId, result };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const leaveMatch = createAsyncThunk(
  'api/leaveMatch',
  async (matchId, { rejectWithValue }) => {
    try {
      const result = await apiService.leaveMatch(matchId);
      return { matchId, result };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'api/fetchMessages',
  async ({ conversationId, page = 1, perPage = 50, refresh = false }, { rejectWithValue }) => {
    try {
      const result = await apiService.getConversationMessages(conversationId, page, perPage);
      return { ...result, conversationId, page, refresh };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'api/sendMessage',
  async ({ conversationId, messageData }, { rejectWithValue }) => {
    try {
      const result = await apiService.sendMessage(conversationId, messageData);
      return { conversationId, result };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchNotifications = createAsyncThunk(
  'api/fetchNotifications',
  async ({ page = 1, perPage = 20, refresh = false }, { rejectWithValue }) => {
    try {
      const result = await apiService.getNotifications(page, perPage);
      return { ...result, page, refresh };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  'api/markNotificationRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const result = await apiService.markNotificationRead(notificationId);
      return { notificationId, result };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const globalSearch = createAsyncThunk(
  'api/globalSearch',
  async ({ query, filters = {} }, { rejectWithValue }) => {
    try {
      const result = await apiService.globalSearch(query, filters);
      return { query, result };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// API slice
const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    // Set connection state
    setConnectionState: (state, action) => {
      state.isConnected = action.payload.isConnected;
      state.lastConnected = action.payload.lastConnected;
      state.connectionError = action.payload.connectionError;
    },
    
    // Clear error for specific resource
    clearError: (state, action) => {
      const resource = action.payload;
      state.errors[resource] = null;
    },
    
    // Clear all errors
    clearAllErrors: (state) => {
      Object.keys(state.errors).forEach(key => {
        state.errors[key] = null;
      });
    },
    
    // Set loading state for specific resource
    setLoading: (state, action) => {
      const { resource, loading } = action.payload;
      state.loading[resource] = loading;
    },
    
    // Update cache for specific resource
    updateCache: (state, action) => {
      const { resource, data } = action.payload;
      state.cache[resource] = data;
      state.lastUpdated[resource] = new Date().toISOString();
    },
    
    // Clear cache for specific resource
    clearCache: (state, action) => {
      const resource = action.payload;
      state.cache[resource] = [];
      state.pagination[resource] = { page: 1, hasMore: true };
      state.lastUpdated[resource] = null;
    },
    
    // Update pagination for specific resource
    updatePagination: (state, action) => {
      const { resource, page, hasMore } = action.payload;
      state.pagination[resource] = { page, hasMore };
    },
    
    // Reset API state
    resetApiState: (state) => {
      return { ...initialState };
    }
  },
  extraReducers: (builder) => {
    builder
      // Test connection
      .addCase(testConnection.pending, (state) => {
        state.loading.connection = true;
        state.connectionError = null;
      })
      .addCase(testConnection.fulfilled, (state) => {
        state.loading.connection = false;
        state.isConnected = true;
        state.lastConnected = new Date().toISOString();
        state.connectionError = null;
      })
      .addCase(testConnection.rejected, (state, action) => {
        state.loading.connection = false;
        state.isConnected = false;
        state.connectionError = action.payload;
      })
      
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading.posts = true;
        state.errors.posts = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading.posts = false;
        const { posts, page, refresh } = action.payload;
        
        if (refresh || page === 1) {
          state.cache.posts = posts;
        } else {
          state.cache.posts = [...state.cache.posts, ...posts];
        }
        
        state.pagination.posts.page = page;
        state.pagination.posts.hasMore = posts.length === 20; // Assuming 20 is perPage
        state.lastUpdated.posts = new Date().toISOString();
        state.errors.posts = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading.posts = false;
        state.errors.posts = action.payload;
      })
      
      // Create post
      .addCase(createPost.pending, (state) => {
        state.loading.posts = true;
        state.errors.posts = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading.posts = false;
        state.cache.posts.unshift(action.payload.post);
        state.errors.posts = null;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading.posts = false;
        state.errors.posts = action.payload;
      })
      
      // Toggle post like
      .addCase(togglePostLike.fulfilled, (state, action) => {
        const { postId, result } = action.payload;
        const postIndex = state.cache.posts.findIndex(post => post.id === postId);
        if (postIndex !== -1) {
          state.cache.posts[postIndex] = { ...state.cache.posts[postIndex], ...result };
        }
      })
      
      // Fetch matches
      .addCase(fetchMatches.pending, (state) => {
        state.loading.matches = true;
        state.errors.matches = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading.matches = false;
        const { matches, page, refresh } = action.payload;
        
        if (refresh || page === 1) {
          state.cache.matches = matches;
        } else {
          state.cache.matches = [...state.cache.matches, ...matches];
        }
        
        state.pagination.matches.page = page;
        state.pagination.matches.hasMore = matches.length === 20;
        state.lastUpdated.matches = new Date().toISOString();
        state.errors.matches = null;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading.matches = false;
        state.errors.matches = action.payload;
      })
      
      // Create match
      .addCase(createMatch.pending, (state) => {
        state.loading.matches = true;
        state.errors.matches = null;
      })
      .addCase(createMatch.fulfilled, (state, action) => {
        state.loading.matches = false;
        state.cache.matches.unshift(action.payload.match);
        state.errors.matches = null;
      })
      .addCase(createMatch.rejected, (state, action) => {
        state.loading.matches = false;
        state.errors.matches = action.payload;
      })
      
      // Join match
      .addCase(joinMatch.fulfilled, (state, action) => {
        const { matchId, result } = action.payload;
        const matchIndex = state.cache.matches.findIndex(match => match.id === matchId);
        if (matchIndex !== -1) {
          state.cache.matches[matchIndex] = { ...state.cache.matches[matchIndex], ...result };
        }
      })
      
      // Leave match
      .addCase(leaveMatch.fulfilled, (state, action) => {
        const { matchId, result } = action.payload;
        const matchIndex = state.cache.matches.findIndex(match => match.id === matchId);
        if (matchIndex !== -1) {
          state.cache.matches[matchIndex] = { ...state.cache.matches[matchIndex], ...result };
        }
      })
      
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading.messages = true;
        state.errors.messages = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading.messages = false;
        const { messages, conversationId, page, refresh } = action.payload;
        
        if (refresh || page === 1) {
          state.cache.messages = messages;
        } else {
          state.cache.messages = [...state.cache.messages, ...messages];
        }
        
        state.pagination.messages.page = page;
        state.pagination.messages.hasMore = messages.length === 50;
        state.lastUpdated.messages = new Date().toISOString();
        state.errors.messages = null;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading.messages = false;
        state.errors.messages = action.payload;
      })
      
      // Send message
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { result } = action.payload;
        state.cache.messages.push(result.message);
      })
      
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading.notifications = true;
        state.errors.notifications = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading.notifications = false;
        const { notifications, page, refresh } = action.payload;
        
        if (refresh || page === 1) {
          state.cache.notifications = notifications;
        } else {
          state.cache.notifications = [...state.cache.notifications, ...notifications];
        }
        
        state.pagination.notifications.page = page;
        state.pagination.notifications.hasMore = notifications.length === 20;
        state.lastUpdated.notifications = new Date().toISOString();
        state.errors.notifications = null;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading.notifications = false;
        state.errors.notifications = action.payload;
      })
      
      // Mark notification read
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const { notificationId } = action.payload;
        const notificationIndex = state.cache.notifications.findIndex(n => n.id === notificationId);
        if (notificationIndex !== -1) {
          state.cache.notifications[notificationIndex].is_read = true;
        }
      })
      
      // Global search
      .addCase(globalSearch.pending, (state) => {
        state.loading.search = true;
        state.errors.search = null;
      })
      .addCase(globalSearch.fulfilled, (state, action) => {
        state.loading.search = false;
        const { query, result } = action.payload;
        state.cache.searchResults = result.results || [];
        state.errors.search = null;
      })
      .addCase(globalSearch.rejected, (state, action) => {
        state.loading.search = false;
        state.errors.search = action.payload;
      });
  }
});

// Export actions
export const {
  setConnectionState,
  clearError,
  clearAllErrors,
  setLoading,
  updateCache,
  clearCache,
  updatePagination,
  resetApiState
} = apiSlice.actions;

// Selectors
export const selectIsConnected = (state) => state.api.isConnected;
export const selectConnectionError = (state) => state.api.connectionError;
export const selectApiLoading = (state) => state.api.loading;
export const selectApiErrors = (state) => state.api.errors;
export const selectCache = (state) => state.api.cache;
export const selectPagination = (state) => state.api.pagination;
export const selectLastUpdated = (state) => state.api.lastUpdated;

// Resource-specific selectors
export const selectPosts = (state) => state.api.cache.posts;
export const selectMatches = (state) => state.api.cache.matches;
export const selectMessages = (state) => state.api.cache.messages;
export const selectNotifications = (state) => state.api.cache.notifications;
export const selectSearchResults = (state) => state.api.cache.searchResults;

// Export reducer
export default apiSlice.reducer;
