import { AcheivementEvaluationResult, AchievementEvaluationContext, BadgeDefinition, DerivedStats, EarnedAchievement } from "@/types/achievement.types"
import { QuizResult } from "@/types/quiz.types"
import { DateService } from "./DateService"

class AchievementEvaluationService {
  evaluateAchievements(context: AchievementEvaluationContext, badgeDefinitions: BadgeDefinition[]): AcheivementEvaluationResult {
    // Calculate derived stats from quiz history
    const stats = this.calculateDerivedStats(context)
    
    // Award medals/trophies based on current quiz
    const medalsEarned = this.evaluateMedals(context.currentQuiz, context.existingAchievements)
    const trophiesEarned = this.evaluateTrophies(context.currentQuiz, context.existingAchievements)
    
    // Evaluate badges based on current state + new quiz
    const badgesEarned = this.evaluateBadges(context, badgeDefinitions, stats)
    
    return {
      badgesEarned,
      medalsEarned,
      trophiesEarned
    }
  }

  calculateDerivedStats(context: AchievementEvaluationContext): DerivedStats {
    const { quizHistory, currentQuiz, cumulativePointsBeforeThis } = context
    
    // Count custom quizzes completed (including current if custom)
    const customQuizzesCompleted = quizHistory.filter((quiz: QuizResult) => 
      quiz.testType === 'custom' && quiz.passed
    ).length + (currentQuiz.testType === 'custom' && currentQuiz.passed ? 1 : 0)
    
    // Count gauntlets completed (including current if gauntlet)
    const gauntletsCompleted = quizHistory.filter((quiz: QuizResult) => 
      quiz.testType === 'weekly_gauntlet' && quiz.passed
    ).length + (currentQuiz.testType === 'weekly_gauntlet' && currentQuiz.passed ? 1 : 0)
    
    // Find completed tiers (unit tests that were passed)
    const historicalTiers = quizHistory
      .filter((quiz: QuizResult) => quiz.testType === 'unit_test' && quiz.passed && quiz.tier)
      .map((quiz: QuizResult) => quiz.tier!)
    
    // Add current tier if it's a passed unit test
    const currentTierCompleted = currentQuiz.testType === 'unit_test' && currentQuiz.passed && currentQuiz.tier
      ? [currentQuiz.tier!] : []
    
    const completedTiers = [...new Set([...historicalTiers, ...currentTierCompleted])]
    
    // Calculate new points total (before + earned from current quiz)
    const newPointsTotal = cumulativePointsBeforeThis + (currentQuiz.points || 0)
    
    return {
      customQuizzesCompleted,
      gauntletsCompleted,
      completedTiers,
      newPointsTotal
    }
  }

  evaluateMedals(
    currentQuiz: QuizResult,
    existingAchievements: EarnedAchievement[]
  ): EarnedAchievement[] {
    
    // Only award medals for regular quizzes that pass (70%+)
    if (currentQuiz.testType !== 'regular' || !currentQuiz.passed || currentQuiz.score < 70) {
      return []
    }
    
    // Check if medal already exists for this specific quiz
    const medalAlreadyExists = existingAchievements.some((achievement: EarnedAchievement) => 
      achievement.type === 'medal' &&
      achievement.tier === currentQuiz.tier &&
      achievement.quiz_number === currentQuiz.quizNumber &&
      achievement.award_level === awardLevel
    )
    
    if (medalAlreadyExists) {
      return []
    }
    
    // Determine award level
    let awardLevel: 'bronze' | 'silver' | 'gold'
    if (currentQuiz.score >= 90) {
      awardLevel = 'gold'
    } else if (currentQuiz.score >= 80) {
      awardLevel = 'silver'
    } else {
      awardLevel = 'bronze'
    }
    
    const medal: EarnedAchievement = {
      // Badge-inherited properties (mostly empty for medals)
      id: `medal_${currentQuiz.tier}_${currentQuiz.quizNumber}_${Date.now()}`,
      title: `Tier ${currentQuiz.tier} Quiz ${currentQuiz.quizNumber}`,
      description: `Earned ${awardLevel} medal with ${currentQuiz.score}% score`,
      emoji: awardLevel === 'gold' ? '🥇' : awardLevel === 'silver' ? '🥈' : '🥉',
      rarity: 'common',
      badgeType: 'completion',
      triggers: ['regular'],
      criteria: {},
      
      // Achievement-specific properties
      earnedDateTime: DateService.getLocalISOString(),
      type: 'medal',
      tier: currentQuiz.tier || undefined,
      quiz_number: currentQuiz.quizNumber || undefined,
      is_unit_test: false,
      award_level: awardLevel,
      score: currentQuiz.score
    }
    
    return [medal]
  }
  
