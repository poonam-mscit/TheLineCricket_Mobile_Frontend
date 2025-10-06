import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface Team {
  id: string;
  name: string;
  logo?: string;
  players: number;
  wins: number;
  losses: number;
}

interface Match {
  id: string;
  teamA: Team;
  teamB: Team;
  scoreA: number;
  scoreB: number;
  status: 'upcoming' | 'live' | 'completed';
  date: Date;
  round: string;
  isWinnerA: boolean;
}

interface TournamentBracketProps {
  tournament: {
    id: string;
    name: string;
    type: 'single_elimination' | 'double_elimination' | 'round_robin';
    status: 'upcoming' | 'ongoing' | 'completed';
    teams: Team[];
    matches: Match[];
    currentRound: number;
    totalRounds: number;
  };
  onMatchPress: (matchId: string) => void;
  onTeamPress: (teamId: string) => void;
}

export function TournamentBracket({ 
  tournament, 
  onMatchPress, 
  onTeamPress 
}: TournamentBracketProps) {
  const colorScheme = useColorScheme();

  const getRoundName = (round: number) => {
    const totalRounds = tournament.totalRounds;
    if (round === totalRounds) return 'Final';
    if (round === totalRounds - 1) return 'Semi-Final';
    if (round === totalRounds - 2) return 'Quarter-Final';
    return `Round ${round}`;
  };

  const getMatchStatusColor = (status: string) => {
    switch (status) {
      case 'live': return '#ff4757';
      case 'completed': return '#2ed573';
      case 'upcoming': return '#3742fa';
      default: return '#747d8c';
    }
  };

  const getMatchStatusText = (status: string) => {
    switch (status) {
      case 'live': return 'LIVE';
      case 'completed': return 'COMPLETED';
      case 'upcoming': return 'UPCOMING';
      default: return 'UNKNOWN';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderMatch = (match: Match) => (
    <TouchableOpacity 
      key={match.id}
      style={[styles.matchCard, { 
        backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
        borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
      }]}
      onPress={() => onMatchPress(match.id)}
    >
      <View style={styles.matchHeader}>
        <Text style={[styles.roundName, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          {getRoundName(parseInt(match.round))}
        </Text>
        <View style={[styles.statusBadge, { 
          backgroundColor: getMatchStatusColor(match.status) 
        }]}>
          <Text style={styles.statusText}>
            {getMatchStatusText(match.status)}
          </Text>
        </View>
      </View>

      <View style={styles.teamsContainer}>
        <TouchableOpacity 
          style={[
            styles.teamContainer,
            match.isWinnerA && match.status === 'completed' && styles.winnerTeam
          ]}
          onPress={() => onTeamPress(match.teamA.id)}
        >
          <View style={styles.teamInfo}>
            <Text style={[styles.teamName, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {match.teamA.name}
            </Text>
            <Text style={[styles.teamPlayers, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {match.teamA.players} players
            </Text>
          </View>
          <Text style={[styles.teamScore, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {match.scoreA}
          </Text>
        </TouchableOpacity>

        <View style={styles.vsContainer}>
          <Text style={[styles.vsText, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            VS
          </Text>
        </View>

        <TouchableOpacity 
          style={[
            styles.teamContainer,
            !match.isWinnerA && match.status === 'completed' && styles.winnerTeam
          ]}
          onPress={() => onTeamPress(match.teamB.id)}
        >
          <View style={styles.teamInfo}>
            <Text style={[styles.teamName, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {match.teamB.name}
            </Text>
            <Text style={[styles.teamPlayers, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {match.teamB.players} players
            </Text>
          </View>
          <Text style={[styles.teamScore, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {match.scoreB}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.matchFooter}>
        <Text style={[styles.matchDate, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          📅 {formatDate(match.date)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderRound = (round: number) => {
    const roundMatches = tournament.matches.filter(match => 
      parseInt(match.round) === round
    );

    if (roundMatches.length === 0) return null;

    return (
      <View key={round} style={styles.roundContainer}>
        <Text style={[styles.roundTitle, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          {getRoundName(round)}
        </Text>
        <View style={styles.matchesContainer}>
          {roundMatches.map(renderMatch)}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { 
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
      borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
    }]}>
      <View style={styles.tournamentHeader}>
        <Text style={[styles.tournamentName, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          {tournament.name}
        </Text>
        <View style={styles.tournamentInfo}>
          <Text style={[styles.tournamentType, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {tournament.type.replace('_', ' ').toUpperCase()}
          </Text>
          <Text style={[styles.tournamentStatus, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {tournament.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <ScrollView 
        style={styles.bracketContainer}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.bracketContent}>
          {Array.from({ length: tournament.totalRounds }, (_, i) => i + 1)
            .map(round => renderRound(round))}
        </View>
      </ScrollView>

      <View style={styles.tournamentStats}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {tournament.teams.length}
          </Text>
          <Text style={[styles.statLabel, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Teams
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {tournament.matches.length}
          </Text>
          <Text style={[styles.statLabel, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Matches
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {tournament.currentRound}/{tournament.totalRounds}
          </Text>
          <Text style={[styles.statLabel, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Round
          </Text>
        </View>
      </View>
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
  tournamentHeader: {
    marginBottom: 16,
  },
  tournamentName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tournamentInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  tournamentType: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
  tournamentStatus: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
  bracketContainer: {
    maxHeight: 400,
  },
  bracketContent: {
    flexDirection: 'row',
    gap: 20,
  },
  roundContainer: {
    minWidth: 200,
  },
  roundTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  matchesContainer: {
    gap: 8,
  },
  matchCard: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roundName: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  teamsContainer: {
    gap: 8,
  },
  teamContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  winnerTeam: {
    backgroundColor: '#2ed573',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  teamPlayers: {
    fontSize: 12,
    opacity: 0.7,
  },
  teamScore: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  vsContainer: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  vsText: {
    fontSize: 12,
    fontWeight: 'bold',
    opacity: 0.6,
  },
  matchFooter: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  matchDate: {
    fontSize: 12,
    opacity: 0.7,
  },
  tournamentStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
});
