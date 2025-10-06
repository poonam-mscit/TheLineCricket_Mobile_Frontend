// Quick Backend Connection Test
import environment from '../config/environment';
import { apiService } from '../services/apiService';
import { authService } from '../services/authService';

export const quickBackendTest = async () => {
  console.log('🚀 Quick Backend Connection Test');
  console.log('================================');
  console.log(`Backend URL: ${environment.API_BASE_URL}`);
  console.log(`Socket URL: ${environment.SOCKET_URL}`);
  
  const results = {
    connection: false,
    authentication: false,
    apiEndpoints: false,
    errors: []
  };

  try {
    // Test 1: Basic Connection
    console.log('\n📡 Testing basic connection...');
    try {
      const healthCheck = await apiService.healthCheck();
      console.log('✅ Basic connection successful');
      results.connection = true;
    } catch (error) {
      console.log('❌ Basic connection failed:', error.message);
      results.errors.push(`Connection failed: ${error.message}`);
    }

    // Test 2: Authentication
    console.log('\n🔐 Testing authentication...');
    try {
      const testUser = {
        email: `test_${Date.now()}@thelinecricket.com`,
        password: 'TestPassword123!',
        username: `testuser_${Date.now()}`,
        fullName: 'Test User'
      };

      const registerResult = await authService.register(
        testUser.email,
        testUser.password,
        testUser
      );
      console.log('✅ Registration successful');

      const loginResult = await authService.login(
        testUser.email,
        testUser.password
      );
      console.log('✅ Login successful');
      
      results.authentication = true;
    } catch (error) {
      console.log('❌ Authentication failed:', error.message);
      results.errors.push(`Authentication failed: ${error.message}`);
    }

    // Test 3: API Endpoints
    console.log('\n🔌 Testing API endpoints...');
    try {
      const endpoints = [
        { name: 'posts', method: () => apiService.getFeedPosts(1, 5) },
        { name: 'matches', method: () => apiService.getMatches() },
        { name: 'notifications', method: () => apiService.getNotifications(1, 5) },
        { name: 'search', method: () => apiService.globalSearch('test') }
      ];

      let successfulEndpoints = 0;
      for (const endpoint of endpoints) {
        try {
          await endpoint.method();
          console.log(`✅ ${endpoint.name} endpoint working`);
          successfulEndpoints++;
        } catch (error) {
          console.log(`❌ ${endpoint.name} endpoint failed:`, error.message);
        }
      }

      if (successfulEndpoints >= endpoints.length / 2) {
        console.log('✅ API endpoints working');
        results.apiEndpoints = true;
      } else {
        results.errors.push('Most API endpoints failed');
      }
    } catch (error) {
      console.log('❌ API endpoints test failed:', error.message);
      results.errors.push(`API endpoints failed: ${error.message}`);
    }

    // Print Results
    console.log('\n📊 Test Results:');
    console.log('================');
    console.log(`Connection: ${results.connection ? '✅' : '❌'}`);
    console.log(`Authentication: ${results.authentication ? '✅' : '❌'}`);
    console.log(`API Endpoints: ${results.apiEndpoints ? '✅' : '❌'}`);
    
    if (results.errors.length > 0) {
      console.log('\n❌ Errors:');
      results.errors.forEach(error => console.log(`  - ${error}`));
    }

    const successRate = ((results.connection + results.authentication + results.apiEndpoints) / 3) * 100;
    console.log(`\nSuccess Rate: ${successRate.toFixed(1)}%`);

    if (successRate >= 80) {
      console.log('🎉 Backend integration is working well!');
    } else if (successRate >= 60) {
      console.log('⚠️ Backend integration has some issues.');
    } else {
      console.log('❌ Backend integration needs attention.');
    }

    return results;

  } catch (error) {
    console.error('❌ Quick test failed:', error);
    return { ...results, errors: [...results.errors, error.message] };
  }
};

// Export for use in components
export default quickBackendTest;
