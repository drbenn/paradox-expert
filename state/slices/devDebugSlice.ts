import { StateCreator } from 'zustand';

export interface DevDebugSlice {
  // Proeprties
  isQuizCheatsEnabled: boolean
  debugModeUnlocked: boolean
  debugModeActive: boolean
  
  // Actions
  toggleIsQuizCheatsEnabled: () => void;
  setDebugModeUnlocked: () => void;
  toggleDebugMode: () => void;
  resetAppData: () => void
}

export const devDebugSliceSlice: StateCreator<
  any, // Full app state - avoid circular dependency
  [],
  [],
  DevDebugSlice
> = (set, get) => ({
  // Initial properties
  isQuizCheatsEnabled: false,
  debugModeUnlocked: false,
  debugModeActive: true,

  // Actions
  toggleIsQuizCheatsEnabled: () => {
    const { isQuizCheatsEnabled } = get()
  set({ isQuizCheatsEnabled: !isQuizCheatsEnabled });
  },
  setDebugModeUnlocked: () => {
    set({ debugModeUnlocked: true });
  },
  toggleDebugMode: () => {
    const { debugModeActive } = get()
    set({ debugModeActive: !debugModeActive });
  },
  resetAppData: () => {
    // fallacy slice
    const { clearAllLearned, clearAllFavorites, calculateLearnedFallacyStats } =  get()
    clearAllLearned()
    clearAllFavorites()
    calculateLearnedFallacyStats()

    // quiz slice
    set({
      quizHistory: [],
      nextQuizOrTest: null,
      quickQuizStats: {
        quizPassRate: 0,
        uniqueQuizzesPassed: 0,
        uniqueUnitTestsPassed: 0,
        dailyChallengesPassed: 0,
        weeklyGauntletsPassed: 0
      },
      cumulativePoints: 0,
      isInitOnboardingcComplete: false
    })
    const { setNextQuizOrTest } = get()
    setNextQuizOrTest()

    // achievement slice
    const { allBadges } = get()
    set({
      earnedAchievements: [],
      achievementQuickStats: {
        bronzeMedals: 0,
        silverMedals: 0,
        goldMedals: 0,
        smallTrophies: 0,
        largeTrophies: 0,
        badges: 0,
        badgesAvalaible: allBadges.length,
        totalEarnedAchievements: 0,
      }
    })

    // daily challenge slice
    set({
      dailyChallengeStatus: {
        isCompleted: false,
        todaysFallacy: null,
        isLoading: false,
        lastFallacyChangeDateTime: null
      }
    })
    const { getNewFallacyForDailyChallenge } = get()
    getNewFallacyForDailyChallenge()
  }
});


