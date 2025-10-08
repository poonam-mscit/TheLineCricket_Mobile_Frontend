import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    applyToJob,
    clearCurrentJob,
    clearError,
    clearFilters,
    createJob,
    deleteJob,
    fetchJobById,
    fetchJobs,
    resetJobState,
    saveJob,
    setCurrentJob,
    setFilters,
    unsaveJob,
    updateJob
} from '../store/slices/jobSlice';

export const useJob = () => {
  const dispatch = useDispatch();
  const { jobs, currentJob, loading, errors, filters, pagination } = useSelector((state) => state.jobs);

  const loadJobs = useCallback((params) => {
    dispatch(fetchJobs(params));
  }, [dispatch]);

  const loadJobById = useCallback((jobId) => {
    dispatch(fetchJobById(jobId));
  }, [dispatch]);

  const createNewJob = useCallback((jobData) => {
    dispatch(createJob(jobData));
  }, [dispatch]);

  const updateExistingJob = useCallback((jobId, jobData) => {
    dispatch(updateJob({ jobId, jobData }));
  }, [dispatch]);

  const deleteExistingJob = useCallback((jobId) => {
    dispatch(deleteJob(jobId));
  }, [dispatch]);

  const applyToExistingJob = useCallback((jobId) => {
    dispatch(applyToJob(jobId));
  }, [dispatch]);

  const saveExistingJob = useCallback((jobId) => {
    dispatch(saveJob(jobId));
  }, [dispatch]);

  const unsaveExistingJob = useCallback((jobId) => {
    dispatch(unsaveJob(jobId));
  }, [dispatch]);

  const applyFilters = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const clearAllFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const setJob = useCallback((job) => {
    dispatch(setCurrentJob(job));
  }, [dispatch]);

  const clearJob = useCallback(() => {
    dispatch(clearCurrentJob());
  }, [dispatch]);

  const resetState = useCallback(() => {
    dispatch(resetJobState());
  }, [dispatch]);

  const clearJobError = useCallback((errorType) => {
    dispatch(clearError(errorType));
  }, [dispatch]);

  return {
    jobs,
    currentJob,
    loading,
    errors,
    filters,
    pagination,
    isLoading: loading.jobs || loading.currentJob,
    hasError: Object.values(errors).some(error => error !== null),
    loadJobs,
    loadJobById,
    createJob: createNewJob,
    updateJob: updateExistingJob,
    deleteJob: deleteExistingJob,
    applyToJob: applyToExistingJob,
    saveJob: saveExistingJob,
    unsaveJob: unsaveExistingJob,
    applyFilters,
    clearFilters: clearAllFilters,
    setCurrentJob: setJob,
    clearCurrentJob: clearJob,
    resetJobState: resetState,
    clearJobError,
  };
};

export default useJob;
