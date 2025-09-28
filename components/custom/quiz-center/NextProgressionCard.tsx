import Card from '@/components/custom/Card'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { useAppState } from '@/state/useAppState'
import { QuizSetup, TestType } from '@/types/quiz.types'
import { createRegularQuizSetup, createUnitTestSetup } from '@/utils/quizConfigGeneratorUtils'
import React, { useMemo } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

// Utility function: Generate quiz metadata
const getQuizDisplayData = (testType: TestType, tier: number, quiz: number | null) => {
  if (testType === 'unit_test') {
    return {
      title: `Tier ${tier} - Unit Test`,
      description: `Comprehensive test covering ALL 20 fallacies in Tier ${tier}`,
      badge: `TIER ${tier}`,
      badgeColor: '#f59e0b',
      label: 'Unit Test',
      labelColor: '#f59e0b',
      questions: '20 Questions',
      time: '20 Minutes',
      buttonText: 'Start Test',
      buttonColor: '#f59e0b'
    }
  }

  if (testType === 'regular' && quiz !== null) {
    return {
      title: `Tier ${tier} - Quiz ${quiz}`,
      description: `Test your knowledge of 5 logical fallacies`,
      badge: `T${tier}Q${quiz}`,
      badgeColor: '#3b82f6',
      label: 'Next Quiz', 
      labelColor: '#3b82f6',
      questions: '10 Questions',
      time: '10 Minutes',
      buttonText: 'Start Quiz',
      buttonColor: '#3b82f6'
    }
  }

  // "Won life" case - quiz 5 means complete
  if (testType === 'regular' && quiz === 5) {
    return {
      title: 'You Won Life! 🎉',
      description: 'You\'ve mastered all 200 logical fallacies. You are now a critical thinking legend!',
      badge: '🏆',
      badgeColor: '#10b981',
      label: 'Complete',
      labelColor: '#10b981',
      questions: '',
      time: '',
      buttonText: '',
      buttonColor: '#10b981'
    }
  }

  // Fallback
  return null
}

// Utility function: Handle quiz start
const handleQuizStart = (
  testType: string, 
  tier: number, 
  quiz: number | null,
  startQuizFn: (testType: TestType, tier: number | null, quizNumber: number | null) => void,
  onStartCallback?: () => void
) => {
  const displayData = getQuizDisplayData(testType as TestType, tier, quiz)
  if (!displayData) return

  const isUnitTest = testType === 'unit_test'
  
  Alert.alert(
    isUnitTest ? '🏆 Ready for Unit Test Challenge?' : '🎯 Ready for Quiz Challenge?',
    isUnitTest 
      ? `${displayData.title} - The Ultimate Challenge!\n\n${displayData.description}\n\nThis is your chance to prove mastery of the entire tier. Are you ready?`
      : `${displayData.title}\n\nReady to test your knowledge?`,
    [
      { text: isUnitTest ? 'Not Ready' : 'Not Yet', style: 'cancel' },
      { 
        text: isUnitTest ? 'Bring It On!' : 'Let\'s Go!', 
        onPress: () => {
          try {
            startQuizFn(testType as TestType, tier, quiz)
            onStartCallback?.()
          } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to start quiz')
          }
        }
      }
    ]
  )
}


const NextProgressionCard = () => {
  const { colors } = useSystemTheme()
  
  // State-first architecture: read directly from quiz slice
  const nextQuizOrTest = useAppState((state) => state.nextQuizOrTest)
  const isQuizInProgress = useAppState((state) => state.isQuizInProgress)
  const startQuiz = useAppState((state) => state.startQuiz)

  // Memoized display data based on next quiz/test
  const displayData = useMemo(() => {

    if (!nextQuizOrTest) return null
    
    const data = getQuizDisplayData(
      nextQuizOrTest.testType, 
      nextQuizOrTest.tier, 
      nextQuizOrTest.quiz
    )
    
    // Apply theme colors for regular quizzes
    if (data && nextQuizOrTest.testType === 'regular' && nextQuizOrTest.quiz !== 5) {
      return {
        ...data,
        badgeColor: colors.primary,
        labelColor: colors.primary,
        buttonColor: colors.primary
      }
    }
    
    return data
  }, [nextQuizOrTest, colors.primary])

  // Handler for starting progression
  const handleStartProgression = () => {
    console.log('handle Start progression: nextQuizOrTest: ', nextQuizOrTest);
    console.log('handle Start progression: displayData: ', displayData);
    
    
    if (!nextQuizOrTest || !displayData) return
    
    const isUnitTest = nextQuizOrTest.testType === 'unit_test'
    
    Alert.alert(
      isUnitTest ? '🏆 Ready for Unit Test Challenge?' : '🎯 Ready for Quiz Challenge?',
      isUnitTest 
        ? `${displayData.title} - The Ultimate Challenge!\n\n${displayData.description}\n\nThis is your chance to prove mastery of the entire tier. Are you ready?`
        : `${displayData.title}\n\nReady to test your knowledge?`,
      [
        { text: isUnitTest ? 'Not Ready' : 'Not Yet', style: 'cancel' },
        { 
          text: isUnitTest ? 'Bring It On!' : 'Let\'s Go!', 
          onPress: () => {
            try {
              const quizSetup: QuizSetup = isUnitTest 
                ? createUnitTestSetup(nextQuizOrTest.tier)
                : createRegularQuizSetup(nextQuizOrTest.tier, nextQuizOrTest.quiz!)
              
              startQuiz(quizSetup)
              // No callbacks needed - state management handles everything
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to start quiz')
            }
          }
        }
      ]
    )
  }



  // Don't render if no progression available or complete
  if (!displayData || (nextQuizOrTest?.testType === 'regular' && nextQuizOrTest?.quiz === 5)) {
    return null
  }

  return (
    <Card variant="default">
      <TouchableOpacity
        style={styles.container}
        onPress={handleStartProgression}
        disabled={isQuizInProgress}
        activeOpacity={0.8}
      >
        {/* Floating difficulty indicator */}
        <View style={[styles.badge, { backgroundColor: displayData.badgeColor + '15' }]}>
          <Text style={[styles.badgeText, { color: displayData.badgeColor }]}>
            {displayData.badge}
          </Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={[styles.dot, { backgroundColor: displayData.labelColor }]} />
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              {displayData.label}
            </Text>
          </View>
          
          <Text style={[styles.title, { color: colors.text }]}>
            {displayData.title}
          </Text>
          
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {displayData.description}
          </Text>
          
          <View style={styles.footer}>
            <View style={styles.stats}>
              {displayData.questions && (
                <Text style={[styles.stat, { color: colors.textSecondary }]}>
                  {displayData.questions}
                </Text>
              )}
              {displayData.time && (
                <Text style={[styles.stat, { color: colors.textSecondary }]}>
                  {displayData.time}
                </Text>
              )}
            </View>
            {displayData.buttonText && (
              <View style={[styles.button, { backgroundColor: displayData.buttonColor }]}>
                <Text style={styles.buttonText}>
                  {displayData.buttonText}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  content: {
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 28,
  },
  description: {
    fontSize: 15,
    marginBottom: 20,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    fontSize: 13,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
})

export default NextProgressionCard