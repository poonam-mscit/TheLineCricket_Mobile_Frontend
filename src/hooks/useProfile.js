// Custom hook for profile management
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    clearError,
    clearViewedProfile,
    createUserProfile,
    deleteUserProfile,
    fetchCurrentUser,
    fetchUserProfile,
    resetProfile,
    setCreating,
    setDeleting,
    setEditing,
    setViewedProfile,
    updateProfileLocal,
    updateUserProfile,
    uploadProfilePhoto
} from '../store/slices/profileSlice';

export const useProfile = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const currentUser = useSelector((state) => state.profile.currentUser);
  const viewedProfile = useSelector((state) => state.profile.viewedProfile);
  const profile = useSelector((state) => state.profile.profile);
  const loading = useSelector((state) => state.profile.loading);
  const errors = useSelector((state) => state.profile.errors);
  const isEditing = useSelector((state) => state.profile.isEditing);
  const isCreating = useSelector((state) => state.profile.isCreating);
  const isDeleting = useSelector((state) => state.profile.isDeleting);
  const lastUpdated = useSelector((state) => state.profile.lastUpdated);

  // Profile actions
  const loadCurrentUser = useCallback(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  const loadUserProfile = useCallback((userId) => {
    dispatch(fetchUserProfile(userId));
  }, [dispatch]);

  const createProfile = useCallback((profileData) => {
    dispatch(createUserProfile(profileData));
  }, [dispatch]);

  const updateProfile = useCallback((profileData) => {
    dispatch(updateUserProfile(profileData));
  }, [dispatch]);

  const deleteProfile = useCallback((userId) => {
    dispatch(deleteUserProfile(userId));
  }, [dispatch]);

  const uploadPhoto = useCallback((imageData) => {
    dispatch(uploadProfilePhoto(imageData));
  }, [dispatch]);

  // Local state management
  const startEditing = useCallback(() => {
    dispatch(setEditing(true));
  }, [dispatch]);

  const stopEditing = useCallback(() => {
    dispatch(setEditing(false));
  }, [dispatch]);

  const startCreating = useCallback(() => {
    dispatch(setCreating(true));
  }, [dispatch]);

  const stopCreating = useCallback(() => {
    dispatch(setCreating(false));
  }, [dispatch]);

  const startDeleting = useCallback(() => {
    dispatch(setDeleting(true));
  }, [dispatch]);

  const stopDeleting = useCallback(() => {
    dispatch(setDeleting(false));
  }, [dispatch]);

  const updateLocalProfile = useCallback((profileData) => {
    dispatch(updateProfileLocal(profileData));
  }, [dispatch]);

  const resetProfileState = useCallback(() => {
    dispatch(resetProfile());
  }, [dispatch]);

  const setProfileToView = useCallback((profileData) => {
    dispatch(setViewedProfile(profileData));
  }, [dispatch]);

  const clearProfileView = useCallback(() => {
    dispatch(clearViewedProfile());
  }, [dispatch]);

  const clearProfileError = useCallback((errorType) => {
    dispatch(clearError(errorType));
  }, [dispatch]);

  // Computed values
  const isLoading = loading.currentUser || loading.viewedProfile || loading.updating || loading.creating || loading.deleting;
  const hasError = Object.values(errors).some(error => error !== null);
  const isOwnProfile = currentUser && profile && currentUser.id === profile.id;

  return {
    // State
    currentUser,
    viewedProfile,
    profile,
    loading,
    errors,
    isEditing,
    isCreating,
    isDeleting,
    lastUpdated,
    isLoading,
    hasError,
    isOwnProfile,

    // Actions
    loadCurrentUser,
    loadUserProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    uploadPhoto,
    startEditing,
    stopEditing,
    startCreating,
    stopCreating,
    startDeleting,
    stopDeleting,
    updateLocalProfile,
    resetProfileState,
    setProfileToView,
    clearProfileView,
    clearProfileError
  };
};

export default useProfile;
