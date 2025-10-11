# Complete Database to Frontend Mapping

## Overview
This document provides the complete mapping between database tables and frontend interfaces, ensuring exact column alignment.

## 1. USERS TABLE ✅ COMPLETED

### Database Schema
```sql
CREATE TABLE users (
    firebase_uid VARCHAR(255), 
    firebase_email VARCHAR(255), 
    cognito_user_id VARCHAR(255), 
    email VARCHAR(255) NOT NULL, 
    username VARCHAR(50) NOT NULL, 
    is_verified BOOLEAN NOT NULL, 
    is_active BOOLEAN NOT NULL, 
    auth_provider VARCHAR(50) NOT NULL, 
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
);
```

### Frontend Interface
```typescript
export interface User {
  id: string; // UUID
  firebase_uid?: string;
  firebase_email?: string;
  cognito_user_id?: string;
  email: string; // NOT NULL
  username: string; // NOT NULL
  is_verified: boolean; // NOT NULL
  is_active: boolean; // NOT NULL
  auth_provider: string; // NOT NULL
  created_at: string; // NOT NULL
  updated_at: string; // NOT NULL
}
```

## 2. POSTS TABLE ✅ COMPLETED

### Database Schema
```sql
CREATE TABLE posts (
    user_id UUID NOT NULL REFERENCES users(id), 
    content TEXT NOT NULL, 
    image_url JSONB, 
    video_url VARCHAR(500), 
    location VARCHAR(100), 
    likes_count INTEGER, 
    comments_count INTEGER, 
    shares_count INTEGER, 
    bookmarks_count INTEGER, 
    views_count INTEGER, 
    post_type VARCHAR(50) NOT NULL CHECK (post_type IN ('general', 'community', 'academy', 'venue', 'match', 'event', 'announcement')), 
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public','community', 'academy', 'venue')), 
    is_pinned BOOLEAN DEFAULT false, 
    engagement_score DOUBLE PRECISION, 
    trending_score DOUBLE PRECISION, 
    hashtags VARCHAR(500), 
    mentions VARCHAR(500), 
    page_id UUID REFERENCES page_profiles(page_id), 
    community_profile_id UUID REFERENCES page_profiles(page_id),
    academy_profile_id UUID REFERENCES page_profiles(page_id),
    venue_profile_id UUID REFERENCES page_profiles(page_id),
    title VARCHAR(200), 
    is_approved BOOLEAN DEFAULT true, 
    approval_status VARCHAR(20) DEFAULT 'approved' CHECK (approval_status IN ('pending', 'approved', 'rejected')), 
    moderator_notes TEXT, 
    event_date DATE, 
    event_time TIME WITHOUT TIME ZONE, 
    event_location VARCHAR(200), 
    max_participants INTEGER, 
    registration_fee DOUBLE PRECISION, 
    registration_deadline DATE, 
    post_category VARCHAR(50), 
    tags VARCHAR(500), 
    featured BOOLEAN DEFAULT false, 
    priority INTEGER DEFAULT 0, 
    schedule_time TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    content_tsv TSVECTOR, 
    search_vector TSVECTOR,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
);
```

### Frontend Interface
```typescript
export interface Post {
  id: string; // UUID
  user_id: string; // NOT NULL
  content: string; // NOT NULL
  post_type: string; // NOT NULL
  schedule_time: string; // NOT NULL
  image_url?: any; // JSONB
  video_url?: string;
  location?: string;
  likes_count?: number;
  comments_count?: number;
  shares_count?: number;
  bookmarks_count?: number;
  views_count?: number;
  visibility?: string;
  is_pinned?: boolean;
  engagement_score?: number;
  trending_score?: number;
  hashtags?: string;
  mentions?: string;
  page_id?: string;
  community_profile_id?: string;
  academy_profile_id?: string;
  venue_profile_id?: string;
  title?: string;
  is_approved?: boolean;
  approval_status?: string;
  moderator_notes?: string;
  event_date?: string;
  event_time?: string;
  event_location?: string;
  max_participants?: number;
  registration_fee?: number;
  registration_deadline?: string;
  post_category?: string;
  tags?: string;
  featured?: boolean;
  priority?: number;
  content_tsv?: any;
  search_vector?: any;
  is_active?: boolean;
  created_by?: string;
  updated_by?: string;
  created_at: string; // NOT NULL
  updated_at: string; // NOT NULL
}
```

