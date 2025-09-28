import ParadoxFilters from '@/components/custom/library/ParadoxFilters'
import ParadoxResults from '@/components/custom/library/ParadoxResults'
import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import customQuizService from '@/services/quiz/CustomQuizService'
import { useAppState } from '@/state/useAppState'
import { Paradox } from '@/types/app.types'
import { CustomQuizFilters } from '@/types/custom-quiz.types'
import { QuizSetup } from '@/types/quiz.types'
import { createCustomQuizSetup } from '@/utils/quizConfigGeneratorUtils'

import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
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

export default function CustomQuizBuilderScreen() {
  const { colors } = useSystemTheme()
  const insets = useSafeAreaInsets()

  // STATE-FIRST DATA SOURCING
  const isParadoxesLoaded = useAppState((state) => state.isParadoxesLoaded)
  const paradoxes = useAppState((state) => state.paradoxes)
  const startQuiz = useAppState((state) => state.startQuiz)

  // DIRECT ARRAY FILTERING
  const favoriteParadoxes: Paradox[] = paradoxes.filter((p: Paradox) => p.isFavorite)
  const learnedParadoxes: Paradox[] = paradoxes.filter((p: Paradox) => p.isLearned)

  // FILTER STATE MANAGEMENT - Updated for Paradoxes
  const [filters, setFilters] = useState<CustomQuizFilters>({
    selectedTiers: new Set<number>(),
    selectedDifficulty: 'all',
    selectedMindBlowFactor: null,
    selectedResolutionDifficulty: null,
    selectedDomains: new Set(),
    selectedPresentations: new Set(),
    selectedPrerequisites: new Set()
  })

  // PROGRESS FILTER STATE
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [showLearnedOnly, setShowLearnedOnly] = useState(false)
  const [showUnlearnedOnly, setShowUnlearnedOnly] = useState(false)

  // QUIZ CONFIGURATION STATE
  const [questionCount, setQuestionCount] = useState(10)
  const [selectedParadoxes, setSelectedParadoxes] = useState<Paradox[]>([])
  
  // UI STATE
  const [displayedParadoxes, setDisplayedParadoxes] = useState<Paradox[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // ALL PARADOXES AVAILABLE
  const availableParadoxes = useMemo(() => {
    if (!isParadoxesLoaded || paradoxes.length === 0) return []
    return paradoxes
  }, [paradoxes, isParadoxesLoaded])

  // PROGRESS FILTER APPLICATION WITH OR LOGIC
  const progressFilteredParadoxes = useMemo(() => {
    if (!isParadoxesLoaded) return []

    let filtered = [...availableParadoxes]

    // Apply favorites filter first
    if (showFavoritesOnly) {
      filtered = filtered.filter((paradox: Paradox) => paradox.isFavorite || false)
    }

    // OR LOGIC for learned/unlearned
    if (showLearnedOnly && showUnlearnedOnly) {
      // Both selected = show all (no additional filtering)
    } else if (showLearnedOnly) {
      // Only learned selected
      filtered = filtered.filter((paradox: Paradox) => paradox.isLearned || false)
    } else if (showUnlearnedOnly) {
      // Only unlearned selected
      filtered = filtered.filter((paradox: Paradox) => !(paradox.isLearned || false))
    }

    return filtered
  }, [availableParadoxes, showFavoritesOnly, showLearnedOnly, showUnlearnedOnly, isParadoxesLoaded])

  // FILTER APPLICATION - Uses CustomQuizService
  const filteredParadoxes = useMemo(() => {
    if (progressFilteredParadoxes.length === 0) return []
    
    return customQuizService.applyFiltersToParadoxes(progressFilteredParadoxes, filters)
  }, [progressFilteredParadoxes, filters])

  // PROGRESS COUNTS
  const progressCounts = useMemo(() => {
    if (!isParadoxesLoaded) {
      return { favoritesCount: 0, learnedCount: 0, unlearnedCount: 0 }
    }

    const favoritesCount = favoriteParadoxes.length
    const learnedCount = learnedParadoxes.length
    const unlearnedCount = availableParadoxes.length - learnedCount

    return { favoritesCount, learnedCount, unlearnedCount }
  }, [favoriteParadoxes, learnedParadoxes, availableParadoxes, isParadoxesLoaded])

  // Calculate how many selected paradoxes are still visible after filtering
  const visibleSelectedCount = useMemo(() => {
    return selectedParadoxes.filter((selectedParadox: Paradox) => 
      filteredParadoxes.some((filteredParadox: Paradox) => filteredParadox.id === selectedParadox.id)
    ).length
  }, [selectedParadoxes, filteredParadoxes])

  // PAGINATION LOGIC
  const PARADOXES_PER_LOAD = 20
  
  useEffect(() => {
    // Reset displayed paradoxes when filters change
    setDisplayedParadoxes(filteredParadoxes.slice(0, PARADOXES_PER_LOAD))
  }, [filteredParadoxes])

  const handleLoadMore = () => {
    setIsLoading(true)
    setTimeout(() => {
      const currentLength = displayedParadoxes.length
      const nextBatch = filteredParadoxes.slice(currentLength, currentLength + PARADOXES_PER_LOAD)
      setDisplayedParadoxes((prev: Paradox[]) => [...prev, ...nextBatch])
      setIsLoading(false)
    }, 300)
  }

  // PARADOX SELECTION LOGIC
  const handleParadoxPress = (paradox: Paradox) => {
    setSelectedParadoxes((prev: Paradox[]) => {
      const isSelected = prev.some((p: Paradox) => p.id === paradox.id)
      if (isSelected) {
        // Remove from selection
        return prev.filter((p: Paradox) => p.id !== paradox.id)
      } else {
        // Add to selection
        return [...prev, paradox]
      }
    })
  }

  const isSelected = (paradox: Paradox) => {
    return selectedParadoxes.some((p: Paradox) => p.id === paradox.id)
  }

  // FILTER HANDLERS - Updated for Paradox attributes
  const handleDifficultyChange = (difficulty: typeof filters.selectedDifficulty) => {
    setFilters((prev: CustomQuizFilters) => ({ ...prev, selectedDifficulty: difficulty }))
  }

  const handleMindBlowFactorChange = (mindBlowFactor: typeof filters.selectedMindBlowFactor) => {
    setFilters((prev: CustomQuizFilters) => ({ ...prev, selectedMindBlowFactor: mindBlowFactor }))
  }

  const handleResolutionDifficultyChange = (resolutionDifficulty: typeof filters.selectedResolutionDifficulty) => {
    setFilters((prev: CustomQuizFilters) => ({ ...prev, selectedResolutionDifficulty: resolutionDifficulty }))
  }

  const handleDomainToggle = (domain: string) => {
    setFilters((prev: CustomQuizFilters) => {
      const newDomains = new Set(prev.selectedDomains)
      if (newDomains.has(domain as any)) {
        newDomains.delete(domain as any)
      } else {
        newDomains.add(domain as any)
      }
      return { ...prev, selectedDomains: newDomains }
    })
  }

  const handlePresentationToggle = (presentation: string) => {
    setFilters((prev: CustomQuizFilters) => {
      const newPresentations = new Set(prev.selectedPresentations)
      if (newPresentations.has(presentation as any)) {
        newPresentations.delete(presentation as any)
      } else {
        newPresentations.add(presentation as any)
      }
      return { ...prev, selectedPresentations: newPresentations }
    })
  }

  const handlePrerequisitesToggle = (prerequisites: string) => {
    setFilters((prev: CustomQuizFilters) => {
      const newPrerequisites = new Set(prev.selectedPrerequisites)
      if (newPrerequisites.has(prerequisites as any)) {
        newPrerequisites.delete(prerequisites as any)
      } else {
        newPrerequisites.add(prerequisites as any)
      }
      return { ...prev, selectedPrerequisites: newPrerequisites }
    })
  }

  // PROGRESS FILTER HANDLERS
  const handleToggleFavoritesOnly = () => {
    setShowFavoritesOnly(!showFavoritesOnly)
  }

  const handleToggleLearnedOnly = () => {
    setShowLearnedOnly(!showLearnedOnly)
  }

  const handleToggleUnlearnedOnly = () => {
    setShowUnlearnedOnly(!showUnlearnedOnly)
  }

  // QUIZ CONTROL HANDLERS
  const handleQuestionCountChange = (delta: number) => {
    setQuestionCount((prev: number) => {
      const newCount = prev + delta
      return Math.max(5, Math.min(30, newCount)) // Clamp between 5-30
    })
  }

  const handleSelectAll = () => {
    setSelectedParadoxes([...filteredParadoxes])
  }

  const handleClearAll = () => {
    setSelectedParadoxes([])
  }

  const handleStartQuiz = () => {
    if (selectedParadoxes.length === 0) {
      Alert.alert('No Paradoxes Selected', 'Please select at least one paradox to create a quiz.')
      return
    }

    // Validation: Need at least 3 paradoxes for good variety
    if (selectedParadoxes.length < 3) {
      Alert.alert(
        'More Paradoxes Needed', 
        'Please select at least 3 paradoxes for better quiz variety.',
        [{ text: 'OK' }]
      )
      return
    }

    // Simple random slice to max 30 paradoxes
    const paradoxesNeeded = Math.min(questionCount, selectedParadoxes.length, 30)
    const selectedParadoxesForQuiz = selectedParadoxes.length > paradoxesNeeded
      ? selectedParadoxes.sort(() => Math.random() - 0.5).slice(0, paradoxesNeeded)
      : selectedParadoxes

    // Start the custom quiz
    Alert.alert(
      'Start Custom Quiz', 
      `Ready to start a ${questionCount}-question quiz created from ${selectedParadoxes.length} selected paradoxes?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start Quiz', 
          onPress: () => {
            const selectedParadoxIds: string[] = selectedParadoxes.map((p: Paradox) => p.id) 
            const quizSetup: QuizSetup = createCustomQuizSetup(selectedParadoxIds, questionCount)
            startQuiz(quizSetup)
          }
        }
      ]
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* BACK BUTTON */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Custom Quiz Builder</Text>
        </View>

        {/* Quiz Configuration Card */}
        <View style={[styles.configCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quiz Settings</Text>
          
          {/* Question Count Selector */}
          <View style={styles.questionCountContainer}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Questions:</Text>
            <View style={styles.questionCountControls}>
              <TouchableOpacity
                style={[styles.countButton, { backgroundColor: colors.primary }]}
                onPress={() => handleQuestionCountChange(-1)}
                disabled={questionCount <= 5}
              >
                <Text style={styles.countButtonText}>−</Text>
              </TouchableOpacity>
              
              <Text style={[styles.questionCountText, { color: colors.text }]}>
                {questionCount}
              </Text>
              
              <TouchableOpacity
                style={[styles.countButton, { backgroundColor: colors.primary }]}
                onPress={() => handleQuestionCountChange(1)}
                disabled={questionCount >= 30}
              >
                <Text style={styles.countButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Selection Summary */}
          <View style={styles.selectionSummary}>
            <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
              {visibleSelectedCount} of {selectedParadoxes.length} selected paradox{selectedParadoxes.length === 1 ? '' : 'es'} visible • {filteredParadoxes.length} available
            </Text>
            
            <View style={styles.selectionControls}>
              <TouchableOpacity
                style={[styles.selectionButton, { borderColor: colors.primary }]}
                onPress={handleSelectAll}
                disabled={filteredParadoxes.length === 0}
              >
                <Text style={[styles.selectionButtonText, { color: colors.primary }]}>
                  Select All
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.selectionButton, { borderColor: colors.border }]}
                onPress={handleClearAll}
                disabled={selectedParadoxes.length === 0}
              >
                <Text style={[styles.selectionButtonText, { color: colors.text }]}>
                  Clear All
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Start Quiz Button */}
        {selectedParadoxes.length > 0 && (
          <View style={[{ backgroundColor: colors.background }]}>
            <TouchableOpacity
              style={[styles.startQuizButton, { backgroundColor: colors.primary }]}
              onPress={handleStartQuiz}
            >
              <Text style={styles.startQuizButtonText}>
                Start {questionCount}-Question Quiz
              </Text>
              <Text style={styles.startQuizSubtext}>
                {visibleSelectedCount} of {selectedParadoxes.length} selected paradox{selectedParadoxes.length === 1 ? '' : 'es'} visible
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* PARADOX FILTERS WITH PROGRESS SUPPORT */}
        <View style={[{marginTop: SHAPES.standardVerticalMargin}]}>
          <ParadoxFilters
            selectedDifficulty={filters.selectedDifficulty}
            selectedMindBlowFactor={filters.selectedMindBlowFactor}
            selectedResolutionDifficulty={filters.selectedResolutionDifficulty}
            selectedDomains={filters.selectedDomains}
            selectedPresentations={filters.selectedPresentations}
            selectedPrerequisites={filters.selectedPrerequisites}
            showFavoritesOnly={showFavoritesOnly}
            showLearnedOnly={showLearnedOnly}
            showUnlearnedOnly={showUnlearnedOnly}
            favoritesCount={progressCounts.favoritesCount}
            learnedCount={progressCounts.learnedCount}
            unlearnedCount={progressCounts.unlearnedCount}
            onDifficultyChange={handleDifficultyChange}
            onMindBlowFactorChange={handleMindBlowFactorChange}
            onResolutionDifficultyChange={handleResolutionDifficultyChange}
            onDomainToggle={handleDomainToggle}
            onPresentationToggle={handlePresentationToggle}
            onPrerequisitesToggle={handlePrerequisitesToggle}
            onToggleFavoritesOnly={handleToggleFavoritesOnly}
            onToggleLearnedOnly={handleToggleLearnedOnly}
            onToggleUnlearnedOnly={handleToggleUnlearnedOnly}
          />
        </View>

        {/* Paradox Results - with selection logic */}
        <View style={{paddingBottom: insets.bottom + 120}}>
          <ParadoxResults
            filteredParadoxes={filteredParadoxes}
            displayedParadoxes={displayedParadoxes}
            isLoading={isLoading}
            paradoxesLoaded={isParadoxesLoaded}
            onParadoxPress={handleParadoxPress}
            onLoadMore={handleLoadMore}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: SHAPES.standardBodyHorizontalMargin,
  },
  configCard: {
    padding: 16,
    borderRadius: SHAPES.borderRadius,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  questionCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  questionCountControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  countButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  questionCountText: {
    fontSize: 18,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
  selectionSummary: {
    gap: 12,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectionControls: {
    flexDirection: 'row',
    gap: 12,
  },
  selectionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: SHAPES.borderRadius,
    borderWidth: 1,
    alignItems: 'center',
  },
  selectionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  startQuizButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: SHAPES.borderRadius,
    alignItems: 'center',
    marginTop: SHAPES.standardVerticalMargin
  },
  startQuizButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  startQuizSubtext: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.9,
    marginTop: 2,
  },
})