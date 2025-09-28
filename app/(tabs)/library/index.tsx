import AnimatedTabWrapper, { TabAnimationPresets } from '@/components/custom/AnimatedTabWrapper'
import ParadoxFilters, { DifficultyFilter, DomainFilter, MindBlowFactorFilter, PrerequisitesFilter, PresentationFilter, ResolutionDifficultyFilter } from '@/components/custom/library/ParadoxFilters'
import ParadoxFilterToggle from '@/components/custom/library/ParadoxFilterToggle'
import ParadoxResults from '@/components/custom/library/ParadoxResults'
import ParadoxSearchBar from '@/components/custom/library/ParadoxSearchBarProps'
import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { useAppState } from '@/state/useAppState'
import { Paradox } from '@/types/app.types'
import { RelativePathString, router } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/shallow'

export default function LibraryIndexScreen() {
  const insets = useSafeAreaInsets()
  const { colors } = useSystemTheme()

  const ITEMS_PER_PAGE = 20

  const { isParadoxesLoaded, getAllParadoxes } = useAppState(
    useShallow((state) => ({ 
      isParadoxesLoaded: state.isParadoxesLoaded, 
      getAllParadoxes: state.getAllParadoxes 
    }))
  )

  // All paradoxes updated by state for use in automatic changes to favorite and learned paradoxes
  const allParadoxes = getAllParadoxes()
  const favoriteParadoxes = allParadoxes.filter((p: Paradox) => p.isFavorite)
  const learnedParadoxes = allParadoxes.filter((p: Paradox) => p.isLearned)
  
  // STATE MANAGEMENT - Updated for Paradox attributes
  const [searchText, setSearchText] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyFilter>('all')
  const [selectedMindBlowFactor, setSelectedMindBlowFactor] = useState<MindBlowFactorFilter | null>(null)
  const [selectedResolutionDifficulty, setSelectedResolutionDifficulty] = useState<ResolutionDifficultyFilter | null>(null)
  const [selectedDomains, setSelectedDomains] = useState<Set<DomainFilter>>(new Set())
  const [selectedPresentations, setSelectedPresentations] = useState<Set<PresentationFilter>>(new Set())
  const [selectedPrerequisites, setSelectedPrerequisites] = useState<Set<PrerequisitesFilter>>(new Set())
  
  // Progress filter states
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [showLearnedOnly, setShowLearnedOnly] = useState(false)
  const [showUnlearnedOnly, setShowUnlearnedOnly] = useState(false)
  
  const [showFilters, setShowFilters] = useState(false)
  const [displayedParadoxes, setDisplayedParadoxes] = useState<Paradox[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  // Calculate progress counts for display
  const progressCounts = useMemo(() => {
    const favoritesCount = favoriteParadoxes.length
    const learnedCount = learnedParadoxes.length
    const totalParadoxes = allParadoxes.length
    const unlearnedCount = totalParadoxes - learnedCount
    
    return { favoritesCount, learnedCount, unlearnedCount }
  }, [favoriteParadoxes, learnedParadoxes, allParadoxes])

  // Filter and search logic - Updated for Paradox attributes
  const filteredParadoxes = useMemo(() => {
    let filtered = allParadoxes
    
    // Search filter
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase().trim()
      filtered = filtered.filter(paradox => 
        paradox.title.toLowerCase().includes(searchLower) ||
        paradox.subtitle.toLowerCase().includes(searchLower) ||
        paradox.description.toLowerCase().includes(searchLower) ||
        paradox.category.toLowerCase().includes(searchLower) ||
        paradox.type.toLowerCase().includes(searchLower)
      )
    }
    
    // Progress filters with OR logic
    if (showFavoritesOnly) {
      filtered = filtered.filter((paradox: Paradox) => favoriteParadoxes?.some((fav: Paradox) => fav.id === paradox.id) || false)
    }

    // OR LOGIC for learned/unlearned
    if (showLearnedOnly && showUnlearnedOnly) {
      // Both selected = show all (no additional filtering)
    } else if (showLearnedOnly) {
      // Only learned selected
      filtered = filtered.filter((paradox: Paradox) => learnedParadoxes?.some((learned: Paradox) => learned.id === paradox.id) || false)
    } else if (showUnlearnedOnly) {
      // Only unlearned selected
      filtered = filtered.filter((paradox: Paradox) => !(learnedParadoxes?.some((learned: Paradox) => learned.id === paradox.id) || false))
    }
    
    // Apply paradox-specific filters
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(paradox => paradox.difficulty === selectedDifficulty)
    }
    if (selectedMindBlowFactor) {
      filtered = filtered.filter(paradox => paradox.mind_blow_factor === selectedMindBlowFactor)
    }
    if (selectedResolutionDifficulty) {
      filtered = filtered.filter(paradox => paradox.resolution_difficulty === selectedResolutionDifficulty)
    }
    if (selectedDomains.size > 0) {
      filtered = filtered.filter(paradox => selectedDomains.has(paradox.domain as DomainFilter))
    }
    if (selectedPresentations.size > 0) {
      filtered = filtered.filter(paradox => selectedPresentations.has(paradox.presentation as PresentationFilter))
    }
    if (selectedPrerequisites.size > 0) {
      filtered = filtered.filter(paradox => selectedPrerequisites.has(paradox.prerequisites as PrerequisitesFilter))
    }
    
    return filtered
  }, [
    allParadoxes,
    searchText,
    selectedDifficulty,
    selectedMindBlowFactor,
    selectedResolutionDifficulty,
    selectedDomains,
    selectedPresentations,
    selectedPrerequisites,
    showFavoritesOnly,
    showLearnedOnly,
    showUnlearnedOnly,
  ])

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
    setDisplayedParadoxes(filteredParadoxes.slice(0, ITEMS_PER_PAGE))
  }, [filteredParadoxes])

  // HANDLER FUNCTIONS - Updated for paradox attributes
  const handleSearchChange = (text: string) => {
    setSearchText(text)
  }

  const handleToggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const handleDomainToggle = (domain: string) => {
    const newSelected = new Set(selectedDomains)
    if (newSelected.has(domain as DomainFilter)) {
      newSelected.delete(domain as DomainFilter)
    } else {
      newSelected.add(domain as DomainFilter)
    }
    setSelectedDomains(newSelected)
  }

  const handlePresentationToggle = (presentation: string) => {
    const newSelected = new Set(selectedPresentations)
    if (newSelected.has(presentation as PresentationFilter)) {
      newSelected.delete(presentation as PresentationFilter)
    } else {
      newSelected.add(presentation as PresentationFilter)
    }
    setSelectedPresentations(newSelected)
  }

  const handlePrerequisitesToggle = (prerequisites: string) => {
    const newSelected = new Set(selectedPrerequisites)
    if (newSelected.has(prerequisites as PrerequisitesFilter)) {
      newSelected.delete(prerequisites as PrerequisitesFilter)
    } else {
      newSelected.add(prerequisites as PrerequisitesFilter)
    }
    setSelectedPrerequisites(newSelected)
  }

  // Progress filter handlers
  const handleToggleFavoritesOnly = () => {
    setShowFavoritesOnly(!showFavoritesOnly)
  }

  const handleToggleLearnedOnly = () => {
    setShowLearnedOnly(!showLearnedOnly)
  }

  const handleToggleUnlearnedOnly = () => {
    setShowUnlearnedOnly(!showUnlearnedOnly)
  }

  const handleClearAll = () => {
    setSearchText('')
    setSelectedDifficulty('all')
    setSelectedMindBlowFactor(null)
    setSelectedResolutionDifficulty(null)
    setSelectedDomains(new Set())
    setSelectedPresentations(new Set())
    setSelectedPrerequisites(new Set())
    // Clear progress filters too
    setShowFavoritesOnly(false)
    setShowLearnedOnly(false)
    setShowUnlearnedOnly(false)
  }

  const hasActiveFilters = () => {
    return selectedDifficulty !== 'all' || 
      selectedMindBlowFactor !== null || 
      selectedResolutionDifficulty !== null || 
      selectedDomains.size > 0 ||
      selectedPresentations.size > 0 ||
      selectedPrerequisites.size > 0 ||
      // Include progress filters in active check
      showFavoritesOnly ||
      showLearnedOnly ||
      showUnlearnedOnly
  }

  const handleParadoxPress = (paradox: Paradox) => {
    router.push({
      pathname: "/(tabs)/library/paradox/[id]" as RelativePathString,
      params: { id: paradox.id }
    })
  }

  const handleLoadMore = () => {
    if (isLoading || displayedParadoxes.length >= filteredParadoxes.length) return
    
    setIsLoading(true)
    // Local data - no delays needed
    const nextPage = currentPage + 1
    const startIndex = (nextPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const newItems = filteredParadoxes.slice(startIndex, endIndex)
    
    setDisplayedParadoxes(prev => [...prev, ...newItems])
    setCurrentPage(nextPage)
    setIsLoading(false)
  }

  // Enhanced subtitle with progress filter info
  const getSubtitleText = () => {
    if (!isParadoxesLoaded) return 'Loading paradoxes...'
    
    const activeProgressFilters = []
    if (showFavoritesOnly) activeProgressFilters.push('favorites')
    if (showLearnedOnly) activeProgressFilters.push('learned')
    if (showUnlearnedOnly) activeProgressFilters.push('unlearned')
    
    if (activeProgressFilters.length > 0) {
      return `${filteredParadoxes.length} ${activeProgressFilters.join(' + ')} paradoxes ready to conquer!`
    }
    
    return `${filteredParadoxes.length} paradoxes ready to conquer!`
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background}]}>
      <AnimatedTabWrapper {...TabAnimationPresets.veniceBeachFade}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContentContainer, {paddingTop: insets.top, paddingBottom: insets.bottom + 80 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Library</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {getSubtitleText()}
            </Text>
          </View>

          {/* Search Bar Component */}
          <ParadoxSearchBar
            searchText={searchText}
            onSearchChange={handleSearchChange}
          />

          {/* Filter Toggle Component */}
          <ParadoxFilterToggle
            showFilters={showFilters}
            hasActiveFilters={hasActiveFilters()}
            hasSearchText={searchText.length > 0}
            onToggleFilters={handleToggleFilters}
            onClearAll={handleClearAll}
          />

          {/* Filters Component - Updated for Paradox attributes */}
          {showFilters && (
            <View style={[{marginHorizontal: SHAPES.standardVerticalMargin }]}>
              <ParadoxFilters
                selectedDifficulty={selectedDifficulty}
                selectedMindBlowFactor={selectedMindBlowFactor}
                selectedResolutionDifficulty={selectedResolutionDifficulty}
                selectedDomains={selectedDomains}
                selectedPresentations={selectedPresentations}
                selectedPrerequisites={selectedPrerequisites}
                // Progress filter props
                showFavoritesOnly={showFavoritesOnly}
                showLearnedOnly={showLearnedOnly}
                showUnlearnedOnly={showUnlearnedOnly}
                favoritesCount={progressCounts.favoritesCount}
                learnedCount={progressCounts.learnedCount}
                unlearnedCount={progressCounts.unlearnedCount}
                onDifficultyChange={setSelectedDifficulty}
                onMindBlowFactorChange={setSelectedMindBlowFactor}
                onResolutionDifficultyChange={setSelectedResolutionDifficulty}
                onDomainToggle={handleDomainToggle}
                onPresentationToggle={handlePresentationToggle}
                onPrerequisitesToggle={handlePrerequisitesToggle}
                // Progress filter handlers
                onToggleFavoritesOnly={handleToggleFavoritesOnly}
                onToggleLearnedOnly={handleToggleLearnedOnly}
                onToggleUnlearnedOnly={handleToggleUnlearnedOnly}
              />
            </View>
          )}

          {/* Results Component */}
          <View style={[{marginHorizontal: SHAPES.standardVerticalMargin }]}>
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
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: SHAPES.standardHeaderHorizontalMargin,
    paddingTop: SHAPES.standardVerticalMargin,
    paddingBottom: 16,
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
})