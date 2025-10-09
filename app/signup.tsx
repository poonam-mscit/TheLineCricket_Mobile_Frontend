import { Text, View } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import { useAuth } from '@/src/hooks/useAuth';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity, useColorScheme } from 'react-native';

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const colorScheme = useColorScheme();
  
  // Use real authentication
  const { register, loading, error } = useAuth();

  const handleSignup = async () => {
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

    try {
      console.log('📝 Attempting signup with backend...');
      const userData = {
        fullName,
        username,
        email,
        age: ageNum,
        location,
        password
      };
      
      const result = await register(userData);
      
      if (result.success) {
        console.log('✅ Signup successful, navigating to home...');
        router.replace('/home');
      } else {
        Alert.alert('Signup Failed', 'Account creation failed. Please try again.');
      }
    } catch (error) {
      console.error('❌ Signup error:', error);
      Alert.alert('Signup Failed', error.message || 'An error occurred during signup. Please try again.');
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
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={[styles.title, { color: getColors(colorScheme).text }]}>
            Create Account
          </Text>
          <Text style={[styles.subtitle, { color: getColors(colorScheme).text }]}>
            Join us today
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
              Full Name
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: getColors(colorScheme).card,
                color: getColors(colorScheme).text,
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
            <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
              Username
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: getColors(colorScheme).card,
                color: getColors(colorScheme).text,
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
            <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
              Email
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: getColors(colorScheme).card,
                color: getColors(colorScheme).text,
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
              <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
                Age
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: getColors(colorScheme).card,
                  color: getColors(colorScheme).text,
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
              <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
                Location
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: getColors(colorScheme).card,
                  color: getColors(colorScheme).text,
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
            <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
              Password
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: getColors(colorScheme).card,
                color: getColors(colorScheme).text,
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
            <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
              Confirm Password
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: getColors(colorScheme).card,
                color: getColors(colorScheme).text,
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
            style={[
              styles.signupButton, 
              { 
                backgroundColor: loading ? getColors(colorScheme).border : getColors(colorScheme).tint,
                opacity: loading ? 0.7 : 1
              }
            ]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.signupButtonText}>
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: getColors(colorScheme).text }]}>
              Already have an account?{' '}
            </Text>
            <Link href="/" asChild>
              <Text style={[styles.loginLink, { color: getColors(colorScheme).tint }]}>
                Sign In
              </Text>
            </Link>
          </View>
        </View>
        </ScrollView>
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
