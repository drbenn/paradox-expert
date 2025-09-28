import AD_UNIT_IDS from '@/constants/AdMob';
import { useAppState } from '@/state/useAppState';
import React, { useMemo } from 'react';
import { Platform, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Conditional import to avoid errors in development
let BannerAd: any
let BannerAdSize: any
let TestIds: any

try {
  const GoogleMobileAds = require('react-native-google-mobile-ads')
  BannerAd = GoogleMobileAds.BannerAd
  BannerAdSize = GoogleMobileAds.BannerAdSize
  TestIds = GoogleMobileAds.TestIds
} catch (error) {
  logger.warn('GoogleMobileAds init error: ', error)
  // Development mode - AdMob not available
}

interface AdBannerProps {
  size?: any
  style?: ViewStyle
  marginVertical?: number
  position?: 'inline' | 'fixed-bottom'
  respectTabBar?: boolean
}

const AdBanner: React.FC<AdBannerProps> = ({
  size,
  style = {},
  marginVertical = 10,
  position = 'inline',
  respectTabBar = false
}) => {
  const insets = useSafeAreaInsets()
  
  // 🚨 FIX: Get state values directly without calling the spammy function repeatedly!
  const { adsPurchased, quizCompletionCounter, showAdEvery } = useAppState()

  // 🏆 CHAMPIONSHIP FIX: Calculate banner visibility with useMemo to prevent spam!
  const shouldShowBanner = useMemo(() => {
    // If user bought ad removal, NEVER show banner
    if (adsPurchased) {
      // Only log once when actually purchased (rare event)
      // logger.log('🏆 Banner hidden - user purchased ad removal!')
      return false
    }
    
    // Always show banner for free users (but don't spam logs!)
    return true
  }, [adsPurchased]) // Only recalculate when purchase status changes

  // 🚨 EARLY RETURN: No spam, just clean exit
  if (!shouldShowBanner) {
    return null
  }

  // 💰 IF WE GET HERE: User is free user, show banner (no spam logs!)

  // 🎯 Calculate smart spacing based on position
  const getSmartSpacing = () => {
    if (position === 'fixed-bottom') {
      const baseBottomPadding = Math.max(insets.bottom, 10)
      
      if (respectTabBar) {
        const tabBarHeight = Platform.OS === 'ios' ? 90 : 70
        return baseBottomPadding + tabBarHeight + 10
      }
      
      return baseBottomPadding
    }
    
    return marginVertical
  }

  // 🏆 Container styles
  const getContainerStyles = () => {
    const smartSpacing = getSmartSpacing()
    
    if (position === 'fixed-bottom') {
      return [
        styles.container,
        styles.fixedBottom,
        {
          paddingBottom: smartSpacing,
          paddingHorizontal: 10,
          backgroundColor: 'transparent',
        },
        style
      ]
    }
    
    return [
      styles.container,
      { marginVertical: smartSpacing },
      style
    ]
  }

  // 🔥 Development placeholder
  if (!BannerAd || !BannerAdSize) {
    if (__DEV__) {
      return (
        <View style={getContainerStyles()}>
          <View style={styles.placeholderAd}>
            <Text style={styles.placeholderText}>
              🏆 UNLIMITED REVENUE BANNER - ALWAYS SHOWS!
            </Text>
            <Text style={[styles.placeholderText, { fontSize: 10, marginTop: 4 }]}>
              Position: {position} | Next Interstitial: {quizCompletionCounter}/{showAdEvery}
            </Text>
            <Text style={[styles.placeholderText, { fontSize: 8, color: '#90EE90' }]}>
              NO LIMITS • MAXIMUM REVENUE MODE ACTIVE
            </Text>
          </View>
        </View>
      )
    }
    return null
  }

  // 🏆 Real banner ad - UNLIMITED REVENUE MODE!
  return (
    <View style={getContainerStyles()}>
      <BannerAd
        unitId={AD_UNIT_IDS.banner}
        size={size || BannerAdSize.ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          // Only log important events, not every render
          // // logger.log('🏆 Banner ad loaded!')
        }}
        onAdFailedToLoad={(error: any) => {
          // logger.log('🚨 Banner ad failed to load:', error)
        }}
        onAdOpened={() => {
          // logger.log('👀 Banner ad opened!')
        }}
        onAdClosed={() => {
          // logger.log('🔙 Banner ad closed!')
        }}
        onAdClicked={() => {
          // logger.log('👆 Banner ad clicked! MAXIMUM CHA-CHING!')
        }}
        onAdImpression={() => {
          // logger.log('📊 Banner impression! MONEY MONEY MONEY!')
        }}
      />
      
      {/* Debug info in development */}
      {__DEV__ && (
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>
            UNLIMITED REVENUE | Next Ad: {quizCompletionCounter}/{showAdEvery}
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixedBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 1000,
  },
  placeholderAd: {
    height: 50,
    backgroundColor: '#228B22', // Forest green for unlimited money!
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
    width: '100%',
    borderWidth: 3,
    borderColor: '#FFD700',
    paddingVertical: 8,
  },
  placeholderText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  debugInfo: {
    position: 'absolute',
    top: -20,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 0,
  },
  debugText: {
    color: '#90EE90',
    fontSize: 8,
    fontWeight: 'bold',
  },
})

export default AdBanner