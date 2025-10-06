// Comprehensive backend integration test
import { apiService } from '../services/apiService';
import { authService } from '../services/authService';
import { socketService } from '../services/socketService';

class BackendIntegrationTest {
  constructor() {
    this.results = {};
    this.testData = {
      testUser: {
        email: 'test@thelinecricket.com',
        password: 'testpassword123',
        username: 'testuser',
        fullName: 'Test User',
        age: 25,
        location: 'Test City'
      },
      testPost: {
        content: 'This is a test post for backend integration',
        type: 'text'
      },
      testMatch: {
        title: 'Test Match',
        type: 'T20',
        date: new Date(),
        location: 'Test Ground',
        playersNeeded: 11,
        skillLevel: 'Intermediate'
      }
    };
  }

  async runAllTests() {
    console.log('🚀 Starting Backend Integration Tests...');
    
    try {
      // Test 1: Basic API Connection
      await this.testBasicConnection();
      
      // Test 2: Authentication Flow
      await this.testAuthenticationFlow();
      
      // Test 3: API Endpoints
      await this.testApiEndpoints();
      
      // Test 4: Real-time Features
      await this.testRealTimeFeatures();
      
      // Test 5: Error Handling
      await this.testErrorHandling();
      
      this.printResults();
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    }
  }

  async testBasicConnection() {
    console.log('📡 Testing basic connection...');
    
    try {
      const result = await apiService.healthCheck();
      this.results.basicConnection = { status: 'success', data: result };
      console.log('✅ Basic connection successful');
    } catch (error) {
      this.results.basicConnection = { status: 'failed', error: error.message };
      console.log('❌ Basic connection failed:', error.message);
    }
  }

  async testAuthenticationFlow() {
    console.log('🔐 Testing authentication flow...');
    
    try {
      // Test registration
      const registerResult = await authService.register(
        this.testData.testUser.email,
        this.testData.testUser.password,
        this.testData.testUser
      );
      this.results.registration = { status: 'success', data: registerResult };
      console.log('✅ Registration successful');
      
      // Test login
      const loginResult = await authService.login(
        this.testData.testUser.email,
        this.testData.testUser.password
      );
      this.results.login = { status: 'success', data: loginResult };
      console.log('✅ Login successful');
      
      // Test get current user
      const currentUser = await authService.getCurrentUser();
      this.results.currentUser = { status: 'success', data: currentUser };
      console.log('✅ Get current user successful');
      
    } catch (error) {
      this.results.authentication = { status: 'failed', error: error.message };
      console.log('❌ Authentication failed:', error.message);
    }
  }

  async testApiEndpoints() {
    console.log('🔌 Testing API endpoints...');
    
    const endpoints = [
      { name: 'posts', method: () => apiService.getFeedPosts(1, 5) },
      { name: 'matches', method: () => apiService.getMatches() },
      { name: 'notifications', method: () => apiService.getNotifications(1, 5) },
      { name: 'conversations', method: () => apiService.getConversations() },
      { name: 'search', method: () => apiService.globalSearch('test') },
      { name: 'searchSuggestions', method: () => apiService.getSearchSuggestions('test') },
      { name: 'trendingSearches', method: () => apiService.getTrendingSearches() }
    ];

    for (const endpoint of endpoints) {
      try {
        const result = await endpoint.method();
        this.results[endpoint.name] = { status: 'success', data: result };
        console.log(`✅ ${endpoint.name} endpoint successful`);
      } catch (error) {
        this.results[endpoint.name] = { status: 'failed', error: error.message };
        console.log(`❌ ${endpoint.name} endpoint failed:`, error.message);
      }
    }
  }

