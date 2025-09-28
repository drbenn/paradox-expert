import { Fallacy, QuizLearnedFallacyStats } from '@/types/app.types'
import logger from '@/utils/logger'
import { RelativePathString, router } from 'expo-router'
import { StateCreator } from 'zustand'
import fallaciesData from '../../assets/data/fallacies.json'

export interface FallacySlice {
  fallacies: Fallacy[]
  isFallaciesLoaded: boolean
  learnedStats: QuizLearnedFallacyStats
  
  // General Fallacy Actions
  loadFallacies: () => void
  getAllFallacies: () => Fallacy[]
  getFallacyById: (id: string) => Fallacy | undefined
  getRandomFallacy: () => Fallacy
  getFallacyByTitle: (title: string) => Fallacy | undefined
  getFallacyCount: () => number

  // Learned Actions
  isFallacyLearned: (fallacyId: string) => boolean
  toggleFallacyLearned: (fallacyId: string) => boolean
  markFallaciesLearned: (fallacyIds: string[]) => void
  calculateLearnedFallacyStats: () => void
  clearAllLearned: () => void

  // Favorite Actions
  isFallacyFavorite: (fallacyId: string) => boolean
  toggleFavoriteFallacy: (fallacyId: string) => boolean
  getFavoriteStats: () => { totalFavorites: number, favoriteIds: string[] }
  clearAllFavorites: () => void

  // Navigation Actions
  navigateToRandomFallacy: (method: string, currentId?: string) => void
  navigateToNextFallacy: (method: string, currentId: string) => void
  navigateToPreviousFallacy: (method: string, currentId: string) => void
  navigateToRelatedFallacy: (fallacyTitle: string, method: string) => void
}

export const fallacySlice: StateCreator<
  any, // Full app state - avoid circular dependency
  [],
  [],
  FallacySlice
