import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'match' | 'team' | 'message' | 'achievement' | 'system' | 'reminder';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  timestamp: Date;
  actionUrl?: string;
  actionText?: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
  relatedData?: {
    matchId?: string;
    teamId?: string;
    messageId?: string;
    achievementId?: string;
  };
}

export default function NotificationsScreen() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'match' | 'team' | 'message' | 'achievement' | 'system' | 'reminder'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');
  const colorScheme = useColorScheme();

  // Sample notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Match Invitation',
      message: 'You have been invited to join a cricket match this weekend',
      type: 'match',
      priority: 'high',
      isRead: false,
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      actionText: 'View Match',
      relatedData: { matchId: 'match_123' }
    },
    {
      id: '2',
      title: 'Team Update',
      message: 'Your team "Cricket Warriors" has been updated',
      type: 'team',
      priority: 'medium',
      isRead: false,
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      actionText: 'View Team',
      relatedData: { teamId: 'team_456' }
    },
    {
      id: '3',
      title: 'New Message',
      message: 'You have received a new message from Coach Johnson',
      type: 'message',
      priority: 'medium',
      isRead: false,
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      actionText: 'View Message',
      relatedData: { messageId: 'msg_789' }
    },
    {
      id: '4',
      title: 'Achievement Unlocked',
      message: 'Congratulations! You have earned the "Century Scorer" badge',
      type: 'achievement',
      priority: 'high',
      isRead: true,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      actionText: 'View Achievement',
      relatedData: { achievementId: 'ach_101' }
    },
    {
      id: '5',
      title: 'System Maintenance',
      message: 'The app will be under maintenance from 2 AM to 4 AM',
      type: 'system',
      priority: 'low',
      isRead: true,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
    },
    {
      id: '6',
      title: 'Match Reminder',
      message: 'Your match against Team Alpha starts in 30 minutes',
      type: 'reminder',
      priority: 'urgent',
      isRead: false,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      actionText: 'Join Match',
      relatedData: { matchId: 'match_456' }
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'match': return '🏏';
      case 'team': return '👥';
      case 'message': return '💬';
      case 'achievement': return '🏆';
      case 'system': return '⚙️';
      case 'reminder': return '⏰';
      default: return '📢';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#ff4757';
      case 'high': return '#ffa502';
      case 'medium': return '#3742fa';
      case 'low': return '#747d8c';
      default: return '#747d8c';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'URGENT';
      case 'high': return 'HIGH';
      case 'medium': return 'MEDIUM';
      case 'low': return 'LOW';
      default: return 'NORMAL';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const filteredNotifications = notifications
    .filter(notification => {
      if (filter === 'all') return true;
      if (filter === 'unread') return !notification.isRead;
      return notification.type === filter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.timestamp.getTime() - a.timestamp.getTime();
        case 'oldest':
          return a.timestamp.getTime() - b.timestamp.getTime();
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return 0;
      }
    });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.isRead) {
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
      );
    }
    
    // Handle notification action
    if (notification.actionText) {
      Alert.alert(
        notification.title,
        `Action: ${notification.actionText}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: notification.actionText, onPress: () => {
            console.log('Notification action:', notification.actionText, notification.relatedData);
          }}
        ]
      );
    }
  };

  const handleMarkAllAsRead = () => {
    if (unreadCount > 0) {
      Alert.alert(
        'Mark All as Read',
        `Mark ${unreadCount} notifications as read?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Mark All', onPress: () => {
            setNotifications(prev => 
              prev.map(n => ({ ...n, isRead: true }))
            );
          }}
        ]
      );
    }
  };

  const handleClearAll = () => {
    if (notifications.length > 0) {
      Alert.alert(
        'Clear All Notifications',
        `Delete all ${notifications.length} notifications?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear All', style: 'destructive', onPress: () => {
            setNotifications([]);
          }}
        ]
      );
    }
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: `Unread (${unreadCount})` },
    { key: 'match', label: 'Matches' },
    { key: 'team', label: 'Teams' },
    { key: 'message', label: 'Messages' },
    { key: 'achievement', label: 'Achievements' },
    { key: 'system', label: 'System' },
    { key: 'reminder', label: 'Reminders' }
  ];

  const sortOptions = [
    { key: 'newest', label: 'Newest' },
    { key: 'oldest', label: 'Oldest' },
    { key: 'priority', label: 'Priority' }
  ];

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        { 
          backgroundColor: item.isRead 
            ? (colorScheme === 'dark' ? '#1a1a1a' : '#ffffff')
            : (colorScheme === 'dark' ? '#2a2a2a' : '#f8f9fa'),
          borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
        }
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationIcon}>
          <Text style={styles.iconText}>
            {getNotificationIcon(item.type)}
          </Text>
        </View>
        
        <View style={styles.notificationContent}>
          <View style={styles.notificationTitleRow}>
            <Text style={[styles.notificationTitle, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {item.title}
            </Text>
            {!item.isRead && (
              <View style={styles.unreadDot} />
            )}
          </View>
          
          <Text style={[styles.notificationMessage, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {item.message}
          </Text>
          
          <View style={styles.notificationFooter}>
            <Text style={[styles.notificationTime, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {formatTimestamp(item.timestamp)}
            </Text>
            
            <View style={[styles.priorityBadge, { 
              backgroundColor: getPriorityColor(item.priority) 
            }]}>
              <Text style={styles.priorityText}>
                {getPriorityText(item.priority)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {item.actionText && (
        <View style={styles.notificationAction}>
          <TouchableOpacity 
            style={[styles.actionButton, { 
              backgroundColor: Colors[colorScheme ?? 'light'].tint 
            }]}
            onPress={() => handleNotificationPress(item)}
          >
            <Text style={styles.actionButtonText}>
              {item.actionText}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDeleteNotification(item.id)}
      >
        <Text style={[styles.deleteButtonText, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          ✕
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { 
      backgroundColor: Colors[colorScheme ?? 'light'].background
    }]}>
      {/* Header */}
      <View style={[styles.header, { 
        backgroundColor: Colors[colorScheme ?? 'light'].card,
        borderBottomColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
      }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          Notifications
        </Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {notifications.length}
          </Text>
          <Text style={[styles.statLabel, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Total
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#ff4757' }]}>
            {unreadCount}
          </Text>
          <Text style={[styles.statLabel, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Unread
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {notifications.filter(n => n.type === 'match').length}
          </Text>
          <Text style={[styles.statLabel, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Matches
          </Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.filterButton,
              { 
                backgroundColor: filter === option.key 
                  ? Colors[colorScheme ?? 'light'].tint 
                  : colorScheme === 'dark' ? '#333' : '#f5f5f5',
                borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
              }
            ]}
            onPress={() => setFilter(option.key as any)}
          >
            <Text style={[
              styles.filterButtonText,
              { 
                color: filter === option.key ? 'white' : Colors[colorScheme ?? 'light'].text 
              }
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={[styles.sortLabel, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          Sort by:
        </Text>
        <View style={styles.sortOptions}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.sortButton,
                { 
                  backgroundColor: sortBy === option.key 
                    ? Colors[colorScheme ?? 'light'].tint 
                    : colorScheme === 'dark' ? '#333' : '#f5f5f5',
                  borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
                }
              ]}
              onPress={() => setSortBy(option.key as any)}
            >
              <Text style={[
                styles.sortButtonText,
                { 
                  color: sortBy === option.key ? 'white' : Colors[colorScheme ?? 'light'].text 
                }
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, { 
            backgroundColor: Colors[colorScheme ?? 'light'].card,
            borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
          }]}
          onPress={handleMarkAllAsRead}
          disabled={unreadCount === 0}
        >
          <Text style={[styles.actionButtonText, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Mark All Read
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, { 
            backgroundColor: Colors[colorScheme ?? 'light'].error,
            borderColor: '#ff4757'
          }]}
          onPress={handleClearAll}
          disabled={notifications.length === 0}
        >
          <Text style={[styles.actionButtonText, { color: 'white' }]}>
            Clear All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        style={styles.notificationsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
            </Text>
          </View>
        }
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
  settingsButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButtonText: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 12,
  },
  sortOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  notificationsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  notificationCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
    position: 'relative',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors[colorScheme ?? 'light'].border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors[colorScheme ?? 'light'].error,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 8,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  notificationAction: {
    marginTop: 8,
    alignItems: 'flex-start',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    opacity: 0.6,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
  },
});
