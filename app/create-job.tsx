import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator, Alert,
    Dimensions, SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity, useColorScheme, View
} from 'react-native';

interface CreateJobFormData {
  // Step 1: Job Details
  title: string;
  company: string;
  workplaceType: 'on-site' | 'remote' | 'hybrid';
  location: string;
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship';
  
  // Step 2: Requirements & Benefits
  salary: string;
  experience: string;
  skills: string[];
  benefits: string[];
  requirements: string;
  
  // Step 3: Description & Review
  description: string;
  responsibilities: string;
  qualifications: string;
  
  // Additional fields
  isRemote: boolean;
  isUrgent: boolean;
  applicationDeadline: string;
  contactEmail: string;
}

export default function CreateJobScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const colorScheme = useColorScheme();
  const { width } = Dimensions.get('window');
  
  // Mock user data following existing patterns
  const user = {
    id: '1',
    fullName: 'Demo User',
    username: 'demo_user',
    email: 'demo@example.com',
    avatar: 'https://via.placeholder.com/40',
    verified: true
  };

  // Form data state following existing patterns
  const [formData, setFormData] = useState<CreateJobFormData>({
    // Step 1: Job Details
    title: '',
    company: '',
    workplaceType: 'hybrid',
    location: '',
    jobType: 'full-time',
    
    // Step 2: Requirements & Benefits
    salary: '',
    experience: '',
    skills: [],
    benefits: [],
    requirements: '',
    
    // Step 3: Description & Review
    description: '',
    responsibilities: '',
    qualifications: '',
    
    // Additional fields
    isRemote: false,
    isUrgent: false,
    applicationDeadline: '',
    contactEmail: ''
  });

  const totalSteps = 3;

  // Event handlers following existing patterns
  const handleInputChange = (field: keyof CreateJobFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Job Creation',
      'Are you sure you want to cancel? All progress will be lost.',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Cancel', style: 'destructive', onPress: () => router.back() }
      ]
    );
  };

  const handleCreateJob = async () => {
    setIsCreating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Job Posted!',
        'Your job posting has been created successfully.',
        [
          { text: 'OK', onPress: () => router.replace('/home') }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create job posting. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const renderHeader = () => (
    <View style={[styles.customHeader, { backgroundColor: getColors(colorScheme).background }]}>
      <View style={styles.headerContent}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: getColors(colorScheme).text }]}>
          Post a Job
        </Text>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={handleCancel}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProgressBar = () => (
    <View style={[styles.progressBarContainer, { backgroundColor: getColors(colorScheme).card }]}>
      <View style={styles.progressBarWrapper}>
        <Text style={[styles.progressText, { color: getColors(colorScheme).text }]}>
          Step {currentStep} of {totalSteps}
        </Text>
        <View style={[styles.progressBar, { backgroundColor: getColors(colorScheme).border }]}>
          <View style={[
            styles.progressFill, 
            { 
              width: `${(currentStep / totalSteps) * 100}%`,
              backgroundColor: '#10B981'
            }
          ]} />
        </View>
      </View>
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderJobDetailsStep();
      case 2:
        return renderRequirementsStep();
      case 3:
        return renderDescriptionStep();
      default:
        return renderJobDetailsStep();
    }
  };

  const renderJobDetailsStep = () => (
    <View style={[styles.stepContent, { backgroundColor: getColors(colorScheme).card }]}>
      <View style={styles.stepHeader}>
        <View style={[styles.stepIcon, { backgroundColor: '#3B82F6' }]}>
          <Text style={styles.stepIconText}>💼</Text>
        </View>
        <View style={styles.stepHeaderText}>
          <Text style={[styles.stepTitle, { color: getColors(colorScheme).text }]}>
            Job Details
          </Text>
          <Text style={[styles.stepDescription, { color: getColors(colorScheme).text }]}>
            Tell us about the position
          </Text>
        </View>
      </View>

      <View style={[styles.tipBox, { backgroundColor: '#EFF6FF', borderColor: '#3B82F6' }]}>
        <Text style={[styles.tipText, { color: '#1E40AF' }]}>
          💡 Tip: Be specific about the role to attract the right candidates
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
            Job Title *
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: getColors(colorScheme).background,
                color: getColors(colorScheme).text,
                borderColor: errors.title ? getColors(colorScheme).error : getColors(colorScheme).border
              }
            ]}
            placeholder="e.g. Senior Software Engineer"
            placeholderTextColor={getColors(colorScheme).text}
            value={formData.title}
            onChangeText={(value) => handleInputChange('title', value)}
          />
          {errors.title && <Text style={[styles.errorText, { color: getColors(colorScheme).error }]}>{errors.title}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
            Company Name *
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: getColors(colorScheme).background,
                color: getColors(colorScheme).text,
                borderColor: errors.company ? getColors(colorScheme).error : getColors(colorScheme).border
              }
            ]}
            placeholder="Enter company name"
            placeholderTextColor={getColors(colorScheme).text}
            value={formData.company}
            onChangeText={(value) => handleInputChange('company', value)}
          />
          {errors.company && <Text style={[styles.errorText, { color: getColors(colorScheme).error }]}>{errors.company}</Text>}
        </View>

        <View style={styles.rowContainer}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
              Work Type *
            </Text>
            <View style={styles.selectContainer}>
              <Text style={[styles.selectText, { color: getColors(colorScheme).text }]}>
                {formData.workplaceType.toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
              Job Type *
            </Text>
            <View style={styles.selectContainer}>
              <Text style={[styles.selectText, { color: getColors(colorScheme).text }]}>
                {formData.jobType.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
            Location *
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: getColors(colorScheme).background,
                color: getColors(colorScheme).text,
                borderColor: errors.location ? getColors(colorScheme).error : getColors(colorScheme).border
              }
            ]}
            placeholder="Enter location"
            placeholderTextColor={getColors(colorScheme).text}
            value={formData.location}
            onChangeText={(value) => handleInputChange('location', value)}
          />
          {errors.location && <Text style={[styles.errorText, { color: getColors(colorScheme).error }]}>{errors.location}</Text>}
        </View>
      </View>
    </View>
  );

  const renderRequirementsStep = () => (
    <View style={[styles.stepContent, { backgroundColor: getColors(colorScheme).card }]}>
      <View style={styles.stepHeader}>
        <View style={[styles.stepIcon, { backgroundColor: '#10B981' }]}>
          <Text style={styles.stepIconText}>📋</Text>
        </View>
        <View style={styles.stepHeaderText}>
          <Text style={[styles.stepTitle, { color: getColors(colorScheme).text }]}>
            Requirements & Benefits
          </Text>
          <Text style={[styles.stepDescription, { color: getColors(colorScheme).text }]}>
            What are you looking for?
          </Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
            Salary Range
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
            placeholder="e.g. $80,000 - $120,000"
            placeholderTextColor={getColors(colorScheme).text}
            value={formData.salary}
            onChangeText={(value) => handleInputChange('salary', value)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
            Experience Required
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
            placeholder="e.g. 3-5 years"
            placeholderTextColor={getColors(colorScheme).text}
            value={formData.experience}
            onChangeText={(value) => handleInputChange('experience', value)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
            Key Requirements
          </Text>
          <TextInput
            style={[
              styles.textArea,
              { 
                backgroundColor: getColors(colorScheme).background,
                color: getColors(colorScheme).text,
                borderColor: getColors(colorScheme).border
              }
            ]}
            placeholder="List the key requirements for this role..."
            placeholderTextColor={getColors(colorScheme).text}
            value={formData.requirements}
            onChangeText={(value) => handleInputChange('requirements', value)}
            multiline
            numberOfLines={4}
          />
        </View>
      </View>
    </View>
  );

  const renderDescriptionStep = () => (
    <View style={[styles.stepContent, { backgroundColor: getColors(colorScheme).card }]}>
      <View style={styles.stepHeader}>
        <View style={[styles.stepIcon, { backgroundColor: '#F59E0B' }]}>
          <Text style={styles.stepIconText}>📝</Text>
        </View>
        <View style={styles.stepHeaderText}>
          <Text style={[styles.stepTitle, { color: getColors(colorScheme).text }]}>
            Job Description
          </Text>
          <Text style={[styles.stepDescription, { color: getColors(colorScheme).text }]}>
            Describe the role and responsibilities
          </Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
            Job Description *
          </Text>
          <TextInput
            style={[
              styles.textArea,
              { 
                backgroundColor: getColors(colorScheme).background,
                color: getColors(colorScheme).text,
                borderColor: errors.description ? getColors(colorScheme).error : getColors(colorScheme).border
              }
            ]}
            placeholder="Describe the role, responsibilities, and what makes this opportunity special..."
            placeholderTextColor={getColors(colorScheme).text}
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            multiline
            numberOfLines={6}
          />
          {errors.description && <Text style={[styles.errorText, { color: getColors(colorScheme).error }]}>{errors.description}</Text>}
        </View>

        <View style={styles.jobSummary}>
          <Text style={[styles.summaryTitle, { color: getColors(colorScheme).text }]}>
            Job Summary
          </Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: getColors(colorScheme).text }]}>Title</Text>
              <Text style={[styles.summaryValue, { color: getColors(colorScheme).text }]}>{formData.title || 'Not set'}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: getColors(colorScheme).text }]}>Company</Text>
              <Text style={[styles.summaryValue, { color: getColors(colorScheme).text }]}>{formData.company || 'Not set'}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: getColors(colorScheme).text }]}>Type</Text>
              <Text style={[styles.summaryValue, { color: getColors(colorScheme).text }]}>{formData.workplaceType.toUpperCase()}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: getColors(colorScheme).text }]}>Location</Text>
              <Text style={[styles.summaryValue, { color: getColors(colorScheme).text }]}>{formData.location || 'Not set'}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderNavigationFooter = () => (
    <View style={[styles.navigationFooter, { backgroundColor: getColors(colorScheme).background, borderTopColor: getColors(colorScheme).border }]}>
      <View style={styles.navigationButtons}>
        <TouchableOpacity 
          style={[styles.navButton, styles.cancelButton, { 
            borderColor: getColors(colorScheme).border,
            backgroundColor: getColors(colorScheme).card
          }]}
          onPress={currentStep === 1 ? handleCancel : handlePrevious}
        >
          <Text style={[styles.navButtonText, { color: getColors(colorScheme).text }]}>
            {currentStep === 1 ? 'Cancel' : '← Previous'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.navButton, 
            styles.nextButton, 
            { backgroundColor: '#10B981' },
            isCreating && styles.disabledButton
          ]}
          onPress={currentStep === totalSteps ? handleCreateJob : handleNext}
          disabled={isCreating}
        >
          {isCreating ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.nextButtonText}>
              {currentStep === totalSteps ? 'Post Job ✓' : 'Next →'}
            </Text>
          )}
        </TouchableOpacity>
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
        {renderProgressBar()}
        {renderStepContent()}
        {renderNavigationFooter()}
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
  progressBarContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 8,
  },
  progressBarWrapper: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 400,
  },
  progressText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
    color: '#374151',
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
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  stepContent: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stepIconText: {
    fontSize: 20,
  },
  stepHeaderText: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  stepDescription: {
    fontSize: 16,
    opacity: 0.7,
    lineHeight: 22,
  },
  tipBox: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  tipText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  formContainer: {
    gap: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  textArea: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#F9FAFB',
  },
  selectContainer: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  selectText: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 14,
    marginTop: 6,
    fontWeight: '500',
  },
  jobSummary: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryItem: {
    width: '48%',
  },
  summaryLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  navigationFooter: {
    borderTopWidth: 1,
    padding: 12,
    paddingBottom: 16,
    alignSelf: 'center',
    width: '90%',
    maxWidth: 400,
    marginTop: 20,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  nextButton: {
    // Background color set dynamically
  },
  disabledButton: {
    opacity: 0.6,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});
