import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import { PageAboutSectionProps } from '@/types/pages';
import React from 'react';
import { StyleSheet, TextInput, useColorScheme, View } from 'react-native';

export function PageAboutSection({ 
  description, 
  stats, 
  isEditing, 
  onDescriptionChange 
}: PageAboutSectionProps) {
  const colorScheme = useColorScheme();

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const getStatColor = (label: string) => {
    const colorMap: Record<string, string> = {
      students: '#8B5CF6',
      coaches: '#3B82F6',
      members: '#3B82F6',
      events: '#10B981',
      posts: '#F59E0B',
      capacity: '#10B981',
      bookings: '#F59E0B',
    };
    return colorMap[label.toLowerCase()] || '#FF6B33';
  };

  return (
    <View style={[styles.container, { 
      backgroundColor: getColors(colorScheme).card,
      borderColor: getColors(colorScheme).border
    }]}>
      <Text style={[styles.sectionTitle, { 
        color: getColors(colorScheme).text 
      }]}>
        About
      </Text>

      {isEditing ? (
        <TextInput
          style={[
            styles.descriptionInput,
            {
              backgroundColor: getColors(colorScheme).background,
              color: getColors(colorScheme).text,
              borderColor: getColors(colorScheme).border
            }
          ]}
          value={description}
          onChangeText={onDescriptionChange}
          multiline
          numberOfLines={5}
          placeholder="Enter description..."
          placeholderTextColor={getColors(colorScheme).text + '80'}
        />
      ) : (
        <Text style={[styles.description, { 
          color: getColors(colorScheme).text 
        }]}>
          {description || 'No description available'}
        </Text>
      )}

      <View style={styles.statsGrid}>
        {Object.entries(stats).map(([label, value]) => (
          <View 
            key={label}
            style={[styles.statCard, { 
              backgroundColor: getColors(colorScheme).background 
            }]}
          >
            <Text style={[
              styles.statValue,
              { color: getStatColor(label) }
            ]}>
              {formatNumber(value as number)}
            </Text>
            <Text style={[styles.statLabel, { 
              color: getColors(colorScheme).text 
            }]}>
              {label.charAt(0).toUpperCase() + label.slice(1)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
    marginBottom: 16,
  },
  descriptionInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '47%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
});

