# Firebase Setup Guide

This project uses Firebase for authentication, data storage, and analytics, with encrypted environment variables using dotenvx.

## Installation

Firebase and dotenvx are already installed. Check `package.json` for versions.

## Environment Setup

### 1. Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Go to Project Settings → Service Accounts or Web App Settings
4. Copy your Firebase configuration:
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID
   - Measurement ID (optional, for Analytics)

### 2. Configure Environment Variables

#### Option A: Development (Unencrypted)

Edit `.env` file with your Firebase credentials:

```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Then run:
```bash
npm start
```

#### Option B: Production (Encrypted with dotenvx)

1. Create a `.env.keys` file for encryption (add to .gitignore):
```bash
echo "DOTENV_PRIVATE_KEY=your_generated_key" > .env.keys
```

2. Encrypt your `.env.production`:
```bash
npx dotenvx encrypt .env.production
```

3. Run with encryption:
```bash
npx dotenvx run -- npm start
```

## Firebase Services

### 1. Authentication (`src/services/firebase/auth.ts`)

```typescript
import { signUp, logIn, logOut, deleteUserAccount } from '@/src/services/firebase/auth';

// Sign up
const user = await signUp('user@example.com', 'password123', 'User Name');

// Login
const user = await logIn('user@example.com', 'password123');

// Logout
await logOut();

// Delete account
await deleteUserAccount(userId);
```

### 2. Analytics (`src/services/firebase/analytics.ts`)

The app automatically tracks:
- **App Opens** - Every time user opens the app
- **Check-ins** - Daily gambling check-ins with streak data
- **Games Played** - Game sessions with scores and duration
- **Achievements** - Unlocked milestones
- **Friend Additions** - Social connections
- **Social Shares** - Achievement shares
- **Settings Changes** - User preference updates

#### Manual Event Logging

```typescript
import {
  logCheckInEvent,
  logGamePlayedEvent,
  logAchievementUnlockedEvent,
  logFriendAddedEvent,
  logSocialShareEvent,
} from '@/src/services/firebase/analytics';

// Log a game session
await logGamePlayedEvent(userId, 'memory', 1200, 45);

// Log an achievement
await logAchievementUnlockedEvent(userId, '7-Day Warrior', 7);

// Get user analytics summary
const summary = await getUserAnalyticsSummary(userId);
console.log(`Total check-ins: ${summary.totalCheckIns}`);
console.log(`Games by type:`, summary.gamesPlayedByType);
```

## Database Schema

### Firestore Collections

```
users/
  {userId}/
    - userId: string
    - email: string
    - createdAt: timestamp
    - stats/
      overview/
        - totalCheckIns: number
        - totalGamesPlayed: number
        - gamesPlayedByType: { memory: 5, color_match: 3, ... }
        - totalAchievementsUnlocked: number
        - totalFriendsAdded: number
        - totalShares: number
        - firstOpenDate: timestamp
        - lastOpenDate: timestamp
        - appOpenCount: number
        - sessionCount: number
    - properties/
      analytics/
        - {custom properties for analytics}

analytics/
  {userId}/
    events/
      {eventDocId}/
        - eventType: 'check_in' | 'game_played' | 'achievement_unlocked' | 'friend_added' | 'social_shared' | 'settings_changed' | 'app_opened'
        - eventData: { /* event-specific data */ }
        - timestamp: timestamp

checkInHistory/
  {docId}/
    - userId: string
    - date: string
    - gambled: boolean
    - timestamp: timestamp

achievements/
  {docId}/
    - userId: string
    - title: string
    - days: number
    - unlockedAt: timestamp
```

## Security Rules

Create Firestore Security Rules to protect user data:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Analytics are write-only from client
    match /analytics/{userId}/{document=**} {
      allow write: if request.auth.uid == userId;
      allow read: if request.auth.uid == userId;
    }
    
    // Public leaderboard data (for friends)
    match /leaderboard/{userId} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

## Integration with App

### In userStore (Automatic)

- Check-in events are logged automatically when `recordCheckIn()` is called
- App open events are logged on app initialization

### In Screen Components

```typescript
import { logGamePlayedEvent, logSocialShareEvent } from '@/src/services/firebase/analytics';

// In game completion handler
await logGamePlayedEvent(userId, 'memory', score, duration);

// In share handler
await logSocialShareEvent(userId, 'instagram', 'achievement_card');
```

## Troubleshooting

### Firebase Not Initializing

1. Check that `.env` file has valid Firebase credentials
2. Verify EXPO_PUBLIC_ prefix on all environment variables
3. Check browser/emulator console for error messages
4. Ensure Firebase project is active in Firebase Console

### Analytics Not Recording

1. Verify user is authenticated (userId exists)
2. Check Firestore database permissions
3. Look for error logs in device console
4. Ensure `isFirebaseInitialized` is true

### Environment Variables Not Loading

**Development:**
```bash
npm start
```

**Production:**
```bash
npx dotenvx run -- npm start
```

**To decrypt and view encrypted file:**
```bash
npx dotenvx decrypt .env.production
```

## Best Practices

1. **Never commit unencrypted credentials** - Use `.env.example` for templates
2. **Use EXPO_PUBLIC_ prefix** - Only this prefix is accessible in React Native
3. **Handle errors gracefully** - Firebase functions throw errors, always catch them
4. **Log important events** - More analytics = better insights
5. **Test authentication** - Test signup/login flows before deployment
6. **Monitor Firestore costs** - Analytics writes add up, consider batch operations

## Next Steps

1. Set up Firebase Authentication methods (Email/Password, Google Sign-In, etc.)
2. Implement real-time Firestore listeners for user data sync
3. Create backend Cloud Functions for complex operations
4. Set up Firebase Hosting for web version
5. Enable Firebase Emulator Suite for local development

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [dotenvx Documentation](https://dotenvx.sh/)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
