import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import { getColors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface UserStats {
  posts: number;
  matches: number;
  followers: number;
  following: number;
  wins: number;
  losses: number;
  winRate: number;
  totalRuns: number;
  totalWickets: number;
  bestScore: number;
  bestBowling: string;
  achievements: number;
}

interface UserStatsCardProps {
  stats: UserStats;
  onStatPress?: (statType: string) => void;
}

export function UserStatsCard({ stats, onStatPress }: UserStatsCardProps) {
  const colorScheme = useColorScheme();

  const handleStatPress = (statType: string) => {
    onStatPress?.(statType);
  };

  const getWinRateColor = (rate: number) => {
    if (rate >= 70) return '#2ed573';
    if (rate >= 50) return '#ffa502';
    return '#ff4757';
  };

  return (
    <View style={[styles.container, { 
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
      borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
    }]}>
      {/* Main Stats */}
      <View style={styles.mainStats}>
        <TouchableOpacity 
          style={styles.statItem}
          onPress={() => handleStatPress('posts')}
        >
          <Text style={[styles.statNumber, { 
            color: getColors(colorScheme).text 
          }]}>
            {stats.posts}
          </Text>
          <Text style={[styles.statLabel, { 
            color: getColors(colorScheme).text 
          }]}>
            Posts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.statItem}
          onPress={() => handleStatPress('matches')}
        >
          <Text style={[styles.statNumber, { 
            color: getColors(colorScheme).text 
          }]}>
            {stats.matches}
          </Text>
          <Text style={[styles.statLabel, { 
            color: getColors(colorScheme).text 
          }]}>
            Matches
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.statItem}
          onPress={() => handleStatPress('followers')}
        >
          <Text style={[styles.statNumber, { 
            color: getColors(colorScheme).text 
          }]}>
            {stats.followers}
          </Text>
          <Text style={[styles.statLabel, { 
            color: getColors(colorScheme).text 
          }]}>
            Followers
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.statItem}
          onPress={() => handleStatPress('following')}
        >
          <Text style={[styles.statNumber, { 
            color: getColors(colorScheme).text 
          }]}>
            {stats.following}
          </Text>
          <Text style={[styles.statLabel, { 
            color: getColors(colorScheme).text 
          }]}>
            Following
          </Text>
        </TouchableOpacity>
      </View>

      {/* Match Record */}
      <View style={styles.recordSection}>
        <Text style={[styles.sectionTitle, { 
          color: getColors(colorScheme).text 
        }]}>
          Match Record
        </Text>
        <View style={styles.recordStats}>
          <View style={styles.recordItem}>
            <Text style={[styles.recordNumber, { color: '#2ed573' }]}>
              {stats.wins}
            </Text>
            <Text style={[styles.recordLabel, { 
              color: getColors(colorScheme).text 
            }]}>
              Wins
            </Text>
          </View>
          
          <View style={styles.recordItem}>
            <Text style={[styles.recordNumber, { color: '#ff4757' }]}>
              {stats.losses}
            </Text>
            <Text style={[styles.recordLabel, { 
              color: getColors(colorScheme).text 
            }]}>
              Losses
            </Text>
          </View>
          
          <View style={styles.recordItem}>
            <Text style={[styles.recordNumber, { 
              color: getWinRateColor(stats.winRate) 
            }]}>
              {stats.winRate}%
            </Text>
            <Text style={[styles.recordLabel, { 
              color: getColors(colorScheme).text 
            }]}>
              Win Rate
            </Text>
          </View>
        </View>
      </View>

      {/* Performance Stats */}
      <View style={styles.performanceSection}>
        <Text style={[styles.sectionTitle, { 
          color: getColors(colorScheme).text 
        }]}>
          Performance
        </Text>
        <View style={styles.performanceStats}>
          <View style={styles.performanceItem}>
            <Text style={[styles.performanceLabel, { 
              color: getColors(colorScheme).text 
            }]}>
              Total Runs
            </Text>
            <Text style={[styles.performanceValue, { 
              color: getColors(colorScheme).text 
            }]}>
              {stats.totalRuns}
            </Text>
          </View>
          
          <View style={styles.performanceItem}>
            <Text style={[styles.performanceLabel, { 
              color: getColors(colorScheme).text 
            }]}>
              Total Wickets
            </Text>
            <Text style={[styles.performanceValue, { 
              color: getColors(colorScheme).text 
            }]}>
              {stats.totalWickets}
            </Text>
          </View>
        </View>
        
        <View style={styles.performanceStats}>
          <View style={styles.performanceItem}>
            <Text style={[styles.performanceLabel, { 
              color: getColors(colorScheme).text 
            }]}>
              Best Score
            </Text>
            <Text style={[styles.performanceValue, { 
              color: getColors(colorScheme).text 
            }]}>
              {stats.bestScore}
            </Text>
          </View>
          
          <View style={styles.performanceItem}>
            <Text style={[styles.performanceLabel, { 
              color: getColors(colorScheme).text 
            }]}>
              Best Bowling
            </Text>
            <Text style={[styles.performanceValue, { 
              color: getColors(colorScheme).text 
            }]}>
              {stats.bestBowling}
            </Text>
          </View>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.achievementsSection}>
        <Text style={[styles.sectionTitle, { 
          color: getColors(colorScheme).text 
        }]}>
          🏆 Achievements
        </Text>
        <View style={styles.achievementsContainer}>
          <Text style={[styles.achievementsCount, { 
            color: getColors(colorScheme).text 
          }]}>
            {stats.achievements} achievements unlocked
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
  mainStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  recordSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  recordStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  recordItem: {
    alignItems: 'center',
  },
  recordNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recordLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  performanceSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  performanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  performanceItem: {
    flex: 1,
    alignItems: 'center',
  },
  performanceLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  performanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementsSection: {
    paddingTop: 16,
  },
  achievementsContainer: {
    alignItems: 'center',
  },
  achievementsCount: {
    fontSize: 14,
    opacity: 0.7,
  },
});
