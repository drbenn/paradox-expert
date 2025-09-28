import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { achievementSlice, AchievementSlice } from './slices/achievementSlice'
import { adSlice, AdSlice } from './slices/adSlice'
import { appControlSlice, AppControlSlice } from './slices/appControlSlice'
import { dailyChallengeSlice, DailyChallengeSlice } from './slices/dailyChallangedSlice'
import { DevDebugSlice, devDebugSliceSlice } from './slices/devDebugSlice'
import { fallacySlice, ParadoxSlice } from './slices/paradoxSlice'
import { quizSlice, QuizSlice } from './slices/quizSlice'

export type AppState = AppControlSlice & AdSlice & ParadoxSlice & QuizSlice & DevDebugSlice & AchievementSlice & DailyChallengeSlice & {
  _hasHydrated?: boolean
}

export const useAppState = create<AppState>()(
  persist(
    (...a) => ({
      ...appControlSlice(...a),
      ...adSlice(...a),
      ...fallacySlice(...a),
      ...quizSlice(...a),
      ...devDebugSliceSlice(...a),
      ...achievementSlice(...a),
      ...dailyChallengeSlice(...a),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage), // ✅ Configure AsyncStorage for React Native
      partialize: (state) => ({       
        // Paradox Slice Persistence
        paradoxes: state.paradoxes,
        isFallaciesLoaded: state.isFallaciesLoaded,
        learnedStats: state.learnedStats,

        // Quiz Slice Persistence
        quizHistory: state.quizHistory,
        nextQuizOrTest: state.nextQuizOrTest,
        cumulativePoints: state.cumulativePoints,
        quickQuizStats: state.quickQuizStats,

        // AchievementSlice Persistence
        allBadges: state.allBadges,
        isBadgesLoaded: state.isBadgesLoaded,
        earnedAchievements: state.earnedAchievements,
        achievementQuickStats: state.achievementQuickStats,

        // Ads Slice
        adsPurchased: state.adsPurchased,

        // App Control Slice
        notificationsEnabled: state.notificationsEnabled,
        notificationTime: state.notificationTime,
        isInitOnboardingcComplete: state.isInitOnboardingcComplete,

        // Dev Debug Slice
        isQuizCheatsEnabled: state.isQuizCheatsEnabled,
        debugModeUnlocked: state.debugModeUnlocked,
        debugModeActive: state.debugModeActive,

        // Daily Challenge Slice
        dailyChallengeStatus: state.dailyChallengeStatus,
        
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true
        }
      },
    }
  )
)