/**
 * Onboarding Questionnaire Screen - Multi-slide form
 */

import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    GestureResponderEvent,
    LayoutChangeEvent,
    LayoutRectangle,
    PanResponder,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/atoms/Button';
import { COLORS, SPACING, STRINGS, TYPOGRAPHY } from '../../src/constants/config';
import { useEffectiveColorScheme } from '../../src/hooks/useEffectiveColorScheme';
import { OnboardingAnswers } from '../../src/types';

export default function QuestionnaireScreen() {
  const router = useRouter();
  const colorScheme = useEffectiveColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  const [slide, setSlide] = useState(0);
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>({
    yearsGambling: 0,
    frequencyPerWeek: 0,
    monthlySpend: 0,
    motivation: '',
  });
  const sliderWidth = useRef<LayoutRectangle | null>(null);

  // Helper function to handle slider changes
  const handleSliderChange = (
    trackEvent: GestureResponderEvent | LayoutChangeEvent,
    maxValue: number,
    onUpdate: (value: number) => void
  ) => {
    if ('nativeEvent' in trackEvent && 'pageX' in trackEvent.nativeEvent) {
      const pageX = trackEvent.nativeEvent.pageX;
      const sliderStart = sliderWidth.current?.x || 0;
      const relativeX = pageX - sliderStart;
      const width = sliderWidth.current?.width || 1;
      const percentage = Math.max(0, Math.min(1, relativeX / width));
      const value = percentage * maxValue;
      onUpdate(Math.round(value * 10) / 10); // Round to 1 decimal place
    }
  };

  const createPanResponder = (maxValue: number, onUpdate: (value: number) => void) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        handleSliderChange(evt, maxValue, onUpdate);
      },
      onPanResponderMove: (evt) => {
        handleSliderChange(evt, maxValue, onUpdate);
      },
    });
  };

  const yearsPanResponder = useRef(
    createPanResponder(50, (value) => {
      setAnswers({ ...answers, yearsGambling: value });
    })
  ).current;

  const frequencyPanResponder = useRef(
    createPanResponder(7, (value) => {
      setAnswers({ ...answers, frequencyPerWeek: value });
    })
  ).current;

  const handleNext = () => {
    if (slide < 3) {
      setSlide(slide + 1);
    } else {
      // All slides complete, go to trial offer
      router.push('/trial-offer');
    }
  };

  const handleBack = () => {
    if (slide > 0) {
      setSlide(slide - 1);
    } else {
      router.back();
    }
  };

  const isCurrentSlideValid = (): boolean => {
    switch (slide) {
      case 0:
        return true;
      case 1:
        return true;
      case 2:
        return answers.monthlySpend !== undefined && answers.monthlySpend >= 0;
      case 3:
        return !!(answers.motivation && answers.motivation.trim().length > 0);
      default:
        return false;
    }
  };

  const renderSlide = () => {
    switch (slide) {
      case 0:
        return (
          <View style={styles.slide}>
            <Text style={[styles.question as any, { color: colors.textPrimary }]}>
              {STRINGS.onboarding.questionnaire.yearsGambling}
            </Text>
            <View style={styles.sliderContainer}>
              <Text style={[styles.sliderValue as any, { color: colors.primary }]}>
                {Math.round(answers.yearsGambling || 0)} years
              </Text>
              <View style={styles.sliderWrapper}>
                <View 
                  style={[styles.sliderTrack, { backgroundColor: colors.textSecondary + '30' }]}
                  onLayout={(e) => {
                    sliderWidth.current = e.nativeEvent.layout;
                  }}
                  {...yearsPanResponder.panHandlers}
                >
                  <View
                    style={[
                      styles.sliderFill,
                      {
                        backgroundColor: colors.primary,
                        width: `${((answers.yearsGambling || 0) / 50) * 100}%` as any,
                      },
                    ]}
                  />
                </View>
                <View
                  style={[
                    styles.sliderThumb,
                    {
                      left: `${((answers.yearsGambling || 0) / 50) * 100}%` as any,
                      backgroundColor: colors.primary,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        );

      case 1:
        return (
          <View style={styles.slide}>
            <Text style={[styles.question as any, { color: colors.textPrimary }]}>
              {STRINGS.onboarding.questionnaire.frequency}
            </Text>
            <View style={styles.sliderContainer}>
              <Text style={[styles.sliderValue as any, { color: colors.secondary }]}>
                {Math.round(answers.frequencyPerWeek || 0)} times/week
              </Text>
              <View style={styles.sliderWrapper}>
                <View 
                  style={[styles.sliderTrack, { backgroundColor: colors.textSecondary + '30' }]}
                  onLayout={(e) => {
                    sliderWidth.current = e.nativeEvent.layout;
                  }}
                  {...frequencyPanResponder.panHandlers}
                >
                  <View
                    style={[
                      styles.sliderFill,
                      {
                        backgroundColor: colors.secondary,
                        width: `${((answers.frequencyPerWeek || 0) / 7) * 100}%` as any,
                      },
                    ]}
                  />
                </View>
                <View
                  style={[
                    styles.sliderThumb,
                    {
                      left: `${((answers.frequencyPerWeek || 0) / 7) * 100}%` as any,
                      backgroundColor: colors.secondary,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.slide}>
            <Text style={[styles.question as any, { color: colors.textPrimary }]}>
              {STRINGS.onboarding.questionnaire.monthlySpend}
            </Text>
            <TextInput
              style={[styles.input, { 
                color: colors.textPrimary,
                backgroundColor: colors.surfaceLight,
                borderColor: colors.border
              }]}
              placeholder={STRINGS.onboarding.questionnaire.spendPlaceholder}
              placeholderTextColor={colors.textSecondary}
              keyboardType="decimal-pad"
              value={answers.monthlySpend?.toString()}
              onChangeText={(value: string) =>
                setAnswers({ ...answers, monthlySpend: parseFloat(value) || 0 })
              }
            />
          </View>
        );

      case 3:
        return (
          <View style={styles.slide}>
            <Text style={[styles.question as any, { color: colors.textPrimary }]}>
              {STRINGS.onboarding.questionnaire.motivation}
            </Text>
            <TextInput
              style={[styles.input, styles.multilineInput, { 
                color: colors.textPrimary,
                backgroundColor: colors.surfaceLight,
                borderColor: colors.border
              }]}
              placeholder={STRINGS.onboarding.questionnaire.motivationPlaceholder}
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              value={answers.motivation || ''}
              onChangeText={(value: string) =>
                setAnswers({ ...answers, motivation: value })
              }
              textAlignVertical="top"
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBarBackground, { backgroundColor: colors.border }]}>
            <View
              style={[styles.progressBar, { 
                backgroundColor: colors.primary,
                width: `${((slide + 1) / 4) * 100}%` as any 
              }]}
            />
          </View>
          <Text style={[styles.progressText as any, { color: colors.textSecondary }]}>
            Step {slide + 1} of 4
          </Text>
        </View>

        {/* Slide Content */}
        {renderSlide()}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          label={STRINGS.onboarding.questionnaire.previous}
          variant="ghost"
          size="md"
          fullWidth
          onPress={handleBack}
        />
        <View style={styles.buttonSpacer} />
        <Button
          label={slide === 3 ? 'Next' : STRINGS.onboarding.questionnaire.next}
          variant="primary"
          size="md"
          fullWidth
          disabled={!isCurrentSlideValid()}
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  progressContainer: {
    marginBottom: SPACING.xl,
  },
  progressBarBackground: {
    height: 6,
    borderRadius: 3,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  progressText: {
    ...TYPOGRAPHY.bodySmall,
    textAlign: 'center',
  },
  slide: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  question: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.lg,
  },
  sliderContainer: {
    marginVertical: SPACING.lg,
  },
  sliderWrapper: {
    position: 'relative',
    paddingVertical: SPACING.lg,
  },
  sliderTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    borderRadius: 4,
  },
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    top: -6,
    marginLeft: -12,
  },
  sliderValue: {
    ...TYPOGRAPHY.body,
    fontWeight: '600' as const,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 120,
    paddingTop: SPACING.md,
  },
  buttonContainer: {
    flexDirection: 'column',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    gap: SPACING.md,
  },
  buttonSpacer: {
    width: SPACING.md,
  },
});
