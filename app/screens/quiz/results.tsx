import NextStepsSection from '@/components/custom/quiz-results/NextStepsSection'
import QuizResultsHeader from '@/components/custom/quiz-results/QuizResultsHeader'
import ScoreBreakdown from '@/components/custom/quiz-results/ScoreBreakdown'
import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { useAppState } from '@/state/useAppState'
import { QuizCompletionResult } from '@/types/quiz.types'
import { getNextStepsData } from '@/utils/whatsNextUtils'
import { router } from 'expo-router'
import React from 'react'
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function QuizResultsScreen() {
  const { colors } = useSystemTheme()
  const insets = useSafeAreaInsets()

  // 🆕 STATE-BASED: Read completion result from state
  const completionResult: QuizCompletionResult | null = useAppState((state) => state.completionResult)


  // 🛡️ SAFETY: Handle case where completion result isn't available
  if (!completionResult) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[{ color: colors.text }]}>No quiz results available</Text>
        </View>
      </SafeAreaView>
    )
  }

  // Extract data from completion result
  const { quizResult, pointsEarned } = completionResult
  const { score, passed, totalQuestions, testType } = quizResult

  const nextStepsData = getNextStepsData(testType, passed, score)

  // 🆕 MODERN: Test-type-specific theming
  const getTestTypeTheme = () => {
    switch (testType) {
      case 'unit_test':
        return {
          primaryColor: '#f59e0b',
          successColors: ['#f59e0b', '#d97706'] as [string, string, ...string[]],
          failColors: ['#ef4444', '#dc2626'] as [string, string, ...string[]],
          passedText: '🏆 UNIT PASSED',
          failedText: '🏆 UNIT FAILED',
          title: 'Unit Test',
          icon: '🏆'
        }
      case 'daily_challenge':
        return {
          primaryColor: '#f59e0b',
          successColors: ['#f59e0b', '#d97706'] as [string, string, ...string[]],
          failColors: ['#ef4444', '#dc2626'] as [string, string, ...string[]],
          passedText: '⚡ CHALLENGE CRUSHED',
          failedText: '⚡ CHALLENGE FAILED',
          title: 'Daily Challenge',
          icon: '⚡'
        }
      case 'weekly_gauntlet':
        return {
          primaryColor: '#dc2626',
          successColors: ['#dc2626', '#b91c1c'] as [string, string, ...string[]],
          failColors: ['#ef4444', '#dc2626'] as [string, string, ...string[]],
          passedText: '🔥 GAUNTLET CONQUERED',
          failedText: '🔥 GAUNTLET FAILED',
          title: 'Weekly Gauntlet',
          icon: '🔥'
        }
      case 'custom':
        return {
          primaryColor: '#8b5cf6',
          successColors: ['#8b5cf6', '#7c3aed'] as [string, string, ...string[]],
          failColors: ['#ef4444', '#dc2626'] as [string, string, ...string[]],
          passedText: '🎨 CREATION MASTERED',
          failedText: '🎨 CREATION FAILED',
          title: 'Custom Quiz',
          icon: '🎨'
        }
      default: // regular
        return {
          primaryColor: '#10b981',
          successColors: ['#10b981', '#059669'] as [string, string, ...string[]],
          failColors: ['#ef4444', '#dc2626'] as [string, string, ...string[]],
          passedText: '✅ PASSED',
          failedText: '❌ FAILED',
          title: 'Quiz',
          icon: '🏅'
        }
    }
  }

  const theme = getTestTypeTheme()

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top / 4 }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Results Header */}
        <QuizResultsHeader
            testType={testType}
            score={score}
            passed={passed}
            colors={colors}
            theme={theme}
        />

        {/* Score Breakdown */}
        <ScoreBreakdown
          score={score}
          totalQuestions={totalQuestions}
          passed={passed}
          testType={testType}
          pointsEarned={pointsEarned}
          colors={colors}
        />

        {/* Next Steps - Using Helper Data */}
        <NextStepsSection
          nextStepsData={nextStepsData}
          theme={theme}
          colors={colors}
        />

        {/* Action Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: theme.primaryColor }]}
            onPress={() => router.push('/(tabs)/quiz')}
          >
            <Text style={styles.primaryButtonText}>
              Continue to Quiz Center
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 20,
    paddingBottom: 50,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    borderRadius: SHAPES.borderRadius,
    padding: 16,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
})
