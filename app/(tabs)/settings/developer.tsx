import AnimatedTabWrapper, { TabAnimationPresets } from '@/components/custom/AnimatedTabWrapper'
import APP_CONSTANTS from '@/constants/appConstants'
import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { useAppState } from '@/state/useAppState'
import { router } from 'expo-router'
import { useState } from 'react'
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function DeveloperSettingsScreen() {
  const insets = useSafeAreaInsets()
  const { colors } = useSystemTheme()
  const [isExecuting, setIsExecuting] = useState(false)
  // const adState = useAdState()
  // const { debugModeActive, quizCheatsEnabled, toggleQuizCheats } = useAppControlState()
  // const pointsRepo = new PointsRepository()
  const debugModeUnlocked = useAppState((state) => state.debugModeUnlocked)
  const debugModeActive = useAppState((state) => state.debugModeActive)
  const toggleDebugMode = useAppState((state) => state.toggleDebugMode)
  const setAdsPurchased = useAppState((state) => state.setAdsPurchased)
  const isQuizCheatsEnabled = useAppState((state) => state.isQuizCheatsEnabled)
  const toggleIsQuizCheatsEnabled = useAppState((state) => state.toggleIsQuizCheatsEnabled)
  const resetAppData = useAppState((state) => state.resetAppData)
  const hasAdsPurchased = useAppState((state) => state.hasAdsPurchased)

  // Only show if debug mode is active
  if (!debugModeActive && !APP_CONSTANTS.DEBUG_TOOLS_ACTIVE) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.unauthorizedContainer}>
          <Text style={[styles.unauthorizedText, { color: colors.text }]}>
            🔒 Developer mode not active
          </Text>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.backButtonText, { color: '#ffffff' }]}>← Back to Settings</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  // 💰 AD TESTING HANDLERS
  const handleEnableAds = () => {
    Alert.alert(
      '💰 Enable Ads?',
      'This will enable ads throughout the app to test the revenue flow.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: '💰 Enable Ads', 
          style: 'default',
          onPress: () => {
            setAdsPurchased(false)
            Alert.alert('✅ Ads Enabled!', 'Ads will now show throughout the app.', [{ text: '✅ Got it!' }])
          }
        }
      ]
    )
  }

  const handleRemoveAds = () => {
    Alert.alert(
      '🚫 Remove Ads?',
      'This will disable all ads to test the ad-free experience.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: '🚫 Remove Ads', 
          style: 'default',
          onPress: () => {
            setAdsPurchased(true)
            Alert.alert('✅ Ads Removed!', 'Ad-free experience is now active.', [{ text: '✅ Got it!' }])
          }
        }
      ]
    )
  }

  // 🎮 QUIZ CHEATS HANDLER
  const handleToggleQuizCheats = () => {
    Alert.alert(
      '🎮 Quiz Cheats',
      `${isQuizCheatsEnabled ? 'Disable' : 'Enable'} in-quiz debugging helpers?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: isQuizCheatsEnabled ? 'Disable' : 'Enable', 
          style: 'default',
          onPress: () => {
            toggleIsQuizCheatsEnabled()
            Alert.alert(
              '✅ Quiz Cheats Updated!', 
              `Quiz debugging helpers are now ${!isQuizCheatsEnabled ? 'ENABLED' : 'DISABLED'}!`,
              [{ text: '✅ Got it!' }]
            )
          }
        }
      ]
    )
  }

  // 🏆 PROGRESSION CHEAT HANDLERS
  // const handleTier5Domination = async () => {
  //   Alert.alert(
  //     '🏆 Complete Tiers 1-5?',
  //     'This will complete all regular quizzes and unit tests through Tier 5 with realistic progression.',
  //     [
  //       { text: 'Cancel', style: 'cancel' },
  //       { 
  //         text: '🏆 Complete Tiers 1-5', 
  //         style: 'default',
  //         onPress: async () => {
  //           setIsExecuting(true)
  //           try {
  //             await simulateTierProgression(5)
  //             Alert.alert('🏆 Tier 5 Complete!', 'All tiers through 5 completed! Check your progress!', [{ text: '🎉 Amazing!' }])
  //           } catch (error: any) {
  //             Alert.alert('❌ Progression Failed', error.message)
  //           } finally {
  //             setIsExecuting(false)
  //           }
  //         }
  //       }
  //     ]
  //   )
  // }

  // const handleTier9Conquest = async () => {
  //   Alert.alert(
  //     '⚔️ Complete Tiers 1-9?',
  //     'This will complete all regular quizzes and unit tests through Tier 9 with realistic progression.',
  //     [
  //       { text: 'Cancel', style: 'cancel' },
  //       { 
  //         text: '⚔️ Complete Tiers 1-9', 
  //         style: 'default',
  //         onPress: async () => {
  //           setIsExecuting(true)
  //           try {
  //             await simulateTierProgression(9)
  //             Alert.alert('⚔️ Tier 9 Complete!', 'All tiers through 9 completed! Check your progress!', [{ text: '🔥 Incredible!' }])
  //           } catch (error: any) {
  //             Alert.alert('❌ Progression Failed', error.message)
  //           } finally {
  //             setIsExecuting(false)
  //           }
  //         }
  //       }
  //     ]
  //   )
  // }

  // 🗑️ DATABASE MANAGEMENT HANDLERS
  const handleResetAppData = () => {
    Alert.alert(
      '🚨 Reset App Data?',
      'This will delete ALL quiz data and user progress. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: '🚨 Reset Everything', 
          style: 'destructive',
          onPress: async () => {
            setIsExecuting(true)
            try {
              resetAppData()
              Alert.alert('💥 App Data Reset!', 'App Data has been reset.', [{ text: '✅ Done' }])
            } catch (error) {
              Alert.alert('❌ Reset Failed', 'Check console for details.')
            } finally {
              setIsExecuting(false)
            }
          }
        }
      ]
    )
  }


  // 🏆 TIER PROGRESSION SIMULATION (simplified from DevDatabaseConsole)
  // const simulateTierProgression = async (targetTier: number) => {
  //   let completionDate = new Date()
  //   completionDate.setDate(completionDate.getDate() - 90) // Start 90 days ago
    
  //   for (let tier = 1; tier <= targetTier; tier++) {
  //     // Complete 4 regular quizzes for this tier
  //     for (let quizNum = 1; quizNum <= 4; quizNum++) {
  //       await completeRegularQuizCheat(tier, quizNum, completionDate)
  //       const hoursDelay = Math.floor(Math.random() * 3) + 2 // 2-4 hours
  //       completionDate.setHours(completionDate.getHours() + hoursDelay)
  //     }
      
  //     // Complete unit test for this tier (next day)
  //     completionDate.setDate(completionDate.getDate() + 1)
  //     completionDate.setHours(Math.floor(Math.random() * 4) + 10) // 10am-2pm
      
  //     await completeUnitTestCheat(tier, completionDate)
      
  //     // 1-3 days before next tier
  //     const daysDelay = Math.floor(Math.random() * 3) + 1
  //     completionDate.setDate(completionDate.getDate() + daysDelay)
  //   }
    
  //   await refreshAllGameState()
  //   await markParadoxesAsLearned(targetTier)
  // }

  // const completeRegularQuizCheat = async (tier: number, quizNumber: number, completionDate: Date) => {
  //   const scoreOptions = [72, 75, 78, 80, 82, 85, 87, 90, 92, 95, 97, 100]
  //   const score = scoreOptions[Math.floor(Math.random() * scoreOptions.length)]
  //   const timeTaken = Math.floor(Math.random() * 600) + 300 // 5-15 minutes
    
  //   await databaseService.completeQuiz({
  //     testType: 'regular',
  //     tier,
  //     testNumber: quizNumber,
  //     score,
  //     totalQuestions: 10,
  //     passed: score >= 70,
  //     timeTakenSeconds: timeTaken,
  //     pointsEarned: 0,
  //     startedAt: DateService.getLocalISOString(completionDate.getTime() - (timeTaken * 1000))
  //   })
  // }

  // const completeUnitTestCheat = async (tier: number, completionDate: Date) => {
  //   const scoreOptions = [74, 76, 78, 80, 85, 87, 90, 92, 95, 100]
  //   const score = scoreOptions[Math.floor(Math.random() * scoreOptions.length)]
  //   const timeTaken = Math.floor(Math.random() * 900) + 900 // 15-30 minutes
    
  //   await databaseService.completeQuiz({
  //     testType: 'unit_test',
  //     tier,
  //     testNumber: null,
  //     score,
  //     totalQuestions: 20,
  //     passed: score >= 70,
  //     timeTakenSeconds: timeTaken,
  //     pointsEarned: 0,
  //     startedAt: DateService.getLocalISOString(completionDate.getTime() - (timeTaken * 1000))
  //   })
  // }

  // const refreshAllGameState = async () => {
  //   await Promise.all([
  //     useQuizState.getState().loadQuizProgress(),
  //     useAchievementState.getState().loadAllAchievements(),
  //     usePointsState.getState().loadPointsData(),
  //     useUserProgressState.getState().getLearnedStats()
  //   ])
  // }

  // const markParadoxesAsLearned = async (targetTier: number) => {
  //   try {
  //     const allParadoxes = useParadoxState.getState().paradoxes
  //     const userProgressState = useUserProgressState.getState()
      
  //     for (let tier = 1; tier <= targetTier; tier++) {
  //       const tierParadoxes = allParadoxes.filter(f => f.tier?.toString() === tier.toString())
        
  //       for (const paradox of tierParadoxes) {
  //         if (!userProgressState.isLearned(paradox.id)) {
  //           await userProgressState.toggleLearned(paradox.id)
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     // Don't throw - this shouldn't break the progression
  //   }
  // }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <AnimatedTabWrapper {...TabAnimationPresets.veniceBeachFade}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContentContainer, { paddingTop: insets.top, paddingBottom: insets.bottom + 80 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={[styles.backButton, { backgroundColor: colors.surface }]}
              onPress={() => router.back()}
            >
              <Text style={[styles.backButtonText, { color: colors.text }]}>← Back</Text>
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text }]}>🛠️ Developer</Text>
            <View style={{ width: 60 }} />
          </View>

          {/* Quiz Cheats Section */}
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>🎮 Quiz Debugging</Text>
            
            <View style={[styles.quizCheatStatusContainer, { backgroundColor: isQuizCheatsEnabled ? '#10b981' : '#6b7280' }]}>
              <Text style={styles.quizCheatStatusText}>
                {isQuizCheatsEnabled ? '🎮 QUIZ CHEATS ENABLED' : '🔒 QUIZ CHEATS DISABLED'}
              </Text>
            </View>

            <TouchableOpacity 
              style={[styles.fullButton, { backgroundColor: isQuizCheatsEnabled ? '#ef4444' : '#10b981' }]}
              onPress={handleToggleQuizCheats}
              disabled={isExecuting}
            >
              <Text style={styles.buttonText}>
                🎮 {isQuizCheatsEnabled ? 'Disable Quiz Cheats' : 'Enable Quiz Cheats'}
              </Text>
              <Text style={styles.buttonSubtext}>
                {isQuizCheatsEnabled ? 'Hide in-quiz debugging helpers' : 'Show pass/fail buttons in quizzes'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Ad Testing Section */}
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>💰 Ad Testing</Text>
            
            <View style={[styles.adStatusContainer, { backgroundColor: hasAdsPurchased() ? '#ef4444' : '#10b981' }]}>
              <Text style={styles.adStatusText}>
                {hasAdsPurchased() ? '🚫 ADS DISABLED (Purchased)' : '💰 ADS ENABLED (Revenue Mode)'}
              </Text>
            </View>

            <TouchableOpacity 
              style={[styles.fullButton, { backgroundColor: '#10b981' }]}
              onPress={handleEnableAds}
              disabled={isExecuting || !hasAdsPurchased()}
            >
              <Text style={styles.buttonText}>💰 Enable Ads</Text>
              <Text style={styles.buttonSubtext}>Test revenue flow and ad experience</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.fullButton, { backgroundColor: '#ef4444' }]}
              onPress={handleRemoveAds}
              disabled={isExecuting || hasAdsPurchased()}
            >
              <Text style={styles.buttonText}>🚫 Remove Ads</Text>
              <Text style={styles.buttonSubtext}>Test ad-free premium experience</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Progression Section */}
          {/* <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>🏆 Quick Progression</Text>
            
            <TouchableOpacity 
              style={[styles.fullButton, { backgroundColor: '#10b981' }]}
              onPress={handleTier5Domination}
              disabled={isExecuting}
            >
              <Text style={styles.buttonText}>🏆 Complete Tiers 1-5</Text>
              <Text style={styles.buttonSubtext}>Unlock mid-game content</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.fullButton, { backgroundColor: '#f59e0b' }]}
              onPress={handleTier9Conquest}
              disabled={isExecuting}
            >
              <Text style={styles.buttonText}>⚔️ Complete Tiers 1-9</Text>
              <Text style={styles.buttonSubtext}>Unlock endgame content</Text>
            </TouchableOpacity>
          </View> */}

          {/* Database Management Section */}
          <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>🗑️ Data Management</Text>
            
            <TouchableOpacity 
              style={[styles.fullButton, { backgroundColor: '#ef4444' }]}
              onPress={handleResetAppData}
              disabled={isExecuting}
            >
              <Text style={styles.buttonText}>🚨 Reset App Data</Text>
              <Text style={styles.buttonSubtext}>⚠️ Delete everything - cannot be undone</Text>
            </TouchableOpacity>
          </View>

          {/* Info Section */}
          <View style={[styles.infoSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>ℹ️ Developer Notes</Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              • Quiz cheats enable pass/fail buttons in active quizzes{'\n'}
              • Time travel affects daily/weekly content{'\n'}
              • Progression cheats use realistic timing{'\n'}
              • Database operations cannot be undone{'\n'}
              • Changes persist across app restarts{'\n'}
              • Use responsibly during development
            </Text>
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
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SHAPES.standardBodyHorizontalMargin,
  },
  unauthorizedText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: SHAPES.standardBodyHorizontalMargin,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: SHAPES.standardVerticalMargin,
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  section: {
    borderWidth: 1,
    borderRadius: SHAPES.borderRadius,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  quizCheatStatusContainer: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  quizCheatStatusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  adStatusContainer: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  adStatusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  fullButton: {
    padding: 16,
    borderRadius: SHAPES.borderRadius,
    marginBottom: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  buttonSubtext: {
    color: '#ffffff',
    fontSize: 12,
    opacity: 0.8,
  },
  infoSection: {
    borderWidth: 1,
    borderRadius: SHAPES.borderRadius,
    padding: 16,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
  },
})