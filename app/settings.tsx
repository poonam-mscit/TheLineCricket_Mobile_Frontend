import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');
  const [locationServices, setLocationServices] = useState(true);
  const [dataSaving, setDataSaving] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

  const handleBackPress = () => {
    router.back();
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
            router.replace('/');
          }
        }
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive', 
          onPress: () => {
            Alert.alert('Success', 'Cache cleared successfully!');
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted.');
            router.replace('/');
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
        Settings
      </Text>
      <View style={styles.placeholder} />
    </View>
  );

  const renderSettingItem = (
    title: string,
    subtitle: string,
    onPress: () => void,
    showArrow: boolean = true,
    isDestructive: boolean = false
  ) => (
    <TouchableOpacity 
      style={[styles.settingItem, { 
        backgroundColor: getColors(colorScheme).card,
        borderColor: getColors(colorScheme).border
      }]}
      onPress={onPress}
    >
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { 
          color: isDestructive ? '#EF4444' : getColors(colorScheme).text 
        }]}>
          {title}
        </Text>
        <Text style={[styles.settingSubtitle, { 
          color: getColors(colorScheme).text 
        }]}>
          {subtitle}
        </Text>
      </View>
      {showArrow && (
        <Text style={[styles.arrow, { 
          color: getColors(colorScheme).text 
        }]}>
          ›
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderSwitchItem = (
    title: string,
    subtitle: string,
    value: boolean,
    onValueChange: (value: boolean) => void
  ) => (
    <View style={[styles.settingItem, { 
      backgroundColor: getColors(colorScheme).card,
      borderColor: getColors(colorScheme).border
    }]}>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { 
          color: getColors(colorScheme).text 
        }]}>
          {title}
        </Text>
        <Text style={[styles.settingSubtitle, { 
          color: getColors(colorScheme).text 
        }]}>
          {subtitle}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#767577', true: '#10B981' }}
        thumbColor={value ? '#ffffff' : '#f4f3f4'}
      />
    </View>
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
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: getColors(colorScheme).text 
          }]}>
            Account
          </Text>
          
          {renderSettingItem(
            'Edit Profile',
            'Update your personal information',
            () => router.push('/edit-profile')
          )}
          
          {renderSettingItem(
            'Change Password',
            'Update your account password',
            () => Alert.alert('Change Password', 'Password change feature coming soon!')
          )}
          
          {renderSettingItem(
            'Privacy Settings',
            'Manage your privacy and visibility',
            () => Alert.alert('Privacy Settings', 'Privacy settings coming soon!')
          )}
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: getColors(colorScheme).text 
          }]}>
            Notifications
          </Text>
          
          {renderSwitchItem(
            'Push Notifications',
            'Receive notifications on your device',
            notifications,
            setNotifications
          )}
          
          {renderSettingItem(
            'Notification Settings',
            'Customize notification preferences',
            () => Alert.alert('Notification Settings', 'Notification settings coming soon!')
          )}
        </View>

        {/* App Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: getColors(colorScheme).text 
          }]}>
            App Preferences
          </Text>
          
          {renderSwitchItem(
            'Dark Mode',
            'Use dark theme throughout the app',
            darkMode,
            setDarkMode
          )}
          
          {renderSwitchItem(
            'Location Services',
            'Allow app to access your location',
            locationServices,
            setLocationServices
          )}
          
          {renderSwitchItem(
            'Data Saving',
            'Reduce data usage for better performance',
            dataSaving,
            setDataSaving
          )}
          
          {renderSwitchItem(
            'Auto Sync',
            'Automatically sync your data',
            autoSync,
            setAutoSync
          )}
        </View>

        {/* Storage & Data Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: getColors(colorScheme).text 
          }]}>
            Storage & Data
          </Text>
          
          {renderSettingItem(
            'Clear Cache',
            'Free up storage space',
            handleClearCache,
            false
          )}
          
          {renderSettingItem(
            'Data Usage',
            'View your data consumption',
            () => Alert.alert('Data Usage', 'Data usage statistics coming soon!')
          )}
          
          {renderSettingItem(
            'Export Data',
            'Download your data',
            () => Alert.alert('Export Data', 'Data export feature coming soon!')
          )}
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: getColors(colorScheme).text 
          }]}>
            Support
          </Text>
          
          {renderSettingItem(
            'Help Center',
            'Get help and support',
            () => Alert.alert('Help Center', 'Help center coming soon!')
          )}
          
          {renderSettingItem(
            'Contact Us',
            'Send feedback or report issues',
            () => Alert.alert('Contact Us', 'Contact form coming soon!')
          )}
          
          {renderSettingItem(
            'Terms of Service',
            'Read our terms and conditions',
            () => Alert.alert('Terms of Service', 'Terms of service coming soon!')
          )}
          
          {renderSettingItem(
            'Privacy Policy',
            'Learn about our privacy practices',
            () => Alert.alert('Privacy Policy', 'Privacy policy coming soon!')
          )}
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { 
            color: getColors(colorScheme).text 
          }]}>
            Danger Zone
          </Text>
          
          {renderSettingItem(
            'Logout',
            'Sign out of your account',
            handleLogout,
            false,
            false
          )}
          
          {renderSettingItem(
            'Delete Account',
            'Permanently delete your account',
            handleDeleteAccount,
            false,
            true
          )}
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={[styles.versionText, { 
            color: getColors(colorScheme).text 
          }]}>
            TheLineCricket v1.0.0
          </Text>
          <Text style={[styles.buildText, { 
            color: getColors(colorScheme).text 
          }]}>
            Build 2024.01.15
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
  section: {
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  arrow: {
    fontSize: 18,
    opacity: 0.5,
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 24,
    marginTop: 16,
  },
  versionText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  buildText: {
    fontSize: 12,
    opacity: 0.6,
  },
});
