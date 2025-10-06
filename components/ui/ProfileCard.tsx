import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  bio?: string;
  location?: string;
  avatar?: string;
  coverImage?: string;
  stats: {
    posts: number;
    matches: number;
    followers: number;
    following: number;
    wins: number;
    losses: number;
  };
  skills: {
    batting: number;
    bowling: number;
    fielding: number;
    overall: number;
  };
  achievements: string[];
  isFollowing: boolean;
  isOwnProfile: boolean;
  joinedDate: Date;
}

interface ProfileCardProps {
  profile: UserProfile;
  onFollow: (userId: string) => void;
  onUnfollow: (userId: string) => void;
  onEdit: (userId: string) => void;
  onMessage: (userId: string) => void;
  onViewPosts: (userId: string) => void;
  onViewMatches: (userId: string) => void;
}

export function ProfileCard({ 
  profile, 
  onFollow, 
  onUnfollow, 
  onEdit, 
  onMessage, 
  onViewPosts, 
  onViewMatches 
}: ProfileCardProps) {
  const colorScheme = useColorScheme();

  const handleFollowToggle = () => {
    if (profile.isFollowing) {
      onUnfollow(profile.id);
    } else {
      onFollow(profile.id);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const getSkillColor = (skill: number) => {
    if (skill >= 80) return '#2ed573';
    if (skill >= 60) return '#ffa502';
    if (skill >= 40) return '#ff6348';
    return '#747d8c';
  };

  return (
    <View style={[styles.container, { 
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
      borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
    }]}>
      {/* Cover Image */}
      {profile.coverImage && (
        <Image source={{ uri: profile.coverImage }} style={styles.coverImage} />
      )}

      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { 
            backgroundColor: Colors[colorScheme ?? 'light'].tint 
          }]}>
            <Text style={styles.avatarText}>
              {profile.fullName.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.profileInfo}>
          <Text style={[styles.fullName, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {profile.fullName}
          </Text>
          <Text style={[styles.username, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            @{profile.username}
          </Text>
          {profile.location && (
            <Text style={[styles.location, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              📍 {profile.location}
            </Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {profile.isOwnProfile ? (
            <TouchableOpacity 
              style={[styles.editButton, { 
                backgroundColor: Colors[colorScheme ?? 'light'].tint 
              }]}
              onPress={() => onEdit(profile.id)}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity 
                style={[
                  styles.followButton,
                  { 
                    backgroundColor: profile.isFollowing 
                      ? '#ccc' 
                      : Colors[colorScheme ?? 'light'].tint 
                  }
                ]}
                onPress={handleFollowToggle}
              >
                <Text style={styles.followButtonText}>
                  {profile.isFollowing ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.messageButton, { 
                  backgroundColor: Colors[colorScheme ?? 'light'].tint 
                }]}
                onPress={() => onMessage(profile.id)}
              >
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Bio */}
      {profile.bio && (
        <View style={styles.bioContainer}>
          <Text style={[styles.bio, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {profile.bio}
          </Text>
        </View>
      )}

      {/* Stats */}
      <View style={styles.statsContainer}>
        <TouchableOpacity 
          style={styles.statItem}
          onPress={() => onViewPosts(profile.id)}
        >
          <Text style={[styles.statNumber, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {profile.stats.posts}
          </Text>
          <Text style={[styles.statLabel, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Posts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.statItem}
          onPress={() => onViewMatches(profile.id)}
        >
          <Text style={[styles.statNumber, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {profile.stats.matches}
          </Text>
          <Text style={[styles.statLabel, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Matches
          </Text>
        </TouchableOpacity>

        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {profile.stats.followers}
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
            {profile.stats.following}
          </Text>
          <Text style={[styles.statLabel, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Following
          </Text>
        </View>
      </View>

      {/* Win/Loss Record */}
      <View style={styles.recordContainer}>
        <Text style={[styles.recordTitle, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          Match Record
        </Text>
        <View style={styles.recordStats}>
          <View style={styles.recordItem}>
            <Text style={[styles.recordNumber, { color: '#2ed573' }]}>
              {profile.stats.wins}
            </Text>
            <Text style={[styles.recordLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Wins
            </Text>
          </View>
          <View style={styles.recordItem}>
            <Text style={[styles.recordNumber, { color: '#ff4757' }]}>
              {profile.stats.losses}
            </Text>
            <Text style={[styles.recordLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Losses
            </Text>
          </View>
        </View>
      </View>

      {/* Skills */}
      <View style={styles.skillsContainer}>
        <Text style={[styles.skillsTitle, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          Cricket Skills
        </Text>
        <View style={styles.skillsList}>
          <View style={styles.skillItem}>
            <Text style={[styles.skillLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Batting
            </Text>
            <View style={[styles.skillBar, { 
              backgroundColor: colorScheme === 'dark' ? '#333' : '#f0f0f0' 
            }]}>
              <View 
                style={[
                  styles.skillProgress, 
                  { 
                    width: `${profile.skills.batting}%`,
                    backgroundColor: getSkillColor(profile.skills.batting)
                  }
                ]} 
              />
            </View>
            <Text style={[styles.skillValue, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {profile.skills.batting}%
            </Text>
          </View>

          <View style={styles.skillItem}>
            <Text style={[styles.skillLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Bowling
            </Text>
            <View style={[styles.skillBar, { 
              backgroundColor: colorScheme === 'dark' ? '#333' : '#f0f0f0' 
            }]}>
              <View 
                style={[
                  styles.skillProgress, 
                  { 
                    width: `${profile.skills.bowling}%`,
                    backgroundColor: getSkillColor(profile.skills.bowling)
                  }
                ]} 
              />
            </View>
            <Text style={[styles.skillValue, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {profile.skills.bowling}%
            </Text>
          </View>

          <View style={styles.skillItem}>
            <Text style={[styles.skillLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Fielding
            </Text>
            <View style={[styles.skillBar, { 
              backgroundColor: colorScheme === 'dark' ? '#333' : '#f0f0f0' 
            }]}>
              <View 
                style={[
                  styles.skillProgress, 
                  { 
                    width: `${profile.skills.fielding}%`,
                    backgroundColor: getSkillColor(profile.skills.fielding)
                  }
                ]} 
              />
            </View>
            <Text style={[styles.skillValue, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {profile.skills.fielding}%
            </Text>
          </View>
        </View>
      </View>

      {/* Achievements */}
      {profile.achievements.length > 0 && (
        <View style={styles.achievementsContainer}>
          <Text style={[styles.achievementsTitle, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            🏆 Achievements
          </Text>
          <View style={styles.achievementsList}>
            {profile.achievements.map((achievement, index) => (
              <View key={index} style={[styles.achievementItem, { 
                backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa' 
              }]}>
                <Text style={[styles.achievementText, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  {achievement}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Joined Date */}
      <View style={styles.joinedContainer}>
        <Text style={[styles.joinedText, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          Joined {formatDate(profile.joinedDate)}
        </Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coverImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  fullName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    opacity: 0.6,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  messageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  messageButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  bioContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  bio: {
    fontSize: 16,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  recordContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  recordStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  recordItem: {
    alignItems: 'center',
  },
  recordNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recordLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  skillsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  skillsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  skillsList: {
    gap: 12,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillLabel: {
    fontSize: 14,
    fontWeight: '600',
    width: 60,
  },
  skillBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 12,
  },
  skillProgress: {
    height: '100%',
    borderRadius: 4,
  },
  skillValue: {
    fontSize: 12,
    fontWeight: '600',
    width: 35,
    textAlign: 'right',
  },
  achievementsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  achievementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  achievementsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  achievementItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  achievementText: {
    fontSize: 12,
    fontWeight: '600',
  },
  joinedContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
  },
  joinedText: {
    fontSize: 12,
    opacity: 0.6,
  },
});
