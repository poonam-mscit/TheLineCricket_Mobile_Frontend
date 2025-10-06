// Redux hooks for easy state management
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Typed hooks
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Auth hooks
export const useAuthState = () => {
  const user = useAppSelector(state => state.auth.user);
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const loading = useAppSelector(state => state.auth.loading);
  const error = useAppSelector(state => state.auth.error);
  const profile = useAppSelector(state => state.auth.profile);
  const preferences = useAppSelector(state => state.auth.preferences);
  const lastLogin = useAppSelector(state => state.auth.lastLogin);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    profile,
    preferences,
    lastLogin,
    isLoggedIn: isAuthenticated && !!user,
    isGuest: !isAuthenticated || !user
  };
};

// API hooks
export const useApiState = () => {
  const isConnected = useAppSelector(state => state.api.isConnected);
  const connectionError = useAppSelector(state => state.api.connectionError);
  const loading = useAppSelector(state => state.api.loading);
  const errors = useAppSelector(state => state.api.errors);
  const cache = useAppSelector(state => state.api.cache);
  const pagination = useAppSelector(state => state.api.pagination);
  const lastUpdated = useAppSelector(state => state.api.lastUpdated);

  return {
    isConnected,
    connectionError,
    loading,
    errors,
    cache,
    pagination,
    lastUpdated
  };
};

// Socket hooks
export const useSocketState = () => {
  const connection = useAppSelector(state => state.socket);
  const isConnected = useAppSelector(state => state.socket.isConnected);
  const socketId = useAppSelector(state => state.socket.socketId);
  const connectionStatus = useAppSelector(state => state.socket.connectionStatus);
  const connectionError = useAppSelector(state => state.socket.connectionError);
  const liveData = useAppSelector(state => state.socket.liveData);
  const stats = useAppSelector(state => state.socket.stats);

  return {
    connection,
    isConnected,
    socketId,
    connectionStatus,
    connectionError,
    liveData,
    stats
  };
};

// Resource-specific hooks
export const usePosts = () => {
  const posts = useAppSelector(state => state.api.cache.posts);
  const loading = useAppSelector(state => state.api.loading.posts);
  const error = useAppSelector(state => state.api.errors.posts);
  const pagination = useAppSelector(state => state.api.pagination.posts);
  const lastUpdated = useAppSelector(state => state.api.lastUpdated.posts);

  return {
    posts,
    loading,
    error,
    pagination,
    lastUpdated,
    hasMore: pagination.hasMore,
    currentPage: pagination.page
  };
};

export const useMatches = () => {
  const matches = useAppSelector(state => state.api.cache.matches);
  const loading = useAppSelector(state => state.api.loading.matches);
  const error = useAppSelector(state => state.api.errors.matches);
  const pagination = useAppSelector(state => state.api.pagination.matches);
  const lastUpdated = useAppSelector(state => state.api.lastUpdated.matches);

  return {
    matches,
    loading,
    error,
    pagination,
    lastUpdated,
    hasMore: pagination.hasMore,
    currentPage: pagination.page
  };
};

export const useMessages = () => {
  const messages = useAppSelector(state => state.api.cache.messages);
  const loading = useAppSelector(state => state.api.loading.messages);
  const error = useAppSelector(state => state.api.errors.messages);
  const pagination = useAppSelector(state => state.api.pagination.messages);
  const lastUpdated = useAppSelector(state => state.api.lastUpdated.messages);

  return {
    messages,
    loading,
    error,
    pagination,
    lastUpdated,
    hasMore: pagination.hasMore,
    currentPage: pagination.page
  };
};

export const useNotifications = () => {
  const notifications = useAppSelector(state => state.api.cache.notifications);
  const loading = useAppSelector(state => state.api.loading.notifications);
  const error = useAppSelector(state => state.api.errors.notifications);
  const pagination = useAppSelector(state => state.api.pagination.notifications);
  const lastUpdated = useAppSelector(state => state.api.lastUpdated.notifications);

  return {
    notifications,
    loading,
    error,
    pagination,
    lastUpdated,
    hasMore: pagination.hasMore,
    currentPage: pagination.page
  };
};

export const useSearchResults = () => {
  const searchResults = useAppSelector(state => state.api.cache.searchResults);
  const loading = useAppSelector(state => state.api.loading.search);
  const error = useAppSelector(state => state.api.errors.search);

  return {
    searchResults,
    loading,
    error
  };
};

// Live data hooks
export const useOnlineUsers = () => {
  const onlineUsers = useAppSelector(state => state.socket.liveData.onlineUsers);
  return onlineUsers;
};

export const useActiveMatches = () => {
  const activeMatches = useAppSelector(state => state.socket.liveData.activeMatches);
  return activeMatches;
};

export const useLiveNotifications = () => {
  const liveNotifications = useAppSelector(state => state.socket.liveData.liveNotifications);
  return liveNotifications;
};

export const useTypingUsers = (conversationId) => {
  const typingUsers = useAppSelector(state => 
    state.socket.liveData.typingUsers[conversationId] || []
  );
  return typingUsers;
};

export const useMessageReactions = (messageId) => {
  const reactions = useAppSelector(state => 
    state.socket.liveData.messageReactions[messageId] || []
  );
  return reactions;
};

