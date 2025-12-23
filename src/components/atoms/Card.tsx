/**
 * Card Component - Reusable card container
 */

import React from 'react';
import { StyleSheet, View, ViewStyle, useColorScheme } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/config';

interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'flat';
  style?: ViewStyle;
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  style,
  padding = SPACING.lg,
}) => {
  const colorScheme = useColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  const cardStyle = [
    styles.card,
    {
      backgroundColor: colors.background,
      borderColor: colors.border,
    },
    variant === 'flat' && {
      backgroundColor: colors.surfaceLight,
      borderWidth: 1,
    },
    { padding },
    style,
  ];

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
