import achievementEvaluationService from '@/services/AchievementEvaluationService'
import adInterstitialService from '@/services/ad/AdInterstitialService'
import quizGenerationService from '@/services/quiz/QuizGenerationService'
import quizPointsCalculatorService from '@/services/quiz/QuizPointsCalculatorService'
import quizService from '@/services/quiz/QuizService'
import { AcheivementEvaluationResult, AchievementEvaluationContext, EarnedAchievement } from '@/types/achievement.types'
import { QuizCompletionResult, QuizPointsEarned, QuizQuickStats, QuizResult, QuizSession, QuizSetup, TestType } from '@/types/quiz.types'
import { RelativePathString, router } from 'expo-router'
import { StateCreator } from 'zustand'
import { useAppState } from '../useAppState'

export interface QuizSlice {
  // Persistent Quiz State
  quizHistory: QuizResult[]
  nextQuizOrTest: { testType: TestType, tier: number, quiz: number | null } | null
  quickQuizStats: QuizQuickStats
  cumulativePoints: number

  // Active Quiz State
  isQuizInProgress: boolean
  startingQuizSession: QuizSession | null         // generated and only used for inital handoff to active.tsx upon routing to active.tsx from multiple location
  completionResult: QuizCompletionResult | null   // generated from completeQuiz and used specifically for the results/badges/trophy screens
  achievementsForPostQuizRouting: EarnedAchievement[] | null

  // Actions
  setIsQuizInProgress: (isQuizInProgress: boolean) => void
  addQuizToHistory: (quizResult: QuizResult) => void
  setNextQuizOrTest: () => void
  setStartingQuizSession: (session: QuizSession) => void
  clearStartingQuizSession: () => void
  cancelQuiz: () => void
  startQuiz: (quizSetup: QuizSetup) => void
  completeQuiz: (sessionData: QuizSession) => void
  setCompletionResult: (result: QuizCompletionResult) => void
  addPointsFromQuizResult: (points: number) => void
  calculatePointsOnStartup: () => void
  calculateQuizQuickStats: () => void
}

export const quizSlice: StateCreator<
  any, // Full app state - avoid circular dependency
  [],
  [],
  QuizSlice
