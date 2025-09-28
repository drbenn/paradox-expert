import Card from '@/components/custom/Card'
import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { useAppState } from '@/state/useAppState'
import { QuizResult, QuizSetup, TestType } from '@/types/quiz.types'
import { createRegularQuizSetup, createUnitTestSetup } from '@/utils/quizConfigGeneratorUtils'
import React, { useMemo, useState } from 'react'
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

export default function CompletedQuizzesSection() {
  const { colors } = useSystemTheme()
  const [completedQuizzesExpanded, setCompletedQuizzesExpanded] = useState(false)
  
const quizHistory = useAppState((state) => state.quizHistory)
const isQuizInProgress = useAppState((state) => state.isQuizInProgress) 
const startQuiz = useAppState((state) => state.startQuiz)

const generateDisplayTitle = (quiz: QuizResult): string => {
  switch (quiz.testType) {
    case 'unit_test':
      return `Tier ${quiz.tier} Unit Test`
    case 'regular':
      return `Tier ${quiz.tier} Quiz ${quiz.quizNumber}`
    case 'custom':
      return `Custom Quiz`
    case 'daily_challenge':
      return `Daily Challenge`
    case 'weekly_gauntlet':
      return `Weekly Gauntlet`
    default:
      return 'Quiz'
  }
}

  const getMedalTrophyBadge = (quiz: QuizResult) => {
    if (quiz.testType === 'regular') {
      if (quiz.score >= 90) return { emoji: '🥇', text: 'GOLD', color: '#fbbf24' }
      if (quiz.score >= 80) return { emoji: '🥈', text: 'SILVER', color: '#9ca3af' }  
      if (quiz.score >= 70) return { emoji: '🥉', text: 'BRONZE', color: '#d97706' }
    }
    
    if (quiz.testType === 'unit_test') {
      if (quiz.score >= 90) return { emoji: '🏆', text: 'GIANT TROPHY', color: '#fbbf24' }
      if (quiz.score >= 85) return { emoji: '🏆', text: 'SMALL TROPHY', color: '#f59e0b' }
    }
    
    return null
  }

  const getQuizTypeDisplay = (quiz: QuizResult) => {
    switch (quiz.testType) {
      case 'unit_test':
        return { badge: '🏆 UNIT TEST', badgeColor: '#f59e0b' }
      case 'daily_challenge':
        return { badge: '🌅 DAILY', badgeColor: '#10b981' }
      case 'weekly_gauntlet':
        return { badge: '⚔️ GAUNTLET', badgeColor: '#8b5cf6' }
      case 'custom':
        return { badge: '🎨 CUSTOM', badgeColor: '#06b6d4' }
      case 'regular':
      default:
        return { badge: '📝 QUIZ', badgeColor: colors.primary }
    }
  }

  const handleRetake = (quiz: QuizResult) => {
    const retakeStatus = calculateRetakeEligibility(quiz.testType, quiz.tier, quiz.quizNumber)
    
    if (!retakeStatus.canRetake) {
      Alert.alert(
        'Quiz Complete',
        `${generateDisplayTitle(quiz)}\n\n${retakeStatus.message}`,
        [{ text: 'OK', style: 'default' }]
      )
      return
    }

    const alertMessage = `${generateDisplayTitle(quiz)}\n\n${retakeStatus.message}\n\nAre you sure you want to ${retakeStatus.isComplete ? 'practice this quiz' : 'retake this quiz'}?`

    Alert.alert(
      'Retake Quiz',
      alertMessage,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: retakeStatus.isComplete ? 'Practice' : 'Retake', 
          onPress: () => {
            try {
              const quizSetup: QuizSetup = quiz.testType as TestType === 'unit_test' 
                ? createUnitTestSetup(quiz.tier!)
                : createRegularQuizSetup(quiz.tier!, quiz.quizNumber!) 
                
                startQuiz(quizSetup)
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to start quiz')
            }
          }
        }
      ]
    )
  }

  const getAllAttemptsForQuiz = (testType: string, tier?: number | null, quizNumber?: number | null) => {
    return quizHistory.filter((attempt: QuizResult) => 
      attempt.testType === testType &&
      attempt.tier === tier &&
      attempt.quizNumber === quizNumber
    )
  }

  // Calculate retake eligibility based on complete history
  const calculateRetakeEligibility = (testType: string, tier?: number | null, quizNumber?: number | null) => {
    // No retakes allowed for these quiz types
    if (testType === 'daily_challenge' || testType === 'weekly_gauntlet' || testType === 'custom') {
      return {
        canRetake: false,
        canEarnPoints: false,
        canEarnRewards: false,
        message: 'This quiz type doesn\'t support retakes. Great job completing it!',
        isComplete: true
      }
    }

    // Only regular and unit_test quizzes allow retakes
    if (testType !== 'regular' && testType !== 'unit_test') {
      return {
        canRetake: false,
        canEarnPoints: false,
        canEarnRewards: false,
        message: 'This quiz type doesn\'t support retakes.',
        isComplete: true
      }
    }

    const allAttempts = getAllAttemptsForQuiz(testType, tier, quizNumber)
    
    // Handle case where no previous attempts found (edge case/data inconsistency)
    if (allAttempts.length === 0) {
      return {
        canRetake: true,
        canEarnPoints: true,
        canEarnRewards: true,
        message: 'Take this quiz for points and rewards!',
        isComplete: false
      }
    }

    const bestScore = Math.max(...allAttempts.map((attempt: QuizResult) => attempt.score))
    const hasPassed = allAttempts.some((attempt: QuizResult) => attempt.passed)
    const hasGoldTier = bestScore >= 90

    // Never passed (best score < 70%)
    if (!hasPassed) {
      return {
        canRetake: true,
        canEarnPoints: true,
        canEarnRewards: true,
        message: 'Retake for points and potential rewards!',
        isComplete: false
      }
    } 
    // Passed but haven't achieved gold/giant trophy yet
    else if (!hasGoldTier) {
      const currentTier = testType === 'unit_test' 
        ? (bestScore >= 85 ? 'Small Trophy' : 'No Trophy')
        : (bestScore >= 80 ? 'Silver Medal' : 'Bronze Medal')
      
      return {
        canRetake: true,
        canEarnPoints: false,
        canEarnRewards: true,
        message: `Current: ${currentTier}\n\nRetake for better rewards only (no additional points).`,
        isComplete: false
      }
    } 
    // Already achieved gold/giant trophy
    else {
      const maxReward = testType === 'unit_test' ? 'Giant Trophy' : 'Gold Medal'
      return {
        canRetake: true,
        canEarnPoints: false,
        canEarnRewards: false,
        message: `${maxReward} achieved!\n\nRetake for practice only (no points or new rewards).`,
        isComplete: true
      }
    }
  }

  const displayQuizzes = useMemo(() => {
    return quizHistory
      .slice() // shallow copy to avoid mutating original
      .sort((a: QuizResult, b: QuizResult) => 
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      )
  }, [quizHistory])

  if (displayQuizzes.length === 0) {
    return (
      <Card>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>✅ Completed Quizzes</Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          No quizzes completed yet. Start with your first quiz above!
        </Text>
      </Card>
    )
  }

  const visibleQuizzes = completedQuizzesExpanded ? displayQuizzes : displayQuizzes.slice(0, 4)
  const hasMore = displayQuizzes.length > 4

  return (
    <Card>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>✅ Completed Quizzes</Text>
      <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
        Tap retakeable quizzes to refresh your skills
      </Text>
      
      <View style={styles.completedList}>
        {visibleQuizzes.map((quiz: QuizResult, index: number) => {
          const key = `completed-${quiz.testType}-${quiz.tier}-${quiz.quizNumber}-${index}`
          const displayInfo = getQuizTypeDisplay(quiz)
          const badge = getMedalTrophyBadge(quiz)
          
          const isRetakeable = quiz.testType === 'regular' || quiz.testType === 'unit_test'
          
          const hasTopAward = badge && (
            (quiz.testType === 'regular' && badge.text === 'GOLD') ||
            (quiz.testType === 'unit_test' && badge.text === 'GIANT TROPHY')
          )
          
          return (
            <TouchableOpacity
              key={key}
              style={[styles.completedItem, { 
                backgroundColor: colors.background, 
                borderColor: colors.border 
              }]}
              onPress={() => handleRetake(quiz)}
              disabled={isQuizInProgress}
              activeOpacity={0.7}
            >
              <View style={styles.completedLeft}>
                <View style={styles.completedTitleRow}>
                  <Text style={[styles.completedTitle, { color: colors.text }]}>
                    {generateDisplayTitle(quiz)}
                  </Text>
                </View>
                <View style={styles.completedMetaRow}>
                  <Text style={[styles.completedDate, { color: colors.textSecondary }]}>
                    {new Date(quiz.completedAt).toLocaleDateString()}
                  </Text>
                  {badge && (
                    <View style={[styles.medalTrophyBadge, { backgroundColor: badge.color }]}>
                      <Text style={styles.medalTrophyText}>{badge.emoji} {badge.text}</Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.completedRight}>
                <View style={[styles.scoreBadge, { backgroundColor: displayInfo.badgeColor }]}>
                  <Text style={styles.scoreBadgeText}>{quiz.score}%</Text>
                </View>
                
                <Text style={[
                  styles.retakeArrow, 
                  { 
                    color: !isRetakeable ? 'transparent' : 
                          hasTopAward ? colors.textSecondary : colors.primary,
                    opacity: hasTopAward ? 0.6 : 1
                  }
                ]}>
                  →
                </Text>
              </View>
            </TouchableOpacity>
          )
        })}
      </View>

      {hasMore && (
        <TouchableOpacity
          style={[styles.showMoreButton, { 
            backgroundColor: colors.primary + '60', 
            borderColor: colors.primary 
          }]}
          onPress={() => setCompletedQuizzesExpanded(!completedQuizzesExpanded)}
          activeOpacity={0.7}
        >
          <Text style={[styles.showMoreText, { color: colors.text }]}>
            {completedQuizzesExpanded 
              ? 'Show less' 
              : `Show ${displayQuizzes.length - 4} more completed quizzes`
            }
          </Text>
          <Text style={[
            styles.expandIcon, 
            { color: colors.textSecondary },
            completedQuizzesExpanded && styles.expandIconRotated
          ]}>
            ⌄
          </Text>
        </TouchableOpacity>
      )}
    </Card>
  )
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    textAlign: 'center',
  },
  completedList: {
    gap: 8,
  },
  completedItem: {
    borderRadius: SHAPES.borderRadius,
    padding: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completedLeft: {
    flex: 1,
  },
  completedTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  completedDate: {
    fontSize: 11,
    fontWeight: '500',
  },
  completedRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoreBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  retakeArrow: {
    fontSize: 16,
    fontWeight: '700',
  },
  showMoreButton: {
    borderRadius: SHAPES.borderRadius,
    padding: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: '600',
  },
  expandIcon: {
    fontSize: 16,
    fontWeight: '700',
    transform: [{ rotate: '0deg' }],
  },
  expandIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  completedTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  completedMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  medalTrophyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  medalTrophyText: {
    fontSize: 8,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.3,
  },
})