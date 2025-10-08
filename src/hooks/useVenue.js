import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    bookVenue,
    clearCurrentVenue,
    clearError,
    clearFilters,
    createVenue,
    deleteVenue,
    fetchVenueById,
    fetchVenues,
    resetVenueState,
    setCurrentVenue,
    setFilters,
    updateVenue
} from '../store/slices/venueSlice';

export const useVenue = () => {
  const dispatch = useDispatch();
  const { venues, currentVenue, loading, errors, filters, pagination } = useSelector((state) => state.venues);

  const loadVenues = useCallback((params) => {
    dispatch(fetchVenues(params));
  }, [dispatch]);

  const loadVenueById = useCallback((venueId) => {
    dispatch(fetchVenueById(venueId));
  }, [dispatch]);

  const createNewVenue = useCallback((venueData) => {
    dispatch(createVenue(venueData));
  }, [dispatch]);

  const updateExistingVenue = useCallback((venueId, venueData) => {
    dispatch(updateVenue({ venueId, venueData }));
  }, [dispatch]);

  const deleteExistingVenue = useCallback((venueId) => {
    dispatch(deleteVenue(venueId));
  }, [dispatch]);

  const bookExistingVenue = useCallback((venueId, bookingData) => {
    dispatch(bookVenue({ venueId, bookingData }));
  }, [dispatch]);

  const applyFilters = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const clearAllFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const setVenue = useCallback((venue) => {
    dispatch(setCurrentVenue(venue));
  }, [dispatch]);

  const clearVenue = useCallback(() => {
    dispatch(clearCurrentVenue());
  }, [dispatch]);

  const resetState = useCallback(() => {
    dispatch(resetVenueState());
  }, [dispatch]);

  const clearVenueError = useCallback((errorType) => {
    dispatch(clearError(errorType));
  }, [dispatch]);

  return {
    venues,
    currentVenue,
    loading,
    errors,
    filters,
    pagination,
    isLoading: loading.venues || loading.currentVenue,
    hasError: Object.values(errors).some(error => error !== null),
    loadVenues,
    loadVenueById,
    createVenue: createNewVenue,
    updateVenue: updateExistingVenue,
    deleteVenue: deleteExistingVenue,
    bookVenue: bookExistingVenue,
    applyFilters,
    clearFilters: clearAllFilters,
    setCurrentVenue: setVenue,
    clearCurrentVenue: clearVenue,
    resetVenueState: resetState,
    clearVenueError,
  };
};

export default useVenue;
