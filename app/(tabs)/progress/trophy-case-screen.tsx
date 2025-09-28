import AchievementSummaryCard from '@/components/custom/progress/AchievementSummaryCard'
import AchievementGrid from '@/components/custom/trophy-room/AchievementGrid'
import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function TrophyCaseScreen() {
  const insets = useSafeAreaInsets()
  const { colors } = useSystemTheme()

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* Back Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Trophy Case</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Your unified collection of achievements and excellence
          </Text>
        </View>

        {/* Achievement Summary Card */}
        <AchievementSummaryCard />

        {/* Achievement Grid */}
        <AchievementGrid />

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SHAPES.standardHeaderHorizontalMargin,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
  },
  backText: {
    fontSize: 18,
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SHAPES.standardBodyHorizontalMargin,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
})