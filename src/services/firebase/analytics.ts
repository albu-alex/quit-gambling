/**
 * Firebase Analytics Service
 * Tracks app usage via Firestore only (Firebase Analytics SDK disabled on React Native)
 */

import {
    collection,
    doc,
    getDocs,
    increment,
    serverTimestamp,
    setDoc,
    Timestamp,
    updateDoc,
    type Firestore
} from 'firebase/firestore';
import { db, isFirebaseInitialized } from './config';

// Type the imported Firebase instances
const typedDb = db as Firestore | undefined;

export interface AnalyticsEvent {
  userId: string;
  eventType: 'check_in' | 'game_played' | 'achievement_unlocked' | 'friend_added' | 'social_shared' | 'settings_changed' | 'app_opened';
  eventData?: Record<string, any>;
  timestamp?: Timestamp;
}

export interface UserStats {
  userId: string;
  totalCheckIns: number;
  totalGamesPlayed: number;
  gamesPlayedByType: Record<string, number>;
  totalAchievementsUnlocked: number;
  totalFriendsAdded: number;
  totalShares: number;
  firstOpenDate: Timestamp;
  lastOpenDate: Timestamp;
  appOpenCount: number;
  sessionCount: number;
  averageSessionDuration: number;
}

/**
 * Log an analytics event
 */
export async function logAnalyticsEvent(event: AnalyticsEvent): Promise<void> {
  // Log to Firestore for persistent storage and complex queries
  if (typedDb && isFirebaseInitialized) {
    try {
      const eventsRef = collection(typedDb, 'analytics', event.userId, 'events');
      await setDoc(doc(eventsRef), {
        userId: event.userId,
        eventType: event.eventType,
        eventData: event.eventData || {},
        timestamp: serverTimestamp(),
      });

      // Update user stats
      await updateUserStats(event.userId, event.eventType, event.eventData);
    } catch (error) {
      console.error(`Failed to log analytics event to Firestore: ${error}`);
    }
  }
}

/**
 * Update user stats based on event type
 */
async function updateUserStats(
  userId: string,
  eventType: string,
  eventData?: Record<string, any>
): Promise<void> {
  if (!typedDb || !isFirebaseInitialized) return;

  try {
    const userStatsRef = doc(typedDb, 'users', userId, 'stats', 'overview');

    const updateData: Record<string, any> = {
      lastOpenDate: serverTimestamp(),
    };

    switch (eventType) {
      case 'check_in':
        updateData.totalCheckIns = increment(1);
        break;
      case 'game_played':
        updateData.totalGamesPlayed = increment(1);
        if (eventData?.gameType) {
          updateData[`gamesPlayedByType.${eventData.gameType}`] = increment(1);
        }
        break;
      case 'achievement_unlocked':
        updateData.totalAchievementsUnlocked = increment(1);
        break;
      case 'friend_added':
        updateData.totalFriendsAdded = increment(1);
        break;
      case 'social_shared':
        updateData.totalShares = increment(1);
        break;
      case 'app_opened':
        updateData.appOpenCount = increment(1);
        updateData.sessionCount = increment(1);
        break;
    }

    await updateDoc(userStatsRef, updateData).catch(async () => {
      // If document doesn't exist, create it
      await setDoc(userStatsRef, {
        userId,
        totalCheckIns: eventType === 'check_in' ? 1 : 0,
        totalGamesPlayed: eventType === 'game_played' ? 1 : 0,
        gamesPlayedByType: eventType === 'game_played' && eventData?.gameType ? { [eventData.gameType]: 1 } : {},
        totalAchievementsUnlocked: eventType === 'achievement_unlocked' ? 1 : 0,
        totalFriendsAdded: eventType === 'friend_added' ? 1 : 0,
        totalShares: eventType === 'social_shared' ? 1 : 0,
        firstOpenDate: serverTimestamp(),
        lastOpenDate: serverTimestamp(),
        appOpenCount: eventType === 'app_opened' ? 1 : 0,
        sessionCount: eventType === 'app_opened' ? 1 : 0,
        averageSessionDuration: 0,
        ...updateData,
      });
    });
  } catch (error) {
    console.error(`Failed to update user stats: ${error}`);
  }
}

