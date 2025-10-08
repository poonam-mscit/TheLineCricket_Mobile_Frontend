import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import { ContactInfoSectionProps } from '@/types/pages';
import React from 'react';
import { Linking, StyleSheet, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

export function ContactInfoSection({ 
  contact, 
  isEditing, 
  onContactChange 
}: ContactInfoSectionProps) {
  const colorScheme = useColorScheme();

  const handleCall = () => {
    if (contact.phone) {
      Linking.openURL(`tel:${contact.phone}`);
    }
  };

  const handleEmail = () => {
    if (contact.email) {
      Linking.openURL(`mailto:${contact.email}`);
    }
  };

  const handleWebsite = () => {
    if (contact.website) {
      Linking.openURL(contact.website);
    }
  };

  const handleAddress = () => {
    const fullAddress = `${contact.address}, ${contact.city}, ${contact.state}, ${contact.country}`;
    Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`);
  };

  const contactItems = [
    { icon: '📞', label: 'Phone', value: contact.phone, field: 'phone', action: handleCall },
    { icon: '✉️', label: 'Email', value: contact.email, field: 'email', action: handleEmail },
    { icon: '🌐', label: 'Website', value: contact.website, field: 'website', action: handleWebsite },
    { icon: '📍', label: 'Address', value: `${contact.address}, ${contact.city}`, field: 'address', action: handleAddress },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { 
        color: getColors(colorScheme).text 
      }]}>
        Contact Information
      </Text>

      <View style={styles.contactGrid}>
        {contactItems.map((item) => (
          <View 
            key={item.label}
            style={[
              styles.contactCard,
              {
                backgroundColor: getColors(colorScheme).card,
                borderColor: getColors(colorScheme).border
              }
            ]}
          >
            <View style={styles.contactHeader}>
              <Text style={styles.contactIcon}>{item.icon}</Text>
              <Text style={[styles.contactLabel, { 
                color: getColors(colorScheme).text 
              }]}>
                {item.label}
              </Text>
            </View>

            {isEditing ? (
              <TextInput
                style={[
                  styles.contactInput,
                  {
                    backgroundColor: getColors(colorScheme).background,
                    color: getColors(colorScheme).text,
                    borderColor: getColors(colorScheme).border
                  }
                ]}
                value={item.value}
                onChangeText={(text) => onContactChange(item.field, text)}
                placeholder={`Enter ${item.label.toLowerCase()}`}
                placeholderTextColor={getColors(colorScheme).text + '80'}
              />
            ) : (
              <>
                <Text style={[styles.contactValue, { 
                  color: getColors(colorScheme).text 
                }]}>
                  {item.value || 'Not provided'}
                </Text>
                {item.value && (
                  <TouchableOpacity 
                    style={[styles.actionButton, { 
                      backgroundColor: getColors(colorScheme).tint 
                    }]}
                    onPress={item.action}
                  >
                    <Text style={styles.actionButtonText}>
                      {item.label === 'Phone' ? 'Call' : 
                       item.label === 'Email' ? 'Email' : 
                       item.label === 'Website' ? 'Visit' : 'View Map'}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  contactValue: {
    fontSize: 16,
    marginBottom: 8,
  },
  contactInput: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

