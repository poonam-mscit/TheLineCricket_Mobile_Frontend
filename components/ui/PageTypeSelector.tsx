import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import { getPageDescription, getPageTypeLabel, PageColors, PageIcons } from '@/constants/PageThemes';
import { PageType, PageTypeSelectorProps } from '@/types/pages';
import React from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';

export function PageTypeSelector({ visible, onClose, onSelectType }: PageTypeSelectorProps) {
  const colorScheme = useColorScheme();

  const pageTypes: PageType[] = ['academy', 'community', 'venue'];
  
  console.log('PageTypeSelector rendered, visible:', visible);
  console.log('pageTypes:', pageTypes);
  console.log('PageColors:', PageColors);
  console.log('PageIcons:', PageIcons);

  const handleSelectType = (type: PageType) => {
    onSelectType(type);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
    >
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View 
          style={[styles.modalContainer, { 
            backgroundColor: getColors(colorScheme).background 
          }]}
          onStartShouldSetResponder={() => true}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { 
              color: getColors(colorScheme).text 
            }]}>
              Create a Page
            </Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <Text style={[styles.description, { 
            color: getColors(colorScheme).text 
          }]}>
            Choose the type of page you want to create
          </Text>
          
          {/* Debug Text */}
          <Text style={[styles.description, { 
            color: getColors(colorScheme).text 
          }]}>
            DEBUG: Modal is visible - {visible ? 'YES' : 'NO'}
          </Text>

          {/* Page Type Cards */}
          <ScrollView 
            style={styles.cardsContainer}
            showsVerticalScrollIndicator={false}
          >
            {pageTypes.map((type) => {
              console.log('Rendering card for type:', type);
              return (
              <TouchableOpacity
                key={type}
                style={[
                  styles.card,
                  {
                    backgroundColor: getColors(colorScheme).card,
                    borderColor: PageColors[type].primary
                  }
                ]}
                onPress={() => handleSelectType(type)}
                activeOpacity={0.7}
              >
                <View style={styles.cardContent}>
                  {/* Icon */}
                  <View style={[
                    styles.iconContainer,
                    { backgroundColor: PageColors[type].background }
                  ]}>
                    <Text style={styles.icon}>{PageIcons[type]}</Text>
                  </View>

                  {/* Title and Description */}
                  <View style={styles.textContainer}>
                    <Text style={[
                      styles.cardTitle,
                      { color: getColors(colorScheme).text }
                    ]}>
                      {getPageTypeLabel(type)}
                    </Text>
                    <Text style={[
                      styles.cardDescription,
                      { color: getColors(colorScheme).text }
                    ]}>
                      {getPageDescription(type)}
                    </Text>
                  </View>

                  {/* Create Button */}
                  <TouchableOpacity
                    style={[
                      styles.createButton,
                      { backgroundColor: PageColors[type].primary }
                    ]}
                    onPress={() => handleSelectType(type)}
                  >
                    <Text style={styles.createButtonText}>Create</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    minHeight: 400,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#374151',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 20,
  },
  cardsContainer: {
    flex: 1,
    minHeight: 200,
  },
  card: {
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    gap: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  icon: {
    fontSize: 32,
  },
  textContainer: {
    gap: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  createButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

