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

interface Template {
  id: string;
  name: string;
  content: string;
  category: string;
}

export default function ManualWriterScreen() {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const colorScheme = useColorScheme();
  const { width } = Dimensions.get('window');

  // Job description templates
  const templates: Template[] = [
    {
      id: '1',
      name: 'Software Engineer',
      category: 'Technology',
      content: `# Software Engineer

## About the Role
We are looking for a talented Software Engineer to join our development team. You will be responsible for designing, developing, and maintaining high-quality software solutions.

## Key Responsibilities
• Design and develop scalable software applications
• Collaborate with cross-functional teams
• Write clean, maintainable code
• Participate in code reviews
• Debug and troubleshoot issues

## Requirements
• Bachelor's degree in Computer Science or related field
• 3+ years of software development experience
• Proficiency in modern programming languages
• Strong problem-solving skills
• Experience with version control systems

## What We Offer
• Competitive salary and benefits
• Flexible work arrangements
• Professional development opportunities
• Collaborative work environment
• Health and wellness programs`
    },
    {
      id: '2',
      name: 'Marketing Manager',
      category: 'Marketing',
      content: `# Marketing Manager

## About the Role
We are seeking a creative and strategic Marketing Manager to lead our marketing initiatives and drive brand awareness.

## Key Responsibilities
• Develop and execute marketing campaigns
• Manage social media presence
• Analyze market trends and competitor activity
• Coordinate with sales and product teams
• Track and report on campaign performance

## Requirements
• Bachelor's degree in Marketing or related field
• 5+ years of marketing experience
• Strong analytical and creative skills
• Experience with digital marketing tools
• Excellent communication skills

## What We Offer
• Competitive compensation package
• Health and dental benefits
• Professional development budget
• Flexible work schedule
• Team building activities`
    },
    {
      id: '3',
      name: 'Sales Representative',
      category: 'Sales',
      content: `# Sales Representative

## About the Role
Join our sales team as a Sales Representative and help us grow our business by building relationships with new and existing clients.

## Key Responsibilities
• Identify and pursue new business opportunities
• Build and maintain client relationships
• Meet and exceed sales targets
• Prepare sales presentations and proposals
• Collaborate with internal teams

## Requirements
• High school diploma or equivalent
• 2+ years of sales experience
• Strong interpersonal and communication skills
• Self-motivated and results-driven
• Proficiency in CRM systems

## What We Offer
• Base salary plus commission
• Comprehensive training program
• Health insurance coverage
• Performance bonuses
• Career advancement opportunities`
    }
  ];

  const handleSaveContent = async () => {
    setIsSaving(true);
    
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'Content saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save content. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUseContent = () => {
    Alert.alert(
      'Use Content',
      'This content will be used for your job posting. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Use Content', onPress: () => router.replace('/create-job') }
      ]
    );
  };

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setContent(template.content);
    setShowTemplates(false);
  };

  const handleClearContent = () => {
    Alert.alert(
      'Clear Content',
      'Are you sure you want to clear all content?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => setContent('') }
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
          Manual Writer
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

  const renderToolbar = () => (
    <View style={[styles.toolbar, { backgroundColor: getColors(colorScheme).card, borderColor: getColors(colorScheme).border }]}>
      <TouchableOpacity 
        style={[styles.toolbarButton, { borderColor: getColors(colorScheme).border }]}
        onPress={() => setShowTemplates(!showTemplates)}
      >
        <Text style={[styles.toolbarButtonText, { color: getColors(colorScheme).text }]}>
          📋 Templates
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.toolbarButton, { borderColor: getColors(colorScheme).border }]}
        onPress={handleClearContent}
      >
        <Text style={[styles.toolbarButtonText, { color: getColors(colorScheme).text }]}>
          🗑️ Clear
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.toolbarButton, { borderColor: getColors(colorScheme).border }]}
        onPress={handleSaveContent}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator size="small" color={getColors(colorScheme).primary} />
        ) : (
          <Text style={[styles.toolbarButtonText, { color: getColors(colorScheme).text }]}>
            💾 Save
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderTemplates = () => (
    <View style={[styles.templatesContainer, { backgroundColor: getColors(colorScheme).card, borderColor: getColors(colorScheme).border }]}>
      <Text style={[styles.templatesTitle, { color: getColors(colorScheme).text }]}>
        Choose a Template
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templatesScroll}>
        {templates.map((template) => (
          <TouchableOpacity
            key={template.id}
            style={[
              styles.templateCard,
              { 
                backgroundColor: getColors(colorScheme).background,
                borderColor: selectedTemplate?.id === template.id ? getColors(colorScheme).primary : getColors(colorScheme).border
              }
            ]}
            onPress={() => handleSelectTemplate(template)}
          >
            <Text style={[styles.templateName, { color: getColors(colorScheme).text }]}>
              {template.name}
            </Text>
            <Text style={[styles.templateCategory, { color: getColors(colorScheme).text }]}>
              {template.category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderEditor = () => (
    <View style={[styles.editorContainer, { backgroundColor: getColors(colorScheme).card }]}>
      <View style={styles.editorHeader}>
        <Text style={[styles.editorTitle, { color: getColors(colorScheme).text }]}>
          Job Description
        </Text>
        <Text style={[styles.characterCount, { color: getColors(colorScheme).text }]}>
          {content.length} characters
        </Text>
      </View>
      
      <TextInput
        style={[
          styles.editorInput,
          { 
            backgroundColor: getColors(colorScheme).background,
            color: getColors(colorScheme).text,
            borderColor: getColors(colorScheme).border
          }
        ]}
        value={content}
        onChangeText={setContent}
        placeholder="Start writing your job description here..."
        placeholderTextColor={getColors(colorScheme).text}
        multiline
        numberOfLines={20}
        textAlignVertical="top"
      />
    </View>
  );

  const renderActions = () => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity 
        style={[styles.actionButton, styles.cancelButton, { borderColor: getColors(colorScheme).border }]}
        onPress={() => router.back()}
      >
        <Text style={[styles.actionButtonText, { color: getColors(colorScheme).text }]}>
          Cancel
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.actionButton, styles.useButton, { backgroundColor: getColors(colorScheme).primary }]}
        onPress={handleUseContent}
        disabled={!content.trim()}
      >
        <Text style={styles.useButtonText}>
          Use Content
        </Text>
      </TouchableOpacity>
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
        {renderToolbar()}
        {showTemplates && renderTemplates()}
        {renderEditor()}
        {renderActions()}
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
  toolbar: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    gap: 8,
  },
  toolbarButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
  toolbarButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  templatesContainer: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  templatesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  templatesScroll: {
    flexDirection: 'row',
  },
  templateCard: {
    width: 120,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  templateName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  templateCategory: {
    fontSize: 12,
    opacity: 0.7,
  },
  editorContainer: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  editorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  characterCount: {
    fontSize: 12,
    opacity: 0.7,
  },
  editorInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 300,
    textAlignVertical: 'top',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
  useButton: {
    // Background color set dynamically
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  useButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
