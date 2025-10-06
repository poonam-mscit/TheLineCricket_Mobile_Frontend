// Custom hook for Socket.IO
import { useCallback, useEffect, useRef, useState } from 'react';
import { socketService } from '../services/socketService';
import { useAuth } from './useAuth';

export const useSocket = () => {
  const { isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({});
  const listenersRef = useRef(new Map());

  // Connect to socket when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      connectSocket();
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated]);

  // Connect to socket
  const connectSocket = useCallback(async () => {
    try {
      await socketService.connect();
      setIsConnected(true);
      setConnectionStatus(socketService.getConnectionStatus());
    } catch (error) {
      console.error('Failed to connect to socket:', error);
      setIsConnected(false);
    }
  }, []);

  // Disconnect from socket
  const disconnectSocket = useCallback(() => {
    socketService.disconnect();
    setIsConnected(false);
    setConnectionStatus({});
  }, []);

  // Add event listener
  const addListener = useCallback((event, callback) => {
    socketService.on(event, callback);
    
    // Store reference for cleanup
    if (!listenersRef.current.has(event)) {
      listenersRef.current.set(event, []);
    }
    listenersRef.current.get(event).push(callback);
  }, []);

  // Remove event listener
  const removeListener = useCallback((event, callback) => {
    socketService.off(event, callback);
    
    // Remove from our reference
    if (listenersRef.current.has(event)) {
      const callbacks = listenersRef.current.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }, []);

  // Cleanup all listeners
  useEffect(() => {
    return () => {
      listenersRef.current.forEach((callbacks, event) => {
        callbacks.forEach(callback => {
          socketService.off(event, callback);
        });
      });
      listenersRef.current.clear();
    };
  }, []);

  // Emit event to server
  const emit = useCallback((event, data) => {
    socketService.emitToServer(event, data);
  }, []);

  // Conversation methods
  const joinConversation = useCallback((conversationId) => {
    socketService.joinConversation(conversationId);
  }, []);

  const leaveConversation = useCallback((conversationId) => {
    socketService.leaveConversation(conversationId);
  }, []);

  const sendMessage = useCallback((conversationId, messageData) => {
    socketService.sendMessage(conversationId, messageData);
  }, []);

  const startTyping = useCallback((conversationId) => {
    socketService.startTyping(conversationId);
  }, []);

  const stopTyping = useCallback((conversationId) => {
    socketService.stopTyping(conversationId);
  }, []);

  const markMessageRead = useCallback((messageId) => {
    socketService.markMessageRead(messageId);
  }, []);

  // Match methods
  const joinMatchRoom = useCallback((matchId) => {
    socketService.joinMatchRoom(matchId);
  }, []);

  const leaveMatchRoom = useCallback((matchId) => {
    socketService.leaveMatchRoom(matchId);
  }, []);

  // Reconnect manually
  const reconnect = useCallback(async () => {
    try {
      await socketService.reconnect();
      setIsConnected(true);
      setConnectionStatus(socketService.getConnectionStatus());
    } catch (error) {
      console.error('Failed to reconnect socket:', error);
      setIsConnected(false);
    }
  }, []);

  // Update connection status
  useEffect(() => {
    const interval = setInterval(() => {
      if (isConnected) {
        setConnectionStatus(socketService.getConnectionStatus());
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isConnected]);

  return {
    // State
    isConnected,
    connectionStatus,

    // Connection methods
    connect: connectSocket,
    disconnect: disconnectSocket,
    reconnect,

    // Event methods
    addListener,
    removeListener,
    emit,

    // Conversation methods
    joinConversation,
    leaveConversation,
    sendMessage,
    startTyping,
    stopTyping,
    markMessageRead,

    // Match methods
    joinMatchRoom,
    leaveMatchRoom
  };
};

export default useSocket;
