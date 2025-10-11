// Database-aligned TypeScript interfaces
// These interfaces exactly match the database schema columns

// Page Profile interface - matches database page_profiles table exactly
export interface PageProfile {
  // Primary key
  page_id: string; // UUID from database
  
  // Required fields from database
  user_id: string; // UUID NOT NULL REFERENCES users(id)
  organization_name: string; // VARCHAR(200) NOT NULL
  page_type: string; // PAGETYPE NOT NULL
  
  // Authentication fields
  firebase_uid?: string; // VARCHAR(255)
  cognito_user_id?: string; // VARCHAR(255)
  
  // Basic information
  tagline?: string; // VARCHAR(300)
  description?: string; // TEXT
  bio?: string; // TEXT
  contact_person?: string; // VARCHAR(100)
  contact_number?: string; // VARCHAR(20)
  email?: string; // VARCHAR(255)
  website?: string; // VARCHAR(500)
  
  // Location information
  address?: string; // TEXT
  city?: string; // VARCHAR(100)
  state?: string; // VARCHAR(100)
  country?: string; // VARCHAR(100)
  pincode?: string; // VARCHAR(20)
  latitude?: number; // DOUBLE PRECISION
  longitude?: number; // DOUBLE PRECISION
  
  // Media
  logo_url?: string; // VARCHAR(500)
  banner_image_url?: string; // VARCHAR(500)
  gallery_images?: string; // TEXT
  
  // Services and facilities
  facilities?: string; // TEXT
  services_offered?: string; // TEXT
  
  // Social media
  instagram_handle?: string; // VARCHAR(100)
  facebook_handle?: string; // VARCHAR(100)
  twitter_handle?: string; // VARCHAR(100)
  youtube_handle?: string; // VARCHAR(100)
  
  // Additional information
  achievements?: string; // TEXT
  testimonials?: string; // TEXT
  
  // Settings
  is_public?: boolean; // BOOLEAN
  allow_messages?: boolean; // BOOLEAN
  show_contact?: boolean; // BOOLEAN
  is_verified?: boolean; // BOOLEAN
  is_active?: boolean; // BOOLEAN DEFAULT true
  
  // Tracking
  created_by?: string; // UUID REFERENCES users(id)
  updated_by?: string; // UUID REFERENCES users(id)
  deleted_at?: string; // TIMESTAMP WITHOUT TIME ZONE
  
  // Timestamps
  created_at: string; // TIMESTAMP WITHOUT TIME ZONE NOT NULL
  updated_at: string; // TIMESTAMP WITHOUT TIME ZONE NOT NULL
}

// Message interface - matches database messages table exactly
export interface Message {
  // Primary key
  id: string; // UUID from database
  
  // Required fields from database
  conversation_id: string; // UUID NOT NULL REFERENCES conversations(id)
  sender_id: string; // UUID NOT NULL REFERENCES users(id)
  receiver_id: string; // UUID NOT NULL REFERENCES users(id)
  content: string; // TEXT NOT NULL
  
  // Optional fields
  is_read?: boolean; // BOOLEAN
  read_at?: string; // TIMESTAMP WITHOUT TIME ZONE
  
  // Timestamps
  created_at: string; // TIMESTAMP WITHOUT TIME ZONE NOT NULL
  updated_at: string; // TIMESTAMP WITHOUT TIME ZONE NOT NULL
}

// Conversation interface - matches database conversations table exactly
export interface Conversation {
  // Primary key
  id: string; // UUID from database
  
  // Required fields from database
  user1_id: string; // UUID NOT NULL REFERENCES users(id)
  user2_id: string; // UUID NOT NULL REFERENCES users(id)
  
  // Optional fields
  last_message_at?: string; // TIMESTAMP WITHOUT TIME ZONE
  last_message_content?: string; // TEXT
  is_active?: boolean; // BOOLEAN DEFAULT true
  created_by?: string; // UUID REFERENCES users(id)
  updated_by?: string; // UUID REFERENCES users(id)
  
