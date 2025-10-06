import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  fullName: string;
  username: string;
  age?: number;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (userData: any) => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔐 Initializing authentication...');
        
        // Simulate checking for stored authentication
        // In a real app, you would check AsyncStorage or secure storage
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For demo purposes, start with no user
        console.log('🔐 No stored authentication found');
        setUser(null);
      } catch (error) {
        console.error('❌ Auth initialization failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
        console.log('🔐 Authentication initialization complete');
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔑 Starting login process...');
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any email/password
      if (email && password) {
        const loginUser = {
          id: '1',
          email,
          fullName: 'Demo User',
          username: email.split('@')[0]
        };
        
        console.log('✅ Login successful:', loginUser);
        setUser(loginUser);
        return true;
      }
      
      console.log('❌ Login failed: Invalid credentials');
      return false;
    } catch (error) {
      console.error('❌ Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: any): Promise<boolean> => {
    try {
      console.log('📝 Starting signup process...', userData);
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate required fields
      if (!userData.email || !userData.password || !userData.fullName) {
        console.log('❌ Signup failed: Missing required fields');
        return false;
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(), // Generate unique ID
        email: userData.email,
        fullName: userData.fullName,
        username: userData.username || userData.email.split('@')[0],
        age: userData.age,
        location: userData.location
      };
      
      console.log('✅ Signup successful:', newUser);
      setUser(newUser);
      
      // Ensure state is set before returning
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return true;
    } catch (error) {
      console.error('❌ Signup error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('🚪 Logging out user...');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    signup,
    loading
  };

  console.log('🔐 Auth state:', { 
    isAuthenticated: !!user, 
    loading, 
    user: user ? { id: user.id, email: user.email, fullName: user.fullName } : null 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
