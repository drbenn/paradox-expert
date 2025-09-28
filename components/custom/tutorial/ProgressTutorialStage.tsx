import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import React from 'react'
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

interface ProgressTutorialStageProps {
  onContinue: () => void
  isLastStage: boolean
  isTransitioning: boolean
}

export default function ProgressTutorialStage({
  onContinue,
  isLastStage,
  isTransitioning
}: ProgressTutorialStageProps) {
  
  const { colors } = useSystemTheme()
  
  const getButtonText = () => {
    return isLastStage ? 'Start Learning!' : 'Next'
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Track Your Progress
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Achievements & Recognition
        </Text>
      </View>

      {/* Image Placeholder */}
      <View style={styles.imageContainer}>
        <View style={[styles.imagePlaceholder, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Image
            style={styles.placeholderImage}
            source={require('@/assets/images/tutorial/progress-tutorial.png')}
          />
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={[styles.description, { color: colors.text }]}>
          Track your learning progress and view the trophies and achievements you&apos;ve earned along the way.
        </Text>
        
        <View style={styles.featureList}>
          <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Earn trophies for quiz mastery and unit test completion</Text>
          <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Collect bronze, silver, and gold medals for excellence</Text>
          <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Unlock special badges for streaks and milestones</Text>
          <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• View detailed statistics of your learning journey</Text>
          <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• See your points, streaks, and overall progress</Text>
        </View>
      </View>

      {/* Ready to Start */}
      <View style={[styles.readyContainer, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
        <Text style={[styles.readyTitle, { color: colors.primary }]}>
          Ready to Begin Your Journey?
        </Text>
        <Text style={[styles.readyText, { color: colors.text }]}>
          Start with Tier 1 fallacies and work your way up to becoming a logical reasoning expert!
        </Text>
      </View>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.continueButton, { 
            backgroundColor: colors.primary, 
            borderColor: colors.border,
            opacity: isTransitioning ? 0.5 : 1 
          }]}
          onPress={onContinue}
          disabled={isTransitioning}
        >
          <Text style={[styles.continueButtonText, { color: colors.text }]}>
            {getButtonText()}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    minHeight: screenHeight - 100, // Account for progress dots
    justifyContent: 'flex-start',
    paddingBottom: 80
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: screenWidth * 0.9,
    height: screenWidth * 0.65,
    borderRadius: SHAPES.borderRadius,
    // borderWidth: 2,
    // borderStyle: 'dashed',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    borderRadius: SHAPES.borderRadius,
  },
  contentContainer: {
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  featureList: {
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  bulletPoint: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 22,
    marginBottom: 8,
  },
  readyContainer: {
    borderRadius: SHAPES.borderRadius,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
  },
  readyTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  readyText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    paddingTop: 10,
  },
  continueButton: {
    borderRadius: SHAPES.borderRadius,
    padding: 18,
    borderWidth: SHAPES.buttonBorderWidth,
  },
  continueButtonText: {
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1,
  },
})