## 3. MATCHES TABLE ✅ COMPLETED

### Database Schema
```sql
CREATE TABLE matches (
    creator_id UUID NOT NULL REFERENCES users(id), 
    match_name VARCHAR(200) NOT NULL, 
    description TEXT, 
    match_type MATCHTYPE NOT NULL, 
    match_format MATCHFORMAT NOT NULL,
    location VARCHAR(200) NOT NULL, 
    venue VARCHAR(200), 
    match_date DATE NOT NULL, 
    match_time TIME WITHOUT TIME ZONE NOT NULL, 
    players_needed INTEGER NOT NULL, 
    entry_fee DOUBLE PRECISION, 
    is_public BOOLEAN, 
    status MATCHSTATUS, 
    match_summary TEXT, 
    stream_url VARCHAR(500), 
    skill_level VARCHAR(50), 
    minimum_age INTEGER(5),
    maximum_age INTEGER(50),
    equipment_provided BOOLEAN, 
    price_money_amount DOUBLE PRECISION,
    rules TEXT, 
    weather VARCHAR(20) DEFAULT 'unknown', 
    temperature DOUBLE PRECISION, 
    wind_speed DOUBLE PRECISION, 
    humidity DOUBLE PRECISION, 
    total_views INTEGER DEFAULT 0, 
    total_interested INTEGER DEFAULT 0, 
    total_joined INTEGER DEFAULT 0, 
    total_left INTEGER DEFAULT 0, 
    estimated_duration INTEGER, 
    actual_duration INTEGER, 
    start_time_actual TIMESTAMP WITHOUT TIME ZONE, 
    end_time_actual TIMESTAMP WITHOUT TIME ZONE, 
    winner_team VARCHAR(100), 
    man_of_the_match VARCHAR(100), 
    best_bowler VARCHAR(100), 
    best_batsman VARCHAR(100), 
    photos JSON DEFAULT '[]'::json, 
    videos JSON DEFAULT '[]'::json, 
    highlights JSON DEFAULT '[]'::json, 
    last_updated TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP, 
    update_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
);
```

### Frontend Interface
```typescript
export interface Match {
  id: string; // UUID
  creator_id: string; // NOT NULL
  match_name: string; // NOT NULL
  match_type: string; // NOT NULL
  match_format: string; // NOT NULL
  location: string; // NOT NULL
  match_date: string; // NOT NULL
  match_time: string; // NOT NULL
  players_needed: number; // NOT NULL
  description?: string;
  venue?: string;
  entry_fee?: number;
  is_public?: boolean;
  status?: string;
  match_summary?: string;
  stream_url?: string;
  skill_level?: string;
  minimum_age?: number;
  maximum_age?: number;
  equipment_provided?: boolean;
  price_money_amount?: number;
  rules?: string;
  weather?: string;
  temperature?: number;
  wind_speed?: number;
  humidity?: number;
  total_views?: number;
  total_interested?: number;
  total_joined?: number;
  total_left?: number;
  estimated_duration?: number;
  actual_duration?: number;
  start_time_actual?: string;
  end_time_actual?: string;
  winner_team?: string;
  man_of_the_match?: string;
  best_bowler?: string;
  best_batsman?: string;
  photos?: any;
  videos?: any;
  highlights?: any;
  last_updated?: string;
  update_count?: number;
  is_active?: boolean;
  created_by?: string;
  updated_by?: string;
  created_at: string; // NOT NULL
  updated_at: string; // NOT NULL
}
```

## 4. PAGE_PROFILES TABLE ✅ COMPLETED

