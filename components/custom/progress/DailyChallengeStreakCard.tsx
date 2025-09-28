import Card from '@/components/custom/Card'
import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
// import useAchievementState from '@/state/useAchievementState'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function DailyChallengeStreakCard() {
  const { colors } = useSystemTheme()
  // const { getStreakData } = useAchievementState()

  // const streakData = getStreakData()

  return (
    <Card variant="default" margin={0}>
      <Text style={[styles.cardTitle, { color: colors.text }]}>🔥 Daily Challenge Streaks</Text>
      
      <View style={[styles.streakContainer, styles.streakContainerRow]}>
        {/* Current Streak */}
        {/* <View style={[
          styles.streakCard,
          { backgroundColor: colors.border },
          styles.streakCardHalf
        ]}>
          <View style={styles.streakHeader}>
            <Text style={[styles.streakTitle, { color: colors.text }]}>Current Streak</Text>
          </View>
          
          <Text style={[styles.streakCurrent, { color: colors.primary }]}>
            {streakData.dailyChallengeStreak} day{streakData.dailyChallengeStreak !== 1 ? 's' : ''}
          </Text> */}
          
          {/* Continue Streak Badge */}
          {/* {streakData.needsDailyChallenge && (
            <View style={[styles.continueStreakBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.continueStreakText}>
                📅 Take today's challenge to continue!
              </Text>
            </View>
          )}
        </View> */}
        
        {/* Best Streak */}
        <View style={[
          styles.streakCard,
          { backgroundColor: colors.border },
          styles.streakCardHalf
        ]}>
          <View style={styles.streakHeader}>
            <Text style={[styles.streakTitle, { color: colors.text }]}>Best Streak</Text>
          </View>
          
          {/* <Text style={[styles.streakCurrent, { color: colors.primary }]}>
            {streakData.dailyChallengeLongestStreak} day{streakData.dailyChallengeLongestStreak !== 1 ? 's' : ''}
          </Text> */}
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
  streakContainer: {
    gap: 4,
  },
  streakContainerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  streakCard: {
    borderRadius: SHAPES.borderRadius,
    padding: 16,
    marginBottom: 0,
  },
  streakCardHalf: {
    flex: 0,
    width: '48%',
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  streakTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  streakCurrent: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  continueStreakBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
  },
  continueStreakText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
})