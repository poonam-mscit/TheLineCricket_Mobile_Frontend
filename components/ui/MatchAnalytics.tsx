import { Text } from '@/components/Themed';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface MatchAnalyticsData {
  id: string;
  matchId: string;
  matchName: string;
  date: Date;
  type: 'T20' | 'ODI' | 'Test' | 'Practice' | 'Tournament';
  status: 'completed' | 'ongoing' | 'upcoming';
  teams: {
    teamA: {
      name: string;
      score: number;
      wickets: number;
      overs: string;
      runRate: number;
    };
    teamB: {
      name: string;
      score: number;
      wickets: number;
      overs: string;
      runRate: number;
    };
  };
  winner: string;
  margin: string;
  keyMoments: {
    id: string;
    over: string;
    description: string;
    type: 'wicket' | 'boundary' | 'six' | 'milestone' | 'partnership';
    importance: 'low' | 'medium' | 'high' | 'critical';
  }[];
  topPerformers: {
    batsmen: {
      name: string;
      runs: number;
      balls: number;
      strikeRate: number;
      fours: number;
      sixes: number;
    }[];
    bowlers: {
      name: string;
      overs: string;
      runs: number;
      wickets: number;
      economy: number;
    }[];
  };
  statistics: {
    totalRuns: number;
    totalWickets: number;
    totalOvers: string;
    runRate: number;
    boundaryCount: number;
    sixCount: number;
    extras: number;
  };
  partnerships: {
    wicket: number;
    runs: number;
    balls: number;
    batsmen: string[];
  }[];
  fallOfWickets: {
    wicket: number;
    score: number;
    over: string;
    batsman: string;
    bowler: string;
  }[];
}

interface MatchAnalyticsProps {
  analytics: MatchAnalyticsData;
  onViewDetailedStats: (type: string) => void;
  onViewKeyMoments: () => void;
  onViewTopPerformers: () => void;
  onViewPartnerships: () => void;
  onViewFallOfWickets: () => void;
  onExportMatchReport: () => void;
  onShareMatch: () => void;
}

