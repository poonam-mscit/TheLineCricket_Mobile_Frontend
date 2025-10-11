// Token management service
import AsyncStorage from '@react-native-async-storage/async-storage';

class TokenService {
  // Store authentication tokens
  async setTokens(accessToken, refreshToken) {
    try {
      if (!accessToken) {
        throw new Error('Access token is required');
      }
      
      await AsyncStorage.multiSet([
        ['authToken', accessToken],
        ['refreshToken', refreshToken || '']
      ]);
      console.log('✅ Tokens stored successfully');
    } catch (error) {
      console.error('❌ Error storing tokens:', error);
      throw error;
    }
  }

  // Store Firebase ID token
  async setFirebaseToken(firebaseToken) {
    try {
      if (!firebaseToken) {
        throw new Error('Firebase token is required');
      }
      
      await AsyncStorage.setItem('firebaseToken', firebaseToken);
      console.log('✅ Firebase token stored successfully');
    } catch (error) {
      console.error('❌ Error storing Firebase token:', error);
      throw error;
    }
  }

  // Get Firebase ID token
  async getFirebaseToken() {
    try {
      const token = await AsyncStorage.getItem('firebaseToken');
      return token;
    } catch (error) {
      console.error('❌ Error getting Firebase token:', error);
      return null;
    }
  }

  // Get stored access token
  async getAccessToken() {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return token;
    } catch (error) {
      console.error('❌ Error getting access token:', error);
      return null;
    }
  }

  // Get stored refresh token
  async getRefreshToken() {
    try {
      const token = await AsyncStorage.getItem('refreshToken');
      return token;
    } catch (error) {
      console.error('❌ Error getting refresh token:', error);
      return null;
    }
  }

  // Clear all tokens
  async clearTokens() {
    try {
      await AsyncStorage.multiRemove(['authToken', 'refreshToken', 'firebaseToken', 'userData']);
      console.log('✅ All tokens cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing tokens:', error);
      throw error;
    }
  }

  // Clear only Firebase tokens
  async clearFirebaseTokens() {
    try {
      await AsyncStorage.multiRemove(['firebaseToken']);
      console.log('✅ Firebase tokens cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing Firebase tokens:', error);
      throw error;
    }
  }

  // Clear only backend tokens
  async clearBackendTokens() {
    try {
      await AsyncStorage.multiRemove(['authToken', 'refreshToken']);
      console.log('✅ Backend tokens cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing backend tokens:', error);
      throw error;
    }
  }

  // Check if token exists
  async hasToken() {
    try {
      const token = await AsyncStorage.getItem('authToken');
      return !!token;
    } catch (error) {
      console.error('❌ Error checking token:', error);
      return false;
    }
  }

  // Check if Firebase token exists
  async hasFirebaseToken() {
    try {
      const token = await AsyncStorage.getItem('firebaseToken');
      return !!token;
    } catch (error) {
      console.error('❌ Error checking Firebase token:', error);
      return false;
    }
  }

  // Get all stored tokens
  async getAllTokens() {
    try {
      const [authToken, refreshToken, firebaseToken] = await AsyncStorage.multiGet([
        'authToken',
        'refreshToken', 
        'firebaseToken'
      ]);
      
      return {
        authToken: authToken[1],
        refreshToken: refreshToken[1],
        firebaseToken: firebaseToken[1]
      };
    } catch (error) {
      console.error('❌ Error getting all tokens:', error);
      return {
        authToken: null,
        refreshToken: null,
        firebaseToken: null
      };
    }
  }

  // Store user data
  async storeUserData(userData) {
    try {
      if (!userData || typeof userData !== 'object') {
        throw new Error('Valid user data object is required');
      }
      
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      console.log('✅ User data stored successfully');
    } catch (error) {
      console.error('❌ Error storing user data:', error);
      throw error;
    }
  }

  // Get stored user data
  async getUserData() {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('❌ Error getting user data:', error);
      return null;
    }
  }

  // Clear user data
  async clearUserData() {
    try {
      await AsyncStorage.removeItem('userData');
      console.log('✅ User data cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing user data:', error);
      throw error;
    }
  }
}

export default new TokenService();
