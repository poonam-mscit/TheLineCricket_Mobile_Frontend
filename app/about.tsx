import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import { router } from 'expo-router';
import React from 'react';
import {
    Alert,
    Linking,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

export default function AboutScreen() {
  const colorScheme = useColorScheme();

  const handleBackPress = () => {
    router.back();
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Choose how you\'d like to contact us:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Email', 
          onPress: () => {
            Linking.openURL('mailto:support@thelinecricket.com');
          }
        },
        { 
          text: 'Phone', 
          onPress: () => {
            Linking.openURL('tel:+1234567890');
          }
        }
      ]
    );
  };

  const handleOpenWebsite = () => {
    Linking.openURL('https://www.thelinecricket.com');
  };

  const handleOpenSocialMedia = (platform: string) => {
    const urls = {
      instagram: 'https://instagram.com/thelinecricket',
      facebook: 'https://facebook.com/thelinecricket',
      twitter: 'https://twitter.com/thelinecricket',
      youtube: 'https://youtube.com/thelinecricket'
    };
    
    Linking.openURL(urls[platform as keyof typeof urls]);
  };

  const handleRateApp = () => {
    Alert.alert(
      'Rate TheLineCricket',
      'Would you like to rate our app?',
      [
        { text: 'Not Now', style: 'cancel' },
        { 
          text: 'Rate App', 
          onPress: () => {
            // In a real app, this would open the app store
            Alert.alert('Thank You!', 'Thank you for your feedback!');
          }
        }
      ]
    );
  };

  const handleShareApp = () => {
    Alert.alert(
      'Share TheLineCricket',
      'Share the app with your friends!',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Share', 
          onPress: () => {
            // In a real app, this would use the native share functionality
            Alert.alert('Shared!', 'App shared successfully!');
          }
        }
      ]
    );
  };

  const renderHeader = () => (
    <View style={[styles.header, { 
      backgroundColor: getColors(colorScheme).background,
      borderBottomColor: getColors(colorScheme).border
    }]}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={handleBackPress}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { 
        color: getColors(colorScheme).text 
      }]}>
        About
      </Text>
      <View style={styles.placeholder} />
    </View>
  );

  const renderInfoCard = (title: string, content: string, icon: string) => (
    <View style={[styles.infoCard, { 
      backgroundColor: getColors(colorScheme).card,
      borderColor: getColors(colorScheme).border
    }]}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <View style={styles.infoContent}>
        <Text style={[styles.infoTitle, { 
          color: getColors(colorScheme).text 
        }]}>
          {title}
        </Text>
        <Text style={[styles.infoText, { 
          color: getColors(colorScheme).text 
        }]}>
          {content}
        </Text>
      </View>
    </View>
  );

  const renderActionButton = (
    title: string,
    subtitle: string,
    onPress: () => void,
    icon: string,
    isDestructive: boolean = false
  ) => (
    <TouchableOpacity 
      style={[styles.actionButton, { 
        backgroundColor: getColors(colorScheme).card,
        borderColor: getColors(colorScheme).border
      }]}
      onPress={onPress}
    >
      <Text style={styles.actionIcon}>{icon}</Text>
      <View style={styles.actionContent}>
        <Text style={[styles.actionTitle, { 
          color: isDestructive ? '#EF4444' : getColors(colorScheme).text 
        }]}>
          {title}
        </Text>
        <Text style={[styles.actionSubtitle, { 
          color: getColors(colorScheme).text 
        }]}>
          {subtitle}
        </Text>
      </View>
      <Text style={[styles.actionArrow, { 
        color: getColors(colorScheme).text 
      }]}>
        ›
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { 
      backgroundColor: getColors(colorScheme).background,
      paddingTop: StatusBar.currentHeight || 0
    }]}>
      {renderHeader()}
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* App Logo and Info */}
        <View style={styles.appInfoSection}>
          <View style={[styles.appLogo, { 
            backgroundColor: getColors(colorScheme).tint 
          }]}>
            <Text style={styles.appLogoText}>🏏</Text>
          </View>
          <Text style={[styles.appName, { 
            color: getColors(colorScheme).text 
          }]}>
            TheLineCricket
          </Text>
          <Text style={[styles.appTagline, { 
            color: getColors(colorScheme).text 
          }]}>
            Your Ultimate Cricket Companion
          </Text>
          <Text style={[styles.appVersion, { 
            color: getColors(colorScheme).text 
          }]}>
            Version 1.0.0
          </Text>
        </View>

        {/* App Description */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: getColors(colorScheme).text 
          }]}>
            About TheLineCricket
          </Text>
          
          {renderInfoCard(
            'Mission',
            'Connecting cricket enthusiasts worldwide through innovative technology and community-driven features.',
            '🎯'
          )}
          
          {renderInfoCard(
            'Features',
            'Live matches, player stats, community discussions, academy management, and venue bookings.',
            '⚡'
          )}
          
          {renderInfoCard(
            'Community',
            'Join thousands of cricket fans, players, coaches, and enthusiasts in our growing community.',
            '👥'
          )}
        </View>

        {/* Team Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: getColors(colorScheme).text 
          }]}>
            Our Team
          </Text>
          
          {renderInfoCard(
            'Development Team',
            'Passionate developers dedicated to creating the best cricket experience.',
            '👨‍💻'
          )}
          
          {renderInfoCard(
            'Cricket Experts',
            'Former players and coaches providing expert insights and guidance.',
            '🏆'
          )}
          
          {renderInfoCard(
            'Community Managers',
            'Ensuring our community remains vibrant and supportive.',
            '🤝'
          )}
        </View>

        {/* Contact & Support */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: getColors(colorScheme).text 
          }]}>
            Contact & Support
          </Text>
          
          {renderActionButton(
            'Contact Support',
            'Get help with any issues or questions',
            handleContactSupport,
            '💬'
          )}
          
          {renderActionButton(
            'Visit Website',
            'Learn more about TheLineCricket',
            handleOpenWebsite,
            '🌐'
          )}
          
          {renderActionButton(
            'Rate App',
            'Help us improve by rating the app',
            handleRateApp,
            '⭐'
          )}
          
          {renderActionButton(
            'Share App',
            'Tell your friends about TheLineCricket',
            handleShareApp,
            '📤'
          )}
        </View>

        {/* Social Media */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: getColors(colorScheme).text 
          }]}>
            Follow Us
          </Text>
          
          <View style={styles.socialMediaGrid}>
            <TouchableOpacity 
              style={[styles.socialButton, { 
                backgroundColor: getColors(colorScheme).card,
                borderColor: getColors(colorScheme).border
              }]}
              onPress={() => handleOpenSocialMedia('instagram')}
            >
              <Text style={styles.socialIcon}>📷</Text>
              <Text style={[styles.socialText, { 
                color: getColors(colorScheme).text 
              }]}>
                Instagram
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.socialButton, { 
                backgroundColor: getColors(colorScheme).card,
                borderColor: getColors(colorScheme).border
              }]}
              onPress={() => handleOpenSocialMedia('facebook')}
            >
              <Text style={styles.socialIcon}>👥</Text>
              <Text style={[styles.socialText, { 
                color: getColors(colorScheme).text 
              }]}>
                Facebook
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.socialButton, { 
                backgroundColor: getColors(colorScheme).card,
                borderColor: getColors(colorScheme).border
              }]}
              onPress={() => handleOpenSocialMedia('twitter')}
            >
              <Text style={styles.socialIcon}>🐦</Text>
              <Text style={[styles.socialText, { 
                color: getColors(colorScheme).text 
              }]}>
                Twitter
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.socialButton, { 
                backgroundColor: getColors(colorScheme).card,
                borderColor: getColors(colorScheme).border
              }]}
              onPress={() => handleOpenSocialMedia('youtube')}
            >
              <Text style={styles.socialIcon}>📺</Text>
              <Text style={[styles.socialText, { 
                color: getColors(colorScheme).text 
              }]}>
                YouTube
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Legal Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: getColors(colorScheme).text 
          }]}>
            Legal
          </Text>
          
          {renderActionButton(
            'Terms of Service',
            'Read our terms and conditions',
            () => Alert.alert('Terms of Service', 'Terms of service coming soon!'),
            '📄'
          )}
          
          {renderActionButton(
            'Privacy Policy',
            'Learn about our privacy practices',
            () => Alert.alert('Privacy Policy', 'Privacy policy coming soon!'),
            '🔒'
          )}
          
          {renderActionButton(
            'Open Source Licenses',
            'View third-party licenses',
            () => Alert.alert('Open Source', 'Open source licenses coming soon!'),
            '📋'
          )}
        </View>

        {/* App Statistics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: getColors(colorScheme).text 
          }]}>
            App Statistics
          </Text>
          
          <View style={styles.statsGrid}>
            <View style={[styles.statItem, { 
              backgroundColor: getColors(colorScheme).card,
              borderColor: getColors(colorScheme).border
            }]}>
              <Text style={[styles.statValue, { 
                color: getColors(colorScheme).text 
              }]}>
                10K+
              </Text>
              <Text style={[styles.statLabel, { 
                color: getColors(colorScheme).text 
              }]}>
                Downloads
              </Text>
            </View>
            
            <View style={[styles.statItem, { 
              backgroundColor: getColors(colorScheme).card,
              borderColor: getColors(colorScheme).border
            }]}>
              <Text style={[styles.statValue, { 
                color: getColors(colorScheme).text 
              }]}>
                4.8★
              </Text>
              <Text style={[styles.statLabel, { 
                color: getColors(colorScheme).text 
              }]}>
                Rating
              </Text>
            </View>
            
            <View style={[styles.statItem, { 
              backgroundColor: getColors(colorScheme).card,
              borderColor: getColors(colorScheme).border
            }]}>
              <Text style={[styles.statValue, { 
                color: getColors(colorScheme).text 
              }]}>
                50+
              </Text>
              <Text style={[styles.statLabel, { 
                color: getColors(colorScheme).text 
              }]}>
                Countries
              </Text>
            </View>
            
            <View style={[styles.statItem, { 
              backgroundColor: getColors(colorScheme).card,
              borderColor: getColors(colorScheme).border
            }]}>
              <Text style={[styles.statValue, { 
                color: getColors(colorScheme).text 
              }]}>
                24/7
              </Text>
              <Text style={[styles.statLabel, { 
                color: getColors(colorScheme).text 
              }]}>
                Support
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { 
            color: getColors(colorScheme).text 
          }]}>
            Made with ❤️ for cricket lovers
          </Text>
          <Text style={[styles.copyrightText, { 
            color: getColors(colorScheme).text 
          }]}>
            © 2024 TheLineCricket. All rights reserved.
          </Text>
        </View>
      </ScrollView>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
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
  placeholder: {
    width: 40,
  },
  appInfoSection: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 24,
  },
  appLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  appLogoText: {
    fontSize: 40,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  appTagline: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 8,
    textAlign: 'center',
  },
  appVersion: {
    fontSize: 14,
    opacity: 0.6,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  actionArrow: {
    fontSize: 18,
    opacity: 0.5,
  },
  socialMediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  socialButton: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  socialIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  socialText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  copyrightText: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
  },
});
