import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

// Import existing components
import { InstagramBottomNav } from '@/components/ui/InstagramBottomNav';

export default function JobsScreen() {
  const [activeSection, setActiveSection] = useState('jobs');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const { width } = Dimensions.get('window');
  
  // Mock user data following existing patterns
  const user = {
    id: '1',
    fullName: 'Demo User',
    username: 'demo_user',
    email: 'demo@example.com',
    avatar: 'https://via.placeholder.com/40',
    verified: true
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleJobApply = (jobId: string) => {
    console.log('Apply to job:', jobId);
    // Add job application logic here
  };

  const handleJobSave = (jobId: string) => {
    console.log('Save job:', jobId);
    // Add job save logic here
  };

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: getColors(colorScheme).background }]}>
      <View style={styles.headerLeft}>
        <Text style={[styles.logo, { color: getColors(colorScheme).text }]}>🏏</Text>
        <Text style={[styles.appName, { color: getColors(colorScheme).text }]}>The Line Cricket</Text>
      </View>
      <TouchableOpacity 
        style={styles.jobsButton}
        onPress={() => console.log('Jobs pressed')}
      >
        <Text style={styles.jobsButtonText}>💼</Text>
      </TouchableOpacity>
    </View>
  );

  const renderJobsContent = () => (
    <ScrollView 
      style={styles.sectionContent}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={[getColors(colorScheme).primary]}
          tintColor={getColors(colorScheme).primary}
        />
      }
    >
      <View style={styles.jobsHeader}>
        <Text style={[styles.sectionTitle, { color: getColors(colorScheme).text }]}>
          Job Opportunities
        </Text>
        <TouchableOpacity 
          style={[styles.postJobButton, { backgroundColor: getColors(colorScheme).primary }]}
          onPress={() => router.push('/create-job')}
        >
          <Text style={styles.postJobButtonText}>+ Post Job</Text>
        </TouchableOpacity>
      </View>
      
      <View style={[styles.jobCard, { 
        backgroundColor: getColors(colorScheme).card,
        borderColor: getColors(colorScheme).border
      }]}>
        <View style={styles.jobCardHeader}>
          <Text style={[styles.jobTitle, { color: getColors(colorScheme).text }]}>
            🏏 Cricket Coach
          </Text>
          <Text style={[styles.jobCompany, { color: getColors(colorScheme).text }]}>
            Mumbai Cricket Academy
          </Text>
        </View>
        <Text style={[styles.jobLocation, { color: getColors(colorScheme).text }]}>
          📍 Mumbai, Maharashtra
        </Text>
        <Text style={[styles.jobType, { color: getColors(colorScheme).text }]}>
          💼 Full-time • ₹50,000 - ₹80,000
        </Text>
        <View style={styles.jobActions}>
          <TouchableOpacity 
            style={[styles.jobActionButton, { borderColor: getColors(colorScheme).border }]}
            onPress={() => handleJobApply('cricket-coach-1')}
          >
            <Text style={[styles.jobActionText, { color: getColors(colorScheme).text }]}>Apply</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.jobActionButton, { borderColor: getColors(colorScheme).border }]}
            onPress={() => handleJobSave('cricket-coach-1')}
          >
            <Text style={[styles.jobActionText, { color: getColors(colorScheme).text }]}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={[styles.jobCard, { 
        backgroundColor: getColors(colorScheme).card,
        borderColor: getColors(colorScheme).border
      }]}>
        <View style={styles.jobCardHeader}>
          <Text style={[styles.jobTitle, { color: getColors(colorScheme).text }]}>
            📊 Cricket Analyst
          </Text>
          <Text style={[styles.jobCompany, { color: getColors(colorScheme).text }]}>
            Delhi Capitals
          </Text>
        </View>
        <Text style={[styles.jobLocation, { color: getColors(colorScheme).text }]}>
          📍 Delhi, NCR
        </Text>
        <Text style={[styles.jobType, { color: getColors(colorScheme).text }]}>
          💼 Full-time • ₹60,000 - ₹90,000
        </Text>
        <View style={styles.jobActions}>
          <TouchableOpacity 
            style={[styles.jobActionButton, { borderColor: getColors(colorScheme).border }]}
            onPress={() => handleJobApply('cricket-analyst-1')}
          >
            <Text style={[styles.jobActionText, { color: getColors(colorScheme).text }]}>Apply</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.jobActionButton, { borderColor: getColors(colorScheme).border }]}
            onPress={() => handleJobSave('cricket-analyst-1')}
          >
            <Text style={[styles.jobActionText, { color: getColors(colorScheme).text }]}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={[styles.jobCard, { 
        backgroundColor: getColors(colorScheme).card,
        borderColor: getColors(colorScheme).border
      }]}>
        <View style={styles.jobCardHeader}>
          <Text style={[styles.jobTitle, { color: getColors(colorScheme).text }]}>
            🎯 Bowling Coach
          </Text>
          <Text style={[styles.jobCompany, { color: getColors(colorScheme).text }]}>
            Royal Challengers Bangalore
          </Text>
        </View>
        <Text style={[styles.jobLocation, { color: getColors(colorScheme).text }]}>
          📍 Bangalore, Karnataka
        </Text>
        <Text style={[styles.jobType, { color: getColors(colorScheme).text }]}>
          💼 Part-time • ₹30,000 - ₹50,000
        </Text>
        <View style={styles.jobActions}>
          <TouchableOpacity 
            style={[styles.jobActionButton, { borderColor: getColors(colorScheme).border }]}
            onPress={() => handleJobApply('bowling-coach-1')}
          >
            <Text style={[styles.jobActionText, { color: getColors(colorScheme).text }]}>Apply</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.jobActionButton, { borderColor: getColors(colorScheme).border }]}
            onPress={() => handleJobSave('bowling-coach-1')}
          >
            <Text style={[styles.jobActionText, { color: getColors(colorScheme).text }]}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.jobCard, { 
        backgroundColor: getColors(colorScheme).card,
        borderColor: getColors(colorScheme).border
      }]}>
        <View style={styles.jobCardHeader}>
          <Text style={[styles.jobTitle, { color: getColors(colorScheme).text }]}>
            🏆 Team Manager
          </Text>
          <Text style={[styles.jobCompany, { color: getColors(colorScheme).text }]}>
            Chennai Super Kings
          </Text>
        </View>
        <Text style={[styles.jobLocation, { color: getColors(colorScheme).text }]}>
          📍 Chennai, Tamil Nadu
        </Text>
        <Text style={[styles.jobType, { color: getColors(colorScheme).text }]}>
          💼 Full-time • ₹70,000 - ₹100,000
        </Text>
        <View style={styles.jobActions}>
          <TouchableOpacity 
            style={[styles.jobActionButton, { borderColor: getColors(colorScheme).border }]}
            onPress={() => handleJobApply('team-manager-1')}
          >
            <Text style={[styles.jobActionText, { color: getColors(colorScheme).text }]}>Apply</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.jobActionButton, { borderColor: getColors(colorScheme).border }]}
            onPress={() => handleJobSave('team-manager-1')}
          >
            <Text style={[styles.jobActionText, { color: getColors(colorScheme).text }]}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.jobCard, { 
        backgroundColor: getColors(colorScheme).card,
        borderColor: getColors(colorScheme).border
      }]}>
        <View style={styles.jobCardHeader}>
          <Text style={[styles.jobTitle, { color: getColors(colorScheme).text }]}>
            📈 Performance Analyst
          </Text>
          <Text style={[styles.jobCompany, { color: getColors(colorScheme).text }]}>
            Kolkata Knight Riders
          </Text>
        </View>
        <Text style={[styles.jobLocation, { color: getColors(colorScheme).text }]}>
          📍 Kolkata, West Bengal
        </Text>
        <Text style={[styles.jobType, { color: getColors(colorScheme).text }]}>
          💼 Contract • ₹40,000 - ₹60,000
        </Text>
        <View style={styles.jobActions}>
          <TouchableOpacity 
            style={[styles.jobActionButton, { borderColor: getColors(colorScheme).border }]}
            onPress={() => handleJobApply('performance-analyst-1')}
          >
            <Text style={[styles.jobActionText, { color: getColors(colorScheme).text }]}>Apply</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.jobActionButton, { borderColor: getColors(colorScheme).border }]}
            onPress={() => handleJobSave('performance-analyst-1')}
          >
            <Text style={[styles.jobActionText, { color: getColors(colorScheme).text }]}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderBottomNavigation = () => (
    <InstagramBottomNav 
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      onCreatePost={() => router.push('/create-post')}
      onCreateMatch={() => router.push('/create-match')}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { 
      backgroundColor: getColors(colorScheme).background
    }]}>
      {renderHeader()}
      {renderJobsContent()}
      {renderBottomNavigation()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  // Job section styles
  jobsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  postJobButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  postJobButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  jobCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobCardHeader: {
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  jobCompany: {
    fontSize: 14,
    opacity: 0.8,
  },
  jobLocation: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  jobType: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 12,
  },
  jobActions: {
    flexDirection: 'row',
    gap: 8,
  },
  jobActionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
  jobActionText: {
    fontSize: 12,
    fontWeight: '600',
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    marginRight: 8,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  jobsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  jobsButtonText: {
    fontSize: 18,
    color: '#374151',
  },
});
