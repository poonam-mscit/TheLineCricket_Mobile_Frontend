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

interface Achievement {
  id: string;
  title: string;
  description: string;
  year: string;
  category?: string;
}

interface AchievementsEditorProps {
  visible: boolean;
  onClose: () => void;
  onSave: (achievements: Achievement[]) => void;
  initialAchievements?: Achievement[];
}

export function AchievementsEditor({ 
  visible, 
  onClose, 
  onSave, 
  initialAchievements = []
}: AchievementsEditorProps) {
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [isSaving, setIsSaving] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const colorScheme = useColorScheme();

  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    year: '',
    category: ''
  });

  const categories = [
    'Batting',
    'Bowling',
    'Fielding',
    'Leadership',
    'Team Performance',
    'Personal Records',
    'Tournament',
    'Other'
  ];

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave(achievements);
      Alert.alert('Success', 'Achievements updated successfully!');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update achievements. Please try again.');
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

  const handleAddAchievement = () => {
    if (!newAchievement.title.trim() || !newAchievement.description.trim() || !newAchievement.year.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const achievement: Achievement = {
      id: Date.now().toString(),
      title: newAchievement.title.trim(),
      description: newAchievement.description.trim(),
      year: newAchievement.year.trim(),
      category: newAchievement.category || undefined
    };

    setAchievements(prev => [...prev, achievement]);
    setNewAchievement({ title: '', description: '', year: '', category: '' });
    setShowAddForm(false);
  };

  const handleEditAchievement = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setNewAchievement({
      title: achievement.title,
      description: achievement.description,
      year: achievement.year,
      category: achievement.category || ''
    });
    setShowAddForm(true);
  };

  const handleUpdateAchievement = () => {
    if (!editingAchievement || !newAchievement.title.trim() || !newAchievement.description.trim() || !newAchievement.year.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    setAchievements(prev => prev.map(achievement => 
      achievement.id === editingAchievement.id 
        ? {
            ...achievement,
            title: newAchievement.title.trim(),
            description: newAchievement.description.trim(),
            year: newAchievement.year.trim(),
            category: newAchievement.category || undefined
          }
        : achievement
    ));

    setEditingAchievement(null);
    setNewAchievement({ title: '', description: '', year: '', category: '' });
    setShowAddForm(false);
  };

  const handleDeleteAchievement = (achievementId: string) => {
    Alert.alert(
      'Delete Achievement',
      'Are you sure you want to delete this achievement?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setAchievements(prev => prev.filter(achievement => achievement.id !== achievementId));
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
        Manage Achievements
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
        {editingAchievement ? 'Edit Achievement' : 'Add New Achievement'}
      </Text>
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: getColors(colorScheme).background,
          color: getColors(colorScheme).text,
          borderColor: getColors(colorScheme).border
        }]}
        placeholder="Achievement Title *"
        placeholderTextColor={getColors(colorScheme).text}
        value={newAchievement.title}
        onChangeText={(text) => setNewAchievement(prev => ({ ...prev, title: text }))}
      />
      
      <TextInput
        style={[styles.textArea, { 
          backgroundColor: getColors(colorScheme).background,
          color: getColors(colorScheme).text,
          borderColor: getColors(colorScheme).border
        }]}
        placeholder="Description *"
        placeholderTextColor={getColors(colorScheme).text}
        value={newAchievement.description}
        onChangeText={(text) => setNewAchievement(prev => ({ ...prev, description: text }))}
        multiline
        numberOfLines={3}
      />
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: getColors(colorScheme).background,
          color: getColors(colorScheme).text,
          borderColor: getColors(colorScheme).border
        }]}
        placeholder="Year *"
        placeholderTextColor={getColors(colorScheme).text}
        value={newAchievement.year}
        onChangeText={(text) => setNewAchievement(prev => ({ ...prev, year: text }))}
        keyboardType="numeric"
        maxLength={4}
      />
      
      <View style={styles.categoryContainer}>
        <Text style={[styles.categoryLabel, { color: getColors(colorScheme).text }]}>
          Category (Optional)
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: newAchievement.category === category 
                    ? getColors(colorScheme).primary 
                    : getColors(colorScheme).background,
                  borderColor: getColors(colorScheme).border
                }
              ]}
              onPress={() => setNewAchievement(prev => ({ 
                ...prev, 
                category: newAchievement.category === category ? '' : category 
              }))}
            >
              <Text style={[
                styles.categoryChipText,
                { 
                  color: newAchievement.category === category 
                    ? 'white' 
                    : getColors(colorScheme).text 
                }
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.formButtons}>
        <TouchableOpacity 
          style={[styles.cancelFormButton, { borderColor: getColors(colorScheme).border }]}
          onPress={() => {
            setShowAddForm(false);
            setEditingAchievement(null);
            setNewAchievement({ title: '', description: '', year: '', category: '' });
          }}
        >
          <Text style={[styles.cancelFormButtonText, { color: getColors(colorScheme).text }]}>
            Cancel
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.saveFormButton, { backgroundColor: getColors(colorScheme).primary }]}
          onPress={editingAchievement ? handleUpdateAchievement : handleAddAchievement}
        >
          <Text style={styles.saveFormButtonText}>
            {editingAchievement ? 'Update' : 'Add'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAchievementItem = ({ item }: { item: Achievement }) => (
    <View style={[styles.achievementItem, { 
      backgroundColor: getColors(colorScheme).card,
      borderColor: getColors(colorScheme).border
    }]}>
      <View style={styles.achievementContent}>
        <View style={styles.achievementHeader}>
          <Text style={[styles.achievementTitle, { color: getColors(colorScheme).text }]}>
            {item.title}
          </Text>
          <Text style={[styles.achievementYear, { color: getColors(colorScheme).primary }]}>
            {item.year}
          </Text>
        </View>
        
        <Text style={[styles.achievementDescription, { color: getColors(colorScheme).text }]}>
          {item.description}
        </Text>
        
        {item.category && (
          <View style={[styles.categoryTag, { backgroundColor: getColors(colorScheme).primary }]}>
            <Text style={styles.categoryTagText}>{item.category}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.achievementActions}>
        <TouchableOpacity 
          style={[styles.editButton, { backgroundColor: getColors(colorScheme).primary }]}
          onPress={() => handleEditAchievement(item)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.deleteButton, { backgroundColor: getColors(colorScheme).error }]}
          onPress={() => handleDeleteAchievement(item.id)}
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
        No Achievements Yet
      </Text>
      <Text style={[styles.emptyDescription, { color: getColors(colorScheme).text }]}>
        Add your cricket achievements and milestones to showcase your journey
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
          
          <View style={styles.achievementsContainer}>
            <View style={styles.achievementsHeader}>
              <Text style={[styles.achievementsTitle, { color: getColors(colorScheme).text }]}>
                Your Achievements ({achievements.length})
              </Text>
              
              {!showAddForm && (
                <TouchableOpacity 
                  style={[styles.addButton, { backgroundColor: getColors(colorScheme).primary }]}
                  onPress={() => setShowAddForm(true)}
                >
                  <Text style={styles.addButtonText}>+ Add Achievement</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {achievements.length === 0 && !showAddForm ? (
              renderEmptyState()
            ) : (
              <FlatList
                data={achievements}
                keyExtractor={(item) => item.id}
                renderItem={renderAchievementItem}
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
  categoryContainer: {
    marginBottom: 16,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  categoryScroll: {
    marginBottom: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
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
  achievementsContainer: {
    padding: 16,
  },
  achievementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementsTitle: {
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
  achievementItem: {
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
  achievementContent: {
    marginBottom: 12,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementYear: {
    fontSize: 14,
    fontWeight: '600',
  },
  achievementDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryTagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  achievementActions: {
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
