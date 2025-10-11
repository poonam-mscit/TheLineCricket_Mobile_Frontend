// Redux slice for post state management
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';

// Initial state
const initialState = {
  // Posts data
  posts: [],
  currentPost: null,
  userPosts: [],
  
  // Loading states
  loading: {
    posts: false,
    currentPost: false,
    userPosts: false,
    creating: false,
    updating: false,
    deleting: false,
    liking: false,
    commenting: false
  },
  
  // Error states
  errors: {
    posts: null,
    currentPost: null,
    userPosts: null,
    creating: null,
    updating: null,
    deleting: null,
    liking: null,
    commenting: null
  },
  
  // Pagination
  pagination: {
    page: 1,
    hasMore: true,
    total: 0
  },
  
  // Filters - matches database posts table columns
  filters: {
    post_type: null, // VARCHAR(50) CHECK constraint
    visibility: null, // VARCHAR(20) CHECK constraint
    date_range: null,
    hashtags: null, // VARCHAR(500)
    page_id: null, // UUID REFERENCES page_profiles(page_id)
    community_profile_id: null, // UUID REFERENCES page_profiles(page_id)
    academy_profile_id: null, // UUID REFERENCES page_profiles(page_id)
    venue_profile_id: null, // UUID REFERENCES page_profiles(page_id)
    approval_status: null, // VARCHAR(20) CHECK constraint
    featured: null, // BOOLEAN
    priority: null // INTEGER
  },
  
  // Last updated timestamp
  lastUpdated: null
};

// Async thunks for post actions
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiService.getPosts(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await apiService.getPostById(postId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  'posts/fetchUserPosts',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiService.getUserPosts(userId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await apiService.createPost(postData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ postId, postData }, { rejectWithValue }) => {
    try {
      const response = await apiService.updatePost(postId, postData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await apiService.deletePost(postId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const likePost = createAsyncThunk(
  'posts/likePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await apiService.likePost(postId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const unlikePost = createAsyncThunk(
  'posts/unlikePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await apiService.unlikePost(postId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const commentOnPost = createAsyncThunk(
  'posts/commentOnPost',
  async ({ postId, commentData }, { rejectWithValue }) => {
    try {
      const response = await apiService.commentOnPost(postId, commentData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sharePost = createAsyncThunk(
  'posts/sharePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await apiService.sharePost(postId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Post slice
const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state, action) => {
      const errorType = action.payload || 'all';
      if (errorType === 'all') {
        state.errors = {
          posts: null,
          currentPost: null,
          userPosts: null,
          creating: null,
          updating: null,
          deleting: null,
          liking: null,
          commenting: null
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
        post_type: null,
        visibility: null,
        date_range: null,
        hashtags: null
      };
    },
    
    // Set current post
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
    
    // Clear current post
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    
    // Add post to feed (for optimistic updates)
    addPostToFeed: (state, action) => {
      state.posts.unshift(action.payload);
    },
    
    // Remove post from feed
    removePostFromFeed: (state, action) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
    },
    
    // Update post in feed
    updatePostInFeed: (state, action) => {
      const index = state.posts.findIndex(post => post.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    
    // Reset post state
    resetPostState: (state) => {
      return { ...initialState };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading.posts = true;
        state.errors.posts = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading.posts = false;
        state.posts = action.payload.posts || [];
        state.pagination = action.payload.pagination || state.pagination;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading.posts = false;
        state.errors.posts = action.payload;
      })
      
      // Fetch post by ID
      .addCase(fetchPostById.pending, (state) => {
        state.loading.currentPost = true;
        state.errors.currentPost = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading.currentPost = false;
        state.currentPost = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading.currentPost = false;
        state.errors.currentPost = action.payload;
      })
      
      // Fetch user posts
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading.userPosts = true;
        state.errors.userPosts = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading.userPosts = false;
        state.userPosts = action.payload.posts || [];
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading.userPosts = false;
        state.errors.userPosts = action.payload;
      })
      
      // Create post
      .addCase(createPost.pending, (state) => {
        state.loading.creating = true;
        state.errors.creating = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.posts.unshift(action.payload);
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading.creating = false;
        state.errors.creating = action.payload;
      })
      
      // Update post
      .addCase(updatePost.pending, (state) => {
        state.loading.updating = true;
        state.errors.updating = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading.updating = false;
        const index = state.posts.findIndex(post => post.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        if (state.currentPost && state.currentPost.id === action.payload.id) {
          state.currentPost = action.payload;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading.updating = false;
        state.errors.updating = action.payload;
      })
      
      // Delete post
      .addCase(deletePost.pending, (state) => {
        state.loading.deleting = true;
        state.errors.deleting = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading.deleting = false;
        state.posts = state.posts.filter(post => post.id !== action.payload.id);
        if (state.currentPost && state.currentPost.id === action.payload.id) {
          state.currentPost = null;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading.deleting = false;
        state.errors.deleting = action.payload;
      })
      
      // Like post
      .addCase(likePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post.id === action.payload.postId);
        if (index !== -1) {
          state.posts[index].likes_count = (state.posts[index].likes_count || 0) + 1;
          state.posts[index].is_liked = true;
        }
        if (state.currentPost && state.currentPost.id === action.payload.postId) {
          state.currentPost.likes_count = (state.currentPost.likes_count || 0) + 1;
          state.currentPost.is_liked = true;
        }
        state.lastUpdated = new Date().toISOString();
      })
      
      // Unlike post
      .addCase(unlikePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post.id === action.payload.postId);
        if (index !== -1) {
          state.posts[index].likes_count = Math.max((state.posts[index].likes_count || 1) - 1, 0);
          state.posts[index].is_liked = false;
        }
        if (state.currentPost && state.currentPost.id === action.payload.postId) {
          state.currentPost.likes_count = Math.max((state.currentPost.likes_count || 1) - 1, 0);
          state.currentPost.is_liked = false;
        }
        state.lastUpdated = new Date().toISOString();
      })
      
      // Comment on post
      .addCase(commentOnPost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post.id === action.payload.postId);
        if (index !== -1) {
          state.posts[index].comments_count = (state.posts[index].comments_count || 0) + 1;
        }
        if (state.currentPost && state.currentPost.id === action.payload.postId) {
          state.currentPost.comments_count = (state.currentPost.comments_count || 0) + 1;
        }
        state.lastUpdated = new Date().toISOString();
      })
      
      // Share post
      .addCase(sharePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post.id === action.payload.postId);
        if (index !== -1) {
          state.posts[index].shares_count = (state.posts[index].shares_count || 0) + 1;
        }
        if (state.currentPost && state.currentPost.id === action.payload.postId) {
          state.currentPost.shares_count = (state.currentPost.shares_count || 0) + 1;
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
  setCurrentPost,
  clearCurrentPost,
  addPostToFeed,
  removePostFromFeed,
  updatePostInFeed,
  resetPostState
} = postSlice.actions;

// Export reducer
export default postSlice.reducer;

// Selectors
export const selectPosts = (state) => state.posts.posts;
export const selectCurrentPost = (state) => state.posts.currentPost;
export const selectUserPosts = (state) => state.posts.userPosts;
export const selectPostLoading = (state) => state.posts.loading;
export const selectPostErrors = (state) => state.posts.errors;
export const selectPostFilters = (state) => state.posts.filters;
export const selectPostPagination = (state) => state.posts.pagination;
export const selectLastUpdated = (state) => state.posts.lastUpdated;
