import SHAPES from '@/constants/Shapes';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface QuizResultsHeaderProps {
  testType: string;
  score: number;
  passed: boolean;
  colors: {
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
  };
  theme: any
}

export default function QuizResultsHeader({ testType, score, passed, colors, theme }: QuizResultsHeaderProps) {
  // Score color calculation
  const getScoreColor = () => {
    if (score >= 70) return theme.primaryColor
    return '#ef4444' // Red
  }

  // Score message generation
  const getScoreMessage = () => {
    switch (testType) {
      case 'unit_test':
        if (score >= 90) return 'Master Level! 🎓'
        if (score >= 80) return 'Unit Test Passed! 🏆'
        if (score >= 70) return 'You Did It! 🎉'
        return 'Keep Studying! 📚'
      
      case 'daily_challenge':
        if (score >= 90) return 'Challenge Crushed! ⚡'
        if (score >= 80) return 'Daily Success! 🎯'
        if (score >= 70) return 'You Did It! 🎉'
        return 'Practice More! 💪'
      
      case 'weekly_gauntlet':
        if (score >= 90) return 'Gauntlet Legend! 🔥'
        if (score >= 80) return 'Survivor! 🏆'
        if (score >= 70) return 'You Did It! 🎉'
        return 'Train Harder! ⚔️'
      
      case 'custom':
        if (score >= 90) return 'Creative Genius! 🎨'
        if (score >= 80) return 'Well Crafted! 🛠️'
        if (score >= 70) return 'You Did It! 🎉'
        return 'Adjust & Retry! 🔧'
      
      default: // regular
        if (score >= 90) return 'Excellent! 🎉'
        if (score >= 80) return 'Great job! 🎉'
        if (score >= 70) return 'You Did It! 🎉'
        return 'Keep practicing! 💪'
    }
  }

  // Passing note generation
  const getPassingNote = (score: number) => {
    let postFixRegularQuizMessage: string = ''

    if (testType === 'regular') {
      if (score < 80) {
        postFixRegularQuizMessage = 'Retake the quiz in the quiz center completed quizzes section to improve your score and receive silver or gold medals!'
      } else if (score < 90) {
        postFixRegularQuizMessage = 'Retake the quiz in the quiz center to improve your score and receive a gold medal!'
      } else {
        postFixRegularQuizMessage = 'You are top notch!'
      }
    }

    let postFixUnitTestMessage: string = ''
    if (testType === 'unit_test') {
      if (score < 90) {
        postFixRegularQuizMessage = 'Retake the test in the quiz center completed quizzes section to improve your score and receive a giant trophy!'
      } else {
        postFixRegularQuizMessage = 'You are so tremendous!'
      }
    }

    switch (testType) {
      case 'unit_test':
        return passed 
          ? `You passed the comprehensive unit test! ${postFixUnitTestMessage}`
          : 'You need 70% or higher to pass unit tests.'
      
      case 'daily_challenge':
        return passed
          ? `Challenge completed! You are so tremendous!`
          : 'You need 70% or higher to pass! Daily challenges can be retaken as many times as needed.'
      
      case 'weekly_gauntlet':
        return passed
          ? 'Gauntlet survived! You conquered the ultimate endurance test.'
          : 'You need 70% or higher to pass the gauntlet!'
      
      case 'custom':
        return passed
          ? 'Custom creation mastered! You conquered your own challenge.'
          : 'You need 70% or higher to pass custom quiz.'
      
      default: // regular
        return passed 
          ? `You passed! ${postFixRegularQuizMessage}` 
          : 'You need 70% or higher to pass.'
    }
  }

  return (
    <View style={[styles.resultsHeader, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* Test-type-specific status badge */}
      <LinearGradient
        colors={passed ? theme.successColors : theme.failColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statusBadge}
      >
        <Text style={styles.statusText}>
          {passed ? theme.passedText : theme.failedText}
        </Text>
      </LinearGradient>

      <Text style={[styles.scoreTitle, { color: getScoreColor() }]}>
        {score}%
      </Text>
      
      <Text style={[styles.scoreMessage, { color: colors.text }]}>
        {getScoreMessage()}
      </Text>

      <Text style={[styles.passingNote, { color: colors.textSecondary }]}>
        {getPassingNote(score)}
      </Text>

      {/* Test type indicator */}
      <View style={[styles.testTypeIndicator, { backgroundColor: theme.primaryColor + '20', borderColor: theme.primaryColor }]}>
        <Text style={[styles.testTypeIndicatorText, { color: theme.primaryColor }]}>
          {theme.icon} {theme.title}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  resultsHeader: {
    borderRadius: SHAPES.borderRadius,
    padding: 24,
    marginBottom: SHAPES.standardVerticalMargin,
    borderWidth: SHAPES.cardBorderWidth,
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: SHAPES.borderRadius,
    marginBottom: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  scoreTitle: {
    fontSize: 48,
    fontWeight: '900',
    marginBottom: 8,
  },
  scoreMessage: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  passingNote: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  testTypeIndicator: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: SHAPES.borderRadius,
    borderWidth: SHAPES.buttonBorderWidth,
  },
  testTypeIndicatorText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
})