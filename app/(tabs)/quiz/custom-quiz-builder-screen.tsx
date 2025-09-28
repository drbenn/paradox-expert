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

  // 🏆 STATE-FIRST DATA SOURCING - Clean and Simple!
  const isFallaciesLoaded = useAppState((state) => state.isFallaciesLoaded)
  const fallacies = useAppState((state) => state.fallacies)
  const startQuiz = useAppState((state) => state.startQuiz)

  // 🎯 DIRECT ARRAY FILTERING - No more Sets!
  const favoriteFallacies: Paradox[] = fallacies.filter((f: Paradox) => f.isFavorite)
  const learnedFallacies: Paradox[] = fallacies.filter((f: Paradox) => f.isLearned)

  // 🎯 FILTER STATE MANAGEMENT
  const [filters, setFilters] = useState<CustomQuizFilters>({
    selectedTiers: new Set<number>(),
    selectedDifficulty: 'all',
    selectedUsage: null,
    selectedSubtlety: null,
    selectedSeverity: null,
    selectedIntent: null,
    selectedDefensibility: null,
    selectedContexts: new Set(),
    selectedMediums: new Set()
  })

  // 🏆 PROGRESS FILTER STATE
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [showLearnedOnly, setShowLearnedOnly] = useState(false)
  const [showUnlearnedOnly, setShowUnlearnedOnly] = useState(false)

  // 🎯 QUIZ CONFIGURATION STATE
  const [questionCount, setQuestionCount] = useState(10)
  const [selectedFallacies, setSelectedFallacies] = useState<Paradox[]>([])
  
  // 🎯 UI STATE
  const [displayedFallacies, setDisplayedFallacies] = useState<Paradox[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // 🏆 ALL FALLACIES AVAILABLE - No restrictions!
  const availableFallacies = useMemo(() => {
    if (!isFallaciesLoaded || fallacies.length === 0) return []
    return fallacies // All fallacies are now available for custom quizzes
  }, [fallacies, isFallaciesLoaded])

  // 🏆 PROGRESS FILTER APPLICATION WITH OR LOGIC
  const progressFilteredFallacies = useMemo(() => {
    if (!isFallaciesLoaded) return []

    let filtered = [...availableFallacies]

    // Apply favorites filter first
    if (showFavoritesOnly) {
      filtered = filtered.filter((paradox: Paradox) => paradox.isFavorite || false)
    }

    // 🚨 CHAMPIONSHIP OR LOGIC for learned/unlearned
    if (showLearnedOnly && showUnlearnedOnly) {
      // Both selected = show all (no additional filtering)
      // Do nothing - show all fallacies regardless of learned status
    } else if (showLearnedOnly) {
      // Only learned selected
      filtered = filtered.filter((paradox: Paradox) => paradox.isLearned || false)
    } else if (showUnlearnedOnly) {
      // Only unlearned selected
      filtered = filtered.filter((paradox: Paradox) => !(paradox.isLearned || false))
    }

    return filtered
  }, [availableFallacies, showFavoritesOnly, showLearnedOnly, showUnlearnedOnly, isFallaciesLoaded])

  // 🏆 FILTER APPLICATION - Now uses CustomQuizService!
  const filteredFallacies = useMemo(() => {
    if (progressFilteredFallacies.length === 0) return []
    
    return customQuizService.applyFiltersToFallacies(progressFilteredFallacies, filters)
  }, [progressFilteredFallacies, filters])

  // 🏆 PROGRESS COUNTS - Direct array counting!
  const progressCounts = useMemo(() => {
    if (!isFallaciesLoaded) {
      return { favoritesCount: 0, learnedCount: 0, unlearnedCount: 0 }
    }

    const favoritesCount = favoriteFallacies.length
    const learnedCount = learnedFallacies.length
    const unlearnedCount = availableFallacies.length - learnedCount

    return { favoritesCount, learnedCount, unlearnedCount }
  }, [favoriteFallacies, learnedFallacies, availableFallacies, isFallaciesLoaded])

  // 🏆 Calculate how many selected fallacies are still visible after filtering
  const visibleSelectedCount = useMemo(() => {
    return selectedFallacies.filter((selectedParadox: Paradox) => 
      filteredFallacies.some((filteredParadox: Paradox) => filteredParadox.id === selectedParadox.id)
    ).length
  }, [selectedFallacies, filteredFallacies])

  // 🎯 PAGINATION LOGIC - Reuse from ParadoxResults pattern
  const FALLACIES_PER_LOAD = 20
  
  useEffect(() => {
    // Reset displayed fallacies when filters change
    setDisplayedFallacies(filteredFallacies.slice(0, FALLACIES_PER_LOAD))
  }, [filteredFallacies])

  const handleLoadMore = () => {
    setIsLoading(true)
    setTimeout(() => {
      const currentLength = displayedFallacies.length
      const nextBatch = filteredFallacies.slice(currentLength, currentLength + FALLACIES_PER_LOAD)
      setDisplayedFallacies((prev: Paradox[]) => [...prev, ...nextBatch])
      setIsLoading(false)
    }, 300)
  }

  // 🎯 FALLACY SELECTION LOGIC
  const handleParadoxPress = (paradox: Paradox) => {
    setSelectedFallacies((prev: Paradox[]) => {
      const isSelected = prev.some((f: Paradox) => f.id === paradox.id)
      if (isSelected) {
        // Remove from selection
        return prev.filter((f: Paradox) => f.id !== paradox.id)
      } else {
        // Add to selection
        return [...prev, paradox]
      }
    })
  }

  const isSelected = (paradox: Paradox) => {
    return selectedFallacies.some((f: Paradox) => f.id === paradox.id)
  }

  // 🏆 FILTER HANDLERS
  const handleDifficultyChange = (difficulty: typeof filters.selectedDifficulty) => {
    setFilters((prev: CustomQuizFilters) => ({ ...prev, selectedDifficulty: difficulty }))
  }

  const handleUsageChange = (usage: typeof filters.selectedUsage) => {
    setFilters((prev: CustomQuizFilters) => ({ ...prev, selectedUsage: usage }))
  }

  const handleSubtletyChange = (subtlety: typeof filters.selectedSubtlety) => {
    setFilters((prev: CustomQuizFilters) => ({ ...prev, selectedSubtlety: subtlety }))
  }

  const handleSeverityChange = (severity: typeof filters.selectedSeverity) => {
    setFilters((prev: CustomQuizFilters) => ({ ...prev, selectedSeverity: severity }))
  }

  const handleIntentChange = (intent: typeof filters.selectedIntent) => {
    setFilters((prev: CustomQuizFilters) => ({ ...prev, selectedIntent: intent }))
  }

  const handleDefensibilityChange = (defensibility: typeof filters.selectedDefensibility) => {
    setFilters((prev: CustomQuizFilters) => ({ ...prev, selectedDefensibility: defensibility }))
  }

  const handleContextToggle = (context: string) => {
    setFilters((prev: CustomQuizFilters) => {
      const newContexts = new Set(prev.selectedContexts)
      if (newContexts.has(context as any)) {
        newContexts.delete(context as any)
      } else {
        newContexts.add(context as any)
      }
      return { ...prev, selectedContexts: newContexts }
    })
  }

  // 🏆 PROGRESS FILTER HANDLERS
  const handleToggleFavoritesOnly = () => {
    setShowFavoritesOnly(!showFavoritesOnly)
  }

  const handleToggleLearnedOnly = () => {
    setShowLearnedOnly(!showLearnedOnly)
  }

  const handleToggleUnlearnedOnly = () => {
    setShowUnlearnedOnly(!showUnlearnedOnly)
  }

  // 🎯 QUIZ CONTROL HANDLERS
  const handleQuestionCountChange = (delta: number) => {
    setQuestionCount((prev: number) => {
      const newCount = prev + delta
      return Math.max(5, Math.min(30, newCount)) // Clamp between 5-30
    })
  }

  const handleSelectAll = () => {
    setSelectedFallacies([...filteredFallacies])
  }

  const handleClearAll = () => {
    setSelectedFallacies([])
  }

  const handleStartQuiz = () => {
    if (selectedFallacies.length === 0) {
      Alert.alert('No Fallacies Selected', 'Please select at least one paradox to create a quiz.')
      return
    }

    // Validation: Need at least 3 fallacies for good variety
    if (selectedFallacies.length < 3) {
      Alert.alert(
        'More Fallacies Needed', 
        'Please select at least 3 fallacies for better quiz variety.',
        [{ text: 'OK' }]
      )
      return
    }

    // 🏆 Simple random slice to max 30 fallacies
    const fallaciesNeeded = Math.min(questionCount, selectedFallacies.length, 30)
    const selectedFallaciesForQuiz = selectedFallacies.length > fallaciesNeeded
      ? selectedFallacies.sort(() => Math.random() - 0.5).slice(0, fallaciesNeeded)
      : selectedFallacies

    // 🏆 Start the custom quiz
    Alert.alert(
      'Start Custom Quiz', 
      `Ready to start a ${questionCount}-question quiz created from ${selectedFallacies.length} selected fallacies?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start Quiz', 
          onPress: () => {
            const selectedParadoxIds: string[] = selectedFallacies.map((f: Paradox) => f.id) 
            const quizSetup: QuizSetup = createCustomQuizSetup(selectedParadoxIds, questionCount)
            startQuiz(quizSetup)
          }
        }
      ]
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* 🔙 BACK BUTTON */}
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
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🎯 Quiz Settings</Text>
          
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
              {visibleSelectedCount} of {selectedFallacies.length} selected fallac{selectedFallacies.length === 1 ? 'y' : 'ies'} visible • {filteredFallacies.length} available
            </Text>
            
            <View style={styles.selectionControls}>
              <TouchableOpacity
                style={[styles.selectionButton, { borderColor: colors.primary }]}
                onPress={handleSelectAll}
                disabled={filteredFallacies.length === 0}
              >
                <Text style={[styles.selectionButtonText, { color: colors.primary }]}>
                  Select All
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.selectionButton, { borderColor: colors.border }]}
                onPress={handleClearAll}
                disabled={selectedFallacies.length === 0}
              >
                <Text style={[styles.selectionButtonText, { color: colors.text }]}>
                  Clear All
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Start Quiz Button */}
        {selectedFallacies.length > 0 && (
          <View style={[{ backgroundColor: colors.background }]}>
            <TouchableOpacity
              style={[styles.startQuizButton, { backgroundColor: colors.primary }]}
              onPress={handleStartQuiz}
            >
              <Text style={styles.startQuizButtonText}>
                🚀 Start {questionCount}-Question Quiz
              </Text>
              <Text style={styles.startQuizSubtext}>
                {visibleSelectedCount} of {selectedFallacies.length} selected fallac{selectedFallacies.length === 1 ? 'y' : 'ies'} visible
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 🏆 FALLACY FILTERS WITH PROGRESS SUPPORT */}
        <View style={[{marginTop: SHAPES.standardVerticalMargin}]}>
          <ParadoxFilters
            selectedDifficulty={filters.selectedDifficulty}
            selectedUsage={filters.selectedUsage}
            selectedSubtlety={filters.selectedSubtlety}
            selectedSeverity={filters.selectedSeverity}
            selectedIntent={filters.selectedIntent}
            selectedDefensibility={filters.selectedDefensibility}
            selectedContexts={filters.selectedContexts}
            showFavoritesOnly={showFavoritesOnly}
            showLearnedOnly={showLearnedOnly}
            showUnlearnedOnly={showUnlearnedOnly}
            favoritesCount={progressCounts.favoritesCount}
            learnedCount={progressCounts.learnedCount}
            unlearnedCount={progressCounts.unlearnedCount}
            onDifficultyChange={handleDifficultyChange}
            onUsageChange={handleUsageChange}
            onSubtletyChange={handleSubtletyChange}
            onSeverityChange={handleSeverityChange}
            onIntentChange={handleIntentChange}
            onDefensibilityChange={handleDefensibilityChange}
            onContextToggle={handleContextToggle}
            onToggleFavoritesOnly={handleToggleFavoritesOnly}
            onToggleLearnedOnly={handleToggleLearnedOnly}
            onToggleUnlearnedOnly={handleToggleUnlearnedOnly}
          />
        </View>

        
        {/* Paradox Results - REUSING EXISTING COMPONENT WITH SELECTION LOGIC */}
        <View style={{paddingBottom: insets.bottom + 120}}>
          <ParadoxResults
            filteredFallacies={filteredFallacies}
            displayedFallacies={displayedFallacies}
            isLoading={isLoading}
            fallaciesLoaded={isFallaciesLoaded}
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