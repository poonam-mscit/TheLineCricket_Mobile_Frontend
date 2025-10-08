import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import { PageColors } from '@/constants/PageThemes';
import { VenueData } from '@/types/pages';
import { createEmptyVenuePage, savePage } from '@/utils/pageStorage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

export default function CreateVenueScreen() {
  const [venueData, setVenueData] = useState<VenueData>(createEmptyVenuePage());
  const [isSaving, setIsSaving] = useState(false);
  const colorScheme = useColorScheme();

  const handleInputChange = (field: keyof VenueData, value: any) => {
    setVenueData(prev => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (field: string, value: string) => {
    setVenueData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Creation',
      'Are you sure you want to cancel? All data will be lost.',
      [
        { text: 'Continue Editing', style: 'cancel' },
        { text: 'Cancel', style: 'destructive', onPress: () => router.back() }
      ]
    );
  };

  const validateForm = (): boolean => {
    if (!venueData.name.trim()) {
      Alert.alert('Validation Error', 'Please enter venue name');
      return false;
    }
    if (!venueData.description.trim()) {
      Alert.alert('Validation Error', 'Please enter venue description');
      return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);
      const pageId = Date.now().toString();
      const success = await savePage({
        id: pageId,
        name: venueData.name,
        type: 'venue',
        createdAt: new Date(),
        data: { ...venueData, id: pageId }
      });

      if (success) {
        Alert.alert('Success', 'Venue created successfully!', [
          {
            text: 'OK',
            onPress: () => router.replace('/profile')
          }
        ]);
      } else {
        Alert.alert('Error', 'Failed to create venue');
      }
    } catch (error) {
      console.error('Error creating venue:', error);
      Alert.alert('Error', 'Failed to create venue');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { 
      backgroundColor: getColors(colorScheme).background,
      paddingTop: StatusBar.currentHeight || 0
    }]}>
      <View style={[styles.header, { 
        backgroundColor: getColors(colorScheme).background,
        borderBottomColor: getColors(colorScheme).border
      }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleCancel}
        >
          <Text style={styles.backButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { 
          color: getColors(colorScheme).text 
        }]}>
          Create Venue
        </Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { 
              color: getColors(colorScheme).text 
            }]}>
              Basic Information
            </Text>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { 
                color: getColors(colorScheme).text 
              }]}>
                Venue Name *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: getColors(colorScheme).card,
                    color: getColors(colorScheme).text,
                    borderColor: getColors(colorScheme).border
                  }
                ]}
                value={venueData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                placeholder="Enter venue name"
                placeholderTextColor={getColors(colorScheme).text + '80'}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { 
                color: getColors(colorScheme).text 
              }]}>
                Description *
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    backgroundColor: getColors(colorScheme).card,
                    color: getColors(colorScheme).text,
                    borderColor: getColors(colorScheme).border
                  }
                ]}
                value={venueData.description}
                onChangeText={(text) => handleInputChange('description', text)}
                placeholder="Describe your venue..."
                placeholderTextColor={getColors(colorScheme).text + '80'}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { 
              color: getColors(colorScheme).text 
            }]}>
              Contact Information
            </Text>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { 
                color: getColors(colorScheme).text 
              }]}>
                Email
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: getColors(colorScheme).card,
                    color: getColors(colorScheme).text,
                    borderColor: getColors(colorScheme).border
                  }
                ]}
                value={venueData.contact.email}
                onChangeText={(text) => handleContactChange('email', text)}
                placeholder="venue@example.com"
                placeholderTextColor={getColors(colorScheme).text + '80'}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.footer, { 
        backgroundColor: getColors(colorScheme).background,
        borderTopColor: getColors(colorScheme).border
      }]}>
        <TouchableOpacity 
          style={[styles.footerButton, styles.cancelButton, { 
            borderColor: getColors(colorScheme).border 
          }]}
          onPress={handleCancel}
          disabled={isSaving}
        >
          <Text style={[styles.cancelButtonText, { 
            color: getColors(colorScheme).text 
          }]}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.footerButton, 
            styles.createButton,
            { backgroundColor: PageColors.venue.primary }
          ]}
          onPress={handleCreate}
          disabled={isSaving}
        >
          <Text style={styles.createButtonText}>
            {isSaving ? 'Creating...' : 'Create Venue'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
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
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  formGroup: {
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
    minHeight: 120,
    textAlignVertical: 'top',
  },
  bottomPadding: {
    height: 20,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  footerButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {},
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

