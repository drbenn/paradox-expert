import Card from '@/components/custom/Card'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { useAppState } from '@/state/useAppState'
import { QuizLearnedFallacyStats } from '@/types/app.types'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useShallow } from 'zustand/shallow'

export default function StatsGrid() {
  const { colors } = useSystemTheme()
  const learnedStats: QuizLearnedFallacyStats = useAppState(
    useShallow((state) => state.learnedStats)
  )

  return (
    <View style={styles.statsGrid}>
      <Card variant="stat">
        <Text style={[styles.statNumber, { color: colors.primary }]}>
          {learnedStats.totalFallacies - learnedStats.totalLearned }
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
          unlearned fallacies
        </Text>
      </Card>
      <Card variant="stat">
        <Text style={[styles.statNumber, { color: colors.primary }]}>
          {learnedStats.totalLearned}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
          mastered fallacies
        </Text>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
})