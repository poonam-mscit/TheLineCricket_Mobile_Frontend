// Redux slice for Socket.IO state management
import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  // Connection state
  isConnected: false,
  socketId: null,
  connectionStatus: 'disconnected', // disconnected, connecting, connected, reconnecting
  reconnectAttempts: 0,
  maxReconnectAttempts: 5,
  lastConnected: null,
  lastDisconnected: null,
  
  // Error state
  connectionError: null,
  
  // Real-time data
  liveData: {
    onlineUsers: [],
    activeMatches: [],
    liveNotifications: [],
    typingUsers: {},
    messageReactions: {},
    matchUpdates: {}
  },
  
  // Event listeners
  listeners: {
    newMessage: false,
    messageRead: false,
    typingStart: false,
    typingStop: false,
    newNotification: false,
    matchUpdate: false,
    matchJoin: false,
    matchLeave: false,
    userOnline: false,
    userOffline: false
  },
  
  // Statistics
  stats: {
    totalEvents: 0,
    eventsByType: {},
    lastEventTime: null,
    connectionUptime: 0
  }
};

// Socket slice
const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    // Set connection state
    setConnectionState: (state, action) => {
      const { isConnected, socketId, status } = action.payload;
      state.isConnected = isConnected;
      state.socketId = socketId;
      state.connectionStatus = status;
      
      if (isConnected) {
        state.lastConnected = new Date().toISOString();
        state.connectionError = null;
        state.reconnectAttempts = 0;
      } else {
        state.lastDisconnected = new Date().toISOString();
      }
    },
    
    // Set connection error
    setConnectionError: (state, action) => {
      state.connectionError = action.payload;
      state.connectionStatus = 'disconnected';
    },
    
    // Set reconnection attempts
    setReconnectAttempts: (state, action) => {
      state.reconnectAttempts = action.payload;
      state.connectionStatus = state.reconnectAttempts > 0 ? 'reconnecting' : 'disconnected';
    },
    
    // Set listener state
    setListenerState: (state, action) => {
      const { event, active } = action.payload;
      state.listeners[event] = active;
    },
    
    // Update live data
    updateLiveData: (state, action) => {
      const { type, data } = action.payload;
      state.liveData[type] = data;
    },
    
    // Add online user
    addOnlineUser: (state, action) => {
      const user = action.payload;
      const existingIndex = state.liveData.onlineUsers.findIndex(u => u.id === user.id);
      if (existingIndex === -1) {
        state.liveData.onlineUsers.push(user);
      }
    },
    
    // Remove online user
    removeOnlineUser: (state, action) => {
      const userId = action.payload;
      state.liveData.onlineUsers = state.liveData.onlineUsers.filter(u => u.id !== userId);
    },
    
    // Add active match
    addActiveMatch: (state, action) => {
      const match = action.payload;
      const existingIndex = state.liveData.activeMatches.findIndex(m => m.id === match.id);
      if (existingIndex === -1) {
        state.liveData.activeMatches.push(match);
      } else {
        state.liveData.activeMatches[existingIndex] = match;
      }
    },
    
    // Remove active match
    removeActiveMatch: (state, action) => {
      const matchId = action.payload;
      state.liveData.activeMatches = state.liveData.activeMatches.filter(m => m.id !== matchId);
    },
    
    // Add live notification
    addLiveNotification: (state, action) => {
      const notification = action.payload;
      state.liveData.liveNotifications.unshift(notification);
      // Keep only last 50 notifications
      if (state.liveData.liveNotifications.length > 50) {
        state.liveData.liveNotifications = state.liveData.liveNotifications.slice(0, 50);
      }
    },
    
    // Set typing user
    setTypingUser: (state, action) => {
      const { conversationId, userId, isTyping } = action.payload;
      if (!state.liveData.typingUsers[conversationId]) {
        state.liveData.typingUsers[conversationId] = [];
      }
      
      if (isTyping) {
        if (!state.liveData.typingUsers[conversationId].includes(userId)) {
          state.liveData.typingUsers[conversationId].push(userId);
        }
      } else {
        state.liveData.typingUsers[conversationId] = state.liveData.typingUsers[conversationId].filter(id => id !== userId);
      }
    },
    
    // Add message reaction
    addMessageReaction: (state, action) => {
      const { messageId, reaction } = action.payload;
      if (!state.liveData.messageReactions[messageId]) {
        state.liveData.messageReactions[messageId] = [];
      }
      state.liveData.messageReactions[messageId].push(reaction);
    },
    
    // Remove message reaction
    removeMessageReaction: (state, action) => {
      const { messageId, reactionId } = action.payload;
      if (state.liveData.messageReactions[messageId]) {
        state.liveData.messageReactions[messageId] = state.liveData.messageReactions[messageId].filter(r => r.id !== reactionId);
      }
    },
    
    // Update match data
    updateMatchData: (state, action) => {
      const { matchId, data } = action.payload;
      state.liveData.matchUpdates[matchId] = {
        ...state.liveData.matchUpdates[matchId],
        ...data,
        lastUpdated: new Date().toISOString()
      };
    },
    
    // Record event
    recordEvent: (state, action) => {
      const { type, data } = action.payload;
      state.stats.totalEvents += 1;
      state.stats.eventsByType[type] = (state.stats.eventsByType[type] || 0) + 1;
      state.stats.lastEventTime = new Date().toISOString();
    },
    
    // Update connection uptime
    updateUptime: (state, action) => {
      state.stats.connectionUptime = action.payload;
    },
    
    // Clear live notifications
    clearLiveNotifications: (state) => {
      state.liveData.liveNotifications = [];
    },
    
    // Clear typing users for conversation
    clearTypingUsers: (state, action) => {
      const conversationId = action.payload;
      if (state.liveData.typingUsers[conversationId]) {
        state.liveData.typingUsers[conversationId] = [];
      }
    },
    
    // Reset socket state
    resetSocketState: (state) => {
      return { ...initialState };
    },
    
    // Clear connection error
    clearConnectionError: (state) => {
      state.connectionError = null;
    }
  }
});

