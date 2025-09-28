import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'gradient' | 'glass'

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: ButtonVariant
  style?: ViewStyle
  textStyle?: TextStyle
  disabled?: boolean
  padding?: number
  marginTop?: number
  fullWidth?: boolean
}

export default function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  style, 
  textStyle,
  disabled = false,
  padding,
  marginTop,
  fullWidth = false,
}: ButtonProps) {
  const { colors } = useSystemTheme()
  
  const baseStyle: ViewStyle = {
    borderRadius: SHAPES.borderRadius,
    paddingVertical: padding ? padding : 0,
    // paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: marginTop ? marginTop : 0,
    minHeight: 50,
    ...(fullWidth && { alignSelf: 'stretch' }),
  }

  const baseTextStyle: TextStyle = {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  }

  const handlePress = () => {
    if (!disabled) {
      onPress()
    }
  }

  // Gradient button variant
  if (variant === 'gradient' && !disabled) {
    return (
      <TouchableOpacity
        style={[baseStyle, style]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[colors.primary, '#c44569']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            baseStyle,
            {
              marginTop: 0,
              // shadowColor: colors.primary,
              // shadowOffset: { width: 0, height: 8 },
              // shadowOpacity: 0.3,
              // shadowRadius: 12,
              // elevation: 8,
            }
          ]}
        >
          <Text style={[baseTextStyle, { color: colors.background }, textStyle]}>
            {title}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  // Glass button variant
  if (variant === 'glass') {
    return (
      <TouchableOpacity
        style={[
          baseStyle,
          {
            backgroundColor: disabled ? colors.border : 'rgba(255, 255, 255, 0.05)',
            borderWidth: SHAPES.buttonBorderWidth,
            borderColor: disabled ? colors.border : 'rgba(255, 255, 255, 0.1)',
            // shadowColor: '#000',
            // shadowOffset: { width: 0, height: 4 },
            // shadowOpacity: 0.1,
            // shadowRadius: 8,
            // elevation: 4,
          },
          style
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <Text style={[
          baseTextStyle,
          { color: disabled ? colors.textSecondary : colors.text },
          textStyle
        ]}>
          {title}
        </Text>
      </TouchableOpacity>
    )
  }

  // Standard button variants
  const getButtonStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? colors.border : colors.primary,
          // shadowColor: colors.primary,
          // shadowOffset: { width: 0, height: 4 },
          // shadowOpacity: disabled ? 0 : 0.3,
          // shadowRadius: 8,
          // elevation: disabled ? 0 : 4,
        }
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? colors.border : colors.surface,
          borderWidth: SHAPES.buttonBorderWidth,
          borderColor: disabled ? colors.border : colors.border,
          // shadowColor: '#000',
          // shadowOffset: { width: 0, height: 2 },
          // shadowOpacity: 0.1,
          // shadowRadius: 4,
          // elevation: 2,
        }
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: SHAPES.buttonBorderWidth + 1,
          borderColor: disabled ? colors.border : colors.primary,
        }
      default:
        return baseStyle
    }
  }

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'primary':
        return {
          ...baseTextStyle,
          color: disabled ? colors.textSecondary : colors.background,
          fontWeight: '700',
        }
      case 'secondary':
        return {
          ...baseTextStyle,
          color: disabled ? colors.textSecondary : colors.text,
        }
      case 'outline':
        return {
          ...baseTextStyle,
          color: disabled ? colors.textSecondary : colors.primary,
          fontWeight: '700',
        }
      default:
        return baseTextStyle
    }
  }

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Text style={[getTextStyle(), textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}