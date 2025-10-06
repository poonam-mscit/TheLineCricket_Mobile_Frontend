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
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Update user profile
  async updateUserProfile(profileData) {
    try {
      const response = await apiClient.put('/users/profile', profileData);
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
      
      const response = await apiClient.post('/users/profile/photo', formData, {
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
      const response = await apiClient.get('/feed', {
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
      const response = await apiClient.post('/posts', postData);
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
      const response = await apiClient.get('/matches', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Create match
  async createMatch(matchData) {
    try {
      const response = await apiClient.post('/matches', matchData);
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
      const response = await apiClient.get('/matches/live');
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
      const response = await apiClient.get('/messaging/conversations');
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
      const response = await apiClient.post('/messaging/conversations', { user_id: userId });
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
      const response = await apiClient.get('/notifications', {
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
      const response = await apiClient.post('/notifications/read-all');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get unread count
  async getUnreadCount() {
    try {
      const response = await apiClient.get('/notifications/unread-count');
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
      const response = await apiClient.get('/search/global', {
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
      const response = await apiClient.get('/search/users', {
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
      const response = await apiClient.get('/search/matches', {
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
      const response = await apiClient.post('/follow', { user_id: userId });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Unfollow user
  async unfollowUser(userId) {
    try {
      const response = await apiClient.post('/unfollow', { user_id: userId });
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
      const response = await apiClient.get('/search/global', {
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
      const response = await apiClient.get('/search/suggestions', {
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
      const response = await apiClient.get('/search/trending');
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
      const response = await apiClient.post('/block', { user_id: userId });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Unblock user
  async unblockUser(userId) {
    try {
      const response = await apiClient.post('/unblock', { user_id: userId });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Create connection
  async createConnection(userId) {
    try {
      const response = await apiClient.post('/connection', { user_id: userId });
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
      const response = await apiClient.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Get admin users
  async getAdminUsers(page = 1, perPage = 20) {
    try {
      const response = await apiClient.get('/admin/users', {
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
      const response = await apiClient.get('/admin/posts', {
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
      const response = await apiClient.get('/admin/matches', {
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
      const response = await apiClient.get('/health');
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
