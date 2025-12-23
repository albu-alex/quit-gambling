/**
 * StreakHeader Component - Main display of current streak
 */

import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/config';

interface StreakHeaderProps {
  days: number;
  lastCheckIn: string | null;
}

export const StreakHeader: React.FC<StreakHeaderProps> = ({ days, lastCheckIn }) => {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  const getMotivation = (days: number) => {
    if (days === 0) return 'Start today. One day at a time.';
    if (days < 7) return 'You\'re building momentum!';
    if (days < 30) return 'You\'re stronger than you think!';
    if (days < 100) return 'You\'re unstoppable!';
    return 'You\'re a champion! 👑';
  };

  const getLastCheckInText = (lastCheckIn: string | null) => {
    if (!lastCheckIn) return 'No check-in yet';
    const date = new Date(lastCheckIn);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Checked in today ✓';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Checked in yesterday';
    } else {
      return 'Last check-in: ' + date.toLocaleDateString();
    }
  };

  const gradientColors = colorScheme === 'dark' 
    ? [colors.primary, '#FF6B6B']
    : [colors.primary, '#FF8A65'];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.primary,
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.flame}>🔥</Text>
        <Text style={[styles.days as any, { color: colors.background }]}>{days}</Text>
        <Text style={[styles.label as any, { color: colors.background }]}>Days Gambling-Free</Text>
        <Text style={[styles.motivation as any, { color: colors.background }]}>{getMotivation(days)}</Text>
        <Text style={[styles.lastCheckIn as any, { color: colors.background }]}>{getLastCheckInText(lastCheckIn)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    borderRadius: 16,
    marginBottom: SPACING.lg,
  },
  content: {
    alignItems: 'center',
  },
  flame: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  days: {
    ...TYPOGRAPHY.h1,
    marginBottom: SPACING.xs,
  },
  label: {
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.md,
  },
  motivation: {
    ...TYPOGRAPHY.bodySmall,
    fontStyle: 'italic',
    marginBottom: SPACING.sm,
  },
  lastCheckIn: {
    ...TYPOGRAPHY.caption,
    opacity: 0.9,
  },
});
