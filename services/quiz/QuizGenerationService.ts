import quizQuestionService from '@/services/quiz/QuizQuestionService';
import { Paradox } from "@/types/app.types";
import { Quiz, QuizConfig, QuizSession, QuizSetup } from "@/types/quiz.types";

class QuizGenerationService {


  public generateQuizSession(
    paradoxes: Paradox[],
    quizSetup: QuizSetup
  ): QuizSession {
    try {
      if (paradoxes.length === 0) {
        throw new Error('No paradoxes available. Please load paradoxes first.')
      }
      logger.log(`📚 : Generating quiz with ${paradoxes.length} total paradoxes available`)

      let quiz: Quiz
      
      switch(quizSetup.quizType) {
        case 'regular':
          quiz = this.generateRegularQuiz(quizSetup.tier!, quizSetup.quizNumber!, paradoxes, quizSetup.quizConfig)
          break
        case 'unit_test': 
          quiz = this.generateUnitTest(quizSetup.tier!, paradoxes, quizSetup.quizConfig)
          break
        case 'daily_challenge':
          quiz = this.generateDailyChallenge(quizSetup.quizConfig.targetParadox!, paradoxes, quizSetup.quizConfig) // you handle paradox selection elsewhere
          break
        case 'custom':
          quiz = this.generateCustomQuiz(paradoxes, quizSetup.quizConfig)
          break
        case 'weekly_gauntlet':
          quiz = this.generateWeeklyGauntlet(paradoxes, quizSetup.quizConfig) // placeholder
          break
      }
      
      const quizSession: QuizSession = {
        quiz,
        currentQuestionIndex: 0,
        answers: [],
        startTime: Date.now(),
        isActive: true
      }
      
      return quizSession
    } catch (error) {
      logger.error('❌ Error generating quiz session:', error)
      throw error
    }
  }

  private getFallaciesForTier(tier: number, allFallacies: Paradox[]): Paradox[] {
    const tierFallacies = allFallacies.filter((paradox: Paradox) => 
      Number(paradox.tier) === tier
    )
    
    if (tierFallacies.length === 0) {
      logger.error(`❌ No paradoxes found for tier ${tier}`)
      throw new Error(`No paradoxes found for tier ${tier}`)
    }
    
    logger.log(`📊 Found ${tierFallacies.length} paradoxes for tier ${tier}`)
    
    // Sort by ID for consistent ordering
    return tierFallacies.sort((a: Paradox, b: Paradox) => parseInt(a.id) - parseInt(b.id))
  }

  private getFallaciesForQuiz(tierFallacies: Paradox[], quizNumber: number, fallaciesPerQuiz: number): Paradox[] {
    const startIndex = (quizNumber - 1) * fallaciesPerQuiz
    const endIndex = startIndex + fallaciesPerQuiz
    
    // Bounds checking
    if (startIndex >= tierFallacies.length) {
      logger.error(`❌ Quiz ${quizNumber} start index ${startIndex} exceeds available paradoxes (${tierFallacies.length})`)
      throw new Error(`Quiz ${quizNumber} exceeds available paradoxes for this tier`)
    }
    
    const quizFallacies = tierFallacies.slice(startIndex, endIndex)
    
    if (quizFallacies.length === 0) {
      logger.error(`❌ No paradoxes available for quiz ${quizNumber} (indices ${startIndex}-${endIndex})`)
      throw new Error(`No paradoxes available for quiz ${quizNumber}`)
    }
    
    logger.log(`🎯 Quiz ${quizNumber} using paradoxes ${startIndex + 1}-${Math.min(endIndex, tierFallacies.length)}`)
    
    return quizFallacies
  }

