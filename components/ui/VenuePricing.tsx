import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import { VenuePricingProps } from '@/types/pages';
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

export function VenuePricing({
    pricing,
    onSelectPricing,
    onBook
}: VenuePricingProps) {
    const colorScheme = useColorScheme();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const getDurationColor = (duration: string) => {
        const colors: Record<string, string> = {
            'hourly': '#10B981',
            'daily': '#3B82F6',
            'weekly': '#8B5CF6',
            'monthly': '#F59E0B',
            'default': '#6B7280'
        };
        return colors[duration.toLowerCase()] || colors.default;
    };

    return (
        <View style={styles.container}>
            {/* Section Header */}
            <Text style={[styles.sectionTitle, { 
                color: getColors(colorScheme).text 
            }]}>
                Pricing Options ({pricing.length})
            </Text>

            {/* Pricing Cards */}
            <View style={styles.pricingGrid}>
                {pricing.map((pricingOption) => (
                    <TouchableOpacity
                        key={pricingOption.id}
                        style={[styles.pricingCard, { 
                            backgroundColor: getColors(colorScheme).card,
                            borderColor: getColors(colorScheme).border
                        }]}
                        onPress={() => onSelectPricing(pricingOption.id)}
                    >
                        {/* Pricing Header */}
                        <View style={styles.pricingHeader}>
                            <Text style={[styles.pricingName, { 
                                color: getColors(colorScheme).text 
                            }]}>
                                {pricingOption.name}
                            </Text>
                            <View style={[
                                styles.durationBadge,
                                { backgroundColor: getDurationColor(pricingOption.duration) }
                            ]}>
                                <Text style={styles.durationText}>
                                    {pricingOption.duration}
                                </Text>
                            </View>
                        </View>

                        {/* Price */}
                        <View style={styles.priceContainer}>
                            <Text style={[styles.price, { 
                                color: '#10B981' 
                            }]}>
                                {formatPrice(pricingOption.price)}
                            </Text>
                            <Text style={[styles.duration, { 
                                color: getColors(colorScheme).text 
                            }]}>
                                per {pricingOption.duration}
                            </Text>
                        </View>

                        {/* Description */}
                        <Text style={[styles.description, { 
                            color: getColors(colorScheme).text 
                        }]} numberOfLines={3}>
                            {pricingOption.description}
                        </Text>

                        {/* Features */}
                        {pricingOption.features.length > 0 && (
                            <View style={styles.featuresContainer}>
                                <Text style={[styles.featuresTitle, { 
                                    color: getColors(colorScheme).text 
                                }]}>
                                    Features:
                                </Text>
                                {pricingOption.features.slice(0, 3).map((feature, index) => (
                                    <Text key={index} style={[styles.feature, { 
                                        color: getColors(colorScheme).text 
                                    }]}>
                                        • {feature}
                                    </Text>
                                ))}
                                {pricingOption.features.length > 3 && (
                                    <Text style={[styles.moreFeatures, { 
                                        color: getColors(colorScheme).text 
                                    }]}>
                                        +{pricingOption.features.length - 3} more features
                                    </Text>
                                )}
                            </View>
                        )}

                        {/* Book Button */}
                        <TouchableOpacity
                            style={[styles.bookButton, { 
                                backgroundColor: '#10B981' 
                            }]}
                            onPress={() => onBook(pricingOption.id)}
                        >
                            <Text style={styles.bookButtonText}>Book Now</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </View>

            {/* No Pricing Message */}
            {pricing.length === 0 && (
                <View style={[styles.noPricingCard, { 
                    backgroundColor: getColors(colorScheme).card,
                    borderColor: getColors(colorScheme).border
                }]}>
                    <Text style={[styles.noPricingText, { 
                        color: getColors(colorScheme).text 
                    }]}>
                        No pricing options available
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
    pricingGrid: {
        gap: 16,
    },
    pricingCard: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 20,
    },
    pricingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    pricingName: {
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
        marginRight: 8,
    },
    durationBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    durationText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 12,
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        marginRight: 8,
    },
    duration: {
        fontSize: 14,
        opacity: 0.7,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16,
    },
    featuresContainer: {
        marginBottom: 16,
    },
    featuresTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    feature: {
        fontSize: 12,
        lineHeight: 16,
        marginBottom: 2,
    },
    moreFeatures: {
        fontSize: 12,
        fontStyle: 'italic',
        opacity: 0.7,
        marginTop: 4,
    },
    bookButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bookButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    noPricingCard: {
        padding: 24,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noPricingText: {
        fontSize: 16,
        opacity: 0.7,
    },
});
