import { Text } from '@/components/Themed';
import { PageColors } from '@/constants/PageThemes';
import { CommunityCoverProps } from '@/types/pages';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

export function CommunityCover({ 
  name, 
  type, 
  logo, 
  coverImage, 
  verified, 
  members, 
  isJoined 
}: CommunityCoverProps) {
  return (
    <View style={styles.container}>
      {coverImage ? (
        <Image source={{ uri: coverImage }} style={styles.coverImage} />
      ) : (
        <LinearGradient
          colors={[PageColors.community.primary, PageColors.community.dark]}
          style={styles.gradientCover}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      )}
      
      {/* Overlay */}
      <View style={styles.overlay} />
      
      {/* Content */}
      <View style={styles.content}>
        {/* Logo */}
        {logo ? (
          <Image source={{ uri: logo }} style={styles.logo} />
        ) : (
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>👥</Text>
          </View>
        )}
        
        {/* Name and Type */}
        <View style={styles.textContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{name || 'Community Name'}</Text>
            {verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )}
          </View>
          <Text style={styles.type}>{type}</Text>
          
          {/* Members and Join Status */}
          <View style={styles.infoRow}>
            <Text style={styles.members}>👥 {members.toLocaleString()} members</Text>
            {isJoined && (
              <View style={styles.joinedBadge}>
                <Text style={styles.joinedText}>✓ Joined</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    position: 'relative',
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradientCover: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 20,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
    marginRight: 12,
    borderWidth: 3,
    borderColor: 'white',
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  logoText: {
    fontSize: 28,
  },
  textContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
    flexShrink: 1,
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  type: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  members: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  joinedBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  joinedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

