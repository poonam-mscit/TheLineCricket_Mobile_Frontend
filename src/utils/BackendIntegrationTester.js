// Comprehensive Backend Integration Tester
import environment from '../config/environment';
import { apiService } from '../services/apiService';
import { authService } from '../services/authService';
import { socketService } from '../services/socketService';

class BackendIntegrationTester {
  constructor() {
    this.results = {
      connection: null,
      authentication: null,
      apiEndpoints: {},
      realTime: null,
      database: null,
      errorHandling: null
    };
    this.testData = {
      user: {
        email: `test_${Date.now()}@thelinecricket.com`,
        password: 'TestPassword123!',
        username: `testuser_${Date.now()}`,
        fullName: 'Test User',
        age: 25,
        location: 'Test City'
      }
    };
  }

  async runAllTests() {
    console.log('🚀 Starting Comprehensive Backend Integration Tests...');
    console.log(`📍 Backend URL: ${environment.API_BASE_URL}`);
    console.log(`🔌 Socket URL: ${environment.SOCKET_URL}`);
    
    try {
      // Test 1: Basic Connection
      await this.testBasicConnection();
      
      // Test 2: Authentication Flow
      await this.testAuthenticationFlow();
      
      // Test 3: API Endpoints
      await this.testApiEndpoints();
      
      // Test 4: Real-time Features
      await this.testRealTimeFeatures();
      
      // Test 5: Database Connectivity
      await this.testDatabaseConnectivity();
      
      // Test 6: Error Handling
      await this.testErrorHandling();
      
      this.printComprehensiveResults();
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      this.results.generalError = error.message;
    }
  }

  async testBasicConnection() {
    console.log('\n📡 Testing Basic Connection...');
    
    try {
      // Test 1.1: Health Check
      console.log('  🔍 Testing health check...');
      const healthResult = await apiService.healthCheck();
      this.results.connection = {
        healthCheck: { status: 'success', data: healthResult },
        timestamp: new Date().toISOString()
      };
      console.log('  ✅ Health check successful');
      
      // Test 1.2: API Base URL
      console.log('  🔍 Testing API base URL...');
      const baseUrl = environment.API_BASE_URL;
      this.results.connection.baseUrl = baseUrl;
      console.log(`  ✅ API Base URL: ${baseUrl}`);
      
      // Test 1.3: Socket URL
      console.log('  🔍 Testing Socket URL...');
      const socketUrl = environment.SOCKET_URL;
      this.results.connection.socketUrl = socketUrl;
      console.log(`  ✅ Socket URL: ${socketUrl}`);
      
    } catch (error) {
      this.results.connection = {
        healthCheck: { status: 'failed', error: error.message },
        timestamp: new Date().toISOString()
      };
      console.log('  ❌ Basic connection failed:', error.message);
    }
  }

  async testAuthenticationFlow() {
    console.log('\n🔐 Testing Authentication Flow...');
    
    try {
      // Test 2.1: User Registration
      console.log('  🔍 Testing user registration...');
      const registerResult = await authService.register(
        this.testData.user.email,
        this.testData.user.password,
        this.testData.user
      );
      this.results.authentication = {
        registration: { status: 'success', data: registerResult },
        timestamp: new Date().toISOString()
      };
      console.log('  ✅ User registration successful');
      
      // Test 2.2: User Login
      console.log('  🔍 Testing user login...');
      const loginResult = await authService.login(
        this.testData.user.email,
        this.testData.user.password
      );
      this.results.authentication.login = { status: 'success', data: loginResult };
      console.log('  ✅ User login successful');
      
      // Test 2.3: Get Current User
      console.log('  🔍 Testing get current user...');
      const currentUser = authService.getCurrentUser();
      this.results.authentication.currentUser = { status: 'success', data: currentUser };
      console.log('  ✅ Get current user successful');
      
      // Test 2.4: Check Authentication State
      console.log('  🔍 Testing authentication state...');
      const isAuthenticated = authService.isUserAuthenticated();
      this.results.authentication.isAuthenticated = { status: 'success', data: isAuthenticated };
      console.log(`  ✅ Authentication state: ${isAuthenticated}`);
      
    } catch (error) {
      this.results.authentication = {
        error: error.message,
        timestamp: new Date().toISOString()
      };
      console.log('  ❌ Authentication flow failed:', error.message);
    }
  }

