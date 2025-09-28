import Card from '@/components/custom/Card'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { useAppState } from '@/state/useAppState'
import { AchievementQuickStats } from '@/types/achievement.types'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function AchievementSummaryCard() {
  const { colors } = useSystemTheme()
  const achievementQuickStats: AchievementQuickStats = useAppState((state) => state.achievementQuickStats)

  return (
    <Card variant="default">
      <Text style={[styles.achievementTitle, { color: colors.text }]}>Achievement Collection</Text>

      <View style={styles.achievementGrid}>
        <View style={styles.achievementItem}>
          <Text style={styles.achievementIcon}>🥉</Text>
          <Text style={[styles.achievementCount, { color: colors.text }]}>{achievementQuickStats.bronzeMedals || 0}</Text>
          <Text style={[styles.achievementLabel, { color: colors.textSecondary }]}>Bronze</Text>
        </View>
        <View style={styles.achievementItem}>
          <Text style={styles.achievementIcon}>🥈</Text>
          <Text style={[styles.achievementCount, { color: colors.text }]}>{achievementQuickStats.silverMedals || 0}</Text>
          <Text style={[styles.achievementLabel, { color: colors.textSecondary }]}>Silver</Text>
        </View>
        <View style={styles.achievementItem}>
          <Text style={styles.achievementIcon}>🥇</Text>
          <Text style={[styles.achievementCount, { color: colors.text }]}>{achievementQuickStats.goldMedals || 0}</Text>
          <Text style={[styles.achievementLabel, { color: colors.textSecondary }]}>Gold</Text>
        </View>
        <View style={styles.achievementItem}>
          <Text style={styles.achievementIcon}>🏆</Text>
          <Text style={[styles.achievementCount, { color: colors.text }]}>
            {(achievementQuickStats.smallTrophies + achievementQuickStats.largeTrophies) || 0}
          </Text>
          <Text style={[styles.achievementLabel, { color: colors.textSecondary }]}>Trophies</Text>
        </View>
      </View>
      
      <Text style={[styles.badgesSummary, { color: colors.text }]}>
        🎖️ {achievementQuickStats.badges || 0} badge{achievementQuickStats.badges === 1 ? '' : 's'} unlocked
      </Text>
    </Card>
  )
}

const styles = StyleSheet.create({
  achievementTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  achievementGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
  },
  achievementItem: {
    alignItems: 'center',
    flex: 1,
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  achievementCount: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  achievementLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  totalAwards: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  badgesSummary: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center'
  },
})