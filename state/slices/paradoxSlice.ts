import { Paradox, QuizLearnedParadoxStats } from '@/types/app.types'
import logger from '@/utils/logger'
import { RelativePathString, router } from 'expo-router'
import { StateCreator } from 'zustand'
import fallaciesData from '../../assets/data/fallacies.json'

export interface ParadoxSlice {
  fallacies: Paradox[]
  isFallaciesLoaded: boolean
  learnedStats: QuizLearnedParadoxStats
  
  // General Paradox Actions
  loadFallacies: () => void
  getAllFallacies: () => Paradox[]
  getParadoxById: (id: string) => Paradox | undefined
  getRandomParadox: () => Paradox
  getParadoxByTitle: (title: string) => Paradox | undefined
  getParadoxCount: () => number

  // Learned Actions
  isParadoxLearned: (fallacyId: string) => boolean
  toggleParadoxLearned: (fallacyId: string) => boolean
  markFallaciesLearned: (fallacyIds: string[]) => void
  calculateLearnedParadoxStats: () => void
  clearAllLearned: () => void

  // Favorite Actions
  isParadoxFavorite: (fallacyId: string) => boolean
  toggleFavoriteParadox: (fallacyId: string) => boolean
  getFavoriteStats: () => { totalFavorites: number, favoriteIds: string[] }
  clearAllFavorites: () => void

  // Navigation Actions
  navigateToRandomParadox: (method: string, currentId?: string) => void
  navigateToNextParadox: (method: string, currentId: string) => void
  navigateToPreviousParadox: (method: string, currentId: string) => void
  navigateToRelatedParadox: (fallacyTitle: string, method: string) => void
}

export const fallacySlice: StateCreator<
  any, // Full app state - avoid circular dependency
  [],
  [],
  ParadoxSlice
