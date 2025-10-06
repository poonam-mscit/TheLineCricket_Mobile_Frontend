import { Text } from '@/components/Themed';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface Match {
  id: string;
  title: string;
  type: 'T20' | 'ODI' | 'Test' | 'Practice' | 'Tournament';
  date: Date;
  time: string;
  location: string;
  venue: string;
  playersNeeded: number;
  currentPlayers: number;
  status: 'upcoming' | 'live' | 'completed';
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  entryFee: number;
  equipmentProvided: boolean;
  description?: string;
  creator: {
    id: string;
    username: string;
    fullName: string;
  };
  isParticipant: boolean;
  canJoin: boolean;
}

interface MatchCardProps {
  match: Match;
  onJoin: (matchId: string) => void;
  onLeave: (matchId: string) => void;
  onView: (matchId: string) => void;
}

export function MatchCard({ match, onJoin, onLeave, onView }: MatchCardProps) {
  const colorScheme = useColorScheme();

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return '#ff4757';
      case 'upcoming': return '#3742fa';
      case 'completed': return '#2ed573';
      default: return '#747d8c';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'T20': return '#ff6b35';
      case 'ODI': return '#4834d4';
      case 'Test': return '#2c2c54';
      case 'Practice': return '#26de81';
      case 'Tournament': return '#ff9ff3';
      default: return '#747d8c';
    }
  };

  const handleAction = () => {
    if (match.status === 'upcoming') {
      if (match.isParticipant) {
        onLeave(match.id);
      } else {
        onJoin(match.id);
      }
    } else {
      onView(match.id);
    }
  };

  const getActionText = () => {
    if (match.status === 'live') return 'Watch Live';
    if (match.status === 'completed') return 'View Result';
    if (match.isParticipant) return 'Leave Match';
    return 'Join Match';
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { 
        backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
        borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
      }]}
      onPress={() => onView(match.id)}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {match.title}
          </Text>
          <Text style={[styles.dateTime, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {formatDate(match.date)} at {match.time}
          </Text>
        </View>
        
        <View style={[styles.statusBadge, { 
          backgroundColor: getStatusColor(match.status) 
        }]}>
          <Text style={styles.statusText}>
            {match.status.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Match Info */}
      <View style={styles.matchInfo}>
        <View style={[styles.typeBadge, { 
          backgroundColor: getTypeColor(match.type) 
        }]}>
          <Text style={styles.typeText}>
            {match.type}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            📍 {match.venue}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            👥 {match.currentPlayers}/{match.playersNeeded} players
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            🎯 {match.skillLevel} level
          </Text>
        </View>
        
        {match.entryFee > 0 && (
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              💰 Entry: ₹{match.entryFee}
            </Text>
          </View>
        )}
      </View>

      {/* Description */}
      {match.description && (
        <View style={styles.descriptionContainer}>
          <Text style={[styles.description, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {match.description}
          </Text>
        </View>
      )}

      {/* Equipment Info */}
      <View style={styles.equipmentInfo}>
        <Text style={[styles.equipmentText, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          {match.equipmentProvided ? '🏏 Equipment provided' : '🏏 Bring your own equipment'}
        </Text>
      </View>

      {/* Action Button */}
      <TouchableOpacity 
        style={[
          styles.actionButton,
          { 
            backgroundColor: match.status === 'upcoming' && !match.canJoin && !match.isParticipant
              ? '#ccc'
              : Colors[colorScheme ?? 'light'].tint
          }
        ]}
        onPress={handleAction}
        disabled={match.status === 'upcoming' && !match.canJoin && !match.isParticipant}
      >
        <Text style={styles.actionButtonText}>
          {getActionText()}
        </Text>
      </TouchableOpacity>

      {/* Creator Info */}
      <View style={styles.creatorInfo}>
        <Text style={[styles.creatorText, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          Created by {match.creator.fullName}
        </Text>
      </View>
    </TouchableOpacity>
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
    marginBottom: 12,
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
  dateTime: {
    fontSize: 14,
    opacity: 0.7,
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
  matchInfo: {
    marginBottom: 12,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  typeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  infoRow: {
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 14,
    opacity: 0.8,
  },
  descriptionContainer: {
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  equipmentInfo: {
    marginBottom: 12,
  },
  equipmentText: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  actionButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  creatorInfo: {
    alignItems: 'center',
  },
  creatorText: {
    fontSize: 12,
    opacity: 0.6,
  },
});
