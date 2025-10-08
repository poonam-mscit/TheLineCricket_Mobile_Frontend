import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import { VenueAvailabilityProps } from '@/types/pages';
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

export function VenueAvailability({
    availability,
    onSelectTimeSlot,
    onBookSlot
}: VenueAvailabilityProps) {
    const colorScheme = useColorScheme();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'short',
            month: 'short', 
            day: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        return timeString;
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    return (
        <View style={styles.container}>
            {/* Section Header */}
            <Text style={[styles.sectionTitle, { 
                color: getColors(colorScheme).text 
            }]}>
                Availability ({availability.length} days)
            </Text>

            {/* Availability Calendar */}
            <View style={styles.availabilityList}>
                {availability.map((dayAvailability, dayIndex) => (
                    <View
                        key={dayAvailability.date}
                        style={[styles.dayCard, { 
                            backgroundColor: getColors(colorScheme).card,
                            borderColor: getColors(colorScheme).border
                        }]}
                    >
                        {/* Date Header */}
                        <View style={styles.dateHeader}>
                            <Text style={[styles.dateText, { 
                                color: getColors(colorScheme).text 
                            }]}>
                                {formatDate(dayAvailability.date)}
                            </Text>
                            <Text style={[styles.slotsCount, { 
                                color: getColors(colorScheme).text 
                            }]}>
                                {dayAvailability.timeSlots.filter(slot => slot.available).length} slots available
                            </Text>
                        </View>

                        {/* Time Slots */}
                        <View style={styles.timeSlotsContainer}>
                            {dayAvailability.timeSlots.map((slot, slotIndex) => (
                                <TouchableOpacity
                                    key={`${dayAvailability.date}-${slotIndex}`}
                                    style={[
                                        styles.timeSlot,
                                        { 
                                            backgroundColor: slot.available ? '#10B981' : '#EF4444',
                                            opacity: slot.available ? 1 : 0.6
                                        }
                                    ]}
                                    onPress={() => {
                                        if (slot.available) {
                                            onSelectTimeSlot(dayAvailability.date, slot.time);
                                        }
                                    }}
                                    disabled={!slot.available}
                                >
                                    <Text style={styles.timeSlotText}>
                                        {formatTime(slot.time)}
                                    </Text>
                                    <Text style={styles.timeSlotPrice}>
                                        {formatPrice(slot.price)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Book All Button */}
                        {dayAvailability.timeSlots.some(slot => slot.available) && (
                            <TouchableOpacity
                                style={[styles.bookAllButton, { 
                                    backgroundColor: getColors(colorScheme).tint 
                                }]}
                                onPress={() => {
                                    const availableSlots = dayAvailability.timeSlots.filter(slot => slot.available);
                                    if (availableSlots.length > 0) {
                                        onBookSlot(dayAvailability.date, availableSlots[0].time);
                                    }
                                }}
                            >
                                <Text style={styles.bookAllButtonText}>
                                    Book Available Slots
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
            </View>

            {/* No Availability Message */}
            {availability.length === 0 && (
                <View style={[styles.noAvailabilityCard, { 
                    backgroundColor: getColors(colorScheme).card,
                    borderColor: getColors(colorScheme).border
                }]}>
                    <Text style={[styles.noAvailabilityText, { 
                        color: getColors(colorScheme).text 
                    }]}>
                        No availability information available
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
    availabilityList: {
        gap: 16,
    },
    dayCard: {
        borderRadius: 8,
        borderWidth: 1,
        padding: 16,
    },
    dateHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    dateText: {
        fontSize: 16,
        fontWeight: '600',
    },
    slotsCount: {
        fontSize: 12,
        opacity: 0.7,
    },
    timeSlotsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    timeSlot: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
    },
    timeSlotText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 2,
    },
    timeSlotPrice: {
        color: 'white',
        fontSize: 10,
        opacity: 0.9,
    },
    bookAllButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bookAllButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    noAvailabilityCard: {
        padding: 24,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noAvailabilityText: {
        fontSize: 16,
        opacity: 0.7,
    },
});
