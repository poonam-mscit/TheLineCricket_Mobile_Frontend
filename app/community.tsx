import { Text } from '@/components/Themed';
import { CommunityCover } from '@/components/ui/CommunityCover';
import { CommunityEvents } from '@/components/ui/CommunityEvents';
import { CommunityMembers } from '@/components/ui/CommunityMembers';
import { PageAboutSection } from '@/components/ui/PageAboutSection';
import { getColors } from '@/constants/Colors';
import { CommunityData } from '@/types/pages';
import { getPageById, savePage } from '@/utils/pageStorage';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    useColorScheme,
    View
} from 'react-native';

export default function CommunityScreen() {
  const { pageId } = useLocalSearchParams<{ pageId: string }>();
  const [community, setCommunity] = useState<CommunityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    loadCommunityData();
  }, [pageId]);

  const loadCommunityData = async () => {
    try {
      setIsLoading(true);
      if (pageId) {
        const page = await getPageById(pageId);
        if (page && page.type === 'community') {
          setCommunity(page.data as CommunityData);
        } else {
          Alert.alert('Error', 'Community not found');
          router.back();
        }
      }
    } catch (error) {
      console.error('Error loading community:', error);
      Alert.alert('Error', 'Failed to load community data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadCommunityData();
    setIsRefreshing(false);
  };

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    loadCommunityData();
  };

  const handleSave = async () => {
    if (!community || !pageId) return;

    try {
      setIsSaving(true);
      const success = await savePage({
        id: pageId,
        name: community.name,
        type: 'community',
        createdAt: new Date(),
        data: community
      });

      if (success) {
        setIsEditing(false);
        Alert.alert('Success', 'Community updated successfully');
      } else {
        Alert.alert('Error', 'Failed to save changes');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDescriptionChange = (description: string) => {
    if (community) {
      setCommunity({ ...community, description });
    }
  };

  const handleContactChange = (field: string, value: string) => {
    if (community) {
      setCommunity({
        ...community,
        contact: { ...community.contact, [field]: value }
      });
    }
  };

  if (isLoading || !community) {
    return (
      <SafeAreaView style={[styles.container, { 
        backgroundColor: getColors(colorScheme).background 
      }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { 
            color: getColors(colorScheme).text 
          }]}>
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { 
      backgroundColor: getColors(colorScheme).background,
      paddingTop: StatusBar.currentHeight || 0
    }]}>
      <PageHeader
        onBack={handleBack}
        onEdit={handleEdit}
        isEditing={isEditing}
        onSave={handleSave}
        onCancel={handleCancel}
        isSaving={isSaving}
      />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
      >
        <CommunityCover
          name={community.name}
          type={community.type}
          logo={community.logo || null}
          coverImage={community.coverImage || null}
          verified={community.verified}
          members={community.members}
          isJoined={community.isJoined}
        />

        <PageAboutSection
          description={community.description}
          stats={{
            members: community.members,
            posts: community.posts,
            events: community.events,
          }}
          isEditing={isEditing}
          onDescriptionChange={handleDescriptionChange}
        />

        <CommunityMembers
          members={community.members}
          totalMembers={community.members}
          onMemberPress={(memberId) => Alert.alert('Member', `View member ${memberId}`)}
          onViewAll={() => Alert.alert('Members', 'View all members feature coming soon!')}
        />

        <CommunityEvents
          events={community.events}
          onEventPress={(eventId) => Alert.alert('Event', `View event ${eventId}`)}
          onJoinEvent={(eventId) => Alert.alert('Join Event', `Join event ${eventId}`)}
        />
        
        <View style={styles.bottomPadding} />
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: '#3B82F6',
  },
  shareButton: {
    backgroundColor: '#10B981',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 20,
  },
});

