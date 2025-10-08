import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

// Import existing components
import { AchievementsEditor } from '@/components/ui/AchievementsEditor';
import { AwardsEditor } from '@/components/ui/AwardsEditor';
import { ExperienceEditor } from '@/components/ui/ExperienceEditor';
import { InstagramBottomNav } from '@/components/ui/InstagramBottomNav';
import { PageTypeSelector } from '@/components/ui/PageTypeSelector';
import { SkillsEditor } from '@/components/ui/SkillsEditor';

// Import page management utilities
import { AcademyData, CommunityData, PageType, UserPage, VenueData } from '@/types/pages';
import { getUserPages } from '@/utils/pageStorage';

export default function ProfileScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [showSkillsEditor, setShowSkillsEditor] = useState(false);
  const [showAwardsEditor, setShowAwardsEditor] = useState(false);
  const [showAchievementsEditor, setShowAchievementsEditor] = useState(false);
  const [showExperienceEditor, setShowExperienceEditor] = useState(false);
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const [showPageTypeSelector, setShowPageTypeSelector] = useState(false);
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<'personal' | string>('personal');
  const [userPages, setUserPages] = useState<UserPage[]>([]);
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [editingPageData, setEditingPageData] = useState<any>(null);
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

  // Load posts and pages from storage on component mount
  useEffect(() => {
    loadUserPostsFromStorage();
    loadUserPagesFromStorage();
  }, []);

  const loadUserPagesFromStorage = async () => {
    try {
      const pages = await getUserPages();
      setUserPages(pages);
    } catch (error) {
      console.log('Error loading user pages:', error);
    }
  };

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
    // Reload posts and pages from storage
    await loadUserPostsFromStorage();
    await loadUserPagesFromStorage();
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handlePageTypeSelect = (type: PageType) => {
    console.log('Page type selected:', type);
    setShowPageTypeSelector(false);
    // Navigate to create page screen based on type
    router.push(`/create-${type}` as any);
  };


  const getCurrentProfileName = () => {
    if (currentProfile === 'personal') {
      return user.fullName;
    }
    const page = userPages.find(p => p.id === currentProfile);
    return page ? page.name : user.fullName;
  };

  const handleProfileSwitch = (profileId: string) => {
    setCurrentProfile(profileId);
    setShowProfileSelector(false);
    // Refresh data based on selected profile
    if (profileId === 'personal') {
      // Load personal profile data
      loadUserPostsFromStorage();
    } else {
      // Load specific page data
      const page = userPages.find(p => p.id === profileId);
      if (page) {
        // Load page-specific data
        loadPageData(page);
      }
    }
  };

  const loadPageData = (page: UserPage) => {
    // Load page-specific data based on type
    console.log('Loading data for page:', page.name, page.type);
  };

  const handleEditPage = () => {
    if (currentProfile === 'personal') return;
    
    const page = userPages.find(p => p.id === currentProfile);
    if (page) {
      setEditingPageData(page.data);
      setIsEditingPage(true);
    }
  };

  const handleSavePage = async () => {
    if (!editingPageData || currentProfile === 'personal') return;
    
    try {
      const updatedPage = {
        ...userPages.find(p => p.id === currentProfile)!,
        data: editingPageData
      };
      
      // Update in AsyncStorage
      const updatedPages = userPages.map(p => 
        p.id === currentProfile ? updatedPage : p
      );
      setUserPages(updatedPages);
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('user_pages', JSON.stringify(updatedPages));
      
      setIsEditingPage(false);
      setEditingPageData(null);
      
      console.log('Page saved successfully');
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingPage(false);
    setEditingPageData(null);
  };

  const renderProfileContent = () => {
    if (currentProfile === 'personal') {
      return (
        <>
          {renderProfileHeader()}
          {renderPersonalInfoCard()}
          {renderPostsSection()}
          {renderCricketStats()}
          {renderSkillsSection()}
          {renderExperienceSection()}
          {renderAchievementsSection()}
          {renderAwardsSection()}
          {renderUpcomingMatches()}
        </>
      );
    } else {
      // Render page content based on type
      const page = userPages.find(p => p.id === currentProfile);
      if (page) {
        return renderPageContent(page);
      }
    }
  };

  const renderPageContent = (page: UserPage) => {
    switch (page.type) {
      case 'academy':
        return renderAcademyContent(page);
      case 'community':
        return renderCommunityContent(page);
      case 'venue':
        return renderVenueContent(page);
      default:
        return null;
    }
  };

  const renderAcademyContent = (page: UserPage) => {
    const academyData = isEditingPage ? editingPageData : (page.data as AcademyData);
    return (
      <>
        {/* Academy Header */}
        <View style={[styles.pageHeader, { 
          backgroundColor: getColors(colorScheme).card,
          borderColor: getColors(colorScheme).border
        }]}>
          <View style={styles.pageInfo}>
            {isEditingPage ? (
              <>
                <TextInput
                  style={[styles.pageNameInput, { 
                    color: getColors(colorScheme).text,
                    borderColor: getColors(colorScheme).border
                  }]}
                  value={academyData.name}
                  onChangeText={(text) => setEditingPageData({...academyData, name: text})}
                  placeholder="Academy Name"
                />
                <TextInput
                  style={[styles.pageDescriptionInput, { 
                    color: getColors(colorScheme).text,
                    borderColor: getColors(colorScheme).border
                  }]}
                  value={academyData.description}
                  onChangeText={(text) => setEditingPageData({...academyData, description: text})}
                  placeholder="Academy Description"
                  multiline
                />
                <View style={styles.editStatsRow}>
                  <TextInput
                    style={[styles.editStatInput, { 
                      color: getColors(colorScheme).text,
                      borderColor: getColors(colorScheme).border
                    }]}
                    value={academyData.students.toString()}
                    onChangeText={(text) => setEditingPageData({...academyData, students: parseInt(text) || 0})}
                    placeholder="Students"
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.editStatInput, { 
                      color: getColors(colorScheme).text,
                      borderColor: getColors(colorScheme).border
                    }]}
                    value={academyData.successRate.toString()}
                    onChangeText={(text) => setEditingPageData({...academyData, successRate: parseInt(text) || 0})}
                    placeholder="Success Rate %"
                    keyboardType="numeric"
                  />
                </View>
              </>
            ) : (
              <>
                <Text style={[styles.pageName, { 
                  color: getColors(colorScheme).text 
                }]}>
                  🏫 {academyData.name}
                </Text>
                <Text style={[styles.pageDescription, { 
                  color: getColors(colorScheme).text 
                }]}>
                  {academyData.description}
                </Text>
                <View style={styles.pageStats}>
                  <Text style={[styles.pageStat, { 
                    color: getColors(colorScheme).text 
                  }]}>
                    👥 {academyData.students} Students
                  </Text>
                  <Text style={[styles.pageStat, { 
                    color: getColors(colorScheme).text 
                  }]}>
                    🏆 {academyData.successRate}% Success Rate
                  </Text>
                </View>
              </>
            )}
          </View>
          
          {/* Edit/Save/Cancel Buttons */}
          <View style={styles.pageActionButtons}>
            {isEditingPage ? (
              <>
                <TouchableOpacity
                  style={[styles.pageSaveButton, { backgroundColor: '#10B981' }]}
                  onPress={handleSavePage}
                >
                  <Text style={styles.pageSaveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.pageCancelButton, { backgroundColor: '#EF4444' }]}
                  onPress={handleCancelEdit}
                >
                  <Text style={styles.pageCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.pageEditButton, { backgroundColor: getColors(colorScheme).tint }]}
                onPress={handleEditPage}
              >
                <Text style={styles.pageEditButtonText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Academy Facilities */}
        <View style={styles.pageSection}>
          <Text style={[styles.sectionTitle, { 
            color: getColors(colorScheme).text 
          }]}>
            Facilities
          </Text>
          {isEditingPage ? (
            <View style={styles.editSection}>
              {academyData.facilities?.map((facility, index) => (
                <View key={facility.id || index} style={[styles.editItem, { 
                  backgroundColor: getColors(colorScheme).card,
                  borderColor: getColors(colorScheme).border
                }]}>
                  <TextInput
                    style={[styles.editItemInput, { 
                      color: getColors(colorScheme).text,
                      borderColor: getColors(colorScheme).border
                    }]}
                    value={facility.name}
                    onChangeText={(text) => {
                      const updatedFacilities = [...(academyData.facilities || [])];
                      updatedFacilities[index] = { ...facility, name: text };
                      setEditingPageData({...academyData, facilities: updatedFacilities});
                    }}
                    placeholder="Facility Name"
                  />
                  <TextInput
                    style={[styles.editItemInput, { 
                      color: getColors(colorScheme).text,
                      borderColor: getColors(colorScheme).border
                    }]}
                    value={facility.description}
                    onChangeText={(text) => {
                      const updatedFacilities = [...(academyData.facilities || [])];
                      updatedFacilities[index] = { ...facility, description: text };
                      setEditingPageData({...academyData, facilities: updatedFacilities});
                    }}
                    placeholder="Description"
                    multiline
                  />
                  <TouchableOpacity
                    style={[styles.removeButton, { backgroundColor: '#EF4444' }]}
                    onPress={() => {
                      const updatedFacilities = academyData.facilities?.filter((_, i) => i !== index) || [];
                      setEditingPageData({...academyData, facilities: updatedFacilities});
                    }}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: getColors(colorScheme).tint }]}
                onPress={() => {
                  const newFacility = {
                    id: Date.now().toString(),
                    name: '',
                    description: '',
                    available: true
                  };
                  const updatedFacilities = [...(academyData.facilities || []), newFacility];
                  setEditingPageData({...academyData, facilities: updatedFacilities});
                }}
              >
                <Text style={styles.addButtonText}>+ Add Facility</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.facilitiesGrid}>
              {academyData.facilities?.map((facility, index) => (
                <View key={facility.id || index} style={[styles.facilityItem, { 
                  backgroundColor: getColors(colorScheme).card,
                  borderColor: getColors(colorScheme).border
                }]}>
                  <Text style={[styles.facilityText, { 
                    color: getColors(colorScheme).text 
                  }]}>
                    {facility.name}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Academy Coaches */}
        <View style={styles.pageSection}>
          <Text style={[styles.sectionTitle, { 
            color: getColors(colorScheme).text 
          }]}>
            Coaches ({academyData.coaches?.length || 0})
          </Text>
          {isEditingPage ? (
            <View style={styles.editSection}>
              {academyData.coaches?.map((coach, index) => (
                <View key={coach.id || index} style={[styles.editItem, { 
                  backgroundColor: getColors(colorScheme).card,
                  borderColor: getColors(colorScheme).border
                }]}>
                  <TextInput
                    style={[styles.editItemInput, { 
                      color: getColors(colorScheme).text,
                      borderColor: getColors(colorScheme).border
                    }]}
                    value={coach.name}
                    onChangeText={(text) => {
                      const updatedCoaches = [...(academyData.coaches || [])];
                      updatedCoaches[index] = { ...coach, name: text };
                      setEditingPageData({...academyData, coaches: updatedCoaches});
                    }}
                    placeholder="Coach Name"
                  />
                  <TextInput
                    style={[styles.editItemInput, { 
                      color: getColors(colorScheme).text,
                      borderColor: getColors(colorScheme).border
                    }]}
                    value={coach.role}
                    onChangeText={(text) => {
                      const updatedCoaches = [...(academyData.coaches || [])];
                      updatedCoaches[index] = { ...coach, role: text };
                      setEditingPageData({...academyData, coaches: updatedCoaches});
                    }}
                    placeholder="Role"
                  />
                  <TextInput
                    style={[styles.editItemInput, { 
                      color: getColors(colorScheme).text,
                      borderColor: getColors(colorScheme).border
                    }]}
                    value={coach.experience.toString()}
                    onChangeText={(text) => {
                      const updatedCoaches = [...(academyData.coaches || [])];
                      updatedCoaches[index] = { ...coach, experience: parseInt(text) || 0 };
                      setEditingPageData({...academyData, coaches: updatedCoaches});
                    }}
                    placeholder="Experience (years)"
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    style={[styles.removeButton, { backgroundColor: '#EF4444' }]}
                    onPress={() => {
                      const updatedCoaches = academyData.coaches?.filter((_, i) => i !== index) || [];
                      setEditingPageData({...academyData, coaches: updatedCoaches});
                    }}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: getColors(colorScheme).tint }]}
                onPress={() => {
                  const newCoach = {
                    id: Date.now().toString(),
                    name: '',
                    role: '',
                    experience: 0,
                    specialization: [],
                    verified: false
                  };
                  const updatedCoaches = [...(academyData.coaches || []), newCoach];
                  setEditingPageData({...academyData, coaches: updatedCoaches});
                }}
              >
                <Text style={styles.addButtonText}>+ Add Coach</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.coachesCard, { 
              backgroundColor: getColors(colorScheme).card,
              borderColor: getColors(colorScheme).border
            }]}>
              <Text style={[styles.coachesText, { 
                color: getColors(colorScheme).text 
              }]}>
                Meet our experienced coaching staff
              </Text>
            </View>
          )}
        </View>

        {/* Academy Programs */}
        <View style={styles.pageSection}>
          <Text style={[styles.sectionTitle, { 
            color: getColors(colorScheme).text 
          }]}>
            Programs ({academyData.programs?.length || 0})
          </Text>
          {isEditingPage ? (
            <View style={styles.editSection}>
              {academyData.programs?.map((program, index) => (
                <View key={program.id || index} style={[styles.editItem, { 
                  backgroundColor: getColors(colorScheme).card,
                  borderColor: getColors(colorScheme).border
                }]}>
                  <TextInput
                    style={[styles.editItemInput, { 
                      color: getColors(colorScheme).text,
                      borderColor: getColors(colorScheme).border
                    }]}
                    value={program.name}
                    onChangeText={(text) => {
                      const updatedPrograms = [...(academyData.programs || [])];
                      updatedPrograms[index] = { ...program, name: text };
                      setEditingPageData({...academyData, programs: updatedPrograms});
                    }}
                    placeholder="Program Name"
                  />
                  <TextInput
                    style={[styles.editItemInput, { 
                      color: getColors(colorScheme).text,
                      borderColor: getColors(colorScheme).border
                    }]}
                    value={program.duration}
                    onChangeText={(text) => {
                      const updatedPrograms = [...(academyData.programs || [])];
                      updatedPrograms[index] = { ...program, duration: text };
                      setEditingPageData({...academyData, programs: updatedPrograms});
                    }}
                    placeholder="Duration"
                  />
                  <TextInput
                    style={[styles.editItemInput, { 
                      color: getColors(colorScheme).text,
                      borderColor: getColors(colorScheme).border
                    }]}
                    value={program.level}
                    onChangeText={(text) => {
                      const updatedPrograms = [...(academyData.programs || [])];
                      updatedPrograms[index] = { ...program, level: text };
                      setEditingPageData({...academyData, programs: updatedPrograms});
                    }}
                    placeholder="Level"
                  />
                  <TextInput
                    style={[styles.editItemInput, { 
                      color: getColors(colorScheme).text,
                      borderColor: getColors(colorScheme).border
                    }]}
                    value={program.fee.toString()}
                    onChangeText={(text) => {
                      const updatedPrograms = [...(academyData.programs || [])];
                      updatedPrograms[index] = { ...program, fee: parseInt(text) || 0 };
                      setEditingPageData({...academyData, programs: updatedPrograms});
                    }}
                    placeholder="Fee"
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.editItemInput, { 
                      color: getColors(colorScheme).text,
                      borderColor: getColors(colorScheme).border
                    }]}
                    value={program.description}
                    onChangeText={(text) => {
                      const updatedPrograms = [...(academyData.programs || [])];
                      updatedPrograms[index] = { ...program, description: text };
                      setEditingPageData({...academyData, programs: updatedPrograms});
                    }}
                    placeholder="Description"
                    multiline
                  />
                  <TouchableOpacity
                    style={[styles.removeButton, { backgroundColor: '#EF4444' }]}
                    onPress={() => {
                      const updatedPrograms = academyData.programs?.filter((_, i) => i !== index) || [];
                      setEditingPageData({...academyData, programs: updatedPrograms});
                    }}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: getColors(colorScheme).tint }]}
                onPress={() => {
                  const newProgram = {
                    id: Date.now().toString(),
                    name: '',
                    duration: '',
                    level: '',
                    fee: 0,
                    description: '',
                    enrolled: 0,
                    maxStudents: 0
                  };
                  const updatedPrograms = [...(academyData.programs || []), newProgram];
                  setEditingPageData({...academyData, programs: updatedPrograms});
                }}
              >
                <Text style={styles.addButtonText}>+ Add Program</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.programsCard, { 
              backgroundColor: getColors(colorScheme).card,
              borderColor: getColors(colorScheme).border
            }]}>
              <Text style={[styles.programsText, { 
                color: getColors(colorScheme).text 
              }]}>
                Discover our comprehensive training programs
              </Text>
            </View>
          )}
        </View>
      </>
    );
  };

  const renderCommunityContent = (page: UserPage) => {
    const communityData = isEditingPage ? editingPageData : (page.data as CommunityData);
    return (
      <>
        {/* Community Header */}
        <View style={[styles.pageHeader, { 
          backgroundColor: getColors(colorScheme).card,
          borderColor: getColors(colorScheme).border
        }]}>
          <View style={styles.pageInfo}>
            {isEditingPage ? (
              <>
                <TextInput
                  style={[styles.pageNameInput, { 
                    color: getColors(colorScheme).text,
                    borderColor: getColors(colorScheme).border
                  }]}
                  value={communityData.name}
                  onChangeText={(text) => setEditingPageData({...communityData, name: text})}
                  placeholder="Community Name"
                />
                <TextInput
                  style={[styles.pageDescriptionInput, { 
                    color: getColors(colorScheme).text,
                    borderColor: getColors(colorScheme).border
                  }]}
                  value={communityData.description}
                  onChangeText={(text) => setEditingPageData({...communityData, description: text})}
                  placeholder="Community Description"
                  multiline
                />
                <View style={styles.editStatsRow}>
                  <TextInput
                    style={[styles.editStatInput, { 
                      color: getColors(colorScheme).text,
                      borderColor: getColors(colorScheme).border
                    }]}
                    value={communityData.membersCount?.toString() || '0'}
                    onChangeText={(text) => setEditingPageData({...communityData, membersCount: parseInt(text) || 0})}
                    placeholder="Members Count"
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.editStatInput, { 
                      color: getColors(colorScheme).text,
                      borderColor: getColors(colorScheme).border
                    }]}
                    value={communityData.location || ''}
                    onChangeText={(text) => setEditingPageData({...communityData, location: text})}
                    placeholder="Location"
                  />
                </View>
              </>
            ) : (
              <>
                <Text style={[styles.pageName, { 
                  color: getColors(colorScheme).text 
                }]}>
                  👥 {communityData.name}
                </Text>
                <Text style={[styles.pageDescription, { 
                  color: getColors(colorScheme).text 
                }]}>
                  {communityData.description}
                </Text>
                <View style={styles.pageStats}>
                  <Text style={[styles.pageStat, { 
                    color: getColors(colorScheme).text 
                  }]}>
                    👥 {communityData.membersCount || 0} Members
                  </Text>
                  <Text style={[styles.pageStat, { 
                    color: getColors(colorScheme).text 
                  }]}>
                    📍 {communityData.location || 'Not specified'}
                  </Text>
                </View>
              </>
            )}
          </View>
          
          {/* Edit/Save/Cancel Buttons */}
          <View style={styles.pageActionButtons}>
            {isEditingPage ? (
              <>
                <TouchableOpacity
                  style={[styles.pageSaveButton, { backgroundColor: '#10B981' }]}
                  onPress={handleSavePage}
                >
                  <Text style={styles.pageSaveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.pageCancelButton, { backgroundColor: '#EF4444' }]}
                  onPress={handleCancelEdit}
                >
                  <Text style={styles.pageCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.pageEditButton, { backgroundColor: getColors(colorScheme).tint }]}
                onPress={handleEditPage}
              >
                <Text style={styles.pageEditButtonText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Community Rules */}
        <View style={styles.pageSection}>
          <Text style={[styles.sectionTitle, { 
            color: getColors(colorScheme).text 
          }]}>
            Community Rules ({communityData.rules?.length || 0})
          </Text>
          {isEditingPage ? (
            <View style={styles.editSection}>
              {communityData.rules?.map((rule, index) => (
                <View key={index} style={[styles.editItem, { 
                  backgroundColor: getColors(colorScheme).card,
                  borderColor: getColors(colorScheme).border
                }]}>
                  <TextInput
                    style={[styles.editItemInput, { 
                      color: getColors(colorScheme).text,
                      borderColor: getColors(colorScheme).border
                    }]}
                    value={rule}
                    onChangeText={(text) => {
                      const updatedRules = [...(communityData.rules || [])];
                      updatedRules[index] = text;
                      setEditingPageData({...communityData, rules: updatedRules});
                    }}
                    placeholder="Rule"
                    multiline
                  />
                  <TouchableOpacity
                    style={[styles.removeButton, { backgroundColor: '#EF4444' }]}
                    onPress={() => {
                      const updatedRules = communityData.rules?.filter((_, i) => i !== index) || [];
                      setEditingPageData({...communityData, rules: updatedRules});
                    }}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: getColors(colorScheme).tint }]}
                onPress={() => {
                  const updatedRules = [...(communityData.rules || []), ''];
                  setEditingPageData({...communityData, rules: updatedRules});
                }}
              >
                <Text style={styles.addButtonText}>+ Add Rule</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {communityData.rules?.map((rule, index) => (
                <View key={index} style={[styles.ruleItem, { 
                  backgroundColor: getColors(colorScheme).card,
                  borderColor: getColors(colorScheme).border
                }]}>
                  <Text style={[styles.ruleText, { 
                    color: getColors(colorScheme).text 
                  }]}>
                    • {rule}
                  </Text>
                </View>
              ))}
            </>
          )}
        </View>

        {/* Community Events */}
        <View style={styles.pageSection}>
          <Text style={[styles.sectionTitle, { 
            color: getColors(colorScheme).text 
          }]}>
            Upcoming Events
          </Text>
          <View style={[styles.eventsCard, { 
            backgroundColor: getColors(colorScheme).card,
            borderColor: getColors(colorScheme).border
          }]}>
            <Text style={[styles.eventsText, { 
              color: getColors(colorScheme).text 
            }]}>
              Join our community events and activities
            </Text>
          </View>
        </View>
      </>
    );
  };

  const renderVenueContent = (page: UserPage) => {
    const venueData = isEditingPage ? editingPageData : (page.data as VenueData);
    return (
      <>
        {/* Venue Header */}
        <View style={[styles.pageHeader, { 
          backgroundColor: getColors(colorScheme).card,
          borderColor: getColors(colorScheme).border
        }]}>
          <View style={styles.pageInfo}>
            {isEditingPage ? (
              <>
                <TextInput
                  style={[styles.pageNameInput, { 
                    color: getColors(colorScheme).text,
                    borderColor: getColors(colorScheme).border
                  }]}
                  value={venueData.name}
                  onChangeText={(text) => setEditingPageData({...venueData, name: text})}
                  placeholder="Venue Name"
                />
                <TextInput
                  style={[styles.pageDescriptionInput, { 
                    color: getColors(colorScheme).text,
                    borderColor: getColors(colorScheme).border
                  }]}
                  value={venueData.description}
                  onChangeText={(text) => setEditingPageData({...venueData, description: text})}
                  placeholder="Venue Description"
                  multiline
                />
                <View style={styles.editStatsRow}>
                  <TextInput
                    style={[styles.editStatInput, { 
                      color: getColors(colorScheme).text,
                      borderColor: getColors(colorScheme).border
                    }]}
                    value={venueData.capacity?.toString() || '0'}
                    onChangeText={(text) => setEditingPageData({...venueData, capacity: parseInt(text) || 0})}
                    placeholder="Capacity"
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.editStatInput, { 
                      color: getColors(colorScheme).text,
                      borderColor: getColors(colorScheme).border
                    }]}
                    value={venueData.address || ''}
                    onChangeText={(text) => setEditingPageData({...venueData, address: text})}
                    placeholder="Address"
                  />
                </View>
              </>
            ) : (
              <>
                <Text style={[styles.pageName, { 
                  color: getColors(colorScheme).text 
                }]}>
                  🏟️ {venueData.name}
                </Text>
                <Text style={[styles.pageDescription, { 
                  color: getColors(colorScheme).text 
                }]}>
                  {venueData.description}
                </Text>
                <View style={styles.pageStats}>
                  <Text style={[styles.pageStat, { 
                    color: getColors(colorScheme).text 
                  }]}>
                    👥 Capacity: {venueData.capacity || 0}
                  </Text>
                  <Text style={[styles.pageStat, { 
                    color: getColors(colorScheme).text 
                  }]}>
                    📍 {venueData.address || 'Not specified'}
                  </Text>
                </View>
              </>
            )}
          </View>
          
          {/* Edit/Save/Cancel Buttons */}
          <View style={styles.pageActionButtons}>
            {isEditingPage ? (
              <>
                <TouchableOpacity
                  style={[styles.pageSaveButton, { backgroundColor: '#10B981' }]}
                  onPress={handleSavePage}
                >
                  <Text style={styles.pageSaveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.pageCancelButton, { backgroundColor: '#EF4444' }]}
                  onPress={handleCancelEdit}
                >
                  <Text style={styles.pageCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.pageEditButton, { backgroundColor: getColors(colorScheme).tint }]}
                onPress={handleEditPage}
              >
                <Text style={styles.pageEditButtonText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Venue Amenities */}
        <View style={styles.pageSection}>
          <Text style={[styles.sectionTitle, { 
            color: getColors(colorScheme).text 
          }]}>
            Amenities ({venueData.facilities?.length || 0})
          </Text>
          {isEditingPage ? (
            <View style={styles.editSection}>
              {venueData.facilities?.map((facility, index) => (
                <View key={facility.id || index} style={[styles.editItem, { 
                  backgroundColor: getColors(colorScheme).card,
                  borderColor: getColors(colorScheme).border
                }]}>
                  <TextInput
                    style={[styles.editItemInput, { 
                      color: getColors(colorScheme).text,
                      borderColor: getColors(colorScheme).border
                    }]}
                    value={facility.name}
                    onChangeText={(text) => {
                      const updatedFacilities = [...(venueData.facilities || [])];
                      updatedFacilities[index] = { ...facility, name: text };
                      setEditingPageData({...venueData, facilities: updatedFacilities});
                    }}
                    placeholder="Amenity Name"
                  />
                  <TextInput
                    style={[styles.editItemInput, { 
                      color: getColors(colorScheme).text,
                      borderColor: getColors(colorScheme).border
                    }]}
                    value={facility.description}
                    onChangeText={(text) => {
                      const updatedFacilities = [...(venueData.facilities || [])];
                      updatedFacilities[index] = { ...facility, description: text };
                      setEditingPageData({...venueData, facilities: updatedFacilities});
                    }}
                    placeholder="Description"
                    multiline
                  />
                  <TouchableOpacity
                    style={[styles.removeButton, { backgroundColor: '#EF4444' }]}
                    onPress={() => {
                      const updatedFacilities = venueData.facilities?.filter((_, i) => i !== index) || [];
                      setEditingPageData({...venueData, facilities: updatedFacilities});
                    }}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: getColors(colorScheme).tint }]}
                onPress={() => {
                  const newFacility = {
                    id: Date.now().toString(),
                    name: '',
                    description: '',
                    available: true
                  };
                  const updatedFacilities = [...(venueData.facilities || []), newFacility];
                  setEditingPageData({...venueData, facilities: updatedFacilities});
                }}
              >
                <Text style={styles.addButtonText}>+ Add Amenity</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.amenitiesGrid}>
              {venueData.facilities?.map((facility, index) => (
                <View key={facility.id || index} style={[styles.amenityItem, { 
                  backgroundColor: getColors(colorScheme).card,
                  borderColor: getColors(colorScheme).border
                }]}>
                  <Text style={[styles.amenityText, { 
                    color: getColors(colorScheme).text 
                  }]}>
                    {facility.name}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Booking Information */}
        <View style={styles.pageSection}>
          <Text style={[styles.sectionTitle, { 
            color: getColors(colorScheme).text 
          }]}>
            Booking Information
          </Text>
          <View style={[styles.bookingInfo, { 
            backgroundColor: getColors(colorScheme).card,
            borderColor: getColors(colorScheme).border
          }]}>
            <Text style={[styles.bookingText, { 
              color: getColors(colorScheme).text 
            }]}>
              {venueData.bookingInfo}
            </Text>
          </View>
        </View>
      </>
    );
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

  // Instagram-style header with user name and burger menu
  const renderInstagramHeader = () => (
    <View style={[styles.instagramHeader, { 
      backgroundColor: getColors(colorScheme).background,
      borderBottomColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
    }]}>
      {/* Profile Selector Button */}
      <TouchableOpacity 
        style={styles.profileSelectorButton}
        onPress={() => setShowProfileSelector(!showProfileSelector)}
      >
        <Text style={[styles.headerTitle, { 
          color: getColors(colorScheme).text 
        }]}>
          {getCurrentProfileName()}
        </Text>
        <Text style={[styles.dropdownArrow, { 
          color: getColors(colorScheme).text 
        }]}>
          ▼
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.burgerMenuButton}
        onPress={() => setShowDropdownMenu(!showDropdownMenu)}
      >
        <Text style={[styles.burgerIcon, { 
          color: getColors(colorScheme).text 
        }]}>
          ☰
        </Text>
      </TouchableOpacity>

      {/* Dropdown Menu */}
      {showDropdownMenu && (
        <Modal
          transparent={true}
          visible={showDropdownMenu}
          animationType="fade"
          onRequestClose={() => setShowDropdownMenu(false)}
        >
          <TouchableOpacity 
            style={styles.dropdownOverlay}
            activeOpacity={1}
            onPress={() => setShowDropdownMenu(false)}
          >
            <View style={[styles.dropdownMenu, { 
              backgroundColor: getColors(colorScheme).card,
              borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
            }]}>
              <TouchableOpacity 
                style={styles.dropdownItem}
                onPress={() => {
                  setShowDropdownMenu(false);
                  router.push('/settings');
                }}
              >
                <Text style={[styles.dropdownText, { 
                  color: getColors(colorScheme).text 
                }]}>
                  ⚙️ Settings
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.dropdownItem}
                onPress={() => {
                  setShowDropdownMenu(false);
                  router.push('/about');
                }}
              >
                <Text style={[styles.dropdownText, { 
                  color: getColors(colorScheme).text 
                }]}>
                  ℹ️ About
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.dropdownItem}
                onPress={() => {
                  setShowDropdownMenu(false);
                  handleLogout();
                }}
              >
                <Text style={[styles.dropdownText, { 
                  color: '#ff4444' 
                }]}>
                  🚪 Logout
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Profile Selector Dropdown */}
      {showProfileSelector && (
        <Modal
          transparent={true}
          visible={showProfileSelector}
          animationType="fade"
          onRequestClose={() => setShowProfileSelector(false)}
        >
          <TouchableOpacity 
            style={styles.profileSelectorOverlay}
            activeOpacity={1}
            onPress={() => setShowProfileSelector(false)}
          >
            <View style={[styles.profileSelectorMenu, { 
              backgroundColor: getColors(colorScheme).card,
              borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
            }]}>
              {/* Personal Profile Option */}
              <TouchableOpacity
                style={styles.profileOption}
                onPress={() => handleProfileSwitch('personal')}
              >
                <View style={styles.profileOptionContent}>
                  <Text style={styles.profileOptionIcon}>👤</Text>
                  <View style={styles.profileOptionText}>
                    <Text style={[styles.profileOptionName, { 
                      color: getColors(colorScheme).text 
                    }]}>
                      {user.fullName}
                    </Text>
                    <Text style={[styles.profileOptionType, { 
                      color: getColors(colorScheme).text 
                    }]}>
                      Personal Profile
                    </Text>
                  </View>
                  {currentProfile === 'personal' && (
                    <Text style={styles.selectedIndicator}>✓</Text>
                  )}
                </View>
              </TouchableOpacity>

              {/* Academy Pages */}
              {userPages.filter(page => page.type === 'academy').map(page => (
                <TouchableOpacity
                  key={page.id}
                  style={styles.profileOption}
                  onPress={() => handleProfileSwitch(page.id)}
                >
                  <View style={styles.profileOptionContent}>
                    <Text style={styles.profileOptionIcon}>🏫</Text>
                    <View style={styles.profileOptionText}>
                      <Text style={[styles.profileOptionName, { 
                        color: getColors(colorScheme).text 
                      }]}>
                        {page.name}
                      </Text>
                      <Text style={[styles.profileOptionType, { 
                        color: getColors(colorScheme).text 
                      }]}>
                        Academy
                      </Text>
                    </View>
                    {currentProfile === page.id && (
                      <Text style={styles.selectedIndicator}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}

              {/* Community Pages */}
              {userPages.filter(page => page.type === 'community').map(page => (
                <TouchableOpacity
                  key={page.id}
                  style={styles.profileOption}
                  onPress={() => handleProfileSwitch(page.id)}
                >
                  <View style={styles.profileOptionContent}>
                    <Text style={styles.profileOptionIcon}>👥</Text>
                    <View style={styles.profileOptionText}>
                      <Text style={[styles.profileOptionName, { 
                        color: getColors(colorScheme).text 
                      }]}>
                        {page.name}
                      </Text>
                      <Text style={[styles.profileOptionType, { 
                        color: getColors(colorScheme).text 
                      }]}>
                        Community
                      </Text>
                    </View>
                    {currentProfile === page.id && (
                      <Text style={styles.selectedIndicator}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}

              {/* Venue Pages */}
              {userPages.filter(page => page.type === 'venue').map(page => (
                <TouchableOpacity
                  key={page.id}
                  style={styles.profileOption}
                  onPress={() => handleProfileSwitch(page.id)}
                >
                  <View style={styles.profileOptionContent}>
                    <Text style={styles.profileOptionIcon}>🏟️</Text>
                    <View style={styles.profileOptionText}>
                      <Text style={[styles.profileOptionName, { 
                        color: getColors(colorScheme).text 
                      }]}>
                        {page.name}
                      </Text>
                      <Text style={[styles.profileOptionType, { 
                        color: getColors(colorScheme).text 
                      }]}>
                        Venue
                      </Text>
                    </View>
                    {currentProfile === page.id && (
                      <Text style={styles.selectedIndicator}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}

              {/* Add New Page Button */}
              <TouchableOpacity
                style={styles.addPageButton}
                onPress={() => {
                  console.log('Add New Page button pressed');
                  setShowProfileSelector(false);
                  // Small delay to ensure profile selector modal closes before page type selector opens
                  setTimeout(() => {
                    setShowPageTypeSelector(true);
                  }, 100);
                }}
              >
                <Text style={styles.addPageText}>+ Add New Page</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { 
      backgroundColor: getColors(colorScheme).background,
      paddingTop: StatusBar.currentHeight || 0
    }]}>
      {/* Instagram-style Header */}
      {renderInstagramHeader()}
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
        {renderProfileContent()}
        
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
      
      <PageTypeSelector
        visible={showPageTypeSelector}
        onClose={() => setShowPageTypeSelector(false)}
        onSelectType={handlePageTypeSelect}
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
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButtonText: {
    fontSize: 18,
    color: '#374151',
  },
  // Instagram-style header styles
  instagramHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  burgerMenuButton: {
    padding: 8,
  },
  burgerIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 16,
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: '500',
  },
  // Instagram-style profile switching styles
  profileSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  dropdownArrow: {
    fontSize: 12,
    marginLeft: 8,
    opacity: 0.7,
  },
  profileSelectorOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 60,
  },
  profileSelectorMenu: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 280,
    maxWidth: 320,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  profileOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileOptionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  profileOptionText: {
    flex: 1,
  },
  profileOptionName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  profileOptionType: {
    fontSize: 12,
    opacity: 0.7,
  },
  selectedIndicator: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  addPageButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  addPageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
  },
  // Page content styles
  pageHeader: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pageInfo: {
    alignItems: 'center',
  },
  pageName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  pageDescription: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  pageStats: {
    flexDirection: 'row',
    gap: 16,
  },
  pageStat: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
  },
  pageSection: {
    marginBottom: 24,
  },
  facilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  facilityItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  facilityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  coachesCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  coachesText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  programsCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  programsText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  amenityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  ruleItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  ruleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  eventsCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  eventsText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  bookingInfo: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  bookingText: {
    fontSize: 14,
    lineHeight: 20,
  },
  // Edit functionality styles
  pageActionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
  },
  pageEditButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageEditButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  pageSaveButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageSaveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  pageCancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageCancelButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  pageNameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pageDescriptionInput: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 22,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 60,
  },
  editStatsRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  editStatInput: {
    fontSize: 14,
    fontWeight: '600',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 120,
    textAlign: 'center',
  },
  // Comprehensive edit functionality styles
  editSection: {
    gap: 12,
  },
  editItem: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  editItemInput: {
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    minHeight: 40,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});
