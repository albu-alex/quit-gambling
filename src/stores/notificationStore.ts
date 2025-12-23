/**
 * Notification Store - Scheduled notifications and settings
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ScheduledNotification } from '../types';

interface NotificationState {
  scheduledNotifications: ScheduledNotification[];
  pushToken: string | null;
  notificationsEnabled: boolean;
  checkInReminderTime: string; // HH:mm format, e.g., "09:00"

  // Actions
  setPushToken: (token: string) => Promise<void>;
  scheduleNotification: (notification: Omit<ScheduledNotification, 'id' | 'sent'>) => Promise<void>;
  markNotificationAsSent: (id: string) => Promise<void>;
  updateCheckInReminderTime: (time: string) => Promise<void>;
  toggleNotifications: (enabled: boolean) => Promise<void>;
  getScheduledNotifications: () => ScheduledNotification[];
  cancelNotification: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      scheduledNotifications: [],
      pushToken: null,
      notificationsEnabled: true,
      checkInReminderTime: '09:00',

      setPushToken: async (token: string) => {
        set({ pushToken: token });
      },

      scheduleNotification: async (notification) => {
        const newNotification: ScheduledNotification = {
          ...notification,
          id: uuidv4(),
          sent: false,
        };

        set({
          scheduledNotifications: [...get().scheduledNotifications, newNotification],
        });
      },

      markNotificationAsSent: async (id: string) => {
        const notifications = get().scheduledNotifications.map((n) =>
          n.id === id ? { ...n, sent: true } : n
        );

        set({ scheduledNotifications: notifications });
      },

      updateCheckInReminderTime: async (time: string) => {
        set({ checkInReminderTime: time });
      },

      toggleNotifications: async (enabled: boolean) => {
        set({ notificationsEnabled: enabled });
      },

      getScheduledNotifications: () => {
        return get().scheduledNotifications.filter((n) => !n.sent);
      },

      cancelNotification: async (id: string) => {
        set({
          scheduledNotifications: get().scheduledNotifications.filter((n) => n.id !== id),
        });
      },
    }),
    {
      name: 'notification-store',
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
