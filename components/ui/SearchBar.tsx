import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onFilterPress: () => void;
  showFilters?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
}

export function SearchBar({ 
  placeholder = "Search players, matches, posts...",
  onSearch,
  onFilterPress,
  showFilters = true,
  value = '',
  onChangeText
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(value);
  const colorScheme = useColorScheme();

  const handleSearch = () => {
    onSearch(searchQuery.trim());
  };

  const handleTextChange = (text: string) => {
    setSearchQuery(text);
    onChangeText?.(text);
  };

  return (
    <View style={[styles.container, { 
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
      borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
    }]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { 
            color: Colors[colorScheme ?? 'light'].text,
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
            borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
          }]}
          placeholder={placeholder}
          placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
          value={searchQuery}
          onChangeText={handleTextChange}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        <TouchableOpacity 
          style={[styles.searchButton, { 
            backgroundColor: Colors[colorScheme ?? 'light'].tint 
          }]}
          onPress={handleSearch}
        >
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {showFilters && (
        <TouchableOpacity 
          style={[styles.filterButton, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
            borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
          }]}
          onPress={onFilterPress}
        >
          <Text style={[styles.filterIcon, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            ⚙️
          </Text>
          <Text style={[styles.filterText, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Filters
          </Text>
        </TouchableOpacity>
      )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 8,
  },
  searchButton: {
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  filterIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
