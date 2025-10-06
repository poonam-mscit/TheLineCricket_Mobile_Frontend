// Custom hook for API calls
import { useCallback, useState } from 'react';
import { apiService } from '../services/apiService';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generic API call wrapper
  const apiCall = useCallback(async (apiFunction, ...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // User API calls
  const getCurrentUser = useCallback(() => 
    apiCall(apiService.getCurrentUser), [apiCall]);

  const updateUserProfile = useCallback((profileData) => 
    apiCall(apiService.updateUserProfile, profileData), [apiCall]);

  const uploadProfilePhoto = useCallback((imageData) => 
    apiCall(apiService.uploadProfilePhoto, imageData), [apiCall]);

  // Posts API calls
  const getFeedPosts = useCallback((page = 1, perPage = 20) => 
    apiCall(apiService.getFeedPosts, page, perPage), [apiCall]);

  const createPost = useCallback((postData) => 
    apiCall(apiService.createPost, postData), [apiCall]);

  const togglePostLike = useCallback((postId) => 
    apiCall(apiService.togglePostLike, postId), [apiCall]);

  const addPostComment = useCallback((postId, commentData) => 
    apiCall(apiService.addPostComment, postId, commentData), [apiCall]);

  const getPostComments = useCallback((postId, page = 1, perPage = 20) => 
    apiCall(apiService.getPostComments, postId, page, perPage), [apiCall]);

  // Matches API calls
  const getMatches = useCallback((filters = {}) => 
    apiCall(apiService.getMatches, filters), [apiCall]);

  const createMatch = useCallback((matchData) => 
    apiCall(apiService.createMatch, matchData), [apiCall]);

  const joinMatch = useCallback((matchId) => 
    apiCall(apiService.joinMatch, matchId), [apiCall]);

  const leaveMatch = useCallback((matchId) => 
    apiCall(apiService.leaveMatch, matchId), [apiCall]);

  const getLiveMatches = useCallback(() => 
    apiCall(apiService.getLiveMatches), [apiCall]);

  // Messaging API calls
  const getConversations = useCallback(() => 
    apiCall(apiService.getConversations), [apiCall]);

  const getConversationMessages = useCallback((conversationId, page = 1, perPage = 50) => 
    apiCall(apiService.getConversationMessages, conversationId, page, perPage), [apiCall]);

  const sendMessage = useCallback((conversationId, messageData) => 
    apiCall(apiService.sendMessage, conversationId, messageData), [apiCall]);

  const createDirectConversation = useCallback((userId) => 
    apiCall(apiService.createDirectConversation, userId), [apiCall]);

  // Notifications API calls
  const getNotifications = useCallback((page = 1, perPage = 20) => 
    apiCall(apiService.getNotifications, page, perPage), [apiCall]);

  const markNotificationRead = useCallback((notificationId) => 
    apiCall(apiService.markNotificationRead, notificationId), [apiCall]);

  const markAllNotificationsRead = useCallback(() => 
    apiCall(apiService.markAllNotificationsRead), [apiCall]);

  const getUnreadCount = useCallback(() => 
    apiCall(apiService.getUnreadCount), [apiCall]);

  // Search API calls
  const globalSearch = useCallback((query, filters = {}) => 
    apiCall(apiService.globalSearch, query, filters), [apiCall]);

  const searchUsers = useCallback((query, page = 1, perPage = 20) => 
    apiCall(apiService.searchUsers, query, page, perPage), [apiCall]);

  const searchMatches = useCallback((query, filters = {}) => 
    apiCall(apiService.searchMatches, query, filters), [apiCall]);

  // Relationships API calls
  const followUser = useCallback((userId) => 
    apiCall(apiService.followUser, userId), [apiCall]);

  const unfollowUser = useCallback((userId) => 
    apiCall(apiService.unfollowUser, userId), [apiCall]);

  const getFollowers = useCallback((userId, page = 1, perPage = 20) => 
    apiCall(apiService.getFollowers, userId, page, perPage), [apiCall]);

  const getFollowing = useCallback((userId, page = 1, perPage = 20) => 
    apiCall(apiService.getFollowing, userId, page, perPage), [apiCall]);

  // Utility API calls
  const healthCheck = useCallback(() => 
    apiCall(apiService.healthCheck), [apiCall]);

  const testConnection = useCallback(() => 
    apiCall(apiService.testConnection), [apiCall]);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    loading,
    error,

    // User APIs
    getCurrentUser,
    updateUserProfile,
    uploadProfilePhoto,

    // Posts APIs
    getFeedPosts,
    createPost,
    togglePostLike,
    addPostComment,
    getPostComments,

    // Matches APIs
    getMatches,
    createMatch,
    joinMatch,
    leaveMatch,
    getLiveMatches,

    // Messaging APIs
    getConversations,
    getConversationMessages,
    sendMessage,
    createDirectConversation,

    // Notifications APIs
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    getUnreadCount,

    // Search APIs
    globalSearch,
    searchUsers,
    searchMatches,

    // Relationships APIs
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,

    // Utility APIs
    healthCheck,
    testConnection,

    // Utilities
    clearError
  };
};

export default useApi;
