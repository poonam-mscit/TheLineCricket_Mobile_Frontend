// Custom hook for post management
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    addPostToFeed,
    clearCurrentPost,
    clearError,
    clearFilters,
    commentOnPost,
    createPost,
    deletePost,
    fetchPostById,
    fetchPosts,
    fetchUserPosts,
    likePost,
    removePostFromFeed,
    resetPostState,
    setCurrentPost,
    setFilters,
    sharePost,
    unlikePost,
    updatePost,
    updatePostInFeed
} from '../store/slices/postSlice';

export const usePost = () => {
  const dispatch = useDispatch();
  const {
    posts,
    currentPost,
    userPosts,
    loading,
    errors,
    filters,
    pagination,
    lastUpdated
  } = useSelector((state) => state.posts);

  // Post actions
  const loadPosts = useCallback((params = {}) => {
    dispatch(fetchPosts(params));
  }, [dispatch]);

  const loadPostById = useCallback((postId) => {
    dispatch(fetchPostById(postId));
  }, [dispatch]);

  const loadUserPosts = useCallback((userId) => {
    dispatch(fetchUserPosts(userId));
  }, [dispatch]);

  const createNewPost = useCallback((postData) => {
    dispatch(createPost(postData));
  }, [dispatch]);

  const updateExistingPost = useCallback((postId, postData) => {
    dispatch(updatePost({ postId, postData }));
  }, [dispatch]);

  const deleteExistingPost = useCallback((postId) => {
    dispatch(deletePost(postId));
  }, [dispatch]);

  const likeExistingPost = useCallback((postId) => {
    dispatch(likePost(postId));
  }, [dispatch]);

  const unlikeExistingPost = useCallback((postId) => {
    dispatch(unlikePost(postId));
  }, [dispatch]);

  const commentOnExistingPost = useCallback((postId, commentData) => {
    dispatch(commentOnPost({ postId, commentData }));
  }, [dispatch]);

  const shareExistingPost = useCallback((postId) => {
    dispatch(sharePost(postId));
  }, [dispatch]);

  // Filter actions
  const setPostFilters = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const clearPostFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  // Current post actions
  const setCurrentPostData = useCallback((post) => {
    dispatch(setCurrentPost(post));
  }, [dispatch]);

  const clearCurrentPostData = useCallback(() => {
    dispatch(clearCurrentPost());
  }, [dispatch]);

  // Feed actions (for optimistic updates)
  const addPostToFeedOptimistically = useCallback((post) => {
    dispatch(addPostToFeed(post));
  }, [dispatch]);

  const removePostFromFeedOptimistically = useCallback((postId) => {
    dispatch(removePostFromFeed(postId));
  }, [dispatch]);

  const updatePostInFeedOptimistically = useCallback((post) => {
    dispatch(updatePostInFeed(post));
  }, [dispatch]);

  // Error handling
  const clearPostError = useCallback((errorType) => {
    dispatch(clearError(errorType));
  }, [dispatch]);

  // Reset state
  const resetPostData = useCallback(() => {
    dispatch(resetPostState());
  }, [dispatch]);

  // Computed values
  const isLoading = loading.posts || loading.currentPost || loading.userPosts || loading.creating || loading.updating || loading.deleting;
  const hasError = Object.values(errors).some(error => error !== null);
  const isCreating = loading.creating;
  const isUpdating = loading.updating;
  const isDeleting = loading.deleting;
  const isLiking = loading.liking;
  const isCommenting = loading.commenting;

  return {
    // Data
    posts,
    currentPost,
    userPosts,
    filters,
    pagination,
    lastUpdated,

    // Loading states
    loading,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isLiking,
    isCommenting,

    // Error states
    errors,
    hasError,

    // Actions
    loadPosts,
    loadPostById,
    loadUserPosts,
    createNewPost,
    updateExistingPost,
    deleteExistingPost,
    likeExistingPost,
    unlikeExistingPost,
    commentOnExistingPost,
    shareExistingPost,

    // Filter actions
    setPostFilters,
    clearPostFilters,

    // Current post actions
    setCurrentPostData,
    clearCurrentPostData,

    // Feed actions
    addPostToFeedOptimistically,
    removePostFromFeedOptimistically,
    updatePostInFeedOptimistically,

    // Error handling
    clearPostError,

    // Reset
    resetPostData
  };
};

export default usePost;
