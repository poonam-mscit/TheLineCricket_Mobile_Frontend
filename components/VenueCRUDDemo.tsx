import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import { useVenue } from '@/src/hooks/useVenue';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

export function VenueCRUDDemo() {
  const colorScheme = useColorScheme();
  const {
    venues,
    currentVenue,
    loading,
    errors,
    isLoading,
    hasError,
    loadVenues,
    loadVenueById,
    createVenue,
    updateVenue,
    deleteVenue,
    bookVenue,
    clearVenueError,
  } = useVenue();

  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);

  useEffect(() => {
    loadVenues();
  }, [loadVenues]);

  useEffect(() => {
    if (hasError) {
      Alert.alert('Error', Object.values(errors).find(error => error !== null) || 'An unexpected error occurred.');
      clearVenueError();
    }
  }, [hasError, errors, clearVenueError]);

  const handleCreateVenue = () => {
    const newVenueData = {
      name: `Test Venue ${Date.now()}`,
      description: 'A test venue for CRUD operations.',
      location: 'Test City',
      address: '123 Test Street, Test City',
      capacity: 100,
      price_per_hour: 50,
      amenities: ['parking', 'wifi', 'restrooms'],
      availability: 'available',
      contact_info: 'test@venue.com',
      rules: 'No smoking, clean up after use.',
      created_by: 'test_user_id_123', // Replace with actual user ID
    };
    createVenue(newVenueData);
  };

  const handleUpdateVenue = () => {
    if (!currentVenue) {
      Alert.alert('Error', 'No venue selected for update.');
      return;
    }
    const updatedVenueData = {
      ...currentVenue,
      name: `${currentVenue.name} (Updated)`,
      description: `${currentVenue.description} - This venue has been updated.`,
      location: 'Updated Test City',
    };
    updateVenue(currentVenue.id, updatedVenueData);
  };

  const handleDeleteVenue = () => {
    if (!currentVenue) {
      Alert.alert('Error', 'No venue selected for deletion.');
      return;
    }
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete "${currentVenue.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteVenue(currentVenue.id) },
      ]
    );
  };

  const handleBookVenue = () => {
    if (!currentVenue) {
      Alert.alert('Error', 'No venue selected to book.');
      return;
    }
    const bookingData = {
      start_date: '2024-12-25',
      end_date: '2024-12-25',
      start_time: '10:00',
      end_time: '18:00',
      purpose: 'Test booking',
      attendees: 20,
    };
    bookVenue(currentVenue.id, bookingData);
  };

  const handleSelectVenue = (venueId: string) => {
    setSelectedVenueId(venueId);
    loadVenueById(venueId);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: getColors(colorScheme).background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.header, { color: getColors(colorScheme).text }]}>Venue CRUD Demo</Text>

        {isLoading && <Text style={[styles.statusText, { color: getColors(colorScheme).textSecondary }]}>Loading...</Text>}
        {hasError && <Text style={[styles.errorText, { color: getColors(colorScheme).error }]}>Error: {Object.values(errors).find(error => error !== null)}</Text>}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#2ed573' }]} onPress={handleCreateVenue} disabled={isLoading}>
            <Text style={styles.buttonText}>Create Venue</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#ffa502' }]} onPress={handleUpdateVenue} disabled={isLoading || !currentVenue}>
            <Text style={styles.buttonText}>Update Venue</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#ff4757' }]} onPress={handleDeleteVenue} disabled={isLoading || !currentVenue}>
            <Text style={styles.buttonText}>Delete Venue</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#4a69bd' }]} onPress={handleBookVenue} disabled={isLoading || !currentVenue}>
            <Text style={styles.buttonText}>Book Venue</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: getColors(colorScheme).tint }]} onPress={() => loadVenues()} disabled={isLoading}>
            <Text style={styles.buttonText}>Refresh Venues</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#747d8c' }]} onPress={clearVenueError}>
            <Text style={styles.buttonText}>Clear Error</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: getColors(colorScheme).text }]}>All Venues:</Text>
        <View style={styles.venueList}>
          {venues.length === 0 ? (
            <Text style={[styles.noDataText, { color: getColors(colorScheme).textSecondary }]}>No venues found. Create one!</Text>
          ) : (
            venues.map((venue) => (
              <TouchableOpacity
                key={venue.id}
                style={[
                  styles.venueItem,
                  {
                    backgroundColor: getColors(colorScheme).card,
                    borderColor: selectedVenueId === venue.id ? getColors(colorScheme).tint : getColors(colorScheme).border,
                  },
                ]}
                onPress={() => handleSelectVenue(venue.id)}
              >
                <Text style={[styles.venueItemTitle, { color: getColors(colorScheme).text }]}>{venue.name}</Text>
                <Text style={[styles.venueItemDetail, { color: getColors(colorScheme).textSecondary }]}>📍 {venue.location} | Capacity: {venue.capacity}</Text>
                <Text style={[styles.venueItemDetail, { color: getColors(colorScheme).textSecondary }]}>💰 ${venue.price_per_hour}/hour | {venue.availability}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <Text style={[styles.sectionTitle, { color: getColors(colorScheme).text, marginTop: 20 }]}>Selected Venue Details:</Text>
        <View style={[styles.venueDisplay, {
          backgroundColor: getColors(colorScheme).card,
          borderColor: getColors(colorScheme).border
        }]}>
          {currentVenue ? (
            <View>
              <Text style={[styles.venueDisplayText, { color: getColors(colorScheme).text }]}>ID: {currentVenue.id}</Text>
              <Text style={[styles.venueDisplayText, { color: getColors(colorScheme).text }]}>Name: {currentVenue.name}</Text>
              <Text style={[styles.venueDisplayText, { color: getColors(colorScheme).text }]}>Description: {currentVenue.description}</Text>
              <Text style={[styles.venueDisplayText, { color: getColors(colorScheme).text }]}>Location: {currentVenue.location}</Text>
              <Text style={[styles.venueDisplayText, { color: getColors(colorScheme).text }]}>Address: {currentVenue.address}</Text>
              <Text style={[styles.venueDisplayText, { color: getColors(colorScheme).text }]}>Capacity: {currentVenue.capacity}</Text>
              <Text style={[styles.venueDisplayText, { color: getColors(colorScheme).text }]}>Price: ${currentVenue.price_per_hour}/hour</Text>
              <Text style={[styles.venueDisplayText, { color: getColors(colorScheme).text }]}>Availability: {currentVenue.availability}</Text>
              <Text style={[styles.venueDisplayText, { color: getColors(colorScheme).text }]}>Bookings: {currentVenue.bookings_count || 0}</Text>
              <Text style={[styles.venueDisplayText, { color: getColors(colorScheme).text }]}>Amenities: {currentVenue.amenities?.join(', ') || 'None'}</Text>
            </View>
          ) : (
            <Text style={[styles.venueDisplayText, { color: getColors(colorScheme).textSecondary }]}>No venue selected.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  venueList: {
    width: '100%',
    marginBottom: 20,
  },
  venueItem: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  venueItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  venueItemDetail: {
    fontSize: 14,
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  venueDisplay: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  venueDisplayText: {
    fontSize: 16,
    marginBottom: 5,
  },
});
