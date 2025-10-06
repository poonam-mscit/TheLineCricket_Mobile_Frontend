import { Text } from '@/components/Themed';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface AnalyticsData {
  id: string;
  period: 'today' | 'week' | 'month' | 'year' | 'all';
  matches: {
    total: number;
    played: number;
    won: number;
    lost: number;
    winRate: number;
  };
  performance: {
    totalRuns: number;
    totalWickets: number;
    averageScore: number;
    bestScore: number;
    strikeRate: number;
    economy: number;
  };
  engagement: {
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    engagementRate: number;
  };
  social: {
    followers: number;
    following: number;
    posts: number;
    interactions: number;
    growthRate: number;
  };
  trends: {
    performanceTrend: 'up' | 'down' | 'stable';
    engagementTrend: 'up' | 'down' | 'stable';
    socialTrend: 'up' | 'down' | 'stable';
  };
  achievements: {
    milestones: number;
    records: number;
    awards: number;
    rankings: number;
  };
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
  onViewDetailedAnalytics: (type: string) => void;
  onExportData: (format: string) => void;
  onShareReport: () => void;
  onSetPeriod: (period: string) => void;
  onViewTrends: () => void;
  onViewAchievements: () => void;
}

export function AnalyticsDashboard({ 
  data, 
  onViewDetailedAnalytics, 
  onExportData, 
  onShareReport, 
  onSetPeriod, 
  onViewTrends, 
  onViewAchievements 
}: AnalyticsDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(data.period);
  const [isLoading, setIsLoading] = useState(false);
  
  const colorScheme = useColorScheme();
  const screenWidth = Dimensions.get('window').width;

  const periods = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'year', label: 'This Year' },
    { key: 'all', label: 'All Time' }
  ];

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period as any);
    onSetPeriod(period);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return '#2ed573';
      case 'down': return '#ff4757';
      case 'stable': return '#3742fa';
      default: return Colors[colorScheme ?? 'light'].text;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatPercentage = (num: number) => {
    return num.toFixed(1) + '%';
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
            Analytics Dashboard
          </Text>
          <Text style={[styles.headerSubtitle, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            Performance Overview
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={[styles.headerButton, { 
              backgroundColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
            }]}
            onPress={() => onExportData('pdf')}
          >
            <Text style={styles.headerButtonText}>📊</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.headerButton, { 
              backgroundColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
            }]}
            onPress={onShareReport}
          >
            <Text style={styles.headerButtonText}>📤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Period Selector */}
      <View style={[styles.periodSelector, { 
        backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
        borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
      }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                { 
                  backgroundColor: selectedPeriod === period.key 
                    ? Colors[colorScheme ?? 'light'].tint 
                    : 'transparent',
                  borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
                }
              ]}
              onPress={() => handlePeriodChange(period.key)}
            >
              <Text style={[
                styles.periodButtonText,
                { 
                  color: selectedPeriod === period.key ? 'white' : Colors[colorScheme ?? 'light'].text 
                }
              ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Match Performance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            🏏 Match Performance
          </Text>
          
          <View style={[styles.metricsGrid, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
            borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
          }]}>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                {data.matches.total}
              </Text>
              <Text style={[styles.metricLabel, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Total Matches
              </Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: '#2ed573' }]}>
                {data.matches.won}
              </Text>
              <Text style={[styles.metricLabel, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Wins
              </Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: '#ff4757' }]}>
                {data.matches.lost}
              </Text>
              <Text style={[styles.metricLabel, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Losses
              </Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                {formatPercentage(data.matches.winRate)}
              </Text>
              <Text style={[styles.metricLabel, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Win Rate
              </Text>
            </View>
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            📊 Performance Metrics
          </Text>
          
          <View style={[styles.metricsGrid, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
            borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
          }]}>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                {formatNumber(data.performance.totalRuns)}
              </Text>
              <Text style={[styles.metricLabel, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Total Runs
              </Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                {formatNumber(data.performance.totalWickets)}
              </Text>
              <Text style={[styles.metricLabel, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Total Wickets
              </Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                {data.performance.averageScore.toFixed(1)}
              </Text>
              <Text style={[styles.metricLabel, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Average Score
              </Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                {data.performance.bestScore}
              </Text>
              <Text style={[styles.metricLabel, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Best Score
              </Text>
            </View>
          </View>
        </View>

        {/* Engagement Metrics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            💬 Engagement Metrics
          </Text>
          
          <View style={[styles.metricsGrid, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
            borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
          }]}>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                {formatNumber(data.engagement.totalViews)}
              </Text>
              <Text style={[styles.metricLabel, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Total Views
              </Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                {formatNumber(data.engagement.totalLikes)}
              </Text>
              <Text style={[styles.metricLabel, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Total Likes
              </Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                {formatNumber(data.engagement.totalComments)}
              </Text>
              <Text style={[styles.metricLabel, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Total Comments
              </Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                {formatPercentage(data.engagement.engagementRate)}
              </Text>
              <Text style={[styles.metricLabel, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Engagement Rate
              </Text>
            </View>
          </View>
        </View>

        {/* Social Metrics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            👥 Social Metrics
          </Text>
          
          <View style={[styles.metricsGrid, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
            borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
          }]}>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                {formatNumber(data.social.followers)}
              </Text>
              <Text style={[styles.metricLabel, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Followers
              </Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                {formatNumber(data.social.following)}
              </Text>
              <Text style={[styles.metricLabel, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Following
              </Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                {formatNumber(data.social.posts)}
              </Text>
              <Text style={[styles.metricLabel, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Posts
              </Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { 
                color: getTrendColor(data.trends.socialTrend) 
              }]}>
                {getTrendIcon(data.trends.socialTrend)}
              </Text>
              <Text style={[styles.metricLabel, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Growth Trend
              </Text>
            </View>
          </View>
        </View>

        {/* Trends Overview */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            📈 Trends Overview
          </Text>
          
          <View style={[styles.trendsContainer, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
            borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
          }]}>
            <View style={styles.trendItem}>
              <View style={styles.trendLeft}>
                <Text style={[styles.trendLabel, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  Performance
                </Text>
                <Text style={[styles.trendDescription, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  Match performance trend
                </Text>
              </View>
              <View style={styles.trendRight}>
                <Text style={[styles.trendIcon, { 
                  color: getTrendColor(data.trends.performanceTrend) 
                }]}>
                  {getTrendIcon(data.trends.performanceTrend)}
                </Text>
              </View>
            </View>
            
            <View style={styles.trendItem}>
              <View style={styles.trendLeft}>
                <Text style={[styles.trendLabel, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  Engagement
                </Text>
                <Text style={[styles.trendDescription, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  User engagement trend
                </Text>
              </View>
              <View style={styles.trendRight}>
                <Text style={[styles.trendIcon, { 
                  color: getTrendColor(data.trends.engagementTrend) 
                }]}>
                  {getTrendIcon(data.trends.engagementTrend)}
                </Text>
              </View>
            </View>
            
            <View style={styles.trendItem}>
              <View style={styles.trendLeft}>
                <Text style={[styles.trendLabel, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  Social
                </Text>
                <Text style={[styles.trendDescription, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  Social media growth
                </Text>
              </View>
              <View style={styles.trendRight}>
                <Text style={[styles.trendIcon, { 
                  color: getTrendColor(data.trends.socialTrend) 
                }]}>
                  {getTrendIcon(data.trends.socialTrend)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            🏆 Achievements
          </Text>
          
          <View style={[styles.achievementsContainer, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
            borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
          }]}>
            <View style={styles.achievementItem}>
              <Text style={[styles.achievementValue, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                {data.achievements.milestones}
              </Text>
              <Text style={[styles.achievementLabel, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Milestones
              </Text>
            </View>
            
            <View style={styles.achievementItem}>
              <Text style={[styles.achievementValue, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                {data.achievements.records}
              </Text>
              <Text style={[styles.achievementLabel, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Records
              </Text>
            </View>
            
            <View style={styles.achievementItem}>
              <Text style={[styles.achievementValue, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                {data.achievements.awards}
              </Text>
              <Text style={[styles.achievementLabel, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Awards
              </Text>
            </View>
            
            <View style={styles.achievementItem}>
              <Text style={[styles.achievementValue, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                {data.achievements.rankings}
              </Text>
              <Text style={[styles.achievementLabel, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                Rankings
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
            borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
          }]}
          onPress={() => onViewDetailedAnalytics('matches')}
        >
          <Text style={[styles.actionButtonText, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            📊 Match Analytics
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
            borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
          }]}
          onPress={() => onViewDetailedAnalytics('players')}
        >
          <Text style={[styles.actionButtonText, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            👤 Player Analytics
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, { 
            backgroundColor: Colors[colorScheme ?? 'light'].tint 
          }]}
          onPress={onViewTrends}
        >
          <Text style={styles.actionButtonText}>
            📈 View Trends
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
  periodSelector: {
    padding: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  metricItem: {
    width: '50%',
    alignItems: 'center',
    marginBottom: 16,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
  trendsContainer: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  trendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendLeft: {
    flex: 1,
  },
  trendLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  trendDescription: {
    fontSize: 12,
    opacity: 0.7,
  },
  trendRight: {
    marginLeft: 12,
  },
  trendIcon: {
    fontSize: 24,
  },
  achievementsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  achievementItem: {
    alignItems: 'center',
  },
  achievementValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  achievementLabel: {
    fontSize: 12,
    opacity: 0.7,
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
