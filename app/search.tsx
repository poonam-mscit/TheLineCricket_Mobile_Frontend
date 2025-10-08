import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

// Import existing components
import { InstagramBottomNav } from '@/components/ui/InstagramBottomNav';
import { SearchBar } from '@/components/ui/SearchBar';
import { SearchResultCard } from '@/components/ui/SearchResultCard';

interface SearchResult {
  id: string;
  type: 'player' | 'match' | 'post' | 'academy' | 'job' | 'coach' | 'community';
  title: string;
  subtitle: string;
  description?: string;
  imageUrl?: string;
  metadata: {
    skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
    location?: string;
    followers?: number;
    matchType?: 'T20' | 'ODI' | 'Test' | 'Practice' | 'Tournament';
    date?: Date;
    playersNeeded?: number;
    currentPlayers?: number;
    author?: string;
    likes?: number;
    comments?: number;
    createdAt?: Date;
  };
  isFollowing?: boolean;
  isParticipant?: boolean;
  isLiked?: boolean;
  isConnected?: boolean;
  isApplied?: boolean;
  isJoined?: boolean;
}

interface TrendingContent {
  id: string;
  title: string;
  description: string;
  type: string;
  imageUrl?: string;
  popularity: number;
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [trendingContent, setTrendingContent] = useState<TrendingContent[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [hasSearched, setHasSearched] = useState(false);
  const colorScheme = useColorScheme();
  const searchInputRef = useRef<TextInput>(null);
  const { width } = Dimensions.get('window');

  // Mock user data following existing patterns
  const user = {
    id: '1',
    fullName: 'Demo User',
    username: 'demo_user',
    email: 'demo@example.com',
    avatar: 'https://via.placeholder.com/40',
    verified: true
  };

  // Load search history on component mount
  useEffect(() => {
    loadSearchHistory();
    loadTrendingContent();
  }, []);

  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('search_history');
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.log('Error loading search history:', error);
    }
  };

  const saveSearchHistory = async (query: string) => {
    if (!query.trim()) return;
    
    try {
      const updatedHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 10);
      setSearchHistory(updatedHistory);
      await AsyncStorage.setItem('search_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.log('Error saving search history:', error);
    }
  };

  const loadTrendingContent = () => {
    // Mock trending content
    const trending: TrendingContent[] = [
      {
        id: '1',
        title: 'Cricket Academy Near You',
        description: 'Find the best cricket academies in your area',
        type: 'academy',
        popularity: 95
      },
      {
        id: '2',
        title: 'Weekend Cricket Matches',
        description: 'Join exciting weekend cricket matches',
        type: 'match',
        popularity: 88
      },
      {
        id: '3',
        title: 'Professional Coaches',
        description: 'Connect with certified cricket coaches',
        type: 'coach',
        popularity: 82
      },
      {
        id: '4',
        title: 'Cricket Jobs',
        description: 'Explore career opportunities in cricket',
        type: 'job',
        popularity: 75
      }
    ];
    setTrendingContent(trending);
  };

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    
    try {
      // Simulate API call with debouncing
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock search results based on query and filter
      const mockResults: SearchResult[] = generateMockResults(query, activeFilter);
      setSearchResults(mockResults);
      
      // Save to search history
      await saveSearchHistory(query);
    } catch (error) {
      Alert.alert('Search Error', 'Failed to perform search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockResults = (query: string, filter: string): SearchResult[] => {
    const baseResults: SearchResult[] = [
      {
        id: '1',
        type: 'player',
        title: 'Virat Kohli',
        subtitle: 'Professional Cricketer',
        description: 'Indian cricket team captain and batsman',
        metadata: {
          skillLevel: 'Professional',
          location: 'Delhi, India',
          followers: 50000
        },
        isFollowing: false
      },
      {
        id: '2',
        type: 'match',
        title: 'Weekend Cricket Match',
        subtitle: 'T20 Format',
        description: 'Join us for an exciting T20 cricket match this weekend',
        metadata: {
          matchType: 'T20',
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          playersNeeded: 22,
          currentPlayers: 18
        },
        isParticipant: false
      },
      {
        id: '3',
        type: 'academy',
        title: 'Delhi Cricket Academy',
        subtitle: 'Professional Training',
        description: 'Premier cricket academy with world-class facilities',
        metadata: {
          location: 'Delhi, India',
          followers: 2500
        },
        isJoined: false
      },
      {
        id: '4',
        type: 'coach',
        title: 'Rahul Dravid',
        subtitle: 'Head Coach',
        description: 'Former Indian cricket team captain and coach',
        metadata: {
          skillLevel: 'Professional',
          location: 'Bangalore, India',
          followers: 30000
        },
        isConnected: false
      },
      {
        id: '5',
        type: 'job',
        title: 'Cricket Coach Position',
        subtitle: 'Full-time',
        description: 'Looking for experienced cricket coach for academy',
        metadata: {
          location: 'Mumbai, India',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        isApplied: false
      }
    ];

    // Filter results based on active filter
    if (filter !== 'all') {
      return baseResults.filter(result => result.type === filter);
    }
    
    return baseResults;
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    performSearch(query);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };

  const handleResultPress = (resultId: string) => {
    console.log('Result pressed:', resultId);
    // Navigate to result details
  };

  const handleResultAction = (resultId: string, action: string) => {
    console.log('Result action:', resultId, action);
    Alert.alert('Action', `${action} action performed on result ${resultId}`);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (searchQuery.trim()) {
      await performSearch(searchQuery);
    } else {
      loadTrendingContent();
    }
    setIsRefreshing(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    searchInputRef.current?.focus();
  };


  const renderSearchInput = () => (
    <View style={[styles.searchContainer, { backgroundColor: getColors(colorScheme).background }]}>
      <SearchBar 
        onSearch={handleSearch}
        onFilterPress={() => setShowFilters(!showFilters)}
        showFilters={true}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );

  const renderFilters = () => {
    if (!showFilters) return null;

    const filters = [
      { id: 'all', label: 'All', icon: '🔍' },
      { id: 'player', label: 'Players', icon: '👤' },
      { id: 'match', label: 'Matches', icon: '🏏' },
      { id: 'post', label: 'Posts', icon: '📝' },
      { id: 'academy', label: 'Academies', icon: '🏫' },
      { id: 'job', label: 'Jobs', icon: '💼' },
      { id: 'coach', label: 'Coaches', icon: '👨‍🏫' },
      { id: 'community', label: 'Communities', icon: '👥' }
    ];

    return (
      <View style={[styles.filtersContainer, { backgroundColor: getColors(colorScheme).card }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                {
                  backgroundColor: activeFilter === filter.id ? getColors(colorScheme).primary : getColors(colorScheme).background,
                  borderColor: getColors(colorScheme).border
                }
              ]}
              onPress={() => handleFilterChange(filter.id)}
            >
              <Text style={styles.filterIcon}>{filter.icon}</Text>
              <Text style={[
                styles.filterText,
                { color: activeFilter === filter.id ? 'white' : getColors(colorScheme).text }
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderSearchResults = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={getColors(colorScheme).primary} />
          <Text style={[styles.loadingText, { color: getColors(colorScheme).text }]}>
            Searching...
          </Text>
        </View>
      );
    }

    if (!hasSearched) {
      return renderTrendingContent();
    }

    if (searchResults.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={[styles.emptyTitle, { color: getColors(colorScheme).text }]}>
            No Results Found
          </Text>
          <Text style={[styles.emptyDescription, { color: getColors(colorScheme).text }]}>
            Try adjusting your search terms or filters
          </Text>
          <TouchableOpacity 
            style={[styles.clearButton, { backgroundColor: getColors(colorScheme).primary }]}
            onPress={clearSearch}
          >
            <Text style={styles.clearButtonText}>Clear Search</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.resultsContainer}>
        <View style={styles.resultsHeader}>
          <Text style={[styles.resultsCount, { color: getColors(colorScheme).text }]}>
            {searchResults.length} results found
          </Text>
        </View>
        
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SearchResultCard
              result={item}
              onPress={handleResultPress}
              onAction={handleResultAction}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsList}
        />
      </View>
    );
  };

  const renderTrendingContent = () => (
    <View style={styles.trendingContainer}>
      <Text style={[styles.trendingTitle, { color: getColors(colorScheme).text }]}>
        Trending Now
      </Text>
      
      {trendingContent.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.trendingItem, { backgroundColor: getColors(colorScheme).card, borderColor: getColors(colorScheme).border }]}
          onPress={() => handleSearch(item.title)}
        >
          <View style={styles.trendingContent}>
            <Text style={styles.trendingIcon}>
              {item.type === 'academy' ? '🏫' : 
               item.type === 'match' ? '🏏' : 
               item.type === 'coach' ? '👨‍🏫' : '💼'}
            </Text>
            <View style={styles.trendingText}>
              <Text style={[styles.trendingItemTitle, { color: getColors(colorScheme).text }]}>
                {item.title}
              </Text>
              <Text style={[styles.trendingItemDescription, { color: getColors(colorScheme).text }]}>
                {item.description}
              </Text>
            </View>
            <Text style={styles.trendingPopularity}>{item.popularity}%</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderBottomNavigation = () => (
    <InstagramBottomNav 
      activeSection="search"
      onSectionChange={(section) => {
        if (section !== 'search') {
          router.push('/home');
        }
      }}
      onCreatePost={(content) => console.log('Create post:', content)}
      onCreateMatch={(matchData) => console.log('Create match:', matchData)}
      onCreateTeam={(teamData) => console.log('Create team:', teamData)}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: getColors(colorScheme).background }]}>
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[getColors(colorScheme).primary]}
            tintColor={getColors(colorScheme).primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderSearchInput()}
        {renderFilters()}
        {renderSearchResults()}
      </ScrollView>
      
      {renderBottomNavigation()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filtersContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filtersScroll: {
    paddingHorizontal: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  clearButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  resultsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  trendingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  trendingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  trendingContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendingIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  trendingText: {
    flex: 1,
  },
  trendingItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  trendingItemDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  trendingPopularity: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    marginRight: 8,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    fontSize: 18,
    color: '#374151',
  },
});