> = (set, get) => ({
  // Initial state
  quizHistory: [],
  nextQuizOrTest: null,
  // Active props for active quiz
  isQuizInProgress: false,
  startingQuizSession: null,
  cumulativePoints: 0,
  completionResult: null,
  achievementsForPostQuizRouting: null,
  quickQuizStats: {
    quizPassRate: 0,
    uniqueQuizzesPassed: 0,
    uniqueUnitTestsPassed: 0,
    dailyChallengesPassed: 0,
    weeklyGauntletsPassed: 0
  },

  // Actions
  setIsQuizInProgress: (isQuizInProgress: boolean) => {
    set({ isQuizInProgress: isQuizInProgress })
  },
  addQuizToHistory: (quiz: QuizResult) => {
    const quizHistory = get().quizHistory
    set({ quizHistory: [...quizHistory, quiz] })
  },
  setNextQuizOrTest: () => {
    const quizHistory = get().quizHistory
    const nextQuizOrTestInProgression: { testType: TestType, tier: number, quiz: number | null } 
      = quizService.getNextQuizOrTestInProgression(quizHistory)
    set({nextQuizOrTest: nextQuizOrTestInProgression})
  },
  setStartingQuizSession: (session: QuizSession) => {
    set({ startingQuizSession: session })
  },
  clearStartingQuizSession: () => {
    set({ startingQuizSession: null })
  },
  cancelQuiz: () => {
    logger.log('🚫 Canceling quiz...')
    set({
      isQuizInProgress: false,
      startingQuizSession: null,
      completionResult: null
    })
    logger.log('✅ Quiz state cleared')
  },
  startQuiz: (quizSetup: QuizSetup) => {
    logger.log('🚀 Starting new quiz...')
    logger.log('🔍 Current quiz state:', {
      isQuizInProgress: get().isQuizInProgress,
      currentSession: !!get().currentSession,
      startingQuizSession: !!get().startingQuizSession
    })
    const { isQuizInProgress } = get()
  
    if (isQuizInProgress) {
      return null // or throw error
    }
  

    get().setIsQuizInProgress(true)
    logger.log('✅ Set isQuizInProgress to:', get().isQuizInProgress)
    try {
      const paradoxes = useAppState.getState().paradoxes
      const quizSession: QuizSession = quizGenerationService.generateQuizSession(paradoxes, quizSetup)
    
      // Store for handoff to active.tsx
      get().setStartingQuizSession(quizSession)
      
      // Navigate to active
      router.push('/screens/quiz/active' as RelativePathString)
    
    } catch (error) {
      get().setIsQuizInProgress(false) // Reset flag on error
      logger.error('start quiz in quiz slice error: ', error)
      throw error
    }
  },
  completeQuiz: async (sessionData: QuizSession) => {

    logger.log('🎯 Starting quiz completion...')
    logger.log('🔍 Session data:', { 
    quizId: sessionData.quiz.id, 
    testType: sessionData.quiz.testType,
    answerCount: sessionData.answers.length,
    isActive: sessionData.isActive 
  })

    try {
      // 1. Handle ads - show immediately, calculate in background
      useAppState.getState().incrementQuizCounter()

      if (useAppState.getState().shouldShowInterstitialAd()) {
        try {
          const adShown = await adInterstitialService.showAd()
          logger.log('📺 Ad shown result:', adShown)
          if (adShown) {
            useAppState.getState().recordAdShown()
            await new Promise(resolve => setTimeout(resolve, 800))
          }
        } catch (error) {
          logger.log('❌ Ad service error:', error)
        }
      }

      // 2. Grade the quiz
      logger.log('📊 Grading quiz...')
      const result: QuizResult = quizService.gradeQuiz(sessionData.quiz, sessionData.answers)
      // logger.log('📊 Quiz result:', result)
      logger.log('📊 Result details:', { passed: result.passed, score: result.score, passingScore: sessionData.quiz.passingScore })

      // 3. Calculate Points (ONLY if passed)
      logger.log('💰 Calculating points...')
      const totalTimeTaken = Math.round((Date.now() - sessionData.startTime) / 1000)
      
      let pointsEarned: QuizPointsEarned
      if (result.passed) {
        pointsEarned = quizPointsCalculatorService.calculateQuizPoints(sessionData.quiz.testType, result.score, 0)
        logger.log('💰 Points awarded (PASSED):', pointsEarned)
        result.points = pointsEarned.totalPoints    // add points to QuizResult if passed for usage in trophy/badge/achievement evaluation
        get().addPointsFromQuizResult(pointsEarned.totalPoints)
      } else {
        pointsEarned = {
          basePoints: 0,
          bonusPoints: 0,
          totalPoints: 0,
          reason: 'No points - Quiz failed'
        }
        logger.log('💰 No points awarded (FAILED):', pointsEarned)
      }

      
      // 4. Evaluate Achievements
      const { quizHistory, cumulativePoints, earnedAchievements, allBadges } = get()
      const achievementEvaluationContext: AchievementEvaluationContext =  {
        currentQuiz: result,
        quizHistory: quizHistory,
        cumulativePointsBeforeThis: cumulativePoints, 
        existingAchievements: earnedAchievements
      }
      const newAchievementsEarned: AcheivementEvaluationResult = achievementEvaluationService.evaluateAchievements(achievementEvaluationContext, allBadges)

      // 5. Set results of quiz to state for results screen
      logger.log('📝 Setting completion result...')
      const completionResult: QuizCompletionResult = {
        quizResult: result,
        pointsEarned: pointsEarned.totalPoints,
        badgesEarned: newAchievementsEarned.badgesEarned,
        medalsEarned: newAchievementsEarned.medalsEarned,
        trophiesEarned: newAchievementsEarned.trophiesEarned,
        timeTaken: totalTimeTaken,
        isNewRecord: false
      }
      get().setCompletionResult(completionResult)
      logger.log('✅ Completion result set')

      // 6. Session Cleanup FIRST (prevent double execution)
      logger.log('🧹 Starting session cleanup...')
      set({
        // only cleanup isQuizInProgress as others are taken care of in respective places.
        // only isQuizInProgress to prevent unnecessary re-renders and then race-conditions
        isQuizInProgress: false // ✅ Keep - this is the main flag
      })
      logger.log('✅ Session state cleared')

      // 7. Navigate: Results Screen - TODO: Trophy/Badge Screens
      const { badgesEarned, medalsEarned, trophiesEarned } = newAchievementsEarned
      if (badgesEarned.length | medalsEarned.length | trophiesEarned.length) {
        const earnedAchievements: EarnedAchievement[] = [...badgesEarned, ...trophiesEarned, ...medalsEarned]
        set({achievementsForPostQuizRouting: earnedAchievements})
        logger.log('🧭 Attempting navigation to achievement results...')
        router.push('/screens/quiz/achievement-results' as RelativePathString)
      } else {
        logger.log('🧭 Attempting navigation to results...')
        router.push('/screens/quiz/results' as RelativePathString)
      }
      logger.log('✅ Navigation command sent')



      // 8. Store quiz result in QuizHistory
      logger.log('💾 Adding quiz to history...')
      result.points = pointsEarned.totalPoints
      get().addQuizToHistory(result)
      logger.log('✅ Quiz added to history')

      // 9. Update next quiz availability and quickQuizStats
      logger.log('🔄 Updating next quiz/test...')
      get().setNextQuizOrTest()
      logger.log('✅ Next quiz/test updated')
      logger.log('🔄 Updating quick quiz stats...')
      get().calculateQuizQuickStats()
      logger.log('✅ Quick quiz stats updated')
      if (result.testType === 'daily_challenge' && result.passed) {
        get().markDailyChallengeStatusCompleteAfterPassingDailyQuiz()
      }

      // 10. Add earned achievements to achievement slice
      if (newAchievementsEarned.badgesEarned || newAchievementsEarned.medalsEarned || newAchievementsEarned.trophiesEarned) {
        const { addAchievementsToHistory } = get()
        logger.log('🔄 addAchievementsToHistory...')
        addAchievementsToHistory(newAchievementsEarned)
        logger.log('✅ addAchievementsToHistory updated')
      }

      // 11. Mark paradoxes learned for passed regular quiz
      if (result.passed && result.testType === 'regular' || result.passed && result.testType === 'daily_challenge') {
        get().markFallaciesLearned(result.fallacyIds)  
      }

    } catch (error) {
      logger.log('❌ Quiz completion error:', error)
      // Cleanup on error
      set({
        currentSession: null,
        isQuizInProgress: false
      })
    }
  },
  setCompletionResult: (result: QuizCompletionResult) => {
    set({ completionResult: result })
  },
  addPointsFromQuizResult: (points: number) => {
    const { cumulativePoints } = get()
    set({ cumulativePoints: cumulativePoints + points })
  },
  calculatePointsOnStartup: () => {
    const { quizHistory } = get()
    let points = 0
    quizHistory.forEach((q: QuizResult) => {
      points += q.points!
    })
    set({ cumulativePoints: points })
  },
  calculateQuizQuickStats: () => {
    const { quizHistory } = get()
    const updatedQuizStats: QuizQuickStats = quizService.calculateQuizStats(quizHistory)
    set({quickQuizStats: updatedQuizStats})
  }
})