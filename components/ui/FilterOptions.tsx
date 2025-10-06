import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface FilterOptionsProps {
  onApplyFilters: (filters: SearchFilters) => void;
  onClearFilters: () => void;
  initialFilters?: SearchFilters;
}

export interface SearchFilters {
  type: 'all' | 'players' | 'matches' | 'posts';
  location?: string;
  skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  matchType?: 'T20' | 'ODI' | 'Test' | 'Practice' | 'Tournament';
  dateRange?: 'today' | 'week' | 'month' | 'all';
  sortBy?: 'relevance' | 'date' | 'popularity';
}

export function FilterOptions({ 
  onApplyFilters, 
  onClearFilters, 
  initialFilters = { type: 'all' } 
}: FilterOptionsProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'relevance',
    ...initialFilters
  });
  
  const colorScheme = useColorScheme();

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleClear = () => {
    const defaultFilters: SearchFilters = {
      type: 'all',
      sortBy: 'relevance'
    };
    setFilters(defaultFilters);
    onClearFilters();
  };

  const typeOptions = [
    { value: 'all', label: 'All' },
    { value: 'players', label: 'Players' },
    { value: 'matches', label: 'Matches' },
    { value: 'posts', label: 'Posts' }
  ];

  const skillLevelOptions = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
    { value: 'Professional', label: 'Professional' }
  ];

  const matchTypeOptions = [
    { value: 'T20', label: 'T20' },
    { value: 'ODI', label: 'ODI' },
    { value: 'Test', label: 'Test' },
    { value: 'Practice', label: 'Practice' },
    { value: 'Tournament', label: 'Tournament' }
  ];

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'all', label: 'All Time' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'date', label: 'Date' },
    { value: 'popularity', label: 'Popularity' }
  ];

  const renderOptionGroup = (
    title: string,
    options: { value: string; label: string }[],
    currentValue: any,
    onValueChange: (value: any) => void
  ) => (
    <View style={styles.optionGroup}>
      <Text style={[styles.optionTitle, { 
        color: Colors[colorScheme ?? 'light'].text 
      }]}>
        {title}
      </Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              { 
                backgroundColor: currentValue === option.value 
                  ? Colors[colorScheme ?? 'light'].tint 
                  : colorScheme === 'dark' ? '#333' : '#f5f5f5',
                borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
              }
            ]}
            onPress={() => onValueChange(option.value)}
          >
            <Text style={[
              styles.optionText,
              { 
                color: currentValue === option.value 
                  ? 'white' 
                  : Colors[colorScheme ?? 'light'].text 
              }
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { 
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
      borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
    }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderOptionGroup(
          'Search Type',
          typeOptions,
          filters.type,
          (value) => handleFilterChange('type', value)
        )}

        {filters.type === 'players' && renderOptionGroup(
          'Skill Level',
          skillLevelOptions,
          filters.skillLevel,
          (value) => handleFilterChange('skillLevel', value)
        )}

        {filters.type === 'matches' && renderOptionGroup(
          'Match Type',
          matchTypeOptions,
          filters.matchType,
          (value) => handleFilterChange('matchType', value)
        )}

        {renderOptionGroup(
          'Date Range',
          dateRangeOptions,
          filters.dateRange,
          (value) => handleFilterChange('dateRange', value)
        )}

        {renderOptionGroup(
          'Sort By',
          sortOptions,
          filters.sortBy,
          (value) => handleFilterChange('sortBy', value)
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.clearButton, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
            borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
          }]}
          onPress={handleClear}
        >
          <Text style={[styles.clearButtonText, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Clear All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.applyButton, { 
            backgroundColor: Colors[colorScheme ?? 'light'].tint 
          }]}
          onPress={handleApply}
        >
          <Text style={styles.applyButtonText}>
            Apply Filters
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
  scrollView: {
    maxHeight: 300,
  },
  optionGroup: {
    marginBottom: 20,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 14,
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
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginRight: 8,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
