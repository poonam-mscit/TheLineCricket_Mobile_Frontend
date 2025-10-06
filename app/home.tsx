import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

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
  const colorScheme = useColorScheme();
  
  // Mock user data since we removed authentication
  const user = {
    id: '1',
    fullName: 'Demo User',
    username: 'demo_user',
    email: 'demo@example.com'
  };

  // Sample data for different sections
  const [posts] = useState([
    {
      id: '1',
      author: {
        id: '1',
        username: 'cricket_fan_2024',
        fullName: 'Cricket Fan',
        avatar: undefined
      },
      content: 'Just had an amazing practice session! The new batting technique is working wonders. Can\'t wait for the weekend match! 🏏',
      imageUrl: undefined,
      location: 'Mumbai Cricket Ground',
      likes: 24,
      comments: 8,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isLiked: false
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

  const [matches] = useState([
    {
      id: '1',
      teamA: 'Mumbai Indians',
      teamB: 'Chennai Super Kings',
      date: new Date(),
      location: 'Wankhede Stadium',
      type: 'T20',
      status: 'upcoming'
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

  const handleLogout = () => {
    router.replace('/');
  };

  const renderHeader = () => (
    <InstagramHeader 
      onNotificationPress={(notification) => {
        console.log('Notification pressed:', notification);
        router.push('/notifications');
      }}
      onMessagePress={(message) => {
        console.log('Message pressed:', message);
        router.push('/messages');
      }}
      onViewAllNotifications={() => {
        console.log('View all notifications');
        router.push('/notifications');
      }}
      onViewAllMessages={() => {
        console.log('View all messages');
        router.push('/messages');
      }}
    />
  );

  const renderBottomNavigation = () => (
    <InstagramBottomNav 
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      onCreatePost={(content) => console.log('Create post:', content)}
      onCreateMatch={(matchData) => console.log('Create match:', matchData)}
      onCreateTeam={(teamData) => console.log('Create team:', teamData)}
    />
  );

  const renderHomeSection = () => (
    <ScrollView style={styles.sectionContent}>
      <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
        Welcome back, {user?.fullName || 'User'}! 🏏
      </Text>
      
      
      <CreatePostBox onCreatePost={(content) => console.log('Create post:', content)} />
      
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onLike={(id) => console.log('Like post:', id)}
          onComment={(id, comment) => console.log('Comment on post:', id, comment)}
          onShare={(id) => console.log('Share post:', id)}
        />
      ))}
    </ScrollView>
  );

  const renderSearchSection = () => (
    <ScrollView style={styles.sectionContent}>
      <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
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
      <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
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
      <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
        Cricket Jobs
      </Text>
      
      <Text style={[styles.jobCard, { 
        backgroundColor: Colors[colorScheme ?? 'light'].card,
        borderColor: Colors[colorScheme ?? 'light'].border,
        color: Colors[colorScheme ?? 'light'].text
      }]}>
        🏏 Cricket Coach - Mumbai
      </Text>
      
      <Text style={[styles.jobCard, { 
        backgroundColor: Colors[colorScheme ?? 'light'].card,
        borderColor: Colors[colorScheme ?? 'light'].border,
        color: Colors[colorScheme ?? 'light'].text
      }]}>
        📊 Cricket Analyst - Delhi
      </Text>
      
      <Text style={[styles.jobCard, { 
        backgroundColor: Colors[colorScheme ?? 'light'].card,
        borderColor: Colors[colorScheme ?? 'light'].border,
        color: Colors[colorScheme ?? 'light'].text
      }]}>
        🎯 Bowling Coach - Bangalore
      </Text>
    </ScrollView>
  );

  const renderProfileSection = () => (
    <ScrollView style={styles.sectionContent}>
      <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
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
        style={[styles.logoutButton, { backgroundColor: Colors[colorScheme ?? 'light'].error }]}
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
      backgroundColor: Colors[colorScheme ?? 'light'].background
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
