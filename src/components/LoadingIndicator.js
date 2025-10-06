// Loading indicator component for API calls
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const LoadingIndicator = ({ 
  loading = false, 
  message = 'Loading...', 
  size = 'large',
  color = '#2196F3',
  overlay = false 
}) => {
  if (!loading) return null;

  const containerStyle = overlay ? styles.overlayContainer : styles.container;

  return (
    <View style={containerStyle}>
      <View style={styles.loadingBox}>
        <ActivityIndicator size={size} color={color} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

// Specific loading indicators for different API operations
export const PostsLoadingIndicator = ({ loading }) => (
  <LoadingIndicator 
    loading={loading} 
    message="Loading posts..." 
    size="small"
  />
);

export const MatchesLoadingIndicator = ({ loading }) => (
  <LoadingIndicator 
    loading={loading} 
    message="Loading matches..." 
    size="small"
  />
);

export const MessagesLoadingIndicator = ({ loading }) => (
  <LoadingIndicator 
    loading={loading} 
    message="Loading messages..." 
    size="small"
  />
);

export const NotificationsLoadingIndicator = ({ loading }) => (
  <LoadingIndicator 
    loading={loading} 
    message="Loading notifications..." 
    size="small"
  />
);

export const SearchLoadingIndicator = ({ loading }) => (
  <LoadingIndicator 
    loading={loading} 
    message="Searching..." 
    size="small"
  />
);

export const AuthLoadingIndicator = ({ loading }) => (
  <LoadingIndicator 
    loading={loading} 
    message="Authenticating..." 
    size="large"
    overlay={true}
  />
);

export const ConnectionLoadingIndicator = ({ loading }) => (
  <LoadingIndicator 
    loading={loading} 
    message="Connecting to server..." 
    size="large"
    overlay={true}
  />
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});

export default LoadingIndicator;
