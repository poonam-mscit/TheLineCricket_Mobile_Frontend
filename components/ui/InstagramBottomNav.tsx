import { Text } from '@/components/Themed';
import { useColorScheme } from 'react-native';
import { getColors } from '@/constants/Colors';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface InstagramBottomNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onCreatePost?: (content: string) => void;
  onCreateMatch?: (matchData: any) => void;
  onCreateTeam?: (teamData: any) => void;
}

export function InstagramBottomNav({ 
  activeSection, 
  onSectionChange, 
  onCreatePost, 
  onCreateMatch, 
  onCreateTeam 
}: InstagramBottomNavProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState<'post' | 'match' | 'team'>('post');
  const [postContent, setPostContent] = useState('');
  const [matchData, setMatchData] = useState({
    teamA: '',
    teamB: '',
    date: '',
    location: '',
    type: 'T20'
  });
  const [teamData, setTeamData] = useState({
    name: '',
    description: '',
    location: '',
    skillLevel: 'Beginner'
  });
  
  const colorScheme = useColorScheme();

  const navItems = [
    {
      key: 'home',
      icon: '🏠',
      label: 'Home',
      activeIcon: '🏠'
    },
    {
      key: 'search',
      icon: '🔍',
      label: 'Search',
      activeIcon: '🔍'
    },
    {
      key: 'create',
      icon: '➕',
      label: 'Create',
      activeIcon: '➕',
      isCenter: true
    },
    {
      key: 'jobs',
      icon: '💼',
      label: 'Jobs',
      activeIcon: '💼'
    },
    {
      key: 'profile',
      icon: '👤',
      label: 'Profile',
      activeIcon: '👤'
    }
  ];

  const handleCreatePress = () => {
    setShowCreateModal(true);
  };

  const handleCreateSubmit = () => {
    if (createType === 'post' && postContent.trim()) {
      onCreatePost?.(postContent);
      setPostContent('');
    } else if (createType === 'match' && matchData.teamA && matchData.teamB) {
      onCreateMatch?.(matchData);
      setMatchData({ teamA: '', teamB: '', date: '', location: '', type: 'T20' });
    } else if (createType === 'team' && teamData.name) {
      onCreateTeam?.(teamData);
      setTeamData({ name: '', description: '', location: '', skillLevel: 'Beginner' });
    }
    setShowCreateModal(false);
  };

  const renderCreateModal = () => (
    <Modal
      visible={showCreateModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowCreateModal(false)}
    >
      <View style={[styles.modalContainer, { 
        backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff'
      }]}>
        <View style={[styles.modalHeader, { 
          backgroundColor: colorScheme === 'dark' ? '#2c2c2c' : '#f8f9fa',
          borderBottomColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
        }]}>
          <Text style={[styles.modalTitle, { 
            color: getColors(colorScheme).text 
          }]}>
            Create Content
          </Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowCreateModal(false)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.createTypeSelector}>
          <TouchableOpacity 
            style={[styles.createTypeButton, { 
              backgroundColor: createType === 'post' ? getColors(colorScheme).tint : 'transparent',
              borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
            }]}
            onPress={() => setCreateType('post')}
          >
            <Text style={[styles.createTypeIcon, { 
              color: createType === 'post' ? 'white' : getColors(colorScheme).text 
            }]}>
              📝
            </Text>
            <Text style={[styles.createTypeLabel, { 
              color: createType === 'post' ? 'white' : getColors(colorScheme).text 
            }]}>
              Post
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.createTypeButton, { 
              backgroundColor: createType === 'match' ? getColors(colorScheme).tint : 'transparent',
              borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
            }]}
            onPress={() => setCreateType('match')}
          >
            <Text style={[styles.createTypeIcon, { 
              color: createType === 'match' ? 'white' : getColors(colorScheme).text 
            }]}>
              🏏
            </Text>
            <Text style={[styles.createTypeLabel, { 
              color: createType === 'match' ? 'white' : getColors(colorScheme).text 
            }]}>
              Match
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.createTypeButton, { 
              backgroundColor: createType === 'team' ? getColors(colorScheme).tint : 'transparent',
              borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
            }]}
            onPress={() => setCreateType('team')}
          >
            <Text style={[styles.createTypeIcon, { 
              color: createType === 'team' ? 'white' : getColors(colorScheme).text 
            }]}>
              👥
            </Text>
            <Text style={[styles.createTypeLabel, { 
              color: createType === 'team' ? 'white' : getColors(colorScheme).text 
            }]}>
              Team
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {createType === 'post' && (
            <View style={styles.createForm}>
              <Text style={[styles.formLabel, { 
                color: getColors(colorScheme).text 
              }]}>
                What's on your mind?
              </Text>
              <TextInput
                style={[styles.textInput, { 
                  color: getColors(colorScheme).text,
                  backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
                  borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
                }]}
                placeholder="Share your cricket thoughts..."
                placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
                value={postContent}
                onChangeText={setPostContent}
                multiline
                numberOfLines={4}
              />
            </View>
          )}

          {createType === 'match' && (
            <View style={styles.createForm}>
              <Text style={[styles.formLabel, { 
                color: getColors(colorScheme).text 
              }]}>
                Create a Match
              </Text>
              
              <TextInput
                style={[styles.textInput, { 
                  color: getColors(colorScheme).text,
                  backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
                  borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
                }]}
                placeholder="Team A"
                placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
                value={matchData.teamA}
                onChangeText={(text) => setMatchData(prev => ({ ...prev, teamA: text }))}
              />
              
              <TextInput
                style={[styles.textInput, { 
                  color: getColors(colorScheme).text,
                  backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
                  borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
                }]}
                placeholder="Team B"
                placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
                value={matchData.teamB}
                onChangeText={(text) => setMatchData(prev => ({ ...prev, teamB: text }))}
              />
              
              <TextInput
                style={[styles.textInput, { 
                  color: getColors(colorScheme).text,
                  backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
                  borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
                }]}
                placeholder="Location"
                placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
                value={matchData.location}
                onChangeText={(text) => setMatchData(prev => ({ ...prev, location: text }))}
              />
            </View>
          )}

          {createType === 'team' && (
            <View style={styles.createForm}>
              <Text style={[styles.formLabel, { 
                color: getColors(colorScheme).text 
              }]}>
                Create a Team
              </Text>
              
              <TextInput
                style={[styles.textInput, { 
                  color: getColors(colorScheme).text,
                  backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
                  borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
                }]}
                placeholder="Team Name"
                placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
                value={teamData.name}
                onChangeText={(text) => setTeamData(prev => ({ ...prev, name: text }))}
              />
              
              <TextInput
                style={[styles.textInput, { 
                  color: getColors(colorScheme).text,
                  backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
                  borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
                }]}
                placeholder="Description"
                placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
                value={teamData.description}
                onChangeText={(text) => setTeamData(prev => ({ ...prev, description: text }))}
                multiline
                numberOfLines={3}
              />
              
              <TextInput
                style={[styles.textInput, { 
                  color: getColors(colorScheme).text,
                  backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
                  borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
                }]}
                placeholder="Location"
                placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
                value={teamData.location}
                onChangeText={(text) => setTeamData(prev => ({ ...prev, location: text }))}
              />
            </View>
          )}
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity 
            style={[styles.cancelButton, { 
              backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
              borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
            }]}
            onPress={() => setShowCreateModal(false)}
          >
            <Text style={[styles.cancelButtonText, { 
              color: getColors(colorScheme).text 
            }]}>
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.createButton, { 
              backgroundColor: getColors(colorScheme).tint 
            }]}
            onPress={handleCreateSubmit}
          >
            <Text style={styles.createButtonText}>
              Create {createType === 'post' ? 'Post' : createType === 'match' ? 'Match' : 'Team'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <View style={[styles.bottomNav, { 
        backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
        borderTopColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
      }]}>
        {navItems.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.navButton,
              item.isCenter && styles.centerButton,
              activeSection === item.key && styles.activeButton,
              activeSection === item.key && { backgroundColor: 'rgba(0, 123, 255, 0.1)' }
            ]}
            onPress={() => {
              if (item.key === 'create') {
                handleCreatePress();
              } else {
                onSectionChange(item.key);
              }
            }}
          >
            <Text style={[
              styles.navIcon,
              { 
                color: activeSection === item.key 
                  ? getColors(colorScheme).tint 
                  : getColors(colorScheme).text,
                fontSize: item.isCenter ? 24 : 20
              }
            ]}>
              {activeSection === item.key ? item.activeIcon : item.icon}
            </Text>
            <Text style={[
              styles.navLabel,
              { 
                color: activeSection === item.key 
                  ? getColors(colorScheme).tint 
                  : getColors(colorScheme).text 
              }
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {renderCreateModal()}
    </>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    paddingBottom: 20, // Safe area for bottom
  },
  navButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
  },
  centerButton: {
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  activeButton: {
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
  },
  navIcon: {
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  createTypeSelector: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  createTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  createTypeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  createTypeLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  createForm: {
    gap: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 48,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
