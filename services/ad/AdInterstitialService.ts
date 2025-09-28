import AD_UNIT_IDS from '@/constants/AdMob';
import logger from '@/utils/logger';
// Conditional import to avoid errors in development
let InterstitialAd: any;
let AdEventType: any;

try {
  const GoogleMobileAds = require('react-native-google-mobile-ads');
  InterstitialAd = GoogleMobileAds.InterstitialAd;
  AdEventType = GoogleMobileAds.AdEventType;
} catch (error) {
  logger.log('🚨 Google Mobile Ads not available:', error);
}

class AdInterstitialService {
  private static instance: AdInterstitialService;
  private interstitial: any = null;
  private isLoaded = false;
  private isInitialized = false;

  static getInstance(): AdInterstitialService {
    if (!AdInterstitialService.instance) {
      AdInterstitialService.instance = new AdInterstitialService();
    }
    return AdInterstitialService.instance;
  }

  // 🚀 Initialize the ad service
  async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      // // logger.log('🏆 Ad service already initialized!');
      return true;
    }

    if (!InterstitialAd || !AdEventType) {
      // // logger.log('🚨 AdMob not available - running in development mode');
      this.isInitialized = true;
      return false;
    }

    try {
      // // logger.log('🔥 Initializing UNLIMITED interstitial service...');
      
      this.interstitial = InterstitialAd.createForAdRequest(AD_UNIT_IDS.interstitial, {
        requestNonPersonalizedAdsOnly: true,
      });

      this.setupEventListeners();
      await this.loadAd();
      
      this.isInitialized = true;
      // // logger.log('🏆 UNLIMITED interstitial service initialized!');
      return true;
    } catch (error) {
      logger.error('🚨 Failed to initialize interstitial service:', error);
      this.isInitialized = false;
      return false;
    }
  }

  // 🎯 Set up event listeners
  private setupEventListeners(): void {
    if (!this.interstitial) return;

    this.interstitial.addAdEventListener(AdEventType.LOADED, () => {
      this.isLoaded = true;
      // // logger.log('🏆 UNLIMITED interstitial loaded and ready!');
    });

    this.interstitial.addAdEventListener(AdEventType.ERROR, (error: any) => {
      this.isLoaded = false;
      // // logger.error('🚨 Interstitial failed to load:', error);
      
      // Retry loading after a delay
      setTimeout(() => {
        this.loadAd();
      }, 5000);
    });

    this.interstitial.addAdEventListener(AdEventType.OPENED, () => {
      // // logger.log('👀 UNLIMITED interstitial ad opened!');
    });

    this.interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      // // logger.log('🔙 UNLIMITED interstitial closed - loading next ad!');
      this.isLoaded = false;
      // Load next ad for future use - NO LIMITS!
      this.loadAd();
    });

    this.interstitial.addAdEventListener(AdEventType.CLICKED, () => {
      // // logger.log('👆 UNLIMITED interstitial clicked! CHA-CHING!');
    });
  }

  // 🔄 Load the interstitial ad
  private async loadAd(): Promise<void> {
    if (!this.interstitial || this.isLoaded) return;

    try {
      // // logger.log('🔄 Loading UNLIMITED interstitial ad...');
      await this.interstitial.load();
    } catch (error) {
      logger.error('🚨 Error loading interstitial:', error);
    }
  }

  // 🎯 Show interstitial ad (MAIN PUBLIC METHOD - UNLIMITED MODE!)
  async showAd(): Promise<boolean> {
    // // logger.log('🎯 Attempting to show UNLIMITED interstitial...');

    // Check if service is ready
    if (!this.isInitialized) {
      // // logger.log('🚨 Service not initialized');
      return false;
    }

    // Check if ad is loaded
    if (!this.isLoaded) {
      // // logger.log('🚨 Ad not loaded yet');
      return false;
    }

    // Development mode simulation
    if (!this.interstitial) {
      // // logger.log('🔥 [DEV MODE] Simulating UNLIMITED interstitial');
      
      // Simulate a 2-second ad in development
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // // logger.log('🏆 [DEV MODE] UNLIMITED simulated ad completed');
      return true;
    }

    // Show the real ad - NO LIMITS!
    try {
      // // logger.log('🏆 Showing UNLIMITED interstitial ad now!');
      
      await this.interstitial.show();
      this.isLoaded = false; // Mark as used
      
      return true;
    } catch (error) {
      logger.error('🚨 Failed to show interstitial ad:', error);
      return false;
    }
  }

  // 🔍 Check if ad is ready to show
  isAdReady(): boolean {
    return this.isInitialized && this.isLoaded;
  }

  // 🔄 Force reload ad (for debugging)
  async forceReload(): Promise<void> {
    // // logger.log('🔄 Force reloading UNLIMITED interstitial...');
    this.isLoaded = false;
    await this.loadAd();
  }

  // 📊 Get service status
  getStatus() {
    return {
      initialized: this.isInitialized,
      loaded: this.isLoaded,
      ready: this.isAdReady(),
      mode: 'UNLIMITED_REVENUE'
    };
  }

  // 🧹 Cleanup
  destroy(): void {
    if (this.interstitial) {
      this.interstitial.removeAllListeners();
      this.interstitial = null;
    }
    
    this.isInitialized = false;
    this.isLoaded = false;
    
    // // logger.log('🧹 UNLIMITED interstitial service destroyed');
  }
}

