import { MatchCRUDDemo } from '@/components/MatchCRUDDemo';
import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import { useApi } from '@/src/hooks/useApi';
import { useAuth } from '@/src/hooks/useAuth';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator, Alert,
    Dimensions, Modal, SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity, useColorScheme, View
} from 'react-native';


interface CreateMatchFormData {
  // Step 1: Match Details
  title: string;
  description: string;
  match_type: 't20' | 'odi' | 'test' | 'practice' | 'tournament';
  match_format: 't20' | 'odi' | 'test' | 'practice';
  
  // Step 2: Venue & Time
  location: string;
  venue: string;
  match_date: string;
  match_time: string;
  
  // Step 3: Teams & Criteria
  team1_name: string;
  team2_name: string;
  skill_level: 'all_levels' | 'beginner' | 'intermediate' | 'advanced' | 'professional';
  min_age: number;
  max_age: number;
  join_team: 'team1' | 'team2';
  your_role: 'captain' | 'vice_captain' | 'batsman' | 'bowler' | 'all_rounder' | 'wicket_keeper';
  
  // Step 4: Review & Create
  is_paid_match: boolean;
  entry_fee: number;
  prize_money: number;
  need_umpire: boolean;
  umpire_name: string;
  umpire_contact: string;
  umpire_experience: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  umpire_fee: number;
  
  // Additional fields
  players_needed: number;
  is_public: boolean;
  equipment_provided: boolean;
  rules: string;
}

