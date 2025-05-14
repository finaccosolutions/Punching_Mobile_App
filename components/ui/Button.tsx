import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  const { colors } = useTheme();

  const variantStyles = {
    primary: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      textColor: colors.white,
    },
    secondary: {
      backgroundColor: colors.secondary,
      borderColor: colors.secondary,
      textColor: colors.white,
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: colors.primary,
      textColor: colors.primary,
    },
    danger: {
      backgroundColor: colors.error,
      borderColor: colors.error,
      textColor: colors.white,
    },
  };

  const sizeStyles = {
    small: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      fontSize: 14,
    },
    medium: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      fontSize: 16,
    },
    large: {
      paddingVertical: 16,
      paddingHorizontal: 32,
      fontSize: 18,
    },
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  const buttonStyles = [
    styles.button,
    {
      backgroundColor: currentVariant.backgroundColor,
      borderColor: currentVariant.borderColor,
      paddingVertical: currentSize.paddingVertical,
      paddingHorizontal: currentSize.paddingHorizontal,
      opacity: disabled ? 0.6 : 1,
      width: fullWidth ? '100%' : undefined,
    },
    style,
  ];

  const textStyles = [
    styles.text,
    {
      color: currentVariant.textColor,
      fontSize: currentSize.fontSize,
      fontFamily: 'Inter-Medium',
    },
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={currentVariant.textColor} size="small" />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text style={textStyles}>{title}</Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  text: {
    textAlign: 'center',
  },
});