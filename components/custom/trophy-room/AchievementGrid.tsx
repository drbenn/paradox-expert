import Card from '@/components/custom/Card'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { useAppState } from '@/state/useAppState'
import { EarnedAchievement } from '@/types/achievement.types'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import AchievementCard from './AchievementCard'

export default function AchievementGrid() {
  const { colors } = useSystemTheme()
  const earnedAchievements = useAppState((state) => state.earnedAchievements)

  // Sort achievements by earnedDateTime (newest first)
  const sortedAchievements = earnedAchievements
    .slice()
    .sort((a: EarnedAchievement, b: EarnedAchievement) => {
      const dateA = new Date(a.earnedDateTime).getTime()
      const dateB = new Date(b.earnedDateTime).getTime()
      return dateB - dateA
    })

  return (
    <Card variant="default">
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        🏆 Achievement Collection ({earnedAchievements.length})
      </Text>
      
      {earnedAchievements.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🏆</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No Achievements Yet
          </Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Complete quizzes and challenges to start earning medals, trophies, and badges!
          </Text>
        </View>
      ) : (
        <View style={styles.achievementGrid}>
          {sortedAchievements.map((achievement: EarnedAchievement, index: number) => {
            // Generate unique key using achievement ID and earnedDateTime
            const uniqueKey = `${achievement.id}-${achievement.earnedDateTime}-${index}`
            
            return (
              <AchievementCard
                key={uniqueKey}
                achievement={achievement}
              />
            )
          })}
        </View>
      )}
    </Card>
  )
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
})