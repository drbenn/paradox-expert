// CUSTOM QUIZ CONFIG INTERFACE & TYPES - PARADOX EDITION

import { Paradox } from '@/types/app.types'
import { Quiz } from './quiz.types'

// Filter types for paradoxes
export type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced' | 'expert'
export type MindBlowFactorFilter = 'amusing' | 'surprising' | 'mind-bending' | 'reality-questioning'
export type ResolutionDifficultyFilter = 'intuitive' | 'requires-explanation' | 'academic-debate' | 'unresolved'
export type DomainFilter = 'everyday-life' | 'mathematics' | 'physics' | 'philosophy' | 'economics' | 'psychology' | 'logic' | 'probability'
export type PresentationFilter = 'word-problem' | 'thought-experiment' | 'mathematical' | 'visual' | 'interactive' | 'scenario'
export type PrerequisitesFilter = 'none' | 'basic-logic' | 'high-school-math' | 'college-math' | 'specialized-knowledge'

// CUSTOM QUIZ CONFIGURATION INTERFACE
export interface CustomQuizConfig {
  // Basic Quiz Settings
  questionCount: number              // 5-30 questions (user selectable)
  selectedParadoxes: Paradox[]      // Paradoxes chosen by user via filters
  
  // Quiz Metadata
  title?: string                    // Optional custom title
  description?: string              // Optional custom description
  
  // Question Type Distribution (optional override)
  questionTypeDistribution?: {
    example_selection: number       // Default: 0.4 (40%)
    true_false: number             // Default: 0.2 (20%)
    scenario_identification: number // Default: 0.2 (20%)
    binary_choice: number          // Default: 0.2 (20%)
  }
  
  // Timing Settings (optional override)
  questionTimeLimit?: number        // Seconds per question (default: 60)
  totalTimeLimit?: number           // Total quiz time limit (calculated)
  
  // Difficulty Settings
  passingScore?: number             // Default: 70%
  
  // Filter Context (for badge tracking)
  filtersUsed: {
    tier: boolean
    difficulty: boolean
    mindBlowFactor: boolean
    resolutionDifficulty: boolean
    domain: boolean
    presentation: boolean
    prerequisites: boolean
  }
}

// CUSTOM QUIZ FILTER STATE - Updated for Paradoxes
export interface CustomQuizFilters {
  // Tier Selection (always available)
  selectedTiers: Set<number>        // Which tiers user has selected
  
  // Paradox Property Filters
  selectedDifficulty: DifficultyFilter
  selectedMindBlowFactor: MindBlowFactorFilter | null
  selectedResolutionDifficulty: ResolutionDifficultyFilter | null
  selectedDomains: Set<DomainFilter>
  selectedPresentations: Set<PresentationFilter>
  selectedPrerequisites: Set<PrerequisitesFilter>
}

// CUSTOM QUIZ CREATION RESULT
export interface CustomQuizCreationResult {
  isValid: boolean
  quiz?: Quiz
  errors: string[]
  warnings: string[]
  selectedParadoxesCount: number
  estimatedDifficulty: 'easy' | 'moderate' | 'hard' | 'expert'
  estimatedTime: number             // Minutes
}

// CUSTOM QUIZ VALIDATION RULES
export const CUSTOM_QUIZ_VALIDATION = {
  MIN_QUESTIONS: 5,
  MAX_QUESTIONS: 30,
  MIN_PARADOXES: 3,                // Need at least 3 paradoxes for good variety
  MAX_PARADOXES: 50,               // Reasonable upper limit
  DEFAULT_QUESTION_TIME_LIMIT: 60, // 60 seconds per question
  DEFAULT_PASSING_SCORE: 70,       // 70% to pass
  MAX_FILTERS_FOR_BADGE: 3,        // 3+ filters = "Filter Master" badge
  
  // Points calculation
  BASE_POINTS_PER_QUESTION: 1,     // 1 point per question (5-30 points total)
  DIFFICULTY_MULTIPLIERS: {
    easy: 1.0,
    moderate: 1.1,
    hard: 1.2,
    expert: 1.3
  }
} as const

