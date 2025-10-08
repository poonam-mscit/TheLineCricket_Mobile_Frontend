import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

interface Experience {
  id: string;
  title: string;
  role: string;
  duration: string;
  description: string;
  organization?: string;
}

interface ExperienceEditorProps {
  visible: boolean;
  onClose: () => void;
  onSave: (experiences: Experience[]) => void;
  initialExperiences?: Experience[];
}

export function ExperienceEditor({ 
  visible, 
  onClose, 
  onSave, 
  initialExperiences = []
}: ExperienceEditorProps) {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [isSaving, setIsSaving] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const colorScheme = useColorScheme();

  const [newExperience, setNewExperience] = useState({
    title: '',
    role: '',
    duration: '',
    description: '',
    organization: ''
  });

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave(experiences);
      Alert.alert('Success', 'Experience updated successfully!');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update experience. Please try again.');
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

  const handleAddExperience = () => {
    if (!newExperience.title.trim() || !newExperience.role.trim() || !newExperience.duration.trim() || !newExperience.description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const experience: Experience = {
      id: Date.now().toString(),
      title: newExperience.title.trim(),
      role: newExperience.role.trim(),
      duration: newExperience.duration.trim(),
      description: newExperience.description.trim(),
      organization: newExperience.organization.trim() || undefined
    };

    setExperiences(prev => [...prev, experience]);
    setNewExperience({ title: '', role: '', duration: '', description: '', organization: '' });
    setShowAddForm(false);
  };

  const handleEditExperience = (experience: Experience) => {
    setEditingExperience(experience);
    setNewExperience({
      title: experience.title,
      role: experience.role,
      duration: experience.duration,
      description: experience.description,
      organization: experience.organization || ''
    });
    setShowAddForm(true);
  };

  const handleUpdateExperience = () => {
    if (!editingExperience || !newExperience.title.trim() || !newExperience.role.trim() || !newExperience.duration.trim() || !newExperience.description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    setExperiences(prev => prev.map(experience => 
      experience.id === editingExperience.id 
        ? {
            ...experience,
            title: newExperience.title.trim(),
            role: newExperience.role.trim(),
            duration: newExperience.duration.trim(),
            description: newExperience.description.trim(),
            organization: newExperience.organization.trim() || undefined
          }
        : experience
    ));

    setEditingExperience(null);
    setNewExperience({ title: '', role: '', duration: '', description: '', organization: '' });
    setShowAddForm(false);
  };

  const handleDeleteExperience = (experienceId: string) => {
    Alert.alert(
      'Delete Experience',
      'Are you sure you want to delete this experience?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setExperiences(prev => prev.filter(experience => experience.id !== experienceId));
          }
        }
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
        Manage Experience
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

  const renderAddForm = () => (
    <View style={[styles.addForm, { 
      backgroundColor: getColors(colorScheme).card,
      borderColor: getColors(colorScheme).border
    }]}>
      <Text style={[styles.formTitle, { color: getColors(colorScheme).text }]}>
        {editingExperience ? 'Edit Experience' : 'Add New Experience'}
      </Text>
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: getColors(colorScheme).background,
          color: getColors(colorScheme).text,
          borderColor: getColors(colorScheme).border
        }]}
        placeholder="Experience Title *"
        placeholderTextColor={getColors(colorScheme).text}
        value={newExperience.title}
        onChangeText={(text) => setNewExperience(prev => ({ ...prev, title: text }))}
      />
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: getColors(colorScheme).background,
          color: getColors(colorScheme).text,
          borderColor: getColors(colorScheme).border
        }]}
        placeholder="Role/Position *"
        placeholderTextColor={getColors(colorScheme).text}
        value={newExperience.role}
        onChangeText={(text) => setNewExperience(prev => ({ ...prev, role: text }))}
      />
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: getColors(colorScheme).background,
          color: getColors(colorScheme).text,
          borderColor: getColors(colorScheme).border
        }]}
        placeholder="Duration (e.g., 2020-2023) *"
        placeholderTextColor={getColors(colorScheme).text}
        value={newExperience.duration}
        onChangeText={(text) => setNewExperience(prev => ({ ...prev, duration: text }))}
      />
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: getColors(colorScheme).background,
          color: getColors(colorScheme).text,
          borderColor: getColors(colorScheme).border
        }]}
        placeholder="Organization/Team (Optional)"
        placeholderTextColor={getColors(colorScheme).text}
        value={newExperience.organization}
        onChangeText={(text) => setNewExperience(prev => ({ ...prev, organization: text }))}
      />
      
      <TextInput
        style={[styles.textArea, { 
          backgroundColor: getColors(colorScheme).background,
          color: getColors(colorScheme).text,
          borderColor: getColors(colorScheme).border
        }]}
        placeholder="Description *"
        placeholderTextColor={getColors(colorScheme).text}
        value={newExperience.description}
        onChangeText={(text) => setNewExperience(prev => ({ ...prev, description: text }))}
        multiline
        numberOfLines={4}
      />
      
      <View style={styles.formButtons}>
        <TouchableOpacity 
          style={[styles.cancelFormButton, { borderColor: getColors(colorScheme).border }]}
          onPress={() => {
            setShowAddForm(false);
            setEditingExperience(null);
            setNewExperience({ title: '', role: '', duration: '', description: '', organization: '' });
          }}
        >
          <Text style={[styles.cancelFormButtonText, { color: getColors(colorScheme).text }]}>
            Cancel
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.saveFormButton, { backgroundColor: getColors(colorScheme).primary }]}
          onPress={editingExperience ? handleUpdateExperience : handleAddExperience}
        >
          <Text style={styles.saveFormButtonText}>
            {editingExperience ? 'Update' : 'Add'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderExperienceItem = ({ item }: { item: Experience }) => (
    <View style={[styles.experienceItem, { 
      backgroundColor: getColors(colorScheme).card,
      borderColor: getColors(colorScheme).border
    }]}>
      <View style={styles.experienceContent}>
        <View style={styles.experienceHeader}>
          <Text style={[styles.experienceTitle, { color: getColors(colorScheme).text }]}>
            {item.title}
          </Text>
          <Text style={[styles.experienceDuration, { color: getColors(colorScheme).primary }]}>
            {item.duration}
          </Text>
        </View>
        
        <Text style={[styles.experienceRole, { color: getColors(colorScheme).text }]}>
          {item.role}
        </Text>
        
        {item.organization && (
          <Text style={[styles.experienceOrganization, { color: getColors(colorScheme).text }]}>
            {item.organization}
          </Text>
        )}
        
        <Text style={[styles.experienceDescription, { color: getColors(colorScheme).text }]}>
          {item.description}
        </Text>
      </View>
      
      <View style={styles.experienceActions}>
        <TouchableOpacity 
          style={[styles.editButton, { backgroundColor: getColors(colorScheme).primary }]}
          onPress={() => handleEditExperience(item)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.deleteButton, { backgroundColor: getColors(colorScheme).error }]}
          onPress={() => handleDeleteExperience(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>💼</Text>
      <Text style={[styles.emptyTitle, { color: getColors(colorScheme).text }]}>
        No Experience Yet
      </Text>
      <Text style={[styles.emptyDescription, { color: getColors(colorScheme).text }]}>
        Add your cricket experience, coaching roles, and team participation
      </Text>
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
          {showAddForm && renderAddForm()}
          
          <View style={styles.experiencesContainer}>
            <View style={styles.experiencesHeader}>
              <Text style={[styles.experiencesTitle, { color: getColors(colorScheme).text }]}>
                Your Experience ({experiences.length})
              </Text>
              
              {!showAddForm && (
                <TouchableOpacity 
                  style={[styles.addButton, { backgroundColor: getColors(colorScheme).primary }]}
                  onPress={() => setShowAddForm(true)}
                >
                  <Text style={styles.addButtonText}>+ Add Experience</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {experiences.length === 0 && !showAddForm ? (
              renderEmptyState()
            ) : (
              <FlatList
                data={experiences}
                keyExtractor={(item) => item.id}
                renderItem={renderExperienceItem}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
            )}
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
  addForm: {
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelFormButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelFormButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveFormButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveFormButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  experiencesContainer: {
    padding: 16,
  },
  experiencesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  experiencesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  experienceItem: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  experienceContent: {
    marginBottom: 12,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  experienceTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  experienceDuration: {
    fontSize: 14,
    fontWeight: '600',
  },
  experienceRole: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  experienceOrganization: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 8,
  },
  experienceDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  experienceActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
});
