import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import React, { useEffect, useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    TextInput,
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

interface ProfileFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: ProfileFormData) => void;
  initialData?: ProfileFormData;
  isEditing?: boolean;
  isLoading?: boolean;
}

export function ProfileForm({
  visible,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
  isLoading = false
}: ProfileFormProps) {
  const colorScheme = useColorScheme();
  const [formData, setFormData] = useState<ProfileFormData>({
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
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when modal opens
  useEffect(() => {
    if (visible && initialData) {
      setFormData(initialData);
    } else if (visible && !initialData) {
      setFormData({
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
      });
    }
  }, [visible, initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.skills.batting < 0 || formData.skills.batting > 100) {
      newErrors.batting = 'Batting skill must be between 0 and 100';
    }

    if (formData.skills.bowling < 0 || formData.skills.bowling > 100) {
      newErrors.bowling = 'Bowling skill must be between 0 and 100';
    }

    if (formData.skills.fielding < 0 || formData.skills.fielding > 100) {
      newErrors.fielding = 'Fielding skill must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (field.startsWith('skills.')) {
      const skillField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          [skillField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const addAchievement = () => {
    setFormData(prev => ({
      ...prev,
      achievements: [...prev.achievements, '']
    }));
  };

  const updateAchievement = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.map((achievement, i) => 
        i === index ? value : achievement
      )
    }));
  };

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, {
        backgroundColor: getColors(colorScheme).background
      }]}>
        {/* Header */}
        <View style={[styles.header, {
          borderBottomColor: getColors(colorScheme).border
        }]}>
          <TouchableOpacity onPress={onClose} disabled={isLoading}>
            <Text style={[styles.cancelButton, {
              color: getColors(colorScheme).text
            }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          
          <Text style={[styles.title, {
            color: getColors(colorScheme).text
          }]}>
            {isEditing ? 'Edit Profile' : 'Create Profile'}
          </Text>
          
          <TouchableOpacity 
            onPress={handleSubmit} 
            disabled={isLoading}
            style={[styles.saveButton, {
              backgroundColor: getColors(colorScheme).tint,
              opacity: isLoading ? 0.5 : 1
            }]}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {
              color: getColors(colorScheme).text
            }]}>
              Basic Information
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, {
                color: getColors(colorScheme).text
              }]}>
                Full Name *
              </Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: getColors(colorScheme).inputBackground,
                  color: getColors(colorScheme).text,
                  borderColor: errors.fullName ? '#ff4757' : getColors(colorScheme).border
                }]}
                value={formData.fullName}
                onChangeText={(value) => handleInputChange('fullName', value)}
                placeholder="Enter your full name"
                placeholderTextColor={getColors(colorScheme).placeholder}
                editable={!isLoading}
              />
              {errors.fullName && (
                <Text style={styles.errorText}>{errors.fullName}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, {
                color: getColors(colorScheme).text
              }]}>
                Username *
              </Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: getColors(colorScheme).inputBackground,
                  color: getColors(colorScheme).text,
                  borderColor: errors.username ? '#ff4757' : getColors(colorScheme).border
                }]}
                value={formData.username}
                onChangeText={(value) => handleInputChange('username', value)}
                placeholder="Enter your username"
                placeholderTextColor={getColors(colorScheme).placeholder}
                editable={!isLoading}
              />
              {errors.username && (
                <Text style={styles.errorText}>{errors.username}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, {
                color: getColors(colorScheme).text
              }]}>
                Email *
              </Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: getColors(colorScheme).inputBackground,
                  color: getColors(colorScheme).text,
                  borderColor: errors.email ? '#ff4757' : getColors(colorScheme).border
                }]}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="Enter your email"
                placeholderTextColor={getColors(colorScheme).placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, {
                color: getColors(colorScheme).text
              }]}>
                Bio
              </Text>
              <TextInput
                style={[styles.textArea, {
                  backgroundColor: getColors(colorScheme).inputBackground,
                  color: getColors(colorScheme).text,
                  borderColor: getColors(colorScheme).border
                }]}
                value={formData.bio}
                onChangeText={(value) => handleInputChange('bio', value)}
                placeholder="Tell us about yourself"
                placeholderTextColor={getColors(colorScheme).placeholder}
                multiline
                numberOfLines={3}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, {
                color: getColors(colorScheme).text
              }]}>
                Location
              </Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: getColors(colorScheme).inputBackground,
                  color: getColors(colorScheme).text,
                  borderColor: getColors(colorScheme).border
                }]}
                value={formData.location}
                onChangeText={(value) => handleInputChange('location', value)}
                placeholder="Enter your location"
                placeholderTextColor={getColors(colorScheme).placeholder}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Cricket Skills */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {
              color: getColors(colorScheme).text
            }]}>
              Cricket Skills (0-100)
            </Text>
            
            <View style={styles.skillsContainer}>
              <View style={styles.skillInput}>
                <Text style={[styles.label, {
                  color: getColors(colorScheme).text
                }]}>
                  Batting
                </Text>
                <TextInput
                  style={[styles.skillInputField, {
                    backgroundColor: getColors(colorScheme).inputBackground,
                    color: getColors(colorScheme).text,
                    borderColor: errors.batting ? '#ff4757' : getColors(colorScheme).border
                  }]}
                  value={formData.skills.batting.toString()}
                  onChangeText={(value) => handleInputChange('skills.batting', parseInt(value) || 0)}
                  placeholder="0"
                  placeholderTextColor={getColors(colorScheme).placeholder}
                  keyboardType="numeric"
                  editable={!isLoading}
                />
                {errors.batting && (
                  <Text style={styles.errorText}>{errors.batting}</Text>
                )}
              </View>

              <View style={styles.skillInput}>
                <Text style={[styles.label, {
                  color: getColors(colorScheme).text
                }]}>
                  Bowling
                </Text>
                <TextInput
                  style={[styles.skillInputField, {
                    backgroundColor: getColors(colorScheme).inputBackground,
                    color: getColors(colorScheme).text,
                    borderColor: errors.bowling ? '#ff4757' : getColors(colorScheme).border
                  }]}
                  value={formData.skills.bowling.toString()}
                  onChangeText={(value) => handleInputChange('skills.bowling', parseInt(value) || 0)}
                  placeholder="0"
                  placeholderTextColor={getColors(colorScheme).placeholder}
                  keyboardType="numeric"
                  editable={!isLoading}
                />
                {errors.bowling && (
                  <Text style={styles.errorText}>{errors.bowling}</Text>
                )}
              </View>

              <View style={styles.skillInput}>
                <Text style={[styles.label, {
                  color: getColors(colorScheme).text
                }]}>
                  Fielding
                </Text>
                <TextInput
                  style={[styles.skillInputField, {
                    backgroundColor: getColors(colorScheme).inputBackground,
                    color: getColors(colorScheme).text,
                    borderColor: errors.fielding ? '#ff4757' : getColors(colorScheme).border
                  }]}
                  value={formData.skills.fielding.toString()}
                  onChangeText={(value) => handleInputChange('skills.fielding', parseInt(value) || 0)}
                  placeholder="0"
                  placeholderTextColor={getColors(colorScheme).placeholder}
                  keyboardType="numeric"
                  editable={!isLoading}
                />
                {errors.fielding && (
                  <Text style={styles.errorText}>{errors.fielding}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Achievements */}
          <View style={styles.section}>
            <View style={styles.achievementsHeader}>
              <Text style={[styles.sectionTitle, {
                color: getColors(colorScheme).text
              }]}>
                Achievements
              </Text>
              <TouchableOpacity 
                onPress={addAchievement}
                disabled={isLoading}
                style={[styles.addButton, {
                  backgroundColor: getColors(colorScheme).tint
                }]}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
            
            {formData.achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementItem}>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: getColors(colorScheme).inputBackground,
                    color: getColors(colorScheme).text,
                    borderColor: getColors(colorScheme).border
                  }]}
                  value={achievement}
                  onChangeText={(value) => updateAchievement(index, value)}
                  placeholder="Enter achievement"
                  placeholderTextColor={getColors(colorScheme).placeholder}
                  editable={!isLoading}
                />
                <TouchableOpacity 
                  onPress={() => removeAchievement(index)}
                  disabled={isLoading}
                  style={[styles.removeButton, {
                    backgroundColor: '#ff4757'
                  }]}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  cancelButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputGroup: {
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
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    height: 80,
    textAlignVertical: 'top',
  },
  skillsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skillInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  skillInputField: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  achievementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginLeft: 8,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  errorText: {
    color: '#ff4757',
    fontSize: 12,
    marginTop: 4,
  },
});
