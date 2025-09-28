import { EarnedAchievement } from "./achievement.types"
import { Paradox } from "./app.types"

export type TestType = 'regular' | 'unit_test' | 'daily_challenge' | 'weekly_gauntlet' | 'custom'
export type QuestionType = 'example_selection' | 'true_false' | 'scenario_identification' | 'binary_choice'

export interface Quiz {
  id: string
  testType: TestType
  tier: number | null         // null for custom/daily/weekly
  quizNumber: number | null   // null for custom/daily/weekly    
  title: string
  description: string
  fallacyIds: string[]
  questions: QuizQuestion[]
  timeLimit: number
  passingScore: number
}

// Quiz Setup

export interface QuizSetup {
  quizType: TestType,
  quizConfig: QuizConfig,
  tier: number | null,
  quizNumber: number | null
}

// Active Quiz Types
export interface QuizSession {
  quiz: Quiz
  currentQuestionIndex: number
  answers: QuizAnswer[]
  startTime: number
  isActive: boolean
}

export interface QuizConfig {
  questionsPerQuiz: number
  fallaciesPerQuiz: number
  passingScorePercentage: number
  questionTimeLimitSeconds: number
  quizTimeLimitSeconds: number
  questionTypeDistribution: {
    example_selection: number
    true_false: number
    scenario_identification: number
    binary_choice: number
  }
  targetParadox?: Paradox,      // for use with daily challange only!
  selectedParadoxIds?: string[] // for use in custom quiz only!
}
export interface QuizQuestion {
  id: string
  questionType: QuestionType
  questionText: string
  options: QuizOption[]
  correctAnswer: string
  fallacyId: string
  fallacyName: string
  questionNumber: number
  timeLimit?: number
}

export interface QuizOption {
  id: string
  fallacyId?: string
  text: string
  isCorrect?: boolean
}

export interface QuizAnswer {
  questionId: string
  selectedAnswer: string
  correctAnswer?: string
  isCorrect?: boolean
  timeTaken: number
}

export interface CompletedQuizItem {
  testType: TestType
  tier: number | null
  quizNumber: number | null
  passed: boolean
  score: number
  completedAt: string
  displayTitle: string
}

// Finished Quiz Types

export interface QuizResult {
  id: string
  testType: TestType
  tier: number | null           // null for custom/daily/weekly
  quizNumber: number | null     // null for custom/daily/weekly
  fallacyIds: string[]
  score: number
  totalQuestions: number
  passed: boolean
  timeTaken: number
  completedAt: string
  points?: number               // points added after grading in generation of QuizCompletionResults
}

export interface QuizPointsEarned {
  basePoints: number
  bonusPoints: number
  totalPoints: number
  reason: string
}

// used in state temporarily for results screen(s)
export interface QuizCompletionResult {
  quizResult: QuizResult
  pointsEarned: number
  badgesEarned: EarnedAchievement[]
  medalsEarned: EarnedAchievement[]
  trophiesEarned: EarnedAchievement[]
  timeTaken: number
  isNewRecord: boolean
}

export interface QuizQuickStats {
  quizPassRate: number
  uniqueQuizzesPassed: number
  uniqueUnitTestsPassed: number
  dailyChallengesPassed: number
  weeklyGauntletsPassed: number
}


export interface DailyChallengeStatus {
  // for UI usage
  isCompleted: boolean,
  todaysParadox: Paradox | null
  isLoading?: boolean

  // use in state only., only updated by timer on when daily challenge fallacy changes based off reset timess
  lastParadoxChangeDateTime: string | null
}

export interface DailyResetTimerInfo {
  // for state usage and updating DailyChallengeStatus for UI
  isActive: boolean
  lastCheckTime: string | null
  nextResetTime: Date

  // largely irrelevant except for stats
  timeUntilReset: number
  checkCount: number
}
