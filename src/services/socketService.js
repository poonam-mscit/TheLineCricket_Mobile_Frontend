// Socket.IO service for real-time communication
import { io } from 'socket.io-client';
import environment from '../config/environment';
import { tokenService } from './tokenService';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  /**
   * Connect to Socket.IO server
   */
  async connect() {
    try {
      if (this.socket && this.socket.connected) {
        return;
      }

      // Validate socket URL
      if (!environment.SOCKET_URL || environment.SOCKET_URL === 'undefined') {
        throw new Error('Socket URL not configured. Please check environment settings.');
      }

      const token = await tokenService.getAccessToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      this.socket = io(environment.SOCKET_URL, {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true,
        withCredentials: true
      });

      this.setupEventListeners();
      
      return new Promise((resolve, reject) => {
        this.socket.on('connect', () => {
          console.log('Socket connected:', this.socket.id);
          this.isConnected = true;
          this.reconnectAttempts = 0;
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          reject(error);
        });

        // Timeout after 10 seconds
        setTimeout(() => {
          if (!this.isConnected) {
            reject(new Error('Socket connection timeout'));
          }
        }, 10000);
      });
    } catch (error) {
      console.error('Failed to connect to socket:', error);
      throw error;
    }
  }

  /**
   * Disconnect from Socket.IO server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
    }
  }

  /**
   * Setup socket event listeners
   */
  setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.isConnected = false;
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        this.handleReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
      this.handleReconnect();
    });

    // Authentication events
    this.socket.on('auth_success', (data) => {
      console.log('Socket authentication successful:', data);
    });

    this.socket.on('auth_error', (error) => {
      console.error('Socket authentication error:', error);
    });

    // Message events
    this.socket.on('new_message', (data) => {
      this.emit('new_message', data);
    });

    this.socket.on('message_read', (data) => {
      this.emit('message_read', data);
    });

    this.socket.on('typing_start', (data) => {
      this.emit('typing_start', data);
    });

    this.socket.on('typing_stop', (data) => {
      this.emit('typing_stop', data);
    });

    // Notification events
    this.socket.on('new_notification', (data) => {
      this.emit('new_notification', data);
    });

    this.socket.on('notification_read', (data) => {
      this.emit('notification_read', data);
    });

    // Match events
    this.socket.on('match_update', (data) => {
      this.emit('match_update', data);
    });

    this.socket.on('match_join', (data) => {
      this.emit('match_join', data);
    });

    this.socket.on('match_leave', (data) => {
      this.emit('match_leave', data);
    });

    // Live match events
    this.socket.on('live_score_update', (data) => {
      this.emit('live_score_update', data);
    });

    this.socket.on('live_commentary', (data) => {
      this.emit('live_commentary', data);
    });

    this.socket.on('live_chat_message', (data) => {
      this.emit('live_chat_message', data);
    });

    // User presence events
    this.socket.on('user_online', (data) => {
      this.emit('user_online', data);
    });

    this.socket.on('user_offline', (data) => {
      this.emit('user_offline', data);
    });

    // Post events
    this.socket.on('new_post', (data) => {
      this.emit('new_post', data);
    });

    this.socket.on('post_like', (data) => {
      this.emit('post_like', data);
    });

    this.socket.on('post_comment', (data) => {
      this.emit('post_comment', data);
    });

    // Search events
    this.socket.on('search_suggestion', (data) => {
      this.emit('search_suggestion', data);
    });

    // Admin events
    this.socket.on('admin_alert', (data) => {
      this.emit('admin_alert', data);
    });

    // Error handling
    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.emit('error', error);
    });
  }

  /**
   * Handle reconnection logic
   */
  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch(error => {
          console.error('Reconnection failed:', error);
        });
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      this.emit('max_reconnect_attempts_reached');
    }
  }

  /**
   * Add event listener
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  /**
   * Remove event listener
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Emit event to listeners
   */
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in socket listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Send message to server
   */
  emitToServer(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit event:', event);
    }
  }

  /**
   * Join conversation room
   */
  joinConversation(conversationId) {
    this.emitToServer('join_conversation', { conversation_id: conversationId });
  }

  /**
   * Leave conversation room
   */
  leaveConversation(conversationId) {
    this.emitToServer('leave_conversation', { conversation_id: conversationId });
  }

  /**
   * Send message
   */
  sendMessage(conversationId, messageData) {
    this.emitToServer('send_message', {
      conversation_id: conversationId,
      ...messageData
    });
  }

  /**
   * Start typing indicator
   */
  startTyping(conversationId) {
    this.emitToServer('typing_start', { conversation_id: conversationId });
  }

  /**
   * Stop typing indicator
   */
  stopTyping(conversationId) {
    this.emitToServer('typing_stop', { conversation_id: conversationId });
  }

  /**
   * Mark message as read
   */
  markMessageRead(messageId) {
    this.emitToServer('mark_as_read', { message_id: messageId });
  }

  /**
   * Join match room
   */
  joinMatchRoom(matchId) {
    this.emitToServer('join_match_room', { match_id: matchId });
  }

  /**
   * Leave match room
   */
  leaveMatchRoom(matchId) {
    this.emitToServer('leave_match_room', { match_id: matchId });
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id,
      reconnectAttempts: this.reconnectAttempts
    };
  }

  /**
   * Reconnect manually
   */
  async reconnect() {
    this.disconnect();
    await this.connect();
  }
}

// Create and export singleton instance
export const socketService = new SocketService();
export default socketService;
