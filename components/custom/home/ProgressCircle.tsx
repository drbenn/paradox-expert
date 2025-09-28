import { useSystemTheme } from '@/hooks/useSystemTheme'
import { useAppState } from '@/state/useAppState'
import { QuizLearnedFallacyStats } from '@/types/app.types'
import { router } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export default function ProgressCircle() {
  const { colors } = useSystemTheme()
  const learnedStats: QuizLearnedFallacyStats = useAppState((state) => state.learnedStats)
  const cumulativePoints: number = useAppState((state) => state.cumulativePoints)
  const progressPercentage = (learnedStats.totalLearned / learnedStats.totalFallacies) * 100

  return (
    <TouchableOpacity onPress={() => router.push('/(tabs)/progress')}>
      <View style={{
        alignItems: 'center',
        padding: 30,
        marginBottom: 0,
      }}>
        <View style={{
          width: 150,
          height: 150,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          
          {/* GRAY BACKGROUND CIRCLE */}
          <View style={{
            width: 180,
            height: 180,
            borderRadius: 105,
            backgroundColor: colors.border,
            position: 'absolute',
          }} />
          
          {/* PURPLE FILL CIRCLE - FIXED ORIENTATION */}
          <View style={{
            width: 180,
            height: 180,
            borderRadius: 105,
            backgroundColor: colors.primary,
            position: 'absolute',
            overflow: 'hidden',
            transform: [{ rotate: '0deg' }],
          }}>
            {/* GRAY OVERLAY TO MASK THE UNFILLED PART */}
            <View style={{
              width: 180,
              height: 180 * (1 - progressPercentage / 100),
              backgroundColor: colors.border,
              position: 'absolute',
              top: 0,
            }} />
          </View>
          
          {/* CENTER HOLE */}
          <View style={{
            width: 110,
            height: 110,
            borderRadius: 90,
            backgroundColor: colors.background,
            position: 'absolute',
            zIndex: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{ color: colors.primary, fontSize: 24, fontWeight: 'bold' }}>
              {learnedStats.totalLearned}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 10, textTransform: 'uppercase' }}>
              LEARNED
            </Text>
          </View>
        </View>
        
        <Text style={{ color: colors.primary, fontSize: 24, fontWeight: 'bold', marginTop: 32, marginBottom: 8 }}>
          {Math.round(cumulativePoints)} Total Points
        </Text>
      </View>
    </TouchableOpacity>
  )
}