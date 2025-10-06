// Token management service
import AsyncStorage from '@react-native-async-storage/async-storage';

class TokenService {
  // Store authentication tokens
  async setTokens(accessToken, refreshToken) {
    try {
      await AsyncStorage.multiSet([
        ['authToken', accessToken],
        ['refreshToken', refreshToken]
      ]);
      console.log('✅ Tokens stored successfully');
    } catch (error) {
      console.error('❌ Error storing tokens:', error);
      throw error;
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
      await AsyncStorage.multiRemove(['authToken', 'refreshToken', 'userData']);
      console.log('✅ Tokens cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing tokens:', error);
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

  // Store user data
  async storeUserData(userData) {
    try {
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
