import { Paradox, QuizLearnedParadoxStats } from '@/types/app.types'
import logger from '@/utils/logger'
import { RelativePathString, router } from 'expo-router'
import { StateCreator } from 'zustand'
import fallaciesData from '../../assets/data/paradoxes.json'

export interface ParadoxSlice {
  paradoxes: Paradox[]
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
  paradoxes: [],
  isFallaciesLoaded: false,
  learnedStats: {
    totalLearned: 0,
    learnedIds: [],
    totalFallacies: 0
  },

  // General Paradox Actions
  loadFallacies: () => {
    console.log('loading paradoxes:')
    
    const { paradoxes, isFallaciesLoaded } = get()

    // Don't reload if already loaded (prevents overwriting user progress)
    if (paradoxes.length > 0 && !isFallaciesLoaded) {
      logger.log(`✅ : Loaded ${paradoxes.length} paradoxes already loaded in persistent memory`)
      set({ isFallaciesLoaded: true })
      return
    }

    try {
      const paradoxes = fallaciesData as Paradox[]
      logger.log(`✅ : Loaded ${paradoxes.length} paradoxes from JSON`)
      // Load fresh data from JSON (only on first run or if persistence failed)
      const fallaciesWithDefaults = paradoxes.map((paradox: any) => ({
        ...paradox,
        isFavorite: false,
        isLearned: false
      }))
      
      set({ 
        paradoxes: fallaciesWithDefaults, 
        isFallaciesLoaded: true 
      })
    } catch (error) {
      logger.error('❌ : Error loading paradoxes:', error)
      set({ 
        paradoxes: [],
        fallaciesLoaded: false 
      })
    }
  },

  getAllFallacies: () => get().paradoxes,

  getParadoxById: (id: string) => {
    const paradoxes = get().paradoxes
    return paradoxes.find((paradox: Paradox) => paradox.id === id)
  },
  
  getRandomParadox: () => {
    const paradoxes = get().paradoxes
    if (paradoxes.length === 0) {
      throw new Error('No paradoxes loaded')
    }
    const randomIndex = Math.floor(Math.random() * paradoxes.length)
    return paradoxes[randomIndex]
  },

  getParadoxByTitle: (title: string) => {
    const paradoxes = get().paradoxes
    return paradoxes.find((paradox: Paradox) => paradox.title === title)
  },

  getParadoxCount: () => {
    return get().paradoxes.length
  },


  // Learned Actions

  isParadoxLearned: (fallacyId: string) => {
    const paradox = get().getParadoxById(fallacyId)
    return paradox?.isLearned || false
  },

  toggleParadoxLearned: (id: string) => {
    const { paradoxes } = get()
    const paradox = paradoxes.find((f: Paradox) => f.id === id)
    if (!paradox) return false
    
    const updatedFallacies = paradoxes.map((paradox: Paradox) =>
      paradox.id === id
        ? { ...paradox, isLearned: !paradox.isLearned }
        : paradox
    )
    set({ paradoxes: updatedFallacies })
    return !paradox.isLearned
  },

  markFallaciesLearned: (fallacyIds: string[]) => {
    const { paradoxes } = get()
    const updatedFallacies = paradoxes.map((paradox: Paradox) =>
      fallacyIds.includes(paradox.id)
        ? { ...paradox, isLearned: true }
        : paradox
    )
    set({ paradoxes: updatedFallacies })
    get().calculateLearnedParadoxStats()
  },

  calculateLearnedParadoxStats: () => {
    const { paradoxes } = get()
    const learnedFallacies = paradoxes.filter((f: Paradox) => f.isLearned)
    const learnedStats: QuizLearnedParadoxStats = {
      totalLearned: learnedFallacies.length,
      learnedIds: learnedFallacies.map((f: Paradox) => f.id),
      totalFallacies: paradoxes.length
    }
    set({ learnedStats: learnedStats })
  },

  clearAllLearned: () => {
    const { paradoxes } = get()
    const updatedFallacies = paradoxes.map((paradox: Paradox) => ({
      ...paradox,
      isLearned: false
    }))
    set({ paradoxes: updatedFallacies })
  },


  // Favorite Actions

  isParadoxFavorite: (fallacyId: string) => {
    const paradox = get().getParadoxById(fallacyId)
    return paradox?.isFavorite || false
  },