export function MatchAnalytics({ 
  analytics, 
  onViewDetailedStats, 
  onViewKeyMoments, 
  onViewTopPerformers, 
  onViewPartnerships, 
  onViewFallOfWickets, 
  onExportMatchReport, 
  onShareMatch 
}: MatchAnalyticsProps) {
  const [selectedTab, setSelectedTab] = useState('overview');
  const colorScheme = useColorScheme();

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'moments', label: 'Key Moments' },
    { key: 'performers', label: 'Top Performers' },
    { key: 'partnerships', label: 'Partnerships' },
    { key: 'wickets', label: 'Fall of Wickets' }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'wicket': return '#ff4757';
      case 'boundary': return '#2ed573';
      case 'six': return '#ffa502';
      case 'milestone': return '#3742fa';
      case 'partnership': return '#747d8c';
      default: return Colors[colorScheme ?? 'light'].text;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'wicket': return '🎯';
      case 'boundary': return '🏏';
      case 'six': return '🔥';
      case 'milestone': return '🏆';
      case 'partnership': return '🤝';
      default: return '⚪';
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical': return '#ff4757';
      case 'high': return '#ffa502';
      case 'medium': return '#3742fa';
      case 'low': return '#747d8c';
      default: return Colors[colorScheme ?? 'light'].text;
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

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {/* Match Summary */}
      <View style={[styles.matchSummary, { 
        backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
        borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
      }]}>
        <View style={styles.matchHeader}>
          <Text style={[styles.matchName, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {analytics.matchName}
          </Text>
          <Text style={[styles.matchDate, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {analytics.date.toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.matchResult}>
          <View style={styles.teamResult}>
            <Text style={[styles.teamName, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {analytics.teams.teamA.name}
            </Text>
            <Text style={[styles.teamScore, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {analytics.teams.teamA.score}/{analytics.teams.teamA.wickets}
            </Text>
            <Text style={[styles.teamOvers, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              ({formatOvers(analytics.teams.teamA.overs)})
            </Text>
          </View>

          <View style={styles.vsContainer}>
            <Text style={[styles.vsText, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              VS
            </Text>
          </View>

          <View style={styles.teamResult}>
            <Text style={[styles.teamName, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {analytics.teams.teamB.name}
            </Text>
            <Text style={[styles.teamScore, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {analytics.teams.teamB.score}/{analytics.teams.teamB.wickets}
            </Text>
            <Text style={[styles.teamOvers, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              ({formatOvers(analytics.teams.teamB.overs)})
            </Text>
          </View>
        </View>

        <View style={styles.matchWinner}>
          <Text style={[styles.winnerText, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Winner: {analytics.winner}
          </Text>
          <Text style={[styles.marginText, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {analytics.margin}
          </Text>
        </View>
      </View>

      {/* Key Statistics */}
      <View style={[styles.statisticsGrid, { 
        backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
        borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
      }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {analytics.statistics.totalRuns}
          </Text>
          <Text style={[styles.statLabel, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Total Runs
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {analytics.statistics.totalWickets}
          </Text>
          <Text style={[styles.statLabel, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Total Wickets
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {formatOvers(analytics.statistics.totalOvers)}
          </Text>
          <Text style={[styles.statLabel, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Total Overs
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {formatRunRate(analytics.statistics.runRate)}
          </Text>
          <Text style={[styles.statLabel, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Run Rate
          </Text>
        </View>
      </View>
    </View>
  );

  const renderKeyMoments = () => (
    <View style={styles.tabContent}>
      <FlatList
        data={analytics.keyMoments}
        renderItem={({ item }) => (
          <View style={[styles.momentItem, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
            borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
          }]}>
            <View style={styles.momentHeader}>
              <View style={styles.momentLeft}>
                <Text style={styles.momentIcon}>
                  {getTypeIcon(item.type)}
                </Text>
                <Text style={[styles.momentOver, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  {item.over}
                </Text>
              </View>
              
              <View style={[styles.importanceBadge, { 
                backgroundColor: getImportanceColor(item.importance) 
              }]}>
                <Text style={styles.importanceText}>
                  {item.importance.toUpperCase()}
                </Text>
              </View>
            </View>
            
            <Text style={[styles.momentDescription, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {item.description}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderTopPerformers = () => (
    <View style={styles.tabContent}>
      {/* Top Batsmen */}
      <View style={styles.performersSection}>
        <Text style={[styles.performersTitle, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          🏏 Top Batsmen
        </Text>
        
        <View style={[styles.performersList, { 
          backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
          borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
        }]}>
          {analytics.topPerformers.batsmen.map((batsman, index) => (
            <View key={index} style={styles.performerItem}>
              <View style={styles.performerInfo}>
                <Text style={[styles.performerName, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  {batsman.name}
                </Text>
                <Text style={[styles.performerStats, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  {batsman.runs}({batsman.balls}) • SR: {formatStrikeRate(batsman.strikeRate)}
                </Text>
                <Text style={[styles.performerDetails, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  {batsman.fours} fours • {batsman.sixes} sixes
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Top Bowlers */}
      <View style={styles.performersSection}>
        <Text style={[styles.performersTitle, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          🎯 Top Bowlers
        </Text>
        
        <View style={[styles.performersList, { 
          backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
          borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
        }]}>
          {analytics.topPerformers.bowlers.map((bowler, index) => (
            <View key={index} style={styles.performerItem}>
              <View style={styles.performerInfo}>
                <Text style={[styles.performerName, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  {bowler.name}
                </Text>
                <Text style={[styles.performerStats, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  {formatOvers(bowler.overs)} • {bowler.runs}/{bowler.wickets}
                </Text>
                <Text style={[styles.performerDetails, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  ER: {formatEconomy(bowler.economy)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderPartnerships = () => (
    <View style={styles.tabContent}>
      <FlatList
        data={analytics.partnerships}
        renderItem={({ item }) => (
          <View style={[styles.partnershipItem, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
            borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
          }]}>
            <View style={styles.partnershipHeader}>
              <Text style={[styles.partnershipWicket, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Wicket {item.wicket}
              </Text>
              <Text style={[styles.partnershipRuns, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                {item.runs} runs
              </Text>
            </View>
            
            <Text style={[styles.partnershipBatsmen, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {item.batsmen.join(' & ')}
            </Text>
            
            <Text style={[styles.partnershipBalls, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {item.balls} balls
            </Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderFallOfWickets = () => (
    <View style={styles.tabContent}>
      <FlatList
        data={analytics.fallOfWickets}
        renderItem={({ item }) => (
          <View style={[styles.wicketItem, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
            borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
          }]}>
            <View style={styles.wicketHeader}>
              <Text style={[styles.wicketNumber, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Wicket {item.wicket}
              </Text>
              <Text style={[styles.wicketScore, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                {item.score}
              </Text>
            </View>
            
            <Text style={[styles.wicketOver, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {item.over}
            </Text>
            
            <Text style={[styles.wicketBatsman, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {item.batsman} b {item.bowler}
            </Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview': return renderOverview();
      case 'moments': return renderKeyMoments();
      case 'performers': return renderTopPerformers();
      case 'partnerships': return renderPartnerships();
      case 'wickets': return renderFallOfWickets();
      default: return renderOverview();
    }
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
          <Text style={[styles.headerTitle, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Match Analytics
          </Text>
          <Text style={[styles.headerSubtitle, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {analytics.matchName}
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={[styles.headerButton, { 
              backgroundColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
            }]}
            onPress={onExportMatchReport}
          >
            <Text style={styles.headerButtonText}>📊</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.headerButton, { 
              backgroundColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
            }]}
            onPress={onShareMatch}
          >
            <Text style={styles.headerButtonText}>📤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabsContainer, { 
        backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
        borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
      }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabButton,
                { 
                  backgroundColor: selectedTab === tab.key 
                    ? Colors[colorScheme ?? 'light'].tint 
                    : 'transparent',
                  borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
                }
              ]}
              onPress={() => setSelectedTab(tab.key)}
            >
              <Text style={[
                styles.tabButtonText,
                { 
                  color: selectedTab === tab.key ? 'white' : Colors[colorScheme ?? 'light'].text 
                }
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
            borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
          }]}
          onPress={() => onViewDetailedStats('batting')}
        >
          <Text style={[styles.actionButtonText, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            🏏 Batting Stats
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
            borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
          }]}
          onPress={() => onViewDetailedStats('bowling')}
        >
          <Text style={[styles.actionButtonText, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            🎯 Bowling Stats
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, { 
            backgroundColor: Colors[colorScheme ?? 'light'].tint 
          }]}
          onPress={onViewKeyMoments}
        >
          <Text style={styles.actionButtonText}>
            ⭐ Key Moments
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    fontSize: 16,
  },
  tabsContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  matchSummary: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  matchHeader: {
    marginBottom: 16,
  },
  matchName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  matchDate: {
    fontSize: 14,
    opacity: 0.7,
  },
  matchResult: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  teamResult: {
    alignItems: 'center',
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  teamScore: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  teamOvers: {
    fontSize: 14,
    opacity: 0.7,
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
  matchWinner: {
    alignItems: 'center',
  },
  winnerText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  marginText: {
    fontSize: 14,
    opacity: 0.7,
  },
  statisticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
  momentItem: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
  },
  momentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  momentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  momentIcon: {
    fontSize: 16,
  },
  momentOver: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  importanceBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  importanceText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  momentDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  performersSection: {
    marginBottom: 16,
  },
  performersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  performersList: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  performerItem: {
    marginBottom: 8,
  },
  performerInfo: {
    flex: 1,
  },
  performerName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  performerStats: {
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 2,
  },
  performerDetails: {
    fontSize: 12,
    opacity: 0.6,
  },
  partnershipItem: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
  },
  partnershipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  partnershipWicket: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  partnershipRuns: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  partnershipBatsmen: {
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 2,
  },
  partnershipBalls: {
    fontSize: 12,
    opacity: 0.6,
  },
  wicketItem: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
  },
  wicketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  wicketNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  wicketScore: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  wicketOver: {
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 2,
  },
  wicketBatsman: {
    fontSize: 12,
    opacity: 0.6,
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
