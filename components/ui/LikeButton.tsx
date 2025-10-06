import { Text } from '@/components/Themed';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface LikeButtonProps {
  isLiked: boolean;
  likes: number;
  onPress: () => void;
}

export function LikeButton({ isLiked, likes, onPress }: LikeButtonProps) {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
    >
      <Text style={[
        styles.icon, 
        { 
          color: isLiked ? '#ff4757' : Colors[colorScheme ?? 'light'].text,
          opacity: isLiked ? 1 : 0.6
        }
      ]}>
        {isLiked ? '❤️' : '🤍'}
      </Text>
      <Text style={[
        styles.count,
        { 
          color: isLiked ? '#ff4757' : Colors[colorScheme ?? 'light'].text,
          opacity: isLiked ? 1 : 0.6
        }
      ]}>
        {likes}
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
