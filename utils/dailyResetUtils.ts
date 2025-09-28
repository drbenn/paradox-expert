import APP_CONSTANTS from '@/constants/appConstants'

// Utility function to get the next reset time
export function getNextDailyResetTime(): Date {
  const now = new Date()
  const nextReset = new Date(now)
  
  // Set to today's reset time
  nextReset.setHours(APP_CONSTANTS.DAILY_RESET_CONFIG.RESET_HOUR, APP_CONSTANTS.DAILY_RESET_CONFIG.RESET_MINUTE, 0, 0)
  
  // If reset time has already passed today, move to tomorrow
  if (nextReset <= now) {
    nextReset.setDate(nextReset.getDate() + 1)
  }
  
  return nextReset
}

// Utility function to format the reset time for display
export function formatResetTime(): string {
  const hour = APP_CONSTANTS.DAILY_RESET_CONFIG.RESET_HOUR
  const minute = APP_CONSTANTS.DAILY_RESET_CONFIG.RESET_MINUTE
  
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const minuteStr = minute.toString().padStart(2, '0')
  
  return `${hour12}:${minuteStr} ${ampm}`
}

// Utility function to get time until next reset in milliseconds
export function getTimeUntilReset(): number {
  const now = new Date()
  const nextReset = getNextDailyResetTime()
  return nextReset.getTime() - now.getTime()
}