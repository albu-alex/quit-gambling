/**
 * StatBox Component - Displays a stat with label
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../constants/config';
import { useEffectiveColorScheme } from '../../hooks/useEffectiveColorScheme';

interface StatBoxProps {
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
}

export const StatBox: React.FC<StatBoxProps> = ({
  label,
  value,
  icon,
  color = COLORS.light.primary,
}) => {
  const colorScheme = useEffectiveColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <View style={[styles.container as any, { 
      borderColor: color,
      backgroundColor: colors.surfaceLight 
    }]}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={[styles.value as any, { color: colors.textPrimary }]}>{value}</Text>
      <Text style={[styles.label as any, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 110,
  },
  icon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  value: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.xs,
  },
  label: {
    ...TYPOGRAPHY.bodySmall,
    textAlign: 'center',
  },
});
