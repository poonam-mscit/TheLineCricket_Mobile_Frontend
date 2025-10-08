import { Text } from '@/components/Themed';
import { getColors } from '@/constants/Colors';
import { useJob } from '@/src/hooks/useJob';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

export function JobCRUDDemo() {
  const colorScheme = useColorScheme();
  const {
    jobs,
    currentJob,
    loading,
    errors,
    isLoading,
    hasError,
    loadJobs,
    loadJobById,
    createJob,
    updateJob,
    deleteJob,
    applyToJob,
    saveJob,
    unsaveJob,
    clearJobError,
  } = useJob();

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  useEffect(() => {
    if (hasError) {
      Alert.alert('Error', Object.values(errors).find(error => error !== null) || 'An unexpected error occurred.');
      clearJobError();
    }
  }, [hasError, errors, clearJobError]);

  const handleCreateJob = () => {
    const newJobData = {
      title: `Test Job ${Date.now()}`,
      description: 'A test job for CRUD operations.',
      company: 'Test Company',
      location: 'Test City',
      salary_range: '50000-70000',
      job_type: 'full-time',
      experience_level: 'mid-level',
      category: 'technology',
      requirements: 'Bachelor degree in Computer Science',
      benefits: 'Health insurance, 401k, flexible hours',
      posted_by: 'test_user_id_123', // Replace with actual user ID
    };
    createJob(newJobData);
  };

  const handleUpdateJob = () => {
    if (!currentJob) {
      Alert.alert('Error', 'No job selected for update.');
      return;
    }
    const updatedJobData = {
      ...currentJob,
      title: `${currentJob.title} (Updated)`,
      description: `${currentJob.description} - This job has been updated.`,
      location: 'Updated Test City',
    };
    updateJob(currentJob.id, updatedJobData);
  };

  const handleDeleteJob = () => {
    if (!currentJob) {
      Alert.alert('Error', 'No job selected for deletion.');
      return;
    }
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete "${currentJob.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteJob(currentJob.id) },
      ]
    );
  };

  const handleApplyToJob = () => {
    if (!currentJob) {
      Alert.alert('Error', 'No job selected to apply to.');
      return;
    }
    applyToJob(currentJob.id);
  };

  const handleSaveJob = () => {
    if (!currentJob) {
      Alert.alert('Error', 'No job selected to save.');
      return;
    }
    saveJob(currentJob.id);
  };

  const handleUnsaveJob = () => {
    if (!currentJob) {
      Alert.alert('Error', 'No job selected to unsave.');
      return;
    }
    unsaveJob(currentJob.id);
  };

  const handleSelectJob = (jobId: string) => {
    setSelectedJobId(jobId);
    loadJobById(jobId);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: getColors(colorScheme).background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.header, { color: getColors(colorScheme).text }]}>Job CRUD Demo</Text>

        {isLoading && <Text style={[styles.statusText, { color: getColors(colorScheme).textSecondary }]}>Loading...</Text>}
        {hasError && <Text style={[styles.errorText, { color: getColors(colorScheme).error }]}>Error: {Object.values(errors).find(error => error !== null)}</Text>}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#2ed573' }]} onPress={handleCreateJob} disabled={isLoading}>
            <Text style={styles.buttonText}>Create Job</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#ffa502' }]} onPress={handleUpdateJob} disabled={isLoading || !currentJob}>
            <Text style={styles.buttonText}>Update Job</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#ff4757' }]} onPress={handleDeleteJob} disabled={isLoading || !currentJob}>
            <Text style={styles.buttonText}>Delete Job</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#4a69bd' }]} onPress={handleApplyToJob} disabled={isLoading || !currentJob}>
            <Text style={styles.buttonText}>Apply to Job</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#1abc9c' }]} onPress={handleSaveJob} disabled={isLoading || !currentJob}>
            <Text style={styles.buttonText}>Save Job</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#9b59b6' }]} onPress={handleUnsaveJob} disabled={isLoading || !currentJob}>
            <Text style={styles.buttonText}>Unsave Job</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: getColors(colorScheme).tint }]} onPress={() => loadJobs()} disabled={isLoading}>
            <Text style={styles.buttonText}>Refresh Jobs</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#747d8c' }]} onPress={clearJobError}>
            <Text style={styles.buttonText}>Clear Error</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: getColors(colorScheme).text }]}>All Jobs:</Text>
        <View style={styles.jobList}>
          {jobs.length === 0 ? (
            <Text style={[styles.noDataText, { color: getColors(colorScheme).textSecondary }]}>No jobs found. Create one!</Text>
          ) : (
            jobs.map((job) => (
              <TouchableOpacity
                key={job.id}
                style={[
                  styles.jobItem,
                  {
                    backgroundColor: getColors(colorScheme).card,
                    borderColor: selectedJobId === job.id ? getColors(colorScheme).tint : getColors(colorScheme).border,
                  },
                ]}
                onPress={() => handleSelectJob(job.id)}
              >
                <Text style={[styles.jobItemTitle, { color: getColors(colorScheme).text }]}>{job.title}</Text>
                <Text style={[styles.jobItemDetail, { color: getColors(colorScheme).textSecondary }]}>🏢 {job.company} | 📍 {job.location}</Text>
                <Text style={[styles.jobItemDetail, { color: getColors(colorScheme).textSecondary }]}>💰 {job.salary_range} | {job.job_type}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <Text style={[styles.sectionTitle, { color: getColors(colorScheme).text, marginTop: 20 }]}>Selected Job Details:</Text>
        <View style={[styles.jobDisplay, {
          backgroundColor: getColors(colorScheme).card,
          borderColor: getColors(colorScheme).border
        }]}>
          {currentJob ? (
            <View>
              <Text style={[styles.jobDisplayText, { color: getColors(colorScheme).text }]}>ID: {currentJob.id}</Text>
              <Text style={[styles.jobDisplayText, { color: getColors(colorScheme).text }]}>Title: {currentJob.title}</Text>
              <Text style={[styles.jobDisplayText, { color: getColors(colorScheme).text }]}>Company: {currentJob.company}</Text>
              <Text style={[styles.jobDisplayText, { color: getColors(colorScheme).text }]}>Location: {currentJob.location}</Text>
              <Text style={[styles.jobDisplayText, { color: getColors(colorScheme).text }]}>Salary: {currentJob.salary_range}</Text>
              <Text style={[styles.jobDisplayText, { color: getColors(colorScheme).text }]}>Type: {currentJob.job_type}</Text>
              <Text style={[styles.jobDisplayText, { color: getColors(colorScheme).text }]}>Experience: {currentJob.experience_level}</Text>
              <Text style={[styles.jobDisplayText, { color: getColors(colorScheme).text }]}>Applications: {currentJob.applications_count || 0}</Text>
              <Text style={[styles.jobDisplayText, { color: getColors(colorScheme).text }]}>Has Applied: {currentJob.has_applied ? 'Yes' : 'No'}</Text>
              <Text style={[styles.jobDisplayText, { color: getColors(colorScheme).text }]}>Is Saved: {currentJob.is_saved ? 'Yes' : 'No'}</Text>
            </View>
          ) : (
            <Text style={[styles.jobDisplayText, { color: getColors(colorScheme).textSecondary }]}>No job selected.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  jobList: {
    width: '100%',
    marginBottom: 20,
  },
  jobItem: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  jobItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  jobItemDetail: {
    fontSize: 14,
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  jobDisplay: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  jobDisplayText: {
    fontSize: 16,
    marginBottom: 5,
  },
});
