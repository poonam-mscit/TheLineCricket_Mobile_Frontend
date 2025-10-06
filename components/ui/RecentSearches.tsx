import { Text } from '@/components/Themed';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface RecentSearch {
  id: string;
  query: string;
  type: 'search' | 'filter';
  timestamp: Date;
  resultCount?: number;
}

interface RecentSearchesProps {
  searches: RecentSearch[];
  onSearchPress: (query: string) => void;
  onClearHistory: () => void;
  onRemoveSearch: (searchId: string) => void;
}

export function RecentSearches({ 
  searches, 
  onSearchPress, 
  onClearHistory, 
  onRemoveSearch 
}: RecentSearchesProps) {
  const colorScheme = useColorScheme();

  const handleSearchPress = (query: string) => {
    onSearchPress(query);
  };

  const handleRemoveSearch = (searchId: string) => {
    onRemoveSearch(searchId);
  };

  const handleClearHistory = () => {
    onClearHistory();
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getSearchIcon = (type: string) => {
    switch (type) {
      case 'search': return '🔍';
      case 'filter': return '⚙️';
      default: return '🔍';
    }
  };

  if (searches.length === 0) {
    return (
      <View style={[styles.emptyContainer, { 
        backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
        borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
      }]}>
        <Text style={[styles.emptyTitle, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          No Recent Searches
        </Text>
        <Text style={[styles.emptyDescription, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          Your recent searches will appear here
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { 
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
      borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
    }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          Recent Searches
        </Text>
        <TouchableOpacity 
          style={[styles.clearButton, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
            borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
          }]}
          onPress={handleClearHistory}
        >
          <Text style={[styles.clearButtonText, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Clear All
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {searches.map((search) => (
          <View key={search.id} style={styles.searchItem}>
            <TouchableOpacity 
              style={styles.searchContent}
              onPress={() => handleSearchPress(search.query)}
            >
              <View style={styles.searchInfo}>
                <Text style={[styles.searchIcon, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  {getSearchIcon(search.type)}
                </Text>
                <View style={styles.searchDetails}>
                  <Text style={[styles.searchQuery, { 
                    color: Colors[colorScheme ?? 'light'].text 
                  }]}>
                    {search.query}
                  </Text>
                  <View style={styles.searchMeta}>
                    <Text style={[styles.searchTime, { 
                      color: Colors[colorScheme ?? 'light'].text 
                    }]}>
                      {formatTime(search.timestamp)}
                    </Text>
                    {search.resultCount && (
                      <Text style={[styles.resultCount, { 
                        color: Colors[colorScheme ?? 'light'].text 
                      }]}>
                        {search.resultCount} results
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.removeButton, { 
                backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5' 
              }]}
              onPress={() => handleRemoveSearch(search.id)}
            >
              <Text style={[styles.removeButtonText, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
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
  emptyContainer: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  scrollView: {
    maxHeight: 200,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  searchDetails: {
    flex: 1,
  },
  searchQuery: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  searchMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchTime: {
    fontSize: 12,
    opacity: 0.6,
    marginRight: 8,
  },
  resultCount: {
    fontSize: 12,
    opacity: 0.6,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  removeButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
