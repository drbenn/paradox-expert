import Card from '@/components/custom/Card'
import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { useAppState } from '@/state/useAppState'
import { StyleSheet, Text, View } from 'react-native'
import { useShallow } from 'zustand/shallow'

export default function PerformanceStatsCard() {
  const { colors } = useSystemTheme()

  const { cumulativePoints, quickQuizStats } = useAppState(
    useShallow((state) => ({ 
      cumulativePoints: state.cumulativePoints, 
      quickQuizStats: state.quickQuizStats 
    }))
  )

  return (
    <Card variant="default">
      <Text style={[styles.cardTitle, { color: colors.text }]}>Performance Stats</Text>
        <View style={styles.performanceGrid}>
          <View style={[styles.performanceItem, { backgroundColor: colors.border }]}>
            <Text style={[styles.performanceMain, { color: colors.text }]}>
              {quickQuizStats.quizPassRate}%
            </Text>
            <Text style={[styles.performanceSub, { color: colors.textSecondary }]}>
              Quiz Pass Rate
            </Text>
          </View>
          
          <View style={[styles.performanceItem, { backgroundColor: colors.border }]}>
            <Text style={[styles.performanceMain, { color: colors.text }]}>
              {cumulativePoints.toLocaleString()}
            </Text>
            <Text style={[styles.performanceSub, { color: colors.textSecondary }]}>
              Total Points
            </Text>
          </View>
          
          <View style={[styles.performanceItem, { backgroundColor: colors.border }]}>
            <Text style={[styles.performanceMain, { color: colors.text }]}>
              {quickQuizStats.uniqueQuizzesPassed}/40
            </Text>
            <Text style={[styles.performanceSub, { color: colors.textSecondary }]}>
              Quizzes Passed
            </Text>
          </View>
          
          <View style={[styles.performanceItem, { backgroundColor: colors.border }]}>
            <Text style={[styles.performanceMain, { color: colors.text }]}>
              {quickQuizStats.uniqueUnitTestsPassed}/10
            </Text>
            <Text style={[styles.performanceSub, { color: colors.textSecondary }]}>
              Unit Tests Passed
            </Text>
          </View>

          <View style={[styles.performanceItem, { backgroundColor: colors.border }]}>
            <Text style={[styles.performanceMain, { color: colors.text }]}>
              {quickQuizStats.dailyChallengesPassed}
            </Text>
            <Text style={[styles.performanceSub, { color: colors.textSecondary }]}>
              Daily Challenges Passed
            </Text>
          </View>
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
  performanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  performanceItem: {
    flex: 1,
    minWidth: '47%',
    textAlign: 'center',
    padding: 12,
    borderRadius: SHAPES.borderRadius,
    alignItems: 'center',
  },
  performanceMain: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  performanceSub: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
})