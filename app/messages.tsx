import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

interface Message {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    isOnline: boolean;
  };
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
}

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  isFromCurrentUser: boolean;
}

export default function MessagesScreen() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();

  // Sample messages data
  const [messages] = useState<Message[]>([
    {
      id: '1',
      user: {
        id: '1',
        name: 'Cricket Team Alpha',
        avatar: undefined,
        isOnline: true
      },
      lastMessage: 'Hey! Are you ready for tomorrow\'s match?',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      unreadCount: 2
    },
    {
      id: '2',
      user: {
        id: '2',
        name: 'Coach Johnson',
        avatar: undefined,
        isOnline: false
      },
      lastMessage: 'Great practice session today!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 0
    },
    {
      id: '3',
      user: {
        id: '3',
        name: 'Team Manager',
        avatar: undefined,
        isOnline: true
      },
      lastMessage: 'Don\'t forget about the team meeting',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      unreadCount: 1
    },
    {
      id: '4',
      user: {
        id: '4',
        name: 'Match Organizer',
        avatar: undefined,
        isOnline: false
      },
      lastMessage: 'Your match is confirmed for this weekend',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      unreadCount: 0
    }
  ]);

  // Sample chat messages for selected chat
  const [chatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: '1',
      username: 'Cricket Team Alpha',
      message: 'Hey! Are you ready for tomorrow\'s match?',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      isRead: false,
      isFromCurrentUser: false
    },
    {
      id: '2',
      userId: 'current',
      username: 'You',
      message: 'Yes, I\'m all set! What time should we meet?',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      isRead: true,
      isFromCurrentUser: true
    },
    {
      id: '3',
      userId: '1',
      username: 'Cricket Team Alpha',
      message: 'Great! Let\'s meet at 9 AM at the ground',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
      isFromCurrentUser: false
    }
  ]);

  const filteredMessages = messages.filter(message =>
    message.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMessagePress = (message: Message) => {
    setSelectedChat(message.id);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleBackToMessages = () => {
    setSelectedChat(null);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const formatChatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessageItem = ({ item }: { item: Message }) => (
    <TouchableOpacity
      style={[styles.messageItem, { 
        backgroundColor: getColors(colorScheme).card,
        borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
      }]}
      onPress={() => handleMessagePress(item)}
    >
      <View style={styles.messageLeft}>
        <View style={[styles.messageAvatar, { 
          backgroundColor: item.user.isOnline ? getColors(colorScheme).success : getColors(colorScheme).text
        }]}>
          <Text style={styles.messageAvatarText}>
            {item.user.name.charAt(0)}
          </Text>
        </View>
        <View style={styles.messageContent}>
          <View style={styles.messageHeader}>
            <Text style={[styles.messageName, { 
              color: getColors(colorScheme).text 
            }]}>
              {item.user.name}
            </Text>
            <Text style={[styles.messageTime, { 
              color: getColors(colorScheme).text 
            }]}>
              {formatTime(item.timestamp)}
            </Text>
          </View>
          <Text style={[styles.messageText, { 
            color: getColors(colorScheme).text 
          }]}>
            {item.lastMessage}
          </Text>
        </View>
      </View>
      {item.unreadCount > 0 && (
        <View style={[styles.messageBadge, { 
          backgroundColor: getColors(colorScheme).tint 
        }]}>
          <Text style={styles.messageBadgeText}>
            {item.unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderChatMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[
      styles.chatMessageContainer,
      item.isFromCurrentUser ? styles.chatMessageRight : styles.chatMessageLeft
    ]}>
      <View style={[
        styles.chatMessage,
        { 
          backgroundColor: item.isFromCurrentUser 
            ? getColors(colorScheme).tint 
            : (colorScheme === 'dark' ? '#333' : '#f8f9fa'),
          borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
        }
      ]}>
        <Text style={[
          styles.chatMessageText,
          { 
            color: item.isFromCurrentUser 
              ? 'white' 
              : getColors(colorScheme).text 
          }
        ]}>
          {item.message}
        </Text>
        <Text style={[
          styles.chatMessageTime,
          { 
            color: item.isFromCurrentUser 
              ? 'rgba(255,255,255,0.7)' 
              : getColors(colorScheme).text 
          }
        ]}>
          {formatChatTime(item.timestamp)}
        </Text>
      </View>
    </View>
  );

  if (selectedChat) {
    const selectedMessage = messages.find(m => m.id === selectedChat);
    return (
      <View style={[styles.container, { 
        backgroundColor: getColors(colorScheme).background
      }]}>
        {/* Chat Header */}
        <View style={[styles.chatHeader, { 
          backgroundColor: getColors(colorScheme).card,
          borderBottomColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
        }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackToMessages}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.chatHeaderInfo}>
            <Text style={[styles.chatHeaderName, { 
              color: getColors(colorScheme).text 
            }]}>
              {selectedMessage?.user.name}
            </Text>
            <Text style={[styles.chatHeaderStatus, { 
              color: selectedMessage?.user.isOnline ? '#2ed573' : '#747d8c'
            }]}>
              {selectedMessage?.user.isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Text style={styles.moreButtonText}>⋯</Text>
          </TouchableOpacity>
        </View>

        {/* Chat Messages */}
        <FlatList
          data={chatMessages}
          renderItem={renderChatMessage}
          keyExtractor={(item) => item.id}
          style={styles.chatMessagesList}
          showsVerticalScrollIndicator={false}
        />

        {/* Message Input */}
        <View style={[styles.messageInputContainer, { 
          backgroundColor: getColors(colorScheme).card,
          borderTopColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
        }]}>
          <TextInput
            style={[styles.messageInput, { 
              color: getColors(colorScheme).text,
              backgroundColor: getColors(colorScheme).background,
              borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
            }]}
            placeholder="Type a message..."
            placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendButton, { 
              backgroundColor: getColors(colorScheme).tint 
            }]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Text style={styles.sendButtonText}>📤</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { 
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff'
    }]}>
      {/* Header */}
      <View style={[styles.header, { 
        backgroundColor: colorScheme === 'dark' ? '#2c2c2c' : '#f8f9fa',
        borderBottomColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
      }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { 
          color: getColors(colorScheme).text 
        }]}>
          Messages
        </Text>
        <TouchableOpacity style={styles.newMessageButton}>
          <Text style={styles.newMessageButtonText}>✏️</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { 
        backgroundColor: getColors(colorScheme).background
      }]}>
        <TextInput
          style={[styles.searchInput, { 
            color: getColors(colorScheme).text,
            backgroundColor: getColors(colorScheme).card,
            borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
          }]}
          placeholder="Search messages..."
          placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Messages List */}
      <FlatList
        data={filteredMessages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  newMessageButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newMessageButtonText: {
    fontSize: 16,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  messageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  messageAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  messageAvatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  messageName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  messageTime: {
    fontSize: 10,
    opacity: 0.6,
  },
  messageText: {
    fontSize: 12,
    opacity: 0.8,
  },
  messageBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  messageBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  chatHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chatHeaderName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatHeaderStatus: {
    fontSize: 12,
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatMessagesList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chatMessageContainer: {
    marginBottom: 8,
  },
  chatMessageLeft: {
    alignItems: 'flex-start',
  },
  chatMessageRight: {
    alignItems: 'flex-end',
  },
  chatMessage: {
    maxWidth: '80%',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chatMessageText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  chatMessageTime: {
    fontSize: 10,
    textAlign: 'right',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
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
});
