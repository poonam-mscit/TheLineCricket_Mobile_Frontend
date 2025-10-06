import { Text } from '@/components/Themed';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface LiveMatch {
  id: string;
  title: string;
  type: 'T20' | 'ODI' | 'Test' | 'Practice' | 'Tournament';
  teamA: {
    name: string;
    score: number;
    wickets: number;
    overs: number;
  };
  teamB: {
    name: string;
    score: number;
    wickets: number;
    overs: number;
  };
  currentBatsman: string;
  currentBowler: string;
  status: 'batting' | 'bowling' | 'break' | 'finished';
  venue: string;
  viewers: number;
  isWatching: boolean;
}

interface LiveMatchCardProps {
  match: LiveMatch;
  onWatch: (matchId: string) => void;
  onStopWatching: (matchId: string) => void;
}

export function LiveMatchCard({ match, onWatch, onStopWatching }: LiveMatchCardProps) {
  const colorScheme = useColorScheme();

  const handleWatch = () => {
    if (match.isWatching) {
      onStopWatching(match.id);
    } else {
      onWatch(match.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'batting': return '#2ed573';
      case 'bowling': return '#ff4757';
      case 'break': return '#ffa502';
      case 'finished': return '#747d8c';
      default: return '#3742fa';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'batting': return 'BATTING';
      case 'bowling': return 'BOWLING';
      case 'break': return 'BREAK';
      case 'finished': return 'FINISHED';
      default: return 'LIVE';
    }
  };

  return (
    <View style={[styles.container, { 
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
      borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
    }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {match.title}
          </Text>
          <Text style={[styles.venue, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            📍 {match.venue}
          </Text>
        </View>
        
        <View style={[styles.liveBadge, { 
          backgroundColor: '#ff4757' 
        }]}>
          <Text style={styles.liveText}>🔴 LIVE</Text>
        </View>
      </View>

      {/* Score Card */}
      <View style={styles.scoreCard}>
        {/* Team A */}
        <View style={styles.teamContainer}>
          <View style={styles.teamHeader}>
            <Text style={[styles.teamName, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {match.teamA.name}
            </Text>
            <Text style={[styles.teamScore, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {match.teamA.score}/{match.teamA.wickets}
            </Text>
          </View>
          <Text style={[styles.overs, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            ({match.teamA.overs} overs)
          </Text>
        </View>

        {/* VS */}
        <View style={styles.vsContainer}>
          <Text style={[styles.vsText, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            VS
          </Text>
        </View>

        {/* Team B */}
        <View style={styles.teamContainer}>
          <View style={styles.teamHeader}>
            <Text style={[styles.teamName, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {match.teamB.name}
            </Text>
            <Text style={[styles.teamScore, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {match.teamB.score}/{match.teamB.wickets}
            </Text>
          </View>
          <Text style={[styles.overs, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            ({match.teamB.overs} overs)
          </Text>
        </View>
      </View>

      {/* Current Players */}
      <View style={styles.currentPlayers}>
        <View style={styles.playerContainer}>
          <Text style={[styles.playerLabel, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Batting:
          </Text>
          <Text style={[styles.playerName, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {match.currentBatsman}
          </Text>
        </View>
        
        <View style={styles.playerContainer}>
          <Text style={[styles.playerLabel, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Bowling:
          </Text>
          <Text style={[styles.playerName, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {match.currentBowler}
          </Text>
        </View>
      </View>

      {/* Status and Viewers */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { 
          backgroundColor: getStatusColor(match.status) 
        }]}>
          <Text style={styles.statusText}>
            {getStatusText(match.status)}
          </Text>
        </View>
        
        <Text style={[styles.viewers, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          👥 {match.viewers} watching
        </Text>
      </View>

      {/* Watch Button */}
      <TouchableOpacity 
        style={[
          styles.watchButton,
          { 
            backgroundColor: match.isWatching 
              ? '#ff4757' 
              : Colors[colorScheme ?? 'light'].tint
          }
        ]}
        onPress={handleWatch}
      >
        <Text style={styles.watchButtonText}>
          {match.isWatching ? 'Stop Watching' : 'Watch Live'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  venue: {
    fontSize: 14,
    opacity: 0.7,
  },
  liveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  teamScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2ed573',
  },
  overs: {
    fontSize: 12,
    opacity: 0.7,
  },
  vsContainer: {
    marginHorizontal: 16,
  },
  vsText: {
    fontSize: 14,
    fontWeight: 'bold',
    opacity: 0.6,
  },
  currentPlayers: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  playerContainer: {
    alignItems: 'center',
  },
  playerLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  playerName: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  viewers: {
    fontSize: 12,
    opacity: 0.7,
  },
  watchButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  watchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
