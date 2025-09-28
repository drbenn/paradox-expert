import quizQuestionService from '@/services/quiz/QuizQuestionService';
import { Fallacy } from "@/types/app.types";
import { Quiz, QuizConfig, QuizSession, QuizSetup } from "@/types/quiz.types";

class QuizGenerationService {


  public generateQuizSession(
    fallacies: Fallacy[],
    quizSetup: QuizSetup
  ): QuizSession {
    try {
      if (fallacies.length === 0) {
        throw new Error('No fallacies available. Please load fallacies first.')
      }
      logger.log(`📚 : Generating quiz with ${fallacies.length} total fallacies available`)

      let quiz: Quiz
      
      switch(quizSetup.quizType) {
        case 'regular':
          quiz = this.generateRegularQuiz(quizSetup.tier!, quizSetup.quizNumber!, fallacies, quizSetup.quizConfig)
          break
        case 'unit_test': 
          quiz = this.generateUnitTest(quizSetup.tier!, fallacies, quizSetup.quizConfig)
          break
        case 'daily_challenge':
          quiz = this.generateDailyChallenge(quizSetup.quizConfig.targetFallacy!, fallacies, quizSetup.quizConfig) // you handle fallacy selection elsewhere
          break
        case 'custom':
          quiz = this.generateCustomQuiz(fallacies, quizSetup.quizConfig)
          break
        case 'weekly_gauntlet':
          quiz = this.generateWeeklyGauntlet(fallacies, quizSetup.quizConfig) // placeholder
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

  private getFallaciesForTier(tier: number, allFallacies: Fallacy[]): Fallacy[] {
    const tierFallacies = allFallacies.filter((fallacy: Fallacy) => 
      Number(fallacy.tier) === tier
    )
    
    if (tierFallacies.length === 0) {
      logger.error(`❌ No fallacies found for tier ${tier}`)
      throw new Error(`No fallacies found for tier ${tier}`)
    }
    
    logger.log(`📊 Found ${tierFallacies.length} fallacies for tier ${tier}`)
    
    // Sort by ID for consistent ordering
    return tierFallacies.sort((a: Fallacy, b: Fallacy) => parseInt(a.id) - parseInt(b.id))
  }

  private getFallaciesForQuiz(tierFallacies: Fallacy[], quizNumber: number, fallaciesPerQuiz: number): Fallacy[] {
    const startIndex = (quizNumber - 1) * fallaciesPerQuiz
    const endIndex = startIndex + fallaciesPerQuiz
    
    // Bounds checking
    if (startIndex >= tierFallacies.length) {
      logger.error(`❌ Quiz ${quizNumber} start index ${startIndex} exceeds available fallacies (${tierFallacies.length})`)
      throw new Error(`Quiz ${quizNumber} exceeds available fallacies for this tier`)
    }
    
    const quizFallacies = tierFallacies.slice(startIndex, endIndex)
    
    if (quizFallacies.length === 0) {
      logger.error(`❌ No fallacies available for quiz ${quizNumber} (indices ${startIndex}-${endIndex})`)
      throw new Error(`No fallacies available for quiz ${quizNumber}`)
    }
    
    logger.log(`🎯 Quiz ${quizNumber} using fallacies ${startIndex + 1}-${Math.min(endIndex, tierFallacies.length)}`)
    
    return quizFallacies
  }

  private generateRegularQuiz(
    tier: number,
    quizNumber: number,
    allFallacies: Fallacy[],
    config: QuizConfig
  ): Quiz {
    // Get all fallacies for this tier (20 fallacies per tier)
    const tierFallacies = this.getFallaciesForTier(tier, allFallacies)
    
    if (tierFallacies.length === 0) {
      throw new Error(`No fallacies found for tier ${tier}. Cannot generate quiz.`)
    }

    // Get the specific fallacies for this quiz number (5 fallacies per regular quiz)
    const quizFallacies = this.getFallaciesForQuiz(tierFallacies, quizNumber, config.fallaciesPerQuiz)
    
    if (quizFallacies.length === 0) {
      throw new Error(`No fallacies available for tier ${tier}, quiz ${quizNumber}`)
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
      description: `Test your knowledge on ${quizFallacies.map((f: Fallacy) => f.title).join(', ')}`,
      fallacyIds: quizFallacies.map((f: Fallacy) => f.id),
      questions: shuffledQuestions,
      timeLimit: config.questionTimeLimitSeconds,
      passingScore: config.passingScorePercentage
    }

    return quiz
  }


  private generateUnitTest(
    tier: number,
    allFallacies: Fallacy[],
    config: QuizConfig
  ): Quiz {
    logger.log(`🎯 Generating unit test for tier ${tier}`)
    
    // Get all fallacies for this tier (all 20 fallacies)
    const tierFallacies = this.getFallaciesForTier(tier, allFallacies)
    
    if (tierFallacies.length === 0) {
      logger.error(`❌ No fallacies found for tier ${tier}. Cannot generate unit test.`)
      throw new Error(`No fallacies found for tier ${tier}. Cannot generate unit test.`)
    }

    logger.log(`📊 Using all ${tierFallacies.length} fallacies for comprehensive unit test`)

    // Generate mixed questions covering all tier fallacies
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
      description: `Master ALL ${tierFallacies.length} fallacies in Tier ${tier}! This comprehensive test covers everything you've learned.`,
      fallacyIds: tierFallacies.map((f: Fallacy) => f.id),
      questions: shuffledQuestions,
      timeLimit: config.questionTimeLimitSeconds,
      passingScore: config.passingScorePercentage
    }

    logger.log(`✅ Generated unit test with ${quiz.questions.length} questions covering ${quiz.fallacyIds.length} fallacies`)

    return quiz
  }

  private generateDailyChallenge(
    targetFallacy: Fallacy,
    allFallacies: Fallacy[],
    config: QuizConfig
  ): Quiz {
    logger.log(`🎮 Generating daily challenge for "${targetFallacy.title}"`)
    
    if (!targetFallacy) {
      logger.error(`❌ No target fallacy provided for daily challenge`)
      throw new Error(`Target fallacy is required for daily challenge`)
    }

    // Generate mixed questions all focused on the target fallacy
    const questions = quizQuestionService.generateDailyChallengeQuestions(
      targetFallacy, 
      allFallacies, 
    )

    const shuffledQuestions = quizQuestionService.shuffleQuestions(questions)

    const quiz: Quiz = {
      id: `daily-challenge-${targetFallacy.id}-${Date.now()}`,
      testType: 'daily_challenge',
      tier: null, // Daily challenges don't have tiers
      quizNumber: null, // Daily challenges don't have quiz numbers
      title: `Daily Challenge - ${targetFallacy.title}`,
      description: `Master the "${targetFallacy.title}" fallacy with 10 focused questions!`,
      fallacyIds: [targetFallacy.id],
      questions: shuffledQuestions,
      timeLimit: config.questionTimeLimitSeconds,
      passingScore: config.passingScorePercentage
    }

    logger.log(`✅ Generated daily challenge with ${quiz.questions.length} questions focused on "${targetFallacy.title}"`)

    return quiz
  }

  private generateCustomQuiz(
    allFallacies: Fallacy[],
    config: QuizConfig
  ): Quiz {
    logger.log(`🎨 Generating custom quiz`)
    
    if (!config.selectedFallacyIds || config.selectedFallacyIds.length === 0) {
      logger.error(`❌ No fallacies selected for custom quiz`)
      throw new Error(`Selected fallacies are required for custom quiz`)
    }

    // Filter to get only the selected fallacies
    const customFallacies = allFallacies.filter((fallacy: Fallacy) => 
      config.selectedFallacyIds!.includes(fallacy.id)
    )

    if (customFallacies.length === 0) {
      logger.error(`❌ None of the selected fallacy IDs were found in available fallacies`)
      throw new Error(`Selected fallacies not found in available fallacies`)
    }

    logger.log(`📊 Using ${customFallacies.length} selected fallacies for custom quiz`)

    // Generate mixed questions using selected fallacies
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
      description: `Knowledge tested on ${customFallacies.length} fallacies`,
      fallacyIds: customFallacies.map((f: Fallacy) => f.id),
      questions: shuffledQuestions,
      timeLimit: config.questionTimeLimitSeconds,
      passingScore: config.passingScorePercentage
    }

    logger.log(`✅ Generated custom quiz with ${quiz.questions.length} questions covering ${quiz.fallacyIds.length} selected fallacies`)

    return quiz
  }

  private generateWeeklyGauntlet(
    allFallacies: Fallacy[],
    config: QuizConfig
  ): Quiz {
    logger.log(`⚔️ Generating weekly gauntlet (placeholder implementation)`)
    
    if (allFallacies.length === 0) {
      logger.error(`❌ No fallacies available for weekly gauntlet`)
      throw new Error(`No fallacies available for weekly gauntlet`)
    }

    // Use all available fallacies for the marathon challenge
    logger.log(`📊 Using all ${allFallacies.length} available fallacies for weekly gauntlet`)

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
      description: `Marathon challenge across all ${allFallacies.length} unlocked fallacies`,
      fallacyIds: allFallacies.map((f: Fallacy) => f.id),
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