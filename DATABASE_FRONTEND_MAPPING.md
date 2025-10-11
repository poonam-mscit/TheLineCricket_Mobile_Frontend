# Database to Frontend Mapping - Users Table

## Database Schema (users table)
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

## Frontend TypeScript Interface
```typescript
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
```

## API Service Methods Updated

### createUserProfile()
- Maps frontend data to exact database columns
- Ensures required fields (NOT NULL) are present
- Sets default values for optional fields

### updateUserProfile()
- Only allows updating specific database columns
- Prevents updating non-existent fields
- Maintains data integrity

## Redux State Management

### transformUserData()
- Transforms backend response to match database structure
- Handles both users table and user_profiles table data
- Maintains exact column mapping

### Initial State
- Profile state matches database structure
- All database columns represented
- Proper default values set

## Key Changes Made

1. **Type Definitions**: Updated User interface to match exact database columns
2. **API Service**: Modified create/update methods to handle database fields
3. **Redux Slice**: Updated transformation and state to match database
4. **Data Flow**: Ensured frontend exactly matches database structure

## Database Column Mapping

| Database Column | Frontend Field | Type | Required |
|----------------|----------------|------|----------|
| id | id | string | ✅ |
| firebase_uid | firebase_uid | string | ❌ |
| firebase_email | firebase_email | string | ❌ |
| cognito_user_id | cognito_user_id | string | ❌ |
| email | email | string | ✅ |
| username | username | string | ✅ |
| is_verified | is_verified | boolean | ✅ |
| is_active | is_active | boolean | ✅ |
| auth_provider | auth_provider | string | ✅ |
| created_at | created_at | string | ✅ |
| updated_at | updated_at | string | ✅ |

## Next Steps

1. Test the updated user data flow
2. Verify API endpoints return correct data structure
3. Update any components that use user data
4. Move to next table (posts, matches, etc.)