// CUSTOM QUIZ DEFAULTS
export const CUSTOM_QUIZ_DEFAULTS = {
  questionCount: 10,
  questionTypeDistribution: {
    example_selection: 0.4,         // 40%
    true_false: 0.2,               // 20%
    scenario_identification: 0.2,   // 20%
    binary_choice: 0.2             // 20%
  },
  questionTimeLimit: 60,            // 60 seconds per question
  passingScore: 70,                 // 70% to pass
  title: 'Custom Quiz',
  description: 'A personalized quiz based on your selected paradoxes'
} as const

/**
 * Calculate estimated difficulty based on selected paradoxes
 */
export function calculateEstimatedDifficulty(paradoxes: Paradox[]): 'easy' | 'moderate' | 'hard' | 'expert' {
  if (paradoxes.length === 0) return 'easy'
  
  // Calculate average difficulty score
  const difficultyScores = paradoxes.map(paradox => {
    switch (paradox.difficulty) {
      case 'beginner': return 1
      case 'intermediate': return 2
      case 'advanced': return 3
      case 'expert': return 4
      default: return 1
    }
  })
  
  const averageScore = difficultyScores.reduce((sum, score) => sum + score, 0) / difficultyScores.length
  
  if (averageScore <= 1.5) return 'easy'
  if (averageScore <= 2.5) return 'moderate'
  if (averageScore <= 3.5) return 'hard'
  return 'expert'
}

/**
 * Calculate custom quiz points based on configuration
 */
export function calculateCustomQuizPoints(config: CustomQuizConfig, score: number): {
  basePoints: number
  difficultyBonus: number
  totalPoints: number
} {
  const basePoints = config.questionCount * CUSTOM_QUIZ_VALIDATION.BASE_POINTS_PER_QUESTION
  const difficulty = calculateEstimatedDifficulty(config.selectedParadoxes)
  const multiplier = CUSTOM_QUIZ_VALIDATION.DIFFICULTY_MULTIPLIERS[difficulty]
  
  const difficultyBonus = Math.round(basePoints * (multiplier - 1))
  const totalPoints = basePoints + difficultyBonus
  
  return {
    basePoints,
    difficultyBonus,
    totalPoints
  }
}

/**
 * Count active filters for badge evaluation
 */
export function countActiveFilters(filters: CustomQuizFilters): number {
  let count = 0
  
  // Count tier selection as active filter if specific tiers selected
  if (filters.selectedTiers.size > 0) count++
  
  // Count property filters
  if (filters.selectedDifficulty !== 'all') count++
  if (filters.selectedMindBlowFactor !== null) count++
  if (filters.selectedResolutionDifficulty !== null) count++
  if (filters.selectedDomains.size > 0) count++
  if (filters.selectedPresentations.size > 0) count++
  if (filters.selectedPrerequisites.size > 0) count++
  
  return count
}

/**
 * Create default custom quiz config
 */
export function createDefaultCustomQuizConfig(availableParadoxes: Paradox[]): CustomQuizConfig {
  return {
    questionCount: CUSTOM_QUIZ_DEFAULTS.questionCount,
    selectedParadoxes: availableParadoxes.slice(0, 10), // First 10 available
    title: CUSTOM_QUIZ_DEFAULTS.title,
    description: CUSTOM_QUIZ_DEFAULTS.description,
    questionTypeDistribution: { ...CUSTOM_QUIZ_DEFAULTS.questionTypeDistribution },
    questionTimeLimit: CUSTOM_QUIZ_DEFAULTS.questionTimeLimit,
    passingScore: CUSTOM_QUIZ_DEFAULTS.passingScore,
    filtersUsed: {
      tier: false,
      difficulty: false,
      mindBlowFactor: false,
      resolutionDifficulty: false,
      domain: false,
      presentation: false,
      prerequisites: false
    }
  }
}