import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import { CommunityMembersProps } from '@/types/pages';
import React from 'react';
import {
    Image,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

export function CommunityMembers({
    members,
    totalMembers,
    onMemberPress,
    onViewAll
}: CommunityMembersProps) {
    const colorScheme = useColorScheme();

    const formatJoinDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            year: 'numeric' 
        });
    };

    return (
        <View style={styles.container}>
            {/* Section Header */}
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { 
                    color: getColors(colorScheme).text 
                }]}>
                    Members ({totalMembers})
                </Text>
                <TouchableOpacity
                    style={[styles.viewAllButton, { 
                        backgroundColor: getColors(colorScheme).tint 
                    }]}
                    onPress={onViewAll}
                >
                    <Text style={styles.viewAllButtonText}>View All</Text>
                </TouchableOpacity>
            </View>

            {/* Members Grid */}
            <View style={styles.membersGrid}>
                {members.slice(0, 6).map((member) => (
                    <TouchableOpacity
                        key={member.id}
                        style={[styles.memberCard, { 
                            backgroundColor: getColors(colorScheme).card,
                            borderColor: getColors(colorScheme).border
                        }]}
                        onPress={() => onMemberPress(member.id)}
                    >
                        {/* Member Avatar */}
                        <View style={styles.avatarContainer}>
                            {member.avatar ? (
                                <Image
                                    source={{ uri: member.avatar }}
                                    style={styles.avatar}
                                />
                            ) : (
                                <View style={[styles.avatar, styles.placeholderAvatar]}>
                                    <Text style={styles.avatarText}>
                                        {member.name.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                            )}
                            {/* Online Status Indicator */}
                            {member.isOnline && (
                                <View style={[styles.onlineIndicator, { 
                                    backgroundColor: '#10B981' 
                                }]} />
                            )}
                        </View>

                        {/* Member Info */}
                        <View style={styles.memberInfo}>
                            <Text style={[styles.memberName, { 
                                color: getColors(colorScheme).text 
                            }]} numberOfLines={1}>
                                {member.name}
                            </Text>
                            <Text style={[styles.memberRole, { 
                                color: getColors(colorScheme).text 
                            }]} numberOfLines={1}>
                                {member.role}
                            </Text>
                            <Text style={[styles.joinDate, { 
                                color: getColors(colorScheme).text 
                            }]}>
                                Joined {formatJoinDate(member.joinDate)}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Show More Members if there are more than 6 */}
            {totalMembers > 6 && (
                <TouchableOpacity
                    style={[styles.showMoreButton, { 
                        backgroundColor: getColors(colorScheme).card,
                        borderColor: getColors(colorScheme).border
                    }]}
                    onPress={onViewAll}
                >
                    <Text style={[styles.showMoreText, { 
                        color: getColors(colorScheme).tint 
                    }]}>
                        +{totalMembers - 6} more members
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    viewAllButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewAllButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    membersGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    memberCard: {
        width: '48%',
        height: 80,
        borderRadius: 8,
        borderWidth: 1,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    placeholderAvatar: {
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#6B7280',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: 'white',
    },
    memberInfo: {
        flex: 1,
    },
    memberName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    memberRole: {
        fontSize: 14,
        opacity: 0.7,
        marginBottom: 2,
    },
    joinDate: {
        fontSize: 12,
        opacity: 0.6,
    },
    showMoreButton: {
        marginTop: 12,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    showMoreText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
