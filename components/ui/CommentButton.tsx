import { Text } from '@/components/Themed';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface CommentButtonProps {
  comments: number;
  onPress: () => void;
}

export function CommentButton({ comments, onPress }: CommentButtonProps) {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
    >
      <Text style={[
        styles.icon, 
        { 
          color: Colors[colorScheme ?? 'light'].text,
          opacity: 0.6
        }
      ]}>
        💬
      </Text>
      <Text style={[
        styles.count,
        { 
          color: Colors[colorScheme ?? 'light'].text,
          opacity: 0.6
        }
      ]}>
        {comments}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  icon: {
    fontSize: 18,
    marginBottom: 4,
  },
  count: {
    fontSize: 12,
    fontWeight: '500',
  },
});
