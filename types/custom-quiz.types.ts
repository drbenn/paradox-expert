// 🏆 CUSTOM QUIZ CONFIG INTERFACE & TYPES - CHAMPIONSHIP EDITION!
// Add to quiz.types.ts or create new custom-quiz.types.ts

import { Fallacy } from '@/types/app.types'
import { Quiz } from './quiz.types'

// 🎯 CUSTOM QUIZ CONFIGURATION INTERFACE
export interface CustomQuizConfig {
  // Basic Quiz Settings
  questionCount: number              // 5-30 questions (user selectable)
  selectedFallacies: Fallacy[]      // Fallacies chosen by user via filters
  
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
    usage: boolean
    context: boolean
    medium: boolean
    subtlety: boolean
    intent: boolean
    severity: boolean
    defensibility: boolean
  }
}

// 🎯 CUSTOM QUIZ FILTER STATE
export interface CustomQuizFilters {
  // Tier Selection (always available)
  selectedTiers: Set<number>        // Which tiers user has selected
  
  // Fallacy Property Filters (using existing FallacyFilters component)
  selectedDifficulty: 'all' | 'beginner' | 'intermediate' | 'advanced' | 'expert'
  selectedUsage: 'ubiquitous' | 'common' | 'moderate' | 'occasional' | 'rare' | null
  selectedSubtlety: 'blatant' | 'obvious' | 'subtle' | 'very-subtle' | null
  selectedSeverity: 'mild' | 'moderate' | 'serious' | 'toxic' | null
  selectedIntent: 'defensive' | 'offensive' | 'persuasive' | 'deflective' | 'emotional' | null
  selectedDefensibility: 'easy' | 'moderate' | 'difficult' | null
  selectedContexts: Set<'social-media' | 'politics' | 'workplace' | 'family' | 'academic' | 'marketing' | 'relationships'>
  selectedMediums: Set<'text' | 'verbal' | 'visual' | 'video' | 'memes'>
}

// 🎯 CUSTOM QUIZ CREATION RESULT
export interface CustomQuizCreationResult {
  isValid: boolean
  quiz?: Quiz
  errors: string[]
  warnings: string[]
  selectedFallaciesCount: number
  estimatedDifficulty: 'easy' | 'moderate' | 'hard' | 'expert'
  estimatedTime: number             // Minutes
}

// 🎯 CUSTOM QUIZ VALIDATION RULES
export const CUSTOM_QUIZ_VALIDATION = {
  MIN_QUESTIONS: 5,
  MAX_QUESTIONS: 30,
  MIN_FALLACIES: 3,                // Need at least 3 fallacies for good variety
  MAX_FALLACIES: 50,               // Reasonable upper limit
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

// 🎯 CUSTOM QUIZ DEFAULTS
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
  description: 'A personalized quiz based on your selected fallacies'
} as const

// 🎯 HELPER FUNCTIONS FOR CUSTOM QUIZ LOGIC

/**
 * 🏆 : Validate custom quiz configuration
 */
// export function validateCustomQuizConfig(config: CustomQuizConfig): CustomQuizCreationResult {
//   const errors: string[] = []
//   const warnings: string[] = []
  
//   // Validate question count
//   if (config.questionCount < CUSTOM_QUIZ_VALIDATION.MIN_QUESTIONS) {
//     errors.push(`Minimum ${CUSTOM_QUIZ_VALIDATION.MIN_QUESTIONS} questions required`)
//   }
//   if (config.questionCount > CUSTOM_QUIZ_VALIDATION.MAX_QUESTIONS) {
//     errors.push(`Maximum ${CUSTOM_QUIZ_VALIDATION.MAX_QUESTIONS} questions allowed`)
//   }
  
//   // Validate fallacy selection
//   if (config.selectedFallacies.length < CUSTOM_QUIZ_VALIDATION.MIN_FALLACIES) {
//     errors.push(`Minimum ${CUSTOM_QUIZ_VALIDATION.MIN_FALLACIES} fallacies required for good variety`)
//   }
//   if (config.selectedFallacies.length > CUSTOM_QUIZ_VALIDATION.MAX_FALLACIES) {
//     errors.push(`Maximum ${CUSTOM_QUIZ_VALIDATION.MAX_FALLACIES} fallacies allowed`)
//   }
  
//   // Validate question type distribution
//   if (config.questionTypeDistribution) {
//     const total = Object.values(config.questionTypeDistribution).reduce((sum, val) => sum + val, 0)
//     if (Math.abs(total - 1.0) > 0.01) {
//       errors.push('Question type distribution must total 100%')
//     }
//   }
  
//   // Generate warnings
//   if (config.selectedFallacies.length < 5 && config.questionCount > 15) {
//     warnings.push('Few fallacies with many questions may result in repetitive content')
//   }
  
//   if (config.questionCount > 20) {
//     warnings.push('Long quizzes may be challenging to complete in one session')
//   }
  
