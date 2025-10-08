import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator, Alert,
    Dimensions, SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity, useColorScheme, View
} from 'react-native';

interface JobDetails {
  title: string;
  company: string;
  workplaceType: string;
  location: string;
  jobType: string;
  salary?: string;
  experience?: string;
  requirements?: string;
}

export default function AIWriterScreen() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const colorScheme = useColorScheme();
  const { width } = Dimensions.get('window');

  // Mock job details - in real app, this would come from navigation params
  const jobDetails: JobDetails = {
    title: 'Senior Software Engineer',
    company: 'TechCorp Inc.',
    workplaceType: 'hybrid',
    location: 'San Francisco, CA',
    jobType: 'full-time',
    salary: '$120,000 - $150,000',
    experience: '5+ years',
    requirements: 'React, Node.js, TypeScript'
  };

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockGeneratedContent = `# ${jobDetails.title} at ${jobDetails.company}

## About the Role
We are seeking a talented ${jobDetails.title} to join our dynamic team at ${jobDetails.company}. This is a ${jobDetails.jobType} position with a ${jobDetails.workplaceType} work arrangement based in ${jobDetails.location}.

## Key Responsibilities
• Design and develop scalable software solutions
• Collaborate with cross-functional teams to deliver high-quality products
• Mentor junior developers and contribute to code reviews
• Participate in architectural decisions and technical planning
• Ensure code quality through testing and best practices

## Requirements
• ${jobDetails.experience} of experience in software development
• Strong proficiency in ${jobDetails.requirements}
• Experience with modern development tools and practices
• Excellent problem-solving and communication skills
• Bachelor's degree in Computer Science or related field

## What We Offer
• Competitive salary: ${jobDetails.salary}
• Comprehensive health benefits
• Flexible work arrangements
• Professional development opportunities
• Collaborative and inclusive work environment

## How to Apply
If you're passionate about technology and want to make an impact, we'd love to hear from you. Please submit your resume and cover letter through our application portal.

${jobDetails.company} is an equal opportunity employer committed to diversity and inclusion.`;

      setGeneratedContent(mockGeneratedContent);
      setEditedContent(mockGeneratedContent);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditContent = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setGeneratedContent(editedContent);
    setIsEditing(false);
    Alert.alert('Success', 'Content updated successfully!');
  };

  const handleCancelEdit = () => {
    setEditedContent(generatedContent);
    setIsEditing(false);
  };

  const handleUseContent = () => {
    Alert.alert(
      'Use Generated Content',
      'This content will be used for your job posting. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Use Content', onPress: () => router.replace('/create-job') }
      ]
    );
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
          AI Job Writer
        </Text>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderJobDetails = () => (
    <View style={[styles.jobDetailsCard, { backgroundColor: getColors(colorScheme).card }]}>
      <Text style={[styles.jobDetailsTitle, { color: getColors(colorScheme).text }]}>
        Job Details
      </Text>
      <View style={styles.jobDetailsGrid}>
        <View style={styles.jobDetailItem}>
          <Text style={[styles.jobDetailLabel, { color: getColors(colorScheme).text }]}>Title</Text>
          <Text style={[styles.jobDetailValue, { color: getColors(colorScheme).text }]}>{jobDetails.title}</Text>
        </View>
        <View style={styles.jobDetailItem}>
          <Text style={[styles.jobDetailLabel, { color: getColors(colorScheme).text }]}>Company</Text>
          <Text style={[styles.jobDetailValue, { color: getColors(colorScheme).text }]}>{jobDetails.company}</Text>
        </View>
        <View style={styles.jobDetailItem}>
          <Text style={[styles.jobDetailLabel, { color: getColors(colorScheme).text }]}>Type</Text>
          <Text style={[styles.jobDetailValue, { color: getColors(colorScheme).text }]}>{jobDetails.workplaceType.toUpperCase()}</Text>
        </View>
        <View style={styles.jobDetailItem}>
          <Text style={[styles.jobDetailLabel, { color: getColors(colorScheme).text }]}>Location</Text>
          <Text style={[styles.jobDetailValue, { color: getColors(colorScheme).text }]}>{jobDetails.location}</Text>
        </View>
      </View>
    </View>
  );

  const renderGenerateButton = () => (
    <View style={styles.generateSection}>
      <TouchableOpacity 
        style={[
          styles.generateButton,
          { backgroundColor: getColors(colorScheme).primary },
          isGenerating && styles.disabledButton
        ]}
        onPress={handleGenerateContent}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <>
            <Text style={styles.generateButtonIcon}>🤖</Text>
            <Text style={styles.generateButtonText}>
              {isGenerating ? 'Generating...' : 'Generate with AI'}
            </Text>
          </>
        )}
      </TouchableOpacity>
      
      <View style={[styles.tipBox, { backgroundColor: '#EFF6FF', borderColor: '#3B82F6' }]}>
        <Text style={[styles.tipText, { color: '#1E40AF' }]}>
          💡 AI will create a professional job description based on your job details
        </Text>
      </View>
    </View>
  );

  const renderGeneratedContent = () => (
    <View style={[styles.contentSection, { backgroundColor: getColors(colorScheme).card }]}>
      <View style={styles.contentHeader}>
        <Text style={[styles.contentTitle, { color: getColors(colorScheme).text }]}>
          Generated Content
        </Text>
        <View style={styles.contentActions}>
          <TouchableOpacity 
            style={[styles.actionButton, { borderColor: getColors(colorScheme).border }]}
            onPress={handleEditContent}
          >
            <Text style={[styles.actionButtonText, { color: getColors(colorScheme).text }]}>
              ✏️ Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: getColors(colorScheme).primary }]}
            onPress={handleUseContent}
          >
            <Text style={styles.useButtonText}>✓ Use</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isEditing ? (
        <View style={styles.editingContainer}>
          <TextInput
            style={[
              styles.editingInput,
              { 
                backgroundColor: getColors(colorScheme).background,
                color: getColors(colorScheme).text,
                borderColor: getColors(colorScheme).border
              }
            ]}
            value={editedContent}
            onChangeText={setEditedContent}
            multiline
            numberOfLines={20}
            textAlignVertical="top"
          />
          <View style={styles.editingActions}>
            <TouchableOpacity 
              style={[styles.editingButton, styles.cancelEditButton, { borderColor: getColors(colorScheme).border }]}
              onPress={handleCancelEdit}
            >
              <Text style={[styles.editingButtonText, { color: getColors(colorScheme).text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.editingButton, styles.saveEditButton, { backgroundColor: getColors(colorScheme).primary }]}
              onPress={handleSaveEdit}
            >
              <Text style={styles.saveEditButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView style={styles.contentPreview} showsVerticalScrollIndicator={false}>
          <Text style={[styles.contentText, { color: getColors(colorScheme).text }]}>
            {generatedContent}
          </Text>
        </ScrollView>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: getColors(colorScheme).background }]}>
      {renderHeader()}
      <ScrollView 
        style={styles.scrollViewContent}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderJobDetails()}
        {renderGenerateButton()}
        {generatedContent ? renderGeneratedContent() : null}
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
  jobDetailsCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  jobDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  jobDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  jobDetailItem: {
    width: '48%',
  },
  jobDetailLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  jobDetailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  generateSection: {
    marginBottom: 20,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  generateButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  tipBox: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
  },
  tipText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  contentSection: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  useButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  contentPreview: {
    maxHeight: 300,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  editingContainer: {
    marginTop: 8,
  },
  editingInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 200,
    textAlignVertical: 'top',
  },
  editingActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
  },
  editingButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  cancelEditButton: {
    backgroundColor: 'transparent',
  },
  saveEditButton: {
    // Background color set dynamically
  },
  editingButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveEditButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
