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

  private getParadoxesForTier(tier: number, allParadoxes: Paradox[]): Paradox[] {
    const tierParadoxes = allParadoxes.filter((paradox: Paradox) => 
      Number(paradox.tier) === tier
    )
    
    if (tierParadoxes.length === 0) {
      logger.error(`❌ No paradoxes found for tier ${tier}`)
      throw new Error(`No paradoxes found for tier ${tier}`)
    }
    
    logger.log(`📊 Found ${tierParadoxes.length} paradoxes for tier ${tier}`)
    
    // Sort by ID for consistent ordering
    return tierParadoxes.sort((a: Paradox, b: Paradox) => parseInt(a.id) - parseInt(b.id))
  }

  private getParadoxesForQuiz(tierParadoxes: Paradox[], quizNumber: number, paradoxesPerQuiz: number): Paradox[] {
    const startIndex = (quizNumber - 1) * paradoxesPerQuiz
    const endIndex = startIndex + paradoxesPerQuiz
    
    // Bounds checking
    if (startIndex >= tierParadoxes.length) {
      logger.error(`❌ Quiz ${quizNumber} start index ${startIndex} exceeds available paradoxes (${tierParadoxes.length})`)
      throw new Error(`Quiz ${quizNumber} exceeds available paradoxes for this tier`)
    }
    
    const quizParadoxes = tierParadoxes.slice(startIndex, endIndex)
    
    if (quizParadoxes.length === 0) {
      logger.error(`❌ No paradoxes available for quiz ${quizNumber} (indices ${startIndex}-${endIndex})`)
      throw new Error(`No paradoxes available for quiz ${quizNumber}`)
    }
    
    logger.log(`🎯 Quiz ${quizNumber} using paradoxes ${startIndex + 1}-${Math.min(endIndex, tierParadoxes.length)}`)
    
    return quizParadoxes
  }

  private generateRegularQuiz(
    tier: number,
    quizNumber: number,
    allParadoxes: Paradox[],
    config: QuizConfig
  ): Quiz {
    // Get all paradoxes for this tier (20 paradoxes per tier)
    const tierParadoxes = this.getParadoxesForTier(tier, allParadoxes)
    
    if (tierParadoxes.length === 0) {
      throw new Error(`No paradoxes found for tier ${tier}. Cannot generate quiz.`)
    }

    // Get the specific paradoxes for this quiz number (5 paradoxes per regular quiz)
    const quizParadoxes = this.getParadoxesForQuiz(tierParadoxes, quizNumber, config.paradoxesPerQuiz)
    
    if (quizParadoxes.length === 0) {
      throw new Error(`No paradoxes available for tier ${tier}, quiz ${quizNumber}`)
    }

    // Generate mixed questions using the question service
    const questions = quizQuestionService.generateMixedQuestions(
      quizParadoxes, 
      allParadoxes, 
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
      description: `Test your knowledge on ${quizParadoxes.map((f: Paradox) => f.title).join(', ')}`,
      paradoxIds: quizParadoxes.map((f: Paradox) => f.id),
      questions: shuffledQuestions,
      timeLimit: config.questionTimeLimitSeconds,
      passingScore: config.passingScorePercentage
    }

    return quiz
  }


  private generateUnitTest(
    tier: number,
    allParadoxes: Paradox[],
    config: QuizConfig
  ): Quiz {
    logger.log(`🎯 Generating unit test for tier ${tier}`)
    
    // Get all paradoxes for this tier (all 20 paradoxes)
    const tierParadoxes = this.getParadoxesForTier(tier, allParadoxes)
    
    if (tierParadoxes.length === 0) {
      logger.error(`❌ No paradoxes found for tier ${tier}. Cannot generate unit test.`)
      throw new Error(`No paradoxes found for tier ${tier}. Cannot generate unit test.`)
    }

    logger.log(`📊 Using all ${tierParadoxes.length} paradoxes for comprehensive unit test`)

    // Generate mixed questions covering all tier paradoxes
    const questions = quizQuestionService.generateMixedQuestions(
      tierParadoxes, 
      allParadoxes, 
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
      description: `Master ALL ${tierParadoxes.length} paradoxes in Tier ${tier}! This comprehensive test covers everything you've learned.`,
      paradoxIds: tierParadoxes.map((f: Paradox) => f.id),
      questions: shuffledQuestions,
      timeLimit: config.questionTimeLimitSeconds,
      passingScore: config.passingScorePercentage
    }

    logger.log(`✅ Generated unit test with ${quiz.questions.length} questions covering ${quiz.paradoxIds.length} paradoxes`)

    return quiz
  }

  private generateDailyChallenge(
    targetParadox: Paradox,
    allParadoxes: Paradox[],
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
      allParadoxes, 
    )

    const shuffledQuestions = quizQuestionService.shuffleQuestions(questions)

    const quiz: Quiz = {
      id: `daily-challenge-${targetParadox.id}-${Date.now()}`,
      testType: 'daily_challenge',
      tier: null, // Daily challenges don't have tiers
      quizNumber: null, // Daily challenges don't have quiz numbers
      title: `Daily Challenge - ${targetParadox.title}`,
      description: `Master the "${targetParadox.title}" paradox with 10 focused questions!`,
      paradoxIds: [targetParadox.id],
      questions: shuffledQuestions,
      timeLimit: config.questionTimeLimitSeconds,
      passingScore: config.passingScorePercentage
    }

    logger.log(`✅ Generated daily challenge with ${quiz.questions.length} questions focused on "${targetParadox.title}"`)

    return quiz
  }

  private generateCustomQuiz(
    allParadoxes: Paradox[],
    config: QuizConfig
  ): Quiz {
    logger.log(`🎨 Generating custom quiz`)
    
    if (!config.selectedParadoxIds || config.selectedParadoxIds.length === 0) {
      logger.error(`❌ No paradoxes selected for custom quiz`)
      throw new Error(`Selected paradoxes are required for custom quiz`)
    }

    // Filter to get only the selected paradoxes
    const customParadoxes = allParadoxes.filter((paradox: Paradox) => 
      config.selectedParadoxIds!.includes(paradox.id)
    )

    if (customParadoxes.length === 0) {
      logger.error(`❌ None of the selected paradox IDs were found in available paradoxes`)
      throw new Error(`Selected paradoxes not found in available paradoxes`)
    }

    logger.log(`📊 Using ${customParadoxes.length} selected paradoxes for custom quiz`)

    // Generate mixed questions using selected paradoxes
    const questions = quizQuestionService.generateMixedQuestions(
      customParadoxes, 
      allParadoxes, 
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
      description: `Knowledge tested on ${customParadoxes.length} paradoxes`,
      paradoxIds: customParadoxes.map((f: Paradox) => f.id),
      questions: shuffledQuestions,
      timeLimit: config.questionTimeLimitSeconds,
      passingScore: config.passingScorePercentage
    }

    logger.log(`✅ Generated custom quiz with ${quiz.questions.length} questions covering ${quiz.paradoxIds.length} selected paradoxes`)

    return quiz
  }

  private generateWeeklyGauntlet(
    allParadoxes: Paradox[],
    config: QuizConfig
  ): Quiz {
    logger.log(`⚔️ Generating weekly gauntlet (placeholder implementation)`)
    
    if (allParadoxes.length === 0) {
      logger.error(`❌ No paradoxes available for weekly gauntlet`)
      throw new Error(`No paradoxes available for weekly gauntlet`)
    }

    // Use all available paradoxes for the marathon challenge
    logger.log(`📊 Using all ${allParadoxes.length} available paradoxes for weekly gauntlet`)

    const questions = quizQuestionService.generateMixedQuestions(
      allParadoxes, 
      allParadoxes, 
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
      description: `Marathon challenge across all ${allParadoxes.length} unlocked paradoxes`,
      paradoxIds: allParadoxes.map((f: Paradox) => f.id),
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