export const useMatchUpdates = (matchId) => {
  const matchUpdate = useAppSelector(state => 
    state.socket.liveData.matchUpdates[matchId]
  );
  return matchUpdate;
};

// Action hooks
export const useAuthActions = () => {
  const dispatch = useAppDispatch();
  
  return {
    clearError: useCallback(() => dispatch({ type: 'auth/clearError' }), [dispatch]),
    setLoading: useCallback((loading) => dispatch({ type: 'auth/setLoading', payload: loading }), [dispatch]),
    setUser: useCallback((user) => dispatch({ type: 'auth/setUser', payload: user }), [dispatch]),
    setAuthState: useCallback((authState) => dispatch({ type: 'auth/setAuthState', payload: authState }), [dispatch]),
    updateProfileLocal: useCallback((profile) => dispatch({ type: 'auth/updateProfileLocal', payload: profile }), [dispatch]),
    updatePreferences: useCallback((preferences) => dispatch({ type: 'auth/updatePreferences', payload: preferences }), [dispatch]),
    resetAuthState: useCallback(() => dispatch({ type: 'auth/resetAuthState' }), [dispatch])
  };
};

export const useApiActions = () => {
  const dispatch = useAppDispatch();
  
  return {
    setConnectionState: useCallback((state) => dispatch({ type: 'api/setConnectionState', payload: state }), [dispatch]),
    clearError: useCallback((resource) => dispatch({ type: 'api/clearError', payload: resource }), [dispatch]),
    clearAllErrors: useCallback(() => dispatch({ type: 'api/clearAllErrors' }), [dispatch]),
    setLoading: useCallback((resource, loading) => dispatch({ type: 'api/setLoading', payload: { resource, loading } }), [dispatch]),
    updateCache: useCallback((resource, data) => dispatch({ type: 'api/updateCache', payload: { resource, data } }), [dispatch]),
    clearCache: useCallback((resource) => dispatch({ type: 'api/clearCache', payload: resource }), [dispatch]),
    resetApiState: useCallback(() => dispatch({ type: 'api/resetApiState' }), [dispatch])
  };
};

export const useSocketActions = () => {
  const dispatch = useAppDispatch();
  
  return {
    setConnectionState: useCallback((state) => dispatch({ type: 'socket/setConnectionState', payload: state }), [dispatch]),
    setConnectionError: useCallback((error) => dispatch({ type: 'socket/setConnectionError', payload: error }), [dispatch]),
    setReconnectAttempts: useCallback((attempts) => dispatch({ type: 'socket/setReconnectAttempts', payload: attempts }), [dispatch]),
    setListenerState: useCallback((event, active) => dispatch({ type: 'socket/setListenerState', payload: { event, active } }), [dispatch]),
    updateLiveData: useCallback((type, data) => dispatch({ type: 'socket/updateLiveData', payload: { type, data } }), [dispatch]),
    addOnlineUser: useCallback((user) => dispatch({ type: 'socket/addOnlineUser', payload: user }), [dispatch]),
    removeOnlineUser: useCallback((userId) => dispatch({ type: 'socket/removeOnlineUser', payload: userId }), [dispatch]),
    addActiveMatch: useCallback((match) => dispatch({ type: 'socket/addActiveMatch', payload: match }), [dispatch]),
    removeActiveMatch: useCallback((matchId) => dispatch({ type: 'socket/removeActiveMatch', payload: matchId }), [dispatch]),
    addLiveNotification: useCallback((notification) => dispatch({ type: 'socket/addLiveNotification', payload: notification }), [dispatch]),
    setTypingUser: useCallback((conversationId, userId, isTyping) => dispatch({ type: 'socket/setTypingUser', payload: { conversationId, userId, isTyping } }), [dispatch]),
    addMessageReaction: useCallback((messageId, reaction) => dispatch({ type: 'socket/addMessageReaction', payload: { messageId, reaction } }), [dispatch]),
    removeMessageReaction: useCallback((messageId, reactionId) => dispatch({ type: 'socket/removeMessageReaction', payload: { messageId, reactionId } }), [dispatch]),
    updateMatchData: useCallback((matchId, data) => dispatch({ type: 'socket/updateMatchData', payload: { matchId, data } }), [dispatch]),
    recordEvent: useCallback((type, data) => dispatch({ type: 'socket/recordEvent', payload: { type, data } }), [dispatch]),
    clearLiveNotifications: useCallback(() => dispatch({ type: 'socket/clearLiveNotifications' }), [dispatch]),
    clearTypingUsers: useCallback((conversationId) => dispatch({ type: 'socket/clearTypingUsers', payload: conversationId }), [dispatch]),
    resetSocketState: useCallback(() => dispatch({ type: 'socket/resetSocketState' }), [dispatch]),
    clearConnectionError: useCallback(() => dispatch({ type: 'socket/clearConnectionError' }), [dispatch])
  };
};

export default {
  useAppDispatch,
  useAppSelector,
  useAuthState,
  useApiState,
  useSocketState,
  usePosts,
  useMatches,
  useMessages,
  useNotifications,
  useSearchResults,
  useOnlineUsers,
  useActiveMatches,
  useLiveNotifications,
  useTypingUsers,
  useMessageReactions,
  useMatchUpdates,
  useAuthActions,
  useApiActions,
  useSocketActions
};
