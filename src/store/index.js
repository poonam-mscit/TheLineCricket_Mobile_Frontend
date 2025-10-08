// Redux store configuration
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';

// Import slices
import apiReducer from './slices/apiSlice';
import authReducer from './slices/authSlice';
import communityReducer from './slices/communitySlice';
import jobReducer from './slices/jobSlice';
import matchReducer from './slices/matchSlice';
import postReducer from './slices/postSlice';
import profileReducer from './slices/profileSlice';
import socketReducer from './slices/socketSlice';
import venueReducer from './slices/venueSlice';

// Persist configuration for auth slice
const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['user', 'isAuthenticated', 'preferences', 'lastLogin']
};

// Persist configuration for API slice (cache only)
const apiPersistConfig = {
  key: 'api',
  storage: AsyncStorage,
  whitelist: ['cache', 'pagination', 'lastUpdated']
};

// Create persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedApiReducer = persistReducer(apiPersistConfig, apiReducer);

// Root reducer
const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  api: persistedApiReducer,
  profile: profileReducer,
  matches: matchReducer,
  posts: postReducer,
  communities: communityReducer,
  jobs: jobReducer,
  venues: venueReducer,
  socket: socketReducer,
});

// Configure store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
  devTools: __DEV__,
});

// Persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
