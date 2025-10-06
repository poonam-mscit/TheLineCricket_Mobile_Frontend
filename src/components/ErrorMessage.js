// Error message component for displaying API errors
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ErrorMessage = ({ 
  error, 
  onRetry, 
  onDismiss,
  title = 'Error',
  showRetry = true,
  showDismiss = true 
}) => {
  if (!error) return null;

  const getErrorIcon = (errorType) => {
    switch (errorType) {
      case 'network': return '🌐';
      case 'auth': return '🔐';
      case 'server': return '🖥️';
      case 'validation': return '⚠️';
      default: return '❌';
    }
  };

  const getErrorColor = (errorType) => {
    switch (errorType) {
      case 'network': return '#FF9800';
      case 'auth': return '#F44336';
      case 'server': return '#9C27B0';
      case 'validation': return '#FF5722';
      default: return '#F44336';
    }
  };

  const getErrorMessage = (error) => {
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    if (error.error) return error.error;
    return 'An unexpected error occurred';
  };

  const getErrorType = (error) => {
    if (error.message?.includes('network') || error.message?.includes('fetch')) return 'network';
    if (error.message?.includes('auth') || error.message?.includes('unauthorized')) return 'auth';
    if (error.message?.includes('server') || error.message?.includes('500')) return 'server';
    if (error.message?.includes('validation') || error.message?.includes('400')) return 'validation';
    return 'general';
  };

  const errorType = getErrorType(error);
  const errorColor = getErrorColor(errorType);
  const errorIcon = getErrorIcon(errorType);
  const errorMessage = getErrorMessage(error);

  return (
    <View style={[styles.container, { borderLeftColor: errorColor }]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{errorIcon}</Text>
        <Text style={[styles.title, { color: errorColor }]}>{title}</Text>
        {showDismiss && (
          <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
            <Text style={styles.dismissText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={styles.message}>{errorMessage}</Text>
      
      {showRetry && onRetry && (
        <TouchableOpacity 
          style={[styles.retryButton, { backgroundColor: errorColor }]}
          onPress={onRetry}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Specific error components for different API operations
export const PostsErrorMessage = ({ error, onRetry, onDismiss }) => (
  <ErrorMessage 
    error={error} 
    onRetry={onRetry} 
    onDismiss={onDismiss}
    title="Failed to load posts"
  />
);

export const MatchesErrorMessage = ({ error, onRetry, onDismiss }) => (
  <ErrorMessage 
    error={error} 
    onRetry={onRetry} 
    onDismiss={onDismiss}
    title="Failed to load matches"
  />
);

export const MessagesErrorMessage = ({ error, onRetry, onDismiss }) => (
  <ErrorMessage 
    error={error} 
    onRetry={onRetry} 
    onDismiss={onDismiss}
    title="Failed to load messages"
  />
);

export const NotificationsErrorMessage = ({ error, onRetry, onDismiss }) => (
  <ErrorMessage 
    error={error} 
    onRetry={onRetry} 
    onDismiss={onDismiss}
    title="Failed to load notifications"
  />
);

export const SearchErrorMessage = ({ error, onRetry, onDismiss }) => (
  <ErrorMessage 
    error={error} 
    onRetry={onRetry} 
    onDismiss={onDismiss}
    title="Search failed"
  />
);

export const AuthErrorMessage = ({ error, onRetry, onDismiss }) => (
  <ErrorMessage 
    error={error} 
    onRetry={onRetry} 
    onDismiss={onDismiss}
    title="Authentication failed"
    showRetry={false}
  />
);

export const ConnectionErrorMessage = ({ error, onRetry, onDismiss }) => (
  <ErrorMessage 
    error={error} 
    onRetry={onRetry} 
    onDismiss={onDismiss}
    title="Connection failed"
  />
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  dismissButton: {
    padding: 4,
  },
  dismissText: {
    fontSize: 16,
    color: '#999',
  },
  message: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ErrorMessage;
