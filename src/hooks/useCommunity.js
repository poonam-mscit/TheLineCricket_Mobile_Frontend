import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    clearCurrentCommunity,
    clearError,
    clearFilters,
    createCommunity,
    deleteCommunity,
    fetchCommunities,
    fetchCommunityById,
    joinCommunity,
    leaveCommunity,
    resetCommunityState,
    setCurrentCommunity,
    setFilters,
    updateCommunity
} from '../store/slices/communitySlice';

export const useCommunity = () => {
  const dispatch = useDispatch();
  const { communities, currentCommunity, loading, errors, filters, pagination } = useSelector((state) => state.communities);

  const loadCommunities = useCallback((params) => {
    dispatch(fetchCommunities(params));
  }, [dispatch]);

  const loadCommunityById = useCallback((communityId) => {
    dispatch(fetchCommunityById(communityId));
  }, [dispatch]);

  const createNewCommunity = useCallback((communityData) => {
    dispatch(createCommunity(communityData));
  }, [dispatch]);

  const updateExistingCommunity = useCallback((communityId, communityData) => {
    dispatch(updateCommunity({ communityId, communityData }));
  }, [dispatch]);

  const deleteExistingCommunity = useCallback((communityId) => {
    dispatch(deleteCommunity(communityId));
  }, [dispatch]);

  const joinExistingCommunity = useCallback((communityId) => {
    dispatch(joinCommunity(communityId));
  }, [dispatch]);

  const leaveExistingCommunity = useCallback((communityId) => {
    dispatch(leaveCommunity(communityId));
  }, [dispatch]);

  const applyFilters = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const clearAllFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const setCommunity = useCallback((community) => {
    dispatch(setCurrentCommunity(community));
  }, [dispatch]);

  const clearCommunity = useCallback(() => {
    dispatch(clearCurrentCommunity());
  }, [dispatch]);

  const resetState = useCallback(() => {
    dispatch(resetCommunityState());
  }, [dispatch]);

  const clearCommunityError = useCallback((errorType) => {
    dispatch(clearError(errorType));
  }, [dispatch]);

  return {
    communities,
    currentCommunity,
    loading,
    errors,
    filters,
    pagination,
    isLoading: loading.communities || loading.currentCommunity,
    hasError: Object.values(errors).some(error => error !== null),
    loadCommunities,
    loadCommunityById,
    createCommunity: createNewCommunity,
    updateCommunity: updateExistingCommunity,
    deleteCommunity: deleteExistingCommunity,
    joinCommunity: joinExistingCommunity,
    leaveCommunity: leaveExistingCommunity,
    applyFilters,
    clearFilters: clearAllFilters,
    setCurrentCommunity: setCommunity,
    clearCurrentCommunity: clearCommunity,
    resetCommunityState: resetState,
    clearCommunityError,
  };
};

export default useCommunity;
