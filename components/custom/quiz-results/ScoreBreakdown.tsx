import SHAPES from '@/constants/Shapes';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ScoreBreakdownProps {
  score: number;
  totalQuestions: number;
  passed: boolean;
  testType: string;
  pointsEarned: number;
  colors: {
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
  };
}

export default function ScoreBreakdown({ 
  score, 
  totalQuestions, 
  passed, 
  testType, 
  pointsEarned, 
  // pointsReason, 
  colors 
}: ScoreBreakdownProps) {
  
  // Get test-type-specific primary color for theming
  const getPrimaryColor = () => {
    switch (testType) {
      case 'unit_test':
      case 'daily_challenge':
        return '#f59e0b'
      case 'weekly_gauntlet':
        return '#dc2626'
      case 'custom':
        return '#8b5cf6'
      default: // regular
        return '#10b981'
    }
  }

  const primaryColor = getPrimaryColor()

  // Get test-type-specific title
  const getTestTypeTitle = () => {
    switch (testType) {
      case 'unit_test':
        return 'Unit Test'
      case 'daily_challenge':
        return 'Daily Challenge'
      case 'weekly_gauntlet':
        return 'Weekly Gauntlet'
      case 'custom':
        return 'Custom Quiz'
      default:
        return 'Quiz'
    }
  }

  // Score color calculation
  const getScoreColor = () => {
    if (score >= 70) return primaryColor
    return '#ef4444' // Red
  }

  // Calculate correct/incorrect answers
  const correctAnswers = Math.round((score / 100) * totalQuestions)
  const incorrectAnswers = totalQuestions - correctAnswers

  return (
    <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {getTestTypeTitle()} Breakdown
      </Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: primaryColor }]}>{correctAnswers}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Correct</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#ef4444' }]}>{incorrectAnswers}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Incorrect</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: primaryColor }]}>{totalQuestions}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
        </View>
      </View>

      {/* Visual Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                backgroundColor: getScoreColor(),
                width: `${score}%` 
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          {score}% - {passed ? 'Passed!' : 'Failed'}
        </Text>
      </View>

      {/* Points Display */}
      {pointsEarned > 0 && (
        <View style={[styles.pointsEarnedContainer, { backgroundColor: primaryColor + '10', borderColor: primaryColor }]}>
          <Text style={[styles.pointsEarnedText, { color: primaryColor }]}>
            🎯 +{pointsEarned} Points Earned!
          </Text>
          {/* {pointsReason && (
            <Text style={[styles.pointsReasonText, { color: colors.textSecondary }]}>
              {pointsReason}
            </Text>
          )} */}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    borderRadius: SHAPES.borderRadius,
    padding: 20,
    marginBottom: SHAPES.standardVerticalMargin,
    borderWidth: SHAPES.cardBorderWidth,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 12,
    borderRadius: SHAPES.borderRadius,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: SHAPES.borderRadius,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  pointsEarnedContainer: {
    marginTop: 16,
    padding: 16,
    borderRadius: SHAPES.borderRadius,
    borderWidth: SHAPES.cardBorderWidth,
    alignItems: 'center',
  },
  pointsEarnedText: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  pointsReasonText: {
    fontSize: 14,
    fontWeight: '600',
  },
})