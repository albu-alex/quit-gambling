/**
 * Firebase Configuration & Initialization
 * Environment variables are loaded from .env files (encrypted with dotenvx)
 */

import {
    Auth,
    User as FirebaseUser,
    getAuth,
    getReactNativePersistence,
    initializeAuth,
    onAuthStateChanged
} from '@firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {
    Analytics,
    getAnalytics
} from 'firebase/analytics';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
    Firestore,
    getFirestore
} from 'firebase/firestore';

// Check if required environment variables are set
const requiredEnvVars = [
  'EXPO_PUBLIC_FIREBASE_API_KEY',
  'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'EXPO_PUBLIC_FIREBASE_APP_ID',
];

const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !process.env[envVar]
);

if (missingEnvVars.length > 0) {
  console.warn(
    `⚠️ Missing Firebase environment variables: ${missingEnvVars.join(', ')}. ` +
      'Firebase will not be initialized. Please set up your .env file with Firebase credentials.'
  );
}

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only if we have all required config
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let analytics: Analytics | undefined;
let isFirebaseInitialized = false;

if (
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
) {
  try {
    app = initializeApp(firebaseConfig);
    
    // Initialize Auth with AsyncStorage persistence for React Native
    // If auth is already initialized, getAuth will return the existing instance
    try {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
      });
    } catch (authError: any) {
      // If auth is already initialized, use getAuth instead
      if (authError.code === 'auth/already-initialized') {
        auth = getAuth(app);
      } else {
        throw authError;
      }
    }
    
    db = getFirestore(app);
    
    // Initialize analytics if measurement ID is available
    // Skip on React Native - Analytics requires DOM which doesn't exist
    if (firebaseConfig.measurementId && typeof window !== 'undefined') {
      try {
        analytics = getAnalytics(app);
      } catch (analyticsError) {
        console.warn('⚠️ Failed to initialize Analytics (likely React Native environment):', analyticsError);
        // Analytics is optional, continue without it
      }
    }

    isFirebaseInitialized = true;
    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase:', error);
  }
} else {
  console.warn(
    '⚠️ Firebase initialization skipped: Missing required configuration. ' +
      'Please configure your Firebase credentials in .env file'
  );
}

export {
    analytics,
    app,
    auth,
    db,
    FirebaseUser,
    isFirebaseInitialized,
    onAuthStateChanged,
    type Analytics,
    type Auth,
    type FirebaseApp,
    type Firestore
};

