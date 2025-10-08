import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

// Import existing components
import { AchievementsEditor } from '@/components/ui/AchievementsEditor';
import { AwardsEditor } from '@/components/ui/AwardsEditor';
import { ExperienceEditor } from '@/components/ui/ExperienceEditor';
import { InstagramBottomNav } from '@/components/ui/InstagramBottomNav';
import { InstagramHeader } from '@/components/ui/InstagramHeader';
import { SkillsEditor } from '@/components/ui/SkillsEditor';

export default function ProfileScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [showSkillsEditor, setShowSkillsEditor] = useState(false);
  const [showAwardsEditor, setShowAwardsEditor] = useState(false);
  const [showAchievementsEditor, setShowAchievementsEditor] = useState(false);
  const [showExperienceEditor, setShowExperienceEditor] = useState(false);
  const colorScheme = useColorScheme();
  const { width } = Dimensions.get('window');
  
  // Mock user data - enhanced for profile screen
  const [user, setUser] = useState({
    id: '1',
    fullName: 'Demo User',
    username: 'demo_user',
    email: 'demo@example.com',
    avatar: 'https://via.placeholder.com/100',
    bio: 'Passionate cricket player and coach. Love the game!',
    location: 'Mumbai, India',
    organization: 'Mumbai Cricket Academy',
    verified: true,
    joinedDate: new Date('2023-01-01')
  });

  // Enhanced user stats
  const [userStats, setUserStats] = useState({
    posts: 25,
    matches: 15,
    followers: 150,
    following: 200,
    wins: 12,
    losses: 3,
    winRate: 80,
    totalRuns: 450,
    totalWickets: 25,
    bestScore: 85,
    bestBowling: '5/25',
    achievements: 5
  });

  // Cricket statistics
  const [cricketStats, setCricketStats] = useState({
    batting: {
      totalRuns: 1250,
      matches: 25,
      centuries: 2,
      halfCenturies: 8,
      average: 45.5,
      highestScore: 156,
      strikeRate: 125.5
    },
    bowling: {
      matches: 25,
      overs: 45.2,
      wickets: 35,
      hatTricks: 1,
      bestFigures: '5/25',
      average: 18.5,
      economy: 4.2
    },
    fielding: {
      matches: 25,
      catches: 18,
      stumpings: 3,
      runOuts: 5
    }
  });

  // Skills rating
  const [skills, setSkills] = useState({
    batting: 85,
    bowling: 70,
    fielding: 80
  });

  // Experience data
  const [experience, setExperience] = useState([
    {
      id: '1',
      title: 'Senior Cricket Coach',
      organization: 'Mumbai Cricket Academy',
      duration: '2022 - Present',
      description: 'Coaching junior and senior teams'
    },
    {
      id: '2',
      title: 'Professional Cricketer',
      organization: 'Mumbai Indians',
      duration: '2018 - 2022',
      description: 'Played in IPL and domestic cricket'
    }
  ]);

  // Achievements data
  const [achievements, setAchievements] = useState([
    {
      id: '1',
      title: 'Best Batsman 2023',
      year: '2023',
      description: 'Awarded for outstanding batting performance'
    },
    {
      id: '2',
      title: 'Team Captain',
      year: '2022',
      description: 'Led team to championship victory'
    }
  ]);

  // Awards data
  const [awards, setAwards] = useState([
    {
      id: '1',
      title: 'Player of the Year',
      organization: 'Cricket Association',
      year: '2023',
      description: 'Outstanding performance throughout the year'
    }
  ]);

  // Upcoming matches
  const [upcomingMatches, setUpcomingMatches] = useState([
    {
      id: '1',
      title: 'Mumbai vs Delhi',
      time: '2024-01-15 14:00',
      location: 'Wankhede Stadium'
    },
    {
      id: '2',
      title: 'Practice Session',
      time: '2024-01-12 10:00',
      location: 'Mumbai Cricket Academy'
    }
  ]);

  // Posts data
  const [posts, setPosts] = useState([
    {
      id: '1',
      content: 'Great practice session today!',
      image: 'https://via.placeholder.com/300x200',
      likes: 24,
      comments: 8,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: '2',
      content: 'Match highlights from yesterday',
      image: 'https://via.placeholder.com/300x200',
      likes: 18,
      comments: 5,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
    }
  ]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load posts from storage on component mount
  useEffect(() => {
    loadUserPostsFromStorage();
  }, []);

  const loadUserPostsFromStorage = async () => {
    try {
      const storedPosts = await AsyncStorage.getItem('user_posts');
      if (storedPosts) {
        const parsedPosts = JSON.parse(storedPosts);
        setPosts(parsedPosts);
      }
    } catch (error) {
      console.log('Error loading user posts from storage:', error);
    }
  };

  // Event handlers
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Reload posts from storage
    await loadUserPostsFromStorage();
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };


  const handleAddExperience = () => {
    Alert.alert('Add Experience', 'Experience form will open');
  };

  const handleAddAchievement = () => {
    Alert.alert('Add Achievement', 'Achievement form will open');
  };

  const handleAddAward = () => {
    Alert.alert('Add Award', 'Award form will open');
  };

  const handleEditSkills = () => {
    setShowSkillsEditor(true);
  };

  const handleEditAwards = () => {
    setShowAwardsEditor(true);
  };

  const handleEditAchievements = () => {
    setShowAchievementsEditor(true);
  };

  const handleEditExperience = () => {
    setShowExperienceEditor(true);
  };

  const handleSkillsSave = (updatedSkills: any) => {
    setSkills(updatedSkills);
    setShowSkillsEditor(false);
  };

  const handleAwardsSave = (updatedAwards: any) => {
    // Update awards state here
    setShowAwardsEditor(false);
  };

  const handleAchievementsSave = (updatedAchievements: any) => {
    // Update achievements state here
    setShowAchievementsEditor(false);
  };

  const handleExperienceSave = (updatedExperience: any) => {
    // Update experience state here
    setShowExperienceEditor(false);
  };

  const handleViewPersonalInfo = () => {
    Alert.alert('Personal Info', 'Personal information details');
  };

  const handlePostPress = (postId: string) => {
    console.log('View post:', postId);
  };

  const handleMatchPress = (matchId: string) => {
    console.log('View match:', matchId);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: () => {
            // Clear user data and navigate to login
            setUser({
              id: '',
              fullName: '',
              username: '',
              email: '',
              avatar: '',
              bio: '',
              location: '',
              organization: '',
              verified: false,
              joinedDate: new Date()
            });
            setUserStats({
              posts: 0,
              matches: 0,
              followers: 0,
              following: 0,
              wins: 0,
              losses: 0,
              winRate: 0,
              totalRuns: 0,
              totalWickets: 0,
              bestScore: 0,
              bestBowling: '0/0',
              achievements: 0
            });
            setCricketStats({
              batting: { totalRuns: 0, matches: 0, centuries: 0, halfCenturies: 0, average: 0, highest: 0 },
              bowling: { matches: 0, overs: 0, wickets: 0, hatTricks: 0, best: '0/0', average: 0 },
              fielding: { matches: 0, catches: 0, stumpings: 0, runOuts: 0 }
            });
            setSkills({ batting: 0, bowling: 0, fielding: 0, overall: 0 });
            setExperience([]);
            setAchievements([]);
            setAwards([]);
            setUpcomingMatches([]);
            
            // Navigate to login screen
            router.replace('/');
          }
        }
      ]
    );
  };

  // Render functions
  const renderHeader = () => (
    <InstagramHeader 
      user={user}
      onNotificationPress={(notification) => {
        console.log('Notification pressed:', notification);
        router.push('/notifications');
      }}
      onMessagePress={(message) => {
        console.log('Message pressed:', message);
        router.push('/messages');
      }}
      onViewAllNotifications={() => router.push('/notifications')}
      onViewAllMessages={() => router.push('/messages')}
      onSearchPress={() => console.log('Search pressed')}
      onProfilePress={() => console.log('Profile pressed')}
    />
  );

  const renderBottomNavigation = () => (
    <InstagramBottomNav 
      activeSection="profile"
      onSectionChange={(section) => {
        if (section !== 'profile') {
          router.push('/home');
        }
      }}
      onCreatePost={(content) => console.log('Create post:', content)}
      onCreateMatch={(matchData) => console.log('Create match:', matchData)}
      onCreateTeam={(teamData) => console.log('Create team:', teamData)}
    />
  );

  const renderProfileHeader = () => (
    <View style={[styles.profileHeader, { 
      backgroundColor: getColors(colorScheme).card,
      borderColor: getColors(colorScheme).border
    }]}>
      {/* Profile Info Section */}
      <View style={styles.profileInfo}>
        <View style={styles.avatarContainer}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { 
              backgroundColor: getColors(colorScheme).tint 
            }]}>
              <Text style={styles.avatarText}>
                {user.fullName.charAt(0)}
              </Text>
            </View>
          )}
          {user.verified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓</Text>
            </View>
          )}
        </View>
        
        <View style={styles.profileDetails}>
          <View style={styles.nameRow}>
            <Text style={[styles.profileName, { 
              color: getColors(colorScheme).text 
            }]}>
              {user.fullName}
            </Text>
            {user.verified && (
              <Text style={styles.verifiedIcon}>✓</Text>
            )}
          </View>
          <Text style={[styles.profileUsername, { 
            color: getColors(colorScheme).text 
          }]}>
            @{user.username}
          </Text>
          <Text style={[styles.profileBio, { 
            color: getColors(colorScheme).text 
          }]}>
            {user.bio}
          </Text>
          <View style={styles.profileMeta}>
            <Text style={[styles.profileLocation, { 
              color: getColors(colorScheme).text 
            }]}>
              📍 {user.location}
            </Text>
            <Text style={[styles.profileOrganization, { 
              color: getColors(colorScheme).text 
            }]}>
              🏢 {user.organization}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.editButton, { 
            backgroundColor: getColors(colorScheme).tint 
          }]}
          onPress={handleEditProfile}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.shareButton, { 
            backgroundColor: getColors(colorScheme).card,
            borderColor: getColors(colorScheme).border
          }]}
          onPress={() => Alert.alert('Share', 'Share profile functionality')}
        >
          <Text style={[styles.shareButtonText, { 
            color: getColors(colorScheme).text 
          }]}>
            Share
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPersonalInfoCard = () => (
    <TouchableOpacity 
      style={[styles.personalInfoCard, { 
        backgroundColor: getColors(colorScheme).card,
        borderColor: getColors(colorScheme).border
      }]}
      onPress={handleViewPersonalInfo}
    >
      <View style={styles.personalInfoContent}>
        <Text style={styles.personalInfoIcon}>🛡️</Text>
        <View style={styles.personalInfoText}>
          <Text style={[styles.personalInfoTitle, { 
            color: getColors(colorScheme).text 
          }]}>
            Personal Information
          </Text>
          <Text style={[styles.personalInfoSubtitle, { 
            color: getColors(colorScheme).text 
          }]}>
            View and manage your personal details
          </Text>
        </View>
        <Text style={styles.personalInfoArrow}>›</Text>
      </View>
    </TouchableOpacity>
  );

  const renderPostsSection = () => (
    <View style={styles.postsSection}>
      <View style={styles.postsHeader}>
        <Text style={[styles.postsTitle, { 
          color: getColors(colorScheme).text 
        }]}>
          Posts ({posts.length})
        </Text>
        <View style={styles.viewModeToggle}>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'grid' && styles.activeToggle]}
            onPress={() => setViewMode('grid')}
          >
            <Text style={styles.toggleIcon}>⊞</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'list' && styles.activeToggle]}
            onPress={() => setViewMode('list')}
          >
            <Text style={styles.toggleIcon}>☰</Text>
          </TouchableOpacity>
        </View>
      </View>

      {viewMode === 'grid' ? (
        <View style={styles.postsGrid}>
          {posts.map(post => (
            <TouchableOpacity 
              key={post.id}
              style={styles.postGridItem}
              onPress={() => handlePostPress(post.id)}
            >
              <Image source={{ uri: post.image }} style={styles.postGridImage} />
              <View style={styles.postGridOverlay}>
                <View style={styles.postGridStats}>
                  <Text style={styles.postGridLikes}>❤️ {post.likes}</Text>
                  <Text style={styles.postGridComments}>💬 {post.comments}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.postsList}>
          {posts.map(post => (
            <TouchableOpacity 
              key={post.id}
              style={[styles.postListItem, { 
                backgroundColor: getColors(colorScheme).card,
                borderColor: getColors(colorScheme).border
              }]}
              onPress={() => handlePostPress(post.id)}
            >
              <Image source={{ uri: post.image }} style={styles.postListImage} />
              <View style={styles.postListContent}>
                <Text style={[styles.postListText, { 
                  color: getColors(colorScheme).text 
                }]}>
                  {post.content}
                </Text>
                <View style={styles.postListStats}>
                  <Text style={styles.postListStat}>❤️ {post.likes}</Text>
                  <Text style={styles.postListStat}>💬 {post.comments}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderCricketStats = () => (
    <View style={styles.cricketStatsSection}>
      <Text style={[styles.sectionTitle, { 
        color: getColors(colorScheme).text 
      }]}>
        Cricket Statistics
      </Text>

      {/* Combined Stats Overview */}
      <View style={[styles.overviewStatsCard, { 
        backgroundColor: getColors(colorScheme).card,
        borderColor: getColors(colorScheme).border
      }]}>
        <View style={styles.overviewStatsRow}>
          <View style={styles.overviewStatItem}>
            <Text style={[styles.overviewStatValue, { 
              color: getColors(colorScheme).text 
            }]}>
              {cricketStats.batting.totalRuns}
            </Text>
            <Text style={[styles.overviewStatLabel, { 
              color: getColors(colorScheme).text 
            }]}>
              Total Runs
            </Text>
          </View>
          <View style={styles.overviewStatItem}>
            <Text style={[styles.overviewStatValue, { 
              color: getColors(colorScheme).text 
            }]}>
              {cricketStats.bowling.wickets}
            </Text>
            <Text style={[styles.overviewStatLabel, { 
              color: getColors(colorScheme).text 
            }]}>
              Wickets
            </Text>
          </View>
          <View style={styles.overviewStatItem}>
            <Text style={[styles.overviewStatValue, { 
              color: getColors(colorScheme).text 
            }]}>
              {cricketStats.fielding.catches}
            </Text>
            <Text style={[styles.overviewStatLabel, { 
              color: getColors(colorScheme).text 
            }]}>
              Catches
            </Text>
          </View>
        </View>
      </View>

      {/* Detailed Stats in Tabs */}
      <View style={styles.statsTabsContainer}>
        <View style={styles.statsTabs}>
          <TouchableOpacity 
            style={[styles.statsTab, activeSection === 'batting' && styles.activeStatsTab]}
            onPress={() => setActiveSection('batting')}
          >
            <Text style={[styles.statsTabText, activeSection === 'batting' && styles.activeStatsTabText]}>
              🏏 Batting
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.statsTab, activeSection === 'bowling' && styles.activeStatsTab]}
            onPress={() => setActiveSection('bowling')}
          >
            <Text style={[styles.statsTabText, activeSection === 'bowling' && styles.activeStatsTabText]}>
              🎯 Bowling
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.statsTab, activeSection === 'fielding' && styles.activeStatsTab]}
            onPress={() => setActiveSection('fielding')}
          >
            <Text style={[styles.statsTabText, activeSection === 'fielding' && styles.activeStatsTabText]}>
              🧤 Fielding
            </Text>
          </TouchableOpacity>
        </View>

        {/* Batting Stats */}
        {activeSection === 'batting' && (
          <View style={[styles.detailedStatsCard, { 
            backgroundColor: getColors(colorScheme).card,
            borderColor: getColors(colorScheme).border
          }]}>
            <View style={styles.metricsList}>
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { 
                  color: getColors(colorScheme).text 
                }]}>
                  Total Runs:
                </Text>
                <Text style={[styles.metricValue, { 
                  color: getColors(colorScheme).text 
                }]}>
                  {cricketStats.batting.totalRuns}
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { 
                  color: getColors(colorScheme).text 
                }]}>
                  Average:
                </Text>
                <Text style={[styles.metricValue, { 
                  color: getColors(colorScheme).text 
                }]}>
                  {cricketStats.batting.average}
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { 
                  color: getColors(colorScheme).text 
                }]}>
                  Centuries:
                </Text>
                <Text style={[styles.metricValue, { 
                  color: getColors(colorScheme).text 
                }]}>
                  {cricketStats.batting.centuries}
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { 
                  color: getColors(colorScheme).text 
                }]}>
                  Highest Score:
                </Text>
                <Text style={[styles.metricValue, { 
                  color: getColors(colorScheme).text 
                }]}>
                  {cricketStats.batting.highestScore}
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { 
                  color: getColors(colorScheme).text 
                }]}>
                  Half Centuries:
                </Text>
                <Text style={[styles.metricValue, { 
                  color: getColors(colorScheme).text 
                }]}>
                  {cricketStats.batting.halfCenturies}
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { 
                  color: getColors(colorScheme).text 
                }]}>
                  Strike Rate:
                </Text>
                <Text style={[styles.metricValue, { 
                  color: getColors(colorScheme).text 
                }]}>
                  {cricketStats.batting.strikeRate}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Bowling Stats */}
        {activeSection === 'bowling' && (
          <View style={[styles.detailedStatsCard, { 
            backgroundColor: getColors(colorScheme).card,
            borderColor: getColors(colorScheme).border
          }]}>
            <View style={styles.metricsList}>
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { 
                  color: getColors(colorScheme).text 
                }]}>
                  Wickets:
                </Text>
                <Text style={[styles.metricValue, { 
                  color: getColors(colorScheme).text 
                }]}>
                  {cricketStats.bowling.wickets}
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { 
                  color: getColors(colorScheme).text 
                }]}>
                  Average:
                </Text>
                <Text style={[styles.metricValue, { 
                  color: getColors(colorScheme).text 
                }]}>
                  {cricketStats.bowling.average}
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { 
                  color: getColors(colorScheme).text 
                }]}>
                  Economy:
                </Text>
                <Text style={[styles.metricValue, { 
                  color: getColors(colorScheme).text 
                }]}>
                  {cricketStats.bowling.economy}
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { 
                  color: getColors(colorScheme).text 
                }]}>
                  Best Figures:
                </Text>
                <Text style={[styles.metricValue, { 
                  color: getColors(colorScheme).text 
                }]}>
                  {cricketStats.bowling.bestFigures}
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { 
                  color: getColors(colorScheme).text 
                }]}>
                  Hat Tricks:
                </Text>
                <Text style={[styles.metricValue, { 
                  color: getColors(colorScheme).text 
                }]}>
                  {cricketStats.bowling.hatTricks}
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { 
                  color: getColors(colorScheme).text 
                }]}>
                  Overs Bowled:
                </Text>
                <Text style={[styles.metricValue, { 
                  color: getColors(colorScheme).text 
                }]}>
                  {cricketStats.bowling.overs}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Fielding Stats */}
        {activeSection === 'fielding' && (
          <View style={[styles.detailedStatsCard, { 
            backgroundColor: getColors(colorScheme).card,
            borderColor: getColors(colorScheme).border
          }]}>
            <View style={styles.metricsList}>
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { 
                  color: getColors(colorScheme).text 
                }]}>
                  Catches:
                </Text>
                <Text style={[styles.metricValue, { 
                  color: getColors(colorScheme).text 
                }]}>
                  {cricketStats.fielding.catches}
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { 
                  color: getColors(colorScheme).text 
                }]}>
                  Stumpings:
                </Text>
                <Text style={[styles.metricValue, { 
                  color: getColors(colorScheme).text 
                }]}>
                  {cricketStats.fielding.stumpings}
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { 
                  color: getColors(colorScheme).text 
                }]}>
                  Run Outs:
                </Text>
                <Text style={[styles.metricValue, { 
                  color: getColors(colorScheme).text 
                }]}>
                  {cricketStats.fielding.runOuts}
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={[styles.metricLabel, { 
                  color: getColors(colorScheme).text 
                }]}>
                  Matches:
                </Text>
                <Text style={[styles.metricValue, { 
                  color: getColors(colorScheme).text 
                }]}>
                  {cricketStats.fielding.matches}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  const renderSkillsSection = () => (
    <View style={styles.skillsSection}>
      <View style={styles.skillsHeader}>
        <Text style={[styles.sectionTitle, { 
          color: getColors(colorScheme).text 
        }]}>
          Skills Rating
        </Text>
        <TouchableOpacity 
          style={styles.editSkillsButton}
          onPress={handleEditSkills}
        >
          <Text style={styles.editSkillsButtonText}>✏️</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.skillsCard, { 
        backgroundColor: getColors(colorScheme).card,
        borderColor: getColors(colorScheme).border
      }]}>
        <View style={styles.skillItem}>
          <Text style={[styles.skillLabel, { 
            color: getColors(colorScheme).text 
          }]}>
            🏏 Batting
          </Text>
          <View style={styles.skillProgress}>
            <View style={[styles.skillProgressBar, { 
              backgroundColor: getColors(colorScheme).border 
            }]}>
              <View style={[styles.skillProgressFill, { 
                backgroundColor: '#F97316',
                width: `${skills.batting}%`
              }]} />
            </View>
            <Text style={[styles.skillValue, { 
              color: getColors(colorScheme).text 
            }]}>
              {skills.batting}%
            </Text>
          </View>
        </View>

        <View style={styles.skillItem}>
          <Text style={[styles.skillLabel, { 
            color: getColors(colorScheme).text 
          }]}>
            🎯 Bowling
          </Text>
          <View style={styles.skillProgress}>
            <View style={[styles.skillProgressBar, { 
              backgroundColor: getColors(colorScheme).border 
            }]}>
              <View style={[styles.skillProgressFill, { 
                backgroundColor: '#3B82F6',
                width: `${skills.bowling}%`
              }]} />
            </View>
            <Text style={[styles.skillValue, { 
              color: getColors(colorScheme).text 
            }]}>
              {skills.bowling}%
            </Text>
          </View>
        </View>

        <View style={styles.skillItem}>
          <Text style={[styles.skillLabel, { 
            color: getColors(colorScheme).text 
          }]}>
            🧤 Fielding
          </Text>
          <View style={styles.skillProgress}>
            <View style={[styles.skillProgressBar, { 
              backgroundColor: getColors(colorScheme).border 
            }]}>
              <View style={[styles.skillProgressFill, { 
                backgroundColor: '#10B981',
                width: `${skills.fielding}%`
              }]} />
            </View>
            <Text style={[styles.skillValue, { 
              color: getColors(colorScheme).text 
            }]}>
              {skills.fielding}%
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderExperienceSection = () => (
    <View style={styles.experienceSection}>
      <View style={styles.experienceHeader}>
        <Text style={[styles.sectionTitle, { 
          color: getColors(colorScheme).text 
        }]}>
          Experience
        </Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={handleEditExperience}
        >
          <Text style={styles.editButtonText}>✏️</Text>
        </TouchableOpacity>
      </View>

      {experience.map(exp => (
        <View key={exp.id} style={[styles.experienceItem, { 
          backgroundColor: getColors(colorScheme).card,
          borderColor: getColors(colorScheme).border
        }]}>
          <Text style={[styles.experienceTitle, { 
            color: getColors(colorScheme).text 
          }]}>
            {exp.title}
          </Text>
          <Text style={[styles.experienceOrganization, { 
            color: getColors(colorScheme).text 
          }]}>
            {exp.organization}
          </Text>
          <Text style={[styles.experienceDuration, { 
            color: getColors(colorScheme).text 
          }]}>
            {exp.duration}
          </Text>
          <Text style={[styles.experienceDescription, { 
            color: getColors(colorScheme).text 
          }]}>
            {exp.description}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderAchievementsSection = () => (
    <View style={styles.achievementsSection}>
      <View style={styles.achievementsHeader}>
        <Text style={[styles.sectionTitle, { 
          color: getColors(colorScheme).text 
        }]}>
          Achievements
        </Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={handleEditAchievements}
        >
          <Text style={styles.editButtonText}>✏️</Text>
        </TouchableOpacity>
      </View>

      {achievements.map(achievement => (
        <View key={achievement.id} style={[styles.achievementItem, { 
          backgroundColor: getColors(colorScheme).card,
          borderColor: getColors(colorScheme).border
        }]}>
          <Text style={[styles.achievementTitle, { 
            color: getColors(colorScheme).text 
          }]}>
            🏆 {achievement.title}
          </Text>
          <Text style={[styles.achievementYear, { 
            color: getColors(colorScheme).text 
          }]}>
            {achievement.year}
          </Text>
          <Text style={[styles.achievementDescription, { 
            color: getColors(colorScheme).text 
          }]}>
            {achievement.description}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderAwardsSection = () => (
    <View style={styles.awardsSection}>
      <View style={styles.awardsHeader}>
        <Text style={[styles.sectionTitle, { 
          color: getColors(colorScheme).text 
        }]}>
          Awards
        </Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={handleEditAwards}
        >
          <Text style={styles.editButtonText}>✏️</Text>
        </TouchableOpacity>
      </View>

      {awards.map(award => (
        <View key={award.id} style={[styles.awardItem, { 
          backgroundColor: getColors(colorScheme).card,
          borderColor: getColors(colorScheme).border
        }]}>
          <Text style={[styles.awardTitle, { 
            color: getColors(colorScheme).text 
          }]}>
            🏅 {award.title}
          </Text>
          <Text style={[styles.awardOrganization, { 
            color: getColors(colorScheme).text 
          }]}>
            {award.organization}
          </Text>
          <Text style={[styles.awardYear, { 
            color: getColors(colorScheme).text 
          }]}>
            {award.year}
          </Text>
          <Text style={[styles.awardDescription, { 
            color: getColors(colorScheme).text 
          }]}>
            {award.description}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderUpcomingMatches = () => (
    <View style={styles.upcomingMatchesSection}>
      <Text style={[styles.sectionTitle, { 
        color: getColors(colorScheme).text 
      }]}>
        Upcoming Matches
      </Text>

      {upcomingMatches.map(match => (
        <TouchableOpacity 
          key={match.id}
          style={[styles.matchItem, { 
            backgroundColor: getColors(colorScheme).card,
            borderColor: getColors(colorScheme).border
          }]}
          onPress={() => handleMatchPress(match.id)}
        >
          <Text style={[styles.matchTitle, { 
            color: getColors(colorScheme).text 
          }]}>
            {match.title}
          </Text>
          <Text style={[styles.matchTime, { 
            color: getColors(colorScheme).text 
          }]}>
            🕐 {match.time}
          </Text>
          <Text style={[styles.matchLocation, { 
            color: getColors(colorScheme).text 
          }]}>
            📍 {match.location}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { 
      backgroundColor: getColors(colorScheme).background
    }]}>
      {renderHeader()}
      
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[getColors(colorScheme).tint]}
            tintColor={getColors(colorScheme).tint}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderProfileHeader()}
        {renderPersonalInfoCard()}
        {renderPostsSection()}
        {renderCricketStats()}
        {renderSkillsSection()}
        {renderExperienceSection()}
        {renderAchievementsSection()}
        {renderAwardsSection()}
        {renderUpcomingMatches()}
        
        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity 
            style={[styles.logoutButton, { backgroundColor: getColors(colorScheme).error }]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {renderBottomNavigation()}
      
      {/* Editor Modals */}
      <SkillsEditor
        visible={showSkillsEditor}
        onClose={() => setShowSkillsEditor(false)}
        onSave={handleSkillsSave}
        initialSkills={skills}
      />
      
      <AwardsEditor
        visible={showAwardsEditor}
        onClose={() => setShowAwardsEditor(false)}
        onSave={handleAwardsSave}
        initialAwards={awards}
      />
      
      <AchievementsEditor
        visible={showAchievementsEditor}
        onClose={() => setShowAchievementsEditor(false)}
        onSave={handleAchievementsSave}
        initialAchievements={achievements}
      />
      
      <ExperienceEditor
        visible={showExperienceEditor}
        onClose={() => setShowExperienceEditor(false)}
        onSave={handleExperienceSave}
        initialExperiences={experience}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  profileHeader: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  verifiedText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  profileDetails: {
    flex: 1,
    paddingTop: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginRight: 8,
  },
  verifiedIcon: {
    fontSize: 16,
    color: '#10B981',
  },
  profileUsername: {
    fontSize: 15,
    opacity: 0.7,
    marginBottom: 8,
  },
  profileBio: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  profileMeta: {
    gap: 4,
  },
  profileLocation: {
    fontSize: 13,
    opacity: 0.7,
  },
  profileOrganization: {
    fontSize: 13,
    opacity: 0.7,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  personalInfoCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  personalInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personalInfoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  personalInfoText: {
    flex: 1,
  },
  personalInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  personalInfoSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  personalInfoArrow: {
    fontSize: 20,
    opacity: 0.5,
  },
  postsSection: {
    marginBottom: 24,
  },
  postsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  postsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewModeToggle: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activeToggle: {
    backgroundColor: 'white',
  },
  toggleIcon: {
    fontSize: 16,
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  postGridItem: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  postGridImage: {
    width: '100%',
    height: '100%',
  },
  postGridOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
  },
  postGridStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  postGridLikes: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  postGridComments: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  postsList: {
    gap: 12,
  },
  postListItem: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  postListImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  postListContent: {
    flex: 1,
  },
  postListText: {
    fontSize: 14,
    marginBottom: 8,
  },
  postListStats: {
    flexDirection: 'row',
    gap: 16,
  },
  postListStat: {
    fontSize: 12,
    opacity: 0.7,
  },
  cricketStatsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  overviewStatsCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overviewStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  overviewStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  overviewStatValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  overviewStatLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
    fontWeight: '600',
  },
  statsTabsContainer: {
    marginTop: 8,
  },
  statsTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  statsTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeStatsTab: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statsTabText: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.7,
  },
  activeStatsTabText: {
    opacity: 1,
    color: '#FF6B33',
  },
  detailedStatsCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  metricsList: {
    gap: 16,
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B33',
  },
  metricLabel: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B33',
  },
  skillsSection: {
    marginBottom: 24,
  },
  skillsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  editSkillsButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  editSkillsButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  skillsCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  skillItem: {
    marginBottom: 20,
  },
  skillLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },
  skillProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillProgressBar: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    marginRight: 16,
  },
  skillProgressFill: {
    height: '100%',
    borderRadius: 5,
  },
  skillValue: {
    fontSize: 13,
    fontWeight: '700',
    minWidth: 35,
    textAlign: 'right',
  },
  experienceSection: {
    marginBottom: 24,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  experienceItem: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  experienceTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  experienceOrganization: {
    fontSize: 15,
    opacity: 0.8,
    marginBottom: 4,
    fontWeight: '500',
  },
  experienceDuration: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 10,
    fontWeight: '500',
  },
  experienceDescription: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.9,
  },
  achievementsSection: {
    marginBottom: 24,
  },
  achievementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementItem: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  achievementTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  achievementYear: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 10,
    fontWeight: '500',
  },
  achievementDescription: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.9,
  },
  awardsSection: {
    marginBottom: 24,
  },
  awardsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  awardItem: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  awardTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  awardOrganization: {
    fontSize: 15,
    opacity: 0.8,
    marginBottom: 4,
    fontWeight: '500',
  },
  awardYear: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 10,
    fontWeight: '500',
  },
  awardDescription: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.9,
  },
  upcomingMatchesSection: {
    marginBottom: 24,
  },
  matchItem: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  matchTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  matchTime: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 4,
    fontWeight: '500',
  },
  matchLocation: {
    fontSize: 14,
    opacity: 0.8,
    fontWeight: '500',
  },
  logoutSection: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  logoutButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
