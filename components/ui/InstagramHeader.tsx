import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    TouchableOpacity, useColorScheme, View
} from 'react-native';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'match' | 'team';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  action?: {
    type: string;
    data: any;
  };
}

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

interface InstagramHeaderProps {
  onNotificationPress?: (notification: Notification) => void;
  onMessagePress?: (message: Message) => void;
  onViewAllNotifications?: () => void;
  onViewAllMessages?: () => void;
}

export function InstagramHeader({ 
  onNotificationPress, 
  onMessagePress, 
  onViewAllNotifications, 
  onViewAllMessages
}: InstagramHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [unreadMessages, setUnreadMessages] = useState(2);
  
  const colorScheme = useColorScheme();
  const { width } = Dimensions.get('window');

  // Enhanced notifications data
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'like',
      title: 'New Like',
      message: 'John Doe liked your post about the cricket match',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
      user: {
        id: '1',
        name: 'John Doe',
        avatar: 'https://via.placeholder.com/40'
      }
    },
    {
      id: '2',
      type: 'comment',
      title: 'New Comment',
      message: 'Sarah Smith commented on your match update',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      isRead: false,
      user: {
        id: '2',
        name: 'Sarah Smith',
        avatar: 'https://via.placeholder.com/40'
      }
    },
    {
      id: '3',
      type: 'follow',
      title: 'New Follower',
      message: 'Mike Johnson started following you',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: false,
      user: {
        id: '3',
        name: 'Mike Johnson',
        avatar: 'https://via.placeholder.com/40'
      }
    },
    {
      id: '4',
      type: 'match',
      title: 'Match Update',
      message: 'Your match against Team Alpha is starting in 30 minutes',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      isRead: true,
      action: {
        type: 'match',
        data: { matchId: 'match_123' }
      }
    },
    {
      id: '5',
      type: 'team',
      title: 'Team Invitation',
      message: 'You have been invited to join Team Warriors',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
      user: {
        id: '4',
        name: 'Team Warriors',
        avatar: 'https://via.placeholder.com/40'
      }
    }
  ]);

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
    }
  ]);

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.isRead) {
      setUnreadNotifications(prev => Math.max(0, prev - 1));
    }
    onNotificationPress?.(notification);
    setShowNotifications(false);
  };

  const handleMessagePress = (message: Message) => {
    if (message.unreadCount > 0) {
      setUnreadMessages(prev => Math.max(0, prev - 1));
    }
    onMessagePress?.(message);
    setShowMessages(false);
  };

  const handleNotificationIconPress = () => {
    setShowNotifications(true);
  };

  const handleMessageIconPress = () => {
    setShowMessages(true);
  };



  const handleMarkAllAsRead = () => {
    setUnreadNotifications(0);
    Alert.alert('Success', 'All notifications marked as read');
  };

  const handleClearAllNotifications = () => {
    Alert.alert(
      'Clear All',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => {
          setUnreadNotifications(0);
          Alert.alert('Success', 'All notifications cleared');
        }}
      ]
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return '❤️';
      case 'comment': return '💬';
      case 'follow': return '👤';
      case 'match': return '🏏';
      case 'team': return '👥';
      default: return '🔔';
    }
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

  const renderNotificationItem = (notification: Notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[styles.notificationItem, { 
        backgroundColor: notification.isRead ? 'transparent' : 'rgba(0, 123, 255, 0.1)',
        borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
      }]}
      onPress={() => handleNotificationPress(notification)}
    >
      <View style={styles.notificationLeft}>
        <Text style={styles.notificationIcon}>
          {getNotificationIcon(notification.type)}
        </Text>
        <View style={styles.notificationContent}>
          <Text style={[styles.notificationTitle, { 
            color: getColors(colorScheme).text 
          }]}>
            {notification.title}
          </Text>
          <Text style={[styles.notificationMessage, { 
            color: getColors(colorScheme).text 
          }]}>
            {notification.message}
          </Text>
          <Text style={[styles.notificationTime, { 
            color: getColors(colorScheme).text 
          }]}>
            {formatTime(notification.timestamp)}
          </Text>
        </View>
      </View>
      {!notification.isRead && (
        <View style={[styles.unreadDot, { 
          backgroundColor: getColors(colorScheme).tint 
        }]} />
      )}
    </TouchableOpacity>
  );

  const renderMessageItem = (message: Message) => (
    <TouchableOpacity
      key={message.id}
      style={[styles.messageItem, { 
        backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
        borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
      }]}
      onPress={() => handleMessagePress(message)}
    >
      <View style={styles.messageLeft}>
        <View style={[styles.messageAvatar, { 
          backgroundColor: message.user.isOnline ? '#2ed573' : '#747d8c'
        }]}>
          <Text style={styles.messageAvatarText}>
            {message.user.name.charAt(0)}
          </Text>
        </View>
        <View style={styles.messageContent}>
          <View style={styles.messageHeader}>
            <Text style={[styles.messageName, { 
              color: getColors(colorScheme).text 
            }]}>
              {message.user.name}
            </Text>
            <Text style={[styles.messageTime, { 
              color: getColors(colorScheme).text 
            }]}>
              {formatTime(message.timestamp)}
            </Text>
          </View>
          <Text style={[styles.messageText, { 
            color: getColors(colorScheme).text 
          }]}>
            {message.lastMessage}
          </Text>
        </View>
      </View>
      {message.unreadCount > 0 && (
        <View style={[styles.messageBadge, { 
          backgroundColor: getColors(colorScheme).tint 
        }]}>
          <Text style={styles.messageBadgeText}>
            {message.unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.header, { 
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
      borderBottomColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
    }]}>
      <View style={styles.headerLeft}>
        <Text style={[styles.appName, { color: getColors(colorScheme).text }]}>
          The Line Cricket
        </Text>
      </View>
      
      <View style={styles.headerRight}>
        {/* Notifications Button */}
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={handleNotificationIconPress}
        >
          <Text style={styles.headerButtonText}>🔔</Text>
          {unreadNotifications > 0 && (
            <View style={[styles.badge, { 
              backgroundColor: '#ff4757' 
            }]}>
              <Text style={styles.badgeText}>
                {unreadNotifications}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        
        {/* Messages Button */}
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={handleMessageIconPress}
        >
          <Text style={styles.headerButtonText}>💬</Text>
          {unreadMessages > 0 && (
            <View style={[styles.badge, { 
              backgroundColor: '#ff4757' 
            }]}>
              <Text style={styles.badgeText}>
                {unreadMessages}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Notifications Modal */}
      <Modal
        visible={showNotifications}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNotifications(false)}
      >
        <View style={[styles.modalContainer, { 
          backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff'
        }]}>
          <View style={[styles.modalHeader, { 
            backgroundColor: colorScheme === 'dark' ? '#2c2c2c' : '#f8f9fa',
            borderBottomColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
          }]}>
            <Text style={[styles.modalTitle, { 
              color: getColors(colorScheme).text 
            }]}>
              Notifications ({unreadNotifications} unread)
            </Text>
            <View style={styles.modalHeaderActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleMarkAllAsRead}
              >
                <Text style={[styles.actionButtonText, { 
                  color: getColors(colorScheme).tint 
                }]}>
                  Mark All Read
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleClearAllNotifications}
              >
                <Text style={[styles.actionButtonText, { 
                  color: '#ff4757' 
                }]}>
                  Clear All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowNotifications(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {notifications.map(renderNotificationItem)}
          </ScrollView>
          
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={[styles.viewAllButton, { 
                backgroundColor: getColors(colorScheme).tint 
              }]}
              onPress={() => {
                setShowNotifications(false);
                onViewAllNotifications?.();
              }}
            >
              <Text style={styles.viewAllButtonText}>
                View All Notifications
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.navigateButton, { 
                backgroundColor: getColors(colorScheme).card,
                borderColor: getColors(colorScheme).border
              }]}
              onPress={() => {
                setShowNotifications(false);
                onViewAllNotifications?.();
              }}
            >
              <Text style={[styles.navigateButtonText, { 
                color: getColors(colorScheme).text 
              }]}>
                📱 Open Notifications Screen
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Messages Modal */}
      <Modal
        visible={showMessages}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowMessages(false)}
      >
        <View style={[styles.modalContainer, { 
          backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff'
        }]}>
          <View style={[styles.modalHeader, { 
            backgroundColor: colorScheme === 'dark' ? '#2c2c2c' : '#f8f9fa',
            borderBottomColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
          }]}>
            <Text style={[styles.modalTitle, { 
              color: getColors(colorScheme).text 
            }]}>
              Messages
            </Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowMessages(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {messages.map(renderMessageItem)}
          </ScrollView>
          
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={[styles.viewAllButton, { 
                backgroundColor: getColors(colorScheme).tint 
              }]}
              onPress={() => {
                setShowMessages(false);
                onViewAllMessages?.();
              }}
            >
              <Text style={styles.viewAllButtonText}>
                View All Messages
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.navigateButton, { 
                backgroundColor: getColors(colorScheme).card,
                borderColor: getColors(colorScheme).border
              }]}
              onPress={() => {
                setShowMessages(false);
                onViewAllMessages?.();
              }}
            >
              <Text style={[styles.navigateButtonText, { 
                color: getColors(colorScheme).text 
              }]}>
                💬 Open Messages Screen
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  headerButtonText: {
    fontSize: 18,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navigateButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  navigateButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 2,
  },
  notificationTime: {
    fontSize: 10,
    opacity: 0.6,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
  viewAllButton: {
    margin: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewAllButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
