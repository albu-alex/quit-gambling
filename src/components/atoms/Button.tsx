/**
 * Button Component - Reusable button with variants
 */

import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/config';
import { useEffectiveColorScheme } from '../../hooks/useEffectiveColorScheme';

interface ButtonProps {
  onPress: () => void;
  label: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  label,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
}) => {
  const colorScheme = useEffectiveColorScheme();
  const colors = COLORS[colorScheme === 'dark' ? 'dark' : 'light'];
  
  const buttonStyle = [
    styles.button,
    styles[`button_${variant}`],
    styles[`size_${size}`],
    disabled && styles.disabled,
    fullWidth && styles.fullWidth,
    {
      backgroundColor: getButtonBackgroundColor(variant, colors),
      borderColor: variant === 'ghost' ? colors.primary : undefined,
    },
  ] as ViewStyle[];

  const textStyle = [
    styles.text,
    styles[`text_${variant}`],
    styles[`textSize_${size}`],
    {
      color: getButtonTextColor(variant, colors),
    },
  ] as TextStyle[];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'ghost' ? colors.primary : colors.background}
        />
      ) : (
        <Text style={textStyle}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  button_primary: {},
  button_secondary: {},
  button_danger: {},
  button_ghost: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  size_sm: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  size_md: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  size_lg: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  text_primary: {},
  text_secondary: {},
  text_danger: {},
  text_ghost: {},
  textSize_sm: {
    fontSize: 12,
  },
  textSize_md: {
    fontSize: 14,
  },
  textSize_lg: {
    fontSize: 16,
  },
});

function getButtonBackgroundColor(variant: string, colors: typeof COLORS.light): string {
  switch (variant) {
    case 'primary':
      return colors.primary;
    case 'secondary':
      return colors.secondary;
    case 'danger':
      return colors.danger;
    case 'ghost':
      return 'transparent';
    default:
      return colors.primary;
  }
}

function getButtonTextColor(variant: string, colors: typeof COLORS.light): string {
  switch (variant) {
    case 'ghost':
      return colors.primary;
    default:
      return colors.background;
  }
}
