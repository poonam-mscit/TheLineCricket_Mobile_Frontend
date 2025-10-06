import { Text } from '@/components/Themed';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

interface SettingsSection {
  id: string;
  title: string;
  items: SettingsItem[];
}

interface SettingsItem {
  id: string;
  title: string;
  subtitle?: string;
  type: 'toggle' | 'button' | 'navigation' | 'select';
  value?: boolean | string;
  options?: string[];
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  onSelect?: (value: string) => void;
  icon?: string;
  color?: string;
}

interface SettingsPanelProps {
  onNavigate: (section: string) => void;
  onToggleSetting: (settingId: string, value: boolean) => void;
  onSelectOption: (settingId: string, value: string) => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export function SettingsPanel({ 
  onNavigate, 
  onToggleSetting, 
  onSelectOption, 
  onLogout, 
  onDeleteAccount 
}: SettingsPanelProps) {
  const colorScheme = useColorScheme();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: colorScheme === 'dark',
    locationServices: true,
    analytics: false,
    crashReporting: true,
    autoUpdate: true,
    soundEffects: true,
    hapticFeedback: true,
    biometricAuth: false,
    twoFactorAuth: false,
    emailNotifications: true,
    pushNotifications: true,
    matchReminders: true,
    teamUpdates: true,
    friendRequests: true,
    messageNotifications: true,
    systemUpdates: true,
    marketingEmails: false,
    dataUsage: 'standard',
    cacheSize: 'medium',
    language: 'en',
    timezone: 'auto'
  });

  const handleToggle = (settingId: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [settingId]: value }));
    onToggleSetting(settingId, value);
  };

  const handleSelect = (settingId: string, value: string) => {
    setSettings(prev => ({ ...prev, [settingId]: value }));
    onSelectOption(settingId, value);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: onLogout }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDeleteAccount }
      ]
    );
  };

  const sections: SettingsSection[] = [
    {
      id: 'notifications',
      title: 'Notifications',
      items: [
        {
          id: 'pushNotifications',
          title: 'Push Notifications',
          subtitle: 'Receive notifications on your device',
          type: 'toggle',
          value: settings.pushNotifications,
          onToggle: (value) => handleToggle('pushNotifications', value),
          icon: '🔔'
        },
        {
          id: 'emailNotifications',
          title: 'Email Notifications',
          subtitle: 'Receive notifications via email',
          type: 'toggle',
          value: settings.emailNotifications,
          onToggle: (value) => handleToggle('emailNotifications', value),
          icon: '📧'
        },
        {
          id: 'matchReminders',
          title: 'Match Reminders',
          subtitle: 'Get reminded about upcoming matches',
          type: 'toggle',
          value: settings.matchReminders,
          onToggle: (value) => handleToggle('matchReminders', value),
          icon: '⏰'
        },
        {
          id: 'teamUpdates',
          title: 'Team Updates',
          subtitle: 'Notifications about team activities',
          type: 'toggle',
          value: settings.teamUpdates,
          onToggle: (value) => handleToggle('teamUpdates', value),
          icon: '👥'
        },
        {
          id: 'friendRequests',
          title: 'Friend Requests',
          subtitle: 'Notifications for friend requests',
          type: 'toggle',
          value: settings.friendRequests,
          onToggle: (value) => handleToggle('friendRequests', value),
          icon: '👤'
        },
        {
          id: 'messageNotifications',
          title: 'Message Notifications',
          subtitle: 'Notifications for new messages',
          type: 'toggle',
          value: settings.messageNotifications,
          onToggle: (value) => handleToggle('messageNotifications', value),
          icon: '💬'
        }
      ]
    },
    {
      id: 'appearance',
      title: 'Appearance',
      items: [
        {
          id: 'darkMode',
          title: 'Dark Mode',
          subtitle: 'Use dark theme',
          type: 'toggle',
          value: settings.darkMode,
          onToggle: (value) => handleToggle('darkMode', value),
          icon: '🌙'
        },
        {
          id: 'language',
          title: 'Language',
          subtitle: 'English',
          type: 'navigation',
          onPress: () => onNavigate('language'),
          icon: '🌍'
        },
        {
          id: 'timezone',
          title: 'Timezone',
          subtitle: 'Auto-detect',
          type: 'navigation',
          onPress: () => onNavigate('timezone'),
          icon: '🕐'
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      items: [
        {
          id: 'biometricAuth',
          title: 'Biometric Authentication',
          subtitle: 'Use fingerprint or face ID',
          type: 'toggle',
          value: settings.biometricAuth,
          onToggle: (value) => handleToggle('biometricAuth', value),
          icon: '🔐'
        },
        {
          id: 'twoFactorAuth',
          title: 'Two-Factor Authentication',
          subtitle: 'Add extra security to your account',
          type: 'toggle',
          value: settings.twoFactorAuth,
          onToggle: (value) => handleToggle('twoFactorAuth', value),
          icon: '🛡️'
        },
        {
          id: 'locationServices',
          title: 'Location Services',
          subtitle: 'Allow app to access your location',
          type: 'toggle',
          value: settings.locationServices,
          onToggle: (value) => handleToggle('locationServices', value),
          icon: '📍'
        },
        {
          id: 'analytics',
          title: 'Analytics',
          subtitle: 'Help improve the app',
          type: 'toggle',
          value: settings.analytics,
          onToggle: (value) => handleToggle('analytics', value),
          icon: '📊'
        }
      ]
    },
    {
      id: 'app',
      title: 'App Settings',
      items: [
        {
          id: 'autoUpdate',
          title: 'Auto Update',
          subtitle: 'Automatically update the app',
          type: 'toggle',
          value: settings.autoUpdate,
          onToggle: (value) => handleToggle('autoUpdate', value),
          icon: '🔄'
        },
        {
          id: 'soundEffects',
          title: 'Sound Effects',
          subtitle: 'Play sounds for interactions',
          type: 'toggle',
          value: settings.soundEffects,
          onToggle: (value) => handleToggle('soundEffects', value),
          icon: '🔊'
        },
        {
          id: 'hapticFeedback',
          title: 'Haptic Feedback',
          subtitle: 'Vibrate for interactions',
          type: 'toggle',
          value: settings.hapticFeedback,
          onToggle: (value) => handleToggle('hapticFeedback', value),
          icon: '📳'
        },
        {
          id: 'dataUsage',
          title: 'Data Usage',
          subtitle: 'Standard',
          type: 'navigation',
          onPress: () => onNavigate('dataUsage'),
          icon: '📱'
        },
        {
          id: 'cacheSize',
          title: 'Cache Size',
          subtitle: 'Medium',
          type: 'navigation',
          onPress: () => onNavigate('cacheSize'),
          icon: '💾'
        }
      ]
    },
    {
      id: 'account',
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Edit Profile',
          subtitle: 'Update your personal information',
          type: 'navigation',
          onPress: () => onNavigate('profile'),
          icon: '👤'
        },
        {
          id: 'privacy',
          title: 'Privacy Settings',
          subtitle: 'Control your privacy',
          type: 'navigation',
          onPress: () => onNavigate('privacy'),
          icon: '🔒'
        },
        {
          id: 'blockedUsers',
          title: 'Blocked Users',
          subtitle: 'Manage blocked users',
          type: 'navigation',
          onPress: () => onNavigate('blockedUsers'),
          icon: '🚫'
        },
        {
          id: 'logout',
          title: 'Logout',
          subtitle: 'Sign out of your account',
          type: 'button',
          onPress: handleLogout,
          icon: '🚪',
          color: '#ff4757'
        },
        {
          id: 'deleteAccount',
          title: 'Delete Account',
          subtitle: 'Permanently delete your account',
          type: 'button',
          onPress: handleDeleteAccount,
          icon: '🗑️',
          color: '#ff4757'
        }
      ]
    }
  ];

  const renderSettingItem = (item: SettingsItem) => {
    const getItemStyle = () => {
      if (item.color) {
        return { color: item.color };
      }
      return { color: Colors[colorScheme ?? 'light'].text };
    };

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.settingItem, { 
          backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
          borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
        }]}
        onPress={item.onPress}
        disabled={item.type === 'toggle'}
      >
        <View style={styles.settingItemContent}>
          <View style={styles.settingItemLeft}>
            {item.icon && (
              <Text style={styles.settingIcon}>{item.icon}</Text>
            )}
            <View style={styles.settingItemText}>
              <Text style={[styles.settingTitle, getItemStyle()]}>
                {item.title}
              </Text>
              {item.subtitle && (
                <Text style={[styles.settingSubtitle, { 
                  color: Colors[colorScheme ?? 'light'].text 
                }]}>
                  {item.subtitle}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.settingItemRight}>
            {item.type === 'toggle' && (
              <Switch
                value={item.value as boolean}
                onValueChange={item.onToggle}
                trackColor={{ 
                  false: colorScheme === 'dark' ? '#555' : '#e0e0e0', 
                  true: Colors[colorScheme ?? 'light'].tint 
                }}
                thumbColor={item.value ? 'white' : '#f4f3f4'}
              />
            )}
            {item.type === 'navigation' && (
              <Text style={[styles.navigationArrow, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                ›
              </Text>
            )}
            {item.type === 'select' && (
              <Text style={[styles.selectValue, { 
                color: Colors[colorScheme ?? 'light'].text 
              }]}>
                {item.value}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { 
      backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
      borderColor: colorScheme === 'dark' ? '#333' : '#e0e0e0'
    }]}>
      <Text style={[styles.title, { 
        color: Colors[colorScheme ?? 'light'].text 
      }]}>
        Settings
      </Text>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {sections.map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={[styles.sectionTitle, { 
              color: Colors[colorScheme ?? 'light'].text 
            }]}>
              {section.title}
            </Text>
            <View style={[styles.sectionContent, { 
              backgroundColor: colorScheme === 'dark' ? '#333' : '#f8f9fa',
              borderColor: colorScheme === 'dark' ? '#555' : '#e0e0e0'
            }]}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionContent: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingItemText: {
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
  settingItemRight: {
    marginLeft: 12,
  },
  navigationArrow: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  selectValue: {
    fontSize: 14,
    opacity: 0.7,
  },
});
