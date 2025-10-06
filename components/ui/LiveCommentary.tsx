import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface CommentaryEntry {
  id: string;
  timestamp: Date;
  over: string;
  ball: number;
  runs: number;
  wickets: number;
  commentary: string;
  type: 'ball' | 'over' | 'wicket' | 'boundary' | 'milestone' | 'break';
  importance: 'low' | 'medium' | 'high' | 'critical';
  expert: {
    name: string;
    role: 'commentator' | 'analyst' | 'expert' | 'umpire';
    avatar?: string;
  };
  ballDetails?: {
    delivery: 'fast' | 'medium' | 'spin' | 'slow';
    line: 'off' | 'leg' | 'middle' | 'wide' | 'no-ball';
    length: 'full' | 'good' | 'short' | 'bouncer' | 'yorker';
    shot: 'defensive' | 'aggressive' | 'sweep' | 'pull' | 'cut' | 'drive';
    result: 'dot' | 'single' | 'double' | 'triple' | 'boundary' | 'six' | 'wicket';
  };
  statistics?: {
    runRate: number;
    requiredRate: number;
    partnership: number;
    lastWicket: number;
  };
  isHighlighted?: boolean;
  isPinned?: boolean;
}

interface LiveCommentaryProps {
  matchId: string;
  isLive: boolean;
  onViewFullCommentary: () => void;
  onViewExpertProfile: (expertId: string) => void;
  onHighlightCommentary: (commentaryId: string) => void;
  onPinCommentary: (commentaryId: string) => void;
  onShareCommentary: (commentaryId: string) => void;
  onViewStatistics: () => void;
  onViewBallByBall: () => void;
}

