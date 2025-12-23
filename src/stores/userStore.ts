/**
 * User Store - Zustand + AsyncStorage persistence
 * Handles profile, onboarding, and streak data
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserStorage } from '../data/storage/UserStorage';
import { CheckInRecord, OnboardingAnswers, StreakData, UserProfile } from '../types';

interface UserState extends UserProfile, StreakData {
  // Profile
  userId: string;
  isOnboarded: boolean;
  createdAt: string;
  onboardingAnswers?: OnboardingAnswers;

  // Streak
  currentStreak: number;
  longestStreak: number;
  lastCheckInDate: string | null;
  checkInHistory: CheckInRecord[];
  totalAbstinenceDays: number;

  // Actions
  completeOnboarding: (answers: OnboardingAnswers) => Promise<void>;
  recordCheckIn: (gambled: boolean) => Promise<void>;
  resetStreak: () => Promise<void>;
  getStreakStatus: () => { streakDays: number; lastCheckIn: string | null };
  shouldPromptCheckIn: () => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      userId: '',
      isOnboarded: false,
      createdAt: new Date().toISOString(),
      onboardingAnswers: undefined,

      currentStreak: 0,
      longestStreak: 0,
      lastCheckInDate: null,
      checkInHistory: [],
      totalAbstinenceDays: 0,

      // Complete onboarding and initialize streak
      completeOnboarding: async (answers: OnboardingAnswers) => {
        const userId = uuidv4();
        const now = new Date().toISOString();

        set({
          userId,
          isOnboarded: true,
          createdAt: now,
          onboardingAnswers: answers,
          currentStreak: 0,
          lastCheckInDate: null,
          checkInHistory: [],
          totalAbstinenceDays: 0,
        });

        // Encrypt and store answers securely
        await UserStorage.saveSecureAnswers(userId, answers);
      },

      // Record daily check-in
      recordCheckIn: async (gambled: boolean) => {
        const today = new Date().toDateString();
        const now = new Date().toISOString();
        const state = get();

        // Prevent duplicate check-ins on same day
        const alreadyCheckedIn = state.checkInHistory.some(
          (record) => new Date(record.date).toDateString() === today
        );

        if (alreadyCheckedIn) {
          console.warn('Already checked in today');
          return;
        }

        const newRecord: CheckInRecord = {
          date: today,
          gambled,
          timestamp: now,
        };

        let newStreak = state.currentStreak;
        let newTotal = state.totalAbstinenceDays;

        if (!gambled) {
          newStreak += 1;
          newTotal += 1;
        } else {
          newStreak = 0; // Reset streak if gambled
        }

        const newLongestStreak = Math.max(state.longestStreak, newStreak);
        const newHistory = [...state.checkInHistory, newRecord];

        set({
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          lastCheckInDate: now,
          checkInHistory: newHistory,
          totalAbstinenceDays: newTotal,
        });

        // Persist to local storage
        await UserStorage.saveCheckInHistory(state.userId, newHistory);
        await UserStorage.saveStreakData(state.userId, {
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          lastCheckInDate: now,
          totalAbstinenceDays: newTotal,
        });
      },

      // Manual streak reset (for recovery)
      resetStreak: async () => {
        set({ currentStreak: 0 });
        await UserStorage.saveStreakData(get().userId, {
          currentStreak: 0,
          longestStreak: get().longestStreak,
          lastCheckInDate: get().lastCheckInDate,
          totalAbstinenceDays: get().totalAbstinenceDays,
        });
      },

      // Get current streak status
      getStreakStatus: () => ({
        streakDays: get().currentStreak,
        lastCheckIn: get().lastCheckInDate,
      }),

      // Check if should prompt for daily check-in
      shouldPromptCheckIn: () => {
        const lastCheckIn = get().lastCheckInDate;
        if (!lastCheckIn) return true;

        const last = new Date(lastCheckIn);
        const today = new Date();

        return last.toDateString() !== today.toDateString();
      },
    }),
    {
      name: 'user-store',
      storage: {
        getItem: async (name: string) => {
          const item = await AsyncStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: async (name: string, value: any) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name: string) => {
          await AsyncStorage.removeItem(name);
        },
      },
      // Only persist safe public data
      partialize: (state) => ({
        userId: state.userId,
        isOnboarded: state.isOnboarded,
        createdAt: state.createdAt,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        lastCheckInDate: state.lastCheckInDate,
        checkInHistory: state.checkInHistory,
        totalAbstinenceDays: state.totalAbstinenceDays,
      }),
    }
  )
);
