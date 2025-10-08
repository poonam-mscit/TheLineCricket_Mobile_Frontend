import { Text } from '@/components/Themed';
import { AcademyActionButtons } from '@/components/ui/AcademyActionButtons';
import { AcademyCoaches } from '@/components/ui/AcademyCoaches';
import { AcademyContact } from '@/components/ui/AcademyContact';
import { AcademyCover } from '@/components/ui/AcademyCover';
import { AcademyFacilities } from '@/components/ui/AcademyFacilities';
import { AcademyHeader } from '@/components/ui/AcademyHeader';
import { AcademyPrograms } from '@/components/ui/AcademyPrograms';
import { PageAboutSection } from '@/components/ui/PageAboutSection';
import { getColors } from '@/constants/Colors';
import { AcademyData, AcademyFacility } from '@/types/pages';
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

export default function AcademyScreen() {
  const { pageId } = useLocalSearchParams<{ pageId: string }>();
  const [academy, setAcademy] = useState<AcademyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    loadAcademyData();
  }, [pageId]);

  const loadAcademyData = async () => {
    try {
      setIsLoading(true);
      if (pageId) {
        const page = await getPageById(pageId);
        if (page && page.type === 'academy') {
          setAcademy(page.data as AcademyData);
        } else {
          Alert.alert('Error', 'Academy not found');
          router.back();
        }
      }
    } catch (error) {
      console.error('Error loading academy:', error);
      Alert.alert('Error', 'Failed to load academy data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadAcademyData();
    setIsRefreshing(false);
  };

  const handleBack = () => {
    if (isEditing) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard your changes?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadAcademyData();
  };

  const handleSave = async () => {
    if (!academy || !pageId) return;

    try {
      setIsSaving(true);
      const success = await savePage({
        id: pageId,
        name: academy.name,
        type: 'academy',
        createdAt: new Date(),
        data: academy
      });

      if (success) {
        setIsEditing(false);
        Alert.alert('Success', 'Academy updated successfully');
      } else {
        Alert.alert('Error', 'Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving academy:', error);
      Alert.alert('Error', 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDescriptionChange = (description: string) => {
    if (academy) {
      setAcademy({ ...academy, description });
    }
  };

  const handleContactChange = (field: string, value: string) => {
    if (academy) {
      setAcademy({
        ...academy,
        contact: { ...academy.contact, [field]: value }
      });
    }
  };

  const handleAddFacility = () => {
    if (academy) {
      const newFacility: AcademyFacility = {
        id: Date.now().toString(),
        name: '',
        description: '',
        available: true
      };
      setAcademy({
        ...academy,
        facilities: [...academy.facilities, newFacility]
      });
    }
  };

  const handleRemoveFacility = (facilityId: string) => {
    if (academy) {
      setAcademy({
        ...academy,
        facilities: academy.facilities.filter(f => f.id !== facilityId)
      });
    }
  };

  const handleUpdateFacility = (facilityId: string, field: string, value: string) => {
    if (academy) {
      setAcademy({
        ...academy,
        facilities: academy.facilities.map(f =>
          f.id === facilityId ? { ...f, [field]: value } : f
        )
      });
    }
  };

  const handleCoachPress = (coachId: string) => {
    Alert.alert('Coach Profile', 'View coach profile feature coming soon!');
  };

  const handleProgramPress = (programId: string) => {
    Alert.alert('Program Details', 'View program details feature coming soon!');
  };

  const handleEnroll = (programId: string) => {
    Alert.alert('Enroll', 'Enrollment feature coming soon!');
  };

  const handleContact = () => {
    Alert.alert('Contact', 'Contact feature coming soon!');
  };

  const handleFollow = () => {
    Alert.alert('Follow', 'Follow feature coming soon!');
  };

  const handleShare = () => {
    Alert.alert('Share', 'Share feature coming soon!');
  };

  if (isLoading || !academy) {
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
      <AcademyHeader
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
            colors={['#8B5CF6']}
            tintColor="#8B5CF6"
          />
        }
      >
        <AcademyCover
          name={academy.name}
          type={academy.type}
          logo={academy.logo || null}
          coverImage={academy.coverImage || null}
          verified={academy.verified}
          rating={academy.rating}
          reviews={academy.reviews}
        />

        <PageAboutSection
          description={academy.description}
          stats={{
            students: academy.students,
            coaches: academy.coaches.length,
            programs: academy.programs.length,
            'success rate': academy.successRate
          }}
          isEditing={isEditing}
          onDescriptionChange={handleDescriptionChange}
        />

        <AcademyFacilities
          facilities={academy.facilities}
          isEditing={isEditing}
          onAddFacility={handleAddFacility}
          onRemoveFacility={handleRemoveFacility}
          onUpdateFacility={handleUpdateFacility}
        />

        <AcademyCoaches
          coaches={academy.coaches}
          onCoachPress={handleCoachPress}
        />

        <AcademyPrograms
          programs={academy.programs}
          onProgramPress={handleProgramPress}
          onEnroll={handleEnroll}
        />

        <AcademyContact
          contact={academy.contact}
          isEditing={isEditing}
          onContactChange={handleContactChange}
        />
        
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Action Buttons */}
      {!isEditing && (
        <AcademyActionButtons
          contact={academy.contact}
          onContactPress={handleContact}
          onFollowPress={handleFollow}
          onSharePress={handleShare}
        />
      )}
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
  contactButton: {
    backgroundColor: '#3B82F6',
  },
  followButton: {
    backgroundColor: '#8B5CF6',
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

