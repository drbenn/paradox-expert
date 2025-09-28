import { Paradox, QuizLearnedParadoxStats } from '@/types/app.types'
import logger from '@/utils/logger'
import { RelativePathString, router } from 'expo-router'
import { StateCreator } from 'zustand'
import paradoxData from '../../assets/data/paradoxes.json'

export interface ParadoxSlice {
  paradoxes: Paradox[]
  isParadoxesLoaded: boolean
  learnedStats: QuizLearnedParadoxStats
  
  // General Paradox Actions
  loadParadoxes: () => void
  getAllParadoxes: () => Paradox[]
  getParadoxById: (id: string) => Paradox | undefined
  getRandomParadox: () => Paradox
  getParadoxByTitle: (title: string) => Paradox | undefined
  getParadoxCount: () => number

  // Learned Actions
  isParadoxLearned: (paradoxId: string) => boolean
  toggleParadoxLearned: (paradoxId: string) => boolean
  markParadoxesLearned: (paradoxIds: string[]) => void
  calculateLearnedParadoxStats: () => void
  clearAllLearned: () => void

  // Favorite Actions
  isParadoxFavorite: (paradoxId: string) => boolean
  toggleFavoriteParadox: (paradoxId: string) => boolean
  getFavoriteStats: () => { totalFavorites: number, favoriteIds: string[] }
  clearAllFavorites: () => void

  // Navigation Actions
  navigateToRandomParadox: (method: string, currentId?: string) => void
  navigateToNextParadox: (method: string, currentId: string) => void
  navigateToPreviousParadox: (method: string, currentId: string) => void
  navigateToRelatedParadox: (paradoxTitle: string, method: string) => void
}

export const paradoxSlice: StateCreator<
  any, // Full app state - avoid circular dependency
  [],
  [],
  ParadoxSlice
> = (set, get) => ({
  // Initial state
  paradoxes: [],
  isParadoxesLoaded: false,
  learnedStats: {
    totalLearned: 0,
    learnedIds: [],
    totalParadoxes: 0
  },

  // General Paradox Actions
  loadParadoxes: () => {
    console.log('loading paradoxes:')
    
    const { paradoxes, isParadoxesLoaded } = get()

    // Don't reload if already loaded (prevents overwriting user progress)
    if (paradoxes.length > 0 && !isParadoxesLoaded) {
      logger.log(`✅ : Loaded ${paradoxes.length} paradoxes already loaded in persistent memory`)
      set({ isParadoxesLoaded: true })
      return
    }

    try {
      const paradoxes = paradoxData as Paradox[]
      logger.log(`✅ : Loaded ${paradoxes.length} paradoxes from JSON`)
      // Load fresh data from JSON (only on first run or if persistence failed)
      const paradoxesWithDefaults = paradoxes.map((paradox: any) => ({
        ...paradox,
        isFavorite: false,
        isLearned: false
      }))
      
      set({ 
        paradoxes: paradoxesWithDefaults, 
        isParadoxesLoaded: true 
      })
    } catch (error) {
      logger.error('❌ : Error loading paradoxes:', error)
      set({ 
        paradoxes: [],
        paradoxesLoaded: false 
      })
    }
  },

  getAllParadoxes: () => get().paradoxes,

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

  isParadoxLearned: (paradoxId: string) => {
    const paradox = get().getParadoxById(paradoxId)
    return paradox?.isLearned || false
  },

  toggleParadoxLearned: (id: string) => {
    const { paradoxes } = get()
    const paradox = paradoxes.find((f: Paradox) => f.id === id)
    if (!paradox) return false
    
    const updatedParadoxes = paradoxes.map((paradox: Paradox) =>
      paradox.id === id
        ? { ...paradox, isLearned: !paradox.isLearned }
        : paradox
    )
    set({ paradoxes: updatedParadoxes })
    return !paradox.isLearned
  },

  markParadoxesLearned: (paradoxIds: string[]) => {
    const { paradoxes } = get()
    const updatedParadoxes = paradoxes.map((paradox: Paradox) =>
      paradoxIds.includes(paradox.id)
        ? { ...paradox, isLearned: true }
        : paradox
    )
    set({ paradoxes: updatedParadoxes })
    get().calculateLearnedParadoxStats()
  },

  calculateLearnedParadoxStats: () => {
    const { paradoxes } = get()
    const learnedParadoxes = paradoxes.filter((f: Paradox) => f.isLearned)
    const learnedStats: QuizLearnedParadoxStats = {
      totalLearned: learnedParadoxes.length,
      learnedIds: learnedParadoxes.map((f: Paradox) => f.id),
      totalParadoxes: paradoxes.length
    }
    set({ learnedStats: learnedStats })
  },

  clearAllLearned: () => {
    const { paradoxes } = get()
    const updatedParadoxes = paradoxes.map((paradox: Paradox) => ({
      ...paradox,
      isLearned: false
    }))
    set({ paradoxes: updatedParadoxes })
  },


  // Favorite Actions

  isParadoxFavorite: (paradoxId: string) => {
    const paradox = get().getParadoxById(paradoxId)
    return paradox?.isFavorite || false
  },

  toggleFavoriteParadox: (id: string) => {
    const { paradoxes } = get()
    const paradox = paradoxes.find((f: Paradox) => f.id === id)
    if (!paradox) return false
    
    const updatedParadoxes = paradoxes.map((paradox: Paradox) =>
      paradox.id === id
        ? { ...paradox, isFavorite: !paradox.isFavorite }
        : paradox
    )
    set({ paradoxes: updatedParadoxes })
    return !paradox.isFavorite
  },

  getFavoriteStats: () => {
    const { paradoxes } = get()
    const favoriteParadoxes = paradoxes.filter((f: Paradox) => f.isFavorite)
    
    return {
      totalFavorites: favoriteParadoxes.length,
      favoriteIds: favoriteParadoxes.map((f: Paradox) => f.id)
    }
  },

  clearAllFavorites: () => {
    const { paradoxes } = get()
    const updatedParadoxes = paradoxes.map((paradox: Paradox) => ({
      ...paradox,
      isFavorite: false
    }))
    set({ paradoxes: updatedParadoxes })
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
      const availableParadoxes = paradoxes.filter((f: Paradox) => f.id !== currentId)
      if (availableParadoxes.length === 0) {
        randomParadox = paradoxes[0]
      } else {
        const randomIndex = Math.floor(Math.random() * availableParadoxes.length)
        randomParadox = availableParadoxes[randomIndex]
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

  navigateToRelatedParadox: (paradoxTitle: string, method: string) => {
    // Get the paradox by title from the paradox state
    const relatedParadox = get().getParadoxByTitle(paradoxTitle)
    
    if (!relatedParadox) {
      // logger.warn(`Related paradox not found: ${paradoxTitle}`)
      return
    }
    
    // logger.log(`Navigating to related paradox: ${paradoxTitle} (ID: ${relatedParadox.id})`)
    
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