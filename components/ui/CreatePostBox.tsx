import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import { getColors } from '@/constants/Colors';
import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface CreatePostBoxProps {
  onCreatePost: (content: string) => void;
}

export function CreatePostBox({ onCreatePost }: CreatePostBoxProps) {
  const [postContent, setPostContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const colorScheme = useColorScheme();
  
  // Mock user data since we removed authentication
  const user = {
    fullName: 'Demo User'
  };

  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      Alert.alert('Error', 'Please write something before posting');
      return;
    }

    if (postContent.length > 500) {
      Alert.alert('Error', 'Post is too long. Maximum 500 characters.');
      return;
    }

    try {
      setIsCreating(true);
      await onCreatePost(postContent.trim());
      setPostContent('');
      Alert.alert('Success', 'Post created successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <View style={[styles.container, { 
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
      borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
    }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.avatar, { 
          backgroundColor: getColors(colorScheme).tint 
        }]}>
          <Text style={styles.avatarText}>
            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.textInput, { 
              color: getColors(colorScheme).text,
              backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
              borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
            }]}
            placeholder="What's happening in cricket today?"
            placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
            value={postContent}
            onChangeText={setPostContent}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={[styles.characterCount, { 
            color: getColors(colorScheme).text 
          }]}>
            {postContent.length}/500
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={[styles.actionIcon, { 
              color: getColors(colorScheme).text 
            }]}>
              📷
            </Text>
            <Text style={[styles.actionText, { 
              color: getColors(colorScheme).text 
            }]}>
              Photo
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={[styles.actionIcon, { 
              color: getColors(colorScheme).text 
            }]}>
              📍
            </Text>
            <Text style={[styles.actionText, { 
              color: getColors(colorScheme).text 
            }]}>
              Location
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[
            styles.postButton, 
            { 
              backgroundColor: postContent.trim() 
                ? getColors(colorScheme).tint 
                : '#ccc',
              opacity: postContent.trim() && !isCreating ? 1 : 0.6
            }
          ]}
          onPress={handleCreatePost}
          disabled={!postContent.trim() || isCreating}
        >
          <Text style={styles.postButtonText}>
            {isCreating ? 'Posting...' : 'Post'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    flex: 1,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    maxHeight: 120,
  },
  characterCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
    opacity: 0.6,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftActions: {
    flexDirection: 'row',
    flex: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  actionText: {
    fontSize: 14,
    opacity: 0.7,
  },
  postButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
