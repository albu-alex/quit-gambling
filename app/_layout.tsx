import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeStore } from '@/src/stores/themeStore';
import { useUserStore } from '@/src/stores/userStore';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

export default function RootLayout() {
  const deviceColorScheme = useColorScheme();
  const themeMode = useThemeStore((state) => state.themeMode);
  const themeHydrated = useThemeStore((state) => state._hasHydrated);
  const isOnboarded = useUserStore((state) => state.isOnboarded);
  const hasHydrated = useUserStore((state) => state._hasHydrated);
  const [isReady, setIsReady] = useState(false);

  // Determine effective color scheme based on theme mode
  const effectiveColorScheme =
    themeMode === 'system' ? deviceColorScheme : themeMode;

  useEffect(() => {
    if (hasHydrated && themeHydrated) {
      setIsReady(true);
    }
  }, [hasHydrated, themeHydrated]);

  if (!isReady) {
    return null;
  }

  return (
    <ThemeProvider value={effectiveColorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isOnboarded ? (
          <Stack.Screen
            name="(onboarding)"
            options={{
              headerShown: false
            }}
          />
        ) : (
          <>
            <Stack.Screen name="(main)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </>
        )}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
