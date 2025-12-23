/**
 * Achievements Screen
 */

import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../src/components/atoms/Button';
import { Card } from '../../src/components/atoms/Card';
import { COLORS, SPACING, TYPOGRAPHY } from '../../src/constants/config';
import { StreakCalculator } from '../../src/domain/streak/StreakCalculator';
import { useUserStore } from '../../src/stores/userStore';

export default function AchievementsScreen() {
  const currentStreak = useUserStore((state) => state.currentStreak);
  const unlockedMilestones = StreakCalculator.getUnlockedMilestones(currentStreak);
  const allMilestones = StreakCalculator.MILESTONES;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Achievements</Text>

        {/* Unlocked Achievements */}
        {unlockedMilestones.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>🏆 Unlocked</Text>
            {unlockedMilestones.map((milestone) => (
              <Card key={milestone.days} variant="elevated" padding={SPACING.lg}>
                <View style={styles.achievementRow}>
                  <Text style={styles.achievementBadge}>{milestone.badge}</Text>
                  <View style={styles.achievementContent}>
                    <Text style={styles.achievementTitle}>{milestone.title}</Text>
                    <Text style={styles.achievementDays}>
                      Achieved at {milestone.days} days
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </>
        )}

        {/* Locked Achievements */}
        <Text style={styles.sectionTitle}>🔒 Locked</Text>
        {allMilestones
          .filter((m) => m.days > currentStreak)
          .map((milestone) => (
            <Card key={milestone.days} variant="flat" padding={SPACING.lg}>
              <View style={styles.achievementRow}>
                <Text style={styles.achievementBadgeGray}>❌</Text>
                <View style={styles.achievementContent}>
                  <Text style={styles.achievementTitleGray}>{milestone.title}</Text>
                  <Text style={styles.achievementProgress}>
                    {milestone.days - currentStreak} days to go
                  </Text>
                </View>
              </View>
            </Card>
          ))}

        {/* Share Section */}
        <Card variant="elevated" padding={SPACING.lg}>
          <Text style={styles.shareTitle}>📸 Share Your Win</Text>
          <Text style={styles.shareText}>
            Share your achievements with friends and on social media
          </Text>
          <Button
            label="Create Shareable Image"
            variant="primary"
            size="md"
            fullWidth
            onPress={() => {
              /* TODO: Navigate to share screen */
            }}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
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
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  achievementTitleGray: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  achievementDays: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  achievementProgress: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textTertiary,
    fontStyle: 'italic',
  },
  shareTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  shareText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
});
