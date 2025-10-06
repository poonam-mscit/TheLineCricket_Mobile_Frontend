// TypeScript type definitions for authentication

export interface User {
  id: string;
  email: string;
  fullName: string;
  username: string;
  age?: number;
  location?: string;
  profileImageUrl?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: string;
  location: string;
  profileType?: 'player' | 'community' | 'venue';
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface FormState {
  isValid: boolean;
  errors: ValidationErrors;
}
