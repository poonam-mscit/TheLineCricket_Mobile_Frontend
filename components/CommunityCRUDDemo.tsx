import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import { useCommunity } from '@/src/hooks/useCommunity';
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

export function CommunityCRUDDemo() {
  const colorScheme = useColorScheme();
  const {
    communities,
    currentCommunity,
    loading,
    errors,
    isLoading,
    hasError,
    loadCommunities,
    loadCommunityById,
    createCommunity,
    updateCommunity,
    deleteCommunity,
    joinCommunity,
    leaveCommunity,
    clearCommunityError,
  } = useCommunity();

  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);

  useEffect(() => {
    loadCommunities();
  }, [loadCommunities]);

  useEffect(() => {
    if (hasError) {
      Alert.alert('Error', Object.values(errors).find(error => error !== null) || 'An unexpected error occurred.');
      clearCommunityError();
    }
  }, [hasError, errors, clearCommunityError]);

  const handleCreateCommunity = () => {
    const newCommunityData = {
      name: `Test Community ${Date.now()}`,
      description: 'A test community for CRUD operations.',
      category: 'sports',
      location: 'Test City',
      privacy: 'public',
      rules: 'Be respectful and follow community guidelines.',
      created_by: 'test_user_id_123', // Replace with actual user ID
    };
    createCommunity(newCommunityData);
  };

  const handleUpdateCommunity = () => {
    if (!currentCommunity) {
      Alert.alert('Error', 'No community selected for update.');
      return;
    }
    const updatedCommunityData = {
      ...currentCommunity,
      name: `${currentCommunity.name} (Updated)`,
      description: `${currentCommunity.description} - This community has been updated.`,
      location: 'Updated Test City',
    };
    updateCommunity(currentCommunity.id, updatedCommunityData);
  };

  const handleDeleteCommunity = () => {
    if (!currentCommunity) {
      Alert.alert('Error', 'No community selected for deletion.');
      return;
    }
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete "${currentCommunity.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteCommunity(currentCommunity.id) },
      ]
    );
  };

  const handleJoinCommunity = () => {
    if (!currentCommunity) {
      Alert.alert('Error', 'No community selected to join.');
      return;
    }
    joinCommunity(currentCommunity.id);
  };

  const handleLeaveCommunity = () => {
    if (!currentCommunity) {
      Alert.alert('Error', 'No community selected to leave.');
      return;
    }
    leaveCommunity(currentCommunity.id);
  };

  const handleSelectCommunity = (communityId: string) => {
    setSelectedCommunityId(communityId);
    loadCommunityById(communityId);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: getColors(colorScheme).background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.header, { color: getColors(colorScheme).text }]}>Community CRUD Demo</Text>

        {isLoading && <Text style={[styles.statusText, { color: getColors(colorScheme).textSecondary }]}>Loading...</Text>}
        {hasError && <Text style={[styles.errorText, { color: getColors(colorScheme).error }]}>Error: {Object.values(errors).find(error => error !== null)}</Text>}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#2ed573' }]} onPress={handleCreateCommunity} disabled={isLoading}>
            <Text style={styles.buttonText}>Create Community</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#ffa502' }]} onPress={handleUpdateCommunity} disabled={isLoading || !currentCommunity}>
            <Text style={styles.buttonText}>Update Community</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#ff4757' }]} onPress={handleDeleteCommunity} disabled={isLoading || !currentCommunity}>
            <Text style={styles.buttonText}>Delete Community</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#4a69bd' }]} onPress={handleJoinCommunity} disabled={isLoading || !currentCommunity}>
            <Text style={styles.buttonText}>Join Community</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#747d8c' }]} onPress={handleLeaveCommunity} disabled={isLoading || !currentCommunity}>
            <Text style={styles.buttonText}>Leave Community</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: getColors(colorScheme).tint }]} onPress={() => loadCommunities()} disabled={isLoading}>
            <Text style={styles.buttonText}>Refresh Communities</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#747d8c' }]} onPress={clearCommunityError}>
            <Text style={styles.buttonText}>Clear Error</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: getColors(colorScheme).text }]}>All Communities:</Text>
        <View style={styles.communityList}>
          {communities.length === 0 ? (
            <Text style={[styles.noDataText, { color: getColors(colorScheme).textSecondary }]}>No communities found. Create one!</Text>
          ) : (
            communities.map((community) => (
              <TouchableOpacity
                key={community.id}
                style={[
                  styles.communityItem,
                  {
                    backgroundColor: getColors(colorScheme).card,
                    borderColor: selectedCommunityId === community.id ? getColors(colorScheme).tint : getColors(colorScheme).border,
                  },
                ]}
                onPress={() => handleSelectCommunity(community.id)}
              >
                <Text style={[styles.communityItemTitle, { color: getColors(colorScheme).text }]}>{community.name}</Text>
                <Text style={[styles.communityItemDetail, { color: getColors(colorScheme).textSecondary }]}>📍 {community.location} | Members: {community.members_count || 0}</Text>
                <Text style={[styles.communityItemDetail, { color: getColors(colorScheme).textSecondary }]}>Category: {community.category} | Privacy: {community.privacy}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <Text style={[styles.sectionTitle, { color: getColors(colorScheme).text, marginTop: 20 }]}>Selected Community Details:</Text>
        <View style={[styles.communityDisplay, {
          backgroundColor: getColors(colorScheme).card,
          borderColor: getColors(colorScheme).border
        }]}>
          {currentCommunity ? (
            <View>
              <Text style={[styles.communityDisplayText, { color: getColors(colorScheme).text }]}>ID: {currentCommunity.id}</Text>
              <Text style={[styles.communityDisplayText, { color: getColors(colorScheme).text }]}>Name: {currentCommunity.name}</Text>
              <Text style={[styles.communityDisplayText, { color: getColors(colorScheme).text }]}>Description: {currentCommunity.description}</Text>
              <Text style={[styles.communityDisplayText, { color: getColors(colorScheme).text }]}>Location: {currentCommunity.location}</Text>
              <Text style={[styles.communityDisplayText, { color: getColors(colorScheme).text }]}>Category: {currentCommunity.category}</Text>
              <Text style={[styles.communityDisplayText, { color: getColors(colorScheme).text }]}>Privacy: {currentCommunity.privacy}</Text>
              <Text style={[styles.communityDisplayText, { color: getColors(colorScheme).text }]}>Members: {currentCommunity.members_count || 0}</Text>
              <Text style={[styles.communityDisplayText, { color: getColors(colorScheme).text }]}>Is Member: {currentCommunity.is_member ? 'Yes' : 'No'}</Text>
            </View>
          ) : (
            <Text style={[styles.communityDisplayText, { color: getColors(colorScheme).textSecondary }]}>No community selected.</Text>
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
  communityList: {
    width: '100%',
    marginBottom: 20,
  },
  communityItem: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  communityItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  communityItemDetail: {
    fontSize: 14,
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  communityDisplay: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  communityDisplayText: {
    fontSize: 16,
    marginBottom: 5,
  },
});
