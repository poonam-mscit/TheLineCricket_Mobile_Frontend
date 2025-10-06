import { Text } from '@/components/Themed';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface PlayerStats {
  id: string;
  name: string;
  role: 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicket-keeper';
  battingStyle: 'Right-handed' | 'Left-handed';
  bowlingStyle: 'Right-arm fast' | 'Left-arm fast' | 'Right-arm medium' | 'Left-arm medium' | 'Right-arm spin' | 'Left-arm spin';
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';
  matches: number;
  batting: {
    runs: number;
    balls: number;
    average: number;
    strikeRate: number;
    highestScore: number;
    centuries: number;
    halfCenturies: number;
    fours: number;
    sixes: number;
  };
  bowling: {
    overs: number;
    runs: number;
    wickets: number;
    average: number;
    economy: number;
    strikeRate: number;
    bestFigures: string;
    fiveWickets: number;
    fourWickets: number;
  };
  fielding: {
    catches: number;
    stumpings: number;
    runOuts: number;
    catchesPerMatch: number;
  };
  recentForm: {
    last5Matches: number[];
    formRating: 'Poor' | 'Average' | 'Good' | 'Excellent';
  };
  achievements: string[];
}

interface PlayerStatsProps {
  player: PlayerStats;
  onEdit: (playerId: string) => void;
  onViewMatches: (playerId: string) => void;
  onViewAchievements: (playerId: string) => void;
}

export function PlayerStats({ 
  player, 
  onEdit, 
  onViewMatches, 
  onViewAchievements 
}: PlayerStatsProps) {
  const colorScheme = useColorScheme();

  const getSkillColor = (level: string) => {
    switch (level) {
      case 'Professional': return '#2ed573';
      case 'Advanced': return '#ffa502';
      case 'Intermediate': return '#3742fa';
      case 'Beginner': return '#747d8c';
      default: return '#747d8c';
    }
  };

  const getFormColor = (rating: string) => {
    switch (rating) {
      case 'Excellent': return '#2ed573';
      case 'Good': return '#ffa502';
      case 'Average': return '#3742fa';
      case 'Poor': return '#ff4757';
      default: return '#747d8c';
    }
  };

  const formatOvers = (overs: number) => {
    const fullOvers = Math.floor(overs);
    const balls = Math.round((overs - fullOvers) * 6);
    return `${fullOvers}.${balls}`;
  };

  return (
    <View style={[styles.container, { 
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
      borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
    }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.playerInfo}>
          <Text style={[styles.playerName, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {player.name}
          </Text>
          <View style={styles.playerDetails}>
            <Text style={[styles.playerRole, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {player.role}
            </Text>
            <View style={[styles.skillBadge, { 
              backgroundColor: getSkillColor(player.skillLevel) 
            }]}>
              <Text style={styles.skillText}>
                {player.skillLevel}
              </Text>
            </View>
          </View>
          <Text style={[styles.playerStyle, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {player.battingStyle} • {player.bowlingStyle}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.actionButton, { 
              backgroundColor: Colors[colorScheme ?? 'light'].tint 
            }]}
            onPress={() => onEdit(player.id)}
          >
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Form */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          Recent Form
        </Text>
        <View style={styles.formContainer}>
          <View style={[styles.formBadge, { 
            backgroundColor: getFormColor(player.recentForm.formRating) 
          }]}>
            <Text style={styles.formText}>
              {player.recentForm.formRating}
            </Text>
          </View>
          <Text style={[styles.formDescription, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Last 5 matches: {player.recentForm.last5Matches.join(', ')}
          </Text>
        </View>
      </View>

      {/* Batting Stats */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          🏏 Batting Statistics
        </Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {player.batting.runs}
            </Text>
            <Text style={[styles.statLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Runs
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {player.batting.average.toFixed(1)}
            </Text>
            <Text style={[styles.statLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Average
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {player.batting.strikeRate.toFixed(1)}
            </Text>
            <Text style={[styles.statLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Strike Rate
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {player.batting.highestScore}
            </Text>
            <Text style={[styles.statLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Highest
            </Text>
          </View>
        </View>

        <View style={styles.additionalStats}>
          <View style={styles.additionalStatItem}>
            <Text style={[styles.additionalStatLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Centuries: {player.batting.centuries}
            </Text>
          </View>
          <View style={styles.additionalStatItem}>
            <Text style={[styles.additionalStatLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Half-Centuries: {player.batting.halfCenturies}
            </Text>
          </View>
          <View style={styles.additionalStatItem}>
            <Text style={[styles.additionalStatLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Fours: {player.batting.fours}
            </Text>
          </View>
          <View style={styles.additionalStatItem}>
            <Text style={[styles.additionalStatLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Sixes: {player.batting.sixes}
            </Text>
          </View>
        </View>
      </View>

      {/* Bowling Stats */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          🎯 Bowling Statistics
        </Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {player.bowling.wickets}
            </Text>
            <Text style={[styles.statLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Wickets
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {player.bowling.average.toFixed(1)}
            </Text>
            <Text style={[styles.statLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Average
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {player.bowling.economy.toFixed(1)}
            </Text>
            <Text style={[styles.statLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Economy
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {formatOvers(player.bowling.overs)}
            </Text>
            <Text style={[styles.statLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Overs
            </Text>
          </View>
        </View>

        <View style={styles.additionalStats}>
          <View style={styles.additionalStatItem}>
            <Text style={[styles.additionalStatLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Best Figures: {player.bowling.bestFigures}
            </Text>
          </View>
          <View style={styles.additionalStatItem}>
            <Text style={[styles.additionalStatLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              5-Wicket Hauls: {player.bowling.fiveWickets}
            </Text>
          </View>
          <View style={styles.additionalStatItem}>
            <Text style={[styles.additionalStatLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              4-Wicket Hauls: {player.bowling.fourWickets}
            </Text>
          </View>
        </View>
      </View>

      {/* Fielding Stats */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          🧤 Fielding Statistics
        </Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {player.fielding.catches}
            </Text>
            <Text style={[styles.statLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Catches
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {player.fielding.stumpings}
            </Text>
            <Text style={[styles.statLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Stumpings
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {player.fielding.runOuts}
            </Text>
            <Text style={[styles.statLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Run Outs
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {player.fielding.catchesPerMatch.toFixed(1)}
            </Text>
            <Text style={[styles.statLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Catches/Match
            </Text>
          </View>
        </View>
      </View>

      {/* Achievements */}
      {player.achievements.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            🏆 Achievements
          </Text>
          <View style={styles.achievementsList}>
            {player.achievements.map((achievement, index) => (
              <View key={index} style={[styles.achievementItem, { 
                backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa' 
              }]}>
                <Text style={[styles.achievementText, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  {achievement}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.viewButton, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
            borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
          }]}
          onPress={() => onViewMatches(player.id)}
        >
          <Text style={[styles.viewButtonText, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            View Matches
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.viewButton, { 
            backgroundColor: Colors[colorScheme ?? 'light'].tint 
          }]}
          onPress={() => onViewAchievements(player.id)}
        >
          <Text style={styles.viewButtonText}>
            View Achievements
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  playerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  playerRole: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  skillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  skillText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  playerStyle: {
    fontSize: 14,
    opacity: 0.7,
  },
  headerActions: {
    marginLeft: 12,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  formContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  formBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  formText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  formDescription: {
    fontSize: 14,
    opacity: 0.7,
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
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
  additionalStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  additionalStatItem: {
    flex: 1,
    minWidth: '45%',
  },
  additionalStatLabel: {
    fontSize: 14,
    opacity: 0.8,
  },
  achievementsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  achievementItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  achievementText: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  viewButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