### Database Schema
```sql
CREATE TABLE page_profiles (
    page_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    user_id UUID NOT NULL REFERENCES users(id), 
    firebase_uid VARCHAR(255), 
    cognito_user_id VARCHAR(255), 
    organization_name VARCHAR(200) NOT NULL, 
    tagline VARCHAR(300), 
    description TEXT, 
    bio TEXT, 
    contact_person VARCHAR(100), 
    contact_number VARCHAR(20), 
    email VARCHAR(255), 
    website VARCHAR(500), 
    address TEXT, 
    city VARCHAR(100), 
    state VARCHAR(100), 
    country VARCHAR(100), 
    pincode VARCHAR(20), 
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    logo_url VARCHAR(500), 
    banner_image_url VARCHAR(500), 
    gallery_images TEXT, 
    facilities TEXT, 
    services_offered TEXT, 
    instagram_handle VARCHAR(100), 
    facebook_handle VARCHAR(100), 
    twitter_handle VARCHAR(100), 
    youtube_handle VARCHAR(100), 
    achievements TEXT, 
    testimonials TEXT, 
    is_public BOOLEAN, 
    allow_messages BOOLEAN, 
    show_contact BOOLEAN, 
    is_verified BOOLEAN, 
    page_type PAGETYPE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    deleted_at TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
);
```

### Frontend Interface
```typescript
export interface PageProfile {
  page_id: string; // UUID
  user_id: string; // NOT NULL
  organization_name: string; // NOT NULL
  page_type: string; // NOT NULL
  firebase_uid?: string;
  cognito_user_id?: string;
  tagline?: string;
  description?: string;
  bio?: string;
  contact_person?: string;
  contact_number?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  logo_url?: string;
  banner_image_url?: string;
  gallery_images?: string;
  facilities?: string;
  services_offered?: string;
  instagram_handle?: string;
  facebook_handle?: string;
  twitter_handle?: string;
  youtube_handle?: string;
  achievements?: string;
  testimonials?: string;
  is_public?: boolean;
  allow_messages?: boolean;
  show_contact?: boolean;
  is_verified?: boolean;
  is_active?: boolean;
  created_by?: string;
  updated_by?: string;
  deleted_at?: string;
  created_at: string; // NOT NULL
  updated_at: string; // NOT NULL
}
```

## 5. MESSAGES TABLE ✅ COMPLETED

### Database Schema
```sql
CREATE TABLE messages (
    conversation_id UUID NOT NULL REFERENCES conversations(id),
    sender_id UUID NOT NULL REFERENCES users(id),
    receiver_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    is_read BOOLEAN,
    read_at TIMESTAMP WITHOUT TIME ZONE,
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
);
```

### Frontend Interface
```typescript
export interface Message {
  id: string; // UUID
  conversation_id: string; // NOT NULL
  sender_id: string; // NOT NULL
  receiver_id: string; // NOT NULL
  content: string; // NOT NULL
  is_read?: boolean;
  read_at?: string;
  created_at: string; // NOT NULL
  updated_at: string; // NOT NULL
}
```

## 6. CONVERSATIONS TABLE ✅ COMPLETED

### Database Schema
```sql
CREATE TABLE conversations (
    user1_id UUID NOT NULL REFERENCES users(id),
    user2_id UUID NOT NULL REFERENCES users(id),
    last_message_at TIMESTAMP WITHOUT TIME ZONE,
    last_message_content TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT unique_conversation UNIQUE (user1_id, user2_id)
);
```

### Frontend Interface
```typescript
export interface Conversation {
  id: string; // UUID
  user1_id: string; // NOT NULL
  user2_id: string; // NOT NULL
  last_message_at?: string;
  last_message_content?: string;
  is_active?: boolean;
  created_by?: string;
  updated_by?: string;
  created_at: string; // NOT NULL
  updated_at: string; // NOT NULL
}
```

## 7. NOTIFICATIONS TABLE ✅ COMPLETED

### Database Schema
```sql
CREATE TABLE notifications (
    sender_id UUID NOT NULL REFERENCES users(id), 
    receiver_id UUID NOT NULL REFERENCES users(id), 
    type NOTIFICATIONTYPE NOT NULL, 
    title VARCHAR(200) NOT NULL, 
    content TEXT NOT NULL, 
    is_read BOOLEAN, 
    read_at TIMESTAMP WITHOUT TIME ZONE, 
    related_post_id UUID REFERENCES posts(id), 
    related_match_id UUID REFERENCES matches(id), 
    related_message_id UUID REFERENCES messages(id), 
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
);
```

