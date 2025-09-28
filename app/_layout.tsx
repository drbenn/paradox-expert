import AdBanner from '@/components/custom/ads/AdBanner'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { useAppState } from '@/state/useAppState'
import initializeAds from '@/utils/initializeAds'
import Constants from 'expo-constants'
import { useFonts } from 'expo-font'
import * as Notifications from 'expo-notifications'
import { router, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { LogBox, View } from 'react-native'
import 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// 📢 NOTIFICATION SETUP
const isExpoGo = Constants.executionEnvironment === 'storeClient';
const notificationsAvailable = !isExpoGo;

// 🔥 CRITICAL: Set up notification handler GLOBALLY
if (notificationsAvailable) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowAlert: true,
      shouldShowBanner: true, // KEY for foreground notifications!
      shouldShowList: true,
    }),
  });
}

export default function RootLayout() {
  LogBox.ignoreAllLogs(false)

  const insets = useSafeAreaInsets()
  const { colors, colorScheme } = useSystemTheme()


  const [appInitialized, setAppInitialized] = useState(false)
  const initializationRef = useRef(false)
  
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  const isFallaciesLoaded = useAppState((state) => state.isFallaciesLoaded)
  const loadFallacies = useAppState((state) => state.loadFallacies)
  const setNextQuizOrTest = useAppState((state) => state.setNextQuizOrTest)

  const isBadgesLoaded = useAppState((state) => state.isBadgesLoaded)
  const loadAllBadges = useAppState((state) => state.loadAllBadges)
  const calculateLearnedFallacyStats = useAppState((state) => state.calculateLearnedFallacyStats)
  const calculatePointsOnStartup = useAppState((state) => state.calculatePointsOnStartup)
  const dailyChallengeStatus = useAppState((state) => state.dailyChallengeStatus)
  const getNewFallacyForDailyChallenge = useAppState((state) => state.getNewFallacyForDailyChallenge)
  const startDailyResetTimer = useAppState((state) => state.startDailyResetTimer)
  const isInitOnboardingcComplete = useAppState((state) => state.isInitOnboardingcComplete)

  const hasHydrated = useAppState((state) => state._hasHydrated) 
    const initializeApp = useCallback(async () => {

  // ðŸš¨ CRITICAL: Wait for Zustand rehydration first!
  if (!hasHydrated) {
    logger.log('🚀 Waiting for Zustand rehydration...')
    return
  }

    // 🚨 CRITICAL: Prevent multiple initializations!
    if (initializationRef.current) {
      // logger.log('🛑 Initialization already in progress or complete - STOPPING!')
      return
    }
    
    initializationRef.current = true
    
    try {

      if (!isFallaciesLoaded) {
        loadFallacies()
      }

      if (!isBadgesLoaded) {
        loadAllBadges()
      }

      if (!dailyChallengeStatus) {
        logger.log('🚀 Get new daily challange on first use!')
        getNewFallacyForDailyChallenge()
      }

      setNextQuizOrTest()
      calculateLearnedFallacyStats()
      calculatePointsOnStartup()
      startDailyResetTimer()
      
      if (!isInitOnboardingcComplete) {
        router.push('/(tabs)/settings/tutorial')
      }
      
      // 🔥 Initialize ads and IAP in parallel!
      // logger.log('💰 LAYOUT: Initializing ads and IAP systems...')
      await Promise.all([
        initializeAds(),
        // initializeIAP()
      ])
      logger.log('🏆 LAYOUT: Ads and IAP systems initialized!')

      logger.log('🏆 LAYOUT: SINGLE app initialization complete!')
      setAppInitialized(true)
    } catch (error) {
      logger.log('❌ LAYOUT: Error in initialization:', error)
      setAppInitialized(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isFallaciesLoaded,
    loadFallacies
  ])

  useEffect(() => {
    if (loaded && hasHydrated && !initializationRef.current) {
      initializeApp()
    }
  }, [loaded, hasHydrated, initializeApp])

  if (!loaded) {
    // Async font loading only occurs in development.
    return null
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingBottom: Math.max(insets.bottom, 10) }}>
      <StatusBar 
        style={colorScheme === 'dark' ? "light" : "dark"} 
      />

      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

          <Stack.Screen 
            name="screens/quiz/active" 
            options={{ 
              headerShown: true,
              title: 'Quiz in Progress!',
              headerBackVisible: false,
              gestureEnabled: false,
              presentation: 'modal',
              animation: 'fade',
              headerStyle: {
                backgroundColor: colors.border
            
              },
              headerTintColor: colors.text
            }} 
          />
          <Stack.Screen 
            name="screens/quiz/results" 
            options={{ 
              headerShown: true,
              title: 'Quiz Results', 
              headerBackVisible: false,
              gestureEnabled: false,
              animation: 'fade',
              headerStyle: { backgroundColor: colors.border },
              headerTintColor: colors.text
            }} 
          />
          <Stack.Screen 
            name="screens/quiz/achievement-results" 
            options={{ 
              headerShown: true,
              title: 'Achievement Results', 
              headerBackVisible: false,
              gestureEnabled: false,
              animation: 'fade',
              headerStyle: { backgroundColor: colors.border },
              headerTintColor: colors.text
            }} 
          />
          {/* <Stack.Screen 
            name="screens/quiz/trophy-celebration-screen" 
            options={{
              headerShown: false,
              animation: 'slide_from_right',
              gestureEnabled: false,
            }}
          />
          <Stack.Screen 
            name="screens/quiz/badge-celebration-screen" 
            options={{
              headerShown: false,
              animation: 'slide_from_right',
              gestureEnabled: false,
            }}
          /> */}

          <Stack.Screen name="+not-found" />
        </Stack>
      </View>

      <AdBanner 
        marginVertical={0}
        style={{ 
          paddingHorizontal: 10,
          backgroundColor: colors.background,
          zIndex: 1000,
          elevation: 1000,
        }}
      />
    </View>
  )
}
