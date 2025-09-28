import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { EarnedAchievement } from '@/types/achievement.types'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface AchievementCardProps {
  achievement: EarnedAchievement
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const { colors } = useSystemTheme()

  // Get tier color based on tier number
  const getTierColor = (tier: number): string => {
    const tierColors = [
      '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444',
      '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
    ]
    return tierColors[tier - 1] || '#10B981'
  }

  // Get tier name based on tier number
  const getTierName = (tier: number): string => {
    const tierNames = [
      'Novice', 'Apprentice', 'Scholar', 'Expert', 'Master',
      'Sage', 'Virtuoso', 'Legend', 'Mythic', 'Transcendent'
    ]
    return tierNames[tier - 1] || 'Unknown'
  }

  // Get achievement color based on type
  const getAchievementColor = (): string => {
    if ((achievement.type === 'medal' || achievement.type === 'trophy') && achievement.tier) {
      return getTierColor(achievement.tier)
    }
    
    if (achievement.type === 'badge' && achievement.rarity) {
      switch (achievement.rarity) {
        case 'common': return '#10B981'
        case 'rare': return '#3B82F6'
        case 'epic': return '#8B5CF6'
        case 'legendary': return '#F59E0B'
        default: return '#10B981'
      }
    }
    
    return colors.primary
  }

  // Get header text based on achievement type
  const getHeaderText = (): string => {
    if ((achievement.type === 'medal' || achievement.type === 'trophy') && achievement.tier) {
      return `Tier ${achievement.tier} • ${getTierName(achievement.tier)}`
    }
    
    if (achievement.type === 'badge' && achievement.rarity) {
      const rarityEmoji = {
        common: '🟢',
        rare: '🔵', 
        epic: '🟣',
        legendary: '🟡'
      }[achievement.rarity] || '🟢'
      
      return `${rarityEmoji} ${achievement.rarity.toUpperCase()}`
    }
    
    return 'ACHIEVEMENT'
  }

  // Get subtitle based on achievement type
  const getSubtitle = (): string => {
    if (achievement.type === 'medal' || achievement.type === 'trophy') {
      return achievement.award_level?.replace('_', ' ').toUpperCase() || ''
    }
    
    if (achievement.type === 'badge') {
      return achievement.description || ''
    }
    
    return ''
  }

  // Get additional info (score for medals/trophies)
  const getAdditionalInfo = (): React.ReactNode => {
    if ((achievement.type === 'medal' || achievement.type === 'trophy') && achievement.score) {
      return (
        <View style={styles.additionalInfo}>
          <Text style={[styles.scoreText, { color: colors.textSecondary }]}>
            Score: {achievement.score}%
          </Text>
        </View>
      )
    }
    
    return null
  }

  // Get earned date from earnedDateTime
  const getEarnedDate = (): string => {
    if (!achievement.earnedDateTime) {
      return new Date().toLocaleDateString()
    }
    
    try {
      return new Date(achievement.earnedDateTime).toLocaleDateString()
    } catch (error) {
      return new Date().toLocaleDateString()
    }
  }

  const achievementColor = getAchievementColor()

  return (
    <View
      style={[
        styles.achievementCard,
        { 
          backgroundColor: colors.surface,
          borderColor: achievementColor
        }
      ]}
    >
      {/* Achievement Header */}
      <View style={[styles.achievementHeader, { backgroundColor: achievementColor + '20' }]}>
        <Text style={[styles.headerText, { color: achievementColor }]}>
          {getHeaderText()}
        </Text>
      </View>
      
      {/* Achievement Content */}
      <View style={styles.achievementContent}>
        <Text style={styles.achievementEmoji}>
          {achievement.emoji}
        </Text>
        
        <Text style={[styles.achievementTitle, { color: colors.text }]}>
          {achievement.title}
        </Text>
        
        <Text style={[styles.achievementSubtitle, { color: achievementColor }]}>
          {getSubtitle()}
        </Text>
        
        {/* Additional info (like score) */}
        {getAdditionalInfo()}
        
        {/* Earned date */}
        <Text style={[styles.achievementDate, { color: colors.textSecondary }]}>
          {getEarnedDate()}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  achievementCard: {
    flex: 1,
    maxWidth: '48%',
    minWidth: 150,
    borderRadius: SHAPES.borderRadius,
    borderWidth: SHAPES.cardBorderWidth,
    overflow: 'hidden',
    marginBottom: 12,
  },
  achievementHeader: {
    padding: 8,
  },
  headerText: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  achievementContent: {
    padding: 16,
    alignItems: 'center',
  },
  achievementEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementSubtitle: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  additionalInfo: {
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '600',
  },
  achievementDate: {
    fontSize: 10,
    fontWeight: '500',
  },
})

export default AchievementCard