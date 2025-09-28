
import Card from '@/components/custom/Card'
import APP_CONSTANTS from '@/constants/appConstants'
import SHAPES from '@/constants/Shapes'

import { useSystemTheme } from '@/hooks/useSystemTheme'
import { useAppState } from '@/state/useAppState'
// import useAppControlState from '@/state/useAppControlState'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'


export default function AboutScreen() {
  const insets = useSafeAreaInsets()
  const { colors } = useSystemTheme()
  const setDebugModeUnlocked = useAppState((state) => state.setDebugModeUnlocked)
  
  // 🎮 EASTER EGG: Version tap counter
  const [tapCount, setTapCount] = React.useState(0)

  const handleVersionTap = () => {
    const newCount = tapCount + 1
    setTapCount(newCount)
    
    if (newCount === 14) {
      setDebugModeUnlocked()
      setTapCount(0) // Reset counter
      // Optional: Show some feedback
      console.log('🎮 DEBUG MODE UNLOCKED!')
    }
  }

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${APP_CONSTANTS.DEVELOPER_EMAIL}`)
  }

  const handleCompanyWebsitePress = () => {
    Linking.openURL(APP_CONSTANTS.DEVELOPER_WEBSITE)
  }

    const handleAppWebsitePress = () => {
    Linking.openURL(APP_CONSTANTS.APP_WEBSITE)
  }

  const handlePrivacyPolicyPress = () => {
    Linking.openURL(APP_CONSTANTS.APP_WEBSITE_APP_PRIVACY_POLICY)
  }

  const handleTermsOfServicePress = () => {
    Linking.openURL(APP_CONSTANTS.APP_WEBSITE_APP_TERMS_OF_SERVICE)
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top}]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
          <Text style={[styles.backText, {color: colors.primary}]}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContentContainer]}
        showsVerticalScrollIndicator={false}
      >
        <Card>
          <Text style={[styles.title, {color: colors.text}]}>About</Text>
          <Text style={[styles.description, {color: colors.text}]}>
            { APP_CONSTANTS.APP_NAME } is a comprehensive educational quiz app that transforms learning logical fallacies into an engaging, game-like experience to sharpen your critical thinking skills.
            {'\n'}{'\n'}
            Master 200 logical fallacies through a structured learning journey featuring interactive quizzes, daily challenges, weekly gauntlets, and achievement systems. Progress through 10 tiers of increasing difficulty, earn trophies and badges, and become an expert at identifying logical errors in everyday arguments and debates.
          </Text>
          <Text 
            style={[styles.versionNumber, {color: colors.primary}]}
            onPress={handleVersionTap} // 🎮 ADD THIS
          >
            Version { APP_CONSTANTS.VERSION_NO }
          </Text>
        </Card>

        {/* Developer Info */}
        <Card>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>Created by { APP_CONSTANTS.DEVELOPER_CO }</Text>
          
          <View style={styles.linksContainer}>
            <TouchableOpacity onPress={handleCompanyWebsitePress} style={styles.linkItem}>
              <Text style={[styles.linkIcon, {color: colors.text}]}>Website:</Text>
              <Text style={[styles.linkText, {color: colors.primary}]}>{APP_CONSTANTS.DEVELOPER_WEBSITE}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAppWebsitePress} style={styles.linkItem}>
              <Text style={[styles.linkIcon, {color: colors.text}]}>App Website:</Text>
              <Text style={[styles.linkText, {color: colors.primary}]}>{ APP_CONSTANTS.APP_WEBSITE }</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEmailPress} style={styles.linkItem}>
              <Text style={[styles.linkIcon, {color: colors.text}]}>Email:</Text>
              <Text style={[styles.linkText, {color: colors.primary}]}>{ APP_CONSTANTS.DEVELOPER_EMAIL }</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePrivacyPolicyPress} style={styles.linkItem}>
              <Text style={[styles.linkIcon, {color: colors.text}]}>Privacy Policy:</Text>
              <Text style={[styles.linkText, {color: colors.primary}]}>{ APP_CONSTANTS.APP_WEBSITE_APP_PRIVACY_POLICY }</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleTermsOfServicePress} style={styles.linkItem}>
              <Text style={[styles.linkIcon, {color: colors.text}]}>Terms of Service:</Text>
              <Text style={[styles.linkText, {color: colors.primary}]}>{ APP_CONSTANTS.APP_WEBSITE_APP_TERMS_OF_SERVICE }</Text>
            </TouchableOpacity>
          </View>
        </Card>
        
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SHAPES.standardHeaderHorizontalMargin,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
  },
  backText: {
    fontSize: 18,
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: SHAPES.standardBodyHorizontalMargin,
    paddingTop: 10,
    paddingBottom: 80, // Extra bottom padding for better UX
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  linkItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  linksContainer: {
    marginTop: 0,
  },
  linkIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  linkText: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  versionNumber: {
    fontSize: 12,
    lineHeight: 12,
    marginTop: 18,
    marginRight: 6,
    textAlign: 'right',
  },
  settingsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsInfo: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingsSubtitle: {
    fontSize: 14,
  }
})