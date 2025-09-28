import AnimatedTabWrapper, { TabAnimationPresets } from '@/components/custom/AnimatedTabWrapper'
import ProgressCircle from '@/components/custom/home/ProgressCircle'
import RandomFallacyButton from '@/components/custom/home/RandomFallacyButton'
import TodaysChallengeCard from '@/components/custom/quiz-center/TodaysChallengeCard'
import APP_CONSTANTS from '@/constants/appConstants'
import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import React, { useEffect, useRef } from 'react'
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function HomeScreen() {
  const { colors } = useSystemTheme()
  const insets = useSafeAreaInsets()
  
  // Animation refs for entrance animation
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  
  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start()
  }, [fadeAnim, slideAnim])

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 20}]}>
      <AnimatedTabWrapper {...TabAnimationPresets.veniceBeachFade}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContentContainer, { paddingBottom: insets.bottom + 80 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.appTitleMask, { color: colors.primary }]}>
              {APP_CONSTANTS.APP_NAME}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {APP_CONSTANTS.APP_TAGLINE}
            </Text>
          </View>

          {/* 🏆 PROGRESS CIRCLE - CHAMPIONSHIP CENTERPIECE */}
          <Animated.View 
            style={[
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <ProgressCircle />
          </Animated.View>

          {/* 🏆 TODAY'S CHALLENGE CARD - Displays if data available */}
          <Animated.View 
            style={[
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <TodaysChallengeCard colors={colors}/>
          </Animated.View>

          {/* 🏆 RANDOM FALLACY BUTTON */}
          <RandomFallacyButton />

        </ScrollView>
      </AnimatedTabWrapper>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: SHAPES.standardBodyHorizontalMargin,
    alignItems: 'center',
  },
  appTitleMask: {
    fontSize: 42,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -2,
    backgroundColor: 'transparent',
  },
  subtitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 3,
    fontWeight: '700',
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: SHAPES.standardVerticalMargin,
    paddingTop: 0,
  },
})