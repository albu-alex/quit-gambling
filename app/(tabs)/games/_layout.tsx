import { Stack } from 'expo-router';
import React from 'react';

export default function GamesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="memory" />
      <Stack.Screen name="color-match" />
      <Stack.Screen name="word-chain" />
    </Stack>
  );
}
