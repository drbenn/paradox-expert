import { Fallacy } from "@/types/app.types"
import { QuizSetup } from "@/types/quiz.types"

export function createRegularQuizSetup(tier: number, quizNumber: number): QuizSetup {
  return {
    quizType: 'regular',
    quizConfig: {
      questionsPerQuiz: 10,
      fallaciesPerQuiz: 5,
      passingScorePercentage: 70,
      questionTimeLimitSeconds: 60,
      quizTimeLimitSeconds: 600, // 10 minutes
      questionTypeDistribution: {
        example_selection: 0.3,    // 30%
        true_false: 0.3,           // 30%
        scenario_identification: 0.2, // 20%
        binary_choice: 0.2         // 20%
      }
    },
    tier,
    quizNumber
  }
  }

  export function createUnitTestSetup(tier: number): QuizSetup {
  return {
    quizType: 'unit_test',
    quizConfig: {
      questionsPerQuiz: 20,
      fallaciesPerQuiz: 20, // All fallacies in tier
      passingScorePercentage: 70,
      questionTimeLimitSeconds: 60,
      quizTimeLimitSeconds: 1200, // 20 minutes
      questionTypeDistribution: {
        example_selection: 0.25,   // 25%
        true_false: 0.25,          // 25%
        scenario_identification: 0.25, // 25%
        binary_choice: 0.25        // 25%
      }
    },
    tier,
    quizNumber: null
  }
  }

  export function createDailyChallengeSetup(targetFallacy: Fallacy): QuizSetup {
  return {
    quizType: 'daily_challenge',
    quizConfig: {
      questionsPerQuiz: 10,
      fallaciesPerQuiz: 1,
      passingScorePercentage: 70,
      questionTimeLimitSeconds: 60,
      quizTimeLimitSeconds: 600, // 10 minutes
      questionTypeDistribution: {
        example_selection: 0.25,   // 25%
        true_false: 0.25,          // 25%
        scenario_identification: 0.25, // 25%
        binary_choice: 0.25        // 0%
      },
      targetFallacy // Special property for daily challenge
    },
    tier: null,
    quizNumber: null
  }
  }

  export function createCustomQuizSetup(selectedFallacyIds: string[], questionCount: number = 15): QuizSetup {
  return {
    quizType: 'custom',
    quizConfig: {
      questionsPerQuiz: questionCount,
      fallaciesPerQuiz: selectedFallacyIds.length,
      passingScorePercentage: 70,
      questionTimeLimitSeconds: 60,
      quizTimeLimitSeconds: questionCount * 60, // 1 minute per question
      questionTypeDistribution: {
        example_selection: 0.3,    // 30%
        true_false: 0.3,           // 30%
        scenario_identification: 0.2, // 20%
        binary_choice: 0.2         // 20%
      },
      selectedFallacyIds // Special property for custom quiz
    },
    tier: null,
    quizNumber: null
  }
  }

  export function createWeeklyGauntletSetup(totalUnlockedFallacies: number): QuizSetup {
  return {
    quizType: 'weekly_gauntlet',
    quizConfig: {
      questionsPerQuiz: Math.min(50, totalUnlockedFallacies), // Cap at 50
      fallaciesPerQuiz: totalUnlockedFallacies,
      passingScorePercentage: 70,
      questionTimeLimitSeconds: 60,
      quizTimeLimitSeconds: 3000, // 50 minutes
      questionTypeDistribution: {
        example_selection: 0.25,   // 25%
        true_false: 0.25,          // 25%
        scenario_identification: 0.25, // 25%
        binary_choice: 0.25        // 25%
      }
    },
    tier: null,
    quizNumber: null
  }
}