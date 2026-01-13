/**
 * CheckInCard Component - Daily check-in card
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/config';
import { useEffectiveColorScheme } from '../../hooks/useEffectiveColorScheme';
import { Card } from '../atoms/Card';

interface CheckInCardProps {
  onCheckIn: (gambled: boolean) => void;
  disabled?: boolean;
}

export const CheckInCard: React.FC<CheckInCardProps> = ({
  onCheckIn,
  disabled = false,
}) => {
  const colorScheme = useEffectiveColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <Card variant="elevated" padding={SPACING.lg}>
      <Text style={[styles.title as any, { color: colors.textPrimary }]}>Daily Check-In</Text>
      <Text style={[styles.subtitle as any, { color: colors.textSecondary }]}>Did you gamble today?</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.noButton,
            {
              borderColor: colors.success,
              backgroundColor: colorScheme === 'dark' ? '#064E3B' : '#F0FDF4',
            },
          ]}
          onPress={() => onCheckIn(false)}
          disabled={disabled}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonEmoji}>💪</Text>
          <Text style={[styles.buttonText as any, { color: colors.textPrimary }]}>
            No, I stayed strong
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.yesButton,
            {
              borderColor: colors.danger,
              backgroundColor: colorScheme === 'dark' ? '#7F1D1D' : '#FEF2F2',
            },
          ]}
          onPress={() => onCheckIn(true)}
          disabled={disabled}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonEmoji}>😔</Text>
          <Text style={[styles.buttonText as any, { color: colors.textPrimary }]}>
            Yes, I gambled
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.footer as any, { color: colors.textTertiary }]}>
        Recovery is a journey, not perfection. Every day is a new chance.
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginVertical: SPACING.lg,
  },
  button: {
    flex: 1,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
  },
  noButton: {
    // backgroundColor is set dynamically in component
  },
  yesButton: {
    // backgroundColor is set dynamically in component
  },
  buttonEmoji: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  buttonText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    ...TYPOGRAPHY.caption,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: SPACING.md,
  },
});
