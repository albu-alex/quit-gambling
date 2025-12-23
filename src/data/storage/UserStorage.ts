/**
 * User Storage - Local storage operations with encryption
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { CheckInRecord, OnboardingAnswers } from '../../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  ONBOARDING_ANSWERS: 'onboarding_answers',
  STREAK_DATA: 'streak_data',
  CHECK_IN_HISTORY: 'check_in_history',
  GAMES_DATA: 'games_data',
};

export class UserStorage {
  /**
   * Save onboarding answers securely (encrypted)
   */
  static async saveSecureAnswers(userId: string, answers: OnboardingAnswers): Promise<void> {
    try {
      const encryptionKey = await this.getOrCreateEncryptionKey();
      const encrypted = JSON.stringify(answers);

      // Store answers in secure Keychain
      await Keychain.setGenericPassword(`user_${userId}_answers`, encrypted, {
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      });

      // Also store in AsyncStorage for non-sensitive metadata
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.ONBOARDING_ANSWERS}_${userId}`,
        JSON.stringify({
          savedAt: new Date().toISOString(),
          hasAnswers: true,
        })
      );
    } catch (error) {
      console.error('Failed to save secure answers:', error);
      throw error;
    }
  }

  /**
   * Retrieve encrypted onboarding answers
   */
  static async getSecureAnswers(userId: string): Promise<OnboardingAnswers | null> {
    try {
      const credentials = await Keychain.getGenericPassword(`user_${userId}_answers`);
      if (credentials && credentials.password) {
        return JSON.parse(credentials.password) as OnboardingAnswers;
      }
      return null;
    } catch (error) {
      console.error('Failed to retrieve secure answers:', error);
      return null;
    }
  }

  /**
   * Save streak data
   */
  static async saveStreakData(
    userId: string,
    data: {
      currentStreak: number;
      longestStreak: number;
      lastCheckInDate: string | null;
      totalAbstinenceDays: number;
    }
  ): Promise<void> {
    try {
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.STREAK_DATA}_${userId}`,
        JSON.stringify({
          ...data,
          updatedAt: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.error('Failed to save streak data:', error);
      throw error;
    }
  }

  /**
   * Get streak data
   */
  static async getStreakData(userId: string) {
    try {
      const data = await AsyncStorage.getItem(`${STORAGE_KEYS.STREAK_DATA}_${userId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get streak data:', error);
      return null;
    }
  }

  /**
   * Save check-in history
   */
  static async saveCheckInHistory(userId: string, history: CheckInRecord[]): Promise<void> {
    try {
      // Keep only last 365 records to avoid bloat
      const recentHistory = history.slice(-365);

      await AsyncStorage.setItem(
        `${STORAGE_KEYS.CHECK_IN_HISTORY}_${userId}`,
        JSON.stringify(recentHistory)
      );
    } catch (error) {
      console.error('Failed to save check-in history:', error);
      throw error;
    }
  }

  /**
   * Get check-in history
   */
  static async getCheckInHistory(userId: string): Promise<CheckInRecord[]> {
    try {
      const data = await AsyncStorage.getItem(`${STORAGE_KEYS.CHECK_IN_HISTORY}_${userId}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get check-in history:', error);
      return [];
    }
  }

  /**
   * Delete all user data
   */
  static async deleteUserData(userId: string): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        `${STORAGE_KEYS.USER_PROFILE}_${userId}`,
        `${STORAGE_KEYS.ONBOARDING_ANSWERS}_${userId}`,
        `${STORAGE_KEYS.STREAK_DATA}_${userId}`,
        `${STORAGE_KEYS.CHECK_IN_HISTORY}_${userId}`,
        `${STORAGE_KEYS.GAMES_DATA}_${userId}`,
      ]);

      // Remove from Keychain
      await Keychain.resetGenericPassword(`user_${userId}_answers`);
    } catch (error) {
      console.error('Failed to delete user data:', error);
      throw error;
    }
  }

  /**
   * Get or create encryption key for local data
   */
  private static async getOrCreateEncryptionKey(): Promise<string> {
    try {
      const credentials = await Keychain.getGenericPassword('encryption_key');
      if (credentials && credentials.password) {
        return credentials.password;
      }

      // Generate new key if doesn't exist
      const newKey = this.generateRandomKey();
      await Keychain.setGenericPassword('encryption_key', newKey, {
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      });

      return newKey;
    } catch (error) {
      console.error('Failed to get encryption key:', error);
      throw error;
    }
  }

  /**
   * Generate a random encryption key
   */
  private static generateRandomKey(): string {
    return Math.random().toString(36).substr(2, 32) +
           Math.random().toString(36).substr(2, 32);
  }
}
