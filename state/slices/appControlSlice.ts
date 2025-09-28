import { StateCreator } from 'zustand'

export interface AppControlSlice {
  // General UI State
  isAppLoading: boolean
  isInitOnboardingcComplete: boolean
  notificationsEnabled: boolean
  notificationTime: string
  
  // Actions
  setAppLoading: (loading: boolean) => void
  setNotificationsEnabled: (enabled: boolean) => void
  setNotificationTime: (time: string) => void
  setOnBoardingComplete: () => void
}

export const appControlSlice: StateCreator<
  any, // Full app state - avoid circular dependency
  [],
  [],
  AppControlSlice
> = (set, get) => ({
  // Initial state
  isAppLoading: false,
  isInitOnboardingcComplete: false,
  notificationsEnabled: false,
  notificationTime: '09:00',

  // Actions
  setAppLoading: (loading: boolean) => {
    set({ isAppLoading: loading })
  },
  setNotificationsEnabled: (enabled: boolean) => set({ notificationsEnabled: enabled }),
  setNotificationTime: (time: string) => set({ notificationTime: time }),
  setOnBoardingComplete: () => set({isInitOnboardingcComplete: true})
})