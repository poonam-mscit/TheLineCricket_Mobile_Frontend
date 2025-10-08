import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import { CommunityEventsProps } from '@/types/pages';
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

export function CommunityEvents({
    events,
    onEventPress,
    onJoinEvent
}: CommunityEventsProps) {
    const colorScheme = useColorScheme();

    const formatEventDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatEventTime = (timeString: string) => {
        return timeString;
    };

    const getEventTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            'workshop': '#8B5CF6',
            'tournament': '#EF4444',
            'meetup': '#10B981',
            'training': '#F59E0B',
            'social': '#3B82F6',
            'default': '#6B7280'
        };
        return colors[type.toLowerCase()] || colors.default;
    };

    return (
        <View style={styles.container}>
            {/* Section Header */}
            <Text style={[styles.sectionTitle, { 
                color: getColors(colorScheme).text 
            }]}>
                Upcoming Events ({events.length})
            </Text>

            {/* Events List */}
            <View style={styles.eventsList}>
                {events.map((event) => (
                    <TouchableOpacity
                        key={event.id}
                        style={[styles.eventCard, { 
                            backgroundColor: getColors(colorScheme).card,
                            borderColor: getColors(colorScheme).border
                        }]}
                        onPress={() => onEventPress(event.id)}
                    >
                        {/* Event Header */}
                        <View style={styles.eventHeader}>
                            <View style={styles.eventTitleRow}>
                                <Text style={[styles.eventTitle, { 
                                    color: getColors(colorScheme).text 
                                }]} numberOfLines={2}>
                                    {event.title}
                                </Text>
                                <View style={[
                                    styles.eventTypeBadge,
                                    { backgroundColor: getEventTypeColor(event.type) }
                                ]}>
                                    <Text style={styles.eventTypeText}>
                                        {event.type}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Event Details */}
                        <View style={styles.eventDetails}>
                            <View style={styles.eventInfoRow}>
                                <Text style={styles.eventInfoIcon}>📅</Text>
                                <Text style={[styles.eventInfoText, { 
                                    color: getColors(colorScheme).text 
                                }]}>
                                    {formatEventDate(event.date)}
                                </Text>
                            </View>

                            <View style={styles.eventInfoRow}>
                                <Text style={styles.eventInfoIcon}>🕐</Text>
                                <Text style={[styles.eventInfoText, { 
                                    color: getColors(colorScheme).text 
                                }]}>
                                    {formatEventTime(event.time)}
                                </Text>
                            </View>

                            <View style={styles.eventInfoRow}>
                                <Text style={styles.eventInfoIcon}>📍</Text>
                                <Text style={[styles.eventInfoText, { 
                                    color: getColors(colorScheme).text 
                                }]} numberOfLines={1}>
                                    {event.location}
                                </Text>
                            </View>

                            <View style={styles.eventInfoRow}>
                                <Text style={styles.eventInfoIcon}>👥</Text>
                                <Text style={[styles.eventInfoText, { 
                                    color: getColors(colorScheme).text 
                                }]}>
                                    {event.attendees}/{event.maxAttendees} attendees
                                </Text>
                            </View>
                        </View>

                        {/* Event Actions */}
                        <View style={styles.eventActions}>
                            <TouchableOpacity
                                style={[styles.joinButton, { 
                                    backgroundColor: getColors(colorScheme).tint 
                                }]}
                                onPress={() => onJoinEvent(event.id)}
                            >
                                <Text style={styles.joinButtonText}>
                                    {event.attendees >= event.maxAttendees ? 'Full' : 'Join Event'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* No Events Message */}
            {events.length === 0 && (
                <View style={[styles.noEventsCard, { 
                    backgroundColor: getColors(colorScheme).card,
                    borderColor: getColors(colorScheme).border
                }]}>
                    <Text style={[styles.noEventsText, { 
                        color: getColors(colorScheme).text 
                    }]}>
                        No upcoming events scheduled
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
    },
    eventsList: {
        gap: 12,
    },
    eventCard: {
        borderRadius: 8,
        borderWidth: 1,
        padding: 16,
    },
    eventHeader: {
        marginBottom: 12,
    },
    eventTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
        marginRight: 8,
    },
    eventTypeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    eventTypeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    eventDetails: {
        gap: 8,
        marginBottom: 16,
    },
    eventInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eventInfoIcon: {
        fontSize: 14,
        marginRight: 8,
        width: 20,
    },
    eventInfoText: {
        fontSize: 14,
        flex: 1,
    },
    eventActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    joinButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    joinButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    noEventsCard: {
        padding: 24,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noEventsText: {
        fontSize: 16,
        opacity: 0.7,
    },
});