> = (set, get) => ({
  // Initial state
  fallacies: [],
  isFallaciesLoaded: false,
  learnedStats: {
    totalLearned: 0,
    learnedIds: [],
    totalFallacies: 0
  },

  // General Fallacy Actions
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
      const fallacies = fallaciesData as Fallacy[]
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

  getFallacyById: (id: string) => {
    const fallacies = get().fallacies
    return fallacies.find((fallacy: Fallacy) => fallacy.id === id)
  },
  
  getRandomFallacy: () => {
    const fallacies = get().fallacies
    if (fallacies.length === 0) {
      throw new Error('No fallacies loaded')
    }
    const randomIndex = Math.floor(Math.random() * fallacies.length)
    return fallacies[randomIndex]
  },

  getFallacyByTitle: (title: string) => {
    const fallacies = get().fallacies
    return fallacies.find((fallacy: Fallacy) => fallacy.title === title)
  },

  getFallacyCount: () => {
    return get().fallacies.length
  },


  // Learned Actions

  isFallacyLearned: (fallacyId: string) => {
    const fallacy = get().getFallacyById(fallacyId)
    return fallacy?.isLearned || false
  },

  toggleFallacyLearned: (id: string) => {
    const { fallacies } = get()
    const fallacy = fallacies.find((f: Fallacy) => f.id === id)
    if (!fallacy) return false
    
    const updatedFallacies = fallacies.map((fallacy: Fallacy) =>
      fallacy.id === id
        ? { ...fallacy, isLearned: !fallacy.isLearned }
        : fallacy
    )
    set({ fallacies: updatedFallacies })
    return !fallacy.isLearned
  },

  markFallaciesLearned: (fallacyIds: string[]) => {
    const { fallacies } = get()
    const updatedFallacies = fallacies.map((fallacy: Fallacy) =>
      fallacyIds.includes(fallacy.id)
        ? { ...fallacy, isLearned: true }
        : fallacy
    )
    set({ fallacies: updatedFallacies })
    get().calculateLearnedFallacyStats()
  },

  calculateLearnedFallacyStats: () => {
    const { fallacies } = get()
    const learnedFallacies = fallacies.filter((f: Fallacy) => f.isLearned)
    const learnedStats: QuizLearnedFallacyStats = {
      totalLearned: learnedFallacies.length,
      learnedIds: learnedFallacies.map((f: Fallacy) => f.id),
      totalFallacies: fallacies.length
    }
    set({ learnedStats: learnedStats })
  },

  clearAllLearned: () => {
    const { fallacies } = get()
    const updatedFallacies = fallacies.map((fallacy: Fallacy) => ({
      ...fallacy,
      isLearned: false
    }))
    set({ fallacies: updatedFallacies })
  },


  // Favorite Actions

  isFallacyFavorite: (fallacyId: string) => {
    const fallacy = get().getFallacyById(fallacyId)
    return fallacy?.isFavorite || false
  },

  toggleFavoriteFallacy: (id: string) => {
    const { fallacies } = get()
    const fallacy = fallacies.find((f: Fallacy) => f.id === id)
    if (!fallacy) return false
    
    const updatedFallacies = fallacies.map((fallacy: Fallacy) =>
      fallacy.id === id
        ? { ...fallacy, isFavorite: !fallacy.isFavorite }
        : fallacy
    )
    set({ fallacies: updatedFallacies })
    return !fallacy.isFavorite
  },

  getFavoriteStats: () => {
    const { fallacies } = get()
    const favoriteFallacies = fallacies.filter((f: Fallacy) => f.isFavorite)
    
    return {
      totalFavorites: favoriteFallacies.length,
      favoriteIds: favoriteFallacies.map((f: Fallacy) => f.id)
    }
  },

  clearAllFavorites: () => {
    const { fallacies } = get()
    const updatedFallacies = fallacies.map((fallacy: Fallacy) => ({
      ...fallacy,
      isFavorite: false
    }))
    set({ fallacies: updatedFallacies })
  },


  // 🧭 NAVIGATION ACTIONS!
  navigateToRandomFallacy: (method: string, currentId?: string) => {
    const { fallacies } = get() 
    if (fallacies.length === 0) {
      // logger.warn('No fallacies loaded')
      return
    }
    
    let randomFallacy: Fallacy
    
    if (currentId) {
      const availableFallacies = fallacies.filter((f: Fallacy) => f.id !== currentId)
      if (availableFallacies.length === 0) {
        randomFallacy = fallacies[0]
      } else {
        const randomIndex = Math.floor(Math.random() * availableFallacies.length)
        randomFallacy = availableFallacies[randomIndex]
      }
    } else {
      randomFallacy = get().getRandomFallacy()
    }
    
    if (method === 'push') {
      router.push({
        pathname: "/(tabs)/library/fallacy/[id]" as RelativePathString,
        params: { id: randomFallacy.id }
      })
    } else {
      router.replace({
        pathname: "/(tabs)/library/fallacy/[id]" as RelativePathString,
        params: { id: randomFallacy.id }
      })
    }
  },
  
  navigateToNextFallacy: (method: string, currentId: string) => {
    const { fallacies } = get() 
    if (fallacies.length === 0) {
      // logger.warn('No fallacies loaded')
      return
    }
    
    const currentIndex = fallacies.findIndex((f: Fallacy) => f.id === currentId)
    let nextIndex
    
    if (currentIndex === -1 || currentIndex === fallacies.length - 1) {
      nextIndex = 0
    } else {
      nextIndex = currentIndex + 1
    }
    
    const nextFallacy = fallacies[nextIndex]

    if (method === 'push') {
      router.push({
        pathname: "/(tabs)/library/fallacy/[id]" as RelativePathString,
        params: { id: nextFallacy.id }
      })
    } else {
      router.replace({
        pathname: "/(tabs)/library/fallacy/[id]" as RelativePathString,
        params: { id: nextFallacy.id }
      })
    }
  },

  navigateToPreviousFallacy: (method: string, currentId: string) => {
    const { fallacies } = get()  
    if (fallacies.length === 0) {
      // logger.warn('No fallacies loaded')
      return
    }
    
    const currentIndex = fallacies.findIndex((f: Fallacy) => f.id === currentId)
    let nextIndex
    
    if (currentIndex === -1 || currentIndex === 0) {
      nextIndex = fallacies.length - 1
    } else {
      nextIndex = currentIndex - 1
    }
    
    const previousFallacy = fallacies[nextIndex]

    if (method === 'push') {
      router.push({
        pathname: "/(tabs)/library/fallacy/[id]" as RelativePathString,
        params: { id: previousFallacy.id }
      })
    } else {
      router.replace({
        pathname: "/(tabs)/library/fallacy/[id]" as RelativePathString,
        params: { id: previousFallacy.id }
      })
    }
  },

  navigateToRelatedFallacy: (fallacyTitle: string, method: string) => {
    // Get the fallacy by title from the fallacy state
    const relatedFallacy = get().getFallacyByTitle(fallacyTitle)
    
    if (!relatedFallacy) {
      // logger.warn(`Related fallacy not found: ${fallacyTitle}`)
      return
    }
    
    // logger.log(`Navigating to related fallacy: ${fallacyTitle} (ID: ${relatedFallacy.id})`)
    
    if (method === 'push') {
      router.push({
        pathname: "/(tabs)/library/fallacy/[id]" as RelativePathString,
        params: { id: relatedFallacy.id }
      })
    } else {
      router.replace({
        pathname: "/(tabs)/library/fallacy/[id]" as RelativePathString,
        params: { id: relatedFallacy.id }
      })
    }
  },
})