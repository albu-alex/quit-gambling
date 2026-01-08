import { Stack } from 'expo-router';
import React from 'react';

export default function AchievementsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="share" />
    </Stack>
  );
}
