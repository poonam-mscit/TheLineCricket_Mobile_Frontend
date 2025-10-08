// Custom hook for match management
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    clearCurrentMatch,
    clearError,
    clearFilters,
    createMatch,
    deleteMatch,
    fetchMatchById,
    fetchMatches,
    joinMatch,
    leaveMatch,
    resetMatchState,
    setCurrentMatch,
    setFilters,
    updateMatch
} from '../store/slices/matchSlice';

export const useMatch = () => {
  const dispatch = useDispatch();
  const {
    matches,
    currentMatch,
    loading,
    errors,
    filters,
    pagination,
    lastUpdated
  } = useSelector((state) => state.matches);

  // Match actions
  const loadMatches = useCallback((params = {}) => {
    dispatch(fetchMatches(params));
  }, [dispatch]);

  const loadMatchById = useCallback((matchId) => {
    dispatch(fetchMatchById(matchId));
  }, [dispatch]);

  const createNewMatch = useCallback((matchData) => {
    dispatch(createMatch(matchData));
  }, [dispatch]);

  const updateExistingMatch = useCallback((matchId, matchData) => {
    dispatch(updateMatch({ matchId, matchData }));
  }, [dispatch]);

  const deleteExistingMatch = useCallback((matchId) => {
    dispatch(deleteMatch(matchId));
  }, [dispatch]);

  const joinExistingMatch = useCallback((matchId) => {
    dispatch(joinMatch(matchId));
  }, [dispatch]);

  const leaveExistingMatch = useCallback((matchId) => {
    dispatch(leaveMatch(matchId));
  }, [dispatch]);

  // Filter actions
  const setMatchFilters = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const clearMatchFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  // Current match actions
  const setCurrentMatchData = useCallback((match) => {
    dispatch(setCurrentMatch(match));
  }, [dispatch]);

  const clearCurrentMatchData = useCallback(() => {
    dispatch(clearCurrentMatch());
  }, [dispatch]);

  // Error handling
  const clearMatchError = useCallback((errorType) => {
    dispatch(clearError(errorType));
  }, [dispatch]);

  // Reset state
  const resetMatchData = useCallback(() => {
    dispatch(resetMatchState());
  }, [dispatch]);

  // Computed values
  const isLoading = loading.matches || loading.currentMatch || loading.creating || loading.updating || loading.deleting;
  const hasError = Object.values(errors).some(error => error !== null);
  const isCreating = loading.creating;
  const isUpdating = loading.updating;
  const isDeleting = loading.deleting;

  return {
    // Data
    matches,
    currentMatch,
    filters,
    pagination,
    lastUpdated,

    // Loading states
    loading,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,

    // Error states
    errors,
    hasError,

    // Actions
    loadMatches,
    loadMatchById,
    createNewMatch,
    updateExistingMatch,
    deleteExistingMatch,
    joinExistingMatch,
    leaveExistingMatch,

    // Filter actions
    setMatchFilters,
    clearMatchFilters,

    // Current match actions
    setCurrentMatchData,
    clearCurrentMatchData,

    // Error handling
    clearMatchError,

    // Reset
    resetMatchData
  };
};

export default useMatch;
