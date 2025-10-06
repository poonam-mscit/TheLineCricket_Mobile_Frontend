import { Text, View } from '@/components/Themed';
import { useColorScheme } from 'react-native';
import { getColors } from '@/constants/Colors';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: reset code, 3: new password
  const colorScheme = useColorScheme();

  const handleSendResetCode = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }
    
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Here you would typically send the reset code to the email
    Alert.alert('Reset Code Sent', 'A reset code has been sent to your email address');
    setStep(2);
  };

  const handleVerifyResetCode = () => {
    if (!resetCode) {
      Alert.alert('Error', 'Please enter the reset code');
      return;
    }

    if (resetCode.length !== 6) {
      Alert.alert('Error', 'Reset code must be 6 digits');
      return;
    }

    // Here you would typically verify the reset code
    Alert.alert('Code Verified', 'Reset code is valid');
    setStep(3);
  };

  const handleResetPassword = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    // Here you would typically reset the password
    Alert.alert('Success', 'Password has been reset successfully!', [
      { text: 'OK', onPress: () => router.push('/') }
    ]);
  };

  const renderStep1 = () => (
    <>
      <Text style={[styles.title, { color: getColors(colorScheme).text }]}>
        Forgot Password?
      </Text>
      <Text style={[styles.subtitle, { color: getColors(colorScheme).text }]}>
        Enter your email address and we'll send you a reset code
      </Text>

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

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: getColors(colorScheme).tint }]}
        onPress={handleSendResetCode}
      >
        <Text style={styles.buttonText}>Send Reset Code</Text>
      </TouchableOpacity>
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={[styles.title, { color: getColors(colorScheme).text }]}>
        Enter Reset Code
      </Text>
      <Text style={[styles.subtitle, { color: getColors(colorScheme).text }]}>
        We've sent a 6-digit code to {email}
      </Text>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
          Reset Code
        </Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: getColors(colorScheme).card,
            color: getColors(colorScheme).text,
            borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
          }]}
          placeholder="Enter 6-digit code"
          placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
          value={resetCode}
          onChangeText={setResetCode}
          keyboardType="numeric"
          maxLength={6}
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: getColors(colorScheme).tint }]}
        onPress={handleVerifyResetCode}
      >
        <Text style={styles.buttonText}>Verify Code</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.resendButton}
        onPress={() => {
          Alert.alert('Code Resent', 'A new reset code has been sent to your email');
        }}
      >
        <Text style={[styles.resendText, { color: getColors(colorScheme).tint }]}>
          Resend Code
        </Text>
      </TouchableOpacity>
    </>
  );

  const renderStep3 = () => (
    <>
      <Text style={[styles.title, { color: getColors(colorScheme).text }]}>
        Create New Password
      </Text>
      <Text style={[styles.subtitle, { color: getColors(colorScheme).text }]}>
        Enter your new password
      </Text>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
          New Password
        </Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: getColors(colorScheme).card,
            color: getColors(colorScheme).text,
            borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
          }]}
          placeholder="Enter new password"
          placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
          Confirm New Password
        </Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: getColors(colorScheme).card,
            color: getColors(colorScheme).text,
            borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
          }]}
          placeholder="Confirm new password"
          placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: getColors(colorScheme).tint }]}
        onPress={handleResetPassword}
      >
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.formContainer}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        <View style={styles.backContainer}>
          <Link href="/" asChild>
            <Text style={[styles.backLink, { color: getColors(colorScheme).tint }]}>
              Back to Sign In
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
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '600',
  },
  backContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  backLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
