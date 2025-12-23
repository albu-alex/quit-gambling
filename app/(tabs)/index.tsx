import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button } from '../../src/components/atoms/Button';
import { Card } from '../../src/components/atoms/Card';
import { StatBox } from '../../src/components/atoms/StatBox';
import { CheckInCard } from '../../src/components/molecules/CheckInCard';
import { StreakHeader } from '../../src/components/molecules/StreakHeader';
import { COLORS, SPACING, TYPOGRAPHY } from '../../src/constants/config';
import { StreakCalculator } from '../../src/domain/streak/StreakCalculator';
import { useUserStore } from '../../src/stores/userStore';

export default function HomeScreen() {
  const router = useRouter();
  const userStore = useUserStore();
  const [showCheckInPrompt, setShowCheckInPrompt] = useState(false);

  const {
    currentStreak,
    longestStreak,
    lastCheckInDate,
    onboardingAnswers,
    recordCheckIn,
    shouldPromptCheckIn,
  } = userStore;

  // Check if should show check-in prompt on mount
  useEffect(() => {
    if (shouldPromptCheckIn()) {
      setShowCheckInPrompt(true);
    }
  }, []);

  const handleCheckIn = async (gambled: boolean) => {
    try {
      await recordCheckIn(gambled);

      if (gambled) {
        // Show streak loss message
        Alert.alert(
          'Streak Broken',
          'Recovery is always possible. Let\'s start fresh tomorrow.',
          [{ text: 'Continue', onPress: () => setShowCheckInPrompt(false) }]
        );
      } else {
        // Show encouragement
        Alert.alert(
          '💪 Great Job!',
          'You made it another day. Your strength is building.',
          [{ text: 'Continue', onPress: () => setShowCheckInPrompt(false) }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to record check-in. Please try again.');
    }
  };

  const nextMilestone = StreakCalculator.getNextMilestone(currentStreak);
  const moneySaved = StreakCalculator.calculateMoneySaved(
    currentStreak,
    onboardingAnswers?.monthlySpend || 0
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.greeting}>Your Journey</Text>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/settings')}
            style={styles.settingsButton}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Main Streak Display */}
        <StreakHeader days={currentStreak} lastCheckIn={lastCheckInDate} />

        {/* Daily Check-In Card */}
        {showCheckInPrompt ? (
          <CheckInCard onCheckIn={handleCheckIn} />
        ) : (
          <Card variant="flat" padding={SPACING.lg}>
            <Text style={styles.checkInStatus}>✓ Checked in today</Text>
            <Button
              label="Check in again"
              variant="secondary"
              size="sm"
              fullWidth
              onPress={() => setShowCheckInPrompt(true)}
            />
          </Card>
        )}

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatBox
            label="Longest Streak"
            value={longestStreak}
            icon="🏆"
            color={COLORS.warning}
          />
          <StatBox
            label="Money Saved"
            value={`₹${moneySaved}`}
            icon="💰"
            color={COLORS.success}
          />
        </View>

        {/* Next Milestone */}
        {nextMilestone && (
          <Card variant="elevated">
            <Text style={styles.milestoneLabel}>Next Milestone</Text>
            <View style={styles.milestoneContainer}>
              <Text style={styles.milestoneBadge}>{nextMilestone.badge}</Text>
              <View style={styles.milestoneInfo}>
                <Text style={styles.milestoneTitle}>{nextMilestone.title}</Text>
                <Text style={styles.milestoneProgress}>
                  {nextMilestone.days - currentStreak} days to go
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/games')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>🎮</Text>
            <Text style={styles.actionTitle}>Play a Game</Text>
            <Text style={styles.actionDesc}>Distract from urges</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/friends')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionTitle}>Friends</Text>
            <Text style={styles.actionDesc}>See who\'s winning</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/achievements')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>🏅</Text>
            <Text style={styles.actionTitle}>Achievements</Text>
            <Text style={styles.actionDesc}>View your wins</Text>
          </TouchableOpacity>
        </View>

        {/* Crisis Support */}
        <Card variant="flat" padding={SPACING.lg}>
          <Text style={styles.crisisTitle}>💬 Need Immediate Help?</Text>
          <Text style={styles.crisisText}>
            National Gambling Addiction Hotline: 0800 XXX XXXX
          </Text>
          <Button
            label="View More Resources"
            variant="ghost"
            size="sm"
            fullWidth
            onPress={() => {
              /* TODO: Navigate to resources screen */
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  greeting: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
  },
  settingsButton: {
    padding: SPACING.md,
  },
  settingsIcon: {
    fontSize: 28,
  },
  checkInStatus: {
    ...TYPOGRAPHY.body,
    color: COLORS.success,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginVertical: SPACING.lg,
  },
  milestoneLabel: {
    ...TYPOGRAPHY.label,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  milestoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  milestoneBadge: {
    fontSize: 40,
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  milestoneProgress: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  quickActionsContainer: {
    marginVertical: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  actionCard: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginRight: SPACING.lg,
  },
  actionTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    flex: 1,
  },
  actionDesc: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  crisisTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  crisisText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
});

