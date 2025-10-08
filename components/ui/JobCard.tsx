import { getColors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary?: string;
  postedDate: Date;
  applicants: number;
  isBookmarked: boolean;
  isApplied?: boolean;
  companyLogo?: string;
  tags?: string[];
}

interface JobCardProps {
  job: Job;
  onPress: (jobId: string) => void;
  onBookmark: (jobId: string) => void;
  onApply: (jobId: string) => void;
}

export function JobCard({ job, onPress, onBookmark, onApply }: JobCardProps) {
  const colorScheme = useColorScheme();

  const handlePress = () => {
    onPress(job.id);
  };

  const handleBookmark = () => {
    onBookmark(job.id);
  };

  const handleApply = () => {
    onApply(job.id);
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

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: getColors(colorScheme).card, borderColor: getColors(colorScheme).border }]}
      onPress={handlePress}
    >
      <View style={styles.header}>
        <View style={styles.companyInfo}>
          {job.companyLogo ? (
            <View style={[styles.logoContainer, { backgroundColor: getColors(colorScheme).background }]}>
              <Text style={styles.logoText}>{job.company.charAt(0)}</Text>
            </View>
          ) : (
            <View style={[styles.logoContainer, { backgroundColor: getColors(colorScheme).primary }]}>
              <Text style={styles.logoText}>{job.company.charAt(0)}</Text>
            </View>
          )}
          <View style={styles.jobInfo}>
            <Text style={[styles.jobTitle, { color: getColors(colorScheme).text }]} numberOfLines={1}>
              {job.title}
            </Text>
            <Text style={[styles.companyName, { color: getColors(colorScheme).text }]} numberOfLines={1}>
              {job.company}
            </Text>
            <Text style={[styles.location, { color: getColors(colorScheme).text }]} numberOfLines={1}>
              📍 {job.location}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.bookmarkButton}
          onPress={handleBookmark}
        >
          <Text style={[styles.bookmarkIcon, { color: job.isBookmarked ? '#F59E0B' : getColors(colorScheme).text }]}>
            {job.isBookmarked ? '🔖' : '📌'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.jobDetails}>
          <View style={[styles.typeBadge, { backgroundColor: getTypeColor(job.type) + '20' }]}>
            <Text style={[styles.typeIcon]}>{getTypeIcon(job.type)}</Text>
            <Text style={[styles.typeText, { color: getTypeColor(job.type) }]}>
              {job.type.toUpperCase()}
            </Text>
          </View>
          
          {job.salary && (
            <Text style={[styles.salary, { color: getColors(colorScheme).text }]}>
              💰 {job.salary}
            </Text>
          )}
        </View>

        {job.tags && job.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {job.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: getColors(colorScheme).background, borderColor: getColors(colorScheme).border }]}>
                <Text style={[styles.tagText, { color: getColors(colorScheme).text }]}>
                  {tag}
                </Text>
              </View>
            ))}
            {job.tags.length > 3 && (
              <Text style={[styles.moreTags, { color: getColors(colorScheme).text }]}>
                +{job.tags.length - 3} more
              </Text>
            )}
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.metaInfo}>
            <Text style={[styles.postedDate, { color: getColors(colorScheme).text }]}>
              {formatDate(job.postedDate)}
            </Text>
            <Text style={[styles.applicants, { color: getColors(colorScheme).text }]}>
              {job.applicants} applicants
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.applyButton,
              { 
                backgroundColor: job.isApplied ? getColors(colorScheme).success : getColors(colorScheme).primary,
                opacity: job.isApplied ? 0.7 : 1
              }
            ]}
            onPress={handleApply}
            disabled={job.isApplied}
          >
            <Text style={styles.applyButtonText}>
              {job.isApplied ? '✓ Applied' : 'Apply'}
            </Text>
          </TouchableOpacity>
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
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 18,
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
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    opacity: 0.7,
  },
  bookmarkButton: {
    padding: 4,
  },
  bookmarkIcon: {
    fontSize: 20,
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
  postedDate: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 2,
  },
  applicants: {
    fontSize: 12,
    opacity: 0.7,
  },
  applyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});
