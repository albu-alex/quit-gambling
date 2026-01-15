/**
 * Game Analytics Helper Service
 * Easy integration of analytics tracking into game components
 */

import { StreakCalculator } from '../domain/streak/StreakCalculator';
import {
    getUserAnalyticsSummary,
    logAchievementUnlockedEvent,
    logAnalyticsEvent,
    logGamePlayedEvent,
} from './firebase/analytics';

/**
 * Log a completed game session
 * Call this when a user finishes playing a game
 */
export async function trackGameCompletion(
  userId: string,
  gameType: 'memory' | 'color_match' | 'word_chain',
  score: number,
  duration: number, // in seconds
  metrics?: {
    totalMatches?: number;
    successRate?: number;
    wordsChained?: number;
  }
): Promise<void> {
  try {
    await logGamePlayedEvent(userId, gameType, score, duration);
  } catch (error) {
    console.error('Failed to track game completion:', error);
  }
}

/**
 * Check for and track newly unlocked achievements
 * Call this after check-ins or game completions
 */
export async function checkAndTrackAchievements(
  userId: string,
  currentStreak: number,
  previousStreak: number
): Promise<void> {
  try {
    const newMilestones = StreakCalculator.getUnlockedMilestones(currentStreak)
      .filter((m: any) => m.days > previousStreak && m.days <= currentStreak);

    for (const milestone of newMilestones) {
      await logAchievementUnlockedEvent(userId, milestone.title, milestone.days);
    }
  } catch (error) {
    console.error('Failed to track achievements:', error);
  }
}

/**
 * Track feature usage with custom properties
 */
export async function trackFeatureUsage(
  userId: string,
  featureName: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    await logAnalyticsEvent({
      userId,
      eventType: 'game_played', // Use as generic event type
      eventData: {
        feature: featureName,
        ...metadata,
      },
    });
  } catch (error) {
    console.error('Failed to track feature usage:', error);
  }
}

/**
 * Get user engagement metrics
 */
export async function getUserEngagementMetrics(userId: string) {
  try {
    return await getUserAnalyticsSummary(userId);
  } catch (error) {
    console.error('Failed to get engagement metrics:', error);
    return null;
  }
}
