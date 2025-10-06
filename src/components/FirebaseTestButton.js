// Firebase test button component
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { testFirebaseAuth, testFirebaseConnection } from '../services/firebaseTest';

export default function FirebaseTestButton() {
  const [testing, setTesting] = useState(false);

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const success = await testFirebaseConnection();
      if (success) {
        Alert.alert('Success', 'Firebase connection test passed!');
      } else {
        Alert.alert('Error', 'Firebase connection test failed. Check console for details.');
      }
    } catch (error) {
      Alert.alert('Error', `Test failed: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  const handleTestAuth = async () => {
    setTesting(true);
    try {
      const success = await testFirebaseAuth();
      if (success) {
        Alert.alert('Success', 'Firebase Auth test passed!');
      } else {
        Alert.alert('Error', 'Firebase Auth test failed. Check console for details.');
      }
    } catch (error) {
      Alert.alert('Error', `Auth test failed: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={handleTestConnection}
        disabled={testing}
      >
        <Text style={styles.buttonText}>
          {testing ? 'Testing...' : 'Test Firebase Connection'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={handleTestAuth}
        disabled={testing}
      >
        <Text style={styles.buttonText}>
          {testing ? 'Testing...' : 'Test Firebase Auth'}
        </Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
