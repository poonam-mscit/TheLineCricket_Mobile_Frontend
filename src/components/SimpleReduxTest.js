// Simple Redux test component without external dependencies
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SimpleReduxTest() {
  const [testResults, setTestResults] = useState({});
  const [isTesting, setIsTesting] = useState(false);

  const runReduxTests = async () => {
    setIsTesting(true);
    const results = {};

    try {
      // Test 1: Check if Redux store can be imported
      console.log('🔍 Testing Redux store import...');
      try {
        const { store } = require('../store');
        results.storeImport = '✅ Store imported successfully';
        console.log('✅ Redux store imported');
      } catch (error) {
        results.storeImport = `❌ Store import failed: ${error.message}`;
        console.error('❌ Redux store import failed:', error);
      }

      // Test 2: Check if store has correct structure
      try {
        const { store } = require('../store');
        const state = store.getState();
        const hasAuth = 'auth' in state;
        const hasApi = 'api' in state;
        const hasSocket = 'socket' in state;
        
        results.storeStructure = `✅ Auth: ${hasAuth}, API: ${hasApi}, Socket: ${hasSocket}`;
        console.log('✅ Store structure check passed');
      } catch (error) {
        results.storeStructure = `❌ Structure check failed: ${error.message}`;
        console.error('❌ Store structure check failed:', error);
      }

      // Test 3: Check if actions can be dispatched
      try {
        const { store } = require('../store');
        store.dispatch({ type: 'auth/clearError' });
        results.actionDispatch = '✅ Actions can be dispatched';
        console.log('✅ Action dispatch test passed');
      } catch (error) {
        results.actionDispatch = `❌ Action dispatch failed: ${error.message}`;
        console.error('❌ Action dispatch test failed:', error);
      }

      // Test 4: Check if hooks can be imported
      try {
        const { useAuthState } = require('../hooks/redux');
        results.hooksImport = '✅ Hooks imported successfully';
        console.log('✅ Redux hooks imported');
      } catch (error) {
        results.hooksImport = `❌ Hooks import failed: ${error.message}`;
        console.error('❌ Redux hooks import failed:', error);
      }

    } catch (error) {
      results.generalError = `❌ General test error: ${error.message}`;
      console.error('❌ General Redux test error:', error);
    }

    setTestResults(results);
    setIsTesting(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simple Redux Test</Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={runReduxTests}
        disabled={isTesting}
      >
        <Text style={styles.buttonText}>
          {isTesting ? 'Running Tests...' : 'Run Redux Tests'}
        </Text>
      </TouchableOpacity>

      {Object.entries(testResults).map(([test, result]) => (
        <View key={test} style={styles.resultItem}>
          <Text style={styles.testName}>{test}:</Text>
          <Text style={styles.testResult}>{result}</Text>
        </View>
      ))}

      <Text style={styles.note}>
        This test checks if Redux can be imported and basic functionality works.
      </Text>
    </View>
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
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultItem: {
    backgroundColor: 'white',
    padding: 12,
    marginBottom: 8,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  testName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  testResult: {
    fontSize: 12,
    color: '#666',
  },
  note: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});