//   // Calculate estimated difficulty and time
//   const estimatedDifficulty = calculateEstimatedDifficulty(config.selectedFallacies)
//   const estimatedTime = Math.ceil(config.questionCount * 1.5) // 1.5 minutes per question estimate
  
//   return {
//     isValid: errors.length === 0,
//     errors,
//     warnings,
//     selectedFallaciesCount: config.selectedFallacies.length,
//     estimatedDifficulty,
//     estimatedTime
//   }
// }

/**
 * 🏆 : Calculate estimated difficulty based on selected fallacies
 */
export function calculateEstimatedDifficulty(fallacies: Fallacy[]): 'easy' | 'moderate' | 'hard' | 'expert' {
  if (fallacies.length === 0) return 'easy'
  
  // Calculate average difficulty score
  const difficultyScores = fallacies.map(fallacy => {
    switch (fallacy.difficulty) {
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
 * 🏆 : Calculate custom quiz points based on configuration
 */
export function calculateCustomQuizPoints(config: CustomQuizConfig, score: number): {
  basePoints: number
  difficultyBonus: number
  totalPoints: number
} {
  const basePoints = config.questionCount * CUSTOM_QUIZ_VALIDATION.BASE_POINTS_PER_QUESTION
  const difficulty = calculateEstimatedDifficulty(config.selectedFallacies)
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
 * 🏆 : Count active filters for badge evaluation
 */
export function countActiveFilters(filters: CustomQuizFilters): number {
  let count = 0
  
  // Count tier selection as active filter if specific tiers selected
  if (filters.selectedTiers.size > 0) count++
  
  // Count property filters
  if (filters.selectedDifficulty !== 'all') count++
  if (filters.selectedUsage !== null) count++
  if (filters.selectedSubtlety !== null) count++
  if (filters.selectedSeverity !== null) count++
  if (filters.selectedIntent !== null) count++
  if (filters.selectedDefensibility !== null) count++
  if (filters.selectedContexts.size > 0) count++
  if (filters.selectedMediums.size > 0) count++
  
  return count
}

// /**
//  * 🏆 : Apply filters to available fallacies
//  */
// export function applyFiltersToFallacies(fallacies: Fallacy[], filters: CustomQuizFilters): Fallacy[] {
//   return fallacies.filter(fallacy => {
//     // Tier filter
//     if (filters.selectedTiers.size > 0) {
//       const fallacyTier = parseInt(fallacy.tier?.toString() || '1')
//       if (!filters.selectedTiers.has(fallacyTier)) return false
//     }
    
//     // Difficulty filter
//     if (filters.selectedDifficulty !== 'all' && fallacy.difficulty !== filters.selectedDifficulty) {
//       return false
//     }
    
//     // Usage filter
//     if (filters.selectedUsage !== null && fallacy.usage !== filters.selectedUsage) {
//       return false
//     }
    
//     // Subtlety filter
//     if (filters.selectedSubtlety !== null && fallacy.subtlety !== filters.selectedSubtlety) {
//       return false
//     }
    
//     // Severity filter
//     if (filters.selectedSeverity !== null && fallacy.severity !== filters.selectedSeverity) {
//       return false
//     }
    
//     // Intent filter
//     if (filters.selectedIntent !== null && fallacy.intent !== filters.selectedIntent) {
//       return false
//     }
    
//     // Defensibility filter
//     if (filters.selectedDefensibility !== null && fallacy.defensibility !== filters.selectedDefensibility) {
//       return false
//     }
    
//     // Context filter
//     if (filters.selectedContexts.size > 0 && !filters.selectedContexts.has(fallacy.context)) {
//       return false
//     }
    
//     // Medium filter
//     if (filters.selectedMediums.size > 0 && !filters.selectedMediums.has(fallacy.medium)) {
//       return false
//     }
    
//     return true
//   })
// }

/**
 * 🏆 : Create default custom quiz config
 */
export function createDefaultCustomQuizConfig(availableFallacies: Fallacy[]): CustomQuizConfig {
  return {
    questionCount: CUSTOM_QUIZ_DEFAULTS.questionCount,
    selectedFallacies: availableFallacies.slice(0, 10), // First 10 available
    title: CUSTOM_QUIZ_DEFAULTS.title,
    description: CUSTOM_QUIZ_DEFAULTS.description,
    questionTypeDistribution: { ...CUSTOM_QUIZ_DEFAULTS.questionTypeDistribution },
    questionTimeLimit: CUSTOM_QUIZ_DEFAULTS.questionTimeLimit,
    passingScore: CUSTOM_QUIZ_DEFAULTS.passingScore,
    filtersUsed: {
      tier: false,
      difficulty: false,
      usage: false,
      context: false,
      medium: false,
      subtlety: false,
      intent: false,
      severity: false,
      defensibility: false
    }
  }
}