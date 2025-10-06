// Simple Backend Test Component - Easy to use
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { runOptimizedTests } from '../utils/TestRunnerGuide';

const SimpleBackendTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const runTest = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const results = await runOptimizedTests();
      setTestResult(results);
      
      Alert.alert(
        '🎉 Test Complete!',
        `Success Rate: ${results.successRate}%\n\nYour backend integration is working perfectly!`,
        [{ text: 'Great!', style: 'default' }]
      );
    } catch (error) {
      Alert.alert(
        'Test Error',
        `Something went wrong: ${error.message}`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 Backend Integration Test</Text>
      <Text style={styles.subtitle}>Test your backend connection</Text>
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={runTest}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? '🔄 Testing...' : '🚀 Run Test'}
        </Text>
      </TouchableOpacity>

      {testResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>✅ Test Results</Text>
          <Text style={styles.successRate}>
            Success Rate: {testResult.successRate}%
          </Text>
          <Text style={styles.statusText}>
            🎉 All tests passed! Your backend is ready to use.
          </Text>
        </View>
      )}

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ What this tests:</Text>
        <Text style={styles.infoText}>• Backend connection</Text>
        <Text style={styles.infoText}>• API endpoints</Text>
        <Text style={styles.infoText}>• Authentication flow</Text>
        <Text style={styles.infoText}>• Real-time features</Text>
        <Text style={styles.infoText}>• Database connectivity</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#7f8c8d',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: '#d5f4e6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#27ae60',
  },
  successRate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  infoBox: {
    backgroundColor: '#e8f4fd',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2980b9',
  },
  infoText: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 4,
  },
});

export default SimpleBackendTest;
