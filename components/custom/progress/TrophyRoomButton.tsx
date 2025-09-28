import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { useAppState } from '@/state/useAppState'
import { AchievementQuickStats } from '@/types/achievement.types'
import { router } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export default function TrophyRoomButton() {
  const { colors } = useSystemTheme()
  const achievementQuickStats: AchievementQuickStats = useAppState((state) => state.achievementQuickStats)

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: SHAPES.borderRadius,
        backgroundColor: colors.primary + '40',
        borderWidth: SHAPES.buttonBorderWidth,
        borderColor: colors.primary,
      }}
      onPress={() => router.push('/(tabs)/progress/trophy-case-screen')}
    >
      <View style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primary + '60',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
      }}>
        <Text style={{ fontSize: 24 }}>🏆</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ 
          fontSize: 18, 
          fontWeight: '700', 
          color: colors.text, 
          marginBottom: 2 
        }}>
          Trophy Room
        </Text>
        <Text style={{ 
          fontSize: 14, 
          fontWeight: '500', 
          color: colors.textSecondary 
        }}>
          {achievementQuickStats.totalEarnedAchievements > 0 
            ? `View your ${achievementQuickStats.totalEarnedAchievements} achievement${achievementQuickStats.totalEarnedAchievements === 1 ? '' : 's'}!`
            : 'View all achievements earned!'
          }
        </Text>
      </View>
    </TouchableOpacity>
  )
}