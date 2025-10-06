// API client configuration
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import environment from '../config/environment';

// Create axios instance
const apiClient = axios.create({
  baseURL: environment.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${environment.API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken
          });
          
          const { access_token } = response.data;
          await AsyncStorage.setItem('authToken', access_token);
          
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        await AsyncStorage.multiRemove(['authToken', 'refreshToken', 'userData']);
        // You can dispatch a logout action here if using Redux
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