  private generateRegularQuiz(
    tier: number,
    quizNumber: number,
    allFallacies: Paradox[],
    config: QuizConfig
  ): Quiz {
    // Get all paradoxes for this tier (20 paradoxes per tier)
    const tierFallacies = this.getFallaciesForTier(tier, allFallacies)
    
    if (tierFallacies.length === 0) {
      throw new Error(`No paradoxes found for tier ${tier}. Cannot generate quiz.`)
    }

    // Get the specific paradoxes for this quiz number (5 paradoxes per regular quiz)
    const quizFallacies = this.getFallaciesForQuiz(tierFallacies, quizNumber, config.fallaciesPerQuiz)
    
    if (quizFallacies.length === 0) {
      throw new Error(`No paradoxes available for tier ${tier}, quiz ${quizNumber}`)
    }

    // Generate mixed questions using the question service
    const questions = quizQuestionService.generateMixedQuestions(
      quizFallacies, 
      allFallacies, 
      config.questionsPerQuiz, 
      config
    )

    const shuffledQuestions = quizQuestionService.shuffleQuestions(questions)

    const quiz: Quiz = {
      id: `tier-${tier}-quiz-${quizNumber}-${Date.now()}`,
      testType: 'regular',
      tier,
      quizNumber,
      title: `Tier ${tier} - Quiz ${quizNumber}`,
      description: `Test your knowledge on ${quizFallacies.map((f: Paradox) => f.title).join(', ')}`,
      fallacyIds: quizFallacies.map((f: Paradox) => f.id),
      questions: shuffledQuestions,
      timeLimit: config.questionTimeLimitSeconds,
      passingScore: config.passingScorePercentage
    }

    return quiz
  }


  private generateUnitTest(
    tier: number,
    allFallacies: Paradox[],
    config: QuizConfig
  ): Quiz {
    logger.log(`🎯 Generating unit test for tier ${tier}`)
    
    // Get all paradoxes for this tier (all 20 paradoxes)
    const tierFallacies = this.getFallaciesForTier(tier, allFallacies)
    
    if (tierFallacies.length === 0) {
      logger.error(`❌ No paradoxes found for tier ${tier}. Cannot generate unit test.`)
      throw new Error(`No paradoxes found for tier ${tier}. Cannot generate unit test.`)
    }

    logger.log(`📊 Using all ${tierFallacies.length} paradoxes for comprehensive unit test`)

    // Generate mixed questions covering all tier paradoxes
    const questions = quizQuestionService.generateMixedQuestions(
      tierFallacies, 
      allFallacies, 
      config.questionsPerQuiz, // This will be 20 for unit tests
      config
    )

    const shuffledQuestions = quizQuestionService.shuffleQuestions(questions)

    const quiz: Quiz = {
      id: `tier-${tier}-unit-test-${Date.now()}`,
      testType: 'unit_test',
      tier,
      quizNumber: null, // Unit tests don't have quiz numbers
      title: `Tier ${tier} - Comprehensive Unit Test`,
      description: `Master ALL ${tierFallacies.length} paradoxes in Tier ${tier}! This comprehensive test covers everything you've learned.`,
      fallacyIds: tierFallacies.map((f: Paradox) => f.id),
      questions: shuffledQuestions,
      timeLimit: config.questionTimeLimitSeconds,
      passingScore: config.passingScorePercentage
    }

    logger.log(`✅ Generated unit test with ${quiz.questions.length} questions covering ${quiz.fallacyIds.length} paradoxes`)

    return quiz
  }

  private generateDailyChallenge(
    targetParadox: Paradox,
    allFallacies: Paradox[],
    config: QuizConfig
  ): Quiz {
    logger.log(`🎮 Generating daily challenge for "${targetParadox.title}"`)
    
    if (!targetParadox) {
      logger.error(`❌ No target paradox provided for daily challenge`)
      throw new Error(`Target paradox is required for daily challenge`)
    }

    // Generate mixed questions all focused on the target paradox
    const questions = quizQuestionService.generateDailyChallengeQuestions(
      targetParadox, 
      allFallacies, 
    )

    const shuffledQuestions = quizQuestionService.shuffleQuestions(questions)

    const quiz: Quiz = {
      id: `daily-challenge-${targetParadox.id}-${Date.now()}`,
      testType: 'daily_challenge',
      tier: null, // Daily challenges don't have tiers
      quizNumber: null, // Daily challenges don't have quiz numbers
      title: `Daily Challenge - ${targetParadox.title}`,
      description: `Master the "${targetParadox.title}" paradox with 10 focused questions!`,
      fallacyIds: [targetParadox.id],
      questions: shuffledQuestions,
      timeLimit: config.questionTimeLimitSeconds,
      passingScore: config.passingScorePercentage
    }

    logger.log(`✅ Generated daily challenge with ${quiz.questions.length} questions focused on "${targetParadox.title}"`)

    return quiz
  }

