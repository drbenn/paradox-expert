import Button from '@/components/custom/Button'
import Card from '@/components/custom/Card'
import ExpandablePreviewListCard from '@/components/custom/ExpandablePreviewListCard'
import AttributesCard from '@/components/custom/library/AttributesCard'
import ExpandableParagraphPreview from '@/components/custom/library/ExpandableParagraphPreview'
import ParadoxHeaderWithImage from '@/components/custom/library/ParadoxHeaderWithImage'
import DailyChallengeQuizButton from '@/components/custom/quiz-center/DailyChallengeQuizButton'
import APP_CONSTANTS from '@/constants/appConstants'
import SHAPES from '@/constants/Shapes'
import useSwipeGesture from '@/hooks/useSwipingGesture'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { useAppState } from '@/state/useAppState'
import { Paradox } from '@/types/app.types'
import { Ionicons } from '@expo/vector-icons'
import { RelativePathString, router, useLocalSearchParams } from 'expo-router'
import React from 'react'
import {
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/shallow'

const ParadoxIdScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>()  
  const insets = useSafeAreaInsets()
  const { colors } = useSystemTheme()

  // zustand shallow state listeners
  const { isFallaciesLoaded, getAllFallacies } = useAppState(
    useShallow((state) => ({ 
      isFallaciesLoaded: state.isFallaciesLoaded, 
      getAllFallacies: state.getAllFallacies 
    }))
  )

  // zustand passive state listeners
  const getParadoxById = useAppState((state) => state.getParadoxById)
  const navigateToPreviousParadox = useAppState((state) => state.navigateToPreviousParadox)
  const navigateToNextParadox = useAppState((state) => state.navigateToNextParadox)

  /**
   * only used for advanced swipe component SwipeableContainer that is commented out. Just using useSwipeGesture
   * for lightness not to bog down app.
   */
  // const [scrollEnabled, setScrollEnabled] = useState(true)    // 🎯 State to control scroll during swipes


  // logger.log('🔍 DEBUG - Fallacies loaded:', fallaciesLoaded) // Debug log
  // logger.log('🔍 DEBUG - Total paradoxes:', paradoxes.length) // Debug log

  // Convert string ID to number and get the specific paradox from state
  const paradox = id ? getParadoxById(id) : undefined

  // Navigation handlers
  const handleBackPress = () => {
    router.back()
  }

  const handleNextParadox = () => {
    if (id) {
      navigateToNextParadox('replace', id)
    }
  }

  const handlePreviousParadox = () => {
    if (id) {
      navigateToPreviousParadox('replace', id)
    }
  }

  const { panHandlers } = useSwipeGesture({
    onSwipeLeft: () => handleNextParadox(),   // ← Swipe LEFT = Next
    onSwipeRight: () => handlePreviousParadox(),      // → Swipe RIGHT = Previous
    swipeThreshold: 0.25,
  })

    // 🔗 RELATED FALLACIES NAVIGATION HANDLER - NOW WORKING!
  const handleRelatedParadoxPress = (fallacyTitle: string) => {
    // Find the paradox by title first
    const allFallacies = getAllFallacies()
    const relatedParadox = allFallacies.find((f: Paradox) => f.title === fallacyTitle)
    
    if (relatedParadox) {
      router.push({
        pathname: "/(tabs)/library/paradox/[id]" as RelativePathString,
        params: { id: relatedParadox.id.toString() }
      })
      // logger.log(`Navigated to related paradox: ${fallacyTitle}`)
    } else {
      // logger.warn(`Related paradox not found: ${fallacyTitle}`)
    }
  }

    // 📤 SHARE FUNCTIONALITY
  const handleShareParadox = async () => {
    if (!paradox) return
    
    try {
      await Share.share({
        message: `Check out this logical paradox: ${paradox.title}\n\n${paradox.subtitle}\n\n${paradox.description} \n\n 
        Paradox Expert available on mobile! ${APP_CONSTANTS.APP_WEBSITE}`,
        title: `${paradox.title} - Paradox Expert`
      })
    } catch (error) {
      logger.error('Error sharing paradox:', error)
    }
  }

  // Show loading state if paradoxes aren't loaded yet
  if (!isFallaciesLoaded) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, {color: colors.text}]}>Loading...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!paradox) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, {color: colors.text}]}>Paradox not found!</Text>
          <Button 
            title="Go Back"
            onPress={() => handleBackPress()}
            variant="primary"
          />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom}]} {...panHandlers}>
      {/* 🏆 HEADER WITH PROGRESS AND ACTIONS */}
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
          <Text style={[styles.backText, {color: colors.primary}]}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShareParadox} style={styles.headerButton}>
          <Ionicons name="share-outline" size={24} color={colors.primary} />
        </TouchableOpacity>

      </View>

      {/* 👈👉 SWIPE GESTURE CONTAINER */}
      {/* <SwipeableContainer
        onSwipeLeft={handlePreviousParadox}   // ← Swipe LEFT = Previous
        onSwipeRight={handleNextParadox}      // → Swipe RIGHT = Next  
        onSwipeStart={() => setScrollEnabled(false)}
        onSwipeEnd={() => setScrollEnabled(true)}
        leftLabel="← Previous"     // Shows when swiping LEFT
        rightLabel="Next →"        // Shows when swiping RIGHT
      > */}
        <ScrollView 
          style={[styles.scrollView]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          // scrollEnabled={scrollEnabled} // Disable scroll during swipe IF USING SwipeableContainer Wrapper Component
          
        >
          <ParadoxHeaderWithImage
            id={paradox.id}
            title={paradox.title}
            subtitle={paradox.subtitle}
            description={paradox.description}
            backgroundColor={colors.background}
            emoji_literal={Number(paradox.id) > 160 ? paradox.emoji_unicode: paradox.emoji_literal}
            // TODO: need to figure out how to import using string literal
            // imagePath={paradox.img_path ? require(`@/assets/images/${paradox.img_path}`) : ''}
          />

          {/* Attributes Card */}
          <View style={{marginTop: SHAPES.standardVerticalMargin}}>
            <AttributesCard
              id={paradox.id}
              difficulty={paradox.difficulty}
              type={paradox.type}
              category={paradox.category}
              usage={paradox.usage}
              subtlety={paradox.subtlety}
              severity={paradox.severity}
            />
          </View>


          {/* Daily Challenge Button */}
          <DailyChallengeQuizButton mode="paradox-detail" />

          {/* Examples Section */}
          <ExpandablePreviewListCard
            title="Examples"
            items={paradox.examples || []}
            style={{marginBottom: 24, backgroundColor: colors.surface}}
          />

          {/* Historical Insight */}
          <View>
            <ExpandableParagraphPreview
              title="Historical Insight"
              textParagraphs={paradox.historical_detail || ['No historical details available for this paradox.']}
            />
          </View>

          {/* 🔗 RELATED FALLACIES SECTION -  STYLE! */}
          {paradox.related_falacies && paradox.related_falacies.length > 0 && (
            <Card>
              <Text style={[styles.relatedFallaciesTitle, { color: colors.text }]}>
                🔗 Related Fallacies
              </Text>
              <Text style={[styles.relatedFallaciesSubtitle, { color: colors.textSecondary }]}>
                Tap to explore similar logical paradoxes
              </Text>
              <View style={styles.relatedFallaciesGrid}>
                {paradox.related_falacies.map((relatedTitle: string, index: number) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.relatedParadoxChip, { backgroundColor: colors.background, borderColor: colors.border }]}
                    onPress={() => handleRelatedParadoxPress(relatedTitle)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.relatedParadoxText, { color: colors.primary }]}>
                      {relatedTitle}
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color={colors.primary} />
                  </TouchableOpacity>
                ))}
              </View>
            </Card>
          )}

          {/* 💡 SWIPE HINT */}
          {/* <View style={[styles.swipeHint, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="swap-horizontal" size={20} color={colors.textSecondary} />
            <Text style={[styles.swipeHintText, { color: colors.textSecondary }]}>
              Swipe right for next, left for previous
            </Text>
          </View> */}

          {/* Navigation Buttons */}
          <View style={styles.navigationButtons}>
            <View style={{width: '48%'}}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 14,
                  borderRadius: SHAPES.borderRadius,
                  backgroundColor: colors.primary + 40,
                  borderWidth: SHAPES.buttonBorderWidth,
                  borderColor: colors.primary,
                }}
                onPress={handlePreviousParadox}
              >

                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 2 }}>
                    ← Previous
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{width: '48%'}}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 14,
                  borderRadius: SHAPES.borderRadius,
                  backgroundColor: colors.primary + 40,
                  borderWidth: SHAPES.buttonBorderWidth,
                  borderColor: colors.primary,
                }}
                onPress={handleNextParadox}
              >
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 2 }}>
                    Next →
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      {/* </SwipeableContainer> */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
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
  headerButton: {
    paddingTop: 24,
    paddingHorizontal: 12,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  swipeContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SHAPES.standardBodyHorizontalMargin,
  },
  scrollContent: {
    paddingBottom: 80, // Extra bottom padding for better UX
  },
  relatedFallaciesContainer: {
    marginVertical: SHAPES.standardVerticalMargin,
    padding: 20,
    borderRadius: SHAPES.borderRadius,
    borderWidth: 1,
  },
  relatedFallaciesTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  relatedFallaciesSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
  },
  relatedFallaciesGrid: {
    gap: 12,
  },
  relatedParadoxChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: SHAPES.borderRadius,
    borderWidth: SHAPES.buttonBorderWidth,
  },
  relatedParadoxText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  // swipeHint: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   paddingHorizontal: 16,
  //   paddingVertical: 12,
  //   marginTop: 16,
  //   marginBottom: 24,
  //   borderRadius: SHAPES.borderRadius,
  //   borderWidth: 1,
  //   gap: 8,
  // },
  // swipeHintText: {
  //   fontSize: 14,
  //   fontWeight: '500',
  // },
  navigationButtons: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 0,
    marginHorizontal: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SHAPES.standardBodyHorizontalMargin,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 24,
  },

})

export default ParadoxIdScreen