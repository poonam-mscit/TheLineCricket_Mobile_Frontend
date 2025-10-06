import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { CommentButton } from './CommentButton';
import { LikeButton } from './LikeButton';

interface Post {
  id: string;
  author: {
    id: string;
    username: string;
    fullName: string;
    avatar?: string;
  };
  content: string;
  imageUrl?: string;
  location?: string;
  likes: number;
  comments: number;
  createdAt: Date;
  isLiked: boolean;
}

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
  onShare: (postId: string) => void;
}

export function PostCard({ post, onLike, onComment, onShare }: PostCardProps) {
  const colorScheme = useColorScheme();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [currentLikes, setCurrentLikes] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setCurrentLikes(prev => isLiked ? prev - 1 : prev + 1);
    onLike(post.id);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  return (
    <View style={[styles.container, { 
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
      borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
    }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.authorInfo}>
          <View style={[styles.avatar, { 
            backgroundColor: Colors[colorScheme ?? 'light'].tint 
          }]}>
            <Text style={styles.avatarText}>
              {post.author.fullName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.authorDetails}>
            <Text style={[styles.authorName, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {post.author.fullName}
            </Text>
            <Text style={[styles.username, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              @{post.author.username}
            </Text>
          </View>
        </View>
        <Text style={[styles.timeAgo, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          {formatTimeAgo(post.createdAt)}
        </Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.postText, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          {post.content}
        </Text>
        
        {post.location && (
          <Text style={[styles.location, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            📍 {post.location}
          </Text>
        )}
      </View>

      {/* Image */}
      {post.imageUrl && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: post.imageUrl }} style={styles.image} />
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <LikeButton 
          isLiked={isLiked}
          likes={currentLikes}
          onPress={handleLike}
        />
        <CommentButton 
          comments={post.comments}
          onPress={() => onComment(post.id, '')}
        />
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onShare(post.id)}
        >
          <Text style={[styles.actionText, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Share
          </Text>
        </TouchableOpacity>
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
    padding: 16,
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
    marginBottom: 12,
  },
  authorInfo: {
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
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    opacity: 0.7,
  },
  timeAgo: {
    fontSize: 12,
    opacity: 0.6,
  },
  content: {
    marginBottom: 12,
  },
  postText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    opacity: 0.7,
  },
  imageContainer: {
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
