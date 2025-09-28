import SHAPES from '@/constants/Shapes'
import APP_CONSTANTS from '@/constants/appConstants'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface ActiveQuizHeaderProps {
  currentQuestionIndex: number
  totalQuestions: number
  isQuizActive: boolean
  isAnswered: boolean
  onTimeUp: () => void
  onExit: () => void
  colors: {
    background: string
    surface: string
    border: string
    text: string
    textSecondary: string
    primary: string
  }
}

export default function ActiveQuizHeader({
  currentQuestionIndex,
  totalQuestions,
  isQuizActive,
  isAnswered,
  onTimeUp,
  onExit,
  colors
}: ActiveQuizHeaderProps) {
  const [timeRemaining, setTimeRemaining] = useState(APP_CONSTANTS.QUIZ.QUESTION_TIME_LIMIT_SECONDS)

  const errorColor = '#ef4444'
  const warnColor = '#dad61dff'

  // Timer color based on remaining time
  const getTimerColor = (timeRemaining: number): string => {
    if (timeRemaining <= 10) return errorColor
    else if (timeRemaining <= 20) return warnColor
    else return colors.text
  }

  // Calculate progress percentage
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100

  // Timer countdown effect
  useEffect(() => {
    if (!isQuizActive || isAnswered) {
      return
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev: number) => {
        if (prev <= 1) {
          // Don't call onTimeUp here - causes React warning
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentQuestionIndex, isAnswered, isQuizActive])

  // Separate effect to handle time up
  useEffect(() => {
    if (timeRemaining === 0 && isQuizActive && !isAnswered) {
      onTimeUp()
    }
  }, [timeRemaining, isQuizActive, isAnswered, onTimeUp])

  // Reset timer when advancing to next question
  useEffect(() => {
    setTimeRemaining(APP_CONSTANTS.QUIZ.QUESTION_TIME_LIMIT_SECONDS)
  }, [currentQuestionIndex])

  return (
    <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <View style={styles.headerSingleRow}>
        <TouchableOpacity
          style={[styles.exitButton, { backgroundColor: errorColor + '20' }]}
          onPress={onExit}
        >
          <Text style={[styles.exitButtonText, { color: errorColor }]}>Exit</Text>
        </TouchableOpacity>
      
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: colors.primary, width: `${progress}%` }
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {currentQuestionIndex + 1} of {totalQuestions}
          </Text>
        </View>

        <Text style={[styles.timerText, { color: getTimerColor(timeRemaining) }]}>
          {timeRemaining}s
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SHAPES.standardBodyHorizontalMargin,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerSingleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  exitButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: SHAPES.borderRadius,
    minWidth: 60,
  },
  exitButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  timerText: {
    fontSize: 20,
    fontWeight: '800',
    minWidth: 50,
    textAlign: 'right',
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    marginTop: 18,
    marginHorizontal: 25,
  },
  progressBar: {
    height: 6,
    width: '100%',
    borderRadius: SHAPES.borderRadius,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: SHAPES.borderRadius,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
})