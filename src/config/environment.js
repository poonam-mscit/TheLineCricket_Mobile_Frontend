// Environment configuration
const ENV = {
  development: {
    API_BASE_URL: 'http://43.205.177.37:5000/api',
    SOCKET_URL: 'http://43.205.177.37:5000',
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
    API_BASE_URL: 'http://43.205.177.37:5000/api',
    SOCKET_URL: 'http://43.205.177.37:5000',
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

// Default environment configuration
const defaultConfig = {
  API_BASE_URL: 'http://43.205.177.37:5000/api',
  SOCKET_URL: 'http://43.205.177.37:5000',
  FIREBASE_CONFIG: {
    apiKey: "AIzaSyDJ_Vh_J0BHUEsRX3PexJWWjk2PbqhDZo0",
    authDomain: "linecricket-1a2b3.firebaseapp.com",
    projectId: "linecricket-1a2b3",
    storageBucket: "linecricket-1a2b3.firebasestorage.app",
    messagingSenderId: "1080197808632",
    appId: "1:1080197808632:android:d80a3dbfea3c0a58d3d60d"
  }
};

// Get current environment
const getEnvironment = () => {
  try {
    // Try to get development environment
    return ENV.development || defaultConfig;
  } catch (error) {
    console.warn('Environment detection failed, using default config:', error);
    return defaultConfig;
  }
};

// Export the environment directly with fallback
export default ENV.development || defaultConfig;
