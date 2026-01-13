/**
 * Friends Screen - View friends and leaderboard
 */

import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../src/components/atoms/Button';
import { Card } from '../../../src/components/atoms/Card';
import { COLORS, SPACING, TYPOGRAPHY } from '../../../src/constants/config';
import { useEffectiveColorScheme } from '../../../src/hooks/useEffectiveColorScheme';
import { useSocialStore } from '../../../src/stores/socialStore';

export default function FriendsScreen() {
  const router = useRouter();
  const colorScheme = useEffectiveColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  const { friends, getFriendsLeaderboard } = useSocialStore();
  const friendsLeaderboard = getFriendsLeaderboard();

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
          <Text style={[styles.title, { color: colors.textPrimary }]}>Friends</Text>
          <TouchableOpacity
            onPress={() => router.push('/(main)/friends/add')}
            style={[styles.addButton, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.addButtonText, { color: colors.background }]}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {friends.length === 0 ? (
          <Card variant="flat" padding={SPACING.lg}>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No Friends Yet</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Invite friends to join you on your journey to stay gambling-free.
              Accountability helps!
            </Text>
            <Button
              label="Add Your First Friend"
              variant="primary"
              size="md"
              fullWidth
              onPress={() => router.push('/(main)/friends/add')}
            />
          </Card>
        ) : (
          <>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Your Friends' Progress</Text>
            {friendsLeaderboard.map((entry, index) => (
              <Card key={entry.userId} variant="elevated" padding={SPACING.lg}>
                <View style={styles.leaderboardRow}>
                  <View style={[styles.rankBadge, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.rankText, { color: colors.background }]}>#{entry.rank}</Text>
                  </View>
                  <View style={styles.friendInfo}>
                    <Text style={[styles.friendName, { color: colors.textPrimary }]}>{entry.displayName}</Text>
                    <Text style={[styles.friendStreak, { color: colors.textSecondary }]}>
                      {entry.currentStreak} days 🔥
                    </Text>
                  </View>
                  <Text style={styles.trophy}>
                    {entry.currentStreak > 30 ? '👑' : ''}
                  </Text>
                </View>
              </Card>
            ))}
          </>
        )}
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
  addButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  addButtonText: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    ...TYPOGRAPHY.label,
    fontWeight: '700',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  friendStreak: {
    ...TYPOGRAPHY.bodySmall,
  },
  trophy: {
    fontSize: 24,
  },
});
