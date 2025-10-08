import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

interface SkillsData {
  batting: number;
  bowling: number;
  fielding: number;
  overall: number;
}

interface SkillsEditorProps {
  visible: boolean;
  onClose: () => void;
  onSave: (skills: SkillsData) => void;
  initialSkills?: SkillsData;
}

export function SkillsEditor({ 
  visible, 
  onClose, 
  onSave, 
  initialSkills = { batting: 0, bowling: 0, fielding: 0, overall: 0 }
}: SkillsEditorProps) {
  const [skills, setSkills] = useState<SkillsData>(initialSkills);
  const [isSaving, setIsSaving] = useState(false);
  const colorScheme = useColorScheme();

  const handleSkillChange = (skill: keyof SkillsData, value: string) => {
    const numValue = parseInt(value) || 0;
    if (numValue >= 0 && numValue <= 100) {
      setSkills(prev => ({ ...prev, [skill]: numValue }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Calculate overall rating
      const overall = Math.round((skills.batting + skills.bowling + skills.fielding) / 3);
      const updatedSkills = { ...skills, overall };
      
      onSave(updatedSkills);
      Alert.alert('Success', 'Skills updated successfully!');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update skills. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Changes',
      'Are you sure you want to cancel? All changes will be lost.',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: onClose }
      ]
    );
  };

  const renderHeader = () => (
    <View style={[styles.header, { 
      backgroundColor: getColors(colorScheme).card,
      borderBottomColor: getColors(colorScheme).border
    }]}>
      <TouchableOpacity 
        style={styles.cancelButton}
        onPress={handleCancel}
      >
        <Text style={[styles.cancelButtonText, { color: getColors(colorScheme).text }]}>
          Cancel
        </Text>
      </TouchableOpacity>
      
      <Text style={[styles.headerTitle, { color: getColors(colorScheme).text }]}>
        Edit Skills
      </Text>
      
      <TouchableOpacity 
        style={[styles.saveButton, { 
          backgroundColor: getColors(colorScheme).primary,
          opacity: isSaving ? 0.6 : 1
        }]}
        onPress={handleSave}
        disabled={isSaving}
      >
        <Text style={styles.saveButtonText}>
          {isSaving ? 'Saving...' : 'Save'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSkillInput = (skill: keyof Omit<SkillsData, 'overall'>, label: string, icon: string, color: string) => (
    <View style={[styles.skillContainer, { 
      backgroundColor: getColors(colorScheme).card,
      borderColor: getColors(colorScheme).border
    }]}>
      <View style={styles.skillHeader}>
        <Text style={styles.skillIcon}>{icon}</Text>
        <Text style={[styles.skillLabel, { color: getColors(colorScheme).text }]}>
          {label}
        </Text>
        <Text style={[styles.skillValue, { color }]}>
          {skills[skill]}%
        </Text>
      </View>
      
      <View style={styles.skillInputContainer}>
        <TextInput
          style={[styles.skillInput, { 
            backgroundColor: getColors(colorScheme).background,
            color: getColors(colorScheme).text,
            borderColor: getColors(colorScheme).border
          }]}
          value={skills[skill].toString()}
          onChangeText={(value) => handleSkillChange(skill, value)}
          keyboardType="numeric"
          maxLength={3}
          placeholder="0"
          placeholderTextColor={getColors(colorScheme).text}
        />
        <Text style={[styles.percentageText, { color: getColors(colorScheme).text }]}>
          %
        </Text>
      </View>
      
      <View style={[styles.progressBar, { backgroundColor: getColors(colorScheme).border }]}>
        <View style={[
          styles.progressFill, 
          { 
            backgroundColor: color,
            width: `${skills[skill]}%`
          }
        ]} />
      </View>
      
      <View style={styles.skillDescription}>
        <Text style={[styles.descriptionText, { color: getColors(colorScheme).text }]}>
          {getSkillDescription(skill, skills[skill])}
        </Text>
      </View>
    </View>
  );

  const getSkillDescription = (skill: keyof Omit<SkillsData, 'overall'>, value: number) => {
    if (value >= 90) return 'Expert level - Professional standard';
    if (value >= 80) return 'Advanced level - Very skilled';
    if (value >= 70) return 'Intermediate level - Good skills';
    if (value >= 60) return 'Developing level - Improving';
    if (value >= 40) return 'Beginner level - Learning';
    return 'Novice level - Just starting';
  };

  const renderOverallRating = () => {
    const overall = Math.round((skills.batting + skills.bowling + skills.fielding) / 3);
    
    return (
      <View style={[styles.overallContainer, { 
        backgroundColor: getColors(colorScheme).card,
        borderColor: getColors(colorScheme).border
      }]}>
        <View style={styles.overallHeader}>
          <Text style={styles.overallIcon}>⭐</Text>
          <Text style={[styles.overallLabel, { color: getColors(colorScheme).text }]}>
            Overall Rating
          </Text>
          <Text style={[styles.overallValue, { color: '#FF6B33' }]}>
            {overall}%
          </Text>
        </View>
        
        <View style={[styles.overallProgressBar, { backgroundColor: getColors(colorScheme).border }]}>
          <View style={[
            styles.overallProgressFill, 
            { 
              backgroundColor: '#FF6B33',
              width: `${overall}%`
            }
          ]} />
        </View>
        
        <Text style={[styles.overallDescription, { color: getColors(colorScheme).text }]}>
          {getSkillDescription('batting', overall)}
        </Text>
      </View>
    );
  };

  const renderTips = () => (
    <View style={[styles.tipsContainer, { 
      backgroundColor: '#EFF6FF',
      borderColor: '#3B82F6'
    }]}>
      <Text style={styles.tipsIcon}>💡</Text>
      <View style={styles.tipsContent}>
        <Text style={[styles.tipsTitle, { color: '#1E40AF' }]}>
          Tips for Rating Your Skills
        </Text>
        <Text style={[styles.tipsText, { color: '#1E40AF' }]}>
          • Be honest about your current skill level{'\n'}
          • Consider your performance in recent matches{'\n'}
          • Ask teammates or coaches for feedback{'\n'}
          • Update your ratings regularly as you improve
        </Text>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: getColors(colorScheme).background }]}>
        {renderHeader()}
        
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.skillsContainer}>
            {renderSkillInput('batting', 'Batting', '🏏', '#F97316')}
            {renderSkillInput('bowling', 'Bowling', '🎯', '#3B82F6')}
            {renderSkillInput('fielding', 'Fielding', '🧤', '#10B981')}
            {renderOverallRating()}
            {renderTips()}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  skillsContainer: {
    padding: 16,
    gap: 20,
  },
  skillContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  skillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  skillIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  skillLabel: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
  },
  skillValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  skillInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  skillInput: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    textAlign: 'center',
    marginRight: 8,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  skillDescription: {
    marginTop: 8,
  },
  descriptionText: {
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  overallContainer: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF6B33',
    padding: 20,
    backgroundColor: '#FFF7ED',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  overallHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  overallIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  overallLabel: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  overallValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  overallProgressBar: {
    height: 10,
    borderRadius: 5,
    marginBottom: 12,
  },
  overallProgressFill: {
    height: '100%',
    borderRadius: 5,
  },
  overallDescription: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  tipsContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginTop: 8,
  },
  tipsIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
