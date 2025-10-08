import { Text } from '@/components/Themed';
import { ProfileCard } from '@/components/ui/ProfileCard';
import { ProfileForm } from '@/components/ui/ProfileForm';
import { getColors } from '@/constants/Colors';
import { useAuth } from '@/src/hooks/useAuth';
import { useProfile } from '@/src/hooks/useProfile';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

interface ProfileFormData {
  fullName: string;
  username: string;
  email: string;
  bio: string;
  location: string;
  skills: {
    batting: number;
    bowling: number;
    fielding: number;
  };
  achievements: string[];
}

export default function ProfileCRUDScreen() {
  const colorScheme = useColorScheme();
  const { user: authUser, isAuthenticated } = useAuth();
  const {
    currentUser,
    profile,
    loading,
    errors,
    isLoading,
    hasError,
    isOwnProfile,
    loadCurrentUser,
    createProfile,
    updateProfile,
    deleteProfile,
    startEditing,
    stopEditing,
    startDeleting,
    stopDeleting,
    clearProfileError
  } = useProfile();

  // Local state
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load current user on component mount
  useEffect(() => {
    if (isAuthenticated && authUser) {
      loadCurrentUser();
    }
  }, [isAuthenticated, authUser, loadCurrentUser]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadCurrentUser();
    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle create profile
  const handleCreateProfile = () => {
    setIsCreating(true);
    setShowProfileForm(true);
  };

  // Handle edit profile
  const handleEditProfile = () => {
    setIsEditing(true);
    setShowProfileForm(true);
  };

  // Handle delete profile
  const handleDeleteProfile = () => {
    Alert.alert(
      'Delete Profile',
      'Are you sure you want to delete your profile? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              await deleteProfile(profile.id);
              Alert.alert('Success', 'Profile deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete profile');
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };

  // Handle form submission
  const handleFormSubmit = async (formData: ProfileFormData) => {
    try {
      if (isCreating) {
        await createProfile(formData);
        Alert.alert('Success', 'Profile created successfully');
      } else if (isEditing) {
        await updateProfile(formData);
        Alert.alert('Success', 'Profile updated successfully');
      }
      setShowProfileForm(false);
      setIsCreating(false);
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  // Handle form close
  const handleFormClose = () => {
    setShowProfileForm(false);
    setIsCreating(false);
    setIsEditing(false);
    clearProfileError();
  };

  // Handle follow/unfollow (placeholder)
  const handleFollow = (userId: string) => {
    console.log('Follow user:', userId);
  };

  const handleUnfollow = (userId: string) => {
    console.log('Unfollow user:', userId);
  };

  // Handle message (placeholder)
  const handleMessage = (userId: string) => {
    console.log('Message user:', userId);
  };

  // Handle view posts (placeholder)
  const handleViewPosts = (userId: string) => {
    console.log('View posts for user:', userId);
  };

  // Handle view matches (placeholder)
  const handleViewMatches = (userId: string) => {
    console.log('View matches for user:', userId);
  };

  // Convert profile data for ProfileCard
  const getProfileCardData = () => {
    if (!profile || !currentUser) return null;

    return {
      id: profile.id || currentUser.id,
      username: profile.username || currentUser.username || '',
      fullName: profile.fullName || currentUser.fullName || '',
      email: profile.email || currentUser.email || '',
      bio: profile.bio || '',
      location: profile.location || '',
      avatar: profile.avatar || currentUser.avatar || '',
      coverImage: profile.coverImage || '',
      stats: {
        posts: profile.stats?.posts || 0,
        matches: profile.stats?.matches || 0,
        followers: profile.stats?.followers || 0,
        following: profile.stats?.following || 0,
        wins: profile.stats?.wins || 0,
        losses: profile.stats?.losses || 0
      },
      skills: {
        batting: profile.skills?.batting || 0,
        bowling: profile.skills?.bowling || 0,
        fielding: profile.skills?.fielding || 0,
        overall: profile.skills?.overall || 0
      },
      achievements: profile.achievements || [],
      isFollowing: false,
      isOwnProfile: isOwnProfile,
      joinedDate: profile.joinedDate ? new Date(profile.joinedDate) : new Date()
    };
  };

  // Convert profile data for form
  const getFormData = (): ProfileFormData => {
    if (!profile) {
      return {
        fullName: '',
        username: '',
        email: '',
        bio: '',
        location: '',
        skills: {
          batting: 0,
          bowling: 0,
          fielding: 0
        },
        achievements: []
      };
    }

    return {
      fullName: profile.fullName || '',
      username: profile.username || '',
      email: profile.email || '',
      bio: profile.bio || '',
      location: profile.location || '',
      skills: {
        batting: profile.skills?.batting || 0,
        bowling: profile.skills?.bowling || 0,
        fielding: profile.skills?.fielding || 0
      },
      achievements: profile.achievements || []
    };
  };

  // Show loading state
  if (isLoading && !currentUser) {
    return (
      <SafeAreaView style={[styles.container, {
        backgroundColor: getColors(colorScheme).background
      }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, {
            color: getColors(colorScheme).text
          }]}>
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (hasError && !currentUser) {
    return (
      <SafeAreaView style={[styles.container, {
        backgroundColor: getColors(colorScheme).background
      }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, {
            color: getColors(colorScheme).text
          }]}>
            Failed to load profile
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, {
              backgroundColor: getColors(colorScheme).tint
            }]}
            onPress={handleRefresh}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Show create profile button if no profile exists
  if (!currentUser && !isLoading) {
    return (
      <SafeAreaView style={[styles.container, {
        backgroundColor: getColors(colorScheme).background
      }]}>
        <View style={styles.noProfileContainer}>
          <Text style={[styles.noProfileText, {
            color: getColors(colorScheme).text
          }]}>
            No profile found
          </Text>
          <TouchableOpacity 
            style={[styles.createButton, {
              backgroundColor: getColors(colorScheme).tint
            }]}
            onPress={handleCreateProfile}
          >
            <Text style={styles.createButtonText}>Create Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const profileCardData = getProfileCardData();

  return (
    <SafeAreaView style={[styles.container, {
      backgroundColor: getColors(colorScheme).background
    }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={getColors(colorScheme).tint}
          />
        }
      >
        {/* Header */}
        <View style={[styles.header, {
          borderBottomColor: getColors(colorScheme).border
        }]}>
          <Text style={[styles.headerTitle, {
            color: getColors(colorScheme).text
          }]}>
            Profile Management
          </Text>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={[styles.actionButton, {
                backgroundColor: getColors(colorScheme).tint
              }]}
              onPress={handleEditProfile}
              disabled={isLoading}
            >
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, {
                backgroundColor: '#ff4757'
              }]}
              onPress={handleDeleteProfile}
              disabled={isLoading || isDeleting}
            >
              <Text style={styles.actionButtonText}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Card */}
        {profileCardData && (
          <ProfileCard
            profile={profileCardData}
            onFollow={handleFollow}
            onUnfollow={handleUnfollow}
            onEdit={handleEditProfile}
            onDelete={handleDeleteProfile}
            onMessage={handleMessage}
            onViewPosts={handleViewPosts}
            onViewMatches={handleViewMatches}
            isLoading={isLoading}
            isEditing={isEditing}
            isDeleting={isDeleting}
          />
        )}

        {/* Error Display */}
        {hasError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>
              {Object.values(errors).find(error => error) || 'An error occurred'}
            </Text>
            <TouchableOpacity onPress={() => clearProfileError()}>
              <Text style={styles.dismissErrorText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Profile Form Modal */}
      <ProfileForm
        visible={showProfileForm}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={getFormData()}
        isEditing={isEditing}
        isLoading={isLoading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  noProfileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noProfileText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  createButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  errorBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ff4757',
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 16,
    borderRadius: 8,
  },
  errorBannerText: {
    color: 'white',
    fontSize: 14,
    flex: 1,
  },
  dismissErrorText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
