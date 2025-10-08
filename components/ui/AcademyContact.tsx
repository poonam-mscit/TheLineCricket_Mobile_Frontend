import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import { AcademyContactProps } from '@/types/pages';
import React from 'react';
import {
    Linking,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

export function AcademyContact({
    contact,
    isEditing,
    onContactChange
}: AcademyContactProps) {
    const colorScheme = useColorScheme();

    const handlePhonePress = () => {
        if (contact.phone) {
            Linking.openURL(`tel:${contact.phone}`);
        }
    };

    const handleEmailPress = () => {
        if (contact.email) {
            Linking.openURL(`mailto:${contact.email}`);
        }
    };

    const handleWebsitePress = () => {
        if (contact.website) {
            Linking.openURL(contact.website.startsWith('http') ? contact.website : `https://${contact.website}`);
        }
    };

    const handleAddressPress = () => {
        const address = `${contact.address}, ${contact.city}, ${contact.state}, ${contact.country}`;
        const encodedAddress = encodeURIComponent(address);
        Linking.openURL(`https://maps.google.com/?q=${encodedAddress}`);
    };

    return (
        <View style={styles.container}>
            {/* Section Header */}
            <Text style={[styles.sectionTitle, { 
                color: getColors(colorScheme).text 
            }]}>
                Contact Information
            </Text>

            {/* Contact Cards */}
            <View style={styles.contactGrid}>
                {/* Phone */}
                <TouchableOpacity
                    style={[styles.contactCard, { 
                        backgroundColor: getColors(colorScheme).card,
                        borderColor: getColors(colorScheme).border
                    }]}
                    onPress={handlePhonePress}
                    disabled={isEditing}
                >
                    <View style={styles.contactIcon}>
                        <Text style={styles.contactIconText}>📞</Text>
                    </View>
                    <View style={styles.contactInfo}>
                        <Text style={[styles.contactLabel, { 
                            color: getColors(colorScheme).text 
                        }]}>
                            Phone
                        </Text>
                        {isEditing ? (
                            <TextInput
                                style={[styles.contactInput, { 
                                    color: getColors(colorScheme).text,
                                    borderColor: getColors(colorScheme).border
                                }]}
                                value={contact.phone}
                                onChangeText={(text) => onContactChange('phone', text)}
                                placeholder="Phone number"
                            />
                        ) : (
                            <Text style={[styles.contactValue, { 
                                color: getColors(colorScheme).text 
                            }]} numberOfLines={1}>
                                {contact.phone || 'Not provided'}
                            </Text>
                        )}
                    </View>
                </TouchableOpacity>

                {/* Email */}
                <TouchableOpacity
                    style={[styles.contactCard, { 
                        backgroundColor: getColors(colorScheme).card,
                        borderColor: getColors(colorScheme).border
                    }]}
                    onPress={handleEmailPress}
                    disabled={isEditing}
                >
                    <View style={styles.contactIcon}>
                        <Text style={styles.contactIconText}>✉️</Text>
                    </View>
                    <View style={styles.contactInfo}>
                        <Text style={[styles.contactLabel, { 
                            color: getColors(colorScheme).text 
                        }]}>
                            Email
                        </Text>
                        {isEditing ? (
                            <TextInput
                                style={[styles.contactInput, { 
                                    color: getColors(colorScheme).text,
                                    borderColor: getColors(colorScheme).border
                                }]}
                                value={contact.email}
                                onChangeText={(text) => onContactChange('email', text)}
                                placeholder="Email address"
                                keyboardType="email-address"
                            />
                        ) : (
                            <Text style={[styles.contactValue, { 
                                color: getColors(colorScheme).text 
                            }]} numberOfLines={1}>
                                {contact.email || 'Not provided'}
                            </Text>
                        )}
                    </View>
                </TouchableOpacity>

                {/* Website */}
                <TouchableOpacity
                    style={[styles.contactCard, { 
                        backgroundColor: getColors(colorScheme).card,
                        borderColor: getColors(colorScheme).border
                    }]}
                    onPress={handleWebsitePress}
                    disabled={isEditing}
                >
                    <View style={styles.contactIcon}>
                        <Text style={styles.contactIconText}>🌐</Text>
                    </View>
                    <View style={styles.contactInfo}>
                        <Text style={[styles.contactLabel, { 
                            color: getColors(colorScheme).text 
                        }]}>
                            Website
                        </Text>
                        {isEditing ? (
                            <TextInput
                                style={[styles.contactInput, { 
                                    color: getColors(colorScheme).text,
                                    borderColor: getColors(colorScheme).border
                                }]}
                                value={contact.website}
                                onChangeText={(text) => onContactChange('website', text)}
                                placeholder="Website URL"
                                keyboardType="url"
                            />
                        ) : (
                            <Text style={[styles.contactValue, { 
                                color: getColors(colorScheme).text 
                            }]} numberOfLines={1}>
                                {contact.website || 'Not provided'}
                            </Text>
                        )}
                    </View>
                </TouchableOpacity>

                {/* Address */}
                <TouchableOpacity
                    style={[styles.contactCard, { 
                        backgroundColor: getColors(colorScheme).card,
                        borderColor: getColors(colorScheme).border
                    }]}
                    onPress={handleAddressPress}
                    disabled={isEditing}
                >
                    <View style={styles.contactIcon}>
                        <Text style={styles.contactIconText}>📍</Text>
                    </View>
                    <View style={styles.contactInfo}>
                        <Text style={[styles.contactLabel, { 
                            color: getColors(colorScheme).text 
                        }]}>
                            Address
                        </Text>
                        {isEditing ? (
                            <View style={styles.addressInputs}>
                                <TextInput
                                    style={[styles.contactInput, { 
                                        color: getColors(colorScheme).text,
                                        borderColor: getColors(colorScheme).border
                                    }]}
                                    value={contact.address}
                                    onChangeText={(text) => onContactChange('address', text)}
                                    placeholder="Street address"
                                />
                                <TextInput
                                    style={[styles.contactInput, { 
                                        color: getColors(colorScheme).text,
                                        borderColor: getColors(colorScheme).border
                                    }]}
                                    value={contact.city}
                                    onChangeText={(text) => onContactChange('city', text)}
                                    placeholder="City"
                                />
                                <TextInput
                                    style={[styles.contactInput, { 
                                        color: getColors(colorScheme).text,
                                        borderColor: getColors(colorScheme).border
                                    }]}
                                    value={contact.state}
                                    onChangeText={(text) => onContactChange('state', text)}
                                    placeholder="State"
                                />
                                <TextInput
                                    style={[styles.contactInput, { 
                                        color: getColors(colorScheme).text,
                                        borderColor: getColors(colorScheme).border
                                    }]}
                                    value={contact.country}
                                    onChangeText={(text) => onContactChange('country', text)}
                                    placeholder="Country"
                                />
                            </View>
                        ) : (
                            <Text style={[styles.contactValue, { 
                                color: getColors(colorScheme).text 
                            }]} numberOfLines={2}>
                                {contact.address ? 
                                    `${contact.address}, ${contact.city}, ${contact.state}, ${contact.country}` : 
                                    'Not provided'
                                }
                            </Text>
                        )}
                    </View>
                </TouchableOpacity>
            </View>
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
    contactGrid: {
        gap: 12,
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        minHeight: 60,
    },
    contactIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    contactIconText: {
        fontSize: 20,
    },
    contactInfo: {
        flex: 1,
    },
    contactLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
        opacity: 0.7,
    },
    contactValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    contactInput: {
        fontSize: 16,
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginBottom: 4,
    },
    addressInputs: {
        gap: 4,
    },
});