export default function CreateMatchScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCRUDDemo, setShowCRUDDemo] = useState(false);
  const colorScheme = useColorScheme();
  const { width } = Dimensions.get('window');
  
  // Use real user data from auth context
  const { user: authUser, isAuthenticated } = useAuth();
  const { createMatch, loading, error } = useApi();
  
  // Real user data from database
  const user = {
    id: authUser?.id || '',
    fullName: authUser?.fullName || '',
    username: authUser?.username || '',
    email: authUser?.email || '',
    avatar: authUser?.avatar || '',
    verified: authUser?.verified || false
  };

  // Form data state following existing patterns
  const [formData, setFormData] = useState<CreateMatchFormData>({
    // Step 1: Match Details
    title: '',
    description: '',
    match_type: 't20',
    match_format: 't20',
    
    // Step 2: Venue & Time
    location: '',
    venue: '',
    match_date: '',
    match_time: '',
    
    // Step 3: Teams & Criteria
    team1_name: '',
    team2_name: '',
    skill_level: 'all_levels',
    min_age: 18,
    max_age: 65,
    join_team: 'team1',
    your_role: 'captain',
    
    // Step 4: Review & Create
    is_paid_match: false,
    entry_fee: 0,
    prize_money: 0,
    need_umpire: false,
    umpire_name: '',
    umpire_contact: '',
    umpire_experience: 'beginner',
    umpire_fee: 0,
    
    // Additional fields
    players_needed: 22,
    is_public: true,
    equipment_provided: false,
    rules: ''
  });

  const totalSteps = 4;

  // Event handlers following existing patterns
  const handleInputChange = (field: keyof CreateMatchFormData, value: any) => {
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
      'Cancel Match Creation',
      'Are you sure you want to cancel? All progress will be lost.',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Cancel', style: 'destructive', onPress: () => router.back() }
      ]
    );
  };

  const handleCreateMatch = async () => {
    setIsCreating(true);
    
    try {
      // Validate required fields
      if (!formData.title.trim()) {
        setErrors({ title: 'Match title is required' });
        setIsCreating(false);
        return;
      }
      
      if (!formData.location.trim()) {
        setErrors({ location: 'Location is required' });
        setIsCreating(false);
        return;
      }
      
      if (!formData.match_date.trim()) {
        setErrors({ match_date: 'Match date is required' });
        setIsCreating(false);
        return;
      }
      
      if (!formData.team1_name.trim() || !formData.team2_name.trim()) {
        setErrors({ team1_name: 'Both team names are required' });
        setIsCreating(false);
        return;
      }

      // Create match data for API
      const matchData = {
        title: formData.title,
        description: formData.description,
        match_type: formData.match_type,
        match_format: formData.match_format,
        location: formData.location,
        venue: formData.venue,
        match_date: formData.match_date,
        match_time: formData.match_time,
        team1_name: formData.team1_name,
        team2_name: formData.team2_name,
        skill_level: formData.skill_level,
        min_age: formData.min_age,
        max_age: formData.max_age,
        join_team: formData.join_team,
        your_role: formData.your_role,
        is_paid_match: formData.is_paid_match,
        entry_fee: formData.entry_fee,
        prize_money: formData.prize_money,
        need_umpire: formData.need_umpire,
        umpire_name: formData.umpire_name,
        umpire_contact: formData.umpire_contact,
        umpire_experience: formData.umpire_experience,
        umpire_fee: formData.umpire_fee,
        players_needed: formData.players_needed,
        is_public: formData.is_public,
        equipment_provided: formData.equipment_provided,
        rules: formData.rules,
        created_by: user.id
      };

      // Call API to create match
      const result = await createMatch(matchData);
      
      Alert.alert(
        'Match Created!',
        'Your match has been created successfully.',
        [
          { text: 'OK', onPress: () => router.replace('/home') }
        ]
      );
    } catch (error) {
      console.error('Error creating match:', error);
      Alert.alert('Error', 'Failed to create match. Please try again.');
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
          Create Match
        </Text>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={handleCancel}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.demoButton, { backgroundColor: getColors(colorScheme).tint }]}
          onPress={() => setShowCRUDDemo(true)}
        >
          <Text style={styles.demoButtonText}>CRUD Demo</Text>
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
        return renderMatchDetailsStep();
      case 2:
        return renderVenueTimeStep();
      case 3:
        return renderTeamsCriteriaStep();
      case 4:
        return renderReviewCreateStep();
      default:
        return renderMatchDetailsStep();
    }
  };

  const renderMatchDetailsStep = () => (
    <View style={[styles.stepContent, { backgroundColor: getColors(colorScheme).card }]}>
      <View style={styles.stepHeader}>
        <View style={[styles.stepIcon, { backgroundColor: '#3B82F6' }]}>
          <Text style={styles.stepIconText}>🏏</Text>
        </View>
        <View style={styles.stepHeaderText}>
          <Text style={[styles.stepTitle, { color: getColors(colorScheme).text }]}>
            Match Details
          </Text>
          <Text style={[styles.stepDescription, { color: getColors(colorScheme).text }]}>
            Tell us about your match
          </Text>
        </View>
      </View>

      <View style={[styles.tipBox, { backgroundColor: '#EFF6FF', borderColor: '#3B82F6' }]}>
        <Text style={[styles.tipText, { color: '#1E40AF' }]}>
          💡 Tip: Be specific about the match type and format to attract the right players
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
            Match Title *
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
            placeholder="Enter match title"
            placeholderTextColor={getColors(colorScheme).text}
            value={formData.title}
            onChangeText={(value) => handleInputChange('title', value)}
          />
          {errors.title && <Text style={[styles.errorText, { color: getColors(colorScheme).error }]}>{errors.title}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
            Description
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
            placeholder="Describe your match..."
            placeholderTextColor={getColors(colorScheme).text}
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.rowContainer}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
              Match Type *
            </Text>
            <View style={styles.selectContainer}>
              <Text style={[styles.selectText, { color: getColors(colorScheme).text }]}>
                {formData.match_type.toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
              Format *
            </Text>
            <View style={styles.selectContainer}>
              <Text style={[styles.selectText, { color: getColors(colorScheme).text }]}>
                {formData.match_format.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderVenueTimeStep = () => (
    <View style={[styles.stepContent, { backgroundColor: getColors(colorScheme).card }]}>
      <View style={styles.stepHeader}>
        <View style={[styles.stepIcon, { backgroundColor: '#10B981' }]}>
          <Text style={styles.stepIconText}>📍</Text>
        </View>
        <View style={styles.stepHeaderText}>
          <Text style={[styles.stepTitle, { color: getColors(colorScheme).text }]}>
            Venue & Time
          </Text>
          <Text style={[styles.stepDescription, { color: getColors(colorScheme).text }]}>
            Where and when will the match be played?
          </Text>
        </View>
      </View>

      <View style={styles.tipBox}>
        <Text style={styles.tipText}>
          💡 Tip: Choose a location that's easily accessible to all players
        </Text>
      </View>

      <View style={styles.formContainer}>
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

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
            Venue (Optional)
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
            placeholder="Enter venue name"
            placeholderTextColor={getColors(colorScheme).text}
            value={formData.venue}
            onChangeText={(value) => handleInputChange('venue', value)}
          />
        </View>

        <View style={styles.rowContainer}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
              Date *
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: getColors(colorScheme).background,
                  color: getColors(colorScheme).text,
                  borderColor: errors.match_date ? getColors(colorScheme).error : getColors(colorScheme).border
                }
              ]}
              placeholder="Select date"
              placeholderTextColor={getColors(colorScheme).text}
              value={formData.match_date}
              onChangeText={(value) => handleInputChange('match_date', value)}
            />
          </View>
          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
              Time *
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: getColors(colorScheme).background,
                  color: getColors(colorScheme).text,
                  borderColor: errors.match_time ? getColors(colorScheme).error : getColors(colorScheme).border
                }
              ]}
              placeholder="Select time"
              placeholderTextColor={getColors(colorScheme).text}
              value={formData.match_time}
              onChangeText={(value) => handleInputChange('match_time', value)}
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderTeamsCriteriaStep = () => (
    <View style={[styles.stepContent, { backgroundColor: getColors(colorScheme).card }]}>
      <View style={styles.stepHeader}>
        <View style={[styles.stepIcon, { backgroundColor: '#8B5CF6' }]}>
          <Text style={styles.stepIconText}>👥</Text>
        </View>
        <View style={styles.stepHeaderText}>
          <Text style={[styles.stepTitle, { color: getColors(colorScheme).text }]}>
            Teams & Criteria
          </Text>
          <Text style={[styles.stepDescription, { color: getColors(colorScheme).text }]}>
            Set up teams and participation criteria
          </Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.rowContainer}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
              Team 1 Name *
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: getColors(colorScheme).background,
                  color: getColors(colorScheme).text,
                  borderColor: errors.team1_name ? getColors(colorScheme).error : getColors(colorScheme).border
                }
              ]}
              placeholder="Enter team 1 name"
              placeholderTextColor={getColors(colorScheme).text}
              value={formData.team1_name}
              onChangeText={(value) => handleInputChange('team1_name', value)}
            />
          </View>
          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
              Team 2 Name *
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: getColors(colorScheme).background,
                  color: getColors(colorScheme).text,
                  borderColor: errors.team2_name ? getColors(colorScheme).error : getColors(colorScheme).border
                }
              ]}
              placeholder="Enter team 2 name"
              placeholderTextColor={getColors(colorScheme).text}
              value={formData.team2_name}
              onChangeText={(value) => handleInputChange('team2_name', value)}
            />
          </View>
        </View>

        <View style={styles.participationCard}>
          <Text style={[styles.participationTitle, { color: getColors(colorScheme).text }]}>
            Your Participation
          </Text>
          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
                Join Team
              </Text>
              <View style={styles.selectContainer}>
                <Text style={[styles.selectText, { color: getColors(colorScheme).text }]}>
                  {formData.join_team === 'team1' ? formData.team1_name || 'Team 1' : formData.team2_name || 'Team 2'}
                </Text>
              </View>
            </View>
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Text style={[styles.label, { color: getColors(colorScheme).text }]}>
                Your Role
              </Text>
              <View style={styles.selectContainer}>
                <Text style={[styles.selectText, { color: getColors(colorScheme).text }]}>
                  {formData.your_role.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderReviewCreateStep = () => (
    <View style={[styles.stepContent, { backgroundColor: getColors(colorScheme).card }]}>
      <View style={styles.stepHeader}>
        <View style={[styles.stepIcon, { backgroundColor: '#F59E0B' }]}>
          <Text style={styles.stepIconText}>💰</Text>
        </View>
        <View style={styles.stepHeaderText}>
          <Text style={[styles.stepTitle, { color: getColors(colorScheme).text }]}>
            Review & Create
          </Text>
          <Text style={[styles.stepDescription, { color: getColors(colorScheme).text }]}>
            Review your match details and create
          </Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.matchSummary}>
          <Text style={[styles.summaryTitle, { color: getColors(colorScheme).text }]}>
            Match Summary
          </Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: getColors(colorScheme).text }]}>Title</Text>
              <Text style={[styles.summaryValue, { color: getColors(colorScheme).text }]}>{formData.title || 'Not set'}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: getColors(colorScheme).text }]}>Type</Text>
              <Text style={[styles.summaryValue, { color: getColors(colorScheme).text }]}>{formData.match_type.toUpperCase()}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: getColors(colorScheme).text }]}>Location</Text>
              <Text style={[styles.summaryValue, { color: getColors(colorScheme).text }]}>{formData.location || 'Not set'}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: getColors(colorScheme).text }]}>Date</Text>
              <Text style={[styles.summaryValue, { color: getColors(colorScheme).text }]}>{formData.match_date || 'Not set'}</Text>
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
          onPress={currentStep === totalSteps ? handleCreateMatch : handleNext}
          disabled={isCreating}
        >
          {isCreating ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.nextButtonText}>
              {currentStep === totalSteps ? 'Create Match ✓' : 'Next →'}
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

      {/* CRUD Demo Modal */}
      <Modal
        visible={showCRUDDemo}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCRUDDemo(false)}
      >
        <MatchCRUDDemo />
        <TouchableOpacity 
          style={[styles.closeCRUDDemoButton, {
            backgroundColor: getColors(colorScheme).tint
          }]}
          onPress={() => setShowCRUDDemo(false)}
        >
          <Text style={styles.closeCRUDDemoButtonText}>Close Demo</Text>
        </TouchableOpacity>
      </Modal>
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
  participationCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  participationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#10B981',
  },
  matchSummary: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
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
  demoButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  demoButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  closeCRUDDemoButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  closeCRUDDemoButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
