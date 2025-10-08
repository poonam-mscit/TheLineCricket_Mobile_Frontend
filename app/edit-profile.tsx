import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator, Alert,
    Dimensions, Image, SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity, useColorScheme, View
} from 'react-native';

interface ValidationRules {
  fullName: { required: boolean; minLength: number; maxLength: number };
  username: { required: boolean; minLength: number; maxLength: number; pattern: RegExp };
  email: { required: boolean; pattern: RegExp };
  age: { required: boolean; min: number; max: number };
  bio: { maxLength: number };
  contact: { pattern: RegExp };
  battingStats: {
    totalRuns: { min: number; max: number };
    matches: { min: number; max: number };
    centuries: { min: number; max: number };
    halfCenturies: { min: number; max: number };
    average: { min: number; max: number };
    highest: { min: number; max: number };
  };
  bowlingStats: {
    matches: { min: number; max: number };
    overs: { min: number; max: number };
    wickets: { min: number; max: number };
    hatTricks: { min: number; max: number };
    average: { min: number; max: number };
  };
  fieldingStats: {
    matches: { min: number; max: number };
    catches: { min: number; max: number };
    stumpings: { min: number; max: number };
    runOuts: { min: number; max: number };
  };
}

interface EditProfileData {
  // Basic Information
  fullName: string;
  username: string;
  bio: string;
  location: string;
  organization: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  contact: string;
  email: string;
  profileImage: string | null;
  
  // Cricket Statistics
  battingStats: {
    totalRuns: number;
    matches: number;
    centuries: number;
    halfCenturies: number;
    average: number;
    highest: number;
  };
  bowlingStats: {
    matches: number;
    overs: number;
    wickets: number;
    hatTricks: number;
    best: string;
    average: number;
  };
  fieldingStats: {
    matches: number;
    catches: number;
    stumpings: number;
    runOuts: number;
  };
  
  // Format Performance
  formatStats: {
    test: { matches: number; runs: number; wickets: number; average: number };
    odi: { matches: number; runs: number; wickets: number; average: number };
    t20: { matches: number; runs: number; wickets: number; average: number };
  };
  
  // Skills Rating
  skills: {
    batting: number;
    bowling: number;
    fielding: number;
  };
  
  // Dynamic Lists
  experience: Array<{
    id?: string;
    title: string;
    role: string;
    duration: string;
    description: string;
  }>;
  achievements: Array<{
    id?: string;
    title: string;
    description: string;
    year: string;
  }>;
  awards: Array<{
    id?: string;
    title: string;
    organization: string;
    year: string;
  }>;
}

// Validation rules configuration
const validationRules: ValidationRules = {
  fullName: { required: true, minLength: 2, maxLength: 50 },
  username: { required: true, minLength: 3, maxLength: 20, pattern: /^[a-zA-Z0-9_]+$/ },
  email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  age: { required: true, min: 13, max: 100 },
  bio: { maxLength: 500 },
  contact: { pattern: /^[\+]?[1-9][\d]{0,15}$/ },
  battingStats: {
    totalRuns: { min: 0, max: 100000 },
    matches: { min: 0, max: 1000 },
    centuries: { min: 0, max: 100 },
    halfCenturies: { min: 0, max: 500 },
    average: { min: 0, max: 200 },
    highest: { min: 0, max: 500 }
  },
  bowlingStats: {
    matches: { min: 0, max: 1000 },
    overs: { min: 0, max: 10000 },
    wickets: { min: 0, max: 1000 },
    hatTricks: { min: 0, max: 50 },
    average: { min: 0, max: 100 }
  },
  fieldingStats: {
    matches: { min: 0, max: 1000 },
    catches: { min: 0, max: 500 },
    stumpings: { min: 0, max: 200 },
    runOuts: { min: 0, max: 100 }
  }
};

