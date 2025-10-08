import { Text } from '@/components/Themed';
import { VenueCoverProps } from '@/types/pages';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Image,
    StyleSheet,
    useColorScheme,
    View
} from 'react-native';

export function VenueCover({
    name,
    type,
    logo,
    coverImage,
    verified,
    rating,
    reviews,
    isAvailable
}: VenueCoverProps) {
    const colorScheme = useColorScheme();

    return (
        <View style={styles.container}>
            {/* Cover Image with Gradient Overlay */}
            <View style={styles.coverContainer}>
                {coverImage ? (
                    <Image
                        source={{ uri: coverImage }}
                        style={styles.coverImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={[styles.placeholderCover, { 
                        backgroundColor: '#10B981' 
                    }]} />
                )}
                
                {/* Gradient Overlay */}
                <LinearGradient
                    colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)']}
                    style={styles.gradientOverlay}
                />

                {/* Content Overlay */}
                <View style={styles.contentOverlay}>
                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        {logo ? (
                            <Image
                                source={{ uri: logo }}
                                style={styles.logo}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={[styles.placeholderLogo, { 
                                backgroundColor: 'rgba(255,255,255,0.2)' 
                            }]}>
                                <Text style={styles.logoText}>🏟️</Text>
                            </View>
                        )}
                    </View>

                    {/* Venue Info */}
                    <View style={styles.venueInfo}>
                        <View style={styles.titleRow}>
                            <Text style={styles.venueName} numberOfLines={2}>
                                {name}
                            </Text>
                            {verified && (
                                <View style={styles.verifiedBadge}>
                                    <Text style={styles.verifiedIcon}>✓</Text>
                                </View>
                            )}
                        </View>
                        
                        <Text style={styles.venueType}>
                            {type}
                        </Text>

                        {/* Rating and Reviews */}
                        <View style={styles.ratingRow}>
                            <View style={styles.ratingContainer}>
                                <Text style={styles.starIcon}>⭐</Text>
                                <Text style={styles.ratingText}>
                                    {rating.toFixed(1)}
                                </Text>
                                <Text style={styles.reviewsText}>
                                    ({reviews} reviews)
                                </Text>
                            </View>
                        </View>

                        {/* Availability Status */}
                        <View style={styles.statusRow}>
                            <View style={[
                                styles.statusBadge,
                                { 
                                    backgroundColor: isAvailable ? '#10B981' : '#EF4444' 
                                }
                            ]}>
                                <Text style={styles.statusText}>
                                    {isAvailable ? 'Available' : 'Unavailable'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    coverContainer: {
        height: 200,
        position: 'relative',
    },
    coverImage: {
        width: '100%',
        height: '100%',
    },
    placeholderCover: {
        width: '100%',
        height: '100%',
    },
    gradientOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    contentOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        justifyContent: 'flex-end',
    },
    logoContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    logo: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 3,
        borderColor: 'white',
    },
    placeholderLogo: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 3,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 24,
    },
    venueInfo: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    venueName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        flex: 1,
        marginRight: 8,
    },
    verifiedBadge: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
    },
    verifiedIcon: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    venueType: {
        fontSize: 16,
        color: 'white',
        opacity: 0.9,
        marginBottom: 12,
    },
    ratingRow: {
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starIcon: {
        fontSize: 16,
        marginRight: 4,
    },
    ratingText: {
        fontSize: 16,
        color: 'white',
        fontWeight: '600',
        marginRight: 8,
    },
    reviewsText: {
        fontSize: 14,
        color: 'white',
        opacity: 0.8,
    },
    statusRow: {
        marginBottom: 8,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    statusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
});
