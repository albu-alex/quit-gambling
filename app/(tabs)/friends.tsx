/**
 * Friends Screen - View friends and leaderboard
 */

import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../src/components/atoms/Button';
import { Card } from '../../src/components/atoms/Card';
import { COLORS, SPACING, TYPOGRAPHY } from '../../src/constants/config';
import { useSocialStore } from '../../src/stores/socialStore';

export default function FriendsScreen() {
  const router = useRouter();
  const { friends, getFriendsLeaderboard } = useSocialStore();
  const friendsLeaderboard = getFriendsLeaderboard();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Friends</Text>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/friends/add')}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {friends.length === 0 ? (
          <Card variant="flat" padding={SPACING.lg}>
            <Text style={styles.emptyTitle}>No Friends Yet</Text>
            <Text style={styles.emptyText}>
              Invite friends to join you on your journey to stay gambling-free.
              Accountability helps!
            </Text>
            <Button
              label="Add Your First Friend"
              variant="primary"
              size="md"
              fullWidth
              onPress={() => router.push('/(tabs)/friends/add')}
            />
          </Card>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Your Friends' Progress</Text>
            {friendsLeaderboard.map((entry, index) => (
              <Card key={entry.userId} variant="elevated" padding={SPACING.lg}>
                <View style={styles.leaderboardRow}>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>#{entry.rank}</Text>
                  </View>
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName}>{entry.displayName}</Text>
                    <Text style={styles.friendStreak}>
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
    backgroundColor: COLORS.background,
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
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  addButtonText: {
    ...TYPOGRAPHY.body,
    color: COLORS.background,
    fontWeight: '600',
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
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
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    ...TYPOGRAPHY.label,
    color: COLORS.background,
    fontWeight: '700',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  friendStreak: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  trophy: {
    fontSize: 24,
  },
});
