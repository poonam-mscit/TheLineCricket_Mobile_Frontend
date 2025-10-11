// API service for backend communication
import { handleApiError } from '../utils/errorHandler';
import apiClient from './apiClient';

class ApiService {
  /**
   * User Management APIs
   */
  
  // Get current user profile
  async getCurrentUser() {
    try {
      console.log('🌐 API Service: getCurrentUser called');
      const response = await apiClient.get('/api/users/profile');
      console.log('✅ API Service: getCurrentUser response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ API Service: getCurrentUser error:', error);
      throw new Error(handleApiError(error));
    }
  }

  // Get user profile by ID
  async getUserProfile(userId) {
    try {
      const response = await apiClient.get(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Create user profile - matches database users table columns
  async createUserProfile(profileData) {
    try {
      // Ensure required fields are present (from database schema)
      const userData = {
        email: profileData.email, // NOT NULL
        username: profileData.username, // NOT NULL
        auth_provider: profileData.auth_provider || 'firebase', // NOT NULL
        firebase_uid: profileData.firebase_uid,
        firebase_email: profileData.firebase_email,
        cognito_user_id: profileData.cognito_user_id,
        is_verified: profileData.is_verified || false,
        is_active: profileData.is_active !== undefined ? profileData.is_active : true
      };
      
      const response = await apiClient.post('/api/users', userData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Update user profile - matches database users table columns
  async updateUserProfile(profileData) {
    try {
      // Only allow updating specific fields from users table
      const allowedFields = [
        'email', 'username', 'firebase_uid', 'firebase_email', 
        'cognito_user_id', 'is_verified', 'is_active', 'auth_provider'
      ];
      
      const updateData = {};
      allowedFields.forEach(field => {
        if (profileData[field] !== undefined) {
          updateData[field] = profileData[field];
        }
      });
      
      const response = await apiClient.put('/api/users/profile', updateData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Delete user profile
  async deleteUserProfile(userId) {
    try {
      const response = await apiClient.delete(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Match Management APIs
   */

  // Get all matches
  async getMatches(params = {}) {
    try {
      const response = await apiClient.get('/api/matches', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get match by ID
  async getMatchById(matchId) {
    try {
      const response = await apiClient.get(`/api/matches/${matchId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Create match - matches database matches table columns
  async createMatch(matchData) {
    try {
      // Ensure required fields are present (from database schema)
      const matchPayload = {
        creator_id: matchData.creator_id, // UUID NOT NULL REFERENCES users(id)
        match_name: matchData.match_name, // VARCHAR(200) NOT NULL
        match_type: matchData.match_type, // MATCHTYPE NOT NULL
        match_format: matchData.match_format, // MATCHFORMAT NOT NULL
        location: matchData.location, // VARCHAR(200) NOT NULL
        match_date: matchData.match_date, // DATE NOT NULL
        match_time: matchData.match_time, // TIME NOT NULL
        players_needed: matchData.players_needed, // INTEGER NOT NULL
        
        // Optional match details
        description: matchData.description,
        venue: matchData.venue,
        entry_fee: matchData.entry_fee,
        is_public: matchData.is_public !== undefined ? matchData.is_public : true,
        status: matchData.status || 'Upcoming',
        match_summary: matchData.match_summary,
        stream_url: matchData.stream_url,
        skill_level: matchData.skill_level,
        minimum_age: matchData.minimum_age,
        maximum_age: matchData.maximum_age,
        equipment_provided: matchData.equipment_provided,
        price_money_amount: matchData.price_money_amount,
        rules: matchData.rules,
        
        // Weather conditions
        weather: matchData.weather || 'unknown',
        temperature: matchData.temperature,
        wind_speed: matchData.wind_speed,
        humidity: matchData.humidity,
        
        // Duration tracking
        estimated_duration: matchData.estimated_duration,
        actual_duration: matchData.actual_duration,
        start_time_actual: matchData.start_time_actual,
        end_time_actual: matchData.end_time_actual,
        
        // Match results
        winner_team: matchData.winner_team,
        man_of_the_match: matchData.man_of_the_match,
        best_bowler: matchData.best_bowler,
        best_batsman: matchData.best_batsman,
        
        // Media content
        photos: matchData.photos || [],
        videos: matchData.videos || [],
        highlights: matchData.highlights || [],
        
        // Status
        is_active: matchData.is_active !== undefined ? matchData.is_active : true
      };
      
      const response = await apiClient.post('/api/matches', matchPayload);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Update match
  async updateMatch(matchId, matchData) {
    try {
      const response = await apiClient.put(`/api/matches/${matchId}`, matchData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Delete match
  async deleteMatch(matchId) {
    try {
      const response = await apiClient.delete(`/api/matches/${matchId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Join match
  async joinMatch(matchId) {
    try {
      const response = await apiClient.post(`/api/matches/${matchId}/join`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Leave match
  async leaveMatch(matchId) {
    try {
      const response = await apiClient.post(`/api/matches/${matchId}/leave`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Community Management APIs
   */

  // Get all communities
  async getCommunities(params = {}) {
    try {
      const response = await apiClient.get('/api/communities', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get community by ID
  async getCommunityById(communityId) {
    try {
      const response = await apiClient.get(`/api/communities/${communityId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Create community
  async createCommunity(communityData) {
    try {
      const response = await apiClient.post('/api/communities', communityData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Update community
  async updateCommunity(communityId, communityData) {
    try {
      const response = await apiClient.put(`/api/communities/${communityId}`, communityData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Delete community
  async deleteCommunity(communityId) {
    try {
      const response = await apiClient.delete(`/api/communities/${communityId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Join community
  async joinCommunity(communityId) {
    try {
      const response = await apiClient.post(`/api/communities/${communityId}/join`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Leave community
  async leaveCommunity(communityId) {
    try {
      const response = await apiClient.post(`/api/communities/${communityId}/leave`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Job Management APIs
   */

  // Get all jobs
  async getJobs(params = {}) {
    try {
      const response = await apiClient.get('/api/jobs', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get job by ID
  async getJobById(jobId) {
    try {
      const response = await apiClient.get(`/api/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Create job
  async createJob(jobData) {
    try {
      const response = await apiClient.post('/api/jobs', jobData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Update job
  async updateJob(jobId, jobData) {
    try {
      const response = await apiClient.put(`/api/jobs/${jobId}`, jobData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Delete job
  async deleteJob(jobId) {
    try {
      const response = await apiClient.delete(`/api/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Apply to job
  async applyToJob(jobId) {
    try {
      const response = await apiClient.post(`/api/jobs/${jobId}/apply`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Save job
  async saveJob(jobId) {
    try {
      const response = await apiClient.post(`/api/jobs/${jobId}/save`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Unsave job
  async unsaveJob(jobId) {
    try {
      const response = await apiClient.delete(`/api/jobs/${jobId}/save`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Venue Management APIs
   */

  // Get all venues
  async getVenues(params = {}) {
    try {
      const response = await apiClient.get('/api/venues', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get venue by ID
  async getVenueById(venueId) {
    try {
      const response = await apiClient.get(`/api/venues/${venueId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Create venue
  async createVenue(venueData) {
    try {
      const response = await apiClient.post('/api/venues', venueData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Update venue
  async updateVenue(venueId, venueData) {
    try {
      const response = await apiClient.put(`/api/venues/${venueId}`, venueData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Delete venue
  async deleteVenue(venueId) {
    try {
      const response = await apiClient.delete(`/api/venues/${venueId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Book venue
  async bookVenue(venueId, bookingData) {
    try {
      const response = await apiClient.post(`/api/venues/${venueId}/book`, bookingData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Post Management APIs
   */

  // Get all posts
  async getPosts(params = {}) {
    try {
      const response = await apiClient.get('/api/posts', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get post by ID
  async getPostById(postId) {
    try {
      const response = await apiClient.get(`/api/posts/${postId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get user posts
  async getUserPosts(userId) {
    try {
      const response = await apiClient.get(`/api/users/${userId}/posts`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Create post - matches database posts table columns
  async createPost(postData) {
    try {
      // Ensure required fields are present (from database schema)
      const postPayload = {
        user_id: postData.user_id, // UUID NOT NULL REFERENCES users(id)
        content: postData.content, // TEXT NOT NULL
        post_type: postData.post_type || 'general', // VARCHAR(50) NOT NULL
        schedule_time: postData.schedule_time || new Date().toISOString(), // TIMESTAMP NOT NULL
        
        // Optional content fields
        image_url: postData.image_url,
        video_url: postData.video_url,
        location: postData.location,
        
        // Post settings
        visibility: postData.visibility || 'public',
        is_pinned: postData.is_pinned || false,
        is_approved: postData.is_approved !== undefined ? postData.is_approved : true,
        approval_status: postData.approval_status || 'approved',
        
        // Social features
        hashtags: postData.hashtags,
        mentions: postData.mentions,
        
        // Page associations
        page_id: postData.page_id,
        community_profile_id: postData.community_profile_id,
        academy_profile_id: postData.academy_profile_id,
        venue_profile_id: postData.venue_profile_id,
        
        // Post metadata
        title: postData.title,
        post_category: postData.post_category,
        tags: postData.tags,
        featured: postData.featured || false,
        priority: postData.priority || 0,
        
        // Event fields
        event_date: postData.event_date,
        event_time: postData.event_time,
        event_location: postData.event_location,
        max_participants: postData.max_participants,
        registration_fee: postData.registration_fee,
        registration_deadline: postData.registration_deadline,
        
        // Status
        is_active: postData.is_active !== undefined ? postData.is_active : true
      };
      
      const response = await apiClient.post('/api/posts', postPayload);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Update post
  async updatePost(postId, postData) {
    try {
      const response = await apiClient.put(`/api/posts/${postId}`, postData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Delete post
  async deletePost(postId) {
    try {
      const response = await apiClient.delete(`/api/posts/${postId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Like post
  async likePost(postId) {
    try {
      const response = await apiClient.post(`/api/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Unlike post
  async unlikePost(postId) {
    try {
      const response = await apiClient.delete(`/api/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Comment on post
  async commentOnPost(postId, commentData) {
    try {
      const response = await apiClient.post(`/api/posts/${postId}/comments`, commentData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Share post
  async sharePost(postId) {
    try {
      const response = await apiClient.post(`/api/posts/${postId}/share`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Upload profile photo
  async uploadProfilePhoto(imageData) {
    try {
      const formData = new FormData();
      formData.append('photo', imageData);
      
      const response = await apiClient.post('/api/users/profile/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Posts APIs
   */
  
  // Get feed posts
  async getFeedPosts(page = 1, perPage = 20) {
    try {
      const response = await apiClient.get('/api/feed', {
        params: { page, per_page: perPage }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Create post
  async createPost(postData) {
    try {
      const response = await apiClient.post('/api/posts', postData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Like/Unlike post
  async togglePostLike(postId) {
    try {
      const response = await apiClient.post(`/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Add comment to post
  async addPostComment(postId, commentData) {
    try {
      const response = await apiClient.post(`/posts/${postId}/comments`, commentData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get post comments
  async getPostComments(postId, page = 1, perPage = 20) {
    try {
      const response = await apiClient.get(`/posts/${postId}/comments`, {
        params: { page, per_page: perPage }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Matches APIs
   */
  
  // Get matches
  async getMatches(filters = {}) {
    try {
      const response = await apiClient.get('/api/matches', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Create match
  async createMatch(matchData) {
    try {
      const response = await apiClient.post('/api/matches', matchData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Join match
  async joinMatch(matchId) {
    try {
      const response = await apiClient.post(`/matches/${matchId}/join`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Leave match
  async leaveMatch(matchId) {
    try {
      const response = await apiClient.post(`/matches/${matchId}/leave`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get live matches
  async getLiveMatches() {
    try {
      const response = await apiClient.get('/api/matches/live');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Messaging APIs
   */
  
  // Get conversations
  async getConversations() {
    try {
      const response = await apiClient.get('/api/messaging/conversations');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get conversation messages
  async getConversationMessages(conversationId, page = 1, perPage = 50) {
    try {
      const response = await apiClient.get(`/messaging/messages`, {
        params: { conversation_id: conversationId, page, per_page: perPage }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Send message
  async sendMessage(conversationId, messageData) {
    try {
      const response = await apiClient.post(`/messaging/messages`, {
        conversation_id: conversationId,
        ...messageData
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Create direct conversation
  async createDirectConversation(userId) {
    try {
      const response = await apiClient.post('/api/messaging/conversations', { user_id: userId });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Notifications APIs
   */
  
  // Get notifications
  async getNotifications(page = 1, perPage = 20) {
    try {
      const response = await apiClient.get('/api/notifications', {
        params: { page, per_page: perPage }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Mark notification as read
  async markNotificationRead(notificationId) {
    try {
      const response = await apiClient.post(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Mark all notifications as read
  async markAllNotificationsRead() {
    try {
      const response = await apiClient.post('/api/notifications/read-all');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get unread count
  async getUnreadCount() {
    try {
      const response = await apiClient.get('/api/notifications/unread-count');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Search APIs
   */
  
  // Global search
  async globalSearch(query, filters = {}) {
    try {
      const response = await apiClient.get('/api/search/global', {
        params: { q: query, ...filters }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Search users
  async searchUsers(query, page = 1, perPage = 20) {
    try {
      const response = await apiClient.get('/api/search/users', {
        params: { q: query, page, per_page: perPage }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Search matches
  async searchMatches(query, filters = {}) {
    try {
      const response = await apiClient.get('/api/search/matches', {
        params: { q: query, ...filters }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Relationships APIs
   */
  
  // Follow user
  async followUser(userId) {
    try {
      const response = await apiClient.post('/api/follow', { user_id: userId });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Unfollow user
  async unfollowUser(userId) {
    try {
      const response = await apiClient.post('/api/unfollow', { user_id: userId });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get followers
  async getFollowers(userId, page = 1, perPage = 20) {
    try {
      const response = await apiClient.get(`/followers/${userId}`, {
        params: { page, per_page: perPage }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get following
  async getFollowing(userId, page = 1, perPage = 20) {
    try {
      const response = await apiClient.get(`/following/${userId}`, {
        params: { page, per_page: perPage }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Search APIs
   */
  
  // Global search
  async globalSearch(query, filters = {}) {
    try {
      const response = await apiClient.get('/api/search/global', {
        params: { query, ...filters }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get search suggestions
  async getSearchSuggestions(query) {
    try {
      const response = await apiClient.get('/api/search/suggestions', {
        params: { query }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get trending searches
  async getTrendingSearches() {
    try {
      const response = await apiClient.get('/api/search/trending');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Profile APIs
   */
  
  // Get player profile
  async getPlayerProfile(playerId) {
    try {
      const response = await apiClient.get(`/player-profile/${playerId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get academy profile
  async getAcademyProfile(academyId) {
    try {
      const response = await apiClient.get(`/academy-profile/${academyId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get community profile
  async getCommunityProfile(communityId) {
    try {
      const response = await apiClient.get(`/community-profile/${communityId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get venue profile
  async getVenueProfile(venueId) {
    try {
      const response = await apiClient.get(`/venue-profile/${venueId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Relationship APIs
   */
  
  // Block user
  async blockUser(userId) {
    try {
      const response = await apiClient.post('/api/block', { user_id: userId });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Unblock user
  async unblockUser(userId) {
    try {
      const response = await apiClient.post('/api/unblock', { user_id: userId });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Create connection
  async createConnection(userId) {
    try {
      const response = await apiClient.post('/api/connection', { user_id: userId });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Admin APIs
   */
  
  // Get admin dashboard data
  async getAdminDashboard() {
    try {
      const response = await apiClient.get('/api/admin/dashboard');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get admin users
  async getAdminUsers(page = 1, perPage = 20) {
    try {
      const response = await apiClient.get('/api/admin/users', {
        params: { page, per_page: perPage }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get admin posts
  async getAdminPosts(page = 1, perPage = 20) {
    try {
      const response = await apiClient.get('/api/admin/posts', {
        params: { page, per_page: perPage }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get admin matches
  async getAdminMatches(page = 1, perPage = 20) {
    try {
      const response = await apiClient.get('/api/admin/matches', {
        params: { page, per_page: perPage }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Utility methods
   */
  
  // Health check
  async healthCheck() {
    try {
      const response = await apiClient.get('/api/health');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Test connection
  async testConnection() {
    try {
      const response = await apiClient.get('/api/health');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

// Create and export singleton instance
export const apiService = new ApiService();
export default apiService;
