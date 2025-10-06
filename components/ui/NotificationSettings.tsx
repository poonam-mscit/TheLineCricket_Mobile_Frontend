import { Text } from '@/components/Themed';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

interface NotificationSettingsProps {
  onSave: (settings: NotificationSettingsData) => void;
  onCancel: () => void;
  initialSettings?: NotificationSettingsData;
}

export interface NotificationSettingsData {
  pushNotifications: boolean;
  emailNotifications: boolean;
  matchReminders: boolean;
  teamUpdates: boolean;
  friendRequests: boolean;
  messageNotifications: boolean;
  systemUpdates: boolean;
  marketingEmails: boolean;
  reminderTime: number; // minutes before match
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
  soundSettings: {
    enabled: boolean;
    volume: number;
    customSound: boolean;
  };
  vibrationSettings: {
    enabled: boolean;
    pattern: 'light' | 'medium' | 'strong';
  };
}

export function NotificationSettings({ 
  onSave, 
  onCancel, 
  initialSettings 
}: NotificationSettingsProps) {
  const [settings, setSettings] = useState<NotificationSettingsData>({
    pushNotifications: true,
    emailNotifications: true,
    matchReminders: true,
    teamUpdates: true,
    friendRequests: true,
    messageNotifications: true,
    systemUpdates: true,
    marketingEmails: false,
    reminderTime: 60,
    quietHours: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00'
    },
    soundSettings: {
      enabled: true,
      volume: 0.8,
      customSound: false
    },
    vibrationSettings: {
      enabled: true,
      pattern: 'medium'
    },
    ...initialSettings
  });
  
  const colorScheme = useColorScheme();

  const handleToggle = (key: keyof NotificationSettingsData, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleNestedToggle = (parent: keyof NotificationSettingsData, key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [key]: value
      }
    }));
  };

  const handleSelect = (key: keyof NotificationSettingsData, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(settings);
  };

  const reminderOptions = [15, 30, 60, 120, 240]; // minutes
  const vibrationPatterns = ['light', 'medium', 'strong'];

  return (
    <View style={[styles.container, { 
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
      borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
    }]}>
      <Text style={[styles.title, { 
        color: Colors[colorScheme ?? 'light'].text 
      }]}>
        Notification Settings
      </Text>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* General Notifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            General Notifications
          </Text>
          
          <View style={[styles.settingCard, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
            borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
          }]}>
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingIcon}>🔔</Text>
                <View style={styles.settingItemText}>
                  <Text style={[styles.settingTitle, { 
                    color: Colors[colorScheme ?? 'light'].text 
                  }]}>
                    Push Notifications
                  </Text>
                  <Text style={[styles.settingSubtitle, { 
                    color: Colors[colorScheme ?? 'light'].text 
                  }]}>
                    Receive notifications on your device
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.pushNotifications}
                onValueChange={(value) => handleToggle('pushNotifications', value)}
                trackColor={{ 
                  false: colorScheme === 'dark' ? '#555' : '#e0e0e0', 
                  true: Colors[colorScheme ?? 'light'].tint 
                }}
                thumbColor={settings.pushNotifications ? 'white' : '#f4f3f4'}
              />
            </View>
          </View>

          <View style={[styles.settingCard, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
            borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
          }]}>
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingIcon}>📧</Text>
                <View style={styles.settingItemText}>
                  <Text style={[styles.settingTitle, { 
                    color: Colors[colorScheme ?? 'light'].text 
                  }]}>
                    Email Notifications
                  </Text>
                  <Text style={[styles.settingSubtitle, { 
                    color: Colors[colorScheme ?? 'light'].text 
                  }]}>
                    Receive notifications via email
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.emailNotifications}
                onValueChange={(value) => handleToggle('emailNotifications', value)}
                trackColor={{ 
                  false: colorScheme === 'dark' ? '#555' : '#e0e0e0', 
                  true: Colors[colorScheme ?? 'light'].tint 
                }}
                thumbColor={settings.emailNotifications ? 'white' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* Match Notifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Match Notifications
          </Text>
          
          <View style={[styles.settingCard, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
            borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
          }]}>
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingIcon}>⏰</Text>
                <View style={styles.settingItemText}>
                  <Text style={[styles.settingTitle, { 
                    color: Colors[colorScheme ?? 'light'].text 
                  }]}>
                    Match Reminders
                  </Text>
                  <Text style={[styles.settingSubtitle, { 
                    color: Colors[colorScheme ?? 'light'].text 
                  }]}>
                    Get reminded about upcoming matches
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.matchReminders}
                onValueChange={(value) => handleToggle('matchReminders', value)}
                trackColor={{ 
                  false: colorScheme === 'dark' ? '#555' : '#e0e0e0', 
                  true: Colors[colorScheme ?? 'light'].tint 
                }}
                thumbColor={settings.matchReminders ? 'white' : '#f4f3f4'}
              />
            </View>
          </View>

          <View style={[styles.settingCard, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
            borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
          }]}>
            <Text style={[styles.settingTitle, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Reminder Time
            </Text>
            <View style={styles.optionsContainer}>
              {reminderOptions.map((minutes) => (
                <TouchableOpacity
                  key={minutes}
                  style={[
                    styles.optionButton,
                    { 
                      backgroundColor: settings.reminderTime === minutes 
                        ? Colors[colorScheme ?? 'light'].tint 
                        : colorScheme === 'dark' ? '#333' : '#f5f5f5',
                      borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
                    }
                  ]}
                  onPress={() => handleSelect('reminderTime', minutes)}
                >
                  <Text style={[
                    styles.optionText,
                    { 
                      color: settings.reminderTime === minutes ? 'white' : Colors[colorScheme ?? 'light'].text 
                    }
                  ]}>
                    {minutes}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Social Notifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Social Notifications
          </Text>
          
          <View style={[styles.settingCard, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
            borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
          }]}>
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingIcon}>👥</Text>
                <View style={styles.settingItemText}>
                  <Text style={[styles.settingTitle, { 
                    color: Colors[colorScheme ?? 'light'].text 
                  }]}>
                    Team Updates
                  </Text>
                  <Text style={[styles.settingSubtitle, { 
                    color: Colors[colorScheme ?? 'light'].text 
                  }]}>
                    Notifications about team activities
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.teamUpdates}
                onValueChange={(value) => handleToggle('teamUpdates', value)}
                trackColor={{ 
                  false: colorScheme === 'dark' ? '#555' : '#e0e0e0', 
                  true: Colors[colorScheme ?? 'light'].tint 
                }}
                thumbColor={settings.teamUpdates ? 'white' : '#f4f3f4'}
              />
            </View>
          </View>

          <View style={[styles.settingCard, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
            borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
          }]}>
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingIcon}>👤</Text>
                <View style={styles.settingItemText}>
                  <Text style={[styles.settingTitle, { 
                    color: Colors[colorScheme ?? 'light'].text 
                  }]}>
                    Friend Requests
                  </Text>
                  <Text style={[styles.settingSubtitle, { 
                    color: Colors[colorScheme ?? 'light'].text 
                  }]}>
                    Notifications for friend requests
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.friendRequests}
                onValueChange={(value) => handleToggle('friendRequests', value)}
                trackColor={{ 
                  false: colorScheme === 'dark' ? '#555' : '#e0e0e0', 
                  true: Colors[colorScheme ?? 'light'].tint 
                }}
                thumbColor={settings.friendRequests ? 'white' : '#f4f3f4'}
              />
            </View>
          </View>

          <View style={[styles.settingCard, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
            borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
          }]}>
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingIcon}>💬</Text>
                <View style={styles.settingItemText}>
                  <Text style={[styles.settingTitle, { 
                    color: Colors[colorScheme ?? 'light'].text 
                  }]}>
                    Message Notifications
                  </Text>
                  <Text style={[styles.settingSubtitle, { 
                    color: Colors[colorScheme ?? 'light'].text 
                  }]}>
                    Notifications for new messages
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.messageNotifications}
                onValueChange={(value) => handleToggle('messageNotifications', value)}
                trackColor={{ 
                  false: colorScheme === 'dark' ? '#555' : '#e0e0e0', 
                  true: Colors[colorScheme ?? 'light'].tint 
                }}
                thumbColor={settings.messageNotifications ? 'white' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* Quiet Hours */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Quiet Hours
          </Text>
          
          <View style={[styles.settingCard, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
            borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
          }]}>
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingIcon}>🌙</Text>
                <View style={styles.settingItemText}>
                  <Text style={[styles.settingTitle, { 
                    color: Colors[colorScheme ?? 'light'].text 
                  }]}>
                    Enable Quiet Hours
                  </Text>
                  <Text style={[styles.settingSubtitle, { 
                    color: Colors[colorScheme ?? 'light'].text 
                  }]}>
                    Silence notifications during specified hours
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.quietHours.enabled}
                onValueChange={(value) => handleNestedToggle('quietHours', 'enabled', value)}
                trackColor={{ 
                  false: colorScheme === 'dark' ? '#555' : '#e0e0e0', 
                  true: Colors[colorScheme ?? 'light'].tint 
                }}
                thumbColor={settings.quietHours.enabled ? 'white' : '#f4f3f4'}
              />
            </View>
          </View>

          {settings.quietHours.enabled && (
            <View style={[styles.settingCard, { 
              backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
              borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
            }]}>
              <Text style={[styles.settingTitle, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Quiet Hours: {settings.quietHours.startTime} - {settings.quietHours.endTime}
              </Text>
            </View>
          )}
        </View>

        {/* Sound & Vibration */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Sound & Vibration
          </Text>
          
          <View style={[styles.settingCard, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
            borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
          }]}>
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingIcon}>🔊</Text>
                <View style={styles.settingItemText}>
                  <Text style={[styles.settingTitle, { 
                    color: Colors[colorScheme ?? 'light'].text 
                  }]}>
                    Sound Effects
                  </Text>
                  <Text style={[styles.settingSubtitle, { 
                    color: Colors[colorScheme ?? 'light'].text 
                  }]}>
                    Play sounds for notifications
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.soundSettings.enabled}
                onValueChange={(value) => handleNestedToggle('soundSettings', 'enabled', value)}
                trackColor={{ 
                  false: colorScheme === 'dark' ? '#555' : '#e0e0e0', 
                  true: Colors[colorScheme ?? 'light'].tint 
                }}
                thumbColor={settings.soundSettings.enabled ? 'white' : '#f4f3f4'}
              />
            </View>
          </View>

          <View style={[styles.settingCard, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
            borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
          }]}>
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <Text style={styles.settingIcon}>📳</Text>
                <View style={styles.settingItemText}>
                  <Text style={[styles.settingTitle, { 
                    color: Colors[colorScheme ?? 'light'].text 
                  }]}>
                    Vibration
                  </Text>
                  <Text style={[styles.settingSubtitle, { 
                    color: Colors[colorScheme ?? 'light'].text 
                  }]}>
                    Vibrate for notifications
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.vibrationSettings.enabled}
                onValueChange={(value) => handleNestedToggle('vibrationSettings', 'enabled', value)}
                trackColor={{ 
                  false: colorScheme === 'dark' ? '#555' : '#e0e0e0', 
                  true: Colors[colorScheme ?? 'light'].tint 
                }}
                thumbColor={settings.vibrationSettings.enabled ? 'white' : '#f4f3f4'}
              />
            </View>
          </View>

          {settings.vibrationSettings.enabled && (
            <View style={[styles.settingCard, { 
              backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
              borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
            }]}>
              <Text style={[styles.settingTitle, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Vibration Pattern
              </Text>
              <View style={styles.optionsContainer}>
                {vibrationPatterns.map((pattern) => (
                  <TouchableOpacity
                    key={pattern}
                    style={[
                      styles.optionButton,
                      { 
                        backgroundColor: settings.vibrationSettings.pattern === pattern 
                          ? Colors[colorScheme ?? 'light'].tint 
                          : colorScheme === 'dark' ? '#333' : '#f5f5f5',
                        borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
                      }
                    ]}
                    onPress={() => handleSelect('vibrationSettings', { ...settings.vibrationSettings, pattern })}
                  >
                    <Text style={[
                      styles.optionText,
                      { 
                        color: settings.vibrationSettings.pattern === pattern ? 'white' : Colors[colorScheme ?? 'light'].text 
                      }
                    ]}>
                      {pattern}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.cancelButton, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
            borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
          }]}
          onPress={onCancel}
        >
          <Text style={[styles.cancelButtonText, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.saveButton, { 
            backgroundColor: Colors[colorScheme ?? 'light'].tint 
          }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>
            Save Settings
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  settingCard: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingItemText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
