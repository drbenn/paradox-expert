import DetailTutorialStage from '@/components/custom/tutorial/DetailTutorialStage'
import LibraryTutorialStage from '@/components/custom/tutorial/LibraryTutorialStage'
import ProgressTutorialStage from '@/components/custom/tutorial/ProgressTutorialStage'
import QuizTutorialStage from '@/components/custom/tutorial/QuizTutorialStage'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { useAppState } from '@/state/useAppState'
import { router } from 'expo-router'
import React, { useRef, useState } from 'react'
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'



export default function TutorialScreen() {
  const insets = useSafeAreaInsets()
  const [currentStage, setCurrentStage] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const { colors, colorScheme } = useSystemTheme()

  // Animation for transitions
  const fadeAnim = useRef(new Animated.Value(1)).current
  const slideAnim = useRef(new Animated.Value(0)).current

  const totalStages = 4

  const isInitOnboardingcComplete = useAppState((state) => state.isInitOnboardingcComplete)
  const setOnBoardingComplete = useAppState((state) => state.setOnBoardingComplete)

  const handleContinue = () => {
    if (isTransitioning) return

    const isLastStage = currentStage >= totalStages - 1

    if (isLastStage) {
      if (!isInitOnboardingcComplete) {
        setOnBoardingComplete()
      }
      // Tutorial complete - go back to wherever user came from
      router.back()
      return
    }

    // Transition to next stage
    setIsTransitioning(true)

    // Fade out current stage
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
      // Update stage
      setCurrentStage(currentStage + 1)

      // Reset position for fade in
      slideAnim.setValue(50)

      // Fade in next stage
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

  const renderProgressDots = () => {
    return (
      <View style={styles.progressContainer}>
        {Array.from({ length: totalStages }).map((_, index) => {
          const isCompleted = index < currentStage
          const isCurrent = index === currentStage
          
          return (
            <View
              key={index}
              style={[
                styles.progressDot,
                isCompleted && { backgroundColor: colors.primary},
                isCurrent && { backgroundColor: colors.primary}
              ]}
            />
          )
        })}
      </View>
    )
  }

  const renderCurrentStage = () => {
    const isLastStage = currentStage >= totalStages - 1

    const stageProps = {
      onContinue: handleContinue,
      isLastStage,
      isTransitioning
    }

    switch (currentStage) {
      case 0:
        return <LibraryTutorialStage {...stageProps} />
      case 1:
        return <DetailTutorialStage {...stageProps} />
      case 2:
        return <QuizTutorialStage {...stageProps} />
      case 3:
        return <ProgressTutorialStage {...stageProps} />
      default:
        return <LibraryTutorialStage {...stageProps} />
    }
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {renderProgressDots()}
      
      <Animated.View
        style={[
          styles.stageContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }]
          }
        ]}
      >
        {renderCurrentStage()}
      </Animated.View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 6
  },
  progressDotCompleted: {
    // backgroundColor: '#10B981'
  },
  progressDotCurrent: {
    // backgroundColor: '#3B82F6',
    width: 14,
    height: 14,
    borderRadius: 7
  },
  stageContainer: {
    flex: 1
  }
})