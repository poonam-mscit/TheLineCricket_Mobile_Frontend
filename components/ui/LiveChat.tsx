import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  type: 'user' | 'system' | 'moderator' | 'expert';
  isHighlighted?: boolean;
  reactions?: {
    emoji: string;
    count: number;
    users: string[];
  }[];
  isPinned?: boolean;
  isDeleted?: boolean;
  replyTo?: string;
}

interface LiveChatProps {
  matchId: string;
  isLive: boolean;
  onSendMessage: (message: string) => void;
  onReactToMessage: (messageId: string, emoji: string) => void;
  onReplyToMessage: (messageId: string, reply: string) => void;
  onReportMessage: (messageId: string, reason: string) => void;
  onBlockUser: (userId: string) => void;
  onMuteUser: (userId: string, duration: number) => void;
  onPinMessage: (messageId: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onModerateChat: (action: string, targetId: string) => void;
}

export function LiveChat({ 
  matchId, 
  isLive, 
  onSendMessage, 
  onReactToMessage, 
  onReplyToMessage, 
  onReportMessage, 
  onBlockUser, 
  onMuteUser, 
  onPinMessage, 
  onDeleteMessage, 
  onModerateChat 
}: LiveChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [showReactions, setShowReactions] = useState(false);
  const [showModeration, setShowModeration] = useState(false);
  
  const colorScheme = useColorScheme();
  const flatListRef = useRef<FlatList>(null);

  const reactionEmojis = ['👍', '👎', '❤️', '😂', '😮', '😢', '🔥', '💯'];

  useEffect(() => {
    // Simulate receiving new messages
    const interval = setInterval(() => {
      if (isLive && Math.random() > 0.7) {
        const newMsg: ChatMessage = {
          id: Date.now().toString(),
          userId: 'user' + Math.floor(Math.random() * 1000),
          username: 'User' + Math.floor(Math.random() * 1000),
          message: generateRandomMessage(),
          timestamp: new Date(),
          type: 'user'
        };
        setMessages(prev => [...prev, newMsg]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const generateRandomMessage = () => {
    const messages = [
      'Great shot! 🏏',
      'What a catch!',
      'This is getting exciting!',
      'Come on team! 💪',
      'Amazing bowling!',
      'Six! 🔥',
      'Beautiful cover drive!',
      'That was close!',
      'Excellent fielding!',
      'What a match!'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && !isMuted) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        userId: 'currentUser',
        username: 'You',
        message: newMessage.trim(),
        timestamp: new Date(),
        type: 'user'
      };
      
      setMessages(prev => [...prev, message]);
      onSendMessage(newMessage.trim());
      setNewMessage('');
      setIsTyping(false);
    }
  };

  const handleReactToMessage = (messageId: string, emoji: string) => {
    onReactToMessage(messageId, emoji);
    setShowReactions(false);
  };

  const handleReplyToMessage = (messageId: string) => {
    setSelectedMessage(messageId);
    // In a real app, this would open a reply input
  };

  const handleReportMessage = (messageId: string) => {
    Alert.alert(
      'Report Message',
      'Why are you reporting this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Spam', onPress: () => onReportMessage(messageId, 'spam') },
        { text: 'Inappropriate', onPress: () => onReportMessage(messageId, 'inappropriate') },
        { text: 'Harassment', onPress: () => onReportMessage(messageId, 'harassment') }
      ]
    );
  };

  const handleBlockUser = (userId: string) => {
    Alert.alert(
      'Block User',
      'Are you sure you want to block this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Block', style: 'destructive', onPress: () => onBlockUser(userId) }
      ]
    );
  };

  const handleMuteUser = (userId: string) => {
    if (isModerator) {
      Alert.alert(
        'Mute User',
        'How long should this user be muted?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: '5 minutes', onPress: () => onMuteUser(userId, 5) },
          { text: '1 hour', onPress: () => onMuteUser(userId, 60) },
          { text: '24 hours', onPress: () => onMuteUser(userId, 1440) }
        ]
      );
    }
  };

