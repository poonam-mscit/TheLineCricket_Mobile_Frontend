import { Text } from '@/components/Themed';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface LiveScore {
  id: string;
  matchId: string;
  teamA: {
    name: string;
    score: number;
    wickets: number;
    overs: string;
    runRate: number;
    batsmen: {
      name: string;
      runs: number;
      balls: number;
      strikeRate: number;
      isStriker: boolean;
    }[];
    bowlers: {
      name: string;
      overs: string;
      runs: number;
      wickets: number;
      economy: number;
    }[];
  };
  teamB: {
    name: string;
    score: number;
    wickets: number;
    overs: string;
    runRate: number;
    batsmen: {
      name: string;
      runs: number;
      balls: number;
      strikeRate: number;
      isStriker: boolean;
    }[];
    bowlers: {
      name: string;
      overs: string;
      runs: number;
      wickets: number;
      economy: number;
    }[];
  };
  currentInnings: 'A' | 'B';
  matchStatus: 'live' | 'break' | 'ended';
  lastUpdate: Date;
  commentary: string;
  nextBatsman?: string;
  nextBowler?: string;
}

interface LiveScoreBoardProps {
  score: LiveScore;
  onViewFullScorecard: () => void;
  onViewCommentary: () => void;
  onViewStats: () => void;
  onShare: () => void;
  onRefresh: () => void;
}

