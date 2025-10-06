import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
  sender: {
    id: string;
    username: string;
    fullName: string;
  };
  type: 'text' | 'image' | 'system';
  isRead: boolean;
}

interface ChatBubbleProps {
  message: ChatMessage;
  showSender?: boolean;
  showTimestamp?: boolean;
}

export function ChatBubble({ 
  message, 
  showSender = false, 
  showTimestamp = false 
}: ChatBubbleProps) {
  const colorScheme = useColorScheme();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <View style={[
      styles.container,
      message.isOwn ? styles.ownMessage : styles.otherMessage
    ]}>
      {/* Sender Info */}
      {showSender && !message.isOwn && (
        <View style={styles.senderContainer}>
          <Text style={[styles.senderName, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {message.sender.fullName}
          </Text>
        </View>
      )}

      {/* Message Bubble */}
      <View style={[
        styles.bubble,
        message.isOwn 
          ? [styles.ownBubble, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]
          : [styles.otherBubble, { 
              backgroundColor: colorScheme === 'dark' ? '#333' : '#f0f0f0' 
            }]
      ]}>
        <Text style={[
          styles.messageText,
          message.isOwn 
            ? styles.ownText 
            : [styles.otherText, { color: Colors[colorScheme ?? 'light'].text }]
        ]}>
          {message.content}
        </Text>
      </View>

      {/* Timestamp */}
      {showTimestamp && (
        <View style={styles.timestampContainer}>
          <Text style={[styles.timestamp, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {formatTime(message.timestamp)}
          </Text>
          {message.isOwn && (
            <Text style={[styles.readStatus, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {message.isRead ? '✓✓' : '✓'}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 16,
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  senderContainer: {
    marginBottom: 4,
    marginLeft: 16,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  ownBubble: {
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownText: {
    color: 'white',
  },
  otherText: {
    // Color set dynamically
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginHorizontal: 16,
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.6,
  },
  readStatus: {
    fontSize: 12,
    marginLeft: 4,
    opacity: 0.6,
  },
});
