import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface SearchResult {
  id: string;
  type: 'player' | 'match' | 'post';
  title: string;
  subtitle: string;
  description?: string;
  imageUrl?: string;
  metadata: {
    // Player metadata
    skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
    location?: string;
    followers?: number;
    // Match metadata
    matchType?: 'T20' | 'ODI' | 'Test' | 'Practice' | 'Tournament';
    date?: Date;
    playersNeeded?: number;
    currentPlayers?: number;
    // Post metadata
    author?: string;
    likes?: number;
    comments?: number;
    createdAt?: Date;
  };
  isFollowing?: boolean;
  isParticipant?: boolean;
  isLiked?: boolean;
}

interface SearchResultCardProps {
  result: SearchResult;
  onPress: (resultId: string) => void;
  onAction: (resultId: string, action: string) => void;
}

export function SearchResultCard({ result, onPress, onAction }: SearchResultCardProps) {
  const colorScheme = useColorScheme();

  const handlePress = () => {
    onPress(result.id);
  };

  const handleAction = (action: string) => {
    onAction(result.id, action);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'player': return '👤';
      case 'match': return '🏏';
      case 'post': return '📝';
      default: return '🔍';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'player': return '#3742fa';
      case 'match': return '#2ed573';
      case 'post': return '#ffa502';
      default: return '#747d8c';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const getActionButton = () => {
    switch (result.type) {
      case 'player':
        return (
          <TouchableOpacity 
            style={[
              styles.actionButton,
              { 
                backgroundColor: result.isFollowing 
                  ? '#ccc' 
                  : Colors[colorScheme ?? 'light'].tint 
              }
            ]}
            onPress={() => handleAction(result.isFollowing ? 'unfollow' : 'follow')}
          >
            <Text style={styles.actionButtonText}>
              {result.isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        );
      case 'match':
        return (
          <TouchableOpacity 
            style={[
              styles.actionButton,
              { 
                backgroundColor: result.isParticipant 
                  ? '#ccc' 
                  : Colors[colorScheme ?? 'light'].tint 
              }
            ]}
            onPress={() => handleAction(result.isParticipant ? 'leave' : 'join')}
          >
            <Text style={styles.actionButtonText}>
              {result.isParticipant ? 'Joined' : 'Join'}
            </Text>
          </TouchableOpacity>
        );
      case 'post':
        return (
          <TouchableOpacity 
            style={[
              styles.actionButton,
              { 
                backgroundColor: result.isLiked 
                  ? '#ff4757' 
                  : Colors[colorScheme ?? 'light'].tint 
              }
            ]}
            onPress={() => handleAction(result.isLiked ? 'unlike' : 'like')}
          >
            <Text style={styles.actionButtonText}>
              {result.isLiked ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
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
        <View style={styles.titleContainer}>
          <View style={[styles.typeIcon, { 
            backgroundColor: getTypeColor(result.type) 
          }]}>
            <Text style={styles.typeIconText}>
              {getTypeIcon(result.type)}
            </Text>
          </View>
          
          <View style={styles.titleInfo}>
            <Text style={[styles.title, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {result.title}
            </Text>
            <Text style={[styles.subtitle, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {result.subtitle}
            </Text>
          </View>
        </View>

        {getActionButton()}
      </View>

      {/* Description */}
      {result.description && (
        <View style={styles.descriptionContainer}>
          <Text style={[styles.description, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {result.description}
          </Text>
        </View>
      )}

      {/* Metadata */}
      <View style={styles.metadataContainer}>
        {result.type === 'player' && (
          <>
            {result.metadata.skillLevel && (
              <View style={[styles.metadataItem, { 
                backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa' 
              }]}>
                <Text style={[styles.metadataLabel, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  🎯 {result.metadata.skillLevel}
                </Text>
              </View>
            )}
            {result.metadata.location && (
              <View style={[styles.metadataItem, { 
                backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa' 
              }]}>
                <Text style={[styles.metadataLabel, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  📍 {result.metadata.location}
                </Text>
              </View>
            )}
            {result.metadata.followers && (
              <View style={[styles.metadataItem, { 
                backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa' 
              }]}>
                <Text style={[styles.metadataLabel, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  👥 {result.metadata.followers} followers
                </Text>
              </View>
            )}
          </>
        )}

        {result.type === 'match' && (
          <>
            {result.metadata.matchType && (
              <View style={[styles.metadataItem, { 
                backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa' 
              }]}>
                <Text style={[styles.metadataLabel, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  🏏 {result.metadata.matchType}
                </Text>
              </View>
            )}
            {result.metadata.date && (
              <View style={[styles.metadataItem, { 
                backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa' 
              }]}>
                <Text style={[styles.metadataLabel, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  📅 {formatDate(result.metadata.date)}
                </Text>
              </View>
            )}
            {result.metadata.currentPlayers && result.metadata.playersNeeded && (
              <View style={[styles.metadataItem, { 
                backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa' 
              }]}>
                <Text style={[styles.metadataLabel, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  👥 {result.metadata.currentPlayers}/{result.metadata.playersNeeded} players
                </Text>
              </View>
            )}
          </>
        )}

        {result.type === 'post' && (
          <>
            {result.metadata.author && (
              <View style={[styles.metadataItem, { 
                backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa' 
              }]}>
                <Text style={[styles.metadataLabel, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  👤 {result.metadata.author}
                </Text>
              </View>
            )}
            {result.metadata.likes && (
              <View style={[styles.metadataItem, { 
                backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa' 
              }]}>
                <Text style={[styles.metadataLabel, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  ❤️ {result.metadata.likes} likes
                </Text>
              </View>
            )}
            {result.metadata.comments && (
              <View style={[styles.metadataItem, { 
                backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa' 
              }]}>
                <Text style={[styles.metadataLabel, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  💬 {result.metadata.comments} comments
                </Text>
              </View>
            )}
            {result.metadata.createdAt && (
              <View style={[styles.metadataItem, { 
                backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa' 
              }]}>
                <Text style={[styles.metadataLabel, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  📅 {formatDate(result.metadata.createdAt)}
                </Text>
              </View>
            )}
          </>
        )}
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
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  typeIconText: {
    fontSize: 18,
  },
  titleInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  descriptionContainer: {
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  metadataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metadataItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metadataLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
