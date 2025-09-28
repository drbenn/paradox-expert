import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

// =================================================================
// 🏆 : Enhanced Card Component with Championship Variants
// =================================================================

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
  variant?: 'default' | 'stat' | 'minimal' | 'elevated' | 'tight'
  padding?: number
  margin?: number
  centerContent?: boolean
  shadow?: boolean
  paddingVerical?: number
}

export default function Card({ 
  children, 
  style,
  variant = 'default',
  padding,
  margin,
  centerContent = false,
  shadow = false
}: CardProps) {
  const { colors } = useSystemTheme()

  // 🎯 MACHO MAN: Get variant-specific styles
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'stat':
        return {
          flex: 1,
          padding: padding ?? 18,
          alignItems: 'center',
          marginBottom: margin ?? 0, // Stats usually don't need bottom margin
        }
      
      case 'minimal':
        return {
          padding: padding ?? 12,
          marginBottom: margin ?? 12,
        }

      case 'tight':
        return {
          padding: padding ?? 12,
          marginBottom: margin ?? 16,
        }
      
      case 'elevated':
        return {
          padding: padding ?? 20,
          marginBottom: margin ?? 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 6,
        }
      
      case 'default':
      default:
        return {
          padding: padding ?? 20,
          marginBottom: margin ?? 20,
        }
    }
  }

  // 🚨 CHAMPIONSHIP: Apply additional shadow if requested
  const shadowStyles = shadow ? {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  } : {}

  return (
    <View 
      style={[
        styles.baseCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          ...(centerContent && { alignItems: 'center', justifyContent: 'center' }),
        },
        getVariantStyles(),
        shadowStyles,
        style, // Custom style overrides come last
      ]}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  baseCard: {
    borderRadius: SHAPES.borderRadius,
    borderWidth: SHAPES.cardBorderWidth,
  },
})