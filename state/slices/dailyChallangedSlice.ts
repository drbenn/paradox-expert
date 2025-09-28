import APP_CONSTANTS from '@/constants/appConstants';
import { DateService } from '@/services/DateService';
import dailyChallangeQuizService from '@/services/quiz/DailyChallengeQuizService';
import { Fallacy } from '@/types/app.types';
import { DailyChallengeStatus, DailyResetTimerInfo } from '@/types/quiz.types';
import { formatResetTime, getNextDailyResetTime, getTimeUntilReset } from '@/utils/dailyResetUtils';
import { router } from 'expo-router';
import { StateCreator } from 'zustand';

export interface DailyChallengeSlice {
  // // General UI State
  dailyChallengeStatus: DailyChallengeStatus | null

  // Timer State
  dailyResetTimerId: ReturnType<typeof setInterval> | null
  dailyResetTimerInfo: DailyResetTimerInfo
  
  
  // // Actions
  // loadDailyChallengeStatus: () => void
  navigateToDailyChallengeFallacy: () => void
  getNewFallacyForDailyChallenge: () => void
  markDailyChallengeStatusCompleteAfterPassingDailyQuiz: () => void


  // Timer Methods
  startDailyResetTimer: () => void
  stopDailyResetTimer: () => void
  getDailyResetTimerInfo: () => DailyResetTimerInfo & { resetTimeFormatted: string }
}

export const dailyChallengeSlice: StateCreator<
  any, // Full app state - avoid circular dependency
  [],
  [],
  DailyChallengeSlice
> = (set, get) => ({
  // Initial state
  dailyChallengeStatus: null,
  dailyResetTimerId: null,
  dailyResetTimerInfo: {
    isActive: false,
    lastCheckTime: null,
    nextResetTime: getNextDailyResetTime(),
    timeUntilReset: getTimeUntilReset(),
    checkCount: 0
  },

  // // Actions
  navigateToDailyChallengeFallacy: () => {
    const todaysChallenge = get().dailyChallengeStatus.todaysFallacy
    const fallacyId = todaysChallenge?.id
    if (fallacyId) {
      router.push({
        pathname: "/(tabs)/library/fallacy/[id]",
        params: { id: fallacyId || 1 }
      });
    }
  },

  getNewFallacyForDailyChallenge: () => {
    const { quizHistory, fallacies, dailyChallengeStatus } = get()

    set({dailyChallengeStatus: { ...dailyChallengeStatus, isDailyChallengeLoading: true }})

    const newDailyFallacy: Fallacy = dailyChallangeQuizService.determineNewDailyChallengeFallacy(quizHistory, fallacies)
    const nowDateTime: string = DateService.getLocalISOString()

    set({
      dailyChallengeStatus: {
          isCompleted: false,
          todaysFallacy: newDailyFallacy,
          isLoading: false,
          lastFallacyChangeDateTime: nowDateTime
      }
    })
  },
  markDailyChallengeStatusCompleteAfterPassingDailyQuiz: () => {
    // only called after passing quizResult with passed and testType of 'daily_challenge'
    const { dailyChallengeStatus } = get()

    set({
    dailyChallengeStatus: {
        ...dailyChallengeStatus,
        isCompleted: true,
      }
    })
  },

    // Timer Methods
  startDailyResetTimer: () => {
    // Stop any existing timer first
    get().stopDailyResetTimer()

    logger.log('🕐 DAILY TIMER: Starting daily reset timer (checks every 10 seconds)')
    logger.log('🕐 DAILY TIMER: Reset scheduled for:', formatResetTime())

    const timerId = setInterval(async () => {
      const now = new Date()
      const nextReset = getNextDailyResetTime()
      const timeUntil = getTimeUntilReset()
      const todayDateString = DateService.getLocalISOString().split('T')[0]
    
      // Update the timer info
      set((state: any) => ({
        dailyResetTimerInfo: {
          ...state.dailyResetTimerInfo,
          lastCheckTime: DateService.getLocalISOString(),
          nextResetTime: nextReset,
          timeUntilReset: timeUntil,
          checkCount: state.dailyResetTimerInfo.checkCount + 1
        }
      }))
    
      logger.log('🕐 DAILY TIMER: Check #' + get().dailyResetTimerInfo.checkCount, {
        currentTime: now.toLocaleTimeString(),
        nextReset: nextReset.toLocaleString(),
        timeUntilReset: Math.round(timeUntil / 1000 / 60) + ' minutes'
      })
      
      // Check if daily challenge needs reset
      const { dailyChallengeStatus } = get()

      if (!dailyChallengeStatus) {
        logger.log('⚠️ DAILY TIMER: No daily challenge status, triggering load')
        get().getNewFallacyForDailyChallenge()
        return
      }

      const lastChangeTime = new Date(dailyChallengeStatus.lastFallacyChangeDateTime)
      const todaysResetTime = new Date()
      todaysResetTime.setHours(APP_CONSTANTS.DAILY_RESET_CONFIG.RESET_HOUR, APP_CONSTANTS.DAILY_RESET_CONFIG.RESET_MINUTE, 0, 0)

      const needsReset = !dailyChallengeStatus.lastFallacyChangeDateTime ||
                        (now >= todaysResetTime && lastChangeTime < todaysResetTime)

        logger.log('🔍 RESET CHECK DEBUG:', {
          hasLastChangeTime: !!dailyChallengeStatus.lastFallacyChangeDateTime,
          lastChangeTime: dailyChallengeStatus.lastFallacyChangeDateTime,
          currentTime: now.toISOString(),
          nextResetTime: nextReset.toISOString(),
          nowGreaterThanNextReset: now >= nextReset,
          lastChangeBeforeNextReset: dailyChallengeStatus.lastFallacyChangeDateTime ? 
            new Date(dailyChallengeStatus.lastFallacyChangeDateTime) < nextReset : 'N/A',
          needsReset
        })
      if (needsReset) {
        const reason = !dailyChallengeStatus.lastUpdatedDate 
          ? 'never initialized'
          : `date changed from ${dailyChallengeStatus.lastUpdatedDate} to ${todayDateString}`
        
        logger.log('🌅 DAILY RESET: Loading daily challenge -', reason)
        
        try {
          get().getNewFallacyForDailyChallenge()
          logger.log('✅ DAILY RESET: Daily challenge updated successfully')
        } catch (error) {
          logger.error('❌ DAILY RESET: Failed to update daily challenge:', error)
        }
      }
    
    }, APP_CONSTANTS.DAILY_RESET_CONFIG.CHECK_INTERVAL)

    // Mark timer as active and store the timer ID
    set({
      dailyResetTimerId: timerId,
      dailyResetTimerInfo: {
        ...get().dailyResetTimerInfo,
        isActive: true
      }
    })
  },

  stopDailyResetTimer: () => {
    const { dailyResetTimerId } = get()
    
    if (dailyResetTimerId) {
      clearInterval(dailyResetTimerId)
      logger.log('🛑 DAILY TIMER: Timer stopped')
      
      set({
        dailyResetTimerId: null,
        dailyResetTimerInfo: {
          ...get().dailyResetTimerInfo,
          isActive: false
        }
      })
    }
  },

  getDailyResetTimerInfo: () => {
    const { dailyResetTimerInfo } = get()
    
    return {
      ...dailyResetTimerInfo,
      resetTimeFormatted: formatResetTime()
    }
  }
});