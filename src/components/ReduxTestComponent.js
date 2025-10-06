// Simple Redux test component
import React, { useEffect } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useApiState, useAuthState, useSocketState } from '../hooks/redux';

export default function ReduxTestComponent() {
  const authState = useAuthState();
  const apiState = useApiState();
  const socketState = useSocketState();

  useEffect(() => {
    console.log('🔍 Redux Test Component Mounted');
    console.log('Auth State:', authState);
    console.log('API State:', apiState);
    console.log('Socket State:', socketState);
  }, [authState, apiState, socketState]);

  const testReduxConnection = () => {
    try {
      // Test if Redux state is accessible
      if (authState !== undefined && apiState !== undefined && socketState !== undefined) {
        Alert.alert('Success', 'Redux state is accessible!');
        console.log('✅ Redux connection test passed');
      } else {
        Alert.alert('Error', 'Redux state is not accessible');
        console.error('❌ Redux connection test failed');
      }
    } catch (error) {
      Alert.alert('Error', `Redux test failed: ${error.message}`);
      console.error('❌ Redux test error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redux Test Component</Text>
      <Text style={styles.text}>Auth Loading: {authState.loading ? 'Yes' : 'No'}</Text>
      <Text style={styles.text}>API Connected: {apiState.isConnected ? 'Yes' : 'No'}</Text>
      <Text style={styles.text}>Socket Connected: {socketState.isConnected ? 'Yes' : 'No'}</Text>
      <Text style={styles.text}>Redux State Accessible: ✅</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    margin: 10,
    borderRadius: 8,
  },
  title: {
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
});
