import { Text } from '@/components/Themed';
import { usePost } from '@/src/hooks/usePost';
import React, { useEffect } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

export function PostCRUDDemo() {
  const colorScheme = useColorScheme();
  const {
    posts,
    currentPost,
    userPosts,
    loading,
    errors,
    isLoading,
    hasError,
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
    clearPostError
  } = usePost();

  // Load posts on component mount
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Test create post with real data structure
  const testCreatePost = () => {
    const testData = {
      content: 'Just had an amazing cricket match today! The weather was perfect and the game was intense. #CricketLife #WeekendMatch',
      images: ['https://example.com/cricket1.jpg', 'https://example.com/cricket2.jpg'],
      video: '',
      location: 'Mumbai Cricket Ground',
      visibility: 'public',
      post_type: 'image',
      hashtags: ['CricketLife', 'WeekendMatch', 'Cricket'],
      mentions: ['@cricketfan1', '@cricketfan2'],
      author_id: 'user123'
    };

    createNewPost(testData);
  };

  // Test update post with real data structure
  const testUpdatePost = () => {
    if (!currentPost) {
      Alert.alert('Error', 'No post to update');
      return;
    }

    const updateData = {
      content: 'Updated: Just had an amazing cricket match today! The weather was perfect and the game was intense. #CricketLife #WeekendMatch #Updated',
      images: ['https://example.com/cricket1.jpg', 'https://example.com/cricket2.jpg', 'https://example.com/cricket3.jpg'],
      video: '',
      location: 'Updated Mumbai Cricket Ground',
      visibility: 'public',
      post_type: 'image',
      hashtags: ['CricketLife', 'WeekendMatch', 'Cricket', 'Updated'],
      mentions: ['@cricketfan1', '@cricketfan2', '@cricketfan3'],
      author_id: 'user123'
    };

    updateExistingPost(currentPost.id, updateData);
  };

  // Test delete post
  const testDeletePost = () => {
    if (!currentPost) {
      Alert.alert('Error', 'No post to delete');
      return;
    }
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this post? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteExistingPost(currentPost.id) },
      ]
    );
  };

  // Test like post
  const testLikePost = () => {
    if (!currentPost) {
      Alert.alert('Error', 'No post to like');
      return;
    }
    likeExistingPost(currentPost.id);
  };

  // Test unlike post
  const testUnlikePost = () => {
    if (!currentPost) {
      Alert.alert('Error', 'No post to unlike');
      return;
    }
    unlikeExistingPost(currentPost.id);
  };

  // Test comment on post
  const testCommentPost = () => {
    if (!currentPost) {
      Alert.alert('Error', 'No post to comment on');
      return;
    }
    const commentData = {
      content: 'Great post! Love the cricket action shots.',
      author_id: 'user123'
    };
    commentOnExistingPost(currentPost.id, commentData);
  };

  // Test share post
  const testSharePost = () => {
    if (!currentPost) {
      Alert.alert('Error', 'No post to share');
      return;
    }
    shareExistingPost(currentPost.id);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.header, { color: colorScheme === 'dark' ? '#ffffff' : '#000000' }]}>
          Post CRUD Demo
        </Text>

        {isLoading && <Text style={[styles.statusText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>Loading...</Text>}
        {hasError && <Text style={[styles.errorText, { color: '#ff4757' }]}>Error: {Object.values(errors).find(error => error) || 'Unknown error'}</Text>}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#2ed573' }]} onPress={testCreatePost} disabled={isLoading}>
            <Text style={styles.buttonText}>Create Post</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#ffa502' }]} onPress={testUpdatePost} disabled={isLoading || !currentPost}>
            <Text style={styles.buttonText}>Update Post</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#ff4757' }]} onPress={testDeletePost} disabled={isLoading || !currentPost}>
            <Text style={styles.buttonText}>Delete Post</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#4a69bd' }]} onPress={testLikePost} disabled={isLoading || !currentPost}>
            <Text style={styles.buttonText}>Like Post</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#747d8c' }]} onPress={testUnlikePost} disabled={isLoading || !currentPost}>
            <Text style={styles.buttonText}>Unlike Post</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#2f3542' }]} onPress={testCommentPost} disabled={isLoading || !currentPost}>
            <Text style={styles.buttonText}>Comment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#a4b0be' }]} onPress={testSharePost} disabled={isLoading || !currentPost}>
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#2f3542' }]} onPress={loadPosts} disabled={isLoading}>
            <Text style={styles.buttonText}>Refresh Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#a4b0be' }]} onPress={clearPostError}>
            <Text style={styles.buttonText}>Clear Error</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.postDisplay, {
          backgroundColor: colorScheme === 'dark' ? '#333' : '#f0f0f0',
          borderColor: colorScheme === 'dark' ? '#555' : '#ccc'
        }]}>
          <Text style={[styles.postTitle, { color: colorScheme === 'dark' ? '#ffffff' : '#000000' }]}>Current Post:</Text>
          {currentPost ? (
            <View>
              <Text style={[styles.postText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>ID: {currentPost.id}</Text>
              <Text style={[styles.postText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>Content: {currentPost.content}</Text>
              <Text style={[styles.postText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>Type: {currentPost.post_type}</Text>
              <Text style={[styles.postText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>Location: {currentPost.location}</Text>
              <Text style={[styles.postText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>Visibility: {currentPost.visibility}</Text>
              <Text style={[styles.postText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>Hashtags: {currentPost.hashtags?.join(', ')}</Text>
              <Text style={[styles.postText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>Mentions: {currentPost.mentions?.join(', ')}</Text>
              <Text style={[styles.postText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>Likes: {currentPost.likes_count || 0}</Text>
              <Text style={[styles.postText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>Comments: {currentPost.comments_count || 0}</Text>
              <Text style={[styles.postText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>Shares: {currentPost.shares_count || 0}</Text>
              <Text style={[styles.postText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>Is Liked: {currentPost.is_liked ? 'Yes' : 'No'}</Text>
            </View>
          ) : (
            <Text style={[styles.postText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>No post loaded.</Text>
          )}
        </View>

        <View style={[styles.postsList, {
          backgroundColor: colorScheme === 'dark' ? '#333' : '#f0f0f0',
          borderColor: colorScheme === 'dark' ? '#555' : '#ccc'
        }]}>
          <Text style={[styles.postsTitle, { color: colorScheme === 'dark' ? '#ffffff' : '#000000' }]}>All Posts ({posts.length}):</Text>
          {posts.length > 0 ? (
            posts.slice(0, 5).map((post, index) => (
              <TouchableOpacity
                key={post.id || index}
                style={[styles.postItem, { backgroundColor: colorScheme === 'dark' ? '#444' : '#fff' }]}
                onPress={() => loadPostById(post.id)}
              >
                <Text style={[styles.postItemText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>
                  {post.content?.substring(0, 50)}...
                </Text>
                <Text style={[styles.postItemMeta, { color: colorScheme === 'dark' ? '#999' : '#777' }]}>
                  {post.likes_count || 0} likes • {post.comments_count || 0} comments
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={[styles.postText, { color: colorScheme === 'dark' ? '#ccc' : '#555' }]}>No posts found.</Text>
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
  postDisplay: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  postText: {
    fontSize: 16,
    marginBottom: 5,
  },
  postsList: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  postsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  postItem: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  postItemText: {
    fontSize: 14,
    marginBottom: 5,
  },
  postItemMeta: {
    fontSize: 12,
  },
});
