// TypeScript type definitions for authentication

export interface User {
  // Primary key
  id: string; // UUID from database
  
  // Authentication fields (from database)
  firebase_uid?: string;
  firebase_email?: string;
  cognito_user_id?: string;
  email: string; // NOT NULL in database
  username: string; // NOT NULL in database
  is_verified: boolean; // NOT NULL in database
  is_active: boolean; // NOT NULL in database
  auth_provider: string; // NOT NULL in database
  
  // Timestamps (from database)
  created_at: string; // TIMESTAMP WITHOUT TIME ZONE NOT NULL
  updated_at: string; // TIMESTAMP WITHOUT TIME ZONE NOT NULL
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
  // Required fields from database users table
  email: string; // NOT NULL
  username: string; // NOT NULL
  auth_provider: string; // NOT NULL - 'firebase', 'cognito', etc.
  
  // Optional authentication fields
  firebase_uid?: string;
  firebase_email?: string;
  cognito_user_id?: string;
  
  // User status (will be set by backend)
  is_verified?: boolean; // Default false
  is_active?: boolean; // Default true
  
  // Frontend-only fields (not in database)
  password?: string; // For form validation
  confirmPassword?: string; // For form validation
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

// Post interface - matches database posts table exactly
export interface Post {
  // Primary key
  id: string; // UUID from database
  
  // Required fields from database
  user_id: string; // UUID NOT NULL REFERENCES users(id)
  content: string; // TEXT NOT NULL
  post_type: string; // VARCHAR(50) NOT NULL CHECK (post_type IN ('general', 'community', 'academy', 'venue', 'match', 'event', 'announcement'))
  
  // Optional content fields
  image_url?: any; // JSONB
  video_url?: string; // VARCHAR(500)
  location?: string; // VARCHAR(100)
  
  // Engagement metrics
  likes_count?: number; // INTEGER
  comments_count?: number; // INTEGER
  shares_count?: number; // INTEGER
  bookmarks_count?: number; // INTEGER
  views_count?: number; // INTEGER
  
  // Post settings
  visibility?: string; // VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public','community', 'academy', 'venue'))
  is_pinned?: boolean; // BOOLEAN DEFAULT false
  is_approved?: boolean; // BOOLEAN DEFAULT true
  approval_status?: string; // VARCHAR(20) DEFAULT 'approved' CHECK (approval_status IN ('pending', 'approved', 'rejected'))
  
  // Engagement scoring
  engagement_score?: number; // DOUBLE PRECISION
  trending_score?: number; // DOUBLE PRECISION
  
  // Social features
  hashtags?: string; // VARCHAR(500)
  mentions?: string; // VARCHAR(500)
  
  // Page associations
  page_id?: string; // UUID REFERENCES page_profiles(page_id)
  community_profile_id?: string; // UUID REFERENCES page_profiles(page_id)
  academy_profile_id?: string; // UUID REFERENCES page_profiles(page_id)
  venue_profile_id?: string; // UUID REFERENCES page_profiles(page_id)
  
  // Post metadata
  title?: string; // VARCHAR(200)
  moderator_notes?: string; // TEXT
  post_category?: string; // VARCHAR(50)
  tags?: string; // VARCHAR(500)
  featured?: boolean; // BOOLEAN DEFAULT false
  priority?: number; // INTEGER DEFAULT 0
  
  // Event fields
  event_date?: string; // DATE
  event_time?: string; // TIME WITHOUT TIME ZONE
  event_location?: string; // VARCHAR(200)
  max_participants?: number; // INTEGER
  registration_fee?: number; // DOUBLE PRECISION
  registration_deadline?: string; // DATE
  
  // Scheduling
  schedule_time: string; // TIMESTAMP WITHOUT TIME ZONE NOT NULL
  
  // Search optimization
  content_tsv?: any; // TSVECTOR
  search_vector?: any; // TSVECTOR
  
  // Status and tracking
  is_active?: boolean; // BOOLEAN DEFAULT true
  created_by?: string; // UUID REFERENCES users(id)
  updated_by?: string; // UUID REFERENCES users(id)
  
  // Timestamps
  created_at: string; // TIMESTAMP WITHOUT TIME ZONE NOT NULL
  updated_at: string; // TIMESTAMP WITHOUT TIME ZONE NOT NULL
}

// Match interface - matches database matches table exactly
export interface Match {
  // Primary key
  id: string; // UUID from database
  
  // Required fields from database
  creator_id: string; // UUID NOT NULL REFERENCES users(id)
  match_name: string; // VARCHAR(200) NOT NULL
  match_type: string; // MATCHTYPE NOT NULL
  match_format: string; // MATCHFORMAT NOT NULL
  location: string; // VARCHAR(200) NOT NULL
  match_date: string; // DATE NOT NULL
  match_time: string; // TIME WITHOUT TIME ZONE NOT NULL
  players_needed: number; // INTEGER NOT NULL
  
  // Optional match details
  description?: string; // TEXT
  venue?: string; // VARCHAR(200)
  entry_fee?: number; // DOUBLE PRECISION
  is_public?: boolean; // BOOLEAN
  status?: string; // MATCHSTATUS
  match_summary?: string; // TEXT
  stream_url?: string; // VARCHAR(500)
  skill_level?: string; // VARCHAR(50)
  minimum_age?: number; // INTEGER(5)
  maximum_age?: number; // INTEGER(50)
  equipment_provided?: boolean; // BOOLEAN
  price_money_amount?: number; // DOUBLE PRECISION
  rules?: string; // TEXT
  
  // Weather conditions
  weather?: string; // VARCHAR(20) DEFAULT 'unknown'
  temperature?: number; // DOUBLE PRECISION
  wind_speed?: number; // DOUBLE PRECISION
  humidity?: number; // DOUBLE PRECISION
  
  // Match statistics
  total_views?: number; // INTEGER DEFAULT 0
  total_interested?: number; // INTEGER DEFAULT 0
  total_joined?: number; // INTEGER DEFAULT 0
  total_left?: number; // INTEGER DEFAULT 0
  
  // Duration tracking
  estimated_duration?: number; // INTEGER
  actual_duration?: number; // INTEGER
  start_time_actual?: string; // TIMESTAMP WITHOUT TIME ZONE
  end_time_actual?: string; // TIMESTAMP WITHOUT TIME ZONE
  
  // Match results
  winner_team?: string; // VARCHAR(100)
  man_of_the_match?: string; // VARCHAR(100)
  best_bowler?: string; // VARCHAR(100)
  best_batsman?: string; // VARCHAR(100)
  
  // Media content
  photos?: any; // JSON DEFAULT '[]'::json
  videos?: any; // JSON DEFAULT '[]'::json
  highlights?: any; // JSON DEFAULT '[]'::json
  
  // Tracking
  last_updated?: string; // TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
  update_count?: number; // INTEGER DEFAULT 0
  is_active?: boolean; // BOOLEAN DEFAULT true
  created_by?: string; // UUID REFERENCES users(id)
  updated_by?: string; // UUID REFERENCES users(id)
  
  // Timestamps
  created_at: string; // TIMESTAMP WITHOUT TIME ZONE NOT NULL
  updated_at: string; // TIMESTAMP WITHOUT TIME ZONE NOT NULL
}
