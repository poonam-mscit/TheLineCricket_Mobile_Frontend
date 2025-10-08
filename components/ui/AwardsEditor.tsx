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

interface Award {
  id: string;
  title: string;
  organization: string;
  year: string;
  description?: string;
}

interface AwardsEditorProps {
  visible: boolean;
  onClose: () => void;
  onSave: (awards: Award[]) => void;
  initialAwards?: Award[];
}

export function AwardsEditor({ 
  visible, 
  onClose, 
  onSave, 
  initialAwards = []
}: AwardsEditorProps) {
  const [awards, setAwards] = useState<Award[]>(initialAwards);
  const [isSaving, setIsSaving] = useState(false);
  const [editingAward, setEditingAward] = useState<Award | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const colorScheme = useColorScheme();

  const [newAward, setNewAward] = useState({
    title: '',
    organization: '',
    year: '',
    description: ''
  });

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave(awards);
      Alert.alert('Success', 'Awards updated successfully!');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update awards. Please try again.');
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

  const handleAddAward = () => {
    if (!newAward.title.trim() || !newAward.organization.trim() || !newAward.year.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const award: Award = {
      id: Date.now().toString(),
      title: newAward.title.trim(),
      organization: newAward.organization.trim(),
      year: newAward.year.trim(),
      description: newAward.description.trim() || undefined
    };

    setAwards(prev => [...prev, award]);
    setNewAward({ title: '', organization: '', year: '', description: '' });
    setShowAddForm(false);
  };

  const handleEditAward = (award: Award) => {
    setEditingAward(award);
    setNewAward({
      title: award.title,
      organization: award.organization,
      year: award.year,
      description: award.description || ''
    });
    setShowAddForm(true);
  };

  const handleUpdateAward = () => {
    if (!editingAward || !newAward.title.trim() || !newAward.organization.trim() || !newAward.year.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    setAwards(prev => prev.map(award => 
      award.id === editingAward.id 
        ? {
            ...award,
            title: newAward.title.trim(),
            organization: newAward.organization.trim(),
            year: newAward.year.trim(),
            description: newAward.description.trim() || undefined
          }
        : award
    ));

    setEditingAward(null);
    setNewAward({ title: '', organization: '', year: '', description: '' });
    setShowAddForm(false);
  };

  const handleDeleteAward = (awardId: string) => {
    Alert.alert(
      'Delete Award',
      'Are you sure you want to delete this award?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setAwards(prev => prev.filter(award => award.id !== awardId));
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
        Manage Awards
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
        {editingAward ? 'Edit Award' : 'Add New Award'}
      </Text>
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: getColors(colorScheme).background,
          color: getColors(colorScheme).text,
          borderColor: getColors(colorScheme).border
        }]}
        placeholder="Award Title *"
        placeholderTextColor={getColors(colorScheme).text}
        value={newAward.title}
        onChangeText={(text) => setNewAward(prev => ({ ...prev, title: text }))}
      />
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: getColors(colorScheme).background,
          color: getColors(colorScheme).text,
          borderColor: getColors(colorScheme).border
        }]}
        placeholder="Organization *"
        placeholderTextColor={getColors(colorScheme).text}
        value={newAward.organization}
        onChangeText={(text) => setNewAward(prev => ({ ...prev, organization: text }))}
      />
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: getColors(colorScheme).background,
          color: getColors(colorScheme).text,
          borderColor: getColors(colorScheme).border
        }]}
        placeholder="Year *"
        placeholderTextColor={getColors(colorScheme).text}
        value={newAward.year}
        onChangeText={(text) => setNewAward(prev => ({ ...prev, year: text }))}
        keyboardType="numeric"
        maxLength={4}
      />
      
      <TextInput
        style={[styles.textArea, { 
          backgroundColor: getColors(colorScheme).background,
          color: getColors(colorScheme).text,
          borderColor: getColors(colorScheme).border
        }]}
        placeholder="Description (Optional)"
        placeholderTextColor={getColors(colorScheme).text}
        value={newAward.description}
        onChangeText={(text) => setNewAward(prev => ({ ...prev, description: text }))}
        multiline
        numberOfLines={3}
      />
      
      <View style={styles.formButtons}>
        <TouchableOpacity 
          style={[styles.cancelFormButton, { borderColor: getColors(colorScheme).border }]}
          onPress={() => {
            setShowAddForm(false);
            setEditingAward(null);
            setNewAward({ title: '', organization: '', year: '', description: '' });
          }}
        >
          <Text style={[styles.cancelFormButtonText, { color: getColors(colorScheme).text }]}>
            Cancel
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.saveFormButton, { backgroundColor: getColors(colorScheme).primary }]}
          onPress={editingAward ? handleUpdateAward : handleAddAward}
        >
          <Text style={styles.saveFormButtonText}>
            {editingAward ? 'Update' : 'Add'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAwardItem = ({ item }: { item: Award }) => (
    <View style={[styles.awardItem, { 
      backgroundColor: getColors(colorScheme).card,
      borderColor: getColors(colorScheme).border
    }]}>
      <View style={styles.awardContent}>
        <View style={styles.awardHeader}>
          <Text style={[styles.awardTitle, { color: getColors(colorScheme).text }]}>
            {item.title}
          </Text>
          <Text style={[styles.awardYear, { color: getColors(colorScheme).primary }]}>
            {item.year}
          </Text>
        </View>
        
        <Text style={[styles.awardOrganization, { color: getColors(colorScheme).text }]}>
          {item.organization}
        </Text>
        
        {item.description && (
          <Text style={[styles.awardDescription, { color: getColors(colorScheme).text }]}>
            {item.description}
          </Text>
        )}
      </View>
      
      <View style={styles.awardActions}>
        <TouchableOpacity 
          style={[styles.editButton, { backgroundColor: getColors(colorScheme).primary }]}
          onPress={() => handleEditAward(item)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.deleteButton, { backgroundColor: getColors(colorScheme).error }]}
          onPress={() => handleDeleteAward(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🏆</Text>
      <Text style={[styles.emptyTitle, { color: getColors(colorScheme).text }]}>
        No Awards Yet
      </Text>
      <Text style={[styles.emptyDescription, { color: getColors(colorScheme).text }]}>
        Add your cricket awards and achievements to showcase your success
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
          
          <View style={styles.awardsContainer}>
            <View style={styles.awardsHeader}>
              <Text style={[styles.awardsTitle, { color: getColors(colorScheme).text }]}>
                Your Awards ({awards.length})
              </Text>
              
              {!showAddForm && (
                <TouchableOpacity 
                  style={[styles.addButton, { backgroundColor: getColors(colorScheme).primary }]}
                  onPress={() => setShowAddForm(true)}
                >
                  <Text style={styles.addButtonText}>+ Add Award</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {awards.length === 0 && !showAddForm ? (
              renderEmptyState()
            ) : (
              <FlatList
                data={awards}
                keyExtractor={(item) => item.id}
                renderItem={renderAwardItem}
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
    minHeight: 80,
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
  awardsContainer: {
    padding: 16,
  },
  awardsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  awardsTitle: {
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
  awardItem: {
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
  awardContent: {
    marginBottom: 12,
  },
  awardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  awardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  awardYear: {
    fontSize: 14,
    fontWeight: '600',
  },
  awardOrganization: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 8,
  },
  awardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  awardActions: {
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