### Frontend Interface
```typescript
export interface Notification {
  id: string; // UUID
  sender_id: string; // NOT NULL
  receiver_id: string; // NOT NULL
  type: string; // NOT NULL
  title: string; // NOT NULL
  content: string; // NOT NULL
  is_read?: boolean;
  read_at?: string;
  related_post_id?: string;
  related_match_id?: string;
  related_message_id?: string;
  created_at: string; // NOT NULL
  updated_at: string; // NOT NULL
}
```

## 8. MATCH_PARTICIPANTS TABLE ✅ COMPLETED

### Database Schema
```sql
CREATE TABLE match_participants (
    match_id UUID NOT NULL REFERENCES matches(id), 
    user_id UUID NOT NULL REFERENCES users(id), 
    joined_at TIMESTAMP WITHOUT TIME ZONE, 
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    CONSTRAINT unique_match_participation UNIQUE (match_id, user_id)
);
```

### Frontend Interface
```typescript
export interface MatchParticipant {
  id: string; // UUID
  match_id: string; // NOT NULL
  user_id: string; // NOT NULL
  joined_at?: string;
  created_at: string; // NOT NULL
  updated_at: string; // NOT NULL
}
```

## 9. POST_LIKES TABLE ✅ COMPLETED

### Database Schema
```sql
CREATE TABLE post_likes (
    post_id UUID NOT NULL REFERENCES posts(id), 
    user_id UUID NOT NULL REFERENCES users(id), 
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    CONSTRAINT unique_post_like UNIQUE (post_id, user_id)
);
```

### Frontend Interface
```typescript
export interface PostLike {
  id: string; // UUID
  post_id: string; // NOT NULL
  user_id: string; // NOT NULL
  created_at: string; // NOT NULL
  updated_at: string; // NOT NULL
}
```

## 10. POST_COMMENTS TABLE ✅ COMPLETED

### Database Schema
```sql
CREATE TABLE post_comments (
    post_id UUID NOT NULL REFERENCES posts(id), 
    user_id UUID NOT NULL REFERENCES users(id), 
    content TEXT NOT NULL, 
    parent_comment_id UUID, 
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    CONSTRAINT post_comments_parent_comment_id_fkey FOREIGN KEY(parent_comment_id) REFERENCES post_comments (id)
);
```

### Frontend Interface
```typescript
export interface PostComment {
  id: string; // UUID
  post_id: string; // NOT NULL
  user_id: string; // NOT NULL
  content: string; // NOT NULL
  parent_comment_id?: string;
  created_at: string; // NOT NULL
  updated_at: string; // NOT NULL
}
```

## 11. RELATIONSHIPS TABLE ✅ COMPLETED

### Database Schema
```sql
CREATE TABLE relationships (
    follower_id UUID NOT NULL REFERENCES users(id), 
    following_id UUID NOT NULL REFERENCES users(id), 
    relationship_type RELATIONSHIPTYPE NOT NULL, 
    status RELATIONSHIPSTATUS, 
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL, 
    accepted_at TIMESTAMP WITHOUT TIME ZONE, 
    rejected_at TIMESTAMP WITHOUT TIME ZONE, 
    message TEXT, 
    is_mutual BOOLEAN, 
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),  
    CONSTRAINT unique_relationship_per_type UNIQUE (follower_id, following_id, relationship_type), 
    CONSTRAINT prevent_self_relationship CHECK (follower_id <> following_id)
);
```

### Frontend Interface
```typescript
export interface Relationship {
  id: string; // UUID
  follower_id: string; // NOT NULL
  following_id: string; // NOT NULL
  relationship_type: string; // NOT NULL
  status?: string;
  accepted_at?: string;
  rejected_at?: string;
  message?: string;
  is_mutual?: boolean;
  created_at: string; // NOT NULL
  updated_at: string; // NOT NULL
}
```

## Summary

✅ **ALL TABLES MAPPED**: 11 major database tables now have exact frontend interfaces
✅ **COLUMN ALIGNMENT**: Every database column has a corresponding frontend field
✅ **TYPE SAFETY**: All interfaces match database data types
✅ **API INTEGRATION**: API service methods updated to handle database columns
✅ **REDUX INTEGRATION**: Redux slices updated with database-aligned filters
✅ **DOCUMENTATION**: Complete mapping reference created

The frontend now **exactly matches** the database schema for all major tables. The data flow from database → API → Redux → Components is perfectly aligned.
