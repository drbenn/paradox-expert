import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { useAppState } from '@/state/useAppState'
import { QuizSetup } from '@/types/quiz.types'
import { createDailyChallengeSetup } from '@/utils/quizConfigGeneratorUtils'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useShallow } from 'zustand/shallow'

interface DailyChallengeQuizButtonProps {
  fallacyId?: string
  mode?: 'auto' | 'quiz-center' | 'fallacy-detail'
}

const DailyChallengeQuizButton: React.FC<DailyChallengeQuizButtonProps> = ({ 
  fallacyId,
  mode = 'auto'
}) => {
  const { colors } = useSystemTheme()
  const params = useLocalSearchParams()
  
  const smartFallacyId = fallacyId || (params.id as string) || null
  
  const { isCompleted, todaysFallacy, isLoading } = useAppState(
    useShallow((state) => ({
      isCompleted: state.dailyChallengeStatus?.isCompleted ?? false,
      todaysFallacy: state.dailyChallengeStatus?.todaysFallacy ?? null,
      isLoading: state.dailyChallengeStatus?.isLoading ?? false
    }))
  )

  const startQuiz = useAppState((state) => state.startQuiz)

  // Local state for component
  const [shouldShow, setShouldShow] = useState(false)

  const navigateToDailyChallengeQuiz = () => {
    if (todaysFallacy) {
      try {
        const quizSetup: QuizSetup = createDailyChallengeSetup(todaysFallacy) 
        startQuiz(quizSetup)
        // No callbacks needed - state management handles everything
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to start quiz')
      } 
    }
  }

  // Hybrid pattern: Read current state immediately + subscribe to future changes

  // SHOW/HIDE LOGIC: Determine if button should be visible
  useEffect(() => {
    if (!todaysFallacy?.id) {
      setShouldShow(false)
      return
    }
    
    const todaysFallacyId = todaysFallacy.id

    let showButton = false

    if (mode === 'quiz-center') {
      showButton = true
    } else if (mode === 'fallacy-detail') {
      showButton = smartFallacyId === todaysFallacyId
    } else {
      // Auto mode
      showButton = smartFallacyId ? smartFallacyId === todaysFallacyId : true
    }

    setShouldShow(showButton)
  }, [mode, smartFallacyId, todaysFallacy])

  if (!shouldShow) {
    return null
  }

  const handlePress = () => {
    Alert.alert(
      '🌅 Ready for Today\'s Challenge?',
      `Daily Fallacy Challenge\n\n🧠 Today's Focus: ${todaysFallacy?.title || 'Special Fallacy'}\n\n📝 10 Questions\n⏱️ 10 Minutes\n🎯 70% to Pass\n💰 15 Points + Streak Bonus\n\nStart your daily brain workout?`,
      [
        { text: 'Maybe Later', style: 'cancel' },
        { text: 'Start Challenge!', onPress: () => navigateToDailyChallengeQuiz() }
      ]
    )
  }

  // BUTTON CONTENT: Based on current state
  const getContent = () => {
    if (isLoading) {
      return {
        title: 'Loading Challenge...',
        subtitle: 'Preparing questions',
        icon: '⏳',
        enabled: false,
        showSpinner: true
      }
    }
    
    if (isCompleted) {
      return {
        title: 'Daily Challenge Complete',
        subtitle: 'Great work today!',
        icon: '✅',
        enabled: false,
        showSpinner: false
      }
    }
    
    if (!isCompleted) {
      return {
        title: 'Start Today\'s Challenge',
        subtitle: '+15 Points • 10 Questions',
        icon: '🎯',
        enabled: true,
        showSpinner: false
      }
    }
    
    return {
      title: 'Daily Challenge Unavailable',
      subtitle: 'Check back tomorrow',
      icon: '📅',
      enabled: false,
      showSpinner: false
    }
  }

  const content = getContent()

  // STYLING: Based on state
  const containerStyle = {
    borderColor: isCompleted ? colors.primary : colors.border,
    borderWidth: !isCompleted ? 2 : 1,
    backgroundColor: colors.surface,
  }

  const contentStyle = {
    backgroundColor: isCompleted ? `${colors.primary}08` : 'transparent',
  }

  const iconStyle = {
    backgroundColor: isCompleted ? `${colors.primary}15` : colors.background,
    borderColor: isCompleted ? `${colors.primary}30` : colors.border,
    borderWidth: 1,
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={[styles.touchableContent, contentStyle, { opacity: content.enabled ? 1 : 0.7 }]}
        onPress={handlePress}
        disabled={!content.enabled}
        activeOpacity={0.7}
      >
        <View style={styles.mainContent}>
          {/* Icon Section */}
          <View style={[styles.iconSection, iconStyle]}>
            {content.showSpinner ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={[styles.iconText, { color: colors.primary }]}>{content.icon}</Text>
            )}
            {!isCompleted && (
              <View style={[styles.dailyBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.dailyBadgeText}>DAILY</Text>
              </View>
            )}
          </View>

          {/* Text Section */}
          <View style={styles.textSection}>
            <Text style={[styles.title, { color: colors.text }]}>
              {content.title}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {content.subtitle}
            </Text>
          </View>

          {/* Action Section */}
          <View style={styles.actionSection}>
            {isLoading ? (
              <ActivityIndicator color={colors.primary} size="small" />
            ) : content.enabled ? (
              <View style={[styles.actionArrow, { backgroundColor: `${colors.primary}15` }]}>
                <Text style={[styles.arrowText, { color: colors.primary }]}>→</Text>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: SHAPES.borderRadius,
    overflow: 'hidden',
    marginBottom: SHAPES.standardVerticalMargin
  },
  touchableContent: {
    borderRadius: SHAPES.borderRadius,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  iconSection: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconText: {
    fontSize: 24,
  },
  dailyBadge: {
    position: 'absolute',
    bottom: -4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  dailyBadgeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  textSection: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  actionSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionArrow: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 16,
    fontWeight: '700',
  },
})

export default DailyChallengeQuizButton