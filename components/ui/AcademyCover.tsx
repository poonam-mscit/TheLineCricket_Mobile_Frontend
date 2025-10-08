import { Text } from '@/components/Themed';
import { PageColors } from '@/constants/PageThemes';
import { AcademyCoverProps } from '@/types/pages';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

export function AcademyCover({ 
  name, 
  type, 
  logo, 
  coverImage, 
  verified, 
  rating, 
  reviews 
}: AcademyCoverProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Text key={i} style={styles.star}>
          {i < Math.floor(rating) ? '⭐' : '☆'}
        </Text>
      );
    }
    return stars;
  };

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  return (
    <View style={styles.container}>
      {coverImage ? (
        <Image source={{ uri: coverImage }} style={styles.coverImage} />
      ) : (
        <LinearGradient
          colors={[PageColors.academy.primary, PageColors.academy.dark]}
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
            <Text style={styles.logoText}>🏫</Text>
          </View>
        )}
        
        {/* Name and Type */}
        <View style={styles.textContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{name || 'Academy Name'}</Text>
            {verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )}
          </View>
          <Text style={styles.type}>{type}</Text>
          
          {/* Rating */}
          {rating > 0 && (
            <View style={styles.ratingContainer}>
              <View style={styles.stars}>
                {renderStars(rating)}
              </View>
              <Text style={styles.ratingText}>{formatRating(rating)}</Text>
              <Text style={styles.reviews}>({reviews} reviews)</Text>
            </View>
          )}
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  star: {
    fontSize: 14,
    marginRight: 2,
  },
  ratingText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
    marginRight: 8,
  },
  reviews: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
});