  // Timestamps
  created_at: string; // TIMESTAMP WITHOUT TIME ZONE NOT NULL
  updated_at: string; // TIMESTAMP WITHOUT TIME ZONE NOT NULL
}

// Notification interface - matches database notifications table exactly
export interface Notification {
  // Primary key
  id: string; // UUID from database
  
  // Required fields from database
  sender_id: string; // UUID NOT NULL REFERENCES users(id)
  receiver_id: string; // UUID NOT NULL REFERENCES users(id)
  type: string; // NOTIFICATIONTYPE NOT NULL
  title: string; // VARCHAR(200) NOT NULL
  content: string; // TEXT NOT NULL
  
  // Optional fields
  is_read?: boolean; // BOOLEAN
  read_at?: string; // TIMESTAMP WITHOUT TIME ZONE
  related_post_id?: string; // UUID REFERENCES posts(id)
  related_match_id?: string; // UUID REFERENCES matches(id)
  related_message_id?: string; // UUID REFERENCES messages(id)
  
  // Timestamps
  created_at: string; // TIMESTAMP WITHOUT TIME ZONE NOT NULL
  updated_at: string; // TIMESTAMP WITHOUT TIME ZONE NOT NULL
}

// Match Participant interface - matches database match_participants table exactly
export interface MatchParticipant {
  // Primary key
  id: string; // UUID from database
  
  // Required fields from database
  match_id: string; // UUID NOT NULL REFERENCES matches(id)
  user_id: string; // UUID NOT NULL REFERENCES users(id)
  
  // Optional fields
  joined_at?: string; // TIMESTAMP WITHOUT TIME ZONE
  
  // Timestamps
  created_at: string; // TIMESTAMP WITHOUT TIME ZONE NOT NULL
  updated_at: string; // TIMESTAMP WITHOUT TIME ZONE NOT NULL
}

// Post Like interface - matches database post_likes table exactly
export interface PostLike {
  // Primary key
  id: string; // UUID from database
  
  // Required fields from database
  post_id: string; // UUID NOT NULL REFERENCES posts(id)
  user_id: string; // UUID NOT NULL REFERENCES users(id)
  
  // Timestamps
  created_at: string; // TIMESTAMP WITHOUT TIME ZONE NOT NULL
  updated_at: string; // TIMESTAMP WITHOUT TIME ZONE NOT NULL
}

// Post Comment interface - matches database post_comments table exactly
export interface PostComment {
  // Primary key
  id: string; // UUID from database
  
  // Required fields from database
  post_id: string; // UUID NOT NULL REFERENCES posts(id)
  user_id: string; // UUID NOT NULL REFERENCES users(id)
  content: string; // TEXT NOT NULL
  
  // Optional fields
  parent_comment_id?: string; // UUID REFERENCES post_comments(id)
  
  // Timestamps
  created_at: string; // TIMESTAMP WITHOUT TIME ZONE NOT NULL
  updated_at: string; // TIMESTAMP WITHOUT TIME ZONE NOT NULL
}

// Relationship interface - matches database relationships table exactly
export interface Relationship {
  // Primary key
  id: string; // UUID from database
  
  // Required fields from database
  follower_id: string; // UUID NOT NULL REFERENCES users(id)
  following_id: string; // UUID NOT NULL REFERENCES users(id)
  relationship_type: string; // RELATIONSHIPTYPE NOT NULL
  
  // Optional fields
  status?: string; // RELATIONSHIPSTATUS
  accepted_at?: string; // TIMESTAMP WITHOUT TIME ZONE
  rejected_at?: string; // TIMESTAMP WITHOUT TIME ZONE
  message?: string; // TEXT
  is_mutual?: boolean; // BOOLEAN
  
  // Timestamps
  created_at: string; // TIMESTAMP WITHOUT TIME ZONE NOT NULL
  updated_at: string; // TIMESTAMP WITHOUT TIME ZONE NOT NULL
}
