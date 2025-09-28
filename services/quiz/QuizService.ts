import { Quiz, QuizAnswer, QuizQuestion, QuizQuickStats, QuizResult, TestType } from "@/types/quiz.types";
import { RelativePathString, router } from "expo-router";
import { DateService } from "../DateService";

class QuizService {

  getNextQuizOrTestInProgression(quizHistory: QuizResult[]): { testType: TestType, tier: number, quiz: number | null } {
    const passedRegularQuizzes = quizHistory.filter((q: QuizResult) => 
      q.testType === 'regular' && 
      q.quizNumber !== null && 
      q.passed
    )
    
    // Handle no regular quizzes passed
    if (passedRegularQuizzes.length === 0) {
      return { testType: 'regular', tier: 1, quiz: 1 }
    }
    
    // Find highest regular quiz with EXPLICIT TYPING
    const highestQuiz = passedRegularQuizzes.reduce((highest: QuizResult, current: QuizResult) => {
      if (current.tier! > highest.tier!) return current
      if (current.tier === highest.tier && current.quizNumber! > highest.quizNumber!) return current
      return highest
    })
    
    const { tier, quizNumber } = highestQuiz
    
    // If quiz 1, 2, or 3 - next is same tier, next quiz
    if (quizNumber! < 4) {
      return { testType: 'regular', tier: tier!, quiz: quizNumber! + 1 }
    }
    
    // If quiz 4 - check unit test
    const unitTestPassed = quizHistory.some((q: QuizResult) => 
      q.testType === 'unit_test' && 
      q.tier === tier && 
      q.passed
    )
    
    if (!unitTestPassed) {
      return { testType: 'unit_test', tier: tier!, quiz: null }
    }
    
    // Unit test passed - next tier or tier 10 complete
    if (tier === 10) {
      return { testType: 'regular', tier: 10, quiz: 5 }
    } else {
      return { testType: 'regular', tier: tier! + 1, quiz: 1 }
    }
  }


  gradeQuiz(quiz: Quiz, answers: QuizAnswer[]): QuizResult {
    logger.log('📊 Starting quiz grading...')
    logger.log('📊 Quiz questions count:', quiz.questions.length)
    logger.log('📊 Answers received count:', answers.length)
  
    let correctAnswers = 0
    const totalQuestions = quiz.questions.length
    let totalTimeTaken = 0
    
    // Grade individual answers (for internal calculation)
    answers.forEach((answer: QuizAnswer, index: number) => {
      const question = quiz.questions.find((q: QuizQuestion) => q.id === answer.questionId)
      
      logger.log(`📊 Answer ${index + 1}:`, {
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: answer.correctAnswer,
        questionFound: !!question,
        questionCorrectAnswer: question?.correctAnswer
      })
      logger.log(`📊 Answer ${index + 1} time:`, answer.timeTaken, 'ms')
      if (!question) {
        logger.log(`❌ Question not found for ID: ${answer.questionId}`)
        return
      }
      
      const isCorrect = answer.selectedAnswer === question.correctAnswer
      logger.log(`📊 Answer ${index + 1} result:`, {
        isCorrect,
        comparison: `${answer.selectedAnswer} === ${question.correctAnswer}`
      })
    
      if (isCorrect) correctAnswers++
      totalTimeTaken += answer.timeTaken || 0
    })
    
    logger.log('📊 Grading summary:', {
      correctAnswers,
      totalQuestions,
      rawScore: (correctAnswers / totalQuestions) * 100
    })
    
    const score = Math.round((correctAnswers / totalQuestions) * 100)
    const passed = score >= quiz.passingScore
    
    
    const result: QuizResult = {
      id: quiz.id,
      testType: quiz.testType,
      tier: quiz.tier,
      quizNumber: quiz.quizNumber,
      paradoxIds: quiz.paradoxIds,
      score,
      totalQuestions,
      passed,
      timeTaken: totalTimeTaken,
      completedAt: DateService.getLocalISOString()
    }
    
    const testTypeDisplay = quiz.testType.toUpperCase().replace('_', ' ')
    logger.log(`📊 ${testTypeDisplay} graded: ${correctAnswers}/${totalQuestions} (${score}%) - ${passed ? 'PASSED' : 'FAILED'}`)
    
    return result
  }


