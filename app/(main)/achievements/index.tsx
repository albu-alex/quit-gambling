/**
 * Achievements Screen
 */

import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../src/components/atoms/Button';
import { Card } from '../../../src/components/atoms/Card';
import { COLORS, SPACING, TYPOGRAPHY } from '../../../src/constants/config';
import { StreakCalculator } from '../../../src/domain/streak/StreakCalculator';
import { useUserStore } from '../../../src/stores/userStore';

export default function AchievementsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  const currentStreak = useUserStore((state) => state.currentStreak);
  const unlockedMilestones = StreakCalculator.getUnlockedMilestones(currentStreak);
  const allMilestones = StreakCalculator.MILESTONES;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.textPrimary }]}>Achievements</Text>

        {/* Unlocked Achievements */}
        {unlockedMilestones.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>🏆 Unlocked</Text>
            {unlockedMilestones.map((milestone) => (
              <Card key={milestone.days} variant="elevated" padding={SPACING.lg}>
                <View style={styles.achievementRow}>
                  <Text style={styles.achievementBadge}>{milestone.badge}</Text>
                  <View style={styles.achievementContent}>
                    <Text style={[styles.achievementTitle, { color: colors.textPrimary }]}>{milestone.title}</Text>
                    <Text style={[styles.achievementDays, { color: colors.textSecondary }]}>
                      Achieved at {milestone.days} days
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </>
        )}

        {/* Locked Achievements */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>🔒 Locked</Text>
        {allMilestones
          .filter((m) => m.days > currentStreak)
          .map((milestone) => (
            <Card key={milestone.days} variant="flat" padding={SPACING.lg}>
              <View style={styles.achievementRow}>
                <Text style={styles.achievementBadgeGray}>❌</Text>
                <View style={styles.achievementContent}>
                  <Text style={[styles.achievementTitleGray, { color: colors.textSecondary }]}>{milestone.title}</Text>
                  <Text style={[styles.achievementProgress, { color: colors.textTertiary }]}>
                    {milestone.days - currentStreak} days to go
                  </Text>
                </View>
              </View>
            </Card>
          ))}

        {/* Share Section */}
        <Card variant="elevated" padding={SPACING.lg}>
          <Text style={[styles.shareTitle, { color: colors.textPrimary }]}>📸 Share Your Win</Text>
          <Text style={[styles.shareText, { color: colors.textSecondary }]}>
            Share your achievements with friends and on social media
          </Text>
          <Button
            label="Create Shareable Image"
            variant="primary"
            size="md"
            fullWidth
            onPress={() => router.push('/(main)/achievements/share')}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.lg,
    marginTop: SPACING.lg,
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  achievementBadge: {
    fontSize: 48,
  },
  achievementBadgeGray: {
    fontSize: 48,
    opacity: 0.5,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  achievementTitleGray: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  achievementDays: {
    ...TYPOGRAPHY.bodySmall,
  },
  achievementProgress: {
    ...TYPOGRAPHY.bodySmall,
    fontStyle: 'italic',
  },
  shareTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  shareText: {
    ...TYPOGRAPHY.bodySmall,
    marginBottom: SPACING.lg,
  },
});