export function LiveCommentary({ 
  matchId, 
  isLive, 
  onViewFullCommentary, 
  onViewExpertProfile, 
  onHighlightCommentary, 
  onPinCommentary, 
  onShareCommentary, 
  onViewStatistics, 
  onViewBallByBall 
}: LiveCommentaryProps) {
  const [commentary, setCommentary] = useState<CommentaryEntry[]>([]);
  const [selectedOver, setSelectedOver] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Simulate receiving new commentary
    const interval = setInterval(() => {
      if (isLive && Math.random() > 0.6) {
        const newEntry: CommentaryEntry = generateRandomCommentary();
        setCommentary(prev => [newEntry, ...prev]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  const generateRandomCommentary = (): CommentaryEntry => {
    const commentaries = [
      'Beautiful cover drive! The ball races to the boundary.',
      'Excellent fielding! Saved a certain boundary.',
      'What a catch! The fielder dives to his right and takes it.',
      'Six! The ball sails over the long-on boundary.',
      'Good length delivery, defended back to the bowler.',
      'Wide delivery, the batsman leaves it alone.',
      'Appeal for LBW! The umpire says not out.',
      'Great partnership building here.',
      'The required run rate is climbing.',
      'Strategic timeout called by the batting team.'
    ];

    const experts = [
      { name: 'Ravi Shastri', role: 'commentator' as const },
      { name: 'Harsha Bhogle', role: 'analyst' as const },
      { name: 'Sunil Gavaskar', role: 'expert' as const },
      { name: 'Simon Taufel', role: 'umpire' as const }
    ];

    const types: CommentaryEntry['type'][] = ['ball', 'over', 'wicket', 'boundary', 'milestone', 'break'];
    const importance: CommentaryEntry['importance'][] = ['low', 'medium', 'high', 'critical'];

    return {
      id: Date.now().toString(),
      timestamp: new Date(),
      over: `${Math.floor(Math.random() * 20) + 1}.${Math.floor(Math.random() * 6)}`,
      ball: Math.floor(Math.random() * 6) + 1,
      runs: Math.floor(Math.random() * 7),
      wickets: Math.floor(Math.random() * 2),
      commentary: commentaries[Math.floor(Math.random() * commentaries.length)],
      type: types[Math.floor(Math.random() * types.length)],
      importance: importance[Math.floor(Math.random() * importance.length)],
      expert: experts[Math.floor(Math.random() * experts.length)],
      ballDetails: {
        delivery: ['fast', 'medium', 'spin', 'slow'][Math.floor(Math.random() * 4)] as any,
        line: ['off', 'leg', 'middle', 'wide', 'no-ball'][Math.floor(Math.random() * 5)] as any,
        length: ['full', 'good', 'short', 'bouncer', 'yorker'][Math.floor(Math.random() * 5)] as any,
        shot: ['defensive', 'aggressive', 'sweep', 'pull', 'cut', 'drive'][Math.floor(Math.random() * 6)] as any,
        result: ['dot', 'single', 'double', 'triple', 'boundary', 'six', 'wicket'][Math.floor(Math.random() * 7)] as any
      },
      statistics: {
        runRate: Math.random() * 6 + 4,
        requiredRate: Math.random() * 8 + 6,
        partnership: Math.floor(Math.random() * 100) + 20,
        lastWicket: Math.floor(Math.random() * 50) + 10
      }
    };
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'wicket': return '#ff4757';
      case 'boundary': return '#2ed573';
      case 'six': return '#ffa502';
      case 'milestone': return '#3742fa';
      case 'break': return '#747d8c';
      default: return Colors[colorScheme ?? 'light'].text;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'wicket': return '🎯';
      case 'boundary': return '🏏';
      case 'six': return '🔥';
      case 'milestone': return '🏆';
      case 'break': return '⏸️';
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'commentator': return '#2ed573';
      case 'analyst': return '#3742fa';
      case 'expert': return '#ffa502';
      case 'umpire': return '#ff4757';
      default: return Colors[colorScheme ?? 'light'].text;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'commentator': return '🎤';
      case 'analyst': return '📊';
      case 'expert': return '👨‍💼';
      case 'umpire': return '👨‍⚖️';
      default: return '👤';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const filteredCommentary = commentary.filter(entry => {
    if (selectedOver !== 'all' && !entry.over.startsWith(selectedOver)) return false;
    if (filterType !== 'all' && entry.type !== filterType) return false;
    return true;
  });

  const renderCommentaryEntry = ({ item }: { item: CommentaryEntry }) => (
    <View style={[styles.commentaryEntry, { 
      backgroundColor: item.isHighlighted ? 'rgba(46, 213, 115, 0.1)' : 'transparent',
      borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
    }]}>
      <View style={[styles.commentaryHeader, { 
        backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa'
      }]}>
        <View style={styles.commentaryLeft}>
          <View style={styles.commentaryMeta}>
            <Text style={[styles.overText, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {item.over}
            </Text>
            <Text style={[styles.ballText, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Ball {item.ball}
            </Text>
            <Text style={[styles.timeText, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {formatTime(item.timestamp)}
            </Text>
          </View>
          
          <View style={styles.commentaryType}>
            <Text style={styles.typeIcon}>
              {getTypeIcon(item.type)}
            </Text>
            <Text style={[styles.typeText, { 
              color: getTypeColor(item.type) 
            }]}>
              {item.type.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.commentaryRight}>
          <View style={[styles.importanceBadge, { 
            backgroundColor: getImportanceColor(item.importance) 
          }]}>
            <Text style={styles.importanceText}>
              {item.importance.toUpperCase()}
            </Text>
          </View>
          
          {item.isPinned && (
            <Text style={styles.pinnedIcon}>📌</Text>
          )}
        </View>
      </View>

      <View style={styles.commentaryContent}>
        <Text style={[styles.commentaryText, { 
          color: Colors[colorScheme ?? 'light'].text 
        }]}>
          {item.commentary}
        </Text>

        {item.ballDetails && (
          <View style={[styles.ballDetails, { 
            backgroundColor: colorScheme === 'dark' ? '#444' : '#f0f0f0'
          }]}>
            <Text style={[styles.ballDetailsText, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {item.ballDetails.delivery} • {item.ballDetails.line} • {item.ballDetails.length} • {item.ballDetails.shot} • {item.ballDetails.result}
            </Text>
          </View>
        )}

        {item.statistics && (
          <View style={[styles.statistics, { 
            backgroundColor: colorScheme === 'dark' ? '#444' : '#f0f0f0'
          }]}>
            <Text style={[styles.statisticsText, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              RR: {item.statistics.runRate.toFixed(1)} • Req RR: {item.statistics.requiredRate.toFixed(1)} • Partnership: {item.statistics.partnership}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.commentaryFooter}>
        <View style={styles.expertInfo}>
          <Text style={styles.expertIcon}>
            {getRoleIcon(item.expert.role)}
          </Text>
          <Text style={[styles.expertName, { 
            color: getRoleColor(item.expert.role) 
          }]}>
            {item.expert.name}
          </Text>
          <Text style={[styles.expertRole, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {item.expert.role}
          </Text>
        </View>

        <View style={styles.commentaryActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onHighlightCommentary(item.id)}
          >
            <Text style={styles.actionButtonText}>⭐</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onPinCommentary(item.id)}
          >
            <Text style={styles.actionButtonText}>📌</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onShareCommentary(item.id)}
          >
            <Text style={styles.actionButtonText}>📤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

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
            Live Commentary
          </Text>
          <Text style={[styles.headerSubtitle, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            {commentary.length} entries
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={[styles.headerButton, { 
              backgroundColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
            }]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Text style={styles.headerButtonText}>🔍</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.headerButton, { 
              backgroundColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
            }]}
            onPress={() => setIsAutoScroll(!isAutoScroll)}
          >
            <Text style={styles.headerButtonText}>
              {isAutoScroll ? '⏸️' : '▶️'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={[styles.filtersContainer, { 
          backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
          borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
        }]}>
          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Over:
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity 
                style={[styles.filterButton, { 
                  backgroundColor: selectedOver === 'all' ? Colors[colorScheme ?? 'light'].tint : 'transparent',
                  borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
                }]}
                onPress={() => setSelectedOver('all')}
              >
                <Text style={[styles.filterButtonText, { 
                  color: selectedOver === 'all' ? 'white' : Colors[colorScheme ?? 'light'].text 
                }]}>
                  All
                </Text>
              </TouchableOpacity>
              {Array.from({ length: 20 }, (_, i) => i + 1).map(over => (
                <TouchableOpacity 
                  key={over}
                  style={[styles.filterButton, { 
                    backgroundColor: selectedOver === over.toString() ? Colors[colorScheme ?? 'light'].tint : 'transparent',
                    borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
                  }]}
                  onPress={() => setSelectedOver(over.toString())}
                >
                  <Text style={[styles.filterButtonText, { 
                    color: selectedOver === over.toString() ? 'white' : Colors[colorScheme ?? 'light'].text 
                  }]}>
                    {over}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              Type:
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['all', 'ball', 'over', 'wicket', 'boundary', 'milestone', 'break'].map(type => (
                <TouchableOpacity 
                  key={type}
                  style={[styles.filterButton, { 
                    backgroundColor: filterType === type ? Colors[colorScheme ?? 'light'].tint : 'transparent',
                    borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
                  }]}
                  onPress={() => setFilterType(type)}
                >
                  <Text style={[styles.filterButtonText, { 
                    color: filterType === type ? 'white' : Colors[colorScheme ?? 'light'].text 
                  }]}>
                    {type.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Commentary List */}
      <FlatList
        data={filteredCommentary}
        renderItem={renderCommentaryEntry}
        keyExtractor={(item) => item.id}
        style={styles.commentaryList}
        showsVerticalScrollIndicator={false}
        inverted
      />

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
            borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
          }]}
          onPress={onViewFullCommentary}
        >
          <Text style={[styles.actionButtonText, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            📝 Full Commentary
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, { 
            backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5',
            borderColor: colorScheme === 'dark' ? '#555' : '#ddd'
          }]}
          onPress={onViewBallByBall}
        >
          <Text style={[styles.actionButtonText, { 
            color: Colors[colorScheme ?? 'light'].text 
          }]}>
            ⚪ Ball by Ball
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, { 
            backgroundColor: Colors[colorScheme ?? 'light'].tint 
          }]}
          onPress={onViewStatistics}
        >
          <Text style={styles.actionButtonText}>
            📊 Statistics
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
    padding: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  headerSubtitle: {
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
  filtersContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  commentaryList: {
    flex: 1,
    padding: 12,
  },
  commentaryEntry: {
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  commentaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  commentaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  commentaryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  overText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  ballText: {
    fontSize: 12,
    opacity: 0.7,
  },
  timeText: {
    fontSize: 12,
    opacity: 0.6,
  },
  commentaryType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typeIcon: {
    fontSize: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  commentaryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  pinnedIcon: {
    fontSize: 12,
  },
  commentaryContent: {
    padding: 12,
  },
  commentaryText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  ballDetails: {
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  ballDetailsText: {
    fontSize: 12,
    opacity: 0.8,
  },
  statistics: {
    padding: 8,
    borderRadius: 4,
  },
  statisticsText: {
    fontSize: 12,
    opacity: 0.8,
  },
  commentaryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  expertInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  expertIcon: {
    fontSize: 12,
  },
  expertName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  expertRole: {
    fontSize: 12,
    opacity: 0.7,
  },
  commentaryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  actionButtonText: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
  },
});
