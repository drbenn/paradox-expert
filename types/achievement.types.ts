// 🏆 ACHIEVEMENT TYPES - FINAL CLEAN VERSION
// Complete replacement for Achievement.types.ts

import { QuizResult } from "./quiz.types"

// Trigger types for badge evaluation
export type BadgeTrigger = 'regular' | 'unit_test' | 'daily_challenge' | 'custom' | 'weekly_gauntlet' | 'points' | 'streak'

// Badge criteria configuration
export interface BadgeCriteria {
  minimumCompleted?: number  // How many of X completed
  minimumStreak?: number     // Consecutive daily challenges
  minimumPoints?: number     // Total points accumulated
  tierCompleted?: number     // Specific tier completion (5 or 10)
}

// Badge definition (stored as JSON)
export interface BadgeDefinition {
  id: string
  title: string
  description: string
  emoji: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  badgeType: 'completion' | 'streak' | 'milestone'
  triggers: BadgeTrigger[]
  criteria: BadgeCriteria
}

// Unified earned achievement (handles badges, medals, trophies)
export interface EarnedAchievement {  // extends BadgeDefinition
  id: string
  title: string
  description: string
  emoji: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  badgeType: 'completion' | 'streak' | 'milestone'
  triggers: BadgeTrigger[]
  criteria: BadgeCriteria

  earnedDateTime: string  // ISO string with full date/time
  type: 'badge' | 'medal' | 'trophy'
  
  // Medal/Trophy specific properties (undefined for badges)
  tier?: number           // Which tier (1-10)
  quiz_number?: number    // Which quiz (1-4 for regular, undefined for unit test)
  is_unit_test?: boolean  // True for trophies, false for medals
  award_level?: 'bronze' | 'silver' | 'gold' | 'small_trophy' | 'large_trophy'
  score?: number          // The score that earned this achievement
}

// For backward compatibility during migration
export interface LegacyUserTrophy {
  id?: number
  tier: number
  quiz_number: number
  trophy_type: 'quiz_medal' | 'unit_trophy'
  award_level: 'bronze' | 'silver' | 'gold' | 'small_trophy' | 'large_trophy'
  score: number
  earned_date: string
  is_unit_test: boolean
  created_at?: string
  updated_at?: string
}

export interface AchievementEvaluationContext {
  currentQuiz: QuizResult
  quizHistory: QuizResult[]                    // Service calculates stats from this
  cumulativePointsBeforeThis: number          // For points threshold detection
  existingAchievements: EarnedAchievement[]    // To prevent duplicates
}

export interface AcheivementEvaluationResult {
  badgesEarned: EarnedAchievement[]
  medalsEarned: EarnedAchievement[]
  trophiesEarned: EarnedAchievement[]
}

// only for use in AchievementEvaluationService
export interface DerivedStats {
  customQuizzesCompleted: number
  gauntletsCompleted: number
  completedTiers: number[]
  newPointsTotal: number
}

export interface AchievementQuickStats {
  bronzeMedals: number
  silverMedals: number
  goldMedals: number
  smallTrophies: number
  largeTrophies: number
  badges: number
  badgesAvalaible: number
  totalEarnedAchievements: number
}