// Backend Test Runner Component
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { backendIntegrationTester } from '../utils/BackendIntegrationTester';

export default function BackendTestRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [successRate, setSuccessRate] = useState(0);

  const runTests = async () => {
    setIsRunning(true);
    setResults(null);
    
    try {
      console.log('🚀 Starting Backend Integration Tests...');
      await backendIntegrationTester.runAllTests();
      
      const testResults = backendIntegrationTester.getResults();
      const rate = backendIntegrationTester.getSuccessRate();
      
      setResults(testResults);
      setSuccessRate(rate);
      
      Alert.alert(
        'Test Complete', 
        `Backend integration test completed!\nSuccess Rate: ${rate}%`,
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      console.error('Test runner error:', error);
      Alert.alert('Test Failed', 'Backend integration test failed. Check console for details.');
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'success') return '#4CAF50';
    if (status === 'failed') return '#F44336';
    return '#FF9800';
  };

  const getStatusIcon = (status) => {
    if (status === 'success') return '✅';
    if (status === 'failed') return '❌';
    return '⏳';
  };

  const renderTestResults = () => {
    if (!results) return null;

    return (
      <ScrollView style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Test Results</Text>
        
        {/* Connection Tests */}
        {results.connection && (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>🔗 Connection Tests</Text>
            {Object.entries(results.connection).map(([test, result]) => (
              <View key={test} style={styles.testItem}>
                <Text style={styles.testName}>{test}:</Text>
                <Text style={[
                  styles.testStatus,
                  { color: getStatusColor(result.status) }
                ]}>
                  {getStatusIcon(result.status)} {result.status}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Authentication Tests */}
        {results.authentication && (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>🔐 Authentication Tests</Text>
            {Object.entries(results.authentication).map(([test, result]) => (
              <View key={test} style={styles.testItem}>
                <Text style={styles.testName}>{test}:</Text>
                <Text style={[
                  styles.testStatus,
                  { color: getStatusColor(result.status) }
                ]}>
                  {getStatusIcon(result.status)} {result.status}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* API Endpoints Tests */}
        {results.apiEndpoints && (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>🔌 API Endpoints Tests</Text>
            {Object.entries(results.apiEndpoints).map(([endpoint, result]) => (
              <View key={endpoint} style={styles.testItem}>
                <Text style={styles.testName}>{endpoint}:</Text>
                <Text style={[
                  styles.testStatus,
                  { color: getStatusColor(result.status) }
                ]}>
                  {getStatusIcon(result.status)} {result.status}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Real-time Tests */}
        {results.realTime && (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>⚡ Real-time Tests</Text>
            {Object.entries(results.realTime).map(([test, result]) => (
              <View key={test} style={styles.testItem}>
                <Text style={styles.testName}>{test}:</Text>
                <Text style={[
                  styles.testStatus,
                  { color: getStatusColor(result.status) }
                ]}>
                  {getStatusIcon(result.status)} {result.status}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Database Tests */}
        {results.database && (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>🗄️ Database Tests</Text>
            {Object.entries(results.database).map(([test, result]) => (
              <View key={test} style={styles.testItem}>
                <Text style={styles.testName}>{test}:</Text>
                <Text style={[
                  styles.testStatus,
                  { color: getStatusColor(result.status) }
                ]}>
                  {getStatusIcon(result.status)} {result.status}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Error Handling Tests */}
        {results.errorHandling && (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>🛡️ Error Handling Tests</Text>
            {Object.entries(results.errorHandling).map(([test, result]) => (
              <View key={test} style={styles.testItem}>
                <Text style={styles.testName}>{test}:</Text>
                <Text style={[
                  styles.testStatus,
                  { color: getStatusColor(result.status) }
                ]}>
                  {getStatusIcon(result.status)} {result.status}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Backend Integration Tester</Text>
      
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          Success Rate: {successRate}%
        </Text>
        <Text style={styles.summarySubtext}>
          {successRate >= 90 ? '🎉 Excellent!' : 
           successRate >= 70 ? '✅ Good!' : 
           successRate >= 50 ? '⚠️ Fair' : '❌ Needs Attention'}
        </Text>
      </View>

      <TouchableOpacity 
        style={[
          styles.testButton,
          isRunning && styles.testButtonDisabled
        ]}
        onPress={runTests}
        disabled={isRunning}
      >
        <Text style={styles.testButtonText}>
          {isRunning ? 'Running Tests...' : 'Run Backend Tests'}
        </Text>
      </TouchableOpacity>

      {isRunning && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            🔄 Running comprehensive backend integration tests...
          </Text>
          <Text style={styles.loadingSubtext}>
            This may take a few moments. Check console for detailed logs.
          </Text>
        </View>
      )}

      {renderTestResults()}
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
  summaryContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  summarySubtext: {
    fontSize: 16,
    color: '#666',
  },
  testButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  testButtonDisabled: {
    backgroundColor: '#ccc',
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#1976D2',
    textAlign: 'center',
    marginBottom: 5,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  categoryContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  testItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  testName: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  testStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
