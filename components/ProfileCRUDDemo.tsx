import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import { useProfile } from '@/src/hooks/useProfile';
import React, { useEffect } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

export function ProfileCRUDDemo() {
  const colorScheme = useColorScheme();
  const {
    currentUser,
    profile,
    loading,
    errors,
    isLoading,
    hasError,
    loadCurrentUser,
    createProfile,
    updateProfile,
    deleteProfile,
    clearProfileError
  } = useProfile();

  // Load current user on component mount
  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  // Test create profile with real data structure
  const testCreateProfile = () => {
    const testData = {
      fullName: 'New Cricket Player',
      username: 'cricketplayer',
      email: 'player@thelinecricket.com',
      bio: 'Passionate cricket player looking to improve my game',
      location: 'Mumbai, India',
      skills: {
        batting: 70,
        bowling: 65,
        fielding: 75
      },
      achievements: ['First Century', 'Best Bowling Figures'],
      stats: {
        posts: 0,
        matches: 0,
        followers: 0,
        following: 0,
        wins: 0,
        losses: 0
      }
    };

    createProfile(testData);
  };

  // Test update profile with real data structure
  const testUpdateProfile = () => {
    if (!profile) {
      Alert.alert('Error', 'No profile to update');
      return;
    }

    const updateData = {
      fullName: 'Updated Cricket Player',
      username: 'updatedcricketplayer',
      email: 'updated@thelinecricket.com',
      bio: 'Experienced cricket player with improved skills',
      location: 'Delhi, India',
      skills: {
        batting: 85,
        bowling: 75,
        fielding: 90
      },
      achievements: ['Multiple Centuries', 'Hat-trick Achievement', 'Team Captain'],
      stats: {
        posts: profile.stats?.posts || 0,
        matches: (profile.stats?.matches || 0) + 5,
        followers: (profile.stats?.followers || 0) + 10,
        following: profile.stats?.following || 0,
        wins: (profile.stats?.wins || 0) + 3,
        losses: profile.stats?.losses || 0
      }
    };

    updateProfile(updateData);
  };

  // Test delete profile
  const testDeleteProfile = () => {
    if (!profile) {
      Alert.alert('Error', 'No profile to delete');
      return;
    }

    Alert.alert(
      'Delete Profile',
      'Are you sure you want to delete this test profile?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteProfile(profile.id)
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, {
      backgroundColor: getColors(colorScheme).background
    }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={[styles.title, {
            color: getColors(colorScheme).text
          }]}>
            Profile CRUD Demo
          </Text>
        </View>

        {/* Current Profile Info */}
        <View style={[styles.section, {
          backgroundColor: getColors(colorScheme).cardBackground,
          borderColor: getColors(colorScheme).border
        }]}>
          <Text style={[styles.sectionTitle, {
            color: getColors(colorScheme).text
          }]}>
            Current Profile
          </Text>
          
          {currentUser ? (
            <View>
              <Text style={[styles.infoText, {
                color: getColors(colorScheme).text
              }]}>
                Name: {currentUser.fullName || 'N/A'}
              </Text>
              <Text style={[styles.infoText, {
                color: getColors(colorScheme).text
              }]}>
                Username: {currentUser.username || 'N/A'}
              </Text>
              <Text style={[styles.infoText, {
                color: getColors(colorScheme).text
              }]}>
                Email: {currentUser.email || 'N/A'}
              </Text>
              <Text style={[styles.infoText, {
                color: getColors(colorScheme).text
              }]}>
                Bio: {currentUser.bio || 'N/A'}
              </Text>
              <Text style={[styles.infoText, {
                color: getColors(colorScheme).text
              }]}>
                Location: {currentUser.location || 'N/A'}
              </Text>
            </View>
          ) : (
            <Text style={[styles.noDataText, {
              color: getColors(colorScheme).text
            }]}>
              No profile data available
            </Text>
          )}
        </View>

        {/* Loading States */}
        <View style={[styles.section, {
          backgroundColor: getColors(colorScheme).cardBackground,
          borderColor: getColors(colorScheme).border
        }]}>
          <Text style={[styles.sectionTitle, {
            color: getColors(colorScheme).text
          }]}>
            Loading States
          </Text>
          
          <Text style={[styles.infoText, {
            color: getColors(colorScheme).text
          }]}>
            Current User Loading: {loading.currentUser ? 'Yes' : 'No'}
          </Text>
          <Text style={[styles.infoText, {
            color: getColors(colorScheme).text
          }]}>
            Updating: {loading.updating ? 'Yes' : 'No'}
          </Text>
          <Text style={[styles.infoText, {
            color: getColors(colorScheme).text
          }]}>
            Creating: {loading.creating ? 'Yes' : 'No'}
          </Text>
          <Text style={[styles.infoText, {
            color: getColors(colorScheme).text
          }]}>
            Deleting: {loading.deleting ? 'Yes' : 'No'}
          </Text>
          <Text style={[styles.infoText, {
            color: getColors(colorScheme).text
          }]}>
            Is Loading: {isLoading ? 'Yes' : 'No'}
          </Text>
        </View>

        {/* Error States */}
        {hasError && (
          <View style={[styles.section, {
            backgroundColor: '#ff4757',
            borderColor: '#ff4757'
          }]}>
            <Text style={[styles.sectionTitle, {
              color: 'white'
            }]}>
              Errors
            </Text>
            
            {Object.entries(errors).map(([key, error]) => (
              error && (
                <Text key={key} style={[styles.errorText, {
                  color: 'white'
                }]}>
                  {key}: {error}
                </Text>
              )
            ))}
            
            <TouchableOpacity 
              style={styles.clearErrorButton}
              onPress={() => clearProfileError()}
            >
              <Text style={styles.clearErrorButtonText}>Clear Errors</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Test Buttons */}
        <View style={[styles.section, {
          backgroundColor: getColors(colorScheme).cardBackground,
          borderColor: getColors(colorScheme).border
        }]}>
          <Text style={[styles.sectionTitle, {
            color: getColors(colorScheme).text
          }]}>
            Test CRUD Operations
          </Text>
          
          <TouchableOpacity 
            style={[styles.testButton, {
              backgroundColor: getColors(colorScheme).tint
            }]}
            onPress={testCreateProfile}
            disabled={isLoading}
          >
            <Text style={styles.testButtonText}>
              {loading.creating ? 'Creating...' : 'Test Create Profile'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.testButton, {
              backgroundColor: '#ffa502'
            }]}
            onPress={testUpdateProfile}
            disabled={isLoading || !currentUser}
          >
            <Text style={styles.testButtonText}>
              {loading.updating ? 'Updating...' : 'Test Update Profile'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.testButton, {
              backgroundColor: '#ff4757'
            }]}
            onPress={testDeleteProfile}
            disabled={isLoading || !currentUser}
          >
            <Text style={styles.testButtonText}>
              {loading.deleting ? 'Deleting...' : 'Test Delete Profile'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* API Status */}
        <View style={[styles.section, {
          backgroundColor: getColors(colorScheme).cardBackground,
          borderColor: getColors(colorScheme).border
        }]}>
          <Text style={[styles.sectionTitle, {
            color: getColors(colorScheme).text
          }]}>
            API Status
          </Text>
          
          <Text style={[styles.infoText, {
            color: getColors(colorScheme).text
          }]}>
            Server URL: http://43.205.177.37:5000
          </Text>
          <Text style={[styles.infoText, {
            color: getColors(colorScheme).text
          }]}>
            API Version: 1.0.0
          </Text>
          <Text style={[styles.infoText, {
            color: getColors(colorScheme).text
          }]}>
            Endpoints: /api/users, /api/users/me, /api/users/profile
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  section: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
  },
  noDataText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    marginBottom: 8,
  },
  clearErrorButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  clearErrorButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  testButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
