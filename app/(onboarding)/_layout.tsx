/**
 * Onboarding Stack Layout
 */

import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '../../constants/theme';

export default function OnboardingLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Welcome',
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: 'Sign In',
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: 'Create Account',
        }}
      />
      <Stack.Screen
        name="questionnaire"
        options={{
          title: 'Tell Us About You',
        }}
      />
      <Stack.Screen
        name="trial-offer"
        options={{
          title: 'Your Trial',
        }}
      />
    </Stack>
  );
}