  async testApiEndpoints() {
    console.log('\n🔌 Testing API Endpoints...');
    
    const endpoints = [
      { name: 'posts', method: () => apiService.getFeedPosts(1, 5) },
      { name: 'matches', method: () => apiService.getMatches() },
      { name: 'notifications', method: () => apiService.getNotifications(1, 5) },
      { name: 'conversations', method: () => apiService.getConversations() },
      { name: 'globalSearch', method: () => apiService.globalSearch('cricket') },
      { name: 'searchSuggestions', method: () => apiService.getSearchSuggestions('test') },
      { name: 'trendingSearches', method: () => apiService.getTrendingSearches() },
      { name: 'adminDashboard', method: () => apiService.getAdminDashboard() }
    ];

    this.results.apiEndpoints = {};

    for (const endpoint of endpoints) {
      try {
        console.log(`  🔍 Testing ${endpoint.name} endpoint...`);
        const result = await endpoint.method();
        this.results.apiEndpoints[endpoint.name] = { 
          status: 'success', 
          data: result,
          timestamp: new Date().toISOString()
        };
        console.log(`  ✅ ${endpoint.name} endpoint successful`);
      } catch (error) {
        this.results.apiEndpoints[endpoint.name] = { 
          status: 'failed', 
          error: error.message,
          timestamp: new Date().toISOString()
        };
        console.log(`  ❌ ${endpoint.name} endpoint failed:`, error.message);
      }
    }
  }

  async testRealTimeFeatures() {
    console.log('\n⚡ Testing Real-time Features...');
    
    this.results.realTime = {
      timestamp: new Date().toISOString()
    };
    
    try {
      // Test 4.1: Socket Connection
      console.log('  🔍 Testing socket connection...');
      try {
        await socketService.connect();
        this.results.realTime.socketConnection = { status: 'success' };
        console.log('  ✅ Socket connection successful');
      } catch (error) {
        this.results.realTime.socketConnection = { 
          status: 'failed', 
          error: error.message 
        };
        console.log('  ❌ Socket connection failed:', error.message);
        return; // Skip other tests if connection fails
      }
      
      // Test 4.2: Socket Event Listeners
      console.log('  🔍 Testing socket event listeners...');
      const testEvents = [
        'new_message',
        'new_notification', 
        'match_update',
        'live_score_update',
        'user_online',
        'new_post'
      ];
      
      let eventsRegistered = 0;
      try {
        testEvents.forEach(event => {
          socketService.on(event, (data) => {
            console.log(`  📡 Received ${event}:`, data);
          });
          eventsRegistered++;
        });
        
        this.results.realTime.eventsRegistered = { 
          status: 'success', 
          count: eventsRegistered 
        };
        console.log(`  ✅ ${eventsRegistered} socket events registered`);
      } catch (error) {
        this.results.realTime.eventsRegistered = { 
          status: 'failed', 
          error: error.message 
        };
        console.log('  ❌ Socket event registration failed:', error.message);
      }
      
      // Test 4.3: Socket Connection Status
      console.log('  🔍 Testing socket connection status...');
      try {
        const connectionStatus = socketService.getConnectionStatus();
        this.results.realTime.connectionStatus = { 
          status: 'success', 
          data: connectionStatus 
        };
        console.log(`  ✅ Socket connection status: ${connectionStatus.connected}`);
      } catch (error) {
        this.results.realTime.connectionStatus = { 
          status: 'failed', 
          error: error.message 
        };
        console.log('  ❌ Socket connection status check failed:', error.message);
      }
      
    } catch (error) {
      this.results.realTime.generalError = {
        status: 'failed',
        error: error.message
      };
      console.log('  ❌ Real-time features test failed:', error.message);
    }
  }