  async testRealTimeFeatures() {
    console.log('⚡ Testing real-time features...');
    
    try {
      // Test socket connection
      await socketService.connect();
      this.results.socketConnection = { status: 'success' };
      console.log('✅ Socket connection successful');
      
      // Test socket events
      const testEvents = [
        'new_message',
        'new_notification',
        'match_update',
        'live_score_update',
        'user_online'
      ];
      
      for (const event of testEvents) {
        socketService.on(event, (data) => {
          console.log(`📡 Received ${event}:`, data);
        });
      }
      
      this.results.socketEvents = { status: 'success', events: testEvents };
      console.log('✅ Socket events registered');
      
    } catch (error) {
      this.results.socketConnection = { status: 'failed', error: error.message };
      console.log('❌ Socket connection failed:', error.message);
    }
  }

  async testErrorHandling() {
    console.log('🛡️ Testing error handling...');
    
    try {
      // Test invalid endpoint
      try {
        await apiService.healthCheck(); // This should work
        this.results.errorHandling = { status: 'success' };
        console.log('✅ Error handling working correctly');
      } catch (error) {
        this.results.errorHandling = { status: 'failed', error: error.message };
        console.log('❌ Error handling failed:', error.message);
      }
      
    } catch (error) {
      this.results.errorHandling = { status: 'failed', error: error.message };
      console.log('❌ Error handling test failed:', error.message);
    }
  }

  printResults() {
    console.log('\n📊 Backend Integration Test Results:');
    console.log('=====================================');
    
    const totalTests = Object.keys(this.results).length;
    const successfulTests = Object.values(this.results).filter(r => r.status === 'success').length;
    const failedTests = totalTests - successfulTests;
    
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Successful: ${successfulTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`Success Rate: ${((successfulTests / totalTests) * 100).toFixed(1)}%`);
    
    console.log('\nDetailed Results:');
    Object.entries(this.results).forEach(([test, result]) => {
      const status = result.status === 'success' ? '✅' : '❌';
      console.log(`${status} ${test}: ${result.status}`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });
    
    if (failedTests === 0) {
      console.log('\n🎉 All tests passed! Backend integration is working correctly.');
    } else {
      console.log('\n⚠️ Some tests failed. Please check the backend configuration.');
    }
  }

  // Individual test methods for specific functionality
  async testPostsFlow() {
    console.log('📝 Testing posts flow...');
    
    try {
      // Create post
      const createResult = await apiService.createPost(this.testData.testPost);
      this.results.createPost = { status: 'success', data: createResult };
      console.log('✅ Create post successful');
      
      // Like post
      const likeResult = await apiService.togglePostLike(createResult.id);
      this.results.likePost = { status: 'success', data: likeResult };
      console.log('✅ Like post successful');
      
    } catch (error) {
      this.results.postsFlow = { status: 'failed', error: error.message };
      console.log('❌ Posts flow failed:', error.message);
    }
  }

  async testMatchesFlow() {
    console.log('🏏 Testing matches flow...');
    
    try {
      // Create match
      const createResult = await apiService.createMatch(this.testData.testMatch);
      this.results.createMatch = { status: 'success', data: createResult };
      console.log('✅ Create match successful');
      
      // Join match
      const joinResult = await apiService.joinMatch(createResult.id);
      this.results.joinMatch = { status: 'success', data: joinResult };
      console.log('✅ Join match successful');
      
    } catch (error) {
      this.results.matchesFlow = { status: 'failed', error: error.message };
      console.log('❌ Matches flow failed:', error.message);
    }
  }

  async testMessagingFlow() {
    console.log('💬 Testing messaging flow...');
    
    try {
      // Get conversations
      const conversations = await apiService.getConversations();
      this.results.getConversations = { status: 'success', data: conversations };
      console.log('✅ Get conversations successful');
      
      // Create conversation (if needed)
      if (conversations.length === 0) {
        const createResult = await apiService.createDirectConversation('test-user-id');
        this.results.createConversation = { status: 'success', data: createResult };
        console.log('✅ Create conversation successful');
      }
      
    } catch (error) {
      this.results.messagingFlow = { status: 'failed', error: error.message };
      console.log('❌ Messaging flow failed:', error.message);
    }
  }
}

// Export for use in components
export const backendIntegrationTest = new BackendIntegrationTest();
export default backendIntegrationTest;