  navigateAfterCompletion(
    completionResult: any,
    result: QuizResult,
    testType: string,
    totalTimeTaken: number
  ): void {

    // ❌❌❌❌❌❌❌❌  FUCK BADGE SCREENS JUST USE BELOW(THIS was prev the only line in this funct) ❌❌❌❌❌❌❌❌
    // navigateAfterCompletionWithBadges(completionResult, result, testType, totalTimeTaken)

    // ❌ BYPASS ALL CELEBRATION SCREENS - COMMENT OUT THE BULLSHIT
    // navigateAfterCompletionWithBadges(completionResult, result, testType, totalTimeTaken)
    
    // ✅ GO STRAIGHT TO RESULTS - THE CLEAN FIX
    try {
      const badges = Array.isArray(completionResult?.badgesEarned) ? completionResult.badgesEarned : []
      
      const resultsParams: Record<string, string> = {
        score: result.score.toString(),
        passed: result.passed.toString(),
        totalQuestions: result.totalQuestions.toString(),
        testType: testType,
        timeTaken: totalTimeTaken.toString(),
        pointsEarned: completionResult.pointsEarned?.totalPoints?.toString() || '0',
        badgeCount: badges.length.toString(),
        trophyAwarded: completionResult.trophy ? 'true' : 'false',
        isNewRecord: completionResult.isNewRecord?.toString() || 'false'
      }
      
      // Add test-specific params
      if (completionResult.trophy) {
        resultsParams.tier = completionResult.trophy.tier?.toString() || '1'
        resultsParams.quizNumber = completionResult.trophy.quiz_number?.toString() || '1'
      }
      
      router.push({
        pathname: '/screens/quiz/results' as RelativePathString,
        params: resultsParams
      })
      
    } catch (error) {
      // Emergency fallback to quiz center
      logger.error('navigateAfterCompletion error: ', error)
      router.replace('/(tabs)/quiz')
    }
  }

  calculateQuizStats(quizHistory: QuizResult[]): QuizQuickStats {
    // Filter passed quizzes by type
    const passedQuizzes = quizHistory.filter((quiz: QuizResult) => quiz.passed)
    
    // Regular quizzes (for pass rate calculation)
    const regularQuizzes = quizHistory.filter((quiz: QuizResult) => quiz.testType === 'regular')
    const passedRegularQuizzes = passedQuizzes.filter((quiz: QuizResult) => quiz.testType === 'regular')
    
    // Calculate quiz pass rate (percentage of regular quizzes passed)
    const quizPassRate = regularQuizzes.length > 0 
      ? Math.round((passedRegularQuizzes.length / regularQuizzes.length) * 100)
      : 0
    
    // Unique regular quizzes passed (distinct tier-quiz combinations)
    const uniqueQuizzesPassed = new Set(
      passedQuizzes
        .filter((quiz: QuizResult) => quiz.testType === 'regular' && quiz.tier !== null && quiz.quizNumber !== null)
        .map((quiz: QuizResult) => `${quiz.tier}-${quiz.quizNumber}`)
    ).size
    
    // Unique unit tests passed (distinct tiers)
    const uniqueUnitTestsPassed = new Set(
      passedQuizzes
        .filter((quiz: QuizResult) => quiz.testType === 'unit_test' && quiz.tier !== null)
        .map((quiz: QuizResult) => quiz.tier)
    ).size
    
    // Daily challenges passed (total count)
    const dailyChallengesPassed = passedQuizzes.filter(
      (quiz: QuizResult) => quiz.testType === 'daily_challenge'
    ).length
    
    // Weekly gauntlets passed (total count)
    const weeklyGauntletsPassed = passedQuizzes.filter(
      (quiz: QuizResult) => quiz.testType === 'weekly_gauntlet'
    ).length
    
    return {
      quizPassRate,
      uniqueQuizzesPassed,
      uniqueUnitTestsPassed,
      dailyChallengesPassed,
      weeklyGauntletsPassed
    }
  }

}




// 🏆 EXPORT THE CLEAN ORCHESTRATOR QUIZ SERVICE!
const quizService = new QuizService()
export default quizService