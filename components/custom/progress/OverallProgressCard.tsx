import Card from '@/components/custom/Card'
import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { useAppState } from '@/state/useAppState'
import { QuizLearnedFallacyStats } from '@/types/app.types'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function OverallProgressCard() {
  const { colors } = useSystemTheme()
  const learnedStats: QuizLearnedFallacyStats = useAppState((state) => state.learnedStats)
  const percentMastered = (learnedStats.totalLearned / learnedStats.totalFallacies) * 100 || 0

  return (
    <Card variant="default">
      <Text style={[styles.cardTitle, { color: colors.text }]}>Overall Progress</Text>
      
      <View style={styles.progressInfo}>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          {learnedStats.totalLearned} of {learnedStats.totalFallacies} fallacies mastered
        </Text>
        <Text style={[styles.progressPercent, { color: colors.primary }]}>
          {Number(percentMastered).toFixed(1)}%
        </Text>
      </View>
      
      <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
        <LinearGradient
          colors={[colors.primary, '#c44569']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: `${percentMastered}%`}]}
        />
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    borderRadius: SHAPES.borderRadius,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: SHAPES.borderRadius,
  },
})