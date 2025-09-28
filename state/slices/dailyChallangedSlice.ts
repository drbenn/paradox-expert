import APP_CONSTANTS from '@/constants/appConstants';
import { DateService } from '@/services/DateService';
import dailyChallangeQuizService from '@/services/quiz/DailyChallengeQuizService';
import { Paradox } from '@/types/app.types';
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
  navigateToDailyChallengeParadox: () => void
  getNewParadoxForDailyChallenge: () => void
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
  navigateToDailyChallengeParadox: () => {
    const todaysChallenge = get().dailyChallengeStatus.todaysParadox
    const paradoxId = todaysChallenge?.id
    if (paradoxId) {
      router.push({
        pathname: "/(tabs)/library/paradox/[id]",
        params: { id: paradoxId || 1 }
      });
    }
  },

  getNewParadoxForDailyChallenge: () => {
    const { quizHistory, paradoxes, dailyChallengeStatus } = get()

    set({dailyChallengeStatus: { ...dailyChallengeStatus, isDailyChallengeLoading: true }})

    const newDailyParadox: Paradox = dailyChallangeQuizService.determineNewDailyChallengeParadox(quizHistory, paradoxes)
    const nowDateTime: string = DateService.getLocalISOString()

    set({
      dailyChallengeStatus: {
          isCompleted: false,
          todaysParadox: newDailyParadox,
          isLoading: false,
          lastParadoxChangeDateTime: nowDateTime
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
        get().getNewParadoxForDailyChallenge()
        return
      }

      const lastChangeTime = new Date(dailyChallengeStatus.lastParadoxChangeDateTime)
      const todaysResetTime = new Date()
      todaysResetTime.setHours(APP_CONSTANTS.DAILY_RESET_CONFIG.RESET_HOUR, APP_CONSTANTS.DAILY_RESET_CONFIG.RESET_MINUTE, 0, 0)

      const needsReset = !dailyChallengeStatus.lastParadoxChangeDateTime ||
                        (now >= todaysResetTime && lastChangeTime < todaysResetTime)

        logger.log('🔍 RESET CHECK DEBUG:', {
          hasLastChangeTime: !!dailyChallengeStatus.lastParadoxChangeDateTime,
          lastChangeTime: dailyChallengeStatus.lastParadoxChangeDateTime,
          currentTime: now.toISOString(),
          nextResetTime: nextReset.toISOString(),
          nowGreaterThanNextReset: now >= nextReset,
          lastChangeBeforeNextReset: dailyChallengeStatus.lastParadoxChangeDateTime ? 
            new Date(dailyChallengeStatus.lastParadoxChangeDateTime) < nextReset : 'N/A',
          needsReset
        })
      if (needsReset) {
        const reason = !dailyChallengeStatus.lastUpdatedDate 
          ? 'never initialized'
          : `date changed from ${dailyChallengeStatus.lastUpdatedDate} to ${todayDateString}`
        
        logger.log('🌅 DAILY RESET: Loading daily challenge -', reason)
        
        try {
          get().getNewParadoxForDailyChallenge()
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