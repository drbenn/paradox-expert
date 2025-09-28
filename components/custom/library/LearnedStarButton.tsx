import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { useAppState } from '@/state/useAppState'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useState } from 'react'
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { useShallow } from 'zustand/shallow'

interface LearnedStarButtonProps {
  fallacyId: string
  onToggle?: (fallacyId: string, isLearned: boolean) => void
}

export default function LearnedStarButton({ 
  fallacyId, 
  onToggle 
}: LearnedStarButtonProps) {
  const { colors, colorScheme } = useSystemTheme()

  // zustand shallow state listeners
  const { isFallacyLearned, toggleFallacyLearned } = useAppState(
    useShallow((state) => ({ 
      isFallacyLearned: state.isFallacyLearned, 
      toggleFallacyLearned: state.toggleFallacyLearned 
    }))
  )

  const [scaleAnim] = useState(new Animated.Value(1))
  const [isToggling, setIsToggling] = useState(false)

  // Get current learned status from global state (instant lookup)
  const currentlyLearned = isFallacyLearned(fallacyId)

  const handleToggle = async () => {
    // if (!learnedFallaciesLoaded || isToggling) return

    try {
      setIsToggling(true)
      
      // CHAMPIONSHIP ANIMATION!
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start()

      // Toggle in global state (which updates database)
      const newStatus = await toggleFallacyLearned(fallacyId)

      // Call callback if provided
      onToggle?.(fallacyId, newStatus)
      
      
    } catch (error) {
      logger.error('❌ Error toggling learned status:', error)
    } finally {
      setIsToggling(false)
    }
  }

  // ✓ MASTERED STATE - BLUE GRADIENT!
  if (currentlyLearned) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={styles.container}
          onPress={handleToggle}
          activeOpacity={0.8}
          disabled={isToggling}
        >
          <LinearGradient
            colors={colorScheme !== 'dark' 
              ? [colors.primary, '#c44569'] 
              : ['#3b82f6', '#6366f1']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Text style={[styles.icon, { color: 'white' }]}>
              ✓
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  // ○ NOT MASTERED STATE - SIMPLE OUTLINE
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.container, { 
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: SHAPES.cardBorderWidth,
        }]}
        onPress={handleToggle}
        activeOpacity={0.8}
        disabled={isToggling}
      >
        <Text style={[styles.icon, { color: colors.textSecondary }]}>
          ○
        </Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 52,
    height: 52,
    borderRadius: SHAPES.borderRadius + 2,
    justifyContent: 'center',
    alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.15,
    // shadowRadius: 4,
    // elevation: 4,
  },
  
  gradient: {
    width: 52,
    height: 52,
    borderRadius: SHAPES.borderRadius + 2,
    justifyContent: 'center',
    alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
    // elevation: 4,
  },
  
  icon: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})