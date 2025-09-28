import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
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

interface LibraryTutorialStageProps {
  onContinue: () => void
  isLastStage: boolean
  isTransitioning: boolean
}

export default function LibraryTutorialStage({
  onContinue,
  isLastStage,
  isTransitioning
}: LibraryTutorialStageProps) {
  
  const { colors } = useSystemTheme()
  
  const getButtonText = () => {
    return isLastStage ? 'Get Started' : 'Next'
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
          Explore the Library
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Discover Logical Fallacies
        </Text>
      </View>

      {/* Image Placeholder */}
      <View style={styles.imageContainer}>
        <View style={[styles.imagePlaceholder, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Image
            style={styles.placeholderImage}
            source={require('@/assets/images/tutorial/library-tutorial.png')}
          />
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={[styles.description, { color: colors.text }]}>
          Check out the library for all paradoxes and use filters to find your favorites or learn about their usage.
        </Text>
        
        <View style={styles.featureList}>
          <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Browse 200+ logical paradoxes organized by difficulty</Text>
          <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Filter by category and complexity</Text>
          <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>• Save favorites for quick access</Text>
        </View>
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
  buttonContainer: {
    paddingTop: 10,
  },
  continueButton: {
    borderRadius: SHAPES.borderRadius,
    padding: 16,
    borderWidth: SHAPES.buttonBorderWidth,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1,
  },
})