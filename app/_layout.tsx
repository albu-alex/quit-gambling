import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { logAppOpenedEvent } from '@/src/services/firebase/analytics';
import { auth } from '@/src/services/firebase/config';
import { useThemeStore } from '@/src/stores/themeStore';
import { useUserStore } from '@/src/stores/userStore';
import { onAuthStateChanged } from '@firebase/auth';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

export default function RootLayout() {
  const deviceColorScheme = useColorScheme();
  const themeMode = useThemeStore((state) => state.themeMode);
  const themeHydrated = useThemeStore((state) => state._hasHydrated);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const isOnboarded = useUserStore((state) => state.isOnboarded);
  const questionnaireCompleted = useUserStore((state) => state.questionnaireCompleted);
  const userId = useUserStore((state) => state.userId);
  const hasHydrated = useUserStore((state) => state._hasHydrated);
  const [isReady, setIsReady] = useState(false);

  // Determine effective color scheme based on theme mode
  const effectiveColorScheme =
    themeMode === 'system' ? deviceColorScheme : themeMode;

  useEffect(() => {
    if (hasHydrated && themeHydrated) {
      setIsReady(true);

      // Log app opened event when app initializes
      if (isAuthenticated && isOnboarded && userId) {
        logAppOpenedEvent(userId).catch((error) => {
          console.warn('Failed to log app opened event:', error);
        });
      }
    }
  }, [hasHydrated, themeHydrated, isAuthenticated, isOnboarded, userId]);

  // Listen to Firebase auth state changes to detect logout
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const state = useUserStore.getState();
      
      // If Firebase user is null but Zustand says we're authenticated, 
      // it means logout happened - reset auth but keep questionnaire status
      if (!firebaseUser && state.isAuthenticated) {
        console.log('Firebase user signed out, resetting auth state');
        useUserStore.setState({ 
          isAuthenticated: false,
          userId: '',
          userEmail: null,
          // Keep isOnboarded and questionnaireCompleted
        });
      }
      // If Firebase user exists but Zustand says we're not authenticated,
      // sync the state
      else if (firebaseUser && !state.isAuthenticated) {
        console.log('Firebase user detected, syncing state');
        useUserStore.setState({ 
          userId: firebaseUser.uid,
          userEmail: firebaseUser.email,
          isAuthenticated: true,
          isOnboarded: true, // Mark as onboarded when logged in
        });
      }
    });

    return () => unsubscribe();
  }, []);

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
        {!isAuthenticated ? (
          // Not logged in - show onboarding/login flow
          <Stack.Screen
            name="(onboarding)"
            options={{
              headerShown: false
            }}
          />
        ) : isOnboarded ? (
          // Logged in and onboarded - show main app
          <>
            <Stack.Screen name="(main)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </>
        ) : null}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
