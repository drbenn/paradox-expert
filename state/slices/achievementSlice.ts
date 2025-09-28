import { AcheivementEvaluationResult, AchievementQuickStats, BadgeDefinition, EarnedAchievement } from '@/types/achievement.types';
import { StateCreator } from 'zustand';
import badgesData from '../../assets/data/badges.json';

export interface AchievementSlice {
  // General UI State
  allBadges: BadgeDefinition[]
  isBadgesLoaded: boolean

  earnedAchievements: EarnedAchievement[]
  achievementQuickStats: AchievementQuickStats
  
  // Actions
  loadAllBadges: () => void
  addAchievementsToHistory: (acheivementEvaluationResult: AcheivementEvaluationResult) => void
  updateAchievementQuickStats: (acheivementEvaluationResult: AcheivementEvaluationResult) => void
}

export const achievementSlice: StateCreator<
  any, // Full app state - avoid circular dependency
  [],
  [],
  AchievementSlice
> = (set, get) => ({
  // Initial state
  allBadges: [],
  isBadgesLoaded: false,
  earnedAchievements: [],
  achievementQuickStats: {
    bronzeMedals: 0,
    silverMedals: 0,
    goldMedals: 0,
    smallTrophies: 0,
    largeTrophies: 0,
    badges: 0,
    badgesAvalaible: 0,
    totalEarnedAchievements: 0,
  },

  // Actions
  loadAllBadges: () => {
    console.log('loading badges...')
    
    const { allBadges, isBadgesLoaded } = get()

    // Don't reload if already loaded (prevents overwriting user progress)
    if (allBadges.length > 0 && !isBadgesLoaded) {
      logger.log(`✅ : Loaded ${allBadges.length} badges already loaded in persistent memory`)
      set({ isBadgesLoaded: true })
      return
    }

    try {
      const badges = badgesData as BadgeDefinition[]
      logger.log(`✅ : Loaded ${badges.length} badges from JSON`)
      
      set({ 
        allBadges: badges, 
        isBadgesLoaded: true,
        achievementQuickStats: {
          bronzeMedals: 0,
          silverMedals: 0,
          goldMedals: 0,
          smallTrophies: 0,
          largeTrophies: 0,
          badges: 0,
          badgesAvalaible: allBadges.length,
          totalEarnedAchievements: 0,
        },
      })
    } catch (error) {
      logger.error('❌ : Error loading badges:', error)
      set({ 
        allBadges: [],
        isBadgesLoaded: false 
      })
    }
  },
  addAchievementsToHistory: (result: AcheivementEvaluationResult): void => {
    const consolidatedResults: EarnedAchievement[] = [...result.badgesEarned, ...result.medalsEarned, ...result.trophiesEarned]
    logger.log('✅ addAchievementsToHistory updating with new achievement count of: ', consolidatedResults.length)
    const { earnedAchievements } = get()
    set({ earnedAchievements: [...earnedAchievements, ...consolidatedResults]})
    get().updateAchievementQuickStats(result)
  },
  updateAchievementQuickStats: (result: AcheivementEvaluationResult): void => {
    let { achievementQuickStats } = get()

    let newEarnedCount: number = 0;

    if (result.medalsEarned && result.medalsEarned.length) {
      result.medalsEarned.forEach((m: EarnedAchievement) => {
        newEarnedCount++
        if (m.award_level === 'bronze') achievementQuickStats.bronzeMedals += 1
        else if (m.award_level === 'silver') achievementQuickStats.silverMedals += 1
        else if (m.award_level === 'gold') achievementQuickStats.goldMedals += 1
      })
    }

    if (result.trophiesEarned && result.trophiesEarned.length) {
      result.medalsEarned.forEach((t: EarnedAchievement) => {
        newEarnedCount++
        if (t.award_level === 'small_trophy') achievementQuickStats.smallTrophies += 1
        else if (t.award_level === 'large_trophy') achievementQuickStats.largeTrophies += 1
      })
    }

    if (result.badgesEarned && result.badgesEarned.length) {
      result.badgesEarned.forEach((b: EarnedAchievement) => {
        newEarnedCount++
        achievementQuickStats.badges += 1
      })
    }

    // add count of new earned badges to total count
    achievementQuickStats.totalEarnedAchievements = achievementQuickStats.totalEarnedAchievements += newEarnedCount

    logger.log('✅ updateAchievementQuickStats updating with new quick stats of: ', achievementQuickStats)
    set({achievementQuickStats: achievementQuickStats})
  }
});