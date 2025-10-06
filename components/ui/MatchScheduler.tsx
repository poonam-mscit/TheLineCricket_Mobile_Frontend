import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface MatchSchedulerProps {
  onScheduleMatch: (matchData: ScheduledMatch) => void;
  onCancel: () => void;
  initialData?: Partial<ScheduledMatch>;
}

export interface ScheduledMatch {
  id: string;
  title: string;
  type: 'T20' | 'ODI' | 'Test' | 'Practice' | 'Tournament';
  date: Date;
  time: string;
  duration: number; // in minutes
  venue: string;
  playersNeeded: number;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  entryFee: number;
  equipmentProvided: boolean;
  description: string;
  recurring: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    endDate?: Date;
  };
  notifications: {
    enabled: boolean;
    reminderTime: number; // minutes before match
  };
  weatherCheck: boolean;
  backupVenue?: string;
}

export function MatchScheduler({ 
  onScheduleMatch, 
  onCancel, 
  initialData = {} 
}: MatchSchedulerProps) {
  const [matchData, setMatchData] = useState<Partial<ScheduledMatch>>({
    title: '',
    type: 'T20',
    date: new Date(),
    time: '',
    duration: 180, // 3 hours default
    venue: '',
    playersNeeded: 22,
    skillLevel: 'Intermediate',
    entryFee: 0,
    equipmentProvided: false,
    description: '',
    recurring: {
      enabled: false,
      frequency: 'weekly'
    },
    notifications: {
      enabled: true,
      reminderTime: 60 // 1 hour before
    },
    weatherCheck: true,
    ...initialData
  });
  
  const colorScheme = useColorScheme();

  const handleInputChange = (field: keyof ScheduledMatch, value: any) => {
    setMatchData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent: keyof ScheduledMatch, field: string, value: any) => {
    setMatchData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [field]: value
      }
    }));
  };

  const handleSchedule = () => {
    if (!matchData.title || !matchData.venue || !matchData.time) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const scheduledMatch: ScheduledMatch = {
      id: Date.now().toString(),
      title: matchData.title!,
      type: matchData.type!,
      date: matchData.date!,
      time: matchData.time!,
      duration: matchData.duration!,
      venue: matchData.venue!,
      playersNeeded: matchData.playersNeeded!,
      skillLevel: matchData.skillLevel!,
      entryFee: matchData.entryFee!,
      equipmentProvided: matchData.equipmentProvided!,
      description: matchData.description!,
      recurring: matchData.recurring!,
      notifications: matchData.notifications!,
      weatherCheck: matchData.weatherCheck!,
      backupVenue: matchData.backupVenue
    };

    onScheduleMatch(scheduledMatch);
  };

  const typeOptions = ['T20', 'ODI', 'Test', 'Practice', 'Tournament'];
  const skillOptions = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];
  const frequencyOptions = ['daily', 'weekly', 'monthly'];
  const reminderOptions = [15, 30, 60, 120, 240]; // minutes

  return (
    <View style={[styles.container, { 
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
      borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
    }]}>
      <Text style={[styles.title, { 
        color: Colors[colorScheme ?? 'light'].text 
      }]}>
        Schedule Match
      </Text>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Basic Information
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Match Title *
            </Text>
            <TextInput
              style={[styles.input, { 
                color: Colors[colorScheme ?? 'light'].text,
                backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
                borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
              }]}
              placeholder="Enter match title"
              placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
              value={matchData.title}
              onChangeText={(value) => handleInputChange('title', value)}
            />
          </View>

          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={[styles.label, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Match Type
              </Text>
              <View style={styles.optionsContainer}>
                {typeOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      { 
                        backgroundColor: matchData.type === option 
                          ? Colors[colorScheme ?? 'light'].tint 
                          : colorScheme === 'dark' ? '#333' : '#f5f5f5',
                        borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
                      }
                    ]}
                    onPress={() => handleInputChange('type', option)}
                  >
                    <Text style={[
                      styles.optionText,
                      { 
                        color: matchData.type === option ? 'white' : Colors[colorScheme ?? 'light'].text 
                      }
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Date & Time */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Date & Time
          </Text>
          
          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={[styles.label, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Date *
              </Text>
              <TextInput
                style={[styles.input, { 
                  color: Colors[colorScheme ?? 'light'].text,
                  backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
                  borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
                }]}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
                value={matchData.date?.toISOString().split('T')[0]}
                onChangeText={(value) => handleInputChange('date', new Date(value))}
              />
            </View>
            
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Text style={[styles.label, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Time *
              </Text>
              <TextInput
                style={[styles.input, { 
                  color: Colors[colorScheme ?? 'light'].text,
                  backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
                  borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
                }]}
                placeholder="HH:MM"
                placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
                value={matchData.time}
                onChangeText={(value) => handleInputChange('time', value)}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Duration (minutes)
            </Text>
            <TextInput
              style={[styles.input, { 
                color: Colors[colorScheme ?? 'light'].text,
                backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
                borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
              }]}
              placeholder="180"
              placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
              value={matchData.duration?.toString()}
              onChangeText={(value) => handleInputChange('duration', parseInt(value) || 180)}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Venue & Players */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Venue & Players
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Venue *
            </Text>
            <TextInput
              style={[styles.input, { 
                color: Colors[colorScheme ?? 'light'].text,
                backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
                borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
              }]}
              placeholder="Enter venue name"
              placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
              value={matchData.venue}
              onChangeText={(value) => handleInputChange('venue', value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Backup Venue
            </Text>
            <TextInput
              style={[styles.input, { 
                color: Colors[colorScheme ?? 'light'].text,
                backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
                borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
              }]}
              placeholder="Enter backup venue"
              placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
              value={matchData.backupVenue}
              onChangeText={(value) => handleInputChange('backupVenue', value)}
            />
          </View>

          <View style={styles.rowContainer}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={[styles.label, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Players Needed
              </Text>
              <TextInput
                style={[styles.input, { 
                  color: Colors[colorScheme ?? 'light'].text,
                  backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
                  borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
                }]}
                placeholder="22"
                placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
                value={matchData.playersNeeded?.toString()}
                onChangeText={(value) => handleInputChange('playersNeeded', parseInt(value) || 22)}
                keyboardType="numeric"
              />
            </View>
            
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Text style={[styles.label, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Skill Level
              </Text>
              <View style={styles.optionsContainer}>
                {skillOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      { 
                        backgroundColor: matchData.skillLevel === option 
                          ? Colors[colorScheme ?? 'light'].tint 
                          : colorScheme === 'dark' ? '#333' : '#f5f5f5',
                        borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
                      }
                    ]}
                    onPress={() => handleInputChange('skillLevel', option)}
                  >
                    <Text style={[
                      styles.optionText,
                      { 
                        color: matchData.skillLevel === option ? 'white' : Colors[colorScheme ?? 'light'].text 
                      }
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Recurring Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Recurring Settings
          </Text>
          
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => handleNestedChange('recurring', 'enabled', !matchData.recurring?.enabled)}
          >
            <Text style={[styles.checkboxLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Enable Recurring Match
            </Text>
            <View style={[
              styles.checkbox,
              { 
                backgroundColor: matchData.recurring?.enabled 
                  ? Colors[colorScheme ?? 'light'].tint 
                  : 'transparent',
                borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
              }
            ]}>
              {matchData.recurring?.enabled && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
          </TouchableOpacity>

          {matchData.recurring?.enabled && (
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Frequency
              </Text>
              <View style={styles.optionsContainer}>
                {frequencyOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      { 
                        backgroundColor: matchData.recurring?.frequency === option 
                          ? Colors[colorScheme ?? 'light'].tint 
                          : colorScheme === 'dark' ? '#333' : '#f5f5f5',
                        borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
                      }
                    ]}
                    onPress={() => handleNestedChange('recurring', 'frequency', option)}
                  >
                    <Text style={[
                      styles.optionText,
                      { 
                        color: matchData.recurring?.frequency === option ? 'white' : Colors[colorScheme ?? 'light'].text 
                      }
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Notifications
          </Text>
          
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => handleNestedChange('notifications', 'enabled', !matchData.notifications?.enabled)}
          >
            <Text style={[styles.checkboxLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Enable Notifications
            </Text>
            <View style={[
              styles.checkbox,
              { 
                backgroundColor: matchData.notifications?.enabled 
                  ? Colors[colorScheme ?? 'light'].tint 
                  : 'transparent',
                borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
              }
            ]}>
              {matchData.notifications?.enabled && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
          </TouchableOpacity>

          {matchData.notifications?.enabled && (
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { 
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
                        backgroundColor: matchData.notifications?.reminderTime === minutes 
                          ? Colors[colorScheme ?? 'light'].tint 
                          : colorScheme === 'dark' ? '#333' : '#f5f5f5',
                        borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
                      }
                    ]}
                    onPress={() => handleNestedChange('notifications', 'reminderTime', minutes)}
                  >
                    <Text style={[
                      styles.optionText,
                      { 
                        color: matchData.notifications?.reminderTime === minutes ? 'white' : Colors[colorScheme ?? 'light'].text 
                      }
                    ]}>
                      {minutes}m
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Additional Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Additional Settings
          </Text>
          
          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => handleInputChange('equipmentProvided', !matchData.equipmentProvided)}
          >
            <Text style={[styles.checkboxLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Equipment Provided
            </Text>
            <View style={[
              styles.checkbox,
              { 
                backgroundColor: matchData.equipmentProvided 
                  ? Colors[colorScheme ?? 'light'].tint 
                  : 'transparent',
                borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
              }
            ]}>
              {matchData.equipmentProvided && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => handleInputChange('weatherCheck', !matchData.weatherCheck)}
          >
            <Text style={[styles.checkboxLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Weather Check
            </Text>
            <View style={[
              styles.checkbox,
              { 
                backgroundColor: matchData.weatherCheck 
                  ? Colors[colorScheme ?? 'light'].tint 
                  : 'transparent',
                borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
              }
            ]}>
              {matchData.weatherCheck && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Description
          </Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.textArea, { 
                color: Colors[colorScheme ?? 'light'].text,
                backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
                borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
              }]}
              placeholder="Enter match description..."
              placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
              value={matchData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
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
          style={[styles.scheduleButton, { 
            backgroundColor: Colors[colorScheme ?? 'light'].tint 
          }]}
          onPress={handleSchedule}
        >
          <Text style={styles.scheduleButtonText}>
            Schedule Match
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  form: {
    maxHeight: 500,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
  scheduleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  scheduleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
