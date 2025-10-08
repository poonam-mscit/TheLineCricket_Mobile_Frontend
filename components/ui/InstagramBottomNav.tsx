import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';

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
  const [createType, setCreateType] = useState<'post'>('post');
  
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
    setShowCreateModal(false);
  };

  const renderCreateModal = () => (
    <Modal
      visible={showCreateModal}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setShowCreateModal(false)}
    >
      <View style={styles.modalOverlay}>
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

          <View style={styles.createOptionsContainer}>
            <TouchableOpacity 
              style={[styles.createOption, { 
                backgroundColor: getColors(colorScheme).background,
                borderColor: getColors(colorScheme).border
              }]}
              onPress={() => {
                router.push('/create-post');
                setShowCreateModal(false);
              }}
            >
              <View style={[styles.createOptionIcon, { backgroundColor: '#3B82F6' }]}>
                <Text style={styles.createOptionEmoji}>📝</Text>
              </View>
              <View style={styles.createOptionContent}>
                <Text style={[styles.createOptionTitle, { color: getColors(colorScheme).text }]}>
                  Create Post
                </Text>
                <Text style={[styles.createOptionDescription, { color: getColors(colorScheme).text }]}>
                  Share your cricket thoughts and updates
                </Text>
              </View>
              <Text style={[styles.createOptionArrow, { color: getColors(colorScheme).text }]}>
                →
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.createOption, { 
                backgroundColor: getColors(colorScheme).background,
                borderColor: getColors(colorScheme).border
              }]}
              onPress={() => {
                router.push('/create-match');
                setShowCreateModal(false);
              }}
            >
              <View style={[styles.createOptionIcon, { backgroundColor: '#10B981' }]}>
                <Text style={styles.createOptionEmoji}>🏏</Text>
              </View>
              <View style={styles.createOptionContent}>
                <Text style={[styles.createOptionTitle, { color: getColors(colorScheme).text }]}>
                  Create Match
                </Text>
                <Text style={[styles.createOptionDescription, { color: getColors(colorScheme).text }]}>
                  Organize and schedule cricket matches
                </Text>
              </View>
              <Text style={[styles.createOptionArrow, { color: getColors(colorScheme).text }]}>
                →
              </Text>
            </TouchableOpacity>
          </View>
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
              } else if (item.key === 'search') {
                router.push('/search');
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
                fontSize: item.isCenter ? 20 : 16
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
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    paddingBottom: 16, // Safe area for bottom
    maxWidth: '100%',
    alignSelf: 'center',
  },
  navButton: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    flex: 1,
    minWidth: 60,
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
    marginBottom: 2,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
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
  createOptionsContainer: {
    padding: 20,
    gap: 12,
  },
  createOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  createOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  createOptionEmoji: {
    fontSize: 20,
  },
  createOptionContent: {
    flex: 1,
  },
  createOptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  createOptionDescription: {
    fontSize: 12,
    opacity: 0.7,
    lineHeight: 16,
  },
  createOptionArrow: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
