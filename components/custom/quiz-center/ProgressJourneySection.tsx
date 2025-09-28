import Card from '@/components/custom/Card'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { useAppState } from '@/state/useAppState'
import { QuizResult } from '@/types/quiz.types'
import { RelativePathString, router } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

// Utility function: Calculate progress for a specific tier
const getTierProgress = (tier: number, quizHistory: QuizResult[]) => {
  // Regular quizzes (quizNumber 1-4) that passed
  const tierQuizzes = quizHistory.filter((q: QuizResult) => 
    q.tier === tier && 
    q.quizNumber !== null && 
    q.quizNumber >= 1 && 
    q.quizNumber <= 4 &&
    q.testType === 'regular' &&
    q.passed
  )

  // Count UNIQUE quiz numbers completed (not total attempts)
  const uniqueQuizNumbers = new Set(tierQuizzes.map(q => q.quizNumber))
  const completedQuizzes = uniqueQuizNumbers.size
  
  // Unit test completed (testType UNIT_TEST for this tier)
  const unitTestCompleted = quizHistory.some((q: QuizResult) => 
    q.tier === tier && 
    q.testType === 'unit_test' &&
    q.passed
  )
  
  return {
    completedQuizzes,
    unitTestCompleted,
    allQuizzesCompleted: completedQuizzes === 4
  }
}

// Utility function: Calculate current tier based on progress
const calculateCurrentTier = (quizHistory: QuizResult[]) => {
  // Find the highest tier with unit test completed
  let highestCompletedTier = 0
  
  for (let tier = 1; tier <= 10; tier++) {
    const tierProgress = getTierProgress(tier, quizHistory)
    if (tierProgress.unitTestCompleted) {
      highestCompletedTier = tier
    }
  }
  
  // Current tier is next tier after highest completed, capped at 10
  return Math.min(highestCompletedTier + 1, 10)
}

// Utility function: Generate tier progress map for all tiers
const generateTierProgressMap = (quizHistory: QuizResult[]) => {
  const tierProgressMap = new Map()
  const currentTier = calculateCurrentTier(quizHistory)
  
  for (let tier = 1; tier <= 10; tier++) {
    const progress = getTierProgress(tier, quizHistory)
    tierProgressMap.set(tier, {
      ...progress,
      isCurrentTier: tier === currentTier
    })
  }
  
  return tierProgressMap
}

// Utility function: Determine quiz square state
const getQuizSquareState = (
  tier: number,
  quizIndex: number,
  tierProgressMap: Map<number, any>
) => {
  const tierProgress = tierProgressMap.get(tier)
  
  if (quizIndex < tierProgress.completedQuizzes) {
    return 'completed'
  }
  
  const tierUnlocked = tier === 1 || tierProgressMap.get(tier - 1)?.unitTestCompleted
  
  if (tierUnlocked && quizIndex === tierProgress.completedQuizzes) {
    return 'available'
  }
  
  return 'locked'
}

// Utility function: Determine unit test state
const getUnitTestState = (tier: number, tierProgressMap: Map<number, any>) => {
  const tierProgress = tierProgressMap.get(tier)
  
  if (tierProgress.unitTestCompleted) {
    return 'completed'
  }
  
  if (tierProgress.allQuizzesCompleted && tierProgress.hasUnitTestAvailable) {
    return 'available'
  }
  
  return 'locked'
}

// Utility function: Handle progress journey navigation
const handleProgressJourneyPress = () => {
  router.push('/(tabs)/progress' as RelativePathString)
}

interface ProgressJourneySectionProps {
  style?: any
}

export default function ProgressJourneySection({ style }: ProgressJourneySectionProps) {
  const { colors } = useSystemTheme()
  
  // State-first architecture: read directly from quiz slice
  const quizHistory = useAppState((state) => state.quizHistory)

  // Memoized tier progress calculations
  const memoizedTierProgress = useMemo(() => {
    return generateTierProgressMap(quizHistory)
  }, [quizHistory])

  // Memoized quiz square state calculator
  const getQuizSquareStateMemo = useCallback((tier: number, quizIndex: number) => {
    return getQuizSquareState(tier, quizIndex, memoizedTierProgress)
  }, [memoizedTierProgress])

  // Memoized unit test state calculator
  const getUnitTestStateMemo = useCallback((tier: number) => {
    return getUnitTestState(tier, memoizedTierProgress)
  }, [memoizedTierProgress])

  return (
    <TouchableOpacity onPress={handleProgressJourneyPress} style={style}>
      <Card variant="tight">
        <View style={styles.progressSection}>
          <Text style={[styles.progressTitle, { color: colors.text }]}>
            🎯 Your Progress Journey
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.progressGrid}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((tier: number) => (
              <View key={tier} style={styles.tierBlock}>
                <Text style={[styles.tierLabel, { color: colors.textSecondary }]}>
                  T{tier}
                </Text>
                <View style={styles.tierContent}>
                  <View style={styles.quizColumn}>
                    {Array.from({ length: 4 }, (_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.quizSquare,
                          getQuizSquareStateMemo(tier, i) === 'completed' && { backgroundColor: colors.primary },
                          getQuizSquareStateMemo(tier, i) === 'available' && { 
                            backgroundColor: colors.surface, 
                            borderColor: colors.primary,
                            borderWidth: 1 
                          },
                          getQuizSquareStateMemo(tier, i) === 'locked' && { 
                            backgroundColor: '#f3f4f6', 
                            borderColor: colors.border,
                            borderWidth: 1 
                          }
                        ]}
                      />
                    ))}
                  </View>
                  <View style={styles.unitTestColumn}>
                    <View
                      style={[
                        styles.unitTestBar,
                        getUnitTestStateMemo(tier) === 'completed' && { backgroundColor: '#f59e0b' },
                        getUnitTestStateMemo(tier) === 'available' && { 
                          backgroundColor: colors.surface, 
                          borderColor: '#f59e0b',
                          borderWidth: 1 
                        },
                        getUnitTestStateMemo(tier) === 'locked' && { 
                          backgroundColor: '#f3f4f6', 
                          borderColor: colors.border,
                          borderWidth: 1 
                        }
                      ]}
                    />
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </Card>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  progressSection: {
    padding: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  progressGrid: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  tierBlock: {
    alignItems: 'center',
  },
  tierLabel: {
    fontSize: 9,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  tierContent: {
    flexDirection: 'row',
    gap: 2,
  },
  quizColumn: {
    flexDirection: 'column',
    gap: 1,
  },
  quizSquare: {
    width: 8,
    height: 8,
    borderRadius: 1,
  },
  unitTestColumn: {
    flexDirection: 'column',
  },
  unitTestBar: {
    width: 8,
    height: 35,
    borderRadius: 1,
  },
})