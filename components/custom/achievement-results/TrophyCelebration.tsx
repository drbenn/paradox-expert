import SHAPES from '@/constants/Shapes'
import { EarnedAchievement } from '@/types/achievement.types'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useRef } from 'react'
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

interface TrophyCelebrationProps {
  achievement: EarnedAchievement
  onContinue: () => void
  isLastAchievement: boolean
  currentIndex: number
  totalAchievements: number
  isTransitioning: boolean
}

export default function TrophyCelebration({
  achievement,
  onContinue,
  isLastAchievement,
  currentIndex,
  totalAchievements,
  isTransitioning
}: TrophyCelebrationProps) {
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

  const getGradientColors = (): [string, string, ...string[]] => {
    switch (achievement.award_level) {
      case 'small_trophy':
        return ['#F59E0B', '#D97706', '#B45309']
      case 'large_trophy':
        return ['#10B981', '#059669', '#047857']
      default:
        return ['#F59E0B', '#D97706', '#B45309']
    }
  }

  const getTrophyEmoji = () => {
    switch (achievement.award_level) {
      case 'small_trophy':
        return '🏆'
      case 'large_trophy':
        return '🏆✨'
      default:
        return '🏆'
    }
  }

  const getCelebrationTitle = () => {
    if (totalAchievements > 1) {
      return `TROPHY EARNED! (${currentIndex}/${totalAchievements})`
    }
    return 'TROPHY EARNED!'
  }

  const getCelebrationMessage = () => {
    const level = (achievement.award_level || 'small_trophy').replace('_', ' ').toUpperCase()
    const score = achievement.score || 0
    const tier = achievement.tier || 1
    
    if (achievement.is_unit_test) {
      return `You earned a ${level} mastering Tier ${tier}!\n\nUnit Test Score: ${score}%`
    } else {
      const quizNumber = achievement.quiz_number || 1
      return `You earned a ${level} in Tier ${tier} Quiz ${quizNumber}!\n\nScore: ${score}%`
    }
  }

  const getMotivationalMessage = () => {
    const { award_level, score = 0, is_unit_test } = achievement
    
    if (is_unit_test) {
      if (award_level === 'small_trophy') {
        return `Great job! You passed the unit test with ${score}%.\n\nYou've demonstrated good understanding of this tier's fallacies. Retake to score 85%+ and earn the LARGE TROPHY with maximum recognition!`
      } else {
        return `LEGENDARY performance! You mastered this tier with ${score}%!\n\nYou've earned the ultimate Large Trophy recognition. This represents complete mastery of these logical fallacies!`
      }
    } else {
      return `Outstanding achievement! You scored ${score}% on this assessment.\n\nTrophies represent exceptional performance and dedication to learning. Keep up this excellent work!`
    }
  }

  const getButtonText = () => {
    if (isLastAchievement) {
      return 'See Results'
    }
    return `Continue (${currentIndex}/${totalAchievements})`
  }

  const getUpgradeHint = () => {
    const { award_level, score = 0, is_unit_test } = achievement
    
    if (is_unit_test && award_level === 'small_trophy' && score < 85) {
      return {
        target: 'Large Trophy 🏆✨',
        scoreNeeded: 85,
        currentScore: score
      }
    }
    return null
  }

  const upgradeHint = getUpgradeHint()

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
          
          <Text style={styles.tierInfo}>
            Tier {achievement.tier} • {achievement.is_unit_test ? 'Unit Test' : `Quiz ${achievement.quiz_number}`}
          </Text>
        </View>

        {/* Trophy Display */}
        <View style={styles.trophyContainer}>
          <Animated.View
            style={[
              styles.trophyIconContainer,
              {
                opacity: opacityAnim,
                transform: [
                  { scale: scaleAnim },
                  {
                    translateY: bounceAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -15]
                    })
                  }
                ]
              }
            ]}
          >
            <Text style={styles.giantTrophyIcon}>{getTrophyEmoji()}</Text>
          </Animated.View>
        </View>

        {/* Achievement Message */}
        <Animated.View
          style={[
            styles.messageContainer,
            { opacity: opacityAnim }
          ]}
        >
          <Text style={styles.achievementMessage}>
            {getCelebrationMessage()}
          </Text>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>Score: {achievement.score}%</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${achievement.score ? achievement.score : 100}%` }
                ]} 
              />
            </View>
          </View>
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

        {/* Upgrade Hint */}
        {upgradeHint && (
          <Animated.View
            style={[
              styles.upgradeContainer,
              { opacity: opacityAnim }
            ]}
          >
            <Text style={styles.upgradeTitle}>Next Challenge:</Text>
            <View style={styles.upgradeContent}>
              <Text style={styles.upgradeEmoji}>🏆✨</Text>
              <View style={styles.upgradeText}>
                <Text style={styles.upgradeTarget}>
                  {upgradeHint.target}
                </Text>
                <Text style={styles.upgradeRequirement}>
                  Retake to score {upgradeHint.scoreNeeded}%+
                </Text>
                <Text style={styles.upgradeProgress}>
                  You need {upgradeHint.scoreNeeded - upgradeHint.currentScore}% more!
                </Text>
              </View>
            </View>
          </Animated.View>
        )}

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
    fontSize: 32,
    fontWeight: '900',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 2,
  },
  tierInfo: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  trophyContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  trophyIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  giantTrophyIcon: {
    fontSize: 120,
    textAlign: 'center',
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  achievementMessage: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 28,
  },
  scoreContainer: {
    alignItems: 'center',
    width: '100%',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '800',
    color: 'white',
    marginBottom: 12,
  },
  progressBar: {
    width: '80%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 3,
  },
  motivationContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: SHAPES.borderRadius,
    padding: 24,
    marginBottom: 30,
  },
  motivationText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
  },
  upgradeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: SHAPES.borderRadius,
    padding: 24,
    marginBottom: 30,
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  upgradeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upgradeEmoji: {
    fontSize: 36,
    marginRight: 20,
  },
  upgradeText: {
    flex: 1,
  },
  upgradeTarget: {
    fontSize: 18,
    fontWeight: '800',
    color: 'white',
    marginBottom: 6,
  },
  upgradeRequirement: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  upgradeProgress: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
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
    fontSize: 20,
    fontWeight: '900',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 1,
  },
})