import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import { useProfile } from '@/src/hooks/useProfile';
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

export function APITestComponent() {
  const colorScheme = useColorScheme();
  const {
    currentUser,
    profile,
    loading,
    errors,
    isLoading,
    hasError,
    loadCurrentUser,
    clearProfileError
  } = useProfile();

  const [testResults, setTestResults] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Load current user on component mount
  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  // Test API connection
  const testAPIConnection = async () => {
    setIsTesting(true);
    try {
      // Test the API connection by making a simple request
      const response = await fetch('http://43.205.177.37:5000/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTestResults({
          status: 'success',
          message: 'API connection successful',
          data: data,
          timestamp: new Date().toISOString()
        });
      } else {
        setTestResults({
          status: 'error',
          message: `API connection failed: ${response.status} ${response.statusText}`,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      setTestResults({
        status: 'error',
        message: `API connection failed: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Test user profile fetch
  const testUserProfileFetch = async () => {
    setIsTesting(true);
    try {
      await loadCurrentUser();
      setTestResults({
        status: 'success',
        message: 'User profile fetch completed',
        data: { currentUser, profile },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setTestResults({
        status: 'error',
        message: `User profile fetch failed: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsTesting(false);
    }
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
            API Connection Test
          </Text>
        </View>

        {/* Server Information */}
        <View style={[styles.section, {
          backgroundColor: getColors(colorScheme).cardBackground,
          borderColor: getColors(colorScheme).border
        }]}>
          <Text style={[styles.sectionTitle, {
            color: getColors(colorScheme).text
          }]}>
            Server Configuration
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

        {/* Test Buttons */}
        <View style={[styles.section, {
          backgroundColor: getColors(colorScheme).cardBackground,
          borderColor: getColors(colorScheme).border
        }]}>
          <Text style={[styles.sectionTitle, {
            color: getColors(colorScheme).text
          }]}>
            API Tests
          </Text>
          
          <TouchableOpacity 
            style={[styles.testButton, {
              backgroundColor: getColors(colorScheme).tint
            }]}
            onPress={testAPIConnection}
            disabled={isTesting}
          >
            <Text style={styles.testButtonText}>
              {isTesting ? 'Testing...' : 'Test API Connection'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.testButton, {
              backgroundColor: '#ffa502'
            }]}
            onPress={testUserProfileFetch}
            disabled={isLoading || isTesting}
          >
            <Text style={styles.testButtonText}>
              {isLoading ? 'Loading...' : 'Test User Profile Fetch'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Current Profile Data */}
        <View style={[styles.section, {
          backgroundColor: getColors(colorScheme).cardBackground,
          borderColor: getColors(colorScheme).border
        }]}>
          <Text style={[styles.sectionTitle, {
            color: getColors(colorScheme).text
          }]}>
            Current Profile Data
          </Text>
          
          {currentUser ? (
            <View>
              <Text style={[styles.infoText, {
                color: getColors(colorScheme).text
              }]}>
                ID: {currentUser.id || 'N/A'}
              </Text>
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
            </View>
          ) : (
            <Text style={[styles.noDataText, {
              color: getColors(colorScheme).text
            }]}>
              No current user data available
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
            Viewed Profile Loading: {loading.viewedProfile ? 'Yes' : 'No'}
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

        {/* Test Results */}
        {testResults && (
          <View style={[styles.section, {
            backgroundColor: testResults.status === 'success' ? '#2ed573' : '#ff4757',
            borderColor: testResults.status === 'success' ? '#2ed573' : '#ff4757'
          }]}>
            <Text style={[styles.sectionTitle, {
              color: 'white'
            }]}>
              Test Results
            </Text>
            
            <Text style={[styles.resultText, {
              color: 'white'
            }]}>
              Status: {testResults.status}
            </Text>
            <Text style={[styles.resultText, {
              color: 'white'
            }]}>
              Message: {testResults.message}
            </Text>
            <Text style={[styles.resultText, {
              color: 'white'
            }]}>
              Timestamp: {testResults.timestamp}
            </Text>
            
            {testResults.data && (
              <Text style={[styles.resultText, {
                color: 'white'
              }]}>
                Data: {JSON.stringify(testResults.data, null, 2)}
              </Text>
            )}
          </View>
        )}
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
  resultText: {
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
