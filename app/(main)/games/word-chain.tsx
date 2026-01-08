/**
 * Word Chain Mini-Game - Chain words together quickly
 */

import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
    useColorScheme
} from 'react-native';
import { Button } from '../../../src/components/atoms/Button';
import { COLORS, SPACING, TYPOGRAPHY } from '../../../src/constants/config';

const GAME_DURATION = 60; // 60 seconds
const STARTING_WORDS = [
  'APPLE',
  'OCEAN',
  'GAME',
  'TIGER',
  'ENERGY',
  'FOREST',
  'CLOUD',
];

const COMMON_WORDS = [
  'APPLE', 'ENERGY', 'YARD', 'DREAM', 'MONEY', 'YES', 'SNAKE',
  'EAGLE', 'EDGE', 'ELEPHANT', 'EMBRACE', 'EMPTY', 'ENVY', 'EPIC',
  'OCEAN', 'ORANGE', 'ORDER', 'ORGAN', 'OXYGEN', 'ONION',
  'GAME', 'GIVE', 'GOLD', 'GREED', 'GREEN', 'GLOW', 'GHOST',
  'TIGER', 'TREE', 'TRAIN', 'TREAT', 'TRUST', 'TRUTH',
  'FOREST', 'FOOD', 'FOOT', 'FORCE', 'FORK', 'FORM', 'FORWARD',
  'CLOUD', 'CLEAN', 'CLEAR', 'CLIMB', 'CLOSE', 'COAL',
];

export default function WordChainScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameActive, setGameActive] = useState(true);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [gameStarted, setGameStarted] = useState(false);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<string>('');

  // Initialize game
  useEffect(() => {
    if (gameStarted && currentWord === '') {
      const startWord = STARTING_WORDS[Math.floor(Math.random() * STARTING_WORDS.length)];
      setCurrentWord(startWord);
      setUsedWords(new Set([startWord]));
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

  // Clear message after 2 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmitWord = () => {
    if (!inputValue.trim()) return;

    const word = inputValue.toUpperCase().trim();

    // Validate word starts with last letter of current word
    const lastLetter = currentWord[currentWord.length - 1];
    if (word[0] !== lastLetter) {
      setMessage('❌ Word must start with: ' + lastLetter);
      setInputValue('');
      return;
    }

    // Check if word already used
    if (usedWords.has(word)) {
      setMessage('❌ Word already used!');
      setInputValue('');
      return;
    }

    // Check if word is valid (in our word list)
    if (!COMMON_WORDS.includes(word)) {
      setMessage('❌ Invalid word!');
      setInputValue('');
      return;
    }

    // Valid word!
    setScore((prev) => prev + 1);
    setMessage('✓ Great word!');
    setUsedWords((prev) => new Set([...prev, word]));
    setCurrentWord(word);
    setInputValue('');
  };

  const handleStartGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameActive(true);
    setUsedWords(new Set());
    setMessage('');
  };

  const handlePlayAgain = () => {
    setGameStarted(false);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameActive(false);
    setCurrentWord('');
    setInputValue('');
    setUsedWords(new Set());
    setMessage('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {!gameStarted ? (
        <View style={styles.startScreen}>
          <Text style={[styles.title as any, { color: colors.textPrimary }]}>
            Word Chain
          </Text>
          <Text style={[styles.description as any, { color: colors.textSecondary }]}>
            Chain words together quickly!
          </Text>
          <View
            style={[
              styles.instructionBox,
              { backgroundColor: colors.surfaceLight },
            ]}
          >
            <Text style={[styles.instruction as any, { color: colors.textPrimary }]}>
              How to Play:
            </Text>
            <Text style={[styles.instructionText as any, { color: colors.textSecondary }]}>
              • You have {GAME_DURATION} seconds{'\n'}
              • Each new word must start with the{'\n'}
              &nbsp;&nbsp;last letter of the previous word{'\n'}
              • Example: APPLE → ENERGY → YES{'\n'}
              • Each valid word = 1 point{'\n'}
              • Can't repeat words!
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.gameScreen}
        >
          {/* Header */}
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

          {/* Current Word */}
          <View style={styles.currentWordSection}>
            <Text style={[styles.currentWordLabel as any, { color: colors.textSecondary }]}>
              Current Word:
            </Text>
            <View
              style={[
                styles.currentWordBox,
                { backgroundColor: colors.surfaceLight },
              ]}
            >
              <Text style={[styles.currentWord as any, { color: colors.primary }]}>
                {currentWord}
              </Text>
              <Text style={[styles.nextLetterHint as any, { color: colors.secondary }]}>
                Next word must start with: <Text style={{ fontWeight: 'bold' }}>
                  {currentWord[currentWord.length - 1]}
                </Text>
              </Text>
            </View>
          </View>

          {/* Input Section */}
          <View style={styles.inputSection}>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.textPrimary,
                  backgroundColor: colors.surfaceLight,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Enter your word..."
              placeholderTextColor={colors.textSecondary}
              value={inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={handleSubmitWord}
              autoCapitalize="characters"
              editable={gameActive}
            />
            <Button
              label="Submit"
              variant="primary"
              size="md"
              fullWidth
              disabled={!inputValue.trim()}
              onPress={handleSubmitWord}
            />
          </View>

          {/* Message */}
          {message && (
            <Text
              style={[
                styles.message as any,
                {
                  color: message.includes('✓') ? colors.success : colors.danger,
                },
              ]}
            >
              {message}
            </Text>
          )}

          {/* Used Words */}
          <View style={styles.usedWordsSection}>
            <Text style={[styles.usedWordsLabel as any, { color: colors.textSecondary }]}>
              Words Used ({usedWords.size - 1}):
            </Text>
            <View style={styles.usedWordsList}>
              {Array.from(usedWords)
                .filter((w) => w !== STARTING_WORDS[0])
                .slice(-5)
                .map((word, index) => (
                  <View
                    key={index}
                    style={[
                      styles.usedWordBadge,
                      { backgroundColor: colors.primary + '20' },
                    ]}
                  >
                    <Text style={[styles.usedWordText as any, { color: colors.primary }]}>
                      {word}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        </KeyboardAvoidingView>
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
  currentWordSection: {
    marginBottom: SPACING.xl,
  },
  currentWordLabel: {
    ...TYPOGRAPHY.bodySmall,
    marginBottom: SPACING.md,
  },
  currentWordBox: {
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  currentWord: {
    ...TYPOGRAPHY.h1,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  nextLetterHint: {
    ...TYPOGRAPHY.bodySmall,
  },
  inputSection: {
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: 16,
    fontWeight: '600',
  },
  message: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    fontWeight: '600',
  },
  usedWordsSection: {
    marginTop: SPACING.lg,
    flex: 1,
  },
  usedWordsLabel: {
    ...TYPOGRAPHY.bodySmall,
    marginBottom: SPACING.md,
  },
  usedWordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  usedWordBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 16,
  },
  usedWordText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
});
