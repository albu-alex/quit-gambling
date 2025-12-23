/**
 * Constants - Theme, colors, strings, and configuration
 */

export const COLORS = {
  light: {
    primary: '#FF6B6B', // Warm red for urgency/fire
    secondary: '#4ECDC4', // Teal for trust/calm
    success: '#51CF66', // Green for achievement
    warning: '#FFD93D', // Yellow for caution
    danger: '#EE5A6F', // Red for streak loss
    background: '#FFFFFF',
    surfaceLight: '#F8F9FA',
    surfaceDark: '#2C3E50',
    textPrimary: '#1A1A1A',
    textSecondary: '#6C757D',
    textTertiary: '#ADB5BD',
    border: '#E9ECEF',
    disabled: '#E9ECEF',
  },
  dark: {
    primary: '#FF8787', // Slightly lighter red for dark mode
    secondary: '#4ECDC4', // Teal (remains same)
    success: '#66BB6A', // Lighter green for dark mode
    warning: '#FFE082', // Lighter yellow for dark mode
    danger: '#EF5350', // Lighter red for dark mode
    background: '#121212', // Dark background
    surfaceLight: '#1E1E1E', // Slightly lighter surface
    surfaceDark: '#0A0A0A', // Very dark surface
    textPrimary: '#FFFFFF', // White text
    textSecondary: '#B0BEC5', // Light gray text
    textTertiary: '#78909C', // Medium gray text
    border: '#2C2C2C', // Dark border
    disabled: '#424242', // Dark disabled color
  },
};

export const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  label: { fontSize: 13, fontWeight: '600' as const, lineHeight: 18 },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  full: 9999,
};

export const STRINGS = {
  // Onboarding
  onboarding: {
    welcome: {
      title: 'Quit Gambling',
      subtitle: 'Take control of your life, one day at a time',
      cta: 'Start Your Journey',
    },
    questionnaire: {
      yearsGambling: 'How long have you been gambling?',
      yearsPlaceholder: '(years)',
      frequency: 'How often do you gamble per week?',
      frequencyPlaceholder: '(0-7 times)',
      monthlySpend: 'How much do you spend gambling per month? (RON)',
      spendPlaceholder: '(amount in RON)',
      motivation: 'What\'s your main motivation to quit?',
      motivationPlaceholder: 'Share your motivation...',
      next: 'Next',
      previous: 'Back',
    },
    trialOffer: {
      title: '7-Day Free Trial',
      subtitle: 'Stay gambling-free for 7 days and unlock premium features',
      benefits: [
        '✓ Daily check-ins',
        '✓ Streak tracking',
        '✓ Mini-games to distract',
        '✓ Friend leaderboards',
      ],
      cta: 'Start Your 7-Day Trial',
      skip: 'Maybe later',
    },
  },

  // Dashboard
  dashboard: {
    title: 'Your Journey',
    daysGamblingFree: 'Days Gambling-Free',
    longestStreak: 'Longest Streak',
    totalSaved: 'Money Saved',
    lastCheckIn: 'Last Check-in',
    checkInToday: 'Check in today',
  },

  // Check-in
  checkin: {
    title: 'Daily Check-In',
    subtitle: 'Did you gamble today?',
    yes: 'Yes, I gambled',
    no: 'No, I stayed strong',
    encouragement: 'One day at a time. You\'ve got this! 💪',
  },

  // Streaks lost
  streakLost: {
    title: 'Streak Broken',
    message: 'Your streak has been reset. But recovery is always possible.',
    nextSteps: 'Let\'s start fresh tomorrow. You\'ve learned something.',
    button: 'Continue',
  },

  // Achievements
  achievements: {
    title: 'Achievements',
    unlockedAt: 'Unlocked at',
    nextMilestone: 'Next milestone',
    share: 'Share Achievement',
  },

  // Games
  games: {
    title: 'Protect Your Streak',
    subtitle: 'Play a quick game when you feel the urge',
    memory: 'Memory Match',
    memoryDesc: '2 min',
    colorMatch: 'Color Match',
    colorMatchDesc: '3 min',
    wordChain: 'Word Chain',
    wordChainDesc: '2 min',
    completed: 'Game Complete!',
    bonus: '+0.5 Streak Points',
    play: 'Play Again',
  },

  // Friends
  friends: {
    title: 'Friends',
    leaderboard: 'Leaderboard',
    addFriend: 'Add Friend',
    yourRank: 'Your Rank',
    searchPlaceholder: 'Search friends...',
    noFriendsYet: 'You haven\'t added any friends yet',
  },

  // Shared assets
  share: {
    title: 'Share Your Win',
    daysText: 'Days Gambling-Free',
    savedText: 'Money Saved',
    motivationText: 'One day at a time',
    shareOn: 'Share on',
    save: 'Save to Photos',
    copy: 'Copy Link',
  },

  // Settings
  settings: {
    title: 'Settings',
    profile: 'Profile',
    notifications: 'Notifications',
    privacy: 'Privacy & Security',
    about: 'About Quit Gambling',
    logout: 'Log Out',
    deleteAccount: 'Delete Account',
    checkInReminder: 'Daily check-in reminder',
    reminderTime: 'Reminder time',
  },

  // Crisis resources
  crisis: {
    title: 'Need Help?',
    hotline: 'Gamblers Anonymous Romania',
    helpline: 'National Hotline',
    chat: 'Live Chat Support',
    resources: 'View More Resources',
  },
};

export const APP_CONFIG = {
  // Trial duration in days
  TRIAL_DAYS: 7,

  // Minimum game duration in milliseconds
  GAME_MIN_DURATION: 120000, // 2 minutes

  // Push notification times (HH:mm format)
  DEFAULT_CHECK_IN_TIME: '09:00',

  // API endpoints (when backend is ready)
  API_BASE_URL: 'https://api.quitgambling.ro', // Change for production

  // Analytics events to track
  ANALYTICS_EVENTS: {
    APP_OPENED: 'app_opened',
    ONBOARDING_COMPLETED: 'onboarding_completed',
    CHECK_IN_RECORDED: 'check_in_recorded',
    STREAK_BROKEN: 'streak_broken',
    GAME_COMPLETED: 'game_completed',
    ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
    FRIEND_ADDED: 'friend_added',
    ASSET_SHARED: 'asset_shared',
  },
};

export const ROMANIAN_STRINGS = {
  // For future localization
  days: 'zile',
  money: 'lei',
  friend: 'prieten',
  friends: 'prieteni',
  congratulations: 'Felicitări!',
  wellDone: 'Bine ai făcut!',
};
