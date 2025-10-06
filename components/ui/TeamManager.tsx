import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface Player {
  id: string;
  name: string;
  role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket-keeper';
  battingStyle: 'Right-handed' | 'Left-handed';
  bowlingStyle: 'Right-arm fast' | 'Left-arm fast' | 'Right-arm medium' | 'Left-arm medium' | 'Right-arm spin' | 'Left-arm spin';
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  stats: {
    matches: number;
    runs: number;
    wickets: number;
    catches: number;
    average: number;
    strikeRate: number;
    economy: number;
  };
  isCaptain: boolean;
  isViceCaptain: boolean;
}

interface Team {
  id: string;
  name: string;
  logo?: string;
  description: string;
  players: Player[];
  captain: Player;
  viceCaptain: Player;
  stats: {
    matches: number;
    wins: number;
    losses: number;
    winRate: number;
    totalRuns: number;
    totalWickets: number;
  };
  createdDate: Date;
  isActive: boolean;
}

interface TeamManagerProps {
  team?: Team;
  onSave: (team: Team) => void;
  onCancel: () => void;
  onAddPlayer: (teamId: string) => void;
  onRemovePlayer: (teamId: string, playerId: string) => void;
  onEditPlayer: (teamId: string, playerId: string) => void;
}

export function TeamManager({ 
  team, 
  onSave, 
  onCancel, 
  onAddPlayer, 
  onRemovePlayer, 
  onEditPlayer 
}: TeamManagerProps) {
  const [teamData, setTeamData] = useState<Partial<Team>>({
    name: '',
    description: '',
    players: [],
    isActive: true,
    ...team
  });
  
  const colorScheme = useColorScheme();

  const handleInputChange = (field: keyof Team, value: any) => {
    setTeamData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!teamData.name || !teamData.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (teamData.players && teamData.players.length < 11) {
      Alert.alert('Error', 'A cricket team must have at least 11 players');
      return;
    }

    const team: Team = {
      id: teamData.id || Date.now().toString(),
      name: teamData.name!,
      description: teamData.description!,
      players: teamData.players || [],
      captain: teamData.captain || teamData.players?.[0] || {} as Player,
      viceCaptain: teamData.viceCaptain || teamData.players?.[1] || {} as Player,
      stats: teamData.stats || {
        matches: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        totalRuns: 0,
        totalWickets: 0
      },
      createdDate: teamData.createdDate || new Date(),
      isActive: teamData.isActive!
    };

    onSave(team);
  };

  const handleAddPlayer = () => {
    onAddPlayer(teamData.id || '');
  };

  const handleRemovePlayer = (playerId: string) => {
    setTeamData(prev => ({
      ...prev,
      players: prev.players?.filter(player => player.id !== playerId)
    }));
    onRemovePlayer(teamData.id || '', playerId);
  };

  const handleEditPlayer = (playerId: string) => {
    onEditPlayer(teamData.id || '', playerId);
  };

  const handleSetCaptain = (playerId: string) => {
    const player = teamData.players?.find(p => p.id === playerId);
    if (player) {
      setTeamData(prev => ({
        ...prev,
        captain: player,
        players: prev.players?.map(p => ({
          ...p,
          isCaptain: p.id === playerId,
          isViceCaptain: p.id === playerId ? false : p.isViceCaptain
        }))
      }));
    }
  };

  const handleSetViceCaptain = (playerId: string) => {
    const player = teamData.players?.find(p => p.id === playerId);
    if (player) {
      setTeamData(prev => ({
        ...prev,
        viceCaptain: player,
        players: prev.players?.map(p => ({
          ...p,
          isViceCaptain: p.id === playerId,
          isCaptain: p.id === playerId ? false : p.isCaptain
        }))
      }));
    }
  };

  return (
    <View style={[styles.container, { 
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
      borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
    }]}>
      <Text style={[styles.title, { 
        color: Colors[colorScheme ?? 'light'].text 
      }]}>
        {team ? 'Edit Team' : 'Create Team'}
      </Text>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Team Information
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Team Name *
            </Text>
            <TextInput
              style={[styles.input, { 
                color: Colors[colorScheme ?? 'light'].text,
                backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
                borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
              }]}
              placeholder="Enter team name"
              placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
              value={teamData.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Description *
            </Text>
            <TextInput
              style={[styles.textArea, { 
                color: Colors[colorScheme ?? 'light'].text,
                backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
                borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
              }]}
              placeholder="Enter team description"
              placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
              value={teamData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Players */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Players ({teamData.players?.length || 0}/11)
            </Text>
            <TouchableOpacity 
              style={[styles.addButton, { 
                backgroundColor: Colors[colorScheme ?? 'light'].tint 
              }]}
              onPress={handleAddPlayer}
            >
              <Text style={styles.addButtonText}>+ Add Player</Text>
            </TouchableOpacity>
          </View>

          {teamData.players && teamData.players.length > 0 ? (
            <View style={styles.playersList}>
              {teamData.players.map((player) => (
                <View key={player.id} style={[styles.playerCard, { 
                  backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
                  borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
                }]}>
                  <View style={styles.playerInfo}>
                    <Text style={[styles.playerName, { 
                      color: Colors[colorScheme ?? 'light'].text 
                    }]}>
                      {player.name}
                    </Text>
                    <Text style={[styles.playerRole, { 
                      color: Colors[colorScheme ?? 'light'].text 
                    }]}>
                      {player.role} • {player.skillLevel}
                    </Text>
                    <View style={styles.playerStats}>
                      <Text style={[styles.statText, { 
                        color: Colors[colorScheme ?? 'light'].text 
                      }]}>
                        {player.stats.matches} matches • {player.stats.runs} runs • {player.stats.wickets} wickets
                      </Text>
                    </View>
                  </View>

                  <View style={styles.playerActions}>
                    {(player.isCaptain || player.isViceCaptain) && (
                      <View style={[styles.captainBadge, { 
                        backgroundColor: player.isCaptain ? '#ffa502' : '#3742fa' 
                      }]}>
                        <Text style={styles.captainText}>
                          {player.isCaptain ? 'C' : 'VC'}
                        </Text>
                      </View>
                    )}
                    
                    <TouchableOpacity 
                      style={[styles.actionButton, { 
                        backgroundColor: Colors[colorScheme ?? 'light'].tint 
                      }]}
                      onPress={() => handleEditPlayer(player.id)}
                    >
                      <Text style={styles.actionButtonText}>Edit</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.actionButton, { 
                        backgroundColor: '#ff4757' 
                      }]}
                      onPress={() => handleRemovePlayer(player.id)}
                    >
                      <Text style={styles.actionButtonText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyPlayers}>
              <Text style={[styles.emptyText, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                No players added yet. Add players to create your team.
              </Text>
            </View>
          )}
        </View>

        {/* Captain Selection */}
        {teamData.players && teamData.players.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Leadership
            </Text>
            
            <View style={styles.leadershipContainer}>
              <View style={styles.leadershipItem}>
                <Text style={[styles.leadershipLabel, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  Captain
                </Text>
                <Text style={[styles.leadershipName, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  {teamData.captain?.name || 'Not selected'}
                </Text>
              </View>
              
              <View style={styles.leadershipItem}>
                <Text style={[styles.leadershipLabel, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  Vice Captain
                </Text>
                <Text style={[styles.leadershipName, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  {teamData.viceCaptain?.name || 'Not selected'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Team Stats */}
        {team && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Team Statistics
            </Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  {team.stats.matches}
                </Text>
                <Text style={[styles.statLabel, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  Matches
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#2ed573' }]}>
                  {team.stats.wins}
                </Text>
                <Text style={[styles.statLabel, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  Wins
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#ff4757' }]}>
                  {team.stats.losses}
                </Text>
                <Text style={[styles.statLabel, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  Losses
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  {team.stats.winRate}%
                </Text>
                <Text style={[styles.statLabel, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  Win Rate
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.cancelButton, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
            borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
          }]}
          onPress={onCancel}
        >
          <Text style={[styles.cancelButtonText, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.saveButton, { 
            backgroundColor: Colors[colorScheme ?? 'light'].tint 
          }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>
            {team ? 'Update Team' : 'Create Team'}
          </Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  form: {
    maxHeight: 500,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  playersList: {
    gap: 8,
  },
  playerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  playerRole: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  playerStats: {
    flexDirection: 'row',
  },
  statText: {
    fontSize: 12,
    opacity: 0.6,
  },
  playerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  captainBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captainText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyPlayers: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  leadershipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leadershipItem: {
    flex: 1,
    alignItems: 'center',
  },
  leadershipLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  leadershipName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
