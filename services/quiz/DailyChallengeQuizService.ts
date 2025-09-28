import { Paradox } from "@/types/app.types"
import { QuizResult } from "@/types/quiz.types"
import { DateService } from "../DateService"

class DailyChallengeQuizService {

  public determineNewDailyChallengeParadox(quizHistory: QuizResult[], allFallacies: Paradox[]): Paradox {
    let todaysParadox: Paradox

    const tierForParadoxSelection: number | 'ultimate' = this.determineTierForDailyParadox(quizHistory)

    if (tierForParadoxSelection === 'ultimate') {
      todaysParadox = this.getRandomParadoxForToday(allFallacies)
    } else {
      todaysParadox = this.getRandomParadoxForTodayInTier(allFallacies, tierForParadoxSelection)
    }

    console.log(' new fallacy for the day: ', todaysParadox.title)
    return todaysParadox
  }


  private determineTierForDailyParadox(quizHistory: QuizResult[]): number | 'ultimate' {
    const todayDate = DateService.getLocalISOString().split('T')[0] // "2025-09-04"

    const mostRecentPassRegularQuizBeforeToday: QuizResult | null = quizHistory.filter((quiz: QuizResult) => 
      quiz.testType === 'regular' && 
      quiz.passed && 
      quiz.completedAt.split('T')[0] < todayDate
    ).sort((a: QuizResult, b: QuizResult) => 
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )[0] || null

    let tierForDailyParadox: number | 'ultimate'

    // case for no passed regular quizzes
    if (mostRecentPassRegularQuizBeforeToday === null) {
      tierForDailyParadox = 1
    // case where user has passed all quizzes (tier 10 quiz 4)
    } else if (mostRecentPassRegularQuizBeforeToday && 
        mostRecentPassRegularQuizBeforeToday.tier === 10 && 
        mostRecentPassRegularQuizBeforeToday.quizNumber === 4) {
          tierForDailyParadox = 'ultimate'
    // case where user is progressing through quizzes
    } else {
      tierForDailyParadox = mostRecentPassRegularQuizBeforeToday.tier!
    }

    return tierForDailyParadox
  }

  private getRandomParadoxForToday(allFallacies: Paradox[]): Paradox {
    const randomIndex = Math.floor(Math.random() * allFallacies.length)
    return allFallacies[randomIndex]
  }

  private getRandomParadoxForTodayInTier(allFallacies: Paradox[], tier: number): Paradox {
    const fallaciesInTier: Paradox[] = allFallacies.filter((f: Paradox) => f.tier === tier.toString())
    const randomIndex = Math.floor(Math.random() * fallaciesInTier.length)
    return fallaciesInTier[randomIndex]
  }

}


// 🏆 EXPORT THE CLEAN ORCHESTRATOR QUIZ SERVICE!
const dailyChallengeQuizService = new DailyChallengeQuizService()
export default dailyChallengeQuizService