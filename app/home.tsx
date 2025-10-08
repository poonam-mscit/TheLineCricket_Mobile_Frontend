import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

// Import existing components
import { CreateMatchBox } from '@/components/ui/CreateMatchBox';
import { CreatePostBox } from '@/components/ui/CreatePostBox';
import { FilterOptions } from '@/components/ui/FilterOptions';
import { InstagramBottomNav } from '@/components/ui/InstagramBottomNav';
import { InstagramHeader } from '@/components/ui/InstagramHeader';
import { PostCard } from '@/components/ui/PostCard';
import { ProfileCard } from '@/components/ui/ProfileCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { SearchResultCard } from '@/components/ui/SearchResultCard';
import { UserStatsCard } from '@/components/ui/UserStatsCard';

export default function HomeScreen() {
  const [activeSection, setActiveSection] = useState('home');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showLiveMatches, setShowLiveMatches] = useState(true);
  const colorScheme = useColorScheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = Dimensions.get('window');
  
  // Mock user data since we removed authentication
  const user = {
    id: '1',
    fullName: 'Demo User',
    username: 'demo_user',
    email: 'demo@example.com',
    avatar: 'https://via.placeholder.com/40',
    verified: true
  };

  // Enhanced sample data for different sections
  const [posts, setPosts] = useState([
    {
      id: '1',
      author: {
        id: '1',
        username: 'cricket_fan_2024',
        fullName: 'Cricket Fan',
        avatar: 'https://via.placeholder.com/40',
        verified: true
      },
      content: 'Just had an amazing practice session! The new batting technique is working wonders. Can\'t wait for the weekend match! 🏏',
      imageUrl: 'https://via.placeholder.com/400x300',
      location: 'Mumbai Cricket Ground',
      likes: 24,
      comments: 8,
      shares: 3,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isLiked: false,
      isBookmarked: false
    },
    {
      id: '2',
      author: {
        id: '2',
        username: 'bowling_master',
        fullName: 'Bowling Master',
        avatar: 'https://via.placeholder.com/40',
        verified: false
      },
      content: 'Perfect yorker delivery in today\'s practice! The key is to maintain the same action while changing the length. 🎯',
      imageUrl: undefined,
      location: 'Delhi Cricket Academy',
      likes: 18,
      comments: 5,
      shares: 2,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isLiked: true,
      isBookmarked: true
    },
    {
      id: '3',
      author: {
        id: '3',
        username: 'team_captain',
        fullName: 'Team Captain',
        avatar: 'https://via.placeholder.com/40',
        verified: true
      },
      content: 'Team meeting tomorrow at 6 PM. We need to discuss the strategy for the upcoming tournament. All players must attend! 📅',
      imageUrl: undefined,
      location: 'Team Meeting Room',
      likes: 12,
      comments: 15,
      shares: 8,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      isLiked: false,
      isBookmarked: false
    }
  ]);

  const [searchResults] = useState([
    {
      id: '1',
      type: 'player' as const,
      title: 'Virat Kohli',
      subtitle: 'Batsman • India',
      imageUrl: undefined,
      metadata: {
        skillLevel: 'Professional' as const,
        location: 'India',
        followers: 50000
      }
    }
  ]);

  const [liveMatches] = useState([
    {
      id: '1',
      title: 'Mumbai Indians vs Chennai Super Kings',
      teamA: {
        name: 'Mumbai Indians',
        score: '145',
        wickets: '3',
        overs: '18.2',
        flag: '🇮🇳'
      },
      teamB: {
        name: 'Chennai Super Kings',
        score: '132',
        wickets: '5',
        overs: '16.4',
        flag: '🇮🇳'
      },
      status: 'live',
      viewers: 12500,
      venue: 'Wankhede Stadium',
      type: 'T20',
      isWatching: false
    },
    {
      id: '2',
      title: 'Delhi Capitals vs Royal Challengers',
      teamA: {
        name: 'Delhi Capitals',
        score: '89',
        wickets: '2',
        overs: '12.1',
        flag: '🇮🇳'
      },
      teamB: {
        name: 'Royal Challengers',
        score: '78',
        wickets: '4',
        overs: '10.3',
        flag: '🇮🇳'
      },
      status: 'live',
      viewers: 8900,
      venue: 'Feroz Shah Kotla',
      type: 'T20',
      isWatching: true
    }
  ]);

  const [messages] = useState([
    {
      id: '1',
      user: {
        id: '1',
        name: 'John Doe',
        avatar: undefined,
        isOnline: true
      },
      lastMessage: 'Hey! How was the match?',
      timestamp: new Date(),
      unreadCount: 2
    }
  ]);

  // Enhanced event handlers
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => router.replace('/') }
      ]
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Reload posts from storage
    await loadPostsFromStorage();
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleBookmarkPost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const handleWatchMatch = (matchId: string) => {
    Alert.alert('Watch Match', 'Opening live match stream...');
  };

  const handleCreatePost = (content: string) => {
    const newPost = {
      id: Date.now().toString(),
      author: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar,
        verified: user.verified
      },
      content,
      imageUrl: undefined,
      location: undefined,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: new Date(),
      isLiked: false,
      isBookmarked: false
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const handleCreateMatch = (matchData: any) => {
    router.push('/create-match');
  };

  const handleCreateTeam = (teamData: any) => {
    Alert.alert('Create Team', 'Team created successfully!');
  };

  // Load posts from storage on component mount
  useEffect(() => {
    loadPostsFromStorage();
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate live updates
      console.log('Live updates...');
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadPostsFromStorage = async () => {
    try {
      const storedPosts = await AsyncStorage.getItem('home_posts');
      if (storedPosts) {
        const parsedPosts = JSON.parse(storedPosts);
        setPosts(parsedPosts);
      }
    } catch (error) {
      console.log('Error loading posts from storage:', error);
    }
  };

  const renderHeader = () => (
    <InstagramHeader 
      user={user}
      onNotificationPress={(notification) => {
        console.log('Notification pressed:', notification);
        // Handle individual notification press
        Alert.alert('Notification', `You pressed: ${notification.title}`);
      }}
      onMessagePress={(message) => {
        console.log('Message pressed:', message);
        // Handle individual message press
        Alert.alert('Message', `You pressed: ${message.user.name}`);
      }}
      onViewAllNotifications={() => {
        console.log('Navigate to notifications screen');
        router.push('/notifications');
      }}
      onViewAllMessages={() => {
        console.log('Navigate to messages screen');
        router.push('/messages');
      }}
      onSearchPress={() => {
        console.log('Search pressed');
        // Could navigate to search screen or show search modal
      }}
      onProfilePress={() => {
        console.log('Profile pressed');
        router.push('/profile');
      }}
    />
  );

  const renderBottomNavigation = () => (
    <InstagramBottomNav 
      activeSection={activeSection}
      onSectionChange={(section) => {
        if (section === 'profile') {
          router.push('/profile');
        } else {
          setActiveSection(section);
        }
      }}
      onCreatePost={handleCreatePost}
      onCreateMatch={handleCreateMatch}
      onCreateTeam={handleCreateTeam}
    />
  );

  const renderHomeSection = () => (
    <ScrollView 
      ref={scrollViewRef}
      style={styles.sectionContent}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={[getColors(colorScheme).tint]}
          tintColor={getColors(colorScheme).tint}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Welcome Header */}
      <View style={styles.welcomeContainer}>
        <Text style={[styles.welcomeTitle, { color: getColors(colorScheme).text }]}>
          Welcome back, {user?.fullName || 'User'}! 🏏
        </Text>
        <Text style={[styles.welcomeSubtitle, { color: getColors(colorScheme).text }]}>
          Stay updated with the latest cricket action
        </Text>
      </View>

      {/* Live Matches Section */}
      {showLiveMatches && liveMatches.length > 0 && (
        <View style={styles.liveMatchesContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: getColors(colorScheme).text }]}>
              🔴 Live Matches
            </Text>
            <TouchableOpacity 
              onPress={() => setShowLiveMatches(!showLiveMatches)}
              style={styles.toggleButton}
            >
              <Text style={[styles.toggleText, { color: getColors(colorScheme).tint }]}>
                {showLiveMatches ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {liveMatches.map(match => (
            <TouchableOpacity
              key={match.id}
              style={[styles.liveMatchCard, { 
                backgroundColor: getColors(colorScheme).card,
                borderColor: getColors(colorScheme).border
              }]}
              onPress={() => handleWatchMatch(match.id)}
            >
              <View style={styles.matchHeader}>
                <Text style={[styles.matchTitle, { color: getColors(colorScheme).text }]}>
                  {match.title}
                </Text>
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
              </View>
              
              <View style={styles.matchScore}>
                <View style={styles.teamScore}>
                  <Text style={styles.teamFlag}>{match.teamA.flag}</Text>
                  <Text style={[styles.teamName, { color: getColors(colorScheme).text }]}>
                    {match.teamA.name}
                  </Text>
                  <Text style={[styles.score, { color: getColors(colorScheme).text }]}>
                    {match.teamA.score}/{match.teamA.wickets}
                  </Text>
                  <Text style={[styles.overs, { color: getColors(colorScheme).text }]}>
                    ({match.teamA.overs})
                  </Text>
                </View>
                
                <Text style={[styles.vsText, { color: getColors(colorScheme).text }]}>VS</Text>
                
                <View style={styles.teamScore}>
                  <Text style={styles.teamFlag}>{match.teamB.flag}</Text>
                  <Text style={[styles.teamName, { color: getColors(colorScheme).text }]}>
                    {match.teamB.name}
                  </Text>
                  <Text style={[styles.score, { color: getColors(colorScheme).text }]}>
                    {match.teamB.score}/{match.teamB.wickets}
                  </Text>
                  <Text style={[styles.overs, { color: getColors(colorScheme).text }]}>
                    ({match.teamB.overs})
                  </Text>
                </View>
              </View>
              
              <View style={styles.matchFooter}>
                <Text style={[styles.venue, { color: getColors(colorScheme).text }]}>
                  📍 {match.venue}
                </Text>
                <Text style={[styles.viewers, { color: getColors(colorScheme).text }]}>
                  👥 {match.viewers.toLocaleString()} watching
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Create Post Box */}
      <CreatePostBox onCreatePost={handleCreatePost} />
      
      {/* Posts Feed */}
      <View style={styles.postsContainer}>
        <Text style={[styles.sectionTitle, { color: getColors(colorScheme).text }]}>
          Latest Posts
        </Text>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={getColors(colorScheme).tint} />
            <Text style={[styles.loadingText, { color: getColors(colorScheme).text }]}>
              Loading posts...
            </Text>
          </View>
        ) : (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onLike={() => handleLikePost(post.id)}
              onComment={(id, comment) => console.log('Comment on post:', id, comment)}
              onShare={(id) => console.log('Share post:', id)}
              onBookmark={() => handleBookmarkPost(post.id)}
            />
          ))
        )}
      </View>
    </ScrollView>
  );

  const renderSearchSection = () => (
    <ScrollView style={styles.sectionContent}>
      <Text style={[styles.sectionTitle, { color: getColors(colorScheme).text }]}>
        Search Cricket
      </Text>
      
      <SearchBar 
        onSearch={(query) => console.log('Search:', query)}
        onFilterPress={() => console.log('Filter pressed')}
      />
      
      <FilterOptions 
        onApplyFilters={(filters) => console.log('Apply filters:', filters)}
        onClearFilters={() => console.log('Clear filters')}
      />
      
      {searchResults.map(result => (
        <SearchResultCard
          key={result.id}
          result={result}
          onPress={() => console.log('Press result:', result.id)}
          onAction={() => console.log('Action on result:', result.id)}
        />
      ))}
    </ScrollView>
  );

  const renderCreateSection = () => (
    <ScrollView style={styles.sectionContent}>
      <Text style={[styles.sectionTitle, { color: getColors(colorScheme).text }]}>
        Create Content
      </Text>
      
      <CreateMatchBox 
        onCreateMatch={(matchData) => console.log('Create match:', matchData)}
      />
      
      <CreatePostBox onCreatePost={(content) => console.log('Create post:', content)} />
    </ScrollView>
  );

  const renderJobsSection = () => (
    <ScrollView style={styles.sectionContent}>
      <Text style={[styles.sectionTitle, { color: getColors(colorScheme).text }]}>
        Cricket Jobs
      </Text>
      
      <Text style={[styles.jobCard, { 
        backgroundColor: getColors(colorScheme).card,
        borderColor: getColors(colorScheme).border,
        color: getColors(colorScheme).text
      }]}>
        🏏 Cricket Coach - Mumbai
      </Text>
      
      <Text style={[styles.jobCard, { 
        backgroundColor: getColors(colorScheme).card,
        borderColor: getColors(colorScheme).border,
        color: getColors(colorScheme).text
      }]}>
        📊 Cricket Analyst - Delhi
      </Text>
      
      <Text style={[styles.jobCard, { 
        backgroundColor: getColors(colorScheme).card,
        borderColor: getColors(colorScheme).border,
        color: getColors(colorScheme).text
      }]}>
        🎯 Bowling Coach - Bangalore
      </Text>
    </ScrollView>
  );

  const renderProfileSection = () => (
    <ScrollView style={styles.sectionContent}>
      <Text style={[styles.sectionTitle, { color: getColors(colorScheme).text }]}>
        Your Profile
      </Text>
      
      <ProfileCard 
        profile={{
          id: user?.id || '1',
          username: user?.username || 'user',
          fullName: user?.fullName || 'User',
          email: user?.email || 'user@example.com',
          bio: 'Cricket enthusiast',
          avatar: undefined,
          stats: {
            posts: 25,
            matches: 15,
            followers: 150,
            following: 200,
            wins: 12,
            losses: 3
          },
          skills: {
            batting: 85,
            bowling: 70,
            fielding: 80,
            overall: 78
          },
          achievements: ['Best Batsman 2023', 'Team Captain'],
          isFollowing: false,
          isOwnProfile: true,
          joinedDate: new Date('2023-01-01')
        }}
        onFollow={() => console.log('Follow user')}
        onUnfollow={() => console.log('Unfollow user')}
        onEdit={() => console.log('Edit profile')}
        onMessage={() => console.log('Message user')}
        onViewPosts={() => console.log('View posts')}
        onViewMatches={() => console.log('View matches')}
      />
      
      <UserStatsCard 
        stats={{
          posts: 25,
          matches: 15,
          followers: 150,
          following: 200,
          wins: 12,
          losses: 3,
          winRate: 80,
          totalRuns: 450,
          totalWickets: 25,
          bestScore: 85,
          bestBowling: '5/25',
          achievements: 5
        }}
        onStatPress={() => console.log('View detailed stats')}
      />
      
      <TouchableOpacity 
        style={[styles.logoutButton, { backgroundColor: getColors(colorScheme).error }]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'home':
        return renderHomeSection();
      case 'search':
        return renderSearchSection();
      case 'create':
        return renderCreateSection();
      case 'jobs':
        return renderJobsSection();
      case 'profile':
        return renderProfileSection();
      default:
        return renderHomeSection();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { 
      backgroundColor: getColors(colorScheme).background
    }]}>
      {renderHeader()}
      {renderActiveSection()}
      {renderBottomNavigation()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionContent: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  welcomeContainer: {
    marginBottom: 20,
    paddingVertical: 10,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  liveMatchesContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  liveMatchCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff4757',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
    marginRight: 4,
  },
  liveText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  matchScore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  teamScore: {
    flex: 1,
    alignItems: 'center',
  },
  teamFlag: {
    fontSize: 24,
    marginBottom: 4,
  },
  teamName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  overs: {
    fontSize: 12,
    opacity: 0.7,
  },
  vsText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
  matchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  venue: {
    fontSize: 12,
    opacity: 0.7,
  },
  viewers: {
    fontSize: 12,
    opacity: 0.7,
  },
  postsContainer: {
    marginTop: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  jobCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
