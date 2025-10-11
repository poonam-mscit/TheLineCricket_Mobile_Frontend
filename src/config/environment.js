// Environment configuration
const ENV = {
  development: {
    // Use machine IP for React Native development
    API_BASE_URL: 'http://10.147.173.114:5000',
    SOCKET_URL: 'http://10.147.173.114:5000',
    ENVIRONMENT: 'development',
    DEBUG: true,
    // Alternative URLs for network troubleshooting
    ALTERNATIVE_URLS: [
      'http://10.147.173.114:5000',
      'http://localhost:5000',
      'http://127.0.0.1:5000'
    ],
    FIREBASE_CONFIG: {
      apiKey: "AIzaSyDJ_Vh_J0BHUEsRX3PexJWWjk2PbqhDZo0",
      authDomain: "linecricket-1a2b3.firebaseapp.com",
      projectId: "linecricket-1a2b3",
      storageBucket: "linecricket-1a2b3.firebasestorage.app",
      messagingSenderId: "1080197808632",
      appId: "1:1080197808632:android:d80a3dbfea3c0a58d3d60d"
    }
  },
  production: {
    // Update these URLs when you deploy to production
    API_BASE_URL: 'https://your-production-domain.com',
    SOCKET_URL: 'https://your-production-domain.com',
    ENVIRONMENT: 'production',
    DEBUG: false,
    FIREBASE_CONFIG: {
      apiKey: "AIzaSyDJ_Vh_J0BHUEsRX3PexJWWjk2PbqhDZo0",
      authDomain: "linecricket-1a2b3.firebaseapp.com",
      projectId: "linecricket-1a2b3",
      storageBucket: "linecricket-1a2b3.firebasestorage.app",
      messagingSenderId: "1080197808632",
      appId: "1:1080197808632:android:d80a3dbfea3c0a58d3d60d"
    }
  }
};

// Get current environment based on __DEV__ flag or process.env
const getCurrentEnvironment = () => {
  try {
    // In React Native, __DEV__ is true in development
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      return ENV.development;
    }
    
    // Check for explicit environment variable
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV) {
      return ENV[process.env.NODE_ENV] || ENV.development;
    }
    
    // Default to development for mobile app
    return ENV.development;
  } catch (error) {
    console.warn('Environment detection failed, using development config:', error);
    return ENV.development;
  }
};

// Get current environment configuration
const currentEnv = getCurrentEnvironment();

// Validate critical configuration
if (!currentEnv.API_BASE_URL || currentEnv.API_BASE_URL === 'undefined') {
  console.error('❌ API_BASE_URL not configured properly');
}

if (!currentEnv.SOCKET_URL || currentEnv.SOCKET_URL === 'undefined') {
  console.error('❌ SOCKET_URL not configured properly');
}

if (!currentEnv.FIREBASE_CONFIG || !currentEnv.FIREBASE_CONFIG.apiKey) {
  console.error('❌ FIREBASE_CONFIG not configured properly');
}

// Log current configuration (without sensitive data)
console.log('🔧 Mobile App Configuration:');
console.log('📡 API Base URL:', currentEnv.API_BASE_URL);
console.log('🔌 Socket URL:', currentEnv.SOCKET_URL);
console.log('🌍 Environment:', currentEnv.ENVIRONMENT);
console.log('🐛 Debug Mode:', currentEnv.DEBUG);

// Export the current environment configuration
export default currentEnv;
