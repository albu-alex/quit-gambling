/**
 * Memory Match Mini-Game
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Button } from '../../../src/components/atoms/Button';
import { COLORS, SPACING, TYPOGRAPHY } from '../../../src/constants/config';

interface Card {
  id: number;
  symbol: string;
  matched: boolean;
  flipped: boolean;
}

const SYMBOLS = ['🌟', '🎈', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸'];
const GRID_SIZE = 4;

export default function MemoryGameScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  const params = useLocalSearchParams();
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Initialize game
  useEffect(() => {
    initializeGame();
    setStartTime(new Date());
  }, []);

  // Timer
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameOver]);

  // Check for win
  useEffect(() => {
    if (matched.length === GRID_SIZE * 2 && matched.length > 0) {
      setGameOver(true);
    }
  }, [matched]);

  const initializeGame = () => {
    const pairs = SYMBOLS.slice(0, GRID_SIZE).flatMap((symbol) => [
      { symbol, id: Math.random() },
      { symbol, id: Math.random() },
    ]);

    const shuffled = pairs.sort(() => Math.random() - 0.5);
    const initialCards: Card[] = shuffled.map((item, index) => ({
      id: index,
      symbol: item.symbol,
      matched: false,
      flipped: false,
    }));

    setCards(initialCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  const handleCardPress = (id: number) => {
    if (flipped.includes(id) || matched.includes(id) || flipped.length >= 2) {
      return;
    }

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);

      const [first, second] = newFlipped;
      if (cards[first].symbol === cards[second].symbol) {
        // Match found
        setMatched((prev) => [...prev, first, second]);
        setFlipped([]);
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  const handlePlayAgain = () => {
    initializeGame();
    setGameOver(false);
    setElapsedSeconds(0);
    setStartTime(new Date());
  };

  const handleBack = () => {
    router.back();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={[styles.backButton as any, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title as any, { color: colors.textPrimary }]}>Memory Match</Text>
        <View style={styles.stats}>
          <Text style={[styles.stat as any, { color: colors.textSecondary }]}>⏱️ {formatTime(elapsedSeconds)}</Text>
          <Text style={[styles.stat as any, { color: colors.textSecondary }]}>Moves: {moves}</Text>
        </View>
      </View>

      {!gameOver ? (
        <View style={styles.gameContainer}>
          <View style={styles.grid}>
            {cards.map((card) => (
              <TouchableOpacity
                key={card.id}
                style={[
                  styles.cardButton,
                  { 
                    backgroundColor: colors.primary,
                    borderColor: colors.primary
                  },
                  matched.includes(card.id) && [styles.cardMatched, { backgroundColor: colors.success }],
                ]}
                onPress={() => handleCardPress(card.id)}
                disabled={matched.includes(card.id)}
                activeOpacity={0.7}
              >
                {flipped.includes(card.id) || matched.includes(card.id) ? (
                  <Animated.Text
                    style={styles.cardSymbol}
                    entering={FadeIn}
                    exiting={FadeOut}
                  >
                    {card.symbol}
                  </Animated.Text>
                ) : (
                  <Text style={[styles.cardBack as any, { color: colors.background }]}>?</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverEmoji}>🎉</Text>
          <Text style={[styles.gameOverTitle as any, { color: colors.textPrimary }]}>Fantastic!</Text>
          <Text style={[styles.gameOverStats as any, { color: colors.textSecondary }]}>
            You matched all pairs in {moves} moves{'\n'}
            Time: {formatTime(elapsedSeconds)}
          </Text>
          <Text style={[styles.gameOverMessage as any, { color: colors.textSecondary }]}>
            You stayed focused and won! Great work protecting your streak.
          </Text>

          <View style={styles.buttonGroup}>
            <Button
              label="Play Again"
              variant="primary"
              size="lg"
              fullWidth
              onPress={handlePlayAgain}
            />
            <Button
              label="Back to Games"
              variant="ghost"
              size="md"
              fullWidth
              onPress={handleBack}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  backButton: {
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.sm,
  },
  stats: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  stat: {
    ...TYPOGRAPHY.body,
    fontWeight: '600' as const,
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.md,
    width: Dimensions.get('window').width - SPACING.lg * 2,
  },
  cardButton: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  cardMatched: {
    opacity: 0.6,
  },
  cardSymbol: {
    fontSize: 32,
  },
  cardBack: {
    ...TYPOGRAPHY.h1,
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  gameOverEmoji: {
    fontSize: 80,
    marginBottom: SPACING.lg,
  },
  gameOverTitle: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.md,
  },
  gameOverStats: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 24,
  },
  gameOverMessage: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  buttonGroup: {
    width: '100%',
    gap: SPACING.md,
  },
});
