import adInterstitialService from '@/services/ad/AdInterstitialService';
import { useAppState } from '@/state/useAppState';


let GoogleMobileAds: any;

try {
  GoogleMobileAds = require('react-native-google-mobile-ads');
} catch (error) {
  logger.warn('🚨 : Google Mobile Ads not available:', error);
}

const initializeAds = async () => {
  // logger.log('🔥 : Starting complete ad initialization...')
  
  if (!GoogleMobileAds) {
    // logger.log('🚨 : AdMob not available - skipping AdMob initialization')
    
    // Still initialize our interstitial service (handles dev mode gracefully)
    try {
      await adInterstitialService.initialize()
      // logger.log('🏆 : Interstitial service initialized (dev mode)')
    } catch (error) {
      logger.error('❌ : Failed to initialize interstitial service:', error)
    }
    
    // Reset ad state for new session
    useAppState.getState().resetCounters()
    // logger.log('🔄 : Ad state reset for new session')
    
    return;
  }

  try {
    // 🚀 STEP 1: Initialize Google Mobile Ads SDK
    // logger.log('🚀 : Initializing AdMob SDK...')
    await GoogleMobileAds.default().initialize();
    // logger.log('✅ : AdMob SDK initialized successfully!')
    
    // 🎯 STEP 2: Set request configuration
    await GoogleMobileAds.default().setRequestConfiguration({
      maxAdContentRating: 'T', // Teen content rating (perfect for educational app)
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: false,
    });
    // logger.log('⚙️ : AdMob request configuration set!')
    
    // 🔥 STEP 3: Initialize our interstitial service
    // logger.log('🔥 : Initializing interstitial service...')
    await adInterstitialService.initialize()
    // logger.log('🏆 : Interstitial service initialized successfully!')
    
    // 🔄 STEP 4: Reset ad state for new app session
    useAppState.getState().resetCounters()
    // logger.log('🔄 : Ad state reset for new session')
    
    // logger.log('🎉 : Complete ad initialization finished!')
    
  } catch (error) {
    logger.error('❌ : Failed to initialize ads:', error)
    
    // Even if AdMob fails, try to initialize our service
    try {
      await adInterstitialService.initialize()
      useAppState.getState().resetCounters()
      // logger.log('🏆 : Fallback initialization completed')
    } catch (fallbackError) {
      logger.error('❌ : Fallback initialization failed:', fallbackError)
    }
  }
};

export default initializeAds;