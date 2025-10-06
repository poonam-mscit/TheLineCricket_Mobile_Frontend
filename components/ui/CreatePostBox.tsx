import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
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
      backgroundColor: Colors[colorScheme ?? 'light'].background,
      borderColor: Colors[colorScheme ?? 'light'].border
    }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.avatar, { 
          backgroundColor: Colors[colorScheme ?? 'light'].tint 
        }]}>
          <Text style={styles.avatarText}>
            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.textInput, { 
              color: Colors[colorScheme ?? 'light'].text,
              backgroundColor: Colors[colorScheme ?? 'light'].card,
              borderColor: Colors[colorScheme ?? 'light'].border
            }]}
            placeholder="What's happening in cricket today?"
            placeholderTextColor={Colors[colorScheme ?? 'light'].text}
            value={postContent}
            onChangeText={setPostContent}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={[styles.characterCount, { 
            color: Colors[colorScheme ?? 'light'].text 
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
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              📷
            </Text>
            <Text style={[styles.actionText, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Photo
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={[styles.actionIcon, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              📍
            </Text>
            <Text style={[styles.actionText, { 
              color: Colors[colorScheme ?? 'light'].text 
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
                ? Colors[colorScheme ?? 'light'].tint 
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