export default function EditProfileScreen() {
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [activeStatsTab, setActiveStatsTab] = useState<'batting' | 'bowling' | 'fielding'>('batting');
  const [isValidating, setIsValidating] = useState(false);
  const colorScheme = useColorScheme();
  const { width } = Dimensions.get('window');
  
  // Mock user data following existing patterns
  const user = {
    id: '1',
    fullName: 'Demo User',
    username: 'demo_user',
    email: 'demo@example.com',
    avatar: 'https://via.placeholder.com/100',
    verified: true
  };

  // Form data state following existing patterns
  const [formData, setFormData] = useState<EditProfileData>({
    // Basic Information
    fullName: 'Demo User',
    username: 'demo_user',
    bio: 'Passionate cricket player and coach. Love the game!',
    location: 'Mumbai, India',
    organization: 'Mumbai Cricket Academy',
    age: 25,
    gender: 'Male',
    contact: '+91 9876543210',
    email: 'demo@example.com',
    profileImage: 'https://via.placeholder.com/100',
    
    // Cricket Statistics
    battingStats: {
      totalRuns: 1250,
      matches: 25,
      centuries: 2,
      halfCenturies: 8,
      average: 50.0,
      highest: 125
    },
    bowlingStats: {
      matches: 25,
      overs: 45.2,
      wickets: 15,
      hatTricks: 1,
      best: '5/25',
      average: 25.0
    },
    fieldingStats: {
      matches: 25,
      catches: 12,
      stumpings: 3,
      runOuts: 5
    },
    
    // Format Performance
    formatStats: {
      test: { matches: 5, runs: 300, wickets: 8, average: 60.0 },
      odi: { matches: 15, runs: 750, wickets: 5, average: 50.0 },
      t20: { matches: 5, runs: 200, wickets: 2, average: 40.0 }
    },
    
    // Skills Rating
    skills: {
      batting: 85,
      bowling: 70,
      fielding: 80
    },
    
    // Dynamic Lists
    experience: [
      {
        id: '1',
        title: 'Mumbai Cricket Academy',
        role: 'Senior Coach',
        duration: '2020 - Present',
        description: 'Coaching young cricketers and developing their skills'
      }
    ],
    achievements: [
      {
        id: '1',
        title: 'Best Batsman 2023',
        description: 'Awarded for outstanding batting performance',
        year: '2023'
      }
    ],
    awards: [
      {
        id: '1',
        title: 'Player of the Year',
        organization: 'Mumbai Cricket Association',
        year: '2023'
      }
    ]
  });

  // Validation helper functions
  const validateField = (field: string, value: any): string => {
    const rules = validationRules[field as keyof ValidationRules];
    if (!rules) return '';

    // Required field validation
    if (rules.required && (!value || value.toString().trim() === '')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }

    // String length validation
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${rules.minLength} characters`;
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} must be no more than ${rules.maxLength} characters`;
      }
    }

    // Number range validation
    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${rules.min}`;
      }
      if (rules.max !== undefined && value > rules.max) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} must be no more than ${rules.max}`;
      }
    }

    // Pattern validation
    if (rules.pattern && typeof value === 'string') {
      if (!rules.pattern.test(value)) {
        if (field === 'username') {
          return 'Username can only contain letters, numbers, and underscores';
        }
        if (field === 'email') {
          return 'Please enter a valid email address';
        }
        if (field === 'contact') {
          return 'Please enter a valid phone number';
        }
        return `${field.charAt(0).toUpperCase() + field.slice(1)} format is invalid`;
      }
    }

    return '';
  };

  const validateNestedField = (parent: string, field: string, value: any): string => {
    const rules = validationRules[parent as keyof ValidationRules];
    if (!rules || typeof rules !== 'object' || !rules[field as keyof typeof rules]) {
      return '';
    }

    const fieldRules = rules[field as keyof typeof rules] as any;
    if (typeof value === 'number') {
      if (fieldRules.min !== undefined && value < fieldRules.min) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${fieldRules.min}`;
      }
      if (fieldRules.max !== undefined && value > fieldRules.max) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} must be no more than ${fieldRules.max}`;
      }
    }

    return '';
  };

  const validateForm = (): boolean => {
    setIsValidating(true);
    const newErrors: Record<string, string> = {};

    // Validate basic fields
    const basicFields: (keyof EditProfileData)[] = ['fullName', 'username', 'email', 'age', 'bio', 'contact'];
    basicFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    // Validate cricket stats
    Object.entries(formData.battingStats).forEach(([key, value]) => {
      const error = validateNestedField('battingStats', key, value);
      if (error) {
        newErrors[`battingStats.${key}`] = error;
      }
    });

    Object.entries(formData.bowlingStats).forEach(([key, value]) => {
      const error = validateNestedField('bowlingStats', key, value);
      if (error) {
        newErrors[`bowlingStats.${key}`] = error;
      }
    });

    Object.entries(formData.fieldingStats).forEach(([key, value]) => {
      const error = validateNestedField('fieldingStats', key, value);
      if (error) {
        newErrors[`fieldingStats.${key}`] = error;
      }
    });

    setErrors(newErrors);
    setIsValidating(false);
    return Object.keys(newErrors).length === 0;
  };

  // Event handlers following existing patterns
  const handleInputChange = (field: keyof EditProfileData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    
    // Real-time validation
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleNestedChange = (parent: keyof EditProfileData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [field]: value
      }
    }));
    setHasChanges(true);
    
    // Real-time validation for nested fields
    const error = validateNestedField(parent, field, value);
    setErrors(prev => ({ ...prev, [`${parent}.${field}`]: error }));
  };

  const handleArrayItemChange = (parent: keyof EditProfileData, index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: (prev[parent] as any[]).map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
    setHasChanges(true);
  };

  const handleAddArrayItem = (parent: keyof EditProfileData, newItem: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: [...(prev[parent] as any[]), newItem]
    }));
    setHasChanges(true);
  };

  const handleRemoveArrayItem = (parent: keyof EditProfileData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [parent]: (prev[parent] as any[]).filter((_, i) => i !== index)
    }));
    setHasChanges(true);
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to leave?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard Changes', style: 'destructive', onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };

  const handleSave = async () => {
    // Validate form before saving
    if (!validateForm()) {
      Alert.alert(
        'Validation Error',
        'Please fix all errors before saving.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Profile Updated!',
        'Your profile has been updated successfully.',
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Image picker handlers
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant permission to access your media library.');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        handleInputChange('profileImage', result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const removeImage = () => {
    handleInputChange('profileImage', null);
  };

  const renderHeader = () => (
    <View style={[styles.customHeader, { backgroundColor: getColors(colorScheme).background }]}>
      <View style={styles.headerContent}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleCancel}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: getColors(colorScheme).text }]}>
          Edit Profile
        </Text>
        <TouchableOpacity 
          style={[
            styles.saveButton,
            { 
              backgroundColor: hasChanges && Object.keys(errors).length === 0 ? '#10B981' : '#9CA3AF'
            }
          ]}
          onPress={handleSave}
          disabled={!hasChanges || isSaving || Object.keys(errors).length > 0}
        >
          {isSaving ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>
              {Object.keys(errors).length > 0 ? 'Fix Errors' : 'Save'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProfilePhotoSection = () => (
    <View style={[styles.section, { backgroundColor: getColors(colorScheme).card }]}>
      <Text style={[styles.sectionTitle, { color: getColors(colorScheme).text }]}>
        Profile Photo
      </Text>
      
      <View style={styles.photoContainer}>
        <View style={styles.photoWrapper}>
          {formData.profileImage ? (
            <Image source={{ uri: formData.profileImage }} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileImage, { backgroundColor: getColors(colorScheme).tint }]}>
              <Text style={styles.profileImageText}>
                {formData.fullName.charAt(0)}
              </Text>
            </View>
          )}
          <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
            <Text style={styles.cameraIcon}>📷</Text>
          </TouchableOpacity>
          {formData.profileImage && (
            <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
              <Text style={styles.removeIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const renderBasicInfoSection = () => (
    <View style={[styles.section, { backgroundColor: getColors(colorScheme).card }]}>
      <Text style={[styles.sectionTitle, { color: getColors(colorScheme).text }]}>
        Basic Information
      </Text>
      
      <View style={styles.formContainer}>
        <View style={styles.rowContainer}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
              Full Name *
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: getColors(colorScheme).background,
                  color: getColors(colorScheme).text,
                  borderColor: errors.fullName ? getColors(colorScheme).error : getColors(colorScheme).border
                }
              ]}
              placeholder="Enter full name"
              placeholderTextColor={getColors(colorScheme).text}
              value={formData.fullName}
              onChangeText={(value) => handleInputChange('fullName', value)}
            />
            {errors.fullName && <Text style={[styles.errorText, { color: getColors(colorScheme).error }]}>{errors.fullName}</Text>}
          </View>
          
          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
              Username *
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: getColors(colorScheme).background,
                  color: getColors(colorScheme).text,
                  borderColor: errors.username ? getColors(colorScheme).error : getColors(colorScheme).border
                }
              ]}
              placeholder="Enter username"
              placeholderTextColor={getColors(colorScheme).text}
              value={formData.username}
              onChangeText={(value) => handleInputChange('username', value)}
            />
            {errors.username && <Text style={[styles.errorText, { color: getColors(colorScheme).error }]}>{errors.username}</Text>}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
            Bio
          </Text>
          <TextInput
            style={[
              styles.textArea,
              { 
                backgroundColor: getColors(colorScheme).background,
                color: getColors(colorScheme).text,
                borderColor: errors.bio ? getColors(colorScheme).error : getColors(colorScheme).border
              }
            ]}
            placeholder="Tell us about yourself..."
            placeholderTextColor={getColors(colorScheme).text}
            value={formData.bio}
            onChangeText={(value) => handleInputChange('bio', value)}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <View style={styles.characterCounter}>
            <Text style={[
              styles.characterCount,
              { 
                color: formData.bio.length > 450 ? getColors(colorScheme).error : getColors(colorScheme).text 
              }
            ]}>
              {formData.bio.length}/500
            </Text>
          </View>
          {errors.bio && <Text style={[styles.errorText, { color: getColors(colorScheme).error }]}>{errors.bio}</Text>}
        </View>

        <View style={styles.rowContainer}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
              Age *
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: getColors(colorScheme).background,
                  color: getColors(colorScheme).text,
                  borderColor: errors.age ? getColors(colorScheme).error : getColors(colorScheme).border
                }
              ]}
              placeholder="Enter age"
              placeholderTextColor={getColors(colorScheme).text}
              value={formData.age.toString()}
              onChangeText={(value) => handleInputChange('age', parseInt(value) || 0)}
              keyboardType="numeric"
            />
            {errors.age && <Text style={[styles.errorText, { color: getColors(colorScheme).error }]}>{errors.age}</Text>}
          </View>
          
          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
              Gender *
            </Text>
            <View style={[styles.selectContainer, { backgroundColor: getColors(colorScheme).background, borderColor: getColors(colorScheme).border }]}>
              <Text style={[styles.selectText, { color: getColors(colorScheme).text }]}>
                {formData.gender}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
            Location
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: getColors(colorScheme).background,
                color: getColors(colorScheme).text,
                borderColor: getColors(colorScheme).border
              }
            ]}
            placeholder="Enter location"
            placeholderTextColor={getColors(colorScheme).text}
            value={formData.location}
            onChangeText={(value) => handleInputChange('location', value)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
            Organization
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: getColors(colorScheme).background,
                color: getColors(colorScheme).text,
                borderColor: getColors(colorScheme).border
              }
            ]}
            placeholder="Enter organization"
            placeholderTextColor={getColors(colorScheme).text}
            value={formData.organization}
            onChangeText={(value) => handleInputChange('organization', value)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
            Contact
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: getColors(colorScheme).background,
                color: getColors(colorScheme).text,
                borderColor: getColors(colorScheme).border
              }
            ]}
            placeholder="Enter contact number"
            placeholderTextColor={getColors(colorScheme).text}
            value={formData.contact}
            onChangeText={(value) => handleInputChange('contact', value)}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
            Email
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: getColors(colorScheme).background,
                color: getColors(colorScheme).text,
                borderColor: getColors(colorScheme).border,
                opacity: 0.6
              }
            ]}
            placeholder="Enter email"
            placeholderTextColor={getColors(colorScheme).text}
            value={formData.email}
            editable={false}
          />
          <Text style={[styles.helpText, { color: getColors(colorScheme).text }]}>
            Email cannot be changed
          </Text>
        </View>
      </View>
    </View>
  );

  const renderCricketStatsSection = () => (
    <View style={[styles.section, { backgroundColor: getColors(colorScheme).card }]}>
      <View style={styles.statsHeader}>
        <Text style={[styles.sectionTitle, { color: getColors(colorScheme).text }]}>
          Cricket Statistics
        </Text>
        <Text style={[styles.sectionSubtitle, { color: getColors(colorScheme).text }]}>
          Update your cricket performance data
        </Text>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            { 
              backgroundColor: activeStatsTab === 'batting' ? '#F97316' : 'transparent',
              borderColor: activeStatsTab === 'batting' ? '#F97316' : getColors(colorScheme).border
            }
          ]}
          onPress={() => setActiveStatsTab('batting')}
        >
          <Text style={styles.tabIcon}>🏏</Text>
          <Text style={[
            styles.tabText,
            { color: activeStatsTab === 'batting' ? 'white' : getColors(colorScheme).text }
          ]}>
            Batting
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            { 
              backgroundColor: activeStatsTab === 'bowling' ? '#3B82F6' : 'transparent',
              borderColor: activeStatsTab === 'bowling' ? '#3B82F6' : getColors(colorScheme).border
            }
          ]}
          onPress={() => setActiveStatsTab('bowling')}
        >
          <Text style={styles.tabIcon}>🎯</Text>
          <Text style={[
            styles.tabText,
            { color: activeStatsTab === 'bowling' ? 'white' : getColors(colorScheme).text }
          ]}>
            Bowling
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            { 
              backgroundColor: activeStatsTab === 'fielding' ? '#10B981' : 'transparent',
              borderColor: activeStatsTab === 'fielding' ? '#10B981' : getColors(colorScheme).border
            }
          ]}
          onPress={() => setActiveStatsTab('fielding')}
        >
          <Text style={styles.tabIcon}>🧤</Text>
          <Text style={[
            styles.tabText,
            { color: activeStatsTab === 'fielding' ? 'white' : getColors(colorScheme).text }
          ]}>
            Fielding
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        {activeStatsTab === 'batting' && (
          <View style={styles.statsContent}>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Text style={styles.statIcon}>🏏</Text>
                  <Text style={[styles.statLabel, { color: getColors(colorScheme).text }]}>Total Runs</Text>
                </View>
                <View style={styles.statInputContainer}>
                  <TextInput
                    style={[
                      styles.statInput, 
                      { 
                        backgroundColor: getColors(colorScheme).background, 
                        color: getColors(colorScheme).text, 
                        borderColor: errors['battingStats.totalRuns'] ? getColors(colorScheme).error : getColors(colorScheme).border 
                      }
                    ]}
                    value={formData.battingStats.totalRuns.toString()}
                    onChangeText={(value) => handleNestedChange('battingStats', 'totalRuns', parseInt(value) || 0)}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                  {errors['battingStats.totalRuns'] && (
                    <Text style={[styles.statErrorText, { color: getColors(colorScheme).error }]}>
                      {errors['battingStats.totalRuns']}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Text style={styles.statIcon}>📊</Text>
                  <Text style={[styles.statLabel, { color: getColors(colorScheme).text }]}>Matches</Text>
                </View>
                <View style={styles.statInputContainer}>
                  <TextInput
                    style={[styles.statInput, { backgroundColor: getColors(colorScheme).background, color: getColors(colorScheme).text, borderColor: getColors(colorScheme).border }]}
                    value={formData.battingStats.matches.toString()}
                    onChangeText={(value) => handleNestedChange('battingStats', 'matches', parseInt(value) || 0)}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                </View>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Text style={styles.statIcon}>💯</Text>
                  <Text style={[styles.statLabel, { color: getColors(colorScheme).text }]}>Centuries</Text>
                </View>
                <View style={styles.statInputContainer}>
                  <TextInput
                    style={[styles.statInput, { backgroundColor: getColors(colorScheme).background, color: getColors(colorScheme).text, borderColor: getColors(colorScheme).border }]}
                    value={formData.battingStats.centuries.toString()}
                    onChangeText={(value) => handleNestedChange('battingStats', 'centuries', parseInt(value) || 0)}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                </View>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Text style={styles.statIcon}>50</Text>
                  <Text style={[styles.statLabel, { color: getColors(colorScheme).text }]}>Half Centuries</Text>
                </View>
                <View style={styles.statInputContainer}>
                  <TextInput
                    style={[styles.statInput, { backgroundColor: getColors(colorScheme).background, color: getColors(colorScheme).text, borderColor: getColors(colorScheme).border }]}
                    value={formData.battingStats.halfCenturies.toString()}
                    onChangeText={(value) => handleNestedChange('battingStats', 'halfCenturies', parseInt(value) || 0)}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                </View>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Text style={styles.statIcon}>📈</Text>
                  <Text style={[styles.statLabel, { color: getColors(colorScheme).text }]}>Average</Text>
                </View>
                <View style={styles.statInputContainer}>
                  <TextInput
                    style={[styles.statInput, { backgroundColor: getColors(colorScheme).background, color: getColors(colorScheme).text, borderColor: getColors(colorScheme).border }]}
                    value={formData.battingStats.average.toString()}
                    onChangeText={(value) => handleNestedChange('battingStats', 'average', parseFloat(value) || 0)}
                    keyboardType="numeric"
                    placeholder="0.0"
                  />
                </View>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Text style={styles.statIcon}>⭐</Text>
                  <Text style={[styles.statLabel, { color: getColors(colorScheme).text }]}>Highest Score</Text>
                </View>
                <View style={styles.statInputContainer}>
                  <TextInput
                    style={[styles.statInput, { backgroundColor: getColors(colorScheme).background, color: getColors(colorScheme).text, borderColor: getColors(colorScheme).border }]}
                    value={formData.battingStats.highest.toString()}
                    onChangeText={(value) => handleNestedChange('battingStats', 'highest', parseInt(value) || 0)}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        {activeStatsTab === 'bowling' && (
          <View style={styles.statsContent}>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Text style={styles.statIcon}>📊</Text>
                  <Text style={[styles.statLabel, { color: getColors(colorScheme).text }]}>Matches</Text>
                </View>
                <View style={styles.statInputContainer}>
                  <TextInput
                    style={[styles.statInput, { backgroundColor: getColors(colorScheme).background, color: getColors(colorScheme).text, borderColor: getColors(colorScheme).border }]}
                    value={formData.bowlingStats.matches.toString()}
                    onChangeText={(value) => handleNestedChange('bowlingStats', 'matches', parseInt(value) || 0)}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                </View>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Text style={styles.statIcon}>🎯</Text>
                  <Text style={[styles.statLabel, { color: getColors(colorScheme).text }]}>Overs</Text>
                </View>
                <View style={styles.statInputContainer}>
                  <TextInput
                    style={[styles.statInput, { backgroundColor: getColors(colorScheme).background, color: getColors(colorScheme).text, borderColor: getColors(colorScheme).border }]}
                    value={formData.bowlingStats.overs.toString()}
                    onChangeText={(value) => handleNestedChange('bowlingStats', 'overs', parseFloat(value) || 0)}
                    keyboardType="numeric"
                    placeholder="0.0"
                  />
                </View>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Text style={styles.statIcon}>🏆</Text>
                  <Text style={[styles.statLabel, { color: getColors(colorScheme).text }]}>Wickets</Text>
                </View>
                <View style={styles.statInputContainer}>
                  <TextInput
                    style={[styles.statInput, { backgroundColor: getColors(colorScheme).background, color: getColors(colorScheme).text, borderColor: getColors(colorScheme).border }]}
                    value={formData.bowlingStats.wickets.toString()}
                    onChangeText={(value) => handleNestedChange('bowlingStats', 'wickets', parseInt(value) || 0)}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                </View>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Text style={styles.statIcon}>🎩</Text>
                  <Text style={[styles.statLabel, { color: getColors(colorScheme).text }]}>Hat Tricks</Text>
                </View>
                <View style={styles.statInputContainer}>
                  <TextInput
                    style={[styles.statInput, { backgroundColor: getColors(colorScheme).background, color: getColors(colorScheme).text, borderColor: getColors(colorScheme).border }]}
                    value={formData.bowlingStats.hatTricks.toString()}
                    onChangeText={(value) => handleNestedChange('bowlingStats', 'hatTricks', parseInt(value) || 0)}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                </View>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Text style={styles.statIcon}>🏅</Text>
                  <Text style={[styles.statLabel, { color: getColors(colorScheme).text }]}>Best Figures</Text>
                </View>
                <View style={styles.statInputContainer}>
                  <TextInput
                    style={[styles.statInput, { backgroundColor: getColors(colorScheme).background, color: getColors(colorScheme).text, borderColor: getColors(colorScheme).border }]}
                    value={formData.bowlingStats.best}
                    onChangeText={(value) => handleNestedChange('bowlingStats', 'best', value)}
                    placeholder="0/0"
                  />
                </View>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Text style={styles.statIcon}>📈</Text>
                  <Text style={[styles.statLabel, { color: getColors(colorScheme).text }]}>Average</Text>
                </View>
                <View style={styles.statInputContainer}>
                  <TextInput
                    style={[styles.statInput, { backgroundColor: getColors(colorScheme).background, color: getColors(colorScheme).text, borderColor: getColors(colorScheme).border }]}
                    value={formData.bowlingStats.average.toString()}
                    onChangeText={(value) => handleNestedChange('bowlingStats', 'average', parseFloat(value) || 0)}
                    keyboardType="numeric"
                    placeholder="0.0"
                  />
                </View>
              </View>
            </View>
          </View>
        )}

        {activeStatsTab === 'fielding' && (
          <View style={styles.statsContent}>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Text style={styles.statIcon}>📊</Text>
                  <Text style={[styles.statLabel, { color: getColors(colorScheme).text }]}>Matches</Text>
                </View>
                <View style={styles.statInputContainer}>
                  <TextInput
                    style={[styles.statInput, { backgroundColor: getColors(colorScheme).background, color: getColors(colorScheme).text, borderColor: getColors(colorScheme).border }]}
                    value={formData.fieldingStats.matches.toString()}
                    onChangeText={(value) => handleNestedChange('fieldingStats', 'matches', parseInt(value) || 0)}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                </View>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Text style={styles.statIcon}>🤲</Text>
                  <Text style={[styles.statLabel, { color: getColors(colorScheme).text }]}>Catches</Text>
                </View>
                <View style={styles.statInputContainer}>
                  <TextInput
                    style={[styles.statInput, { backgroundColor: getColors(colorScheme).background, color: getColors(colorScheme).text, borderColor: getColors(colorScheme).border }]}
                    value={formData.fieldingStats.catches.toString()}
                    onChangeText={(value) => handleNestedChange('fieldingStats', 'catches', parseInt(value) || 0)}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                </View>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Text style={styles.statIcon}>🧤</Text>
                  <Text style={[styles.statLabel, { color: getColors(colorScheme).text }]}>Stumpings</Text>
                </View>
                <View style={styles.statInputContainer}>
                  <TextInput
                    style={[styles.statInput, { backgroundColor: getColors(colorScheme).background, color: getColors(colorScheme).text, borderColor: getColors(colorScheme).border }]}
                    value={formData.fieldingStats.stumpings.toString()}
                    onChangeText={(value) => handleNestedChange('fieldingStats', 'stumpings', parseInt(value) || 0)}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                </View>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Text style={styles.statIcon}>🏃</Text>
                  <Text style={[styles.statLabel, { color: getColors(colorScheme).text }]}>Run Outs</Text>
                </View>
                <View style={styles.statInputContainer}>
                  <TextInput
                    style={[styles.statInput, { backgroundColor: getColors(colorScheme).background, color: getColors(colorScheme).text, borderColor: getColors(colorScheme).border }]}
                    value={formData.fieldingStats.runOuts.toString()}
                    onChangeText={(value) => handleNestedChange('fieldingStats', 'runOuts', parseInt(value) || 0)}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { 
      backgroundColor: getColors(colorScheme).background,
      paddingTop: StatusBar.currentHeight || 0
    }]}>
      {renderHeader()}
      <ScrollView 
        style={styles.scrollViewContent}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderProfilePhotoSection()}
        {renderBasicInfoSection()}
        {renderCricketStatsSection()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  customHeader: {
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  photoWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  cameraIcon: {
    fontSize: 16,
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeIcon: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  formContainer: {
    gap: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  selectContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  selectText: {
    fontSize: 16,
    fontWeight: '500',
  },
  helpText: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  statsHeader: {
    marginBottom: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  tabIcon: {
    fontSize: 16,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statsContainer: {
    marginTop: 8,
  },
  statsContent: {
    marginTop: 8,
  },
  statsGrid: {
    gap: 12,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  statIcon: {
    fontSize: 18,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  statInputContainer: {
    alignItems: 'flex-end',
    minWidth: 100,
  },
  statInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
    minWidth: 80,
    maxWidth: 120,
  },
  characterCounter: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  characterCount: {
    fontSize: 12,
    opacity: 0.7,
  },
  statErrorText: {
    fontSize: 10,
    marginTop: 2,
    textAlign: 'right',
    flex: 1,
  },
});
