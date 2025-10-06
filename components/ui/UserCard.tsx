import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface User {
  id: string;
  username: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  location?: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
  };
}

interface UserCardProps {
  user: User;
  onFollow?: (userId: string) => void;
  onPress?: (userId: string) => void;
  showFollowButton?: boolean;
  isFollowing?: boolean;
}

export function UserCard({ 
  user, 
  onFollow, 
  onPress, 
  showFollowButton = true,
  isFollowing = false 
}: UserCardProps) {
  const colorScheme = useColorScheme();

  const handlePress = () => {
    onPress?.(user.id);
  };

  const handleFollow = () => {
    onFollow?.(user.id);
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { 
        backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
        borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
      }]}
      onPress={handlePress}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.avatar, { 
          backgroundColor: Colors[colorScheme ?? 'light'].tint 
        }]}>
          <Text style={styles.avatarText}>
            {user.fullName.charAt(0).toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.userInfo}>
          <Text style={[styles.fullName, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {user.fullName}
          </Text>
          <Text style={[styles.username, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            @{user.username}
          </Text>
          {user.bio && (
            <Text style={[styles.bio, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {user.bio}
            </Text>
          )}
          {user.location && (
            <Text style={[styles.location, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              📍 {user.location}
            </Text>
          )}
        </View>

        {showFollowButton && (
          <TouchableOpacity 
            style={[
              styles.followButton,
              { 
                backgroundColor: isFollowing 
                  ? '#ccc' 
                  : Colors[colorScheme ?? 'light'].tint 
              }
            ]}
            onPress={handleFollow}
          >
            <Text style={styles.followButtonText}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {user.stats.posts}
          </Text>
          <Text style={[styles.statLabel, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Posts
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {user.stats.followers}
          </Text>
          <Text style={[styles.statLabel, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Followers
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {user.stats.following}
          </Text>
          <Text style={[styles.statLabel, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Following
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  fullName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 4,
    lineHeight: 18,
  },
  location: {
    fontSize: 12,
    opacity: 0.6,
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 8,
  },
  followButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
});