/**
 * Log check-in event
 */
export async function logCheckInEvent(
  userId: string,
  streakDays: number,
  gambled: boolean
): Promise<void> {
  await logAnalyticsEvent({
    userId,
    eventType: 'check_in',
    eventData: {
      streakDays,
      gambled,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Log game played event
 */
export async function logGamePlayedEvent(
  userId: string,
  gameType: 'memory' | 'color_match' | 'word_chain',
  score: number,
  duration: number
): Promise<void> {
  await logAnalyticsEvent({
    userId,
    eventType: 'game_played',
    eventData: {
      gameType,
      score,
      duration,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Log achievement unlocked event
 */
export async function logAchievementUnlockedEvent(
  userId: string,
  achievementTitle: string,
  days: number
): Promise<void> {
  await logAnalyticsEvent({
    userId,
    eventType: 'achievement_unlocked',
    eventData: {
      achievementTitle,
      days,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Log friend added event
 */
export async function logFriendAddedEvent(userId: string, friendId?: string): Promise<void> {
  await logAnalyticsEvent({
    userId,
    eventType: 'friend_added',
    eventData: {
      friendId,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Log social share event
 */
export async function logSocialShareEvent(
  userId: string,
  platform?: string,
  contentType?: string
): Promise<void> {
  await logAnalyticsEvent({
    userId,
    eventType: 'social_shared',
    eventData: {
      platform,
      contentType,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Log app opened event
 */
export async function logAppOpenedEvent(userId: string): Promise<void> {
  await logAnalyticsEvent({
    userId,
    eventType: 'app_opened',
    eventData: {
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Log settings changed event
 */
export async function logSettingsChangedEvent(
  userId: string,
  setting: string,
  value: any
): Promise<void> {
  await logAnalyticsEvent({
    userId,
    eventType: 'settings_changed',
    eventData: {
      setting,
      value,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Get user analytics summary
 */
export async function getUserAnalyticsSummary(userId: string): Promise<Partial<UserStats> | null> {
  if (!typedDb || !isFirebaseInitialized) return null;

  try {
    const eventsRef = collection(typedDb, 'analytics', userId, 'events');
    const snapshot = await getDocs(eventsRef);

    const summary = {
      totalCheckIns: 0,
      totalGamesPlayed: 0,
      gamesPlayedByType: {} as Record<string, number>,
      totalAchievementsUnlocked: 0,
      totalFriendsAdded: 0,
      totalShares: 0,
    };

    snapshot.forEach((doc) => {
      const data = doc.data();
      switch (data.eventType) {
        case 'check_in':
          summary.totalCheckIns++;
          break;
        case 'game_played':
          summary.totalGamesPlayed++;
          if (data.eventData?.gameType) {
            summary.gamesPlayedByType[data.eventData.gameType] =
              (summary.gamesPlayedByType[data.eventData.gameType] || 0) + 1;
          }
          break;
        case 'achievement_unlocked':
          summary.totalAchievementsUnlocked++;
          break;
        case 'friend_added':
          summary.totalFriendsAdded++;
          break;
        case 'social_shared':
          summary.totalShares++;
          break;
      }
    });

    return summary;
  } catch (error) {
    console.error(`Failed to get user analytics summary: ${error}`);
    return null;
  }
}

/**
 * Set user properties for segmentation (Firestore only)
 */
export async function setUserAnalyticsProperties(
  userId: string,
  properties: Record<string, string | number | boolean>
): Promise<void> {
  if (!isFirebaseInitialized) return;

  try {
    // Store in Firestore for reference
    if (typedDb) {
      const userPropsRef = doc(typedDb, 'users', userId, 'properties', 'analytics');
      await setDoc(userPropsRef, {
        ...properties,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }
  } catch (error) {
    console.error(`Failed to set user analytics properties: ${error}`);
  }
}
