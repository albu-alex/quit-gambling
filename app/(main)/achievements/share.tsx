/**
 * Share Achievements Screen - Generate and share achievement cards
 */

import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';
import { Button } from '../../../src/components/atoms/Button';
import { Card } from '../../../src/components/atoms/Card';
import { COLORS, SPACING, TYPOGRAPHY } from '../../../src/constants/config';
import { StreakCalculator } from '../../../src/domain/streak/StreakCalculator';
import { useUserStore } from '../../../src/stores/userStore';

export default function ShareAchievementsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  const [isSharing, setIsSharing] = useState(false);
  const viewShotRef = useRef<ViewShot>(null);

  const currentStreak = useUserStore((state) => state.currentStreak);
  const createdAt = useUserStore((state) => state.createdAt);
  const onboardingAnswers = useUserStore((state) => state.onboardingAnswers);
  const unlockedMilestones = StreakCalculator.getUnlockedMilestones(currentStreak);
  const monthlySpend = onboardingAnswers?.monthlySpend || 500; // Fallback to 500 if not set
  const moneySaved = StreakCalculator.calculateMoneySaved(currentStreak, monthlySpend);
  const daysInRecovery = Math.floor(
    (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  const handleShare = async () => {
    setIsSharing(true);
    try {
      // Capture the achievement card as an image
      if (viewShotRef && viewShotRef.current && viewShotRef.current.capture) {
        const imageUri = await viewShotRef.current.capture();
        
        const message = `🎉 I've been gambling-free for ${currentStreak} days! 
                        💪 My Recovery Stats:
                        • Days in recovery: ${daysInRecovery}
                        • Current streak: ${currentStreak} days
                        • Money saved: $${Math.floor(moneySaved)}
                        • Achievements unlocked: ${unlockedMilestones.length}

                        Every day is a victory. I'm stronger than my urges.

                        Join me on this journey to recovery! Download the Quit Gambling app and start your own journey today.`;

        await Share.share({
          url: imageUri,
          message,
          title: '🏆 My Recovery Journey',
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share');
      console.error('Share error:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyText = () => {
    const text = `🎉 I've been gambling-free for ${currentStreak} days! 

                    💪 My Recovery Stats:
                    • Days in recovery: ${daysInRecovery}
                    • Current streak: ${currentStreak} days
                    • Money saved: $${Math.floor(moneySaved)}
                    • Achievements unlocked: ${unlockedMilestones.length}

                    Every day is a victory. I'm stronger than my urges.`;

    Alert.alert('Achievement Text Copied', text);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.backButton, { color: colors.primary }]}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Share Your Win</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Achievement Card Preview */}
        <ViewShot
          ref={viewShotRef}
          options={{ format: 'png', quality: 0.95 }}
        >
          <Card 
            variant="elevated" 
            padding={SPACING.xl} 
            style={{
              ...styles.shareableCard,
              backgroundColor: colors.primary,
            }}
          >
          <View style={styles.cardContent}>
            <Text style={styles.cardEmoji}>🏆</Text>
            <Text style={[styles.cardTitle, { color: colors.background }]}>
              Gambling-Free Journey
            </Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: colors.background }]}>
                  {currentStreak}
                </Text>
                <Text style={[styles.statLabel, { color: colors.background }]}>
                  Days Strong
                </Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: colors.background }]}>
                  RON {Math.floor(moneySaved)}
                </Text>
                <Text style={[styles.statLabel, { color: colors.background }]}>
                  Money Saved
                </Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: colors.background }]}>
                  {unlockedMilestones.length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.background }]}>
                  Milestones
                </Text>
              </View>
            </View>

            <Text style={[styles.motivationalText, { color: colors.background }]}>
              "Every day is a victory. I'm stronger than my urges."
            </Text>

            <Text style={[styles.timestamp, { color: colors.background }]}>
              {new Date().toLocaleDateString()}
            </Text>
          </View>
        </Card>
        </ViewShot>

        <Card variant="elevated" padding={SPACING.lg}>
          <Text style={[styles.optionTitle, { color: colors.textPrimary }]}>Share Your Achievement</Text>
          
          <Button
            label={isSharing ? 'Sharing...' : '📱 Share via Social Media'}
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleShare}
            disabled={isSharing}
          />

          <TouchableOpacity 
            style={[styles.copyButton, { borderColor: colors.border }]}
            onPress={handleCopyText}
          >
            <Text style={[styles.copyButtonText, { color: colors.primary }]}>
              📋 Copy Achievement Text
            </Text>
          </TouchableOpacity>
        </Card>

        <Card variant="flat" padding={SPACING.lg}>
          <Text style={[styles.previewTitle, { color: colors.textPrimary }]}>Your Stats</Text>
          
          <View style={styles.statsGrid}>
            <View style={[styles.gridItem, { borderColor: colors.border }]}>
              <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Days in Recovery</Text>
              <Text style={[styles.gridValue, { color: colors.textPrimary }]}>{daysInRecovery}</Text>
            </View>
            
            <View style={[styles.gridItem, { borderColor: colors.border }]}>
              <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Current Streak</Text>
              <Text style={[styles.gridValue, { color: colors.textPrimary }]}>{currentStreak}</Text>
            </View>
            
            <View style={[styles.gridItem, { borderColor: colors.border }]}>
              <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Money Saved</Text>
              <Text style={[styles.gridValue, { color: colors.textPrimary }]}>${Math.floor(moneySaved)}</Text>
            </View>
            
            <View style={styles.gridItem}>
              <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Achievements</Text>
              <Text style={[styles.gridValue, { color: colors.textPrimary }]}>{unlockedMilestones.length}</Text>
            </View>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  backButton: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  title: {
    ...TYPOGRAPHY.h2,
  },
  shareableCard: {
    borderRadius: 16,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardContent: {
    alignItems: 'center',
    width: '100%',
  },
  cardEmoji: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  cardTitle: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginBottom: SPACING.xl,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 60,
    opacity: 0.3,
  },
  statValue: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    ...TYPOGRAPHY.bodySmall,
  },
  motivationalText: {
    ...TYPOGRAPHY.body,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  timestamp: {
    ...TYPOGRAPHY.bodySmall,
  },
  optionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.lg,
  },
  copyButton: {
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  copyButtonText: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  previewTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '50%',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  gridLabel: {
    ...TYPOGRAPHY.bodySmall,
    marginBottom: SPACING.xs,
  },
  gridValue: {
    ...TYPOGRAPHY.h3,
  },
});