// Export actions
export const {
  setConnectionState,
  setConnectionError,
  setReconnectAttempts,
  setListenerState,
  updateLiveData,
  addOnlineUser,
  removeOnlineUser,
  addActiveMatch,
  removeActiveMatch,
  addLiveNotification,
  setTypingUser,
  addMessageReaction,
  removeMessageReaction,
  updateMatchData,
  recordEvent,
  updateUptime,
  clearLiveNotifications,
  clearTypingUsers,
  resetSocketState,
  clearConnectionError
} = socketSlice.actions;

// Selectors
export const selectSocketConnection = (state) => ({
  isConnected: state.socket.isConnected,
  socketId: state.socket.socketId,
  status: state.socket.connectionStatus,
  reconnectAttempts: state.socket.reconnectAttempts,
  lastConnected: state.socket.lastConnected,
  lastDisconnected: state.socket.lastDisconnected
});

export const selectSocketError = (state) => state.socket.connectionError;
export const selectLiveData = (state) => state.socket.liveData;
export const selectOnlineUsers = (state) => state.socket.liveData.onlineUsers;
export const selectActiveMatches = (state) => state.socket.liveData.activeMatches;
export const selectLiveNotifications = (state) => state.socket.liveData.liveNotifications;
export const selectTypingUsers = (state) => state.socket.liveData.typingUsers;
export const selectMessageReactions = (state) => state.socket.liveData.messageReactions;
export const selectMatchUpdates = (state) => state.socket.liveData.matchUpdates;
export const selectSocketStats = (state) => state.socket.stats;
export const selectListeners = (state) => state.socket.listeners;

// Specific selectors
export const selectTypingUsersForConversation = (conversationId) => (state) => 
  state.socket.liveData.typingUsers[conversationId] || [];

export const selectMatchUpdate = (matchId) => (state) => 
  state.socket.liveData.matchUpdates[matchId];

export const selectMessageReactionsForMessage = (messageId) => (state) => 
  state.socket.liveData.messageReactions[messageId] || [];

// Export reducer
export default socketSlice.reducer;
