import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export default function Card({
  children,
  style,
  variant = 'elevated',
  padding = 'medium',
}: CardProps) {
  const { colors, isDark } = useTheme();

  const paddingValues = {
    none: 0,
    small: 8,
    medium: 16,
    large: 24,
  };

  const variantStyles = {
    elevated: {
      backgroundColor: colors.cardBackground,
      borderWidth: 0,
      shadowColor: isDark ? colors.black : colors.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.4 : 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    outlined: {
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    filled: {
      backgroundColor: colors.cardBackgroundAlt,
      borderWidth: 0,
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
  };

  const cardStyles = [
    styles.card,
    {
      backgroundColor: variantStyles[variant].backgroundColor,
      borderWidth: variantStyles[variant].borderWidth,
      borderColor: variantStyles[variant].borderColor,
      shadowColor: variantStyles[variant].shadowColor,
      shadowOffset: variantStyles[variant].shadowOffset,
      shadowOpacity: variantStyles[variant].shadowOpacity,
      shadowRadius: variantStyles[variant].shadowRadius,
      elevation: variantStyles[variant].elevation,
      padding: paddingValues[padding],
    },
    style,
  ];

  return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
});