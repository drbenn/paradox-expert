import SHAPES from '@/constants/Shapes'
import { EarnedAchievement } from '@/types/achievement.types'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useRef } from 'react'
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

interface BadgeCelebrationProps {
  achievement: EarnedAchievement
  onContinue: () => void
  isLastAchievement: boolean
  currentIndex: number
  totalAchievements: number
  isTransitioning: boolean
}

export default function BadgeCelebration({
  achievement,
  onContinue,
  isLastAchievement,
  currentIndex,
  totalAchievements,
  isTransitioning
}: BadgeCelebrationProps) {
  // Animation refs
  const scaleAnim = useRef(new Animated.Value(0.3)).current
  const opacityAnim = useRef(new Animated.Value(0)).current
  const bounceAnim = useRef(new Animated.Value(0)).current

  // Start entrance animation
  useEffect(() => {
    // Reset animations
    scaleAnim.setValue(0.3)
    opacityAnim.setValue(0)
    bounceAnim.setValue(0)

    // Start entrance animation
    setTimeout(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 8
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        })
      ]).start(() => {
        // Start subtle bounce animation
        Animated.loop(
          Animated.sequence([
            Animated.timing(bounceAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true
            }),
            Animated.timing(bounceAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true
            })
          ])
        ).start()
      })
    }, 200)
  }, [achievement.id, scaleAnim, opacityAnim, bounceAnim])

  const getBadgeRarityColor = (rarity: string): string => {
    const colors = {
      common: '#10B981',
      rare: '#3B82F6', 
      epic: '#8B5CF6',
      legendary: '#F59E0B'
    }
    return colors[rarity as keyof typeof colors] || colors.common
  }

  const getGradientColors = (): [string, string, ...string[]] => {
    switch (achievement.rarity) {
      case 'common':
        return ['#10B981', '#059669', '#047857']
      case 'rare':
        return ['#3B82F6', '#2563EB', '#1D4ED8']
      case 'epic':
        return ['#8B5CF6', '#7C3AED', '#6D28D9']
      case 'legendary':
        return ['#F59E0B', '#D97706', '#B45309']
      default:
        return ['#10B981', '#059669', '#047857']
    }
  }

  const getCelebrationTitle = () => {
    if (totalAchievements > 1) {
      return `BADGE EARNED! (${currentIndex}/${totalAchievements})`
    }
    return 'BADGE EARNED!'
  }

  const getMotivationalMessage = () => {
    switch (achievement.rarity) {
      case 'common':
        return `Great start! Every badge represents growth and dedication. Keep pushing your limits!`
      case 'rare':
        return `Impressive dedication! You're showing real commitment to mastering fallacies. This level of consistency sets you apart!`
      case 'epic':
        return `EXTRAORDINARY achievement! You're reaching elite levels of expertise. Few reach this level of mastery!`
      case 'legendary':
        return `LEGENDARY status achieved! You are among the greatest paradox masters! This is the pinnacle of achievement!`
      default:
        return `Keep pushing your limits and achieving greatness!`
    }
  }

  const getButtonText = () => {
    if (isLastAchievement) {
      return 'See Results'
    }
    return `Continue (${currentIndex}/${totalAchievements})`
  }

  const rarityColor = getBadgeRarityColor(achievement.rarity)

  return (
    <LinearGradient
      colors={getGradientColors()}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBackground}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Animated.Text
            style={[
              styles.celebrationTitle,
              {
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            {getCelebrationTitle()}
          </Animated.Text>
          
          <Text style={styles.sourceText}>
            Badge Achievement
          </Text>
        </View>

        {/* Badge Display */}
        <View style={styles.badgeContainer}>
          <Animated.View
            style={[
              styles.badgeIconContainer,
              {
                opacity: opacityAnim,
                transform: [
                  { scale: scaleAnim },
                  {
                    translateY: bounceAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -10]
                    })
                  }
                ]
              }
            ]}
          >
            <Text style={styles.giantBadgeIcon}>{achievement.emoji}</Text>
          </Animated.View>
        </View>

        {/* Badge Details */}
        <Animated.View
          style={[
            styles.badgeDetailsContainer,
            { opacity: opacityAnim }
          ]}
        >
          <View style={[styles.rarityBadge, { backgroundColor: rarityColor }]}>
            <Text style={styles.rarityBadgeText}>
              {achievement.rarity.toUpperCase()}
            </Text>
          </View>
          
          <Text style={styles.badgeTitle}>
            {achievement.title}
          </Text>
          
          <Text style={styles.badgeDescription}>
            {achievement.description}
          </Text>
        </Animated.View>

        {/* Motivational Message */}
        <Animated.View
          style={[
            styles.motivationContainer,
            { opacity: opacityAnim }
          ]}
        >
          <Text style={styles.motivationText}>
            {getMotivationalMessage()}
          </Text>
        </Animated.View>

        {/* Action Button */}
        <Animated.View
          style={[
            styles.buttonContainer,
            { opacity: opacityAnim }
          ]}
        >
          <TouchableOpacity
            style={[styles.continueButton, { opacity: isTransitioning ? 0.5 : 1 }]}
            onPress={onContinue}
            disabled={isTransitioning}
          >
            <Text style={styles.continueButtonText}>
              {getButtonText()}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    minHeight: screenHeight,
    marginTop: 20,
    justifyContent: 'flex-start',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  celebrationTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1,
  },
  sourceText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  badgeIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  giantBadgeIcon: {
    fontSize: 100,
    textAlign: 'center',
  },
  badgeDetailsContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  rarityBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  rarityBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  badgeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  badgeDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  motivationContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: SHAPES.borderRadius,
    padding: 24,
    marginBottom: 40,
  },
  motivationText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    marginBottom: 40,
  },
  continueButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: SHAPES.borderRadius,
    padding: 16,
    borderWidth: SHAPES.buttonBorderWidth,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 1,
  },
})