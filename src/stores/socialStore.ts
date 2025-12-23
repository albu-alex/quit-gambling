/**
 * Social Store - Friends, leaderboard, and social features
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Friend, LeaderboardEntry } from '../types';

interface SocialState {
  friends: Friend[];
  leaderboard: LeaderboardEntry[];
  incomingFriendRequests: string[]; // User IDs
  outgoingFriendRequests: string[];

  // Actions
  addFriend: (userId: string, displayName: string) => Promise<void>;
  removeFriend: (userId: string) => Promise<void>;
  acceptFriendRequest: (userId: string) => Promise<void>;
  rejectFriendRequest: (userId: string) => Promise<void>;
  updateFriendStreak: (userId: string, streak: number, longestStreak: number) => Promise<void>;
  updateLeaderboard: (entries: LeaderboardEntry[]) => Promise<void>;
  getFriendsLeaderboard: () => LeaderboardEntry[];
}

export const useSocialStore = create<SocialState>()(
  persist(
    (set, get) => ({
      friends: [],
      leaderboard: [],
      incomingFriendRequests: [],
      outgoingFriendRequests: [],

      addFriend: async (userId: string, displayName: string) => {
        const newFriend: Friend = {
          userId,
          displayName,
          currentStreak: 0,
          longestStreak: 0,
          addedAt: new Date().toISOString(),
          relationship: 'pending',
        };

        set({
          friends: [...get().friends, newFriend],
          outgoingFriendRequests: [...get().outgoingFriendRequests, userId],
        });
      },

      removeFriend: async (userId: string) => {
        set({
          friends: get().friends.filter((f) => f.userId !== userId),
        });
      },

      acceptFriendRequest: async (userId: string) => {
        const friends = get().friends.map((f) =>
          f.userId === userId ? { ...f, relationship: 'accepted' as const } : f
        );

        set({
          friends,
          incomingFriendRequests: get().incomingFriendRequests.filter((id) => id !== userId),
        });
      },

      rejectFriendRequest: async (userId: string) => {
        set({
          incomingFriendRequests: get().incomingFriendRequests.filter((id) => id !== userId),
          friends: get().friends.filter((f) => f.userId !== userId),
        });
      },

      updateFriendStreak: async (userId: string, streak: number, longestStreak: number) => {
        const friends = get().friends.map((f) =>
          f.userId === userId
            ? { ...f, currentStreak: streak, longestStreak }
            : f
        );

        set({ friends });
      },

      updateLeaderboard: async (entries: LeaderboardEntry[]) => {
        set({ leaderboard: entries });
      },

      getFriendsLeaderboard: () => {
        const allFriends = get().friends.filter((f) => f.relationship === 'accepted');
        return allFriends.map((f, idx) => ({
          rank: idx + 1,
          userId: f.userId,
          displayName: f.displayName,
          currentStreak: f.currentStreak,
          longestStreak: f.longestStreak,
          totalGamesPlayed: 0, // TODO: Track in game store
          lastActiveAt: f.addedAt,
          isFriend: true,
        }));
      },
    }),
    {
      name: 'social-store',
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
    }
  )
);