  toggleFavoriteParadox: (id: string) => {
    const { paradoxes } = get()
    const paradox = paradoxes.find((f: Paradox) => f.id === id)
    if (!paradox) return false
    
    const updatedFallacies = paradoxes.map((paradox: Paradox) =>
      paradox.id === id
        ? { ...paradox, isFavorite: !paradox.isFavorite }
        : paradox
    )
    set({ paradoxes: updatedFallacies })
    return !paradox.isFavorite
  },

  getFavoriteStats: () => {
    const { paradoxes } = get()
    const favoriteFallacies = paradoxes.filter((f: Paradox) => f.isFavorite)
    
    return {
      totalFavorites: favoriteFallacies.length,
      favoriteIds: favoriteFallacies.map((f: Paradox) => f.id)
    }
  },

  clearAllFavorites: () => {
    const { paradoxes } = get()
    const updatedFallacies = paradoxes.map((paradox: Paradox) => ({
      ...paradox,
      isFavorite: false
    }))
    set({ paradoxes: updatedFallacies })
  },


  // 🧭 NAVIGATION ACTIONS!
  navigateToRandomParadox: (method: string, currentId?: string) => {
    const { paradoxes } = get() 
    if (paradoxes.length === 0) {
      // logger.warn('No paradoxes loaded')
      return
    }
    
    let randomParadox: Paradox
    
    if (currentId) {
      const availableFallacies = paradoxes.filter((f: Paradox) => f.id !== currentId)
      if (availableFallacies.length === 0) {
        randomParadox = paradoxes[0]
      } else {
        const randomIndex = Math.floor(Math.random() * availableFallacies.length)
        randomParadox = availableFallacies[randomIndex]
      }
    } else {
      randomParadox = get().getRandomParadox()
    }
    
    if (method === 'push') {
      router.push({
        pathname: "/(tabs)/library/paradox/[id]" as RelativePathString,
        params: { id: randomParadox.id }
      })
    } else {
      router.replace({
        pathname: "/(tabs)/library/paradox/[id]" as RelativePathString,
        params: { id: randomParadox.id }
      })
    }
  },
  
  navigateToNextParadox: (method: string, currentId: string) => {
    const { paradoxes } = get() 
    if (paradoxes.length === 0) {
      // logger.warn('No paradoxes loaded')
      return
    }
    
    const currentIndex = paradoxes.findIndex((f: Paradox) => f.id === currentId)
    let nextIndex
    
    if (currentIndex === -1 || currentIndex === paradoxes.length - 1) {
      nextIndex = 0
    } else {
      nextIndex = currentIndex + 1
    }
    
    const nextParadox = paradoxes[nextIndex]

    if (method === 'push') {
      router.push({
        pathname: "/(tabs)/library/paradox/[id]" as RelativePathString,
        params: { id: nextParadox.id }
      })
    } else {
      router.replace({
        pathname: "/(tabs)/library/paradox/[id]" as RelativePathString,
        params: { id: nextParadox.id }
      })
    }
  },

  navigateToPreviousParadox: (method: string, currentId: string) => {
    const { paradoxes } = get()  
    if (paradoxes.length === 0) {
      // logger.warn('No paradoxes loaded')
      return
    }
    
    const currentIndex = paradoxes.findIndex((f: Paradox) => f.id === currentId)
    let nextIndex
    
    if (currentIndex === -1 || currentIndex === 0) {
      nextIndex = paradoxes.length - 1
    } else {
      nextIndex = currentIndex - 1
    }
    
    const previousParadox = paradoxes[nextIndex]

    if (method === 'push') {
      router.push({
        pathname: "/(tabs)/library/paradox/[id]" as RelativePathString,
        params: { id: previousParadox.id }
      })
    } else {
      router.replace({
        pathname: "/(tabs)/library/paradox/[id]" as RelativePathString,
        params: { id: previousParadox.id }
      })
    }
  },

  navigateToRelatedParadox: (fallacyTitle: string, method: string) => {
    // Get the paradox by title from the paradox state
    const relatedParadox = get().getParadoxByTitle(fallacyTitle)
    
    if (!relatedParadox) {
      // logger.warn(`Related paradox not found: ${fallacyTitle}`)
      return
    }
    
    // logger.log(`Navigating to related paradox: ${fallacyTitle} (ID: ${relatedParadox.id})`)
    
    if (method === 'push') {
      router.push({
        pathname: "/(tabs)/library/paradox/[id]" as RelativePathString,
        params: { id: relatedParadox.id }
      })
    } else {
      router.replace({
        pathname: "/(tabs)/library/paradox/[id]" as RelativePathString,
        params: { id: relatedParadox.id }
      })
    }
  },
})