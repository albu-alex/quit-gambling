/**
 * Color Match Mini-Game - Tap the correct color before it changes
 */

import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';
import { Button } from '../../../src/components/atoms/Button';
import { COLORS, SPACING, TYPOGRAPHY } from '../../../src/constants/config';

const GAME_DURATION = 60; // 60 seconds
const COLORS_LIST = [
  { name: 'Red', hex: '#FF6B6B' },
  { name: 'Blue', hex: '#4ECDC4' },
  { name: 'Green', hex: '#51CF66' },
  { name: 'Yellow', hex: '#FFD93D' },
];

export default function ColorMatchScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  const windowWidth = Dimensions.get('window').width;

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameActive, setGameActive] = useState(true);
  const [targetColor, setTargetColor] = useState<string>('');
  const [displayColor, setDisplayColor] = useState<string>('');
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize game
  useEffect(() => {
    if (gameStarted && targetColor === '') {
      generateNewRound();
    }
  }, [gameStarted]);

  // Timer
  useEffect(() => {
    if (!gameActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive]);

  // Change display color randomly every 2 seconds
  useEffect(() => {
    if (!gameActive) return;

    const changeInterval = setInterval(() => {
      const randomColor = COLORS_LIST[Math.floor(Math.random() * COLORS_LIST.length)];
      setDisplayColor(randomColor.hex);
    }, 2000);

    return () => clearInterval(changeInterval);
  }, [gameActive]);

  const generateNewRound = () => {
    const target = COLORS_LIST[Math.floor(Math.random() * COLORS_LIST.length)];
    const display = COLORS_LIST[Math.floor(Math.random() * COLORS_LIST.length)];
    setTargetColor(target.name);
    setDisplayColor(display.hex);
  };

  const handleColorPress = (colorName: string) => {
    if (!gameActive) return;

    if (colorName === targetColor) {
      setScore((prev) => prev + 1);
      generateNewRound();
    } else {
      // Wrong color - show alert but continue game
      Alert.alert('Oops!', 'That was the wrong color. Keep trying!', [{ text: 'Continue' }]);
    }
  };

  const handleStartGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameActive(true);
  };

  const handlePlayAgain = () => {
    setGameStarted(false);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameActive(false);
    setTargetColor('');
    setDisplayColor('');
  };

  const buttonWidth = (windowWidth - SPACING.lg * 2 - SPACING.md) / 3;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {!gameStarted ? (
        <View style={styles.startScreen}>
          <Text style={[styles.title as any, { color: colors.textPrimary }]}>
            Color Match
          </Text>
          <Text style={[styles.description as any, { color: colors.textSecondary }]}>
            Tap the color shown at the top before it changes!
          </Text>
          <View
            style={[
              styles.instructionBox,
              { backgroundColor: colors.surfaceLight },
            ]}
          >
            <Text style={[styles.instruction as any, { color: colors.textPrimary }]}>
              Rules:
            </Text>
            <Text style={[styles.instructionText as any, { color: colors.textSecondary }]}>
              • You have {GAME_DURATION} seconds{'\n'}
              • Find and tap the correct color{'\n'}
              • Colors change every 2 seconds{'\n'}
              • Each correct match = 1 point
            </Text>
          </View>
          <Button
            label="Start Game"
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleStartGame}
          />
        </View>
      ) : !gameActive ? (
        <View style={styles.gameOverScreen}>
          <Text style={[styles.gameOverTitle as any, { color: colors.textPrimary }]}>
            Game Over!
          </Text>
          <View
            style={[
              styles.scoreBox,
              { backgroundColor: colors.surfaceLight },
            ]}
          >
            <Text style={[styles.scoreLabel as any, { color: colors.textSecondary }]}>
              Final Score
            </Text>
            <Text style={[styles.scoreValue as any, { color: colors.primary }]}>
              {score}
            </Text>
          </View>
          <View style={styles.buttonGroup}>
            <Button
              label="Play Again"
              variant="primary"
              size="md"
              fullWidth
              onPress={handlePlayAgain}
            />
            <View style={styles.buttonSpacer} />
            <Button
              label="Back to Games"
              variant="ghost"
              size="md"
              fullWidth
              onPress={() => router.back()}
            />
          </View>
        </View>
      ) : (
        <View style={styles.gameScreen}>
          {/* Header with score and time */}
          <View style={styles.gameHeader}>
            <View style={styles.headerItem}>
              <Text style={[styles.headerLabel as any, { color: colors.textSecondary }]}>
                Score
              </Text>
              <Text style={[styles.headerValue as any, { color: colors.primary }]}>
                {score}
              </Text>
            </View>
            <View style={styles.headerItem}>
              <Text style={[styles.headerLabel as any, { color: colors.textSecondary }]}>
                Time Left
              </Text>
              <Text
                style={[
                  styles.headerValue as any,
                  {
                    color: timeLeft <= 10 ? colors.danger : colors.secondary,
                  },
                ]}
              >
                {timeLeft}s
              </Text>
            </View>
          </View>

          {/* Target Color Display */}
          <View style={styles.targetSection}>
            <Text style={[styles.targetLabel as any, { color: colors.textSecondary }]}>
              Tap this color:
            </Text>
            <Text style={[styles.targetColorName as any, { color: colors.primary }]}>
              {targetColor}
            </Text>
          </View>

          {/* Color Display Circle */}
          <View style={styles.displaySection}>
            <View
              style={[
                styles.colorCircle,
                {
                  backgroundColor: displayColor,
                },
              ]}
            />
          </View>

          {/* Color Buttons Grid */}
          <View style={styles.buttonsContainer}>
            {COLORS_LIST.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorButton,
                  {
                    width: buttonWidth,
                    backgroundColor: color.hex,
                  },
                ]}
                onPress={() => handleColorPress(color.name)}
                activeOpacity={0.7}
              >
                <Text style={styles.colorButtonLabel}>{color.name}</Text>
              </TouchableOpacity>
            ))}
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
  startScreen: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h1,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  instructionBox: {
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  instruction: {
    ...TYPOGRAPHY.label,
    marginBottom: SPACING.md,
    fontWeight: '600',
  },
  instructionText: {
    ...TYPOGRAPHY.bodySmall,
    lineHeight: 22,
  },
  gameOverScreen: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  gameOverTitle: {
    ...TYPOGRAPHY.h1,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  scoreBox: {
    borderRadius: 12,
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  scoreLabel: {
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.md,
  },
  scoreValue: {
    ...TYPOGRAPHY.h1,
    fontSize: 72,
  },
  buttonGroup: {
    gap: SPACING.md,
  },
  buttonSpacer: {
    height: SPACING.md,
  },
  gameScreen: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.xl,
  },
  headerItem: {
    alignItems: 'center',
  },
  headerLabel: {
    ...TYPOGRAPHY.caption,
    marginBottom: SPACING.xs,
  },
  headerValue: {
    ...TYPOGRAPHY.h2,
  },
  targetSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  targetLabel: {
    ...TYPOGRAPHY.bodySmall,
    marginBottom: SPACING.md,
  },
  targetColorName: {
    ...TYPOGRAPHY.h2,
    fontWeight: '700',
  },
  displaySection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.xl,
    height: 150,
  },
  colorCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.md,
    marginTop: SPACING.xl,
  },
  colorButton: {
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  colorButtonLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
});
