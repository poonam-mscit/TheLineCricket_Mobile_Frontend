import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import { PageHeaderProps } from '@/types/pages';
import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';

export function PageHeader({ 
  onBack, 
  onEdit, 
  isEditing, 
  onSave, 
  onCancel, 
  isSaving 
}: PageHeaderProps) {
  const colorScheme = useColorScheme();

  return (
    <View style={[styles.header, { 
      backgroundColor: getColors(colorScheme).background,
      borderBottomColor: getColors(colorScheme).border
    }]}>
      <View style={styles.headerContent}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBack}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { 
          color: getColors(colorScheme).text 
        }]}>
          {isEditing ? 'Edit Page' : 'Page Details'}
        </Text>
        
        {isEditing ? (
          <View style={styles.editActions}>
            <TouchableOpacity 
              style={[styles.cancelButton, { 
                borderColor: getColors(colorScheme).border 
              }]}
              onPress={onCancel}
              disabled={isSaving}
            >
              <Text style={[styles.cancelButtonText, { 
                color: getColors(colorScheme).text 
              }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.saveButton, { 
                backgroundColor: getColors(colorScheme).tint 
              }]}
              onPress={onSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 12,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

