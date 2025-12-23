/**
 * Core TypeScript interfaces for Quit Gambling app
 */

// User Profile
export interface OnboardingAnswers {
  yearsGambling: number; // 0-50+
  frequencyPerWeek: number; // 0-7
  monthlySpend: number; // in RON
  motivation: string; // text input
}

export interface UserProfile {
  userId: string;
  isOnboarded: boolean;
  createdAt: string; // ISO date
  onboardingAnswers?: OnboardingAnswers;
}

// Streak Data
export interface CheckInRecord {
  date: string; // YYYY-MM-DD
  gambled: boolean;
  timestamp: string; // ISO
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCheckInDate: string | null;
  checkInHistory: CheckInRecord[];
  totalAbstinenceDays: number;
}

// Achievements
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string; // ISO date when earned
  daysRequired: number;
}

export interface MilestoneAchievement {
  days: number;
  badge: string; // emoji
  title: string;
}

// Games
export interface GameScore {
  gameId: string;
  gameName: string;
  score: number;
  completedAt: string;
  timeTaken: number; // seconds
  streakBonusEarned: number; // +0.5 typically
}

// Social
export interface Friend {
  userId: string;
  displayName: string;
  currentStreak: number;
  longestStreak: number;
  addedAt: string;
  relationship: 'pending' | 'accepted' | 'blocked';
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  currentStreak: number;
  longestStreak: number;
  totalGamesPlayed: number;
  lastActiveAt: string;
  isFriend: boolean;
}

// Notifications
export interface ScheduledNotification {
  id: string;
  type: 'check-in' | 'milestone' | 'friend-update' | 'motivation';
  title: string;
  body: string;
  scheduledFor: string; // ISO
  sent: boolean;
  data?: Record<string, any>;
}

// Analytics
export interface AnalyticsEvent {
  eventName: string;
  timestamp: string;
  data?: Record<string, any>;
}

// Shareable Asset
export interface ShareableAsset {
  type: 'milestone' | 'streak' | 'saved-money';
  days?: number;
  moneySaved?: number;
  generatedAt: string;
  imagePath?: string;
}
