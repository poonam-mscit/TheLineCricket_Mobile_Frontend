import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator, Alert,
    Dimensions, Image, SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity, useColorScheme, View
} from 'react-native';


interface CreatePostFormData {
  caption: string;
  images: string[];
  video: string;
  location: string;
  visibility: 'public' | 'followers' | 'private';
  post_type: 'text' | 'image' | 'video';
  hashtags: string[];
  mentions: string[];
}

interface MediaItem {
  uri: string;
  type: 'image' | 'video';
  name?: string;
}

export default function CreatePostScreen() {
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
  const colorScheme = useColorScheme();
  const { width } = Dimensions.get('window');
  
  // Mock user data following existing patterns
  const user = {
    id: '1',
    fullName: 'Demo User',
    username: 'demo_user',
    email: 'demo@example.com',
    avatar: 'https://via.placeholder.com/40',
    verified: true
  };

  // Form data state following existing patterns
  const [formData, setFormData] = useState<CreatePostFormData>({
    caption: '',
    images: [],
    video: '',
    location: '',
    visibility: 'public',
    post_type: 'text',
    hashtags: [],
    mentions: []
  });

  // Event handlers following existing patterns
  const handleInputChange = (field: keyof CreatePostFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Post Creation',
      'Are you sure you want to cancel? All progress will be lost.',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Cancel', style: 'destructive', onPress: () => router.back() }
      ]
    );
  };

  const handleCreatePost = async () => {
    setIsCreating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create new post object
      const newPost = {
        id: Date.now().toString(),
        content: formData.caption,
        images: selectedMedia.filter(m => m.type === 'image').map(m => m.uri),
        video: selectedMedia.find(m => m.type === 'video')?.uri || '',
        location: formData.location,
        visibility: formData.visibility,
        postType: formData.post_type,
        hashtags: formData.hashtags,
        mentions: formData.mentions,
        author: {
          id: user.id,
          name: user.fullName,
          username: user.username,
          avatar: user.avatar,
          verified: user.verified
        },
        timestamp: new Date(),
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        isBookmarked: false
      };

      // Store in AsyncStorage for persistence
      try {
        // Store in home feed
        const existingHomePosts = await AsyncStorage.getItem('home_posts');
        const homePosts = existingHomePosts ? JSON.parse(existingHomePosts) : [];
        homePosts.unshift(newPost); // Add to beginning of array
        await AsyncStorage.setItem('home_posts', JSON.stringify(homePosts));

        // Store in user's profile posts
        const existingUserPosts = await AsyncStorage.getItem('user_posts');
        const userPosts = existingUserPosts ? JSON.parse(existingUserPosts) : [];
        userPosts.unshift(newPost); // Add to beginning of array
        await AsyncStorage.setItem('user_posts', JSON.stringify(userPosts));
      } catch (storageError) {
        console.log('Storage error:', storageError);
      }
      
      Alert.alert(
        'Post Created!',
        'Your post has been created successfully.',
        [
          { text: 'OK', onPress: () => router.replace('/home') }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  // Media selection handlers
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant permission to access your media library.');
      return false;
    }
    return true;
  };

  const pickImages = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        maxImages: 10,
      });

      if (!result.canceled && result.assets) {
        const newMedia: MediaItem[] = result.assets.map(asset => ({
          uri: asset.uri,
          type: 'image' as const,
          name: asset.fileName || `image_${Date.now()}.jpg`
        }));
        setSelectedMedia(prev => [...prev, ...newMedia]);
        handleInputChange('post_type', 'image');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select images. Please try again.');
    }
  };

  const pickVideo = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsMultipleSelection: false,
        quality: 0.8,
        videoMaxDuration: 60, // 60 seconds max
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const videoAsset = result.assets[0];
        const newMedia: MediaItem = {
          uri: videoAsset.uri,
          type: 'video' as const,
          name: videoAsset.fileName || `video_${Date.now()}.mp4`
        };
        setSelectedMedia([newMedia]); // Replace all media with video
        handleInputChange('post_type', 'video');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select video. Please try again.');
    }
  };

  const removeMedia = (index: number) => {
    setSelectedMedia(prev => prev.filter((_, i) => i !== index));
    if (selectedMedia.length === 1) {
      handleInputChange('post_type', 'text');
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
          Create Post
        </Text>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={handleCancel}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );


  const renderMediaUpload = () => (
    <View style={[styles.mediaUploadContainer, { backgroundColor: getColors(colorScheme).card }]}>
      <Text style={[styles.sectionTitle, { color: getColors(colorScheme).text }]}>
        Add Media
      </Text>
      
      {/* Selected Media Preview */}
      {selectedMedia.length > 0 && (
        <View style={styles.selectedMediaContainer}>
          <Text style={[styles.selectedMediaTitle, { color: getColors(colorScheme).text }]}>
            Selected Media ({selectedMedia.length})
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaPreviewContainer}>
            {selectedMedia.map((media, index) => (
              <View key={index} style={styles.mediaPreviewItem}>
                <Image
                  source={{ uri: media.uri }}
                  style={styles.mediaPreviewImage}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.removeMediaButton}
                  onPress={() => removeMedia(index)}
                >
                  <Text style={styles.removeMediaIcon}>✕</Text>
                </TouchableOpacity>
                <View style={styles.mediaTypeIndicator}>
                  <Text style={styles.mediaTypeText}>
                    {media.type === 'video' ? '🎥' : '📷'}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Media Selection Buttons */}
      <View style={styles.mediaUploadGrid}>
        <TouchableOpacity 
          style={[styles.mediaUploadButton, { borderColor: getColors(colorScheme).border }]}
          onPress={pickImages}
        >
          <Text style={styles.mediaUploadIcon}>📷</Text>
          <Text style={[styles.mediaUploadText, { color: getColors(colorScheme).text }]}>
            Photos
          </Text>
          <Text style={[styles.mediaUploadSubtext, { color: getColors(colorScheme).text }]}>
            Up to 10 images
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.mediaUploadButton, { borderColor: getColors(colorScheme).border }]}
          onPress={pickVideo}
        >
          <Text style={styles.mediaUploadIcon}>🎥</Text>
          <Text style={[styles.mediaUploadText, { color: getColors(colorScheme).text }]}>
            Video
          </Text>
          <Text style={[styles.mediaUploadSubtext, { color: getColors(colorScheme).text }]}>
            Up to 60 seconds
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCaptionSection = () => (
    <View style={[styles.captionContainer, { backgroundColor: getColors(colorScheme).card }]}>
      <Text style={[styles.sectionTitle, { color: getColors(colorScheme).text }]}>
        Caption
      </Text>
      <TextInput
        style={[
          styles.captionInput,
          { 
            backgroundColor: getColors(colorScheme).background,
            color: getColors(colorScheme).text,
            borderColor: errors.caption ? getColors(colorScheme).error : getColors(colorScheme).border
          }
        ]}
        placeholder="What's happening in cricket today?"
        placeholderTextColor={getColors(colorScheme).text}
        value={formData.caption}
        onChangeText={(value) => handleInputChange('caption', value)}
        multiline
        numberOfLines={4}
        maxLength={500}
      />
      <View style={styles.characterCounter}>
        <Text style={[styles.characterCount, { color: getColors(colorScheme).text }]}>
          {formData.caption.length}/500
        </Text>
      </View>
      {errors.caption && <Text style={[styles.errorText, { color: getColors(colorScheme).error }]}>{errors.caption}</Text>}
    </View>
  );

  const renderLocationSection = () => (
    <View style={[styles.locationContainer, { backgroundColor: getColors(colorScheme).card }]}>
      <Text style={[styles.sectionTitle, { color: getColors(colorScheme).text }]}>
        Location
      </Text>
      <View style={styles.locationInputContainer}>
        <Text style={styles.locationIcon}>📍</Text>
        <TextInput
          style={[
            styles.locationInput,
            { 
              backgroundColor: getColors(colorScheme).background,
              color: getColors(colorScheme).text,
              borderColor: getColors(colorScheme).border
            }
          ]}
          placeholder="Add location"
          placeholderTextColor={getColors(colorScheme).text}
          value={formData.location}
          onChangeText={(value) => handleInputChange('location', value)}
        />
      </View>
    </View>
  );

  const renderVisibilitySection = () => (
    <View style={[styles.visibilityContainer, { backgroundColor: getColors(colorScheme).card }]}>
      <Text style={[styles.sectionTitle, { color: getColors(colorScheme).text }]}>
        Visibility
      </Text>
      <View style={styles.visibilityOptions}>
        <TouchableOpacity 
          style={[
            styles.visibilityOption,
            { 
              backgroundColor: formData.visibility === 'public' ? getColors(colorScheme).primary : getColors(colorScheme).background,
              borderColor: formData.visibility === 'public' ? getColors(colorScheme).primary : getColors(colorScheme).border
            }
          ]}
          onPress={() => handleInputChange('visibility', 'public')}
        >
          <Text style={styles.visibilityIcon}>🌍</Text>
          <Text style={[
            styles.visibilityText,
            { color: formData.visibility === 'public' ? 'white' : getColors(colorScheme).text }
          ]}>
            Public
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.visibilityOption,
            { 
              backgroundColor: formData.visibility === 'followers' ? getColors(colorScheme).primary : getColors(colorScheme).background,
              borderColor: formData.visibility === 'followers' ? getColors(colorScheme).primary : getColors(colorScheme).border
            }
          ]}
          onPress={() => handleInputChange('visibility', 'followers')}
        >
          <Text style={styles.visibilityIcon}>👥</Text>
          <Text style={[
            styles.visibilityText,
            { color: formData.visibility === 'followers' ? 'white' : getColors(colorScheme).text }
          ]}>
            Followers
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.visibilityOption,
            { 
              backgroundColor: formData.visibility === 'private' ? getColors(colorScheme).primary : getColors(colorScheme).background,
              borderColor: formData.visibility === 'private' ? getColors(colorScheme).primary : getColors(colorScheme).border
            }
          ]}
          onPress={() => handleInputChange('visibility', 'private')}
        >
          <Text style={styles.visibilityIcon}>🔒</Text>
          <Text style={[
            styles.visibilityText,
            { color: formData.visibility === 'private' ? 'white' : getColors(colorScheme).text }
          ]}>
            Private
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSubmitButton = () => (
    <View style={styles.submitContainer}>
      <TouchableOpacity 
        style={[
          styles.submitButton,
          { backgroundColor: getColors(colorScheme).primary },
          isCreating && styles.disabledButton
        ]}
        onPress={handleCreatePost}
        disabled={isCreating}
      >
        {isCreating ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={styles.submitButtonText}>
            Share Post
          </Text>
        )}
      </TouchableOpacity>
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
        {renderMediaUpload()}
        {renderCaptionSection()}
        {renderLocationSection()}
        {renderVisibilitySection()}
        {renderSubmitButton()}
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
  mediaUploadContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  mediaUploadGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  mediaUploadButton: {
    flex: 1,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  mediaUploadIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  mediaUploadText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  mediaUploadSubtext: {
    fontSize: 12,
    opacity: 0.7,
  },
  captionContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  captionInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  characterCounter: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  characterCount: {
    fontSize: 12,
    opacity: 0.7,
  },
  locationContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  locationInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  visibilityContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  visibilityOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  visibilityOption: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  visibilityIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  visibilityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  submitContainer: {
    paddingVertical: 16,
  },
  submitButton: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  selectedMediaContainer: {
    marginBottom: 16,
  },
  selectedMediaTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  mediaPreviewContainer: {
    flexDirection: 'row',
  },
  mediaPreviewItem: {
    position: 'relative',
    marginRight: 8,
  },
  mediaPreviewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  removeMediaButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ff4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  removeMediaIcon: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  mediaTypeIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  mediaTypeText: {
    color: 'white',
    fontSize: 10,
  },
});
