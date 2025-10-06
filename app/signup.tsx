import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const colorScheme = useColorScheme();

  const handleSignup = () => {
    console.log('📝 Signup form submitted');
    
    // Validation
    if (!fullName || !username || !email || !age || !location || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 13 || ageNum > 120) {
      Alert.alert('Error', 'Please enter a valid age between 13 and 120');
      return;
    }

    console.log('📝 Validation passed, navigating to home...');
    router.replace('/home');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
            Create Account
          </Text>
          <Text style={[styles.subtitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Join us today
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
              Full Name
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: Colors[colorScheme ?? 'light'].card,
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
              }]}
              placeholder="Enter your full name"
              placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
              Username
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: Colors[colorScheme ?? 'light'].card,
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
              }]}
              placeholder="Choose a username"
              placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
              Email
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: Colors[colorScheme ?? 'light'].card,
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
              }]}
              placeholder="Enter your email"
              placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
              <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
                Age
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: Colors[colorScheme ?? 'light'].card,
                  color: Colors[colorScheme ?? 'light'].text,
                  borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
                }]}
                placeholder="Age"
                placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputContainer, { flex: 2, marginLeft: 10 }]}>
              <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
                Location
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: Colors[colorScheme ?? 'light'].card,
                  color: Colors[colorScheme ?? 'light'].text,
                  borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
                }]}
                placeholder="City, Country"
                placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
                value={location}
                onChangeText={setLocation}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
              Password
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: Colors[colorScheme ?? 'light'].card,
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
              }]}
              placeholder="Create a password"
              placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
              Confirm Password
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: Colors[colorScheme ?? 'light'].card,
                color: Colors[colorScheme ?? 'light'].text,
                borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
              }]}
              placeholder="Confirm your password"
              placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={[styles.signupButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
            onPress={handleSignup}
          >
            <Text style={styles.signupButtonText}>
              Create Account
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: Colors[colorScheme ?? 'light'].text }]}>
              Already have an account?{' '}
            </Text>
            <Link href="/" asChild>
              <Text style={[styles.loginLink, { color: Colors[colorScheme ?? 'light'].tint }]}>
                Sign In
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContainer: {
    flexGrow: 1,
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
    marginBottom: 30,
    opacity: 0.7,
  },
  inputContainer: {
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
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
  signupButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
