import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface Message {
  id: string;
  sender: {
    id: string;
    username: string;
    fullName: string;
    avatar?: string;
  };
  content: string;
  timestamp: Date;
  isRead: boolean;
  isOwn: boolean;
  type: 'text' | 'image' | 'match_invite' | 'system';
  metadata?: {
    matchId?: string;
    matchTitle?: string;
    imageUrl?: string;
  };
}

interface MessageCardProps {
  message: Message;
  onPress: (messageId: string) => void;
  onLongPress: (messageId: string) => void;
}

export function MessageCard({ message, onPress, onLongPress }: MessageCardProps) {
  const colorScheme = useColorScheme();

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString();
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return '📷';
      case 'match_invite': return '🏏';
      case 'system': return 'ℹ️';
      default: return '';
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'match_invite': return '#2ed573';
      case 'system': return '#3742fa';
      case 'image': return '#ffa502';
      default: return Colors[colorScheme ?? 'light'].tint;
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: message.isRead 
            ? (colorScheme === 'dark' ? '#1a1a1a' : '#ffffff')
            : (colorScheme === 'dark' ? '#2a2a2a' : '#f8f9fa'),
          borderLeftColor: message.isRead 
            ? 'transparent' 
            : Colors[colorScheme ?? 'light'].tint
        }
      ]}
      onPress={() => onPress(message.id)}
      onLongPress={() => onLongPress(message.id)}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.senderInfo}>
          <View style={[styles.avatar, { 
            backgroundColor: Colors[colorScheme ?? 'light'].tint 
          }]}>
            <Text style={styles.avatarText}>
              {message.sender.fullName.charAt(0).toUpperCase()}
            </Text>
          </View>
          
          <View style={styles.senderDetails}>
            <Text style={[styles.senderName, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {message.sender.fullName}
            </Text>
            <Text style={[styles.senderUsername, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              @{message.sender.username}
            </Text>
          </View>
        </View>

        <View style={styles.messageMeta}>
          <Text style={[styles.timestamp, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {formatTime(message.timestamp)}
          </Text>
          {!message.isRead && (
            <View style={[styles.unreadDot, { 
              backgroundColor: Colors[colorScheme ?? 'light'].tint 
            }]} />
          )}
        </View>
      </View>

      {/* Message Content */}
      <View style={styles.content}>
        {message.type === 'text' && (
          <Text style={[styles.messageText, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {message.content}
          </Text>
        )}

        {message.type === 'image' && (
          <View style={styles.imageContainer}>
            <Text style={[styles.imageIcon, { 
              color: getMessageTypeColor(message.type) 
            }]}>
              📷
            </Text>
            <Text style={[styles.imageText, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Photo
            </Text>
          </View>
        )}

        {message.type === 'match_invite' && (
          <View style={[styles.matchInviteContainer, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
            borderColor: getMessageTypeColor(message.type)
          }]}>
            <View style={styles.matchInviteHeader}>
              <Text style={[styles.matchInviteIcon, { 
                color: getMessageTypeColor(message.type) 
              }]}>
                🏏
              </Text>
              <Text style={[styles.matchInviteTitle, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Match Invitation
              </Text>
            </View>
            <Text style={[styles.matchInviteText, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {message.content}
            </Text>
            {message.metadata?.matchTitle && (
              <Text style={[styles.matchTitle, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                {message.metadata.matchTitle}
              </Text>
            )}
          </View>
        )}

        {message.type === 'system' && (
          <View style={[styles.systemMessageContainer, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa' 
          }]}>
            <Text style={[styles.systemIcon, { 
              color: getMessageTypeColor(message.type) 
            }]}>
              ℹ️
            </Text>
            <Text style={[styles.systemText, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {message.content}
            </Text>
          </View>
        )}
      </View>

      {/* Message Type Indicator */}
      {message.type !== 'text' && (
        <View style={styles.typeIndicator}>
          <Text style={[styles.typeIcon, { 
            color: getMessageTypeColor(message.type) 
          }]}>
            {getMessageTypeIcon(message.type)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderLeftWidth: 4,
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
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  senderDetails: {
    flex: 1,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  senderUsername: {
    fontSize: 14,
    opacity: 0.7,
  },
  messageMeta: {
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  imageIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  imageText: {
    fontSize: 16,
    fontWeight: '600',
  },
  matchInviteContainer: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  matchInviteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchInviteIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  matchInviteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  matchInviteText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  matchTitle: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
  },
  systemMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  systemIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  systemText: {
    fontSize: 14,
    flex: 1,
  },
  typeIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  typeIcon: {
    fontSize: 16,
  },
});
