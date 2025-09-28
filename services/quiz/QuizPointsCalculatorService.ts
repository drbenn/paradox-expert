import { QuizPointsEarned, TestType } from "@/types/quiz.types"

class QuizPointsCalculatorService {
  // 🎯 BASE POINT VALUES
  private readonly POINTS = {
    REGULAR_QUIZ: 10,
    UNIT_TEST: 20,
    DAILY_CHALLENGE: 15,
    WEEKLY_GAUNTLET: 100,
    CUSTOM_QUIZ: 5 // Base value, could scale with length
  }

  // 🏆 BONUS MULTIPLIERS
  private readonly BONUSES = {
    PERFECT_SCORE: 1.5,    // 100% score = 1.5x points
    GOLD_MEDAL: 1.2,       // 90%+ score = 1.2x points
    SILVER_MEDAL: 1.1,     // 80-89% score = 1.1x points
    STREAK_3: 1.1,         // 3+ day streak = 1.1x points
    STREAK_7: 1.2,         // 7+ day streak = 1.2x points
    STREAK_30: 1.5         // 30+ day streak = 1.5x points
  }

  // 🎯 CALCULATE POINTS FOR QUIZ COMPLETION
  calculateQuizPoints(
    testType: TestType,
    score: number,
    currentStreak: number = 0
  ): QuizPointsEarned {
    // Determine base points
    let basePoints = 0
    switch (testType) {
      case 'regular':
        basePoints = this.POINTS.REGULAR_QUIZ
        break
      case 'unit_test':
        basePoints = this.POINTS.UNIT_TEST
        break
      case 'daily_challenge':
        basePoints = this.POINTS.DAILY_CHALLENGE
        break
      case 'weekly_gauntlet':
        basePoints = this.POINTS.WEEKLY_GAUNTLET
        break
      case 'custom':
        basePoints = this.POINTS.CUSTOM_QUIZ
        break
    }

    // Calculate bonus multiplier
    let bonusMultiplier = 1.0
    let bonusReasons: string[] = []

    // Score-based bonuses
    if (score === 100) {
      bonusMultiplier *= this.BONUSES.PERFECT_SCORE
      bonusReasons.push('Perfect Score!')
    } else if (score >= 90) {
      bonusMultiplier *= this.BONUSES.GOLD_MEDAL
      bonusReasons.push('Gold Medal!')
    } else if (score >= 80) {
      bonusMultiplier *= this.BONUSES.SILVER_MEDAL
      bonusReasons.push('Silver Medal!')
    }

    // Streak bonuses (only for daily challenges)
    if (testType === 'daily_challenge') {
      if (currentStreak >= 30) {
        bonusMultiplier *= this.BONUSES.STREAK_30
        bonusReasons.push('30-Day Streak!')
      } else if (currentStreak >= 7) {
        bonusMultiplier *= this.BONUSES.STREAK_7
        bonusReasons.push('7-Day Streak!')
      } else if (currentStreak >= 3) {
        bonusMultiplier *= this.BONUSES.STREAK_3
        bonusReasons.push('3-Day Streak!')
      }
    }

    const bonusPoints = Math.round(basePoints * (bonusMultiplier - 1))
    const totalPoints = Math.round(basePoints * bonusMultiplier)

    return {
      basePoints,
      bonusPoints,
      totalPoints,
      reason: bonusReasons.length > 0 ? bonusReasons.join(' + ') : 'Base points'
    }
  }

  // 🏅 CALCULATE STREAK BONUS
  calculateStreakBonus(currentStreak: number): number {
    if (currentStreak >= 30) return this.BONUSES.STREAK_30
    if (currentStreak >= 7) return this.BONUSES.STREAK_7
    if (currentStreak >= 3) return this.BONUSES.STREAK_3
    return 1.0
  }

  // 🎯 GET POINT VALUE DISPLAY
  getPointsDisplay(
    quizType: 'regular' | 'unit_test' | 'daily_challenge' | 'weekly_gauntlet' | 'custom'
  ): string {
    switch (quizType) {
      case 'regular':
        return `${this.POINTS.REGULAR_QUIZ} pts`
      case 'unit_test':
        return `${this.POINTS.UNIT_TEST} pts`
      case 'daily_challenge':
        return `${this.POINTS.DAILY_CHALLENGE} pts`
      case 'weekly_gauntlet':
        return `${this.POINTS.WEEKLY_GAUNTLET} pts`
      case 'custom':
        return `${this.POINTS.CUSTOM_QUIZ}+ pts`
      default:
        return '0 pts'
    }
  }

  // 🏆 GET NEXT MILESTONE
  getNextMilestone(currentPoints: number): { milestone: number; pointsNeeded: number } {
    const milestones = [100, 250, 500, 1000, 2500, 5000, 10000]
    
    for (const milestone of milestones) {
      if (currentPoints < milestone) {
        return {
          milestone,
          pointsNeeded: milestone - currentPoints
        }
      }
    }
    
    // If they've passed all milestones, next is every 10k
    const nextMilestone = Math.ceil(currentPoints / 10000) * 10000
    return {
      milestone: nextMilestone,
      pointsNeeded: nextMilestone - currentPoints
    }
  }
}

// 🏆 EXPORT THE CLEAN ORCHESTRATOR QUIZ SERVICE!
const quizPointsCalculatorService = new QuizPointsCalculatorService()
export default quizPointsCalculatorService