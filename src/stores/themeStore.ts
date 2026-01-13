/**
 * Theme Store - Zustand + AsyncStorage persistence
 * Handles app theme preference (light, dark, system)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  themeMode: ThemeMode;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  getEffectiveTheme: () => 'light' | 'dark';
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeMode: 'system',
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),

      setThemeMode: async (mode: ThemeMode) => {
        set({ themeMode: mode });
      },

      getEffectiveTheme: () => {
        const state = get();
        if (state.themeMode === 'system') {
          // This will be called from a component context where useColorScheme is available
          return 'light'; // Fallback, should be overridden by component
        }
        return state.themeMode;
      },
    }),
    {
      name: 'theme-store',
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
      partialize: (state) => ({
        themeMode: state.themeMode,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);
