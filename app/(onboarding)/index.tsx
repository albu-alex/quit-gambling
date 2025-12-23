/**
 * Onboarding Welcome Screen
 */

import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Button } from '../../src/components/atoms/Button';
import { COLORS, SPACING, STRINGS, TYPOGRAPHY } from '../../src/constants/config';

export default function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  const handleStart = () => {
    router.push('/questionnaire');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Logo/Icon */}
        <Text style={styles.emoji}>🔥</Text>

        {/* Title */}
        <Text style={[styles.title as any, { color: colors.textPrimary }]}>{STRINGS.onboarding.welcome.title}</Text>

        {/* Subtitle */}
        <Text style={[styles.subtitle as any, { color: colors.textSecondary }]}>{STRINGS.onboarding.welcome.subtitle}</Text>

        {/* Key Points */}
        <View style={styles.pointsContainer}>
          <View style={styles.point}>
            <Text style={styles.pointEmoji}>📅</Text>
            <Text style={[styles.pointText as any, { color: colors.textSecondary }]}>Track your gambling-free streak</Text>
          </View>
          <View style={styles.point}>
            <Text style={styles.pointEmoji}>🎮</Text>
            <Text style={[styles.pointText as any, { color: colors.textSecondary }]}>Play distraction games when you feel urges</Text>
          </View>
          <View style={styles.point}>
            <Text style={styles.pointEmoji}>👥</Text>
            <Text style={[styles.pointText as any, { color: colors.textSecondary }]}>Get support from friends</Text>
          </View>
          <View style={styles.point}>
            <Text style={styles.pointEmoji}>🏆</Text>
            <Text style={[styles.pointText as any, { color: colors.textSecondary }]}>Unlock achievements and celebrate wins</Text>
          </View>
        </View>

        {/* CTA Button */}
        <Button
          label={STRINGS.onboarding.welcome.cta}
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleStart}
        />

        {/* Footer text */}
        <Text style={[styles.footer as any, { color: colors.textTertiary }]}>
          Your data is encrypted and never shared. Recovery is always possible. 💪
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    justifyContent: 'space-between',
  },
  emoji: {
    fontSize: 80,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h1,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 24,
  },
  pointsContainer: {
    marginVertical: SPACING.xl,
  },
  point: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  pointEmoji: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  pointText: {
    ...TYPOGRAPHY.body,
    flex: 1,
  },
  footer: {
    ...TYPOGRAPHY.bodySmall,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
});
