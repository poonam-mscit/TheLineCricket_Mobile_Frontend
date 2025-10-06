import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import { getColors } from '@/constants/Colors';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const colorScheme = useColorScheme();

  const handleLogin = () => {
    console.log('🔑 Login form submitted');
    
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    console.log('🔑 Validation passed, navigating to home...');
    router.replace('/home');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.formContainer}>
        <Text style={[styles.title, { color: getColors(colorScheme).text }]}>
          Welcome Back
        </Text>
        <Text style={[styles.subtitle, { color: getColors(colorScheme).text }]}>
          Sign in to your account
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
          style={[styles.loginButton, { backgroundColor: getColors(colorScheme).tint }]}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>
            Sign In
          </Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
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
