import { RelativePathString, router } from 'expo-router'

import BadgeCelebration from '@/components/custom/achievement-results/BadgeCelebration'
import MedalCelebration from '@/components/custom/achievement-results/MedalCelebration'
import TrophyCelebration from '@/components/custom/achievement-results/TrophyCelebration'
import { useAppState } from '@/state/useAppState'
import { EarnedAchievement } from '@/types/achievement.types'
import React, { useEffect, useState } from 'react'
import {
  Animated,
  BackHandler,
  SafeAreaView,
  StyleSheet,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function QuizAchievementScreen() {
  const insets = useSafeAreaInsets()
  const achievementsForPostQuizRouting = useAppState((state) => state.achievementsForPostQuizRouting)
  
  // Local state for managing the celebration sequence
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  // Animation for transitions
  const fadeAnim = new Animated.Value(1)
  const slideAnim = new Animated.Value(0)

  // Prevent back navigation during celebrations
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true // Prevent back navigation
    })
    
    return () => backHandler.remove()
  }, [])

  // Safety check - if no achievements, go directly to results
  useEffect(() => {
    if (!achievementsForPostQuizRouting || achievementsForPostQuizRouting.length === 0) {
      router.push('/screens/quiz/results' as RelativePathString)
    }
  }, [achievementsForPostQuizRouting])

  const handleContinue = () => {
    if (isTransitioning) return // Prevent multiple clicks during transition
    
    const isLastAchievement = currentIndex >= (achievementsForPostQuizRouting?.length ?? 0) - 1
    
    if (isLastAchievement) {
      // Final continue - go to results
      router.push('/screens/quiz/results' as RelativePathString)
      return
    }
    
    // Transition to next achievement
    setIsTransitioning(true)
    
    // Fade out current
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 200,
        useNativeDriver: true
      })
    ]).start(() => {
      // Update index
      setCurrentIndex(currentIndex + 1)
      
      // Reset position for fade in
      slideAnim.setValue(50)
      
      // Fade in next
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        })
      ]).start(() => {
        setIsTransitioning(false)
      })
    })
  }

  const renderCelebrationComponent = (achievement: EarnedAchievement) => {
    const isLastAchievement = currentIndex >= (achievementsForPostQuizRouting?.length ?? 0) - 1
    const totalAchievements = achievementsForPostQuizRouting?.length ?? 0
    
    const commonProps = {
      achievement,
      onContinue: handleContinue,
      isLastAchievement,
      currentIndex: currentIndex + 1, // 1-based for display
      totalAchievements,
      isTransitioning
    }

    switch (achievement.type) {
      case 'badge':
        return <BadgeCelebration {...commonProps} />
      case 'trophy':
        return <TrophyCelebration {...commonProps} />
      case 'medal':
        return <MedalCelebration {...commonProps} />
      default:
        // Fallback - shouldn't happen but handle gracefully
        return <BadgeCelebration {...commonProps} />
    }
  }

  // Safety check
  if (!achievementsForPostQuizRouting || achievementsForPostQuizRouting.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.centerContainer}>
          {/* Loading or redirect happening */}
        </View>
      </SafeAreaView>
    )
  }

  const currentAchievement = achievementsForPostQuizRouting[currentIndex]
  
  if (!currentAchievement) {
    // Shouldn't happen, but handle gracefully
    router.push('/screens/quiz/results' as RelativePathString)
    return null
  }

  return (
    <SafeAreaView style={[styles.container]}>
      <Animated.View
        style={[
          styles.celebrationContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }]
          }
        ]}
      >
        {renderCelebrationComponent(currentAchievement)}
      </Animated.View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  celebrationContainer: {
    flex: 1
  }
})