export function LiveScoreBoard({ 
  score, 
  onViewFullScorecard, 
  onViewCommentary, 
  onViewStats, 
  onShare, 
  onRefresh 
}: LiveScoreBoardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const colorScheme = useColorScheme();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  const getStatusColor = () => {
    switch (score.matchStatus) {
      case 'live': return '#2ed573';
      case 'break': return '#ffa502';
      case 'ended': return '#ff4757';
      default: return '#747d8c';
    }
  };

  const getStatusText = () => {
    switch (score.matchStatus) {
      case 'live': return 'LIVE';
      case 'break': return 'BREAK';
      case 'ended': return 'ENDED';
      default: return 'UNKNOWN';
    }
  };

  const formatOvers = (overs: string) => {
    return overs;
  };

  const formatRunRate = (rate: number) => {
    return rate.toFixed(2);
  };

  const formatStrikeRate = (rate: number) => {
    return rate.toFixed(1);
  };

  const formatEconomy = (rate: number) => {
    return rate.toFixed(1);
  };

  const getCurrentTeam = () => {
    return score.currentInnings === 'A' ? score.teamA : score.teamB;
  };

  const getCurrentBatsmen = () => {
    const team = getCurrentTeam();
    return team.batsmen.filter(batsman => batsman.isStriker || batsman.name === team.batsmen[0]?.name);
  };

  const getCurrentBowlers = () => {
    const team = getCurrentTeam();
    return team.bowlers.slice(0, 2); // Show current and previous bowler
  };

  return (
    <View style={[styles.container, { 
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
      borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
    }]}>
      {/* Header */}
      <View style={[styles.header, { 
        backgroundColor: colorScheme === 'dark' ? '#2c2c2c' : '#f8f9fa'
      }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.statusBadge, { 
            backgroundColor: getStatusColor() 
          }]}>
            <Text style={styles.statusText}>
              {getStatusText()}
            </Text>
          </View>
          <Text style={[styles.lastUpdate, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Last updated: {score.lastUpdate.toLocaleTimeString()}
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={[styles.headerButton, { 
              backgroundColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
            }]}
            onPress={handleRefresh}
            disabled={isRefreshing}
          >
            <Text style={[styles.headerButtonText, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {isRefreshing ? '⏳' : '🔄'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.headerButton, { 
              backgroundColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
            }]}
            onPress={onShare}
          >
            <Text style={[styles.headerButtonText, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              📤
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Score Display */}
      <View style={[styles.scoreDisplay, { 
        backgroundColor: colorScheme === 'dark' ? '#2c2c2c' : '#f8f9fa'
      }]}>
        <View style={styles.teamScore}>
          <Text style={[styles.teamName, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {score.teamA.name}
          </Text>
          <Text style={[styles.teamScoreText, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {score.teamA.score}/{score.teamA.wickets}
          </Text>
          <Text style={[styles.teamOvers, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            ({formatOvers(score.teamA.overs)})
          </Text>
          <Text style={[styles.teamRunRate, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            RR: {formatRunRate(score.teamA.runRate)}
          </Text>
        </View>

        <View style={styles.vsContainer}>
          <Text style={[styles.vsText, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            VS
          </Text>
        </View>

        <View style={styles.teamScore}>
          <Text style={[styles.teamName, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {score.teamB.name}
          </Text>
          <Text style={[styles.teamScoreText, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {score.teamB.score}/{score.teamB.wickets}
          </Text>
          <Text style={[styles.teamOvers, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            ({formatOvers(score.teamB.overs)})
          </Text>
          <Text style={[styles.teamRunRate, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            RR: {formatRunRate(score.teamB.runRate)}
          </Text>
        </View>
      </View>

      {/* Current Batsmen */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          🏏 Current Batsmen
        </Text>
        
        <View style={[styles.batsmenContainer, { 
          backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
          borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
        }]}>
          {getCurrentBatsmen().map((batsman, index) => (
            <View key={index} style={styles.batsmanItem}>
              <View style={styles.batsmanInfo}>
                <Text style={[styles.batsmanName, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  {batsman.name}
                </Text>
                <Text style={[styles.batsmanStats, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  {batsman.runs}({batsman.balls}) • SR: {formatStrikeRate(batsman.strikeRate)}
                </Text>
              </View>
              {batsman.isStriker && (
                <View style={[styles.strikerBadge, { 
                  backgroundColor: Colors[colorScheme ?? 'light'].tint 
                }]}>
                  <Text style={styles.strikerText}>*</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Current Bowlers */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          🎯 Current Bowlers
        </Text>
        
        <View style={[styles.bowlersContainer, { 
          backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
          borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
        }]}>
          {getCurrentBowlers().map((bowler, index) => (
            <View key={index} style={styles.bowlerItem}>
              <Text style={[styles.bowlerName, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                {bowler.name}
              </Text>
              <Text style={[styles.bowlerStats, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                {formatOvers(bowler.overs)} • {bowler.runs}/{bowler.wickets} • ER: {formatEconomy(bowler.economy)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Commentary */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          📝 Live Commentary
        </Text>
        
        <View style={[styles.commentaryContainer, { 
          backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
          borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
        }]}>
          <Text style={[styles.commentaryText, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {score.commentary}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
            borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
          }]}
          onPress={onViewFullScorecard}
        >
          <Text style={[styles.actionButtonText, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            📊 Full Scorecard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
            borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
          }]}
          onPress={onViewCommentary}
        >
          <Text style={[styles.actionButtonText, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            📝 Commentary
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, { 
            backgroundColor: Colors[colorScheme ?? 'light'].tint 
          }]}
          onPress={onViewStats}
        >
          <Text style={styles.actionButtonText}>
            📈 Statistics
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  lastUpdate: {
    fontSize: 12,
    opacity: 0.7,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    fontSize: 16,
  },
  scoreDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  teamScore: {
    alignItems: 'center',
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  teamScoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  teamOvers: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  teamRunRate: {
    fontSize: 12,
    opacity: 0.6,
  },
  vsContainer: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  vsText: {
    fontSize: 16,
    fontWeight: 'bold',
    opacity: 0.6,
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  batsmenContainer: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  batsmanItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  batsmanInfo: {
    flex: 1,
  },
  batsmanName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  batsmanStats: {
    fontSize: 12,
    opacity: 0.7,
  },
  strikerBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  strikerText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bowlersContainer: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  bowlerItem: {
    marginBottom: 8,
  },
  bowlerName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  bowlerStats: {
    fontSize: 12,
    opacity: 0.7,
  },
  commentaryContainer: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  commentaryText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
