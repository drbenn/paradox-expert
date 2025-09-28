import AnimatedTabWrapper, { TabAnimationPresets } from '@/components/custom/AnimatedTabWrapper'
import APP_CONSTANTS from '@/constants/appConstants'
import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { useAppState } from '@/state/useAppState'
// import useAdState from '@/state/useAdState'
// import useAppControlState from '@/state/useAppControlState'
// import useOnboardingState from '@/state/useOnboardingState'
import { router } from 'expo-router'
import * as StoreReview from 'expo-store-review'
import { useState } from 'react'
import {
    Alert,
    SafeAreaView,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function SettingsScreen() {
  const insets = useSafeAreaInsets()
  const { colors, colorScheme } = useSystemTheme()
  const [showDebugPanel, setShowDebugPanel] = useState(false)
  const debugModeUnlocked = useAppState((state) => state.debugModeUnlocked)
  const debugModeActive = useAppState((state) => state.debugModeActive)
  const toggleDebugMode = useAppState((state) => state.toggleDebugMode)
  
  // // 🔥 Get IAP purchase status
  // const { hasAdsPurchased } = useAdState();

  // // 🎯 ONBOARDING STATE
  // const { startOnboarding, resetOnboarding } = useOnboardingState()

  // 🎯 ONBOARDING HANDLER
  // const handleStartOnboarding = () => {
  //   Alert.alert(
  //     "App Walkthrough",
  //     "Would you like to take a guided tour of Paradox Expert's features?",
  //     [
  //       { text: "Cancel", style: "cancel" },
  //       { 
  //         text: "Start Tour", 
  //         style: "default",
  //         onPress: () => {
  //           startOnboarding()
  //           // Navigate to starting point (Library)
  //           router.push('/(tabs)/library')
  //         }
  //       }
  //     ]
  //   )
  // }

  // 🎮 DEBUG MODE TOGGLE HANDLER
  const handleDebugToggle = () => {
    if (debugModeActive) {
      // If currently active, offer to disable or open developer settings
      Alert.alert(
        "Developer Mode Active",
        "Debug mode is currently enabled. What would you like to do?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Open Developer Settings", 
            style: "default",
            onPress: () => router.push('/(tabs)/settings/developer')
          },
          { 
            text: "Disable Debug Mode", 
            style: "destructive",
            onPress: toggleDebugMode
          }
        ]
      )
    } else {
      // If not active, enable it
      Alert.alert(
        "Developer Mode",
        "Enable advanced debugging features?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Enable", 
            style: "default",
            onPress: toggleDebugMode
          }
        ]
      )
    }
  }

  // 🏆 IAP HANDLER
  const handleRemoveAds = async () => {
    // try {
    //   logger.log('🔥 Starting ad removal purchase...');
    //   const result = await purchaseRemoveAds();
      
    //   if (result.success) {
    //     Alert.alert(
    //       "🏆 SUCCESS!",
    //       "Ads removed forever! Thanks for supporting Paradox Expert! 💪",
    //       [{ text: "OHHH YEAH!", style: "default" }]
    //     );
    //   } else {
    //     Alert.alert(
    //       "Purchase Failed", 
    //       result.error || "Something went wrong. Please try again.",
    //       [{ text: "OK", style: "default" }]
    //     );
    //   }
    // } catch (error: any) {
    //   logger.log('❌ Purchase error:', error);
    //   Alert.alert("Error", "Unable to process purchase. Please try again.");
    // }
  };

  // 🏆 RATE APP HANDLER  
  async function handleRateApp() {
    try {
      // 🔥 ONE LINE OF CODE DOES EVERYTHING!
      await StoreReview.requestReview();
      logger.log('🏆 Review dialog shown!');
    } catch (error) {
      logger.log('Review request failed:', error);
    }
  }

  // 🎯 SHARE HANDLER
  async function handleShareAppWithFriends() {
    try {
      await Share.share({
        message: `🧠 Check out Paradox Expert - the app that's making critical thinking training as addictive as gaming! Master 200 logical fallacies through interactive quizzes, daily challenges, and weekly gauntlets. Level up your reasoning skills and become a logic champion! 💪 \n\n ${APP_CONSTANTS.APP_NAME}: ${APP_CONSTANTS.APP_WEBSITE}`,
        url: APP_CONSTANTS.APP_WEBSITE,
        title: `${APP_CONSTANTS.APP_NAME} App`
      });
    } catch (error) {
      logger.log('Error sharing:', error);
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background}]}>
      <AnimatedTabWrapper {...TabAnimationPresets.veniceBeachFade}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContentContainer, {paddingTop: insets.top, paddingBottom: insets.bottom + 80 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Customize your experience
            </Text>
          </View>

          <View style={styles.settingsContainer}>
            
            {/* REMOVE ADS BUTTON */}
            {/* <TouchableOpacity
              style={[
                styles.settingButton,
                { 
                  backgroundColor: hasAdsPurchased() ? colors.primary + '20' : colors.surface,
                  borderColor: hasAdsPurchased() ? colors.primary : colors.border,
                }
              ]}
              onPress={hasAdsPurchased() ? undefined : handleRemoveAds}
              activeOpacity={hasAdsPurchased() ? 1 : 0.8}
              disabled={hasAdsPurchased()}
            >
              <View style={styles.settingContent}>
                <View style={styles.settingLeft}>
                  <View style={[
                    styles.emojiContainer, 
                    { 
                      backgroundColor: hasAdsPurchased() ? colors.primary + '30' : colors.background 
                    }
                  ]}>
                    <Text style={styles.settingEmoji}>{hasAdsPurchased() ? '🏆' : '✨'}</Text>
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[
                      styles.settingTitle, 
                      { 
                        color: hasAdsPurchased() ? colors.primary : colors.text 
                      }
                    ]}>
                      {hasAdsPurchased() ? 'Ads Removed - Thank You!' : 'Support App | Remove Ads'}
                    </Text>
                    <Text style={[
                      styles.settingSubtitle, 
                      { 
                        color: hasAdsPurchased() ? colors.primary : colors.textSecondary 
                      }
                    ]}>
                      {hasAdsPurchased() ? 'You\'re supporting Paradox Expert!' : 'Remove ads and support this app for $3.99'}
                    </Text>
                  </View>
                </View>
                {!hasAdsPurchased() && (
                  <Text style={[styles.chevron, { color: colors.textSecondary }]}>→</Text>
                )}
                {hasAdsPurchased() && (
                  <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>
                )}
              </View>
            </TouchableOpacity> */}

            {/* NOTIFICATIONS BUTTON */}
            <TouchableOpacity
              style={[
                styles.settingButton,
                { 
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }
              ]}
              onPress={() => router.push('/(tabs)/settings/notification-settings')}
              activeOpacity={0.8}
            >
              <View style={styles.settingContent}>
                <View style={styles.settingLeft}>
                  <View style={[
                    styles.emojiContainer, 
                    { backgroundColor: colors.background }
                  ]}>
                    <Text style={styles.settingEmoji}>🔔</Text>
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>
                      Notifications
                    </Text>
                    <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                      Manage daily fallacy reminder
                    </Text>
                  </View>
                </View>
                <Text style={[styles.chevron, { color: colors.textSecondary }]}>→</Text>
              </View>
            </TouchableOpacity>

            {/* RATE APP BUTTON */}
            <TouchableOpacity
              style={[
                styles.settingButton,
                { 
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }
              ]}
              onPress={handleRateApp}
              activeOpacity={0.8}
            >
              <View style={styles.settingContent}>
                <View style={styles.settingLeft}>
                  <View style={[
                    styles.emojiContainer, 
                    { backgroundColor: colors.background }
                  ]}>
                    <Text style={styles.settingEmoji}>⭐</Text>
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>
                      Rate This App
                    </Text>
                    <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                      Leave a review on the app store
                    </Text>
                  </View>
                </View>
                <Text style={[styles.chevron, { color: colors.textSecondary }]}>→</Text>
              </View>
            </TouchableOpacity>

            {/* SHARE WITH FRIENDS BUTTON */}
            <TouchableOpacity
              style={[
                styles.settingButton,
                { 
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }
              ]}
              onPress={handleShareAppWithFriends}
              activeOpacity={0.8}
            >
              <View style={styles.settingContent}>
                <View style={styles.settingLeft}>
                  <View style={[
                    styles.emojiContainer, 
                    { backgroundColor: colors.background }
                  ]}>
                    <Text style={styles.settingEmoji}>📤</Text>
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>
                      Share with Friends
                    </Text>
                    <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                      Tell others about this app
                    </Text>
                  </View>
                </View>
                <Text style={[styles.chevron, { color: colors.textSecondary }]}>→</Text>
              </View>
            </TouchableOpacity>

            {/* TUTORIAL BUTTON */}
            <TouchableOpacity
              style={[
                styles.settingButton,
                { 
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }
              ]}
              onPress={() => router.push('/(tabs)/settings/tutorial')}
              activeOpacity={0.8}
            >
              <View style={styles.settingContent}>
                <View style={styles.settingLeft}>
                  <View style={[
                    styles.emojiContainer, 
                    { backgroundColor: colors.background }
                  ]}>
                    <Text style={styles.settingEmoji}>ℹ🏫</Text>
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>
                      Tutorial
                    </Text>
                    <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                      Quick feature explanation of the app!
                    </Text>
                  </View>
                </View>
                <Text style={[styles.chevron, { color: colors.textSecondary }]}>→</Text>
              </View>
            </TouchableOpacity>



            {/* ABOUT BUTTON */}
            <TouchableOpacity
              style={[
                styles.settingButton,
                { 
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }
              ]}
              onPress={() => router.push('/(tabs)/settings/about')}
              activeOpacity={0.8}
            >
              <View style={styles.settingContent}>
                <View style={styles.settingLeft}>
                  <View style={[
                    styles.emojiContainer, 
                    { backgroundColor: colors.background }
                  ]}>
                    <Text style={styles.settingEmoji}>ℹ️</Text>
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>
                      About
                    </Text>
                    <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
                      App info and credits
                    </Text>
                  </View>
                </View>
                <Text style={[styles.chevron, { color: colors.textSecondary }]}>→</Text>
              </View>
            </TouchableOpacity>

            {/* DEVELOPER MODE BUTTON - Only visible if unlocked */}
            {debugModeUnlocked && (
              <TouchableOpacity
                style={[
                  styles.settingButton,
                  { 
                    backgroundColor: debugModeActive ? colors.primary + '20' : colors.surface,
                    borderColor: debugModeActive ? colors.primary : colors.border,
                  }
                ]}
                onPress={handleDebugToggle}
                activeOpacity={0.8}
              >
                <View style={styles.settingContent}>
                  <View style={styles.settingLeft}>
                    <View style={[
                      styles.emojiContainer, 
                      { 
                        backgroundColor: debugModeActive ? colors.primary + '30' : colors.background 
                      }
                    ]}>
                      <Text style={styles.settingEmoji}>🛠️</Text>
                    </View>
                    <View style={styles.settingText}>
                      <Text style={[
                        styles.settingTitle, 
                        { 
                          color: debugModeActive ? colors.primary : colors.text 
                        }
                      ]}>
                        Developer Mode
                      </Text>
                      <Text style={[
                        styles.settingSubtitle, 
                        { 
                          color: debugModeActive ? colors.primary : colors.textSecondary 
                        }
                      ]}>
                        {debugModeActive ? 'Debug features enabled' : 'Enable advanced debugging'}
                      </Text>
                    </View>
                  </View>
                  {!debugModeActive && (
                    <Text style={[styles.chevron, { color: colors.textSecondary }]}>→</Text>
                  )}
                  {debugModeActive && (
                    <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>
                  )}
                </View>
              </TouchableOpacity>
            )}

          </View>

        </ScrollView>
        
      </AnimatedTabWrapper>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: SHAPES.standardBodyHorizontalMargin,
  },
  header: {
    marginBottom: 30,
    marginTop: SHAPES.standardVerticalMargin,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  settingsContainer: {
    gap: 12,
  },
  settingButton: {
    borderRadius: SHAPES.borderRadius,
    borderWidth: SHAPES.cardBorderWidth,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emojiContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  settingEmoji: {
    fontSize: 20,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    lineHeight: 20,
  },
  settingSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 16,
  },
  chevron: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  checkmark: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 8,
  },
})