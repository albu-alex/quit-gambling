/**
 * Trial Offer Screen - 7-day free trial promotion before entering app
 */

import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/atoms/Button';
import { Card } from '../../src/components/atoms/Card';
import { COLORS, SPACING, STRINGS, TYPOGRAPHY } from '../../src/constants/config';
import { useUserStore } from '../../src/stores/userStore';

export default function TrialOfferScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  const completeOnboarding = useUserStore((state: any) => state.completeOnboarding);

  const handleStartTrial = async () => {
    // Get current answers from component state or pass through route
    // For now, we'll just mark onboarding as complete
    await completeOnboarding({
      yearsGambling: 0, // TODO: Get from previous screen
      frequencyPerWeek: 0,
      monthlySpend: 0,
      motivation: '',
    });

    // Navigate to main app
    router.push('/(main)');
  };

  const handleSkip = () => {
    router.push('/(main)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with gradient */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.primary,
            },
          ]}
        >
          <Text style={styles.emoji}>🎉</Text>
          <Text style={[styles.headerTitle as any, { color: colors.background }]}>{STRINGS.onboarding.trialOffer.title}</Text>
          <Text style={[styles.headerSubtitle as any, { color: colors.background }]}>
            {STRINGS.onboarding.trialOffer.subtitle}
          </Text>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsContainer}>
          <Text style={[styles.benefitsTitle as any, { color: colors.textPrimary }]}>What You'll Get:</Text>

          {STRINGS.onboarding.trialOffer.benefits.map((benefit: string, index: number) => (
            <Card key={index} variant="flat" padding={SPACING.md}>
              <Text style={[styles.benefitText as any, { color: colors.textPrimary }]}>{benefit}</Text>
            </Card>
          ))}
        </View>

        {/* Feature highlights */}
        <View style={styles.highlightsContainer}>
          <Card variant="elevated">
            <View style={styles.highlightRow}>
              <Text style={styles.highlightEmoji}>📊</Text>
              <View style={styles.highlightContent}>
                <Text style={[styles.highlightTitle as any, { color: colors.textPrimary }]}>Real-time Tracking</Text>
                <Text style={[styles.highlightDescription as any, { color: colors.textSecondary }]}>
                  See your progress visually with detailed streaks and statistics
                </Text>
              </View>
            </View>
          </Card>

          <Card variant="elevated">
            <View style={styles.highlightRow}>
              <Text style={styles.highlightEmoji}>🎮</Text>
              <View style={styles.highlightContent}>
                <Text style={[styles.highlightTitle as any, { color: colors.textPrimary }]}>Distraction Games</Text>
                <Text style={[styles.highlightDescription as any, { color: colors.textSecondary }]}>
                  Quick games to redirect urges when you need them most
                </Text>
              </View>
            </View>
          </Card>

          <Card variant="elevated">
            <View style={styles.highlightRow}>
              <Text style={styles.highlightEmoji}>👥</Text>
              <View style={styles.highlightContent}>
                <Text style={[styles.highlightTitle as any, { color: colors.textPrimary }]}>Accountability Friends</Text>
                <Text style={[styles.highlightDescription as any, { color: colors.textSecondary }]}>
                  Share progress and support each other on this journey
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          label={STRINGS.onboarding.trialOffer.cta}
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleStartTrial}
        />
        <Button
          label={STRINGS.onboarding.trialOffer.skip}
          variant="ghost"
          size="md"
          fullWidth
          onPress={handleSkip}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  header: {
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 60,
    marginBottom: SPACING.md,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  headerSubtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    lineHeight: 24,
  },
  benefitsContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  benefitsTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.lg,
  },
  benefitText: {
    ...TYPOGRAPHY.body,
    fontWeight: '500' as const,
  },
  highlightsContainer: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  highlightEmoji: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  highlightContent: {
    flex: 1,
  },
  highlightTitle: {
    ...TYPOGRAPHY.label,
    marginBottom: SPACING.xs,
  },
  highlightDescription: {
    ...TYPOGRAPHY.bodySmall,
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    gap: SPACING.md,
  },
});
