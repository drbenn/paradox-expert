import { Fallacy } from "@/types/app.types"
import { QuizResult } from "@/types/quiz.types"
import { DateService } from "../DateService"

class DailyChallengeQuizService {

  public determineNewDailyChallengeFallacy(quizHistory: QuizResult[], allFallacies: Fallacy[]): Fallacy {
    let todaysFallacy: Fallacy

    const tierForFallacySelection: number | 'ultimate' = this.determineTierForDailyFallacy(quizHistory)

    if (tierForFallacySelection === 'ultimate') {
      todaysFallacy = this.getRandomFallacyForToday(allFallacies)
    } else {
      todaysFallacy = this.getRandomFallacyForTodayInTier(allFallacies, tierForFallacySelection)
    }

    console.log(' new fallacy for the day: ', todaysFallacy.title)
    return todaysFallacy
  }


  private determineTierForDailyFallacy(quizHistory: QuizResult[]): number | 'ultimate' {
    const todayDate = DateService.getLocalISOString().split('T')[0] // "2025-09-04"

    const mostRecentPassRegularQuizBeforeToday: QuizResult | null = quizHistory.filter((quiz: QuizResult) => 
      quiz.testType === 'regular' && 
      quiz.passed && 
      quiz.completedAt.split('T')[0] < todayDate
    ).sort((a: QuizResult, b: QuizResult) => 
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )[0] || null

    let tierForDailyFallacy: number | 'ultimate'

    // case for no passed regular quizzes
    if (mostRecentPassRegularQuizBeforeToday === null) {
      tierForDailyFallacy = 1
    // case where user has passed all quizzes (tier 10 quiz 4)
    } else if (mostRecentPassRegularQuizBeforeToday && 
        mostRecentPassRegularQuizBeforeToday.tier === 10 && 
        mostRecentPassRegularQuizBeforeToday.quizNumber === 4) {
          tierForDailyFallacy = 'ultimate'
    // case where user is progressing through quizzes
    } else {
      tierForDailyFallacy = mostRecentPassRegularQuizBeforeToday.tier!
    }

    return tierForDailyFallacy
  }

  private getRandomFallacyForToday(allFallacies: Fallacy[]): Fallacy {
    const randomIndex = Math.floor(Math.random() * allFallacies.length)
    return allFallacies[randomIndex]
  }

  private getRandomFallacyForTodayInTier(allFallacies: Fallacy[], tier: number): Fallacy {
    const fallaciesInTier: Fallacy[] = allFallacies.filter((f: Fallacy) => f.tier === tier.toString())
    const randomIndex = Math.floor(Math.random() * fallaciesInTier.length)
    return fallaciesInTier[randomIndex]
  }

}


// 🏆 EXPORT THE CLEAN ORCHESTRATOR QUIZ SERVICE!
const dailyChallengeQuizService = new DailyChallengeQuizService()
export default dailyChallengeQuizService