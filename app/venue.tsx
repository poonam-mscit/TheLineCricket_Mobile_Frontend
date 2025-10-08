import { Text } from '@/components/Themed';
import { PageAboutSection } from '@/components/ui/PageAboutSection';
import { VenueAvailability } from '@/components/ui/VenueAvailability';
import { VenueCover } from '@/components/ui/VenueCover';
import { VenuePricing } from '@/components/ui/VenuePricing';
import { VenueCRUDDemo } from '@/components/VenueCRUDDemo';
import { getColors } from '@/constants/Colors';
import { useAuth } from '@/src/hooks/useAuth';
import { useVenue } from '@/src/hooks/useVenue';
import { VenueData } from '@/types/pages';
import { getPageById, savePage } from '@/utils/pageStorage';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

export default function VenueScreen() {
  const { pageId } = useLocalSearchParams<{ pageId: string }>();
  const [venue, setVenue] = useState<VenueData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCRUDDemo, setShowCRUDDemo] = useState(false);
  const colorScheme = useColorScheme();
  
  // Use real data from hooks
  const { user: authUser } = useAuth();
  const { 
    venues, 
    currentVenue, 
    loadVenues, 
    loadVenueById,
    bookVenue,
    isLoading: venueLoading 
  } = useVenue();

  useEffect(() => {
    loadVenueData();
    // Load venues from API
    loadVenues();
  }, [pageId, loadVenues]);

  const loadVenueData = async () => {
    try {
      setIsLoading(true);
      if (pageId) {
        const page = await getPageById(pageId);
        if (page && page.type === 'venue') {
          setVenue(page.data as VenueData);
        } else {
          Alert.alert('Error', 'Venue not found');
          router.back();
        }
      }
    } catch (error) {
      console.error('Error loading venue:', error);
      Alert.alert('Error', 'Failed to load venue data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadVenueData();
    setIsRefreshing(false);
  };

  const handleBack = () => router.back();
  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    loadVenueData();
  };

  const handleSave = async () => {
    if (!venue || !pageId) return;

    try {
      setIsSaving(true);
      const success = await savePage({
        id: pageId,
        name: venue.name,
        type: 'venue',
        createdAt: new Date(),
        data: venue
      });

      if (success) {
        setIsEditing(false);
        Alert.alert('Success', 'Venue updated successfully');
      } else {
        Alert.alert('Error', 'Failed to save changes');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDescriptionChange = (description: string) => {
    if (venue) {
      setVenue({ ...venue, description });
    }
  };

  const handleContactChange = (field: string, value: string) => {
    if (venue) {
      setVenue({
        ...venue,
        contact: { ...venue.contact, [field]: value }
      });
    }
  };

  if (isLoading || !venue) {
    return (
      <SafeAreaView style={[styles.container, { 
        backgroundColor: getColors(colorScheme).background 
      }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { 
            color: getColors(colorScheme).text 
          }]}>
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { 
      backgroundColor: getColors(colorScheme).background,
      paddingTop: StatusBar.currentHeight || 0
    }]}>
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#10B981']}
            tintColor="#10B981"
          />
        }
      >
        <VenueCover
          name={venue.name}
          type={venue.type}
          logo={venue.logo || null}
          coverImage={venue.coverImage || null}
          verified={venue.verified}
          rating={venue.rating}
          reviews={venue.reviews}
          isAvailable={venue.isAvailable}
        />

        <PageAboutSection
          description={venue.description}
          stats={{
            capacity: venue.capacity,
            facilities: venue.facilities.length,
            bookings: venue.bookings,
          }}
          isEditing={isEditing}
          onDescriptionChange={handleDescriptionChange}
        />

        <VenuePricing
          pricing={venue.pricing}
          onSelectPricing={(pricingId) => Alert.alert('Pricing', `Select pricing ${pricingId}`)}
          onBook={(pricingId) => Alert.alert('Book', `Book pricing ${pricingId}`)}
        />

        <VenueAvailability
          availability={venue.availability}
          onSelectTimeSlot={(date, time) => Alert.alert('Time Slot', `Select ${time} on ${date}`)}
          onBookSlot={(date, time) => Alert.alert('Book Slot', `Book ${time} on ${date}`)}
        />

        {/* Database CRUD Operations Section */}
        <View style={[styles.crudDemoSection, { backgroundColor: getColors(colorScheme).card }]}>
          <Text style={[styles.crudDemoTitle, { color: getColors(colorScheme).text }]}>
            Database CRUD Operations
          </Text>
          <Text style={[styles.crudDemoDescription, { color: getColors(colorScheme).textSecondary }]}>
            Test venue management with real database integration
          </Text>
          <View style={styles.crudDemoButtons}>
            <TouchableOpacity 
              style={[styles.crudDemoButton, { backgroundColor: getColors(colorScheme).tint }]}
              onPress={() => setShowCRUDDemo(true)}
            >
              <Text style={styles.crudDemoButtonText}>Venue CRUD Demo</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* CRUD Demo Modal */}
      <Modal
        visible={showCRUDDemo}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCRUDDemo(false)}
      >
        <VenueCRUDDemo />
        <TouchableOpacity 
          style={[styles.closeCRUDDemoButton, {
            backgroundColor: getColors(colorScheme).tint
          }]}
          onPress={() => setShowCRUDDemo(false)}
        >
          <Text style={styles.closeCRUDDemoButtonText}>Close Demo</Text>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButton: {
    backgroundColor: '#10B981',
  },
  shareButton: {
    backgroundColor: '#3B82F6',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 20,
  },
  crudDemoSection: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  crudDemoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  crudDemoDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  crudDemoButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  crudDemoButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  crudDemoButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  closeCRUDDemoButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  closeCRUDDemoButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