// 🏆 Export singleton instance
const adInterstitialService = AdInterstitialService.getInstance();
export default adInterstitialService;

// =================================================================
// 🎯 UNLIMITED REVENUE USAGE EXAMPLE
// =================================================================

/*
🚀 IN useQuizState.submitQuiz() (or wherever you want to show interstitial ads):

import adInterstitialService from '@/services/AdInterstitialService';
import useAdState from '@/state/useAdState';

// In your quiz completion logic:
const adState = useAdState.getState();
adState.incrementQuizCounter();

// 🔥 UNLIMITED MODE: Only checks quiz count and purchase status!
if (adState.shouldShowInterstitialAd()) {
  // // logger.log('🎯 Showing UNLIMITED interstitial ad...');
  
  const adShown = await adInterstitialService.showAd();
  
  if (adShown) {
    adState.recordAdShown(); // This resets quiz counter for next cycle
    // // logger.log('🏆 UNLIMITED interstitial shown! Ready for next cycle!');
    
    // Optional: Small delay for better UX after ad
    await new Promise(resolve => setTimeout(resolve, 800));
  } else {
    // // logger.log('❌ Interstitial ad failed to show');
  }
} else {
  // // logger.log('💡 Interstitial not ready (need more quiz completions or purchased)');
}

// Continue with your normal navigation/completion logic...

🔧 FOR DEBUGGING:
// // logger.log('Ad Service Status:', adInterstitialService.getStatus());
// // logger.log('Should Show Interstitial:', useAdState.getState().shouldShowInterstitialAd());
// // logger.log('Should Show Banner:', useAdState.getState().shouldShowBannerAd());
// // logger.log('Quiz Count:', useAdState.getState().quizCompletionCounter);

🚀 IN APP STARTUP:
useEffect(() => {
  const initializeApp = async () => {
    // Initialize ad service
    await adInterstitialService.initialize();
    
    // Reset counters for new session
    useAdState.getState().resetCounters();
  };
  
  initializeApp();
}, []);

🏆 UNLIMITED REVENUE ARCHITECTURE:
- BANNERS: Always show for free users (persistent revenue on every screen)
- INTERSTITIALS: Every 3 quiz completions, NO SESSION LIMITS (unlimited revenue)
- NO TIME LIMITS: Ads can show back-to-back if user is engaged
- NO SESSION CAPS: Users can see 10, 20, 50+ ads if they keep taking quizzes
- ONLY LIMIT: User must purchase $3.99 IAP to stop all ads

🔥 MAXIMUM ENGAGEMENT = MAXIMUM REVENUE!
*/