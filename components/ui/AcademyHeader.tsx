import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import { AcademyHeaderProps } from '@/types/pages';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

export function AcademyHeader({
    onBack,
    onEdit,
    isEditing,
    onSave,
    onCancel,
    isSaving
}: AcademyHeaderProps) {
    const colorScheme = useColorScheme();

    return (
        <View style={[styles.header, { 
            backgroundColor: getColors(colorScheme).background,
            borderBottomColor: getColors(colorScheme).border
        }]}>
            {/* Back Button */}
            <TouchableOpacity
                style={[styles.backButton, { 
                    backgroundColor: getColors(colorScheme).card,
                    borderColor: getColors(colorScheme).border
                }]}
                onPress={onBack}
            >
                <Text style={[styles.backButtonText, { 
                    color: getColors(colorScheme).text 
                }]}>
                    ←
                </Text>
            </TouchableOpacity>

            {/* Title */}
            <Text style={[styles.title, { 
                color: getColors(colorScheme).text 
            }]}>
                Academy
            </Text>

            {/* Action Button */}
            {isEditing ? (
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.cancelButton, { 
                            backgroundColor: '#6B7280' 
                        }]}
                        onPress={onCancel}
                        disabled={isSaving}
                    >
                        <Text style={styles.actionButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.saveButton, { 
                            backgroundColor: '#10B981' 
                        }]}
                        onPress={onSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text style={styles.actionButtonText}>Save</Text>
                        )}
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity
                    style={[styles.editButton, { 
                        backgroundColor: getColors(colorScheme).tint 
                    }]}
                    onPress={onEdit}
                >
                    <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    backButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 16,
    },
    editButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
    },
    editButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    saveButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
    },
    cancelButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
    },
    actionButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
});
