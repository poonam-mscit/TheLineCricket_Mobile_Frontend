// Authentication test component
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApiState, useAuthState, useSocketState } from '../hooks/redux';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { testFirebaseAuth, testFirebaseConnection } from '../services/firebaseTest';

export default function AuthTestComponent() {
  const { user, isAuthenticated, loading, error, login, register, logout, clearError } = useAuth();
  const { testConnection, loading: apiLoading } = useApi();
  const { isConnected: socketConnected, connect, disconnect } = useSocket();
  
  // Redux state
  const reduxAuth = useAuthState();
  const reduxApi = useApiState();
  const reduxSocket = useSocketState();
  
  const [testResults, setTestResults] = useState({});
  const [isTesting, setIsTesting] = useState(false);

  const runTests = async () => {
    setIsTesting(true);
    const results = {};

    try {
      // Test Firebase connection
      console.log('Testing Firebase connection...');
      const firebaseTest = await testFirebaseConnection();
      results.firebase = firebaseTest ? '✅ Connected' : '❌ Failed';
    } catch (error) {
      results.firebase = `❌ Error: ${error.message}`;
    }

    try {
      // Test Firebase Auth only
      console.log('Testing Firebase Auth...');
      const authTest = await testFirebaseAuth();
      results.firebaseAuth = authTest ? '✅ Working' : '❌ Failed';
    } catch (error) {
      results.firebaseAuth = `❌ Error: ${error.message}`;
    }

    try {
      // Test API connection
      console.log('Testing API connection...');
      const apiTest = await testConnection();
      results.api = apiTest ? '✅ Connected' : '❌ Failed';
    } catch (error) {
      results.api = `❌ Error: ${error.message}`;
    }

    setTestResults(results);
  };

  const testLogin = async () => {
    try {
      await login('test@example.com', 'password123');
      Alert.alert('Success', 'Login test completed');
    } catch (error) {
      Alert.alert('Error', `Login test failed: ${error.message}`);
    }
  };

  const testRegister = async () => {
    try {
      await register({
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
        username: 'testuser',
        age: '25',
        location: 'Test City'
      });
      Alert.alert('Success', 'Registration test completed');
    } catch (error) {
      Alert.alert('Error', `Registration test failed: ${error.message}`);
    }
  };

  const testSocketConnection = async () => {
    try {
      if (socketConnected) {
        disconnect();
      } else {
        await connect();
      }
    } catch (error) {
      Alert.alert('Error', `Socket test failed: ${error.message}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Authentication Test Component</Text>
      
      {/* Auth State */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Authentication State (Hooks)</Text>
        <Text style={styles.text}>Loading: {loading ? 'Yes' : 'No'}</Text>
        <Text style={styles.text}>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</Text>
        <Text style={styles.text}>User: {user ? user.email || 'Logged in' : 'Not logged in'}</Text>
        {error && <Text style={styles.errorText}>Error: {error}</Text>}
      </View>

      {/* Redux Auth State */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Redux Auth State</Text>
        <Text style={styles.text}>Loading: {reduxAuth.loading ? 'Yes' : 'No'}</Text>
        <Text style={styles.text}>Authenticated: {reduxAuth.isAuthenticated ? 'Yes' : 'No'}</Text>
        <Text style={styles.text}>User: {reduxAuth.user ? reduxAuth.user.email || 'Logged in' : 'Not logged in'}</Text>
        <Text style={styles.text}>Profile: {reduxAuth.profile ? 'Loaded' : 'Not loaded'}</Text>
        <Text style={styles.text}>Last Login: {reduxAuth.lastLogin || 'Never'}</Text>
        {reduxAuth.error && <Text style={styles.errorText}>Error: {reduxAuth.error}</Text>}
      </View>

      {/* Redux API State */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Redux API State</Text>
        <Text style={styles.text}>Connected: {reduxApi.isConnected ? 'Yes' : 'No'}</Text>
        <Text style={styles.text}>Connection Error: {reduxApi.connectionError || 'None'}</Text>
        <Text style={styles.text}>Posts Cache: {reduxApi.cache.posts.length} items</Text>
        <Text style={styles.text}>Matches Cache: {reduxApi.cache.matches.length} items</Text>
        <Text style={styles.text}>Messages Cache: {reduxApi.cache.messages.length} items</Text>
        <Text style={styles.text}>Notifications Cache: {reduxApi.cache.notifications.length} items</Text>
      </View>

      {/* Redux Socket State */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Redux Socket State</Text>
        <Text style={styles.text}>Connected: {reduxSocket.isConnected ? 'Yes' : 'No'}</Text>
        <Text style={styles.text}>Socket ID: {reduxSocket.socketId || 'None'}</Text>
        <Text style={styles.text}>Status: {reduxSocket.connectionStatus}</Text>
        <Text style={styles.text}>Online Users: {reduxSocket.liveData.onlineUsers.length}</Text>
        <Text style={styles.text}>Active Matches: {reduxSocket.liveData.activeMatches.length}</Text>
        <Text style={styles.text}>Live Notifications: {reduxSocket.liveData.liveNotifications.length}</Text>
        <Text style={styles.text}>Total Events: {reduxSocket.stats.totalEvents}</Text>
      </View>

      {/* Test Results */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Results</Text>
        <TouchableOpacity style={styles.button} onPress={runTests} disabled={isTesting}>
          <Text style={styles.buttonText}>
            {isTesting ? 'Running Tests...' : 'Run All Tests'}
          </Text>
        </TouchableOpacity>
        
        {Object.entries(testResults).map(([test, result]) => (
          <Text key={test} style={styles.text}>
            {test}: {result}
          </Text>
        ))}
      </View>

      {/* API Tests */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Tests</Text>
        <TouchableOpacity style={styles.button} onPress={testConnection} disabled={apiLoading}>
          <Text style={styles.buttonText}>
            {apiLoading ? 'Testing...' : 'Test API Connection'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Socket Tests */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Socket Tests</Text>
        <Text style={styles.text}>Socket Connected: {socketConnected ? 'Yes' : 'No'}</Text>
        <TouchableOpacity style={styles.button} onPress={testSocketConnection}>
          <Text style={styles.buttonText}>
            {socketConnected ? 'Disconnect Socket' : 'Connect Socket'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Auth Tests */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Authentication Tests</Text>
        <TouchableOpacity style={styles.button} onPress={testLogin}>
          <Text style={styles.buttonText}>Test Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={testRegister}>
          <Text style={styles.buttonText}>Test Register</Text>
        </TouchableOpacity>
        {isAuthenticated && (
          <TouchableOpacity style={styles.button} onPress={logout}>
            <Text style={styles.buttonText}>Test Logout</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Clear Error */}
      {error && (
        <TouchableOpacity style={styles.clearButton} onPress={clearError}>
          <Text style={styles.buttonText}>Clear Error</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  errorText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#e74c3c',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
