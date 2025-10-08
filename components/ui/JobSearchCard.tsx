import { getColors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

interface JobSearchResult {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary?: string;
  postedDate: Date;
  isApplied: boolean;
  isBookmarked: boolean;
  companyLogo?: string;
  tags?: string[];
  description?: string;
}

interface JobSearchCardProps {
  result: JobSearchResult;
  onPress: (resultId: string) => void;
  onAction: (resultId: string, action: string) => void;
}

export function JobSearchCard({ result, onPress, onAction }: JobSearchCardProps) {
  const colorScheme = useColorScheme();

  const handlePress = () => {
    onPress(result.id);
  };

  const handleAction = (action: string) => {
    onAction(result.id, action);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full-time':
        return '#10B981';
      case 'part-time':
        return '#3B82F6';
      case 'contract':
        return '#F59E0B';
      case 'internship':
        return '#8B5CF6';
      default:
        return getColors(colorScheme).text;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'full-time':
        return '💼';
      case 'part-time':
        return '⏰';
      case 'contract':
        return '📋';
      case 'internship':
        return '🎓';
      default:
        return '💼';
    }
  };

  const getActionButton = () => {
    if (result.isApplied) {
      return (
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: getColors(colorScheme).success }]}
          onPress={() => handleAction('view_application')}
        >
          <Text style={styles.actionButtonText}>✓ Applied</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity 
        style={[styles.actionButton, { backgroundColor: getColors(colorScheme).primary }]}
        onPress={() => handleAction('apply')}
      >
        <Text style={styles.actionButtonText}>Apply</Text>
      </TouchableOpacity>
    );
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: getColors(colorScheme).card, borderColor: getColors(colorScheme).border }]}
      onPress={handlePress}
    >
      <View style={styles.header}>
        <View style={styles.companyInfo}>
          {result.companyLogo ? (
            <View style={[styles.logoContainer, { backgroundColor: getColors(colorScheme).background }]}>
              <Text style={styles.logoText}>{result.company.charAt(0)}</Text>
            </View>
          ) : (
            <View style={[styles.logoContainer, { backgroundColor: getColors(colorScheme).primary }]}>
              <Text style={styles.logoText}>{result.company.charAt(0)}</Text>
            </View>
          )}
          <View style={styles.jobInfo}>
            <Text style={[styles.jobTitle, { color: getColors(colorScheme).text }]} numberOfLines={1}>
              {result.title}
            </Text>
            <Text style={[styles.companyName, { color: getColors(colorScheme).text }]} numberOfLines={1}>
              {result.company}
            </Text>
            <View style={styles.locationContainer}>
              <Text style={[styles.location, { color: getColors(colorScheme).text }]} numberOfLines={1}>
                📍 {result.location}
              </Text>
              <Text style={[styles.postedDate, { color: getColors(colorScheme).text }]}>
                {formatDate(result.postedDate)}
              </Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.bookmarkButton}
          onPress={() => handleAction('bookmark')}
        >
          <Text style={[styles.bookmarkIcon, { color: result.isBookmarked ? '#F59E0B' : getColors(colorScheme).text }]}>
            {result.isBookmarked ? '🔖' : '📌'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.jobDetails}>
          <View style={[styles.typeBadge, { backgroundColor: getTypeColor(result.type) + '20' }]}>
            <Text style={[styles.typeIcon]}>{getTypeIcon(result.type)}</Text>
            <Text style={[styles.typeText, { color: getTypeColor(result.type) }]}>
              {result.type.toUpperCase()}
            </Text>
          </View>
          
          {result.salary && (
            <Text style={[styles.salary, { color: getColors(colorScheme).text }]}>
              💰 {result.salary}
            </Text>
          )}
        </View>

        {result.description && (
          <Text style={[styles.description, { color: getColors(colorScheme).text }]} numberOfLines={2}>
            {result.description}
          </Text>
        )}

        {result.tags && result.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {result.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: getColors(colorScheme).background, borderColor: getColors(colorScheme).border }]}>
                <Text style={[styles.tagText, { color: getColors(colorScheme).text }]}>
                  {tag}
                </Text>
              </View>
            ))}
            {result.tags.length > 3 && (
              <Text style={[styles.moreTags, { color: getColors(colorScheme).text }]}>
                +{result.tags.length - 3} more
              </Text>
            )}
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.metaInfo}>
            <Text style={[styles.searchType, { color: getColors(colorScheme).text }]}>
              💼 Job
            </Text>
          </View>
          
          {getActionButton()}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 16,
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  companyInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    opacity: 0.7,
    flex: 1,
  },
  postedDate: {
    fontSize: 12,
    opacity: 0.7,
  },
  bookmarkButton: {
    padding: 4,
  },
  bookmarkIcon: {
    fontSize: 18,
  },
  content: {
    gap: 12,
  },
  jobDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  typeIcon: {
    fontSize: 12,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  salary: {
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '500',
  },
  moreTags: {
    fontSize: 10,
    opacity: 0.7,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  metaInfo: {
    flex: 1,
  },
  searchType: {
    fontSize: 12,
    opacity: 0.7,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});
