import { Text } from '@/components/Themed';
import { useMatch } from '@/src/hooks/useMatch';
import React, { useEffect } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

export function MatchCRUDDemo() {
  const colorScheme = useColorScheme();
  const {
    matches,
    currentMatch,
    loading,
    errors,
    isLoading,
    hasError,
    loadMatches,
    loadMatchById,
    createNewMatch,
    updateExistingMatch,
    deleteExistingMatch,
    joinExistingMatch,
    leaveExistingMatch,
    clearMatchError
  } = useMatch();

  // Load matches on component mount
  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  // Test create match with real data structure
  const testCreateMatch = () => {
    const testData = {
      title: 'Weekend Cricket Match',
      description: 'Friendly match for all skill levels',
      match_type: 't20',
      match_format: 't20',
      location: 'Mumbai Cricket Ground',
      venue: 'Wankhede Stadium',
      match_date: '2024-01-15',
      match_time: '10:00 AM',
      team1_name: 'Team Alpha',
      team2_name: 'Team Beta',
      skill_level: 'intermediate',
      min_age: 18,
      max_age: 50,
      join_team: 'team1',
      your_role: 'captain',
      is_paid_match: false,
      entry_fee: 0,
      prize_money: 0,
      need_umpire: true,
      umpire_name: 'John Smith',
      umpire_contact: '+91-9876543210',
      umpire_experience: 'advanced',
      umpire_fee: 500,
      players_needed: 22,
      is_public: true,
      equipment_provided: true,
      rules: 'Standard T20 rules apply'
    };

    createNewMatch(testData);
  };

  // Test update match with real data structure
  const testUpdateMatch = () => {
    if (!currentMatch) {
      Alert.alert('Error', 'No match to update');
      return;
    }

    const updateData = {
      title: 'Updated Weekend Cricket Match',
      description: 'Updated friendly match for all skill levels',
      match_type: 'odi',
      match_format: 'odi',
      location: 'Delhi Cricket Ground',
      venue: 'Feroz Shah Kotla',
      match_date: '2024-01-20',
      match_time: '2:00 PM',
      team1_name: 'Updated Team Alpha',
      team2_name: 'Updated Team Beta',
      skill_level: 'advanced',
      min_age: 20,
      max_age: 45,
      join_team: 'team2',
      your_role: 'vice_captain',
      is_paid_match: true,
      entry_fee: 100,
      prize_money: 5000,
      need_umpire: true,
      umpire_name: 'Updated John Smith',
      umpire_contact: '+91-9876543210',
      umpire_experience: 'professional',
      umpire_fee: 1000,
      players_needed: 22,
      is_public: true,
      equipment_provided: false,
      rules: 'Updated ODI rules apply'
    };

    updateExistingMatch(currentMatch.id, updateData);
  };

  // Test delete match
  const testDeleteMatch = () => {
    if (!currentMatch) {
      Alert.alert('Error', 'No match to delete');
      return;
    }
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this match? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteExistingMatch(currentMatch.id) },
      ]
    );
  };

  // Test join match
  const testJoinMatch = () => {
    if (!currentMatch) {
      Alert.alert('Error', 'No match to join');
      return;
    }
    joinExistingMatch(currentMatch.id);
  };

  // Test leave match
  const testLeaveMatch = () => {
    if (!currentMatch) {
      Alert.alert('Error', 'No match to leave');
      return;
    }
    leaveExistingMatch(currentMatch.id);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.header, { color: colorScheme === 'dark' ? '#ffffff' : '#000000' }]}>
          Match CRUD Demo
        </Text>

        {isLoading && <Text style={[styles.statusText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>Loading...</Text>}
        {hasError && <Text style={[styles.errorText, { color: '#ff4757' }]}>Error: {Object.values(errors).find(error => error) || 'Unknown error'}</Text>}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#2ed573' }]} onPress={testCreateMatch} disabled={isLoading}>
            <Text style={styles.buttonText}>Create Match</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#ffa502' }]} onPress={testUpdateMatch} disabled={isLoading || !currentMatch}>
            <Text style={styles.buttonText}>Update Match</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#ff4757' }]} onPress={testDeleteMatch} disabled={isLoading || !currentMatch}>
            <Text style={styles.buttonText}>Delete Match</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#4a69bd' }]} onPress={testJoinMatch} disabled={isLoading || !currentMatch}>
            <Text style={styles.buttonText}>Join Match</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#747d8c' }]} onPress={testLeaveMatch} disabled={isLoading || !currentMatch}>
            <Text style={styles.buttonText}>Leave Match</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#2f3542' }]} onPress={loadMatches} disabled={isLoading}>
            <Text style={styles.buttonText}>Refresh Matches</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#a4b0be' }]} onPress={clearMatchError}>
            <Text style={styles.buttonText}>Clear Error</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.matchDisplay, {
          backgroundColor: colorScheme === 'dark' ? '#333' : '#f0f0f0',
          borderColor: colorScheme === 'dark' ? '#555' : '#ccc'
        }]}>
          <Text style={[styles.matchTitle, { color: colorScheme === 'dark' ? '#ffffff' : '#000000' }]}>Current Match:</Text>
          {currentMatch ? (
            <View>
              <Text style={[styles.matchText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>ID: {currentMatch.id}</Text>
              <Text style={[styles.matchText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>Title: {currentMatch.title}</Text>
              <Text style={[styles.matchText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>Description: {currentMatch.description}</Text>
              <Text style={[styles.matchText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>Type: {currentMatch.match_type}</Text>
              <Text style={[styles.matchText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>Location: {currentMatch.location}</Text>
              <Text style={[styles.matchText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>Date: {currentMatch.match_date}</Text>
              <Text style={[styles.matchText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>Time: {currentMatch.match_time}</Text>
              <Text style={[styles.matchText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>Team 1: {currentMatch.team1_name}</Text>
              <Text style={[styles.matchText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>Team 2: {currentMatch.team2_name}</Text>
              <Text style={[styles.matchText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>Skill Level: {currentMatch.skill_level}</Text>
              <Text style={[styles.matchText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>Players Needed: {currentMatch.players_needed}</Text>
              <Text style={[styles.matchText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>Public: {currentMatch.is_public ? 'Yes' : 'No'}</Text>
            </View>
          ) : (
            <Text style={[styles.matchText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>No match loaded.</Text>
          )}
        </View>

        <View style={[styles.matchesList, {
          backgroundColor: colorScheme === 'dark' ? '#333' : '#f0f0f0',
          borderColor: colorScheme === 'dark' ? '#555' : '#ccc'
        }]}>
          <Text style={[styles.matchesTitle, { color: colorScheme === 'dark' ? '#ffffff' : '#000000' }]}>All Matches ({matches.length}):</Text>
          {matches.length > 0 ? (
            matches.slice(0, 5).map((match, index) => (
              <TouchableOpacity
                key={match.id || index}
                style={[styles.matchItem, { backgroundColor: colorScheme === 'dark' ? '#444' : '#fff' }]}
                onPress={() => loadMatchById(match.id)}
              >
                <Text style={[styles.matchItemText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>
                  {match.title} - {match.location}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={[styles.matchText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>No matches found.</Text>
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
  matchDisplay: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
  },
  matchTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  matchText: {
    fontSize: 16,
    marginBottom: 5,
  },
  matchesList: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  matchesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  matchItem: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  matchItemText: {
    fontSize: 14,
  },
});
