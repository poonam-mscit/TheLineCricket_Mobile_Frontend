import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import { PageColors } from '@/constants/PageThemes';
import { AcademyFacilitiesProps } from '@/types/pages';
import React from 'react';
import { Alert, Image, StyleSheet, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

export function AcademyFacilities({ 
  facilities, 
  isEditing, 
  onAddFacility, 
  onRemoveFacility, 
  onUpdateFacility 
}: AcademyFacilitiesProps) {
  const colorScheme = useColorScheme();

  const handleRemove = (id: string, name: string) => {
    Alert.alert(
      'Remove Facility',
      `Are you sure you want to remove "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => onRemoveFacility(id) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { 
          color: getColors(colorScheme).text 
        }]}>
          Facilities
        </Text>
        {isEditing && (
          <TouchableOpacity 
            style={[styles.addButton, { 
              backgroundColor: PageColors.academy.primary 
            }]}
            onPress={onAddFacility}
          >
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.facilitiesGrid}>
        {facilities.length === 0 ? (
          <Text style={[styles.emptyText, { 
            color: getColors(colorScheme).text 
          }]}>
            No facilities added yet
          </Text>
        ) : (
          facilities.map((facility) => (
            <View 
              key={facility.id}
              style={[
                styles.facilityCard,
                {
                  backgroundColor: getColors(colorScheme).card,
                  borderColor: getColors(colorScheme).border
                }
              ]}
            >
              {/* Image */}
              {facility.image ? (
                <Image source={{ uri: facility.image }} style={styles.facilityImage} />
              ) : (
                <View style={styles.facilityImagePlaceholder}>
                  <Text style={styles.facilityImageIcon}>🏟️</Text>
                </View>
              )}
              
              {/* Content */}
              <View style={styles.facilityContent}>
                {isEditing ? (
                  <>
                    <TextInput
                      style={[
                        styles.facilityNameInput,
                        {
                          backgroundColor: getColors(colorScheme).background,
                          color: getColors(colorScheme).text,
                          borderColor: getColors(colorScheme).border
                        }
                      ]}
                      value={facility.name}
                      onChangeText={(text) => onUpdateFacility(facility.id, 'name', text)}
                      placeholder="Facility name"
                      placeholderTextColor={getColors(colorScheme).text + '80'}
                    />
                    <TextInput
                      style={[
                        styles.facilityDescInput,
                        {
                          backgroundColor: getColors(colorScheme).background,
                          color: getColors(colorScheme).text,
                          borderColor: getColors(colorScheme).border
                        }
                      ]}
                      value={facility.description}
                      onChangeText={(text) => onUpdateFacility(facility.id, 'description', text)}
                      placeholder="Description"
                      placeholderTextColor={getColors(colorScheme).text + '80'}
                      multiline
                      numberOfLines={2}
                    />
                  </>
                ) : (
                  <>
                    <Text style={[styles.facilityName, { 
                      color: getColors(colorScheme).text 
                    }]}>
                      {facility.name}
                    </Text>
                    <Text style={[styles.facilityDescription, { 
                      color: getColors(colorScheme).text 
                    }]}>
                      {facility.description}
                    </Text>
                  </>
                )}
                
                {/* Available Badge */}
                <View style={styles.badgeRow}>
                  <View style={[
                    styles.availableBadge,
                    { backgroundColor: facility.available ? '#10B981' : '#EF4444' }
                  ]}>
                    <Text style={styles.availableBadgeText}>
                      {facility.available ? 'Available' : 'Unavailable'}
                    </Text>
                  </View>
                  
                  {isEditing && (
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => handleRemove(facility.id, facility.name)}
                    >
                      <Text style={styles.removeButtonText}>✕</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  facilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    width: '100%',
    paddingVertical: 20,
  },
  facilityCard: {
    width: '48%',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  facilityImage: {
    width: '100%',
    height: 80,
    resizeMode: 'cover',
  },
  facilityImagePlaceholder: {
    width: '100%',
    height: 80,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  facilityImageIcon: {
    fontSize: 32,
  },
  facilityContent: {
    padding: 12,
  },
  facilityName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  facilityDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
    lineHeight: 18,
  },
  facilityNameInput: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    marginBottom: 8,
  },
  facilityDescInput: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    fontSize: 12,
    marginBottom: 8,
    minHeight: 40,
    textAlignVertical: 'top',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availableBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  availableBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

