import AnimatedTabWrapper, { TabAnimationPresets } from '@/components/custom/AnimatedTabWrapper'
import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import React from 'react'
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// Import the new components

import AchievementSummaryCard from '@/components/custom/progress/AchievementSummaryCard'
import OverallProgressCard from '@/components/custom/progress/OverallProgressCard'
import PerformanceStatsCard from '@/components/custom/progress/PerformanceStatsCard'
import StatsGrid from '@/components/custom/progress/StatsGrid'
import TrophyRoomButton from '@/components/custom/progress/TrophyRoomButton'

export default function ProgressIndexScreen() {
  const insets = useSafeAreaInsets()
  const { colors } = useSystemTheme()
  
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <AnimatedTabWrapper {...TabAnimationPresets.veniceBeachFade}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContentContainer, {paddingTop: insets.top, paddingBottom: insets.bottom + 80 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Progress</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Track your learning journey
            </Text>
          </View>

          {/* Overall Progress Card */}
          <OverallProgressCard />

          {/* Stats Grid */}
          <View style={{ marginBottom: SHAPES.standardVerticalMargin }}>
            <StatsGrid />
          </View>

          {/* Achievement Summary Card */}
          <AchievementSummaryCard />

          {/* Trophy Room Button */}
          <TrophyRoomButton />

          {/* Daily Challenge Streak Card */}
          <View style={{ paddingTop: SHAPES.standardVerticalMargin }}>
            {/* <DailyChallengeStreakCard /> */}
          </View>

          {/* Performance Stats Card */}
          <View style={{ paddingTop: SHAPES.standardVerticalMargin }}>
            <PerformanceStatsCard />
          </View>

        </ScrollView>
      </AnimatedTabWrapper>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
    paddingTop: SHAPES.standardVerticalMargin,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
})