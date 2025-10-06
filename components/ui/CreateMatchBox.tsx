import { Text } from '@/components/Themed';
import { useColorScheme } from 'react-native';
import { getColors } from '@/constants/Colors';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface CreateMatchBoxProps {
  onCreateMatch: (matchData: any) => void;
}

export function CreateMatchBox({ onCreateMatch }: CreateMatchBoxProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'T20' | 'ODI' | 'Test' | 'Practice' | 'Tournament'>('T20');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [playersNeeded, setPlayersNeeded] = useState('');
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Professional'>('Intermediate');
  const [entryFee, setEntryFee] = useState('');
  const [equipmentProvided, setEquipmentProvided] = useState(false);
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const colorScheme = useColorScheme();
  
  // Mock user data since we removed authentication
  const user = {
    id: '1',
    username: 'demo_user',
    fullName: 'Demo User'
  };

  const handleCreateMatch = async () => {
    if (!title || !date || !time || !venue || !playersNeeded) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (isNaN(Number(playersNeeded)) || Number(playersNeeded) < 2) {
      Alert.alert('Error', 'Please enter a valid number of players (minimum 2)');
      return;
    }

    if (entryFee && (isNaN(Number(entryFee)) || Number(entryFee) < 0)) {
      Alert.alert('Error', 'Please enter a valid entry fee');
      return;
    }

    try {
      setIsCreating(true);
      
      const matchData = {
        title: title.trim(),
        type,
        date: new Date(date),
        time: time.trim(),
        venue: venue.trim(),
        playersNeeded: Number(playersNeeded),
        skillLevel,
        entryFee: entryFee ? Number(entryFee) : 0,
        equipmentProvided,
        description: description.trim(),
        creator: {
          id: user?.id || '1',
          username: user?.username || 'you',
          fullName: user?.fullName || 'You'
        }
      };

      await onCreateMatch(matchData);
      
      // Reset form
      setTitle('');
      setDate('');
      setTime('');
      setVenue('');
      setPlayersNeeded('');
      setEntryFee('');
      setDescription('');
      
      Alert.alert('Success', 'Match created successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create match. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const typeOptions = ['T20', 'ODI', 'Test', 'Practice', 'Tournament'];
  const skillOptions = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];

  return (
    <View style={[styles.container, { 
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
      borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
    }]}>
      <Text style={[styles.title, { 
        color: getColors(colorScheme).text 
      }]}>
        Create New Match
      </Text>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { 
            color: getColors(colorScheme).text 
          }]}>
            Match Title *
          </Text>
          <TextInput
            style={[styles.input, { 
              color: getColors(colorScheme).text,
              backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
              borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
            }]}
            placeholder="e.g., Weekend Cricket Match"
            placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Type */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { 
            color: getColors(colorScheme).text 
          }]}>
            Match Type
          </Text>
          <View style={styles.typeContainer}>
            {typeOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.typeOption,
                  { 
                    backgroundColor: type === option 
                      ? getColors(colorScheme).tint 
                      : colorScheme === 'dark' ? '#333' : '#f5f5f5',
                    borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
                  }
                ]}
                onPress={() => setType(option as any)}
              >
                <Text style={[
                  styles.typeOptionText,
                  { 
                    color: type === option ? 'white' : getColors(colorScheme).text 
                  }
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date and Time */}
        <View style={styles.rowContainer}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={[styles.label, { 
              color: getColors(colorScheme).text 
            }]}>
              Date *
            </Text>
            <TextInput
              style={[styles.input, { 
                color: getColors(colorScheme).text,
                backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
                borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
              }]}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
              value={date}
              onChangeText={setDate}
            />
          </View>
          
          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={[styles.label, { 
              color: getColors(colorScheme).text 
            }]}>
              Time *
            </Text>
            <TextInput
              style={[styles.input, { 
                color: getColors(colorScheme).text,
                backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
                borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
              }]}
              placeholder="HH:MM"
              placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
              value={time}
              onChangeText={setTime}
            />
          </View>
        </View>

        {/* Venue */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { 
            color: getColors(colorScheme).text 
          }]}>
            Venue *
          </Text>
          <TextInput
            style={[styles.input, { 
              color: getColors(colorScheme).text,
              backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
              borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
            }]}
            placeholder="e.g., Mumbai Cricket Ground"
            placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
            value={venue}
            onChangeText={setVenue}
          />
        </View>

        {/* Players and Skill Level */}
        <View style={styles.rowContainer}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={[styles.label, { 
              color: getColors(colorScheme).text 
            }]}>
              Players Needed *
            </Text>
            <TextInput
              style={[styles.input, { 
                color: getColors(colorScheme).text,
                backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
                borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
              }]}
              placeholder="22"
              placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
              value={playersNeeded}
              onChangeText={setPlayersNeeded}
              keyboardType="numeric"
            />
          </View>
          
          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={[styles.label, { 
              color: getColors(colorScheme).text 
            }]}>
              Skill Level
            </Text>
            <View style={styles.skillContainer}>
              {skillOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.skillOption,
                    { 
                      backgroundColor: skillLevel === option 
                        ? getColors(colorScheme).tint 
                        : colorScheme === 'dark' ? '#333' : '#f5f5f5',
                      borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
                    }
                  ]}
                  onPress={() => setSkillLevel(option as any)}
                >
                  <Text style={[
                    styles.skillOptionText,
                    { 
                      color: skillLevel === option ? 'white' : getColors(colorScheme).text 
                    }
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Entry Fee */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { 
            color: getColors(colorScheme).text 
          }]}>
            Entry Fee (₹)
          </Text>
          <TextInput
            style={[styles.input, { 
              color: getColors(colorScheme).text,
              backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
              borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
            }]}
            placeholder="0 (Free)"
            placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
            value={entryFee}
            onChangeText={setEntryFee}
            keyboardType="numeric"
          />
        </View>

        {/* Equipment */}
        <View style={styles.inputContainer}>
          <TouchableOpacity 
            style={styles.equipmentContainer}
            onPress={() => setEquipmentProvided(!equipmentProvided)}
          >
            <Text style={[styles.equipmentLabel, { 
              color: getColors(colorScheme).text 
            }]}>
              Equipment Provided
            </Text>
            <View style={[
              styles.checkbox,
              { 
                backgroundColor: equipmentProvided 
                  ? getColors(colorScheme).tint 
                  : 'transparent',
                borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
              }
            ]}>
              {equipmentProvided && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { 
            color: getColors(colorScheme).text 
          }]}>
            Description
          </Text>
          <TextInput
            style={[styles.textArea, { 
              color: getColors(colorScheme).text,
              backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
              borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
            }]}
            placeholder="Additional details about the match..."
            placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Create Button */}
      <TouchableOpacity 
        style={[
          styles.createButton,
          { 
            backgroundColor: getColors(colorScheme).tint,
            opacity: isCreating ? 0.6 : 1
          }
        ]}
        onPress={handleCreateMatch}
        disabled={isCreating}
      >
        <Text style={styles.createButtonText}>
          {isCreating ? 'Creating Match...' : 'Create Match'}
        </Text>
      </TouchableOpacity>
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
    maxHeight: 400,
  },
  inputContainer: {
    marginBottom: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
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
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  typeOptionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  skillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillOption: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  skillOptionText: {
    fontSize: 10,
    fontWeight: '600',
  },
  equipmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  equipmentLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  createButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
