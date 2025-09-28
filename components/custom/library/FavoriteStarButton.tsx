import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { useAppState } from '@/state/useAppState'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { useShallow } from 'zustand/shallow'

interface FavoriteStarButtonProps {
  fallacyId: string
  onToggle?: (fallacyId: string, isFavorite: boolean) => void
}

export default function FavoriteStarButton({ 
  fallacyId, 
  onToggle 
}: FavoriteStarButtonProps) {
  const { colors, colorScheme } = useSystemTheme()

  // zustand shallow state listeners
  const { isParadoxFavorite, toggleFavoriteParadox } = useAppState(
    useShallow((state) => ({ 
      isParadoxFavorite: state.isParadoxFavorite, 
      toggleFavoriteParadox: state.toggleFavoriteParadox 
    }))
  )
  const [scaleAnim] = useState(new Animated.Value(1))
  const [isToggling, setIsToggling] = useState(false)

  // Get current favorite status from global state (instant lookup)
  const currentlyFavorite = isParadoxFavorite(fallacyId)

  const handleToggle = async () => {

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
      const newStatus = await toggleFavoriteParadox(fallacyId)      
      
      // Call callback if provided
      onToggle?.(fallacyId, newStatus)
      
    } catch (error) {
      logger.error('❌ Error toggling favorite status:', error)
    } finally {
      setIsToggling(false)
    }
  }

  // 🌟 FAVORITE STATE - GOLDEN GRADIENT!
  if (currentlyFavorite) {
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
              ? ['#FFD700', '#FFA500'] // Golden gradient for light mode
              : ['#FFD700', '#FFC107']  // Brighter gold for dark mode
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Text style={[styles.icon, { 
              color: colorScheme !== 'dark' ? '#8B4513' : '#000' 
            }]}>
              ⭐
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  // ☆ NOT FAVORITE STATE - SIMPLE OUTLINE
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
          ☆
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
    // shadowColor: '#FFD700', // Golden shadow for championship effect!
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.3,
    // shadowRadius: 4,
    // elevation: 4,
  },
  
  icon: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})