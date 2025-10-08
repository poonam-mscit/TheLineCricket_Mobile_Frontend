import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import { AcademyProgramsProps } from '@/types/pages';
import React from 'react';
import { StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';

export function AcademyPrograms({ programs, onProgramPress, onEnroll }: AcademyProgramsProps) {
  const colorScheme = useColorScheme();

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      beginner: '#10B981',
      intermediate: '#F59E0B',
      advanced: '#EF4444',
      professional: '#8B5CF6',
    };
    return colors[level.toLowerCase()] || '#6B7280';
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { 
        color: getColors(colorScheme).text 
      }]}>
        Programs
      </Text>

      <View style={styles.programsList}>
        {programs.length === 0 ? (
          <Text style={[styles.emptyText, { 
            color: getColors(colorScheme).text 
          }]}>
            No programs available
          </Text>
        ) : (
          programs.map((program) => (
            <TouchableOpacity 
              key={program.id}
              style={[
                styles.programCard,
                {
                  backgroundColor: getColors(colorScheme).card,
                  borderColor: getColors(colorScheme).border
                }
              ]}
              onPress={() => onProgramPress(program.id)}
            >
              <View style={styles.programHeader}>
                <View style={styles.programTitleRow}>
                  <Text style={[styles.programName, { 
                    color: getColors(colorScheme).text 
                  }]}>
                    {program.name}
                  </Text>
                  <View style={[
                    styles.levelBadge,
                    { backgroundColor: getLevelColor(program.level) }
                  ]}>
                    <Text style={styles.levelText}>{program.level}</Text>
                  </View>
                </View>
                
                <View style={styles.detailsRow}>
                  <Text style={[styles.duration, { 
                    color: getColors(colorScheme).text 
                  }]}>
                    ⏱️ {program.duration}
                  </Text>
                  <Text style={styles.fee}>
                    ₹{program.fee.toLocaleString()}
                  </Text>
                </View>
              </View>
              
              <Text style={[styles.description, { 
                color: getColors(colorScheme).text 
              }]}>
                {program.description}
              </Text>
              
              <View style={styles.enrollmentRow}>
                <Text style={[styles.enrolled, { 
                  color: getColors(colorScheme).text 
                }]}>
                  {program.enrolled}/{program.maxStudents} enrolled
                </Text>
                
                <TouchableOpacity 
                  style={[
                    styles.enrollButton,
                    { backgroundColor: '#8B5CF6' },
                    program.enrolled >= program.maxStudents && styles.enrollButtonDisabled
                  ]}
                  onPress={() => onEnroll(program.id)}
                  disabled={program.enrolled >= program.maxStudents}
                >
                  <Text style={styles.enrollButtonText}>
                    {program.enrolled >= program.maxStudents ? 'Full' : 'Enroll'}
                  </Text>
                </TouchableOpacity>
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
  programsList: {
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    paddingVertical: 20,
  },
  programCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  programHeader: {
    marginBottom: 12,
  },
  programTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  programName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  levelText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duration: {
    fontSize: 14,
    opacity: 0.7,
  },
  fee: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
    marginBottom: 12,
  },
  enrollmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  enrolled: {
    fontSize: 12,
    opacity: 0.6,
  },
  enrollButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  enrollButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  enrollButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