> = (set, get) => ({
  // Initial state
  fallacies: [],
  isFallaciesLoaded: false,
  learnedStats: {
    totalLearned: 0,
    learnedIds: [],
    totalFallacies: 0
  },

  // General Paradox Actions
  loadFallacies: () => {
    console.log('loading fallacies:')
    
    const { fallacies, isFallaciesLoaded } = get()

    // Don't reload if already loaded (prevents overwriting user progress)
    if (fallacies.length > 0 && !isFallaciesLoaded) {
      logger.log(`✅ : Loaded ${fallacies.length} fallacies already loaded in persistent memory`)
      set({ isFallaciesLoaded: true })
      return
    }

    try {
      const fallacies = fallaciesData as Paradox[]
      logger.log(`✅ : Loaded ${fallacies.length} fallacies from JSON`)
      // Load fresh data from JSON (only on first run or if persistence failed)
      const fallaciesWithDefaults = fallacies.map((fallacy: any) => ({
        ...fallacy,
        isFavorite: false,
        isLearned: false
      }))
      
      set({ 
        fallacies: fallaciesWithDefaults, 
        isFallaciesLoaded: true 
      })
    } catch (error) {
      logger.error('❌ : Error loading fallacies:', error)
      set({ 
        fallacies: [],
        fallaciesLoaded: false 
      })
    }
  },

  getAllFallacies: () => get().fallacies,

  getParadoxById: (id: string) => {
    const fallacies = get().fallacies
    return fallacies.find((fallacy: Paradox) => fallacy.id === id)
  },
  
  getRandomParadox: () => {
    const fallacies = get().fallacies
    if (fallacies.length === 0) {
      throw new Error('No fallacies loaded')
    }
    const randomIndex = Math.floor(Math.random() * fallacies.length)
    return fallacies[randomIndex]
  },

  getParadoxByTitle: (title: string) => {
    const fallacies = get().fallacies
    return fallacies.find((fallacy: Paradox) => fallacy.title === title)
  },

  getParadoxCount: () => {
    return get().fallacies.length
  },


  // Learned Actions

  isParadoxLearned: (fallacyId: string) => {
    const fallacy = get().getParadoxById(fallacyId)
    return fallacy?.isLearned || false
  },

  toggleParadoxLearned: (id: string) => {
    const { fallacies } = get()
    const fallacy = fallacies.find((f: Paradox) => f.id === id)
    if (!fallacy) return false
    
    const updatedFallacies = fallacies.map((fallacy: Paradox) =>
      fallacy.id === id
        ? { ...fallacy, isLearned: !fallacy.isLearned }
        : fallacy
    )
    set({ fallacies: updatedFallacies })
    return !fallacy.isLearned
  },

  markFallaciesLearned: (fallacyIds: string[]) => {
    const { fallacies } = get()
    const updatedFallacies = fallacies.map((fallacy: Paradox) =>
      fallacyIds.includes(fallacy.id)
        ? { ...fallacy, isLearned: true }
        : fallacy
    )
    set({ fallacies: updatedFallacies })
    get().calculateLearnedParadoxStats()
  },

  calculateLearnedParadoxStats: () => {
    const { fallacies } = get()
    const learnedFallacies = fallacies.filter((f: Paradox) => f.isLearned)
    const learnedStats: QuizLearnedParadoxStats = {
      totalLearned: learnedFallacies.length,
      learnedIds: learnedFallacies.map((f: Paradox) => f.id),
      totalFallacies: fallacies.length
    }
    set({ learnedStats: learnedStats })
  },

  clearAllLearned: () => {
    const { fallacies } = get()
    const updatedFallacies = fallacies.map((fallacy: Paradox) => ({
      ...fallacy,
      isLearned: false
    }))
    set({ fallacies: updatedFallacies })
  },


  // Favorite Actions

  isParadoxFavorite: (fallacyId: string) => {
    const fallacy = get().getParadoxById(fallacyId)
    return fallacy?.isFavorite || false
  },

  toggleFavoriteParadox: (id: string) => {
    const { fallacies } = get()
    const fallacy = fallacies.find((f: Paradox) => f.id === id)
    if (!fallacy) return false
    
    const updatedFallacies = fallacies.map((fallacy: Paradox) =>
      fallacy.id === id
        ? { ...fallacy, isFavorite: !fallacy.isFavorite }
        : fallacy
    )
    set({ fallacies: updatedFallacies })
    return !fallacy.isFavorite
  },

  getFavoriteStats: () => {
    const { fallacies } = get()
    const favoriteFallacies = fallacies.filter((f: Paradox) => f.isFavorite)
    
    return {
      totalFavorites: favoriteFallacies.length,
      favoriteIds: favoriteFallacies.map((f: Paradox) => f.id)
    }
  },

  clearAllFavorites: () => {
    const { fallacies } = get()
    const updatedFallacies = fallacies.map((fallacy: Paradox) => ({
      ...fallacy,
      isFavorite: false
    }))
    set({ fallacies: updatedFallacies })
  },


  // 🧭 NAVIGATION ACTIONS!
  navigateToRandomParadox: (method: string, currentId?: string) => {
    const { fallacies } = get() 
    if (fallacies.length === 0) {
      // logger.warn('No fallacies loaded')
      return
    }
    
    let randomParadox: Paradox
    
    if (currentId) {
      const availableFallacies = fallacies.filter((f: Paradox) => f.id !== currentId)
      if (availableFallacies.length === 0) {
        randomParadox = fallacies[0]
      } else {
        const randomIndex = Math.floor(Math.random() * availableFallacies.length)
        randomParadox = availableFallacies[randomIndex]
      }
    } else {
      randomParadox = get().getRandomParadox()
    }
    
    if (method === 'push') {
      router.push({
        pathname: "/(tabs)/library/fallacy/[id]" as RelativePathString,
        params: { id: randomParadox.id }
      })
    } else {
      router.replace({
        pathname: "/(tabs)/library/fallacy/[id]" as RelativePathString,
        params: { id: randomParadox.id }
      })
    }
  },
  
  navigateToNextParadox: (method: string, currentId: string) => {
    const { fallacies } = get() 
    if (fallacies.length === 0) {
      // logger.warn('No fallacies loaded')
      return
    }
    
    const currentIndex = fallacies.findIndex((f: Paradox) => f.id === currentId)
    let nextIndex
    
    if (currentIndex === -1 || currentIndex === fallacies.length - 1) {
      nextIndex = 0
    } else {
      nextIndex = currentIndex + 1
    }
    
    const nextParadox = fallacies[nextIndex]

    if (method === 'push') {
      router.push({
        pathname: "/(tabs)/library/fallacy/[id]" as RelativePathString,
        params: { id: nextParadox.id }
      })
    } else {
      router.replace({
        pathname: "/(tabs)/library/fallacy/[id]" as RelativePathString,
        params: { id: nextParadox.id }
      })
    }
  },

  navigateToPreviousParadox: (method: string, currentId: string) => {
    const { fallacies } = get()  
    if (fallacies.length === 0) {
      // logger.warn('No fallacies loaded')
      return
    }
    
    const currentIndex = fallacies.findIndex((f: Paradox) => f.id === currentId)
    let nextIndex
    
    if (currentIndex === -1 || currentIndex === 0) {
      nextIndex = fallacies.length - 1
    } else {
      nextIndex = currentIndex - 1
    }
    
    const previousParadox = fallacies[nextIndex]

    if (method === 'push') {
      router.push({
        pathname: "/(tabs)/library/fallacy/[id]" as RelativePathString,
        params: { id: previousParadox.id }
      })
    } else {
      router.replace({
        pathname: "/(tabs)/library/fallacy/[id]" as RelativePathString,
        params: { id: previousParadox.id }
      })
    }
  },

  navigateToRelatedParadox: (fallacyTitle: string, method: string) => {
    // Get the fallacy by title from the fallacy state
    const relatedParadox = get().getParadoxByTitle(fallacyTitle)
    
    if (!relatedParadox) {
      // logger.warn(`Related fallacy not found: ${fallacyTitle}`)
      return
    }
    
    // logger.log(`Navigating to related fallacy: ${fallacyTitle} (ID: ${relatedParadox.id})`)
    
    if (method === 'push') {
      router.push({
        pathname: "/(tabs)/library/fallacy/[id]" as RelativePathString,
        params: { id: relatedParadox.id }
      })
    } else {
      router.replace({
        pathname: "/(tabs)/library/fallacy/[id]" as RelativePathString,
        params: { id: relatedParadox.id }
      })
    }
  },
})