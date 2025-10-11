// API client configuration using fetch for React Native compatibility
import AsyncStorage from '@react-native-async-storage/async-storage';
import environment from '../config/environment';

// Create a fetch-based API client for React Native
class ApiClient {
  constructor() {
    this.baseURL = environment.API_BASE_URL;
    this.timeout = 30000;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = await AsyncStorage.getItem('authToken');
    
    // Check network connectivity
    if (!this.baseURL || this.baseURL === 'undefined') {
      throw new Error('API base URL not configured. Please check environment settings.');
    }
    
    // Try alternative URLs if main URL fails
    const alternativeUrls = environment.ALTERNATIVE_URLS || [];
    const urlsToTry = [this.baseURL, ...alternativeUrls.filter(url => url !== this.baseURL)];
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'TheLineCricket-Mobile/1.0.0',
    };

    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      method: 'GET',
      headers: { ...defaultHeaders, ...options.headers },
      timeout: 30000, // Increased to 30 second timeout
      ...options,
    };

    // Try each URL until one works
    let lastError = null;
    
    for (let i = 0; i < urlsToTry.length; i++) {
      const currentUrl = `${urlsToTry[i]}${endpoint}`;
      
      try {
        console.log(`🌐 Making API request to (attempt ${i + 1}/${urlsToTry.length}):`, currentUrl);
        console.log('📡 Request config:', { method: config.method, headers: config.headers });
        console.log('⏱️ Timeout set to 30 seconds');
        
        // Add timeout handling for React Native
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log('⏰ Request timeout triggered after 30 seconds');
          controller.abort();
        }, 30000);
        
        const response = await fetch(currentUrl, {
          ...config,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', response.headers);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ API request failed with status:', response.status);
          console.error('❌ Error response:', errorText);
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('✅ API request successful');
        console.log('📡 Response data:', data);
        return { data, status: response.status };
        
      } catch (error) {
        lastError = error;
        console.warn(`⚠️ Attempt ${i + 1} failed for ${currentUrl}:`, error.message);
        
        // If this is not the last URL, continue to next one
        if (i < urlsToTry.length - 1) {
          console.log(`🔄 Trying next URL: ${urlsToTry[i + 1]}${endpoint}`);
          continue;
        }
      }
    }
    
    // If all URLs failed, throw the last error with enhanced messaging
    if (lastError) {
      if (lastError.name === 'AbortError') {
        console.error('❌ Request timeout after 30 seconds');
        throw new Error('Request timeout - the server is taking too long to respond. Please check your network connection and try again.');
      }
      
      // Enhanced error handling for network issues
      if (lastError.message.includes('Network request failed')) {
        console.error('🌐 Network Error: Unable to reach the backend server');
        console.error('💡 Troubleshooting steps:');
        console.error('   1. Check if the backend server is running');
        console.error('   2. Verify the IP address is correct:', this.baseURL);
        console.error('   3. Ensure both devices are on the same network');
        console.error('   4. Check firewall settings');
        console.error('   5. Tried alternative URLs:', urlsToTry);
        throw new Error('Network error: Unable to connect to the server. Please check your internet connection and ensure the backend server is running.');
      }
      
      if (lastError.message.includes('TypeError')) {
        console.error('🔗 Connection Error: Failed to establish connection');
        throw new Error('Connection failed: Unable to reach the server. Please check your network settings and try again.');
      }
      
      console.error('❌ All API request attempts failed');
      console.error('🔍 Last error details:', lastError.message);
      console.error('🔍 URLs tried:', urlsToTry);
      throw lastError;
    }
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

const apiClient = new ApiClient();

export default apiClient;