  evaluateTrophies(
    currentQuiz: QuizResult,
    existingAchievements: EarnedAchievement[]
  ): EarnedAchievement[] {
    
    // Only award trophies for unit tests that pass (70%+)
    if (currentQuiz.testType !== 'unit_test' || !currentQuiz.passed || currentQuiz.score < 70) {
      return []
    }
    
    // Check if trophy already exists for this specific unit test
    const trophyAlreadyExists = existingAchievements.some((achievement: EarnedAchievement) => 
      achievement.type === 'trophy' &&
      achievement.tier === currentQuiz.tier &&
      achievement.is_unit_test === true &&
      achievement.award_level === awardLevel
    )
    
    if (trophyAlreadyExists) {
      return []
    }
    
    // Determine trophy size
    const awardLevel = currentQuiz.score >= 85 ? 'large_trophy' : 'small_trophy'
    
    const trophy: EarnedAchievement = {
      // Badge-inherited properties (mostly empty for trophies)
      id: `trophy_${currentQuiz.tier}_${Date.now()}`,
      title: `Tier ${currentQuiz.tier} Unit Test`,
      description: `Earned ${awardLevel === 'large_trophy' ? 'large' : 'small'} trophy with ${currentQuiz.score}% score`,
      emoji: awardLevel === 'large_trophy' ? '🏆✨' : '🏆',
      rarity: awardLevel === 'large_trophy' ? 'epic' : 'rare',
      badgeType: 'completion',
      triggers: ['unit_test'],
      criteria: {},
      
      // Achievement-specific properties
      earnedDateTime: DateService.getLocalISOString(),
      type: 'trophy',
      tier: currentQuiz.tier || undefined,
      quiz_number: undefined,
      is_unit_test: true,
      award_level: awardLevel,
      score: currentQuiz.score
    }
    
    return [trophy]
  }
  
  evaluateBadges(
    context: AchievementEvaluationContext,
    badgeDefinitions: BadgeDefinition[],
    stats: DerivedStats
  ): EarnedAchievement[] {
    
    const newBadges: EarnedAchievement[] = []
    const { currentQuiz, existingAchievements } = context
    
    for (const badgeDefinition of badgeDefinitions) {
      // Check if badge already earned
      const alreadyEarned = existingAchievements.some((achievement: EarnedAchievement) => 
        achievement.type === 'badge' && achievement.id === badgeDefinition.id
      )
      
      if (alreadyEarned) {
        continue
      }
      
      // Check if current quiz type can trigger this badge
      if (!badgeDefinition.triggers.includes(currentQuiz.testType as any) && 
          !badgeDefinition.triggers.includes('points') && 
          !badgeDefinition.triggers.includes('streak')) {
        continue
      }
      
      // Evaluate badge criteria
      const isEligible = this.evaluateBadgeCriteria(badgeDefinition, context, stats)
      
      if (isEligible) {
        const badge: EarnedAchievement = {
          ...badgeDefinition,
          earnedDateTime: DateService.getLocalISOString(),
          type: 'badge'
        }
        
        newBadges.push(badge)
      }
    }
    
    return newBadges
  }
  
  evaluateBadgeCriteria(
    badgeDefinition: BadgeDefinition,
    context: AchievementEvaluationContext,
    stats: DerivedStats
  ): boolean {
    
    const { criteria } = badgeDefinition
    const { currentQuiz } = context
    
    // Points milestone badges
    if (criteria.minimumPoints) {
      return stats.newPointsTotal >= criteria.minimumPoints
    }
    
    // Completion badges (custom, gauntlet, daily)
    if (criteria.minimumCompleted) {
      if (badgeDefinition.triggers.includes('custom')) {
        return stats.customQuizzesCompleted >= criteria.minimumCompleted
      }
      if (badgeDefinition.triggers.includes('weekly_gauntlet')) {
        return stats.gauntletsCompleted >= criteria.minimumCompleted
      }
      if (badgeDefinition.triggers.includes('daily_challenge')) {
        // TODO: Implement daily challenge completion counting
        // For now, assume currentQuiz completion counts toward this
        return currentQuiz.testType === 'daily_challenge' && criteria.minimumCompleted === 1
      }
    }
    
    // Tier completion badges
    if (criteria.tierCompleted) {
      return stats.completedTiers.includes(criteria.tierCompleted)
    }
    
    // Streak badges - TODO: Implement when daily streaks are available
    if (criteria.minimumStreak) {
      // Placeholder - return false for now since streak data not available
      return false
    }
    
    return false
  }


























}

// 🏆 EXPORT THE CLEAN ORCHESTRATOR QUIZ SERVICE!
const achievementEvaluationService = new AchievementEvaluationService()
export default achievementEvaluationService