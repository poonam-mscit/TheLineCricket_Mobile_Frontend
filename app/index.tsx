import { Text, View } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import { useAuth } from '@/src/hooks/useAuth';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, StyleSheet, TextInput, TouchableOpacity, useColorScheme } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const colorScheme = useColorScheme();
  
  // Use Firebase authentication
  const { login, loading, error } = useAuth();

  const handleLogin = async () => {
    console.log('🔑 Login form submitted');
    
    // Enhanced validation
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      console.log('🔥 Attempting Firebase login...');
      const result = await login(email.trim().toLowerCase(), password);
      
      if (result.success) {
        console.log('✅ Firebase login successful, navigating to home...');
        Alert.alert('Success', 'Welcome back to TheLineCricket!');
        router.replace('/home');
      } else {
        Alert.alert('Login Failed', 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('❌ Firebase login error:', error);
      
      // Show specific error messages
      let errorMessage = 'An error occurred during login. Please try again.';
      
      if (error.message.includes('user-not-found')) {
        errorMessage = 'No account found with this email address. Please check your email or create a new account.';
      } else if (error.message.includes('wrong-password')) {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.message.includes('invalid-email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.message.includes('user-disabled')) {
        errorMessage = 'This account has been disabled. Please contact support.';
      } else if (error.message.includes('too-many-requests')) {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message.includes('No internet connection')) {
        errorMessage = 'No internet connection. Please check your network settings and try again.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      Alert.alert('Login Failed', errorMessage);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { 
      backgroundColor: getColors(colorScheme).background,
      paddingTop: StatusBar.currentHeight || 0
    }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.formContainer}>
        <Text style={[styles.title, { color: getColors(colorScheme).text }]}>
          Welcome Back
        </Text>
        <Text style={[styles.subtitle, { color: getColors(colorScheme).text }]}>
          Sign in with Firebase
        </Text>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
            Email
          </Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: getColors(colorScheme).card,
              color: getColors(colorScheme).text,
              borderColor: getColors(colorScheme).border
            }]}
            placeholder="Enter your email"
            placeholderTextColor={getColors(colorScheme).text}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
            Password
          </Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: getColors(colorScheme).card,
              color: getColors(colorScheme).text,
              borderColor: getColors(colorScheme).border
            }]}
            placeholder="Enter your password"
            placeholderTextColor={getColors(colorScheme).text}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Link href="/forgot-password" asChild>
            <Text style={[styles.forgotPasswordText, { color: getColors(colorScheme).tint }]}>
              Forgot Password?
            </Text>
          </Link>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.loginButton, 
            { 
              backgroundColor: loading ? getColors(colorScheme).border : getColors(colorScheme).tint,
              opacity: loading ? 0.7 : 1
            }
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.loginButtonText}>
              🔥 Sign In with Firebase
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={[styles.signupText, { color: getColors(colorScheme).text }]}>
            Don't have an account?{' '}
          </Text>
          <Link href="/signup" asChild>
            <Text style={[styles.signupLink, { color: getColors(colorScheme).tint }]}>
              Sign Up
            </Text>
          </Link>
        </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  keyboardContainer: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.7,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
