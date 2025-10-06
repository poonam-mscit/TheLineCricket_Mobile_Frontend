// Backend connection test component
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { apiService } from '../services/apiService';
import { fetchPosts, globalSearch, testConnection } from '../store/slices/apiSlice';
import { loginUser, registerUser } from '../store/slices/authSlice';

export default function BackendConnectionTest() {
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState({});
  
  const dispatch = useDispatch();
  const { isConnected, loading, errors } = useSelector(state => state.api);
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const runConnectionTest = async () => {
    setTesting(true);
    setTestResults({});
    
    try {
      // Test 1: Basic connection
      console.log('Testing basic connection...');
      const connectionResult = await dispatch(testConnection());
      setTestResults(prev => ({ ...prev, connection: connectionResult.type }));
      
      // Test 2: API endpoints
      console.log('Testing API endpoints...');
      
      // Test posts endpoint
      try {
        const postsResult = await dispatch(fetchPosts({ page: 1, perPage: 5 }));
        setTestResults(prev => ({ ...prev, posts: postsResult.type }));
      } catch (error) {
        setTestResults(prev => ({ ...prev, posts: 'rejected' }));
      }
      
      // Test search endpoint
      try {
        const searchResult = await dispatch(globalSearch({ query: 'test' }));
        setTestResults(prev => ({ ...prev, search: searchResult.type }));
      } catch (error) {
        setTestResults(prev => ({ ...prev, search: 'rejected' }));
      }
      
      // Test 3: Direct API service calls
      console.log('Testing direct API calls...');
      
      try {
        const healthCheck = await apiService.healthCheck();
        setTestResults(prev => ({ ...prev, healthCheck: 'success' }));
      } catch (error) {
        setTestResults(prev => ({ ...prev, healthCheck: 'failed' }));
      }
      
      Alert.alert('Test Complete', 'Backend connection test completed. Check console for details.');
      
    } catch (error) {
      console.error('Connection test failed:', error);
      Alert.alert('Test Failed', 'Backend connection test failed. Check console for details.');
    } finally {
      setTesting(false);
    }
  };

  const testAuthentication = async () => {
    setTesting(true);
    
    try {
      // Test registration
      const registerData = {
        email: 'test@example.com',
        password: 'testpassword123',
        username: 'testuser',
        fullName: 'Test User',
        age: 25,
        location: 'Test City'
      };
      
      const registerResult = await dispatch(registerUser(registerData));
      setTestResults(prev => ({ ...prev, register: registerResult.type }));
      
      // Test login
      const loginResult = await dispatch(loginUser({ 
        email: 'test@example.com', 
        password: 'testpassword123' 
      }));
      setTestResults(prev => ({ ...prev, login: loginResult.type }));
      
      Alert.alert('Auth Test Complete', 'Authentication test completed.');
      
    } catch (error) {
      console.error('Authentication test failed:', error);
      Alert.alert('Auth Test Failed', 'Authentication test failed.');
    } finally {
      setTesting(false);
    }
  };

  const getTestResultColor = (result) => {
    if (result === 'fulfilled' || result === 'success') return '#4CAF50';
    if (result === 'rejected' || result === 'failed') return '#F44336';
    return '#FF9800';
  };

  const getTestResultText = (result) => {
    if (result === 'fulfilled' || result === 'success') return '✓ Success';
    if (result === 'rejected' || result === 'failed') return '✗ Failed';
    return '⏳ Pending';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Backend Connection Test</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Connection: {isConnected ? '✅ Connected' : '❌ Disconnected'}
        </Text>
        <Text style={styles.statusText}>
          Auth: {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
        </Text>
        {user && <Text style={styles.statusText}>User: {user.username || user.email}</Text>}
      </View>

      <TouchableOpacity 
        style={[styles.button, styles.primaryButton]}
        onPress={runConnectionTest}
        disabled={testing}
      >
        <Text style={styles.buttonText}>
          {testing ? 'Testing...' : 'Test Backend Connection'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]}
        onPress={testAuthentication}
        disabled={testing}
      >
        <Text style={styles.buttonText}>
          {testing ? 'Testing...' : 'Test Authentication'}
        </Text>
      </TouchableOpacity>

      {Object.keys(testResults).length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Test Results:</Text>
          {Object.entries(testResults).map(([test, result]) => (
            <View key={test} style={styles.resultItem}>
              <Text style={styles.resultLabel}>{test}:</Text>
              <Text style={[
                styles.resultValue, 
                { color: getTestResultColor(result) }
              ]}>
                {getTestResultText(result)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {loading.connection && (
        <Text style={styles.loadingText}>Testing connection...</Text>
      )}

      {errors.connection && (
        <Text style={styles.errorText}>Connection Error: {errors.connection}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#2196F3',
  },
  secondaryButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    color: '#2196F3',
    marginTop: 10,
  },
  errorText: {
    textAlign: 'center',
    color: '#F44336',
    marginTop: 10,
  },
});