  private generateCustomQuiz(
    allFallacies: Paradox[],
    config: QuizConfig
  ): Quiz {
    logger.log(`🎨 Generating custom quiz`)
    
    if (!config.selectedParadoxIds || config.selectedParadoxIds.length === 0) {
      logger.error(`❌ No paradoxes selected for custom quiz`)
      throw new Error(`Selected paradoxes are required for custom quiz`)
    }

    // Filter to get only the selected paradoxes
    const customFallacies = allFallacies.filter((paradox: Paradox) => 
      config.selectedParadoxIds!.includes(paradox.id)
    )

    if (customFallacies.length === 0) {
      logger.error(`❌ None of the selected paradox IDs were found in available paradoxes`)
      throw new Error(`Selected paradoxes not found in available paradoxes`)
    }

    logger.log(`📊 Using ${customFallacies.length} selected paradoxes for custom quiz`)

    // Generate mixed questions using selected paradoxes
    const questions = quizQuestionService.generateMixedQuestions(
      customFallacies, 
      allFallacies, 
      config.questionsPerQuiz, // User-configured question count
      config
    )

    const shuffledQuestions = quizQuestionService.shuffleQuestions(questions)

    const quiz: Quiz = {
      id: `custom-quiz-${Date.now()}`,
      testType: 'custom',
      tier: null, // Custom quizzes don't have tiers
      quizNumber: null, // Custom quizzes don't have quiz numbers
      title: 'Custom Quiz',
      description: `Knowledge tested on ${customFallacies.length} paradoxes`,
      fallacyIds: customFallacies.map((f: Paradox) => f.id),
      questions: shuffledQuestions,
      timeLimit: config.questionTimeLimitSeconds,
      passingScore: config.passingScorePercentage
    }

    logger.log(`✅ Generated custom quiz with ${quiz.questions.length} questions covering ${quiz.fallacyIds.length} selected paradoxes`)

    return quiz
  }

  private generateWeeklyGauntlet(
    allFallacies: Paradox[],
    config: QuizConfig
  ): Quiz {
    logger.log(`⚔️ Generating weekly gauntlet (placeholder implementation)`)
    
    if (allFallacies.length === 0) {
      logger.error(`❌ No paradoxes available for weekly gauntlet`)
      throw new Error(`No paradoxes available for weekly gauntlet`)
    }

    // Use all available paradoxes for the marathon challenge
    logger.log(`📊 Using all ${allFallacies.length} available paradoxes for weekly gauntlet`)

    const questions = quizQuestionService.generateMixedQuestions(
      allFallacies, 
      allFallacies, 
      config.questionsPerQuiz, // Large number for marathon quiz
      config
    )

    const shuffledQuestions = quizQuestionService.shuffleQuestions(questions)

    const quiz: Quiz = {
      id: `weekly-gauntlet-${Date.now()}`,
      testType: 'weekly_gauntlet',
      tier: null,
      quizNumber: null,
      title: 'Weekly Gauntlet',
      description: `Marathon challenge across all ${allFallacies.length} unlocked paradoxes`,
      fallacyIds: allFallacies.map((f: Paradox) => f.id),
      questions: shuffledQuestions,
      timeLimit: config.questionTimeLimitSeconds,
      passingScore: config.passingScorePercentage
    }

    logger.log(`✅ Generated weekly gauntlet with ${quiz.questions.length} questions`)

    return quiz
  }

}




// 🏆 EXPORT THE CLEAN ORCHESTRATOR QUIZ SERVICE!
const quizGenerationService = new QuizGenerationService()
export default quizGenerationService