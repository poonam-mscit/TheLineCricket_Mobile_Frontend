import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import { AcademyCoachesProps } from '@/types/pages';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';

export function AcademyCoaches({ coaches, onCoachPress }: AcademyCoachesProps) {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { 
        color: getColors(colorScheme).text 
      }]}>
        Coaches
      </Text>

      <View style={styles.coachesGrid}>
        {coaches.length === 0 ? (
          <Text style={[styles.emptyText, { 
            color: getColors(colorScheme).text 
          }]}>
            No coaches added yet
          </Text>
        ) : (
          coaches.map((coach) => (
            <TouchableOpacity 
              key={coach.id}
              style={[
                styles.coachCard,
                {
                  backgroundColor: getColors(colorScheme).card,
                  borderColor: getColors(colorScheme).border
                }
              ]}
              onPress={() => onCoachPress(coach.id)}
            >
              {/* Coach Image */}
              {coach.image ? (
                <Image source={{ uri: coach.image }} style={styles.coachImage} />
              ) : (
                <View style={styles.coachImagePlaceholder}>
                  <Text style={styles.coachImageText}>
                    {coach.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              
              {/* Coach Info */}
              <View style={styles.coachInfo}>
                <View style={styles.nameRow}>
                  <Text style={[styles.coachName, { 
                    color: getColors(colorScheme).text 
                  }]}>
                    {coach.name}
                  </Text>
                  {coach.verified && (
                    <View style={styles.verifiedBadge}>
                      <Text style={styles.verifiedText}>✓</Text>
                    </View>
                  )}
                </View>
                
                <Text style={[styles.coachRole, { 
                  color: getColors(colorScheme).text 
                }]}>
                  {coach.role}
                </Text>
                
                <Text style={[styles.experience, { 
                  color: getColors(colorScheme).text 
                }]}>
                  {coach.experience} years experience
                </Text>
                
                {/* Specialization Tags */}
                {coach.specialization && coach.specialization.length > 0 && (
                  <View style={styles.specializationContainer}>
                    {coach.specialization.slice(0, 2).map((spec, index) => (
                      <View key={index} style={styles.specializationTag}>
                        <Text style={styles.specializationText}>{spec}</Text>
                      </View>
                    ))}
                    {coach.specialization.length > 2 && (
                      <Text style={[styles.moreText, { 
                        color: getColors(colorScheme).text 
                      }]}>
                        +{coach.specialization.length - 2}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  coachesGrid: {
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
  coachCard: {
    width: '48%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coachImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  coachImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  coachImageText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  coachInfo: {
    alignItems: 'center',
    width: '100%',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  coachName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginRight: 4,
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  coachRole: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 4,
  },
  experience: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: 8,
  },
  specializationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'center',
  },
  specializationTag: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  specializationText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  moreText: {
    fontSize: 10,
    opacity: 0.6,
    marginLeft: 4,
  },
});