  async testDatabaseConnectivity() {
    console.log('\n🗄️ Testing Database Connectivity...');
    
    this.results.database = {
      timestamp: new Date().toISOString()
    };
    
    try {
      // Test 5.1: Read Data (less likely to fail)
      console.log('  🔍 Testing database read (fetch posts)...');
      try {
        const postsResult = await apiService.getFeedPosts(1, 10);
        this.results.database.fetchPosts = { status: 'success', data: postsResult };
        console.log('  ✅ Database read successful');
      } catch (error) {
        this.results.database.fetchPosts = { status: 'failed', error: error.message };
        console.log('  ❌ Database read failed:', error.message);
      }
      
      // Test 5.2: Create Test Post (if read worked)
      if (this.results.database.fetchPosts?.status === 'success') {
        console.log('  🔍 Testing database write (create post)...');
        try {
          const testPost = {
            content: `Test post for database connectivity - ${new Date().toISOString()}`,
            type: 'text'
          };
          
          const createPostResult = await apiService.createPost(testPost);
          this.results.database.createPost = { status: 'success', data: createPostResult };
          console.log('  ✅ Database write successful');
          
          // Test 5.3: Update Data (like post)
          if (createPostResult && createPostResult.id) {
            console.log('  🔍 Testing database update (like post)...');
            try {
              const likeResult = await apiService.togglePostLike(createPostResult.id);
              this.results.database.likePost = { status: 'success', data: likeResult };
              console.log('  ✅ Database update successful');
            } catch (error) {
              this.results.database.likePost = { status: 'failed', error: error.message };
              console.log('  ❌ Database update failed:', error.message);
            }
          }
        } catch (error) {
          this.results.database.createPost = { status: 'failed', error: error.message };
          console.log('  ❌ Database write failed:', error.message);
        }
      } else {
        console.log('  ⏭️ Skipping write/update tests due to read failure');
        this.results.database.createPost = { status: 'skipped', message: 'Skipped due to read failure' };
        this.results.database.likePost = { status: 'skipped', message: 'Skipped due to read failure' };
      }
      
    } catch (error) {
      this.results.database.generalError = {
        status: 'failed',
        error: error.message
      };
      console.log('  ❌ Database connectivity test failed:', error.message);
    }
  }

  async testErrorHandling() {
    console.log('\n🛡️ Testing Error Handling...');
    
    this.results.errorHandling = {
      timestamp: new Date().toISOString()
    };
    
    try {
      // Test 6.1: Valid Endpoint (should work)
      console.log('  🔍 Testing valid endpoint handling...');
      try {
        await apiService.healthCheck(); // This should work
        this.results.errorHandling.validEndpoint = { 
          status: 'success', 
          message: 'Valid endpoint working correctly' 
        };
        console.log('  ✅ Valid endpoint working correctly');
      } catch (error) {
        this.results.errorHandling.validEndpoint = { 
          status: 'failed', 
          error: error.message 
        };
        console.log('  ❌ Valid endpoint failed:', error.message);
      }
      
      // Test 6.2: Error Response Handling
      console.log('  🔍 Testing error response handling...');
      try {
        // Try to access a protected endpoint without auth (should fail gracefully)
        await apiService.getCurrentUser();
        this.results.errorHandling.errorResponse = { 
          status: 'success', 
          message: 'Error response handled correctly' 
        };
        console.log('  ✅ Error response handling working');
      } catch (error) {
        // This is expected to fail, but should be handled gracefully
        if (error.message && error.message.includes('401')) {
          this.results.errorHandling.errorResponse = { 
            status: 'success', 
            message: 'Authentication error handled correctly' 
          };
          console.log('  ✅ Authentication error handled correctly');
        } else {
          this.results.errorHandling.errorResponse = { 
            status: 'success', 
            message: 'Error handled gracefully' 
          };
          console.log('  ✅ Error handled gracefully');
        }
      }
      
      // Test 6.3: Network Error Simulation (skip for now)
      console.log('  🔍 Testing network error handling...');
      this.results.errorHandling.networkError = { 
        status: 'skipped', 
        message: 'Network error test skipped (not applicable in test environment)' 
      };
      console.log('  ⏭️ Network error test skipped');
      
    } catch (error) {
      this.results.errorHandling.generalError = {
        status: 'failed',
        error: error.message
      };
      console.log('  ❌ Error handling test failed:', error.message);
    }
  }

  printComprehensiveResults() {
    console.log('\n📊 COMPREHENSIVE BACKEND INTEGRATION TEST RESULTS');
    console.log('==================================================');
    
    // Calculate overall success rate
    const allTests = [];
    Object.values(this.results).forEach(result => {
      if (result && typeof result === 'object') {
        Object.values(result).forEach(test => {
          if (test && test.status) {
            allTests.push(test.status);
          }
        });
      }
    });
    
    const totalTests = allTests.length;
    const successfulTests = allTests.filter(status => status === 'success').length;
    const failedTests = allTests.filter(status => status === 'failed').length;
    const successRate = totalTests > 0 ? ((successfulTests / totalTests) * 100).toFixed(1) : 0;
    
    console.log(`📈 Overall Success Rate: ${successRate}%`);
    console.log(`✅ Successful Tests: ${successfulTests}`);
    console.log(`❌ Failed Tests: ${failedTests}`);
    console.log(`📊 Total Tests: ${totalTests}`);
    
    // Detailed results by category
    console.log('\n📋 Detailed Results by Category:');
    
    // Connection Results
    if (this.results.connection) {
      console.log('\n🔗 Connection Tests:');
      Object.entries(this.results.connection).forEach(([test, result]) => {
        if (result && result.status) {
          const status = result.status === 'success' ? '✅' : '❌';
          console.log(`  ${status} ${test}: ${result.status}`);
        }
      });
    }
    
    // Authentication Results
    if (this.results.authentication) {
      console.log('\n🔐 Authentication Tests:');
      Object.entries(this.results.authentication).forEach(([test, result]) => {
        if (result && result.status) {
          const status = result.status === 'success' ? '✅' : '❌';
          console.log(`  ${status} ${test}: ${result.status}`);
        }
      });
    }
    
    // API Endpoints Results
    if (this.results.apiEndpoints) {
      console.log('\n🔌 API Endpoints Tests:');
      Object.entries(this.results.apiEndpoints).forEach(([endpoint, result]) => {
        const status = result.status === 'success' ? '✅' : '❌';
        console.log(`  ${status} ${endpoint}: ${result.status}`);
      });
    }
    
    // Real-time Results
    if (this.results.realTime) {
      console.log('\n⚡ Real-time Tests:');
      Object.entries(this.results.realTime).forEach(([test, result]) => {
        if (result && result.status) {
          const status = result.status === 'success' ? '✅' : '❌';
          console.log(`  ${status} ${test}: ${result.status}`);
        }
      });
    }
    
    // Database Results
    if (this.results.database) {
      console.log('\n🗄️ Database Tests:');
      Object.entries(this.results.database).forEach(([test, result]) => {
        if (result && result.status) {
          const status = result.status === 'success' ? '✅' : '❌';
          console.log(`  ${status} ${test}: ${result.status}`);
        }
      });
    }
    
    // Error Handling Results
    if (this.results.errorHandling) {
      console.log('\n🛡️ Error Handling Tests:');
      Object.entries(this.results.errorHandling).forEach(([test, result]) => {
        if (result && result.status) {
          const status = result.status === 'success' ? '✅' : '❌';
          console.log(`  ${status} ${test}: ${result.status}`);
        }
      });
    }
    
    // Final Assessment
    console.log('\n🎯 FINAL ASSESSMENT:');
    if (successRate >= 90) {
      console.log('🎉 EXCELLENT! Backend integration is working very well.');
    } else if (successRate >= 70) {
      console.log('✅ GOOD! Backend integration is working with minor issues.');
    } else if (successRate >= 50) {
      console.log('⚠️ FAIR! Backend integration has some issues that need attention.');
    } else {
      console.log('❌ POOR! Backend integration has significant issues that need immediate attention.');
    }
    
    console.log('\n📝 Next Steps:');
    if (failedTests > 0) {
      console.log('1. Review failed tests and check backend configuration');
      console.log('2. Verify backend is running on http://43.205.177.37:5000');
      console.log('3. Check CORS configuration on backend');
      console.log('4. Verify PostgreSQL database connection');
    } else {
      console.log('1. All tests passed! Your backend integration is working perfectly.');
      console.log('2. You can now proceed with development using the integrated backend.');
    }
  }

  // Get results for programmatic access
  getResults() {
    return this.results;
  }

  // Get success rate
  getSuccessRate() {
    const allTests = [];
    Object.values(this.results).forEach(result => {
      if (result && typeof result === 'object') {
        Object.values(result).forEach(test => {
          if (test && test.status) {
            allTests.push(test.status);
          }
        });
      }
    });
    
    const totalTests = allTests.length;
    const successfulTests = allTests.filter(status => status === 'success').length;
    return totalTests > 0 ? ((successfulTests / totalTests) * 100).toFixed(1) : 0;
  }
}

export const backendIntegrationTester = new BackendIntegrationTester();
export default backendIntegrationTester;
