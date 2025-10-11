// Network connectivity utilities
import NetInfo from '@react-native-community/netinfo';

class NetworkUtils {
  /**
   * Check if device is connected to internet
   */
  static async isConnected() {
    try {
      const state = await NetInfo.fetch();
      return state.isConnected && state.isInternetReachable;
    } catch (error) {
      console.error('Network check error:', error);
      return false;
    }
  }

  /**
   * Get network state
   */
  static async getNetworkState() {
    try {
      return await NetInfo.fetch();
    } catch (error) {
      console.error('Network state error:', error);
      return null;
    }
  }

  /**
   * Wait for network connection
   */
  static async waitForConnection(timeout = 10000) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Network connection timeout'));
      }, timeout);

      const unsubscribe = NetInfo.addEventListener(state => {
        if (state.isConnected && state.isInternetReachable) {
          clearTimeout(timeoutId);
          unsubscribe();
          resolve(state);
        }
      });
    });
  }

  /**
   * Check network before making API calls
   */
  static async checkNetworkBeforeApiCall() {
    const isConnected = await this.isConnected();
    if (!isConnected) {
      throw new Error('No internet connection. Please check your network settings and try again.');
    }
    return true;
  }
}

export default NetworkUtils;
