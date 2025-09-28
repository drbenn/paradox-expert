/**
 * !!!!EXTRA IDS NEEDDED!!! 
 * 
 * The below ids are related to the specific ads in the app only.
 * 
 * You need to update app.son -> plugins -> react-native-google-mobile-ads with
 * with appropriate app id as these init the entire admob sdk, are required for the sdk
 * to work at all and set once per installed app.
 */

import { Platform } from 'react-native';
import APP_CONSTANTS from './appConstants';
/**
 * 🏆  ADMOB CONFIGURATION
 * 
 * IMPORTANT: You need separate ad unit IDs for each platform!
 * 
 * In your AdMob console:
 * 1. Create Android app → Get Android ad unit IDs
 * 2. Create iOS app → Get iOS ad unit IDs
 * 
 * The app IDs go in app.json, but ad unit IDs are platform-specific!
 */


// 🔥 PLATFORM-SPECIFIC AD UNIT IDS
const AD_UNIT_IDS = {
  banner: (__DEV__ || APP_CONSTANTS.ADS_TESTING_PHASE)
    ? 'ca-app-pub-3940256099942544/6300978111' // 🧪 GOOGLE'S OFFICIAL TEST BANNER ID
    : Platform.OS === 'ios'
      ? 'tbd' // 🍎 YOUR REAL iOS BANNER AD UNIT ID
      : 'ca-app-pub-1220609263451519/2034800961', // 🤖 YOUR REAL ANDROID BANNER AD UNIT ID
  
  interstitial: (__DEV__ || APP_CONSTANTS.ADS_TESTING_PHASE)
    ? 'ca-app-pub-3940256099942544/1033173712' // 🧪 GOOGLE'S OFFICIAL TEST INTERSTITIAL ID
    : Platform.OS === 'ios'
      ? 'tbd' // 🍎 YOUR REAL iOS INTERSTITIAL AD UNIT ID
      : 'ca-app-pub-1220609263451519/7103294811', // 🤖 YOUR REAL ANDROID INTERSTITIAL AD UNIT ID
} as const;

export default AD_UNIT_IDS;

// =================================================================
// 🎯  SETUP CHECKLIST
// =================================================================

/*
📱 IN ADMOB CONSOLE:

1. 🤖 ANDROID APP:
   - App ID: ca-app-pub-1220609263451519~XXXXXXXXXX (goes in app.json)
   - Banner Ad Unit: ca-app-pub-1220609263451519/XXXXXXXXXX
   - Interstitial Ad Unit: ca-app-pub-1220609263451519/XXXXXXXXXX
   - Rewarded Ad Unit: ca-app-pub-1220609263451519/XXXXXXXXXX

2. 🍎 iOS APP:
   - App ID: ca-app-pub-1220609263451519~YYYYYYYYYY (goes in app.json)
   - Banner Ad Unit: ca-app-pub-1220609263451519/YYYYYYYYYY
   - Interstitial Ad Unit: ca-app-pub-1220609263451519/YYYYYYYYYY
   - Rewarded Ad Unit: ca-app-pub-1220609263451519/YYYYYYYYYY

📝 IN APP.JSON:
{
  "expo": {
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-1220609263451519~ANDROID_APP_ID",
          "iosAppId": "ca-app-pub-1220609263451519~IOS_APP_ID"
        }
      ]
    ]
  }
}

🔥 IN THIS FILE (AdMob.ts):
- Replace YOUR_IOS_BANNER_AD_UNIT_ID_HERE with actual iOS banner ID
- Replace YOUR_ANDROID_BANNER_AD_UNIT_ID_HERE with actual Android banner ID
- Replace YOUR_IOS_INTERSTITIAL_AD_UNIT_ID_HERE with actual iOS interstitial ID
- Replace YOUR_ANDROID_INTERSTITIAL_AD_UNIT_ID_HERE with actual Android interstitial ID

⚠️ IMPORTANT NOTES:
- Test ad unit IDs work on both platforms (that's why they're the same)
- Production ad unit IDs are platform-specific (that's why they're different)
- App IDs in app.json initialize the SDK for each platform
- Ad Unit IDs in this file determine which ads to load
*/

// =================================================================
// 🔧 DEBUGGING HELPERS
// =================================================================

export const getAdUnitInfo = () => {
  const platform = Platform.OS;
  const environment = __DEV__ ? 'TEST' : 'PRODUCTION';
  
  return {
    platform,
    environment,
    bannerAdUnit: AD_UNIT_IDS.banner,
    interstitialAdUnit: AD_UNIT_IDS.interstitial,
  };
};

// 🎯 USAGE FOR DEBUGGING:
// logger.log('🔍  AD UNIT INFO:', getAdUnitInfo());

// =================================================================
// 🏆 EXAMPLE PRODUCTION IDS (REPLACE WITH YOUR ACTUAL IDS)
// =================================================================

/*
🤖 ANDROID EXAMPLE:
banner: 'ca-app-pub-1220609263451519/1234567890'
interstitial: 'ca-app-pub-1220609263451519/0987654321'

🍎 iOS EXAMPLE:
banner: 'ca-app-pub-1220609263451519/5544332211'
interstitial: 'ca-app-pub-1220609263451519/9988776655'

The actual IDs will be different - get them from your AdMob console!
*/