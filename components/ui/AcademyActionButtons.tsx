import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import React from 'react';
import {
    Alert,
    Linking,
    Share,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

interface AcademyActionButtonsProps {
    contact: {
        phone: string;
        email: string;
        website: string;
    };
    onContactPress: () => void;
    onFollowPress: () => void;
    onSharePress: () => void;
    isFollowing?: boolean;
}

export function AcademyActionButtons({
    contact,
    onContactPress,
    onFollowPress,
    onSharePress,
    isFollowing = false
}: AcademyActionButtonsProps) {
    const colorScheme = useColorScheme();

    const handleContact = () => {
        Alert.alert(
            'Contact Academy',
            'Choose how to contact',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Call', 
                    onPress: () => {
                        if (contact.phone) {
                            Linking.openURL(`tel:${contact.phone}`);
                        } else {
                            Alert.alert('No phone number available');
                        }
                    }
                },
                { 
                    text: 'Email', 
                    onPress: () => {
                        if (contact.email) {
                            Linking.openURL(`mailto:${contact.email}`);
                        } else {
                            Alert.alert('No email available');
                        }
                    }
                },
                { 
                    text: 'Website', 
                    onPress: () => {
                        if (contact.website) {
                            Linking.openURL(contact.website.startsWith('http') ? contact.website : `https://${contact.website}`);
                        } else {
                            Alert.alert('No website available');
                        }
                    }
                }
            ]
        );
    };

    const handleFollow = () => {
        onFollowPress();
        Alert.alert(
            isFollowing ? 'Unfollowed' : 'Following',
            isFollowing ? 'You have unfollowed this academy' : 'You are now following this academy'
        );
    };

    const handleShare = async () => {
        try {
            const result = await Share.share({
                message: `Check out this amazing cricket academy!`,
                url: contact.website || 'https://thelinecricket.com',
                title: 'Cricket Academy'
            });
            
            if (result.action === Share.sharedAction) {
                onSharePress();
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to share');
        }
    };

    return (
        <View style={[styles.container, { 
            backgroundColor: getColors(colorScheme).background,
            borderTopColor: getColors(colorScheme).border
        }]}>
            <View style={styles.buttonsContainer}>
                {/* Contact Button */}
                <TouchableOpacity
                    style={[styles.actionButton, styles.contactButton, { 
                        backgroundColor: getColors(colorScheme).tint 
                    }]}
                    onPress={handleContact}
                >
                    <Text style={styles.actionButtonIcon}>📞</Text>
                    <Text style={styles.actionButtonText}>Contact</Text>
                </TouchableOpacity>

                {/* Follow Button */}
                <TouchableOpacity
                    style={[
                        styles.actionButton, 
                        styles.followButton,
                        { 
                            backgroundColor: isFollowing ? '#6B7280' : '#10B981'
                        }
                    ]}
                    onPress={handleFollow}
                >
                    <Text style={styles.actionButtonIcon}>
                        {isFollowing ? '👥' : '➕'}
                    </Text>
                    <Text style={styles.actionButtonText}>
                        {isFollowing ? 'Following' : 'Follow'}
                    </Text>
                </TouchableOpacity>

                {/* Share Button */}
                <TouchableOpacity
                    style={[styles.actionButton, styles.shareButton, { 
                        backgroundColor: '#3B82F6' 
                    }]}
                    onPress={handleShare}
                >
                    <Text style={styles.actionButtonIcon}>📤</Text>
                    <Text style={styles.actionButtonText}>Share</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderTopWidth: 1,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        minHeight: 48,
    },
    contactButton: {
        // Contact button specific styles
    },
    followButton: {
        // Follow button specific styles
    },
    shareButton: {
        // Share button specific styles
    },
    actionButtonIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    actionButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
});
