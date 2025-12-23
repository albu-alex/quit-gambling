/**
 * Games Hub Screen - Grid of available mini-games
 */

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { Card } from '../../../src/components/atoms/Card';
import { COLORS, SPACING, TYPOGRAPHY } from '../../../src/constants/config';

interface Game {
  id: string;
  name: string;
  description: string;
  icon: string;
  duration: string;
}

const GAMES: Game[] = [
  {
    id: 'memory',
    name: 'Memory Match',
    description: 'Test your memory with matching pairs',
    icon: '🧠',
    duration: '2 min',
  },
  {
    id: 'colorMatch',
    name: 'Color Match',
    description: 'Tap colors fast before they change',
    icon: '🎨',
    duration: '3 min',
  },
  {
    id: 'wordChain',
    name: 'Word Chain',
    description: 'Chain words together quickly',
    icon: '📝',
    duration: '2 min',
  },
];

export default function GamesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const handlePlayGame = (gameId: string) => {
    setSelectedGame(gameId);
    // Navigate to the game screen
    if (gameId === 'memory') {
      router.push('/(tabs)/games/memory');
    }
  };

  const renderGameCard = ({ item }: { item: Game }) => (
    <TouchableOpacity
      style={[styles.gameCard, { 
        backgroundColor: colors.surfaceLight,
        borderLeftColor: colors.primary
      }]}
      onPress={() => handlePlayGame(item.id)}
      activeOpacity={0.8}
    >
      <Text style={styles.gameIcon}>{item.icon}</Text>
      <Text style={[styles.gameName as any, { color: colors.textPrimary }]}>{item.name}</Text>
      <Text style={[styles.gameDesc as any, { color: colors.textSecondary }]}>{item.description}</Text>
      <View style={styles.gameMeta}>
        <Text style={[styles.gameDuration as any, { color: colors.textTertiary }]}>⏱️ {item.duration}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title as any, { color: colors.textPrimary }]}>Protect Your Streak</Text>
          <Text style={[styles.subtitle as any, { color: colors.textSecondary }]}>
            Play a quick game when you feel the urge to gamble. Every game helps!
          </Text>
        </View>

        {/* Games Grid */}
        <FlatList
          data={GAMES}
          renderItem={renderGameCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          numColumns={1}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.gridContainer}
        />

        {/* Info Section */}
        <Card variant="flat" padding={SPACING.lg}>
          <Text style={[styles.infoTitle as any, { color: colors.textPrimary }]}>💪 How it Works</Text>
          <View style={styles.infoPoint}>
            <Text style={[styles.infoBullet as any, { color: colors.primary }]}>•</Text>
            <Text style={[styles.infoText as any, { color: colors.textSecondary }]}>
              Each game takes 2-3 minutes to redirect your focus
            </Text>
          </View>
          <View style={styles.infoPoint}>
            <Text style={[styles.infoBullet as any, { color: colors.primary }]}>•</Text>
            <Text style={[styles.infoText as any, { color: colors.textSecondary }]}>
              Completing a game adds small streak bonus points
            </Text>
          </View>
          <View style={styles.infoPoint}>
            <Text style={[styles.infoBullet as any, { color: colors.primary }]}>•</Text>
            <Text style={[styles.infoText as any, { color: colors.textSecondary }]}>
              Games are meant to distract, not addict
            </Text>
          </View>
        </Card>

        {/* Tips Section */}
        <Card variant="elevated" padding={SPACING.lg}>
          <Text style={[styles.tipsTitle as any, { color: colors.textPrimary }]}>🎯 Pro Tips</Text>
          <Text style={[styles.tipText as any, { color: colors.textSecondary }]}>
            • Play when urges hit, not just for fun{"\n"}
            • Take your time - there's no time pressure{"\n"}
            • Celebrate completing a game!
          </Text>
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
    marginBottom: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.md,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    lineHeight: 22,
  },
  gridContainer: {
    marginVertical: SPACING.lg,
  },
  column: {
    marginBottom: SPACING.lg,
  },
  gameCard: {
    borderRadius: 12,
    padding: SPACING.lg,
    borderLeftWidth: 4,
  },
  gameIcon: {
    fontSize: 40,
    marginBottom: SPACING.md,
  },
  gameName: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.xs,
  },
  gameDesc: {
    ...TYPOGRAPHY.bodySmall,
    marginBottom: SPACING.md,
  },
  gameMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameDuration: {
    ...TYPOGRAPHY.caption,
  },
  infoTitle: {
    ...TYPOGRAPHY.label,
    marginBottom: SPACING.md,
  },
  infoPoint: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    alignItems: 'flex-start',
  },
  infoBullet: {
    ...TYPOGRAPHY.body,
    marginRight: SPACING.md,
  },
  infoText: {
    ...TYPOGRAPHY.bodySmall,
    flex: 1,
    lineHeight: 20,
  },
  tipsTitle: {
    ...TYPOGRAPHY.label,
    marginBottom: SPACING.md,
  },
  tipText: {
    ...TYPOGRAPHY.bodySmall,
    lineHeight: 22,
  },
});