  const handleModerateChat = (action: string, targetId: string) => {
    onModerateChat(action, targetId);
    setShowModeration(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'system': return '#2ed573';
      case 'moderator': return '#ffa502';
      case 'expert': return '#3742fa';
      default: return Colors[colorScheme ?? 'light'].text;
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'system': return '🔔';
      case 'moderator': return '🛡️';
      case 'expert': return '👨‍💼';
      default: return '';
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[styles.messageContainer, { 
      backgroundColor: item.isHighlighted ? 'rgba(46, 213, 115, 0.1)' : 'transparent'
    }]}>
      <View style={[styles.message, { 
        backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
        borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
      }]}>
        <View style={styles.messageHeader}>
          <View style={styles.messageUser}>
            {getMessageTypeIcon(item.type) && (
              <Text style={styles.messageTypeIcon}>
                {getMessageTypeIcon(item.type)}
              </Text>
            )}
            <Text style={[styles.messageUsername, { 
              color: getMessageTypeColor(item.type) 
            }]}>
              {item.username}
            </Text>
            <Text style={[styles.messageTime, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {formatTime(item.timestamp)}
            </Text>
          </View>
          
          {item.isPinned && (
            <Text style={styles.pinnedIcon}>📌</Text>
          )}
        </View>

        <Text style={[styles.messageText, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          {item.isDeleted ? '[Message deleted]' : item.message}
        </Text>

        {item.reactions && item.reactions.length > 0 && (
          <View style={styles.reactionsContainer}>
            {item.reactions.map((reaction, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.reactionButton, { 
                  backgroundColor: colorScheme === 'dark' ? '#444' : '#e0e0e0'
                }]}
                onPress={() => handleReactToMessage(item.id, reaction.emoji)}
              >
                <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
                <Text style={[styles.reactionCount, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  {reaction.count}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {!item.isDeleted && (
          <View style={styles.messageActions}>
            <TouchableOpacity 
              style={styles.messageAction}
              onPress={() => handleReactToMessage(item.id, '👍')}
            >
              <Text style={styles.messageActionText}>👍</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.messageAction}
              onPress={() => handleReplyToMessage(item.id)}
            >
              <Text style={styles.messageActionText}>💬</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.messageAction}
              onPress={() => handleReportMessage(item.id)}
            >
              <Text style={styles.messageActionText}>🚫</Text>
            </TouchableOpacity>
            
            {isModerator && (
              <TouchableOpacity 
                style={styles.messageAction}
                onPress={() => handleMuteUser(item.userId)}
              >
                <Text style={styles.messageActionText}>🔇</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { 
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
      borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
    }]}>
      {/* Chat Header */}
      <View style={[styles.header, { 
        backgroundColor: colorScheme === 'dark' ? '#2c2c2c' : '#f8f9fa'
      }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerTitle, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Live Chat
          </Text>
          <Text style={[styles.headerSubtitle, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {messages.length} messages
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={[styles.headerButton, { 
              backgroundColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
            }]}
            onPress={() => setIsMuted(!isMuted)}
          >
            <Text style={styles.headerButtonText}>
              {isMuted ? '🔇' : '🔊'}
            </Text>
          </TouchableOpacity>
          
          {isModerator && (
            <TouchableOpacity 
              style={[styles.headerButton, { 
                backgroundColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
              }]}
              onPress={() => setShowModeration(!showModeration)}
            >
              <Text style={styles.headerButtonText}>🛡️</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <View style={styles.typingIndicator}>
          <Text style={[styles.typingText, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </Text>
        </View>
      )}

      {/* Message Input */}
      <View style={[styles.inputContainer, { 
        backgroundColor: colorScheme === 'dark' ? '#2c2c2c' : '#f8f9fa'
      }]}>
        <TextInput
          style={[styles.messageInput, { 
            color: Colors[colorScheme ?? 'light'].text,
            backgroundColor: colorScheme === 'dark' ? '#333' : '#ffffff',
            borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
          }]}
          placeholder="Type a message..."
          placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          maxLength={500}
          editable={!isMuted}
        />
        
        <View style={styles.inputActions}>
          <TouchableOpacity 
            style={[styles.reactionButtonSmall, { 
              backgroundColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
            }]}
            onPress={() => setShowReactions(!showReactions)}
          >
            <Text style={styles.reactionButtonText}>😊</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.sendButton, { 
              backgroundColor: isMuted ? '#ccc' : Colors[colorScheme ?? 'light'].tint 
            }]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim() || isMuted}
          >
            <Text style={styles.sendButtonText}>
              {isMuted ? '🔇' : '📤'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Reactions Panel */}
      {showReactions && (
        <View style={[styles.reactionsPanel, { 
          backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
          borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
        }]}>
          {reactionEmojis.map((emoji, index) => (
            <TouchableOpacity
              key={index}
              style={styles.reactionOption}
              onPress={() => {
                setNewMessage(prev => prev + emoji);
                setShowReactions(false);
              }}
            >
              <Text style={styles.reactionOptionText}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Moderation Panel */}
      {showModeration && isModerator && (
        <View style={[styles.moderationPanel, { 
          backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
          borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
        }]}>
          <Text style={[styles.moderationTitle, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Moderation Tools
          </Text>
          <View style={styles.moderationActions}>
            <TouchableOpacity 
              style={[styles.moderationButton, { 
                backgroundColor: '#ff4757' 
              }]}
              onPress={() => handleModerateChat('clear', 'all')}
            >
              <Text style={styles.moderationButtonText}>Clear Chat</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.moderationButton, { 
                backgroundColor: '#ffa502' 
              }]}
              onPress={() => handleModerateChat('slow', 'all')}
            >
              <Text style={styles.moderationButtonText}>Slow Mode</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.moderationButton, { 
                backgroundColor: '#3742fa' 
              }]}
              onPress={() => handleModerateChat('emote', 'all')}
            >
              <Text style={styles.moderationButtonText}>Emote Only</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    opacity: 0.7,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    fontSize: 16,
  },
  messagesList: {
    flex: 1,
    padding: 12,
  },
  messageContainer: {
    marginBottom: 8,
  },
  message: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  messageTypeIcon: {
    fontSize: 12,
  },
  messageUsername: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  messageTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  pinnedIcon: {
    fontSize: 12,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  reactionEmoji: {
    fontSize: 12,
  },
  reactionCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  messageActions: {
    flexDirection: 'row',
    gap: 8,
  },
  messageAction: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  messageActionText: {
    fontSize: 12,
  },
  typingIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  typingText: {
    fontSize: 12,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reactionButtonSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactionButtonText: {
    fontSize: 16,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 16,
    color: 'white',
  },
  reactionsPanel: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    borderTopWidth: 1,
    gap: 8,
  },
  reactionOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  reactionOptionText: {
    fontSize: 20,
  },
  moderationPanel: {
    padding: 12,
    borderTopWidth: 1,
  },
  moderationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  moderationActions: {
    flexDirection: 'row',
    gap: 8,
  },
  moderationButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  moderationButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
