/**
 * Onboarding Welcome Screen
 */

import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/atoms/Button';
import { COLORS, SPACING, STRINGS, TYPOGRAPHY } from '../../src/constants/config';
import { useEffectiveColorScheme } from '../../src/hooks/useEffectiveColorScheme';

export default function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = useEffectiveColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  const handleStart = () => {
    router.push('/questionnaire');
  };

  const handleLogin = () => {
    router.push({ pathname: '/login' } as any);
  };

  const handleSignup = () => {
    router.push({ pathname: '/signup' } as any);
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

        {/* Auth Buttons */}
        <View style={styles.authSection}>
          {/* Sign In Button */}
          <Button
            label="Sign In"
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleLogin}
          />

          {/* Create Account Button */}
          <Button
            label="Create Account"
            variant="secondary"
            size="lg"
            fullWidth
            onPress={handleSignup}
          />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textTertiary }]}>OR</Text>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>

          {/* Try Without Account */}
          <TouchableOpacity
            style={[styles.tryButton, { borderColor: colors.primary }]}
            onPress={handleStart}
          >
            <Text style={[styles.tryButtonText, { color: colors.primary }]}>Try Without Account</Text>
          </TouchableOpacity>
        </View>

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
  authSection: {
    marginVertical: SPACING.lg,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '600',
  },
  tryButton: {
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  tryButtonText: {
    fontSize: TYPOGRAPHY.body.fontSize,
    fontWeight: '600',
  },
  footer: {
    ...TYPOGRAPHY.bodySmall,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
});
