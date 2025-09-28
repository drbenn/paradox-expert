import { Paradox } from "@/types/app.types"
import { QuizSetup } from "@/types/quiz.types"

export function createRegularQuizSetup(tier: number, quizNumber: number): QuizSetup {
  return {
    quizType: 'regular',
    quizConfig: {
      questionsPerQuiz: 10,
      paradoxesPerQuiz: 5,
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
      paradoxesPerQuiz: 20, // All paradoxes in tier
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

  export function createDailyChallengeSetup(targetParadox: Paradox): QuizSetup {
  return {
    quizType: 'daily_challenge',
    quizConfig: {
      questionsPerQuiz: 10,
      paradoxesPerQuiz: 1,
      passingScorePercentage: 70,
      questionTimeLimitSeconds: 60,
      quizTimeLimitSeconds: 600, // 10 minutes
      questionTypeDistribution: {
        example_selection: 0.25,   // 25%
        true_false: 0.25,          // 25%
        scenario_identification: 0.25, // 25%
        binary_choice: 0.25        // 0%
      },
      targetParadox // Special property for daily challenge
    },
    tier: null,
    quizNumber: null
  }
  }

  export function createCustomQuizSetup(selectedParadoxIds: string[], questionCount: number = 15): QuizSetup {
  return {
    quizType: 'custom',
    quizConfig: {
      questionsPerQuiz: questionCount,
      paradoxesPerQuiz: selectedParadoxIds.length,
      passingScorePercentage: 70,
      questionTimeLimitSeconds: 60,
      quizTimeLimitSeconds: questionCount * 60, // 1 minute per question
      questionTypeDistribution: {
        example_selection: 0.3,    // 30%
        true_false: 0.3,           // 30%
        scenario_identification: 0.2, // 20%
        binary_choice: 0.2         // 20%
      },
      selectedParadoxIds // Special property for custom quiz
    },
    tier: null,
    quizNumber: null
  }
  }

  export function createWeeklyGauntletSetup(totalUnlockedParadoxes: number): QuizSetup {
  return {
    quizType: 'weekly_gauntlet',
    quizConfig: {
      questionsPerQuiz: Math.min(50, totalUnlockedParadoxes), // Cap at 50
      paradoxesPerQuiz: totalUnlockedParadoxes,
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