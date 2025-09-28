import AnimatedTabWrapper, { TabAnimationPresets } from '@/components/custom/AnimatedTabWrapper'
import ParadoxFilters, { ContextFilter, DefensibilityFilter, DifficultyFilter, IntentFilter, SeverityFilter, SubtletyFilter, UsageFilter } from '@/components/custom/library/ParadoxFilters'
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

  const { isFallaciesLoaded, getAllFallacies } = useAppState(
    useShallow((state) => ({ 
      isFallaciesLoaded: state.isFallaciesLoaded, 
      getAllFallacies: state.getAllFallacies 
    }))
  )

  // all paradoxes updated by state for use in automatic changes to favorite and learned paradoxes
  const allParadoxes = getAllFallacies()
  const favoriteFallacies = allParadoxes.filter((f: Paradox) => f.isFavorite)
  const learnedFallacies = allParadoxes.filter((f: Paradox) => f.isLearned)
  
  // 💪  STATE MANAGEMENT - NOW WITH PROGRESS MULTI-SELECT!
  const [searchText, setSearchText] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyFilter>('all')
  const [selectedUsage, setSelectedUsage] = useState<UsageFilter | null>(null)
  const [selectedSubtlety, setSelectedSubtlety] = useState<SubtletyFilter | null>(null)
  const [selectedSeverity, setSelectedSeverityFilter] = useState<SeverityFilter | null>(null)
  const [selectedIntent, setSelectedIntent] = useState<IntentFilter | null>(null)
  const [selectedDefensibility, setSelectedDefensibility] = useState<DefensibilityFilter | null>(null)
  const [selectedContexts, setSelectedContexts] = useState<Set<ContextFilter>>(new Set())
  
  // 🏆 : New progress filter states - MULTI-SELECT CHAMPION!
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [showLearnedOnly, setShowLearnedOnly] = useState(false)
  const [showUnlearnedOnly, setShowUnlearnedOnly] = useState(false)
  
  const [showFilters, setShowFilters] = useState(false)
  const [displayedFallacies, setDisplayedFallacies] = useState<Paradox[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  // 🏆 : Calculate progress counts for display
  const progressCounts = useMemo(() => {
    const favoritesCount = favoriteFallacies.length
    const learnedCount = learnedFallacies.length
    const totalFallacies = allParadoxes.length
    const unlearnedCount = totalFallacies - learnedCount
    
    return { favoritesCount, learnedCount, unlearnedCount }
  }, [favoriteFallacies, learnedFallacies, allParadoxes])

  // Filter and search logic -  STYLE WITH PROPER DEPENDENCIES!
  const filteredFallacies = useMemo(() => {
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
    
    // 🏆  FIX: Progress filters with OR logic!
    if (showFavoritesOnly) {
      filtered = filtered.filter((paradox: Paradox) => favoriteFallacies?.some((fav: Paradox) => fav.id=== paradox.id) || false)
    }

    // 🚨 CHAMPIONSHIP OR LOGIC for learned/unlearned
    if (showLearnedOnly && showUnlearnedOnly) {
      // Both selected = show all (no additional filtering)
      // Do nothing - show all paradoxes regardless of learned status
    } else if (showLearnedOnly) {
      // Only learned selected
      filtered = filtered.filter((paradox: Paradox) => learnedFallacies?.some((fav: Paradox) => fav.id=== paradox.id) || false)
    } else if (showUnlearnedOnly) {
      // Only unlearned selected
      filtered = filtered.filter((paradox: Paradox) => !(learnedFallacies?.some((fav: Paradox) => fav.id=== paradox.id) || false))
    }
    
    // Apply all other filters (same as before)
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(paradox => paradox.difficulty === selectedDifficulty)
    }
    if (selectedUsage) {
      filtered = filtered.filter(paradox => paradox.usage === selectedUsage)
    }
    if (selectedSubtlety) {
      filtered = filtered.filter(paradox => paradox.subtlety === selectedSubtlety)
    }
    if (selectedSeverity) {
      filtered = filtered.filter(paradox => paradox.severity === selectedSeverity)
    }
    if (selectedIntent) {
      filtered = filtered.filter(paradox => paradox.intent === selectedIntent)
    }
    if (selectedDefensibility) {
      filtered = filtered.filter(paradox => paradox.defensibility === selectedDefensibility)
    }
    if (selectedContexts.size > 0) {
      filtered = filtered.filter(paradox => selectedContexts.has(paradox.context as ContextFilter))
    }
    
    return filtered
  }, [
    allParadoxes,
    searchText,
    selectedDifficulty,
    selectedUsage,
    selectedSubtlety,
    selectedSeverity,
    selectedIntent,
    selectedDefensibility,
    selectedContexts,
    showFavoritesOnly,
    showLearnedOnly,
    showUnlearnedOnly,
    // favoriteFallacies and learnedFallacies are derived arrays that get recreated on every render, causing infinite re-renders
    // SO F ESLINT - DO NOT INCLUDE
    // favoriteFallacies,
    // learnedFallacies
  ])

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
    setDisplayedFallacies(filteredFallacies.slice(0, ITEMS_PER_PAGE))
  }, [filteredFallacies])

  //  HANDLER FUNCTIONS - CLEAN AND ORGANIZED WITH PROGRESS!
  const handleSearchChange = (text: string) => {
    setSearchText(text)
  }

  const handleToggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const handleContextToggle = (context: ContextFilter) => {
    const newSelected = new Set(selectedContexts)
    if (newSelected.has(context)) {
      newSelected.delete(context)
    } else {
      newSelected.add(context)
    }
    setSelectedContexts(newSelected)
  }

  // 🏆 : Progress filter handlers - MULTI-SELECT STYLE!
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
    setSelectedUsage(null)
    setSelectedSubtlety(null)
    setSelectedSeverityFilter(null)
    setSelectedIntent(null)
    setSelectedDefensibility(null)
    setSelectedContexts(new Set())
    // 🚨 : Clear progress filters too!
    setShowFavoritesOnly(false)
    setShowLearnedOnly(false)
    setShowUnlearnedOnly(false)
  }

  const hasActiveFilters = () => {
    return selectedDifficulty !== 'all' || 
      selectedUsage !== null || 
      selectedSubtlety !== null || 
      selectedSeverity !== null || 
      selectedIntent !== null || 
      selectedDefensibility !== null || 
      selectedContexts.size > 0 ||
      // 🚨 : Include progress filters in active check!
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
    if (isLoading || displayedFallacies.length >= filteredFallacies.length) return
    
    setIsLoading(true)
    // LIGHTNING FAST local data - no delays needed, brother!
    const nextPage = currentPage + 1
    const startIndex = (nextPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const newItems = filteredFallacies.slice(startIndex, endIndex)
    
    setDisplayedFallacies(prev => [...prev, ...newItems])
    setCurrentPage(nextPage)
    setIsLoading(false)
  }

  // 🏆 : Enhanced subtitle with progress filter info
  const getSubtitleText = () => {
    if (!isFallaciesLoaded) return 'Loading paradoxes...'
    
    const activeProgressFilters = []
    if (showFavoritesOnly) activeProgressFilters.push('favorites')
    if (showLearnedOnly) activeProgressFilters.push('learned')
    if (showUnlearnedOnly) activeProgressFilters.push('unlearned')
    
    if (activeProgressFilters.length > 0) {
      return `${filteredFallacies.length} ${activeProgressFilters.join(' + ')} paradoxes ready to conquer!`
    }
    
    return `${filteredFallacies.length} paradoxes ready to conquer!`
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background}]}>
      <AnimatedTabWrapper {...TabAnimationPresets.veniceBeachFade}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContentContainer, {paddingTop: insets.top, paddingBottom: insets.bottom + 80 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* 🏆 MAIN HEADER -  STYLE! */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Library</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {getSubtitleText()}
            </Text>
          </View>

          {/* 🔍 SEARCH BAR COMPONENT */}
          <ParadoxSearchBar
            searchText={searchText}
            onSearchChange={handleSearchChange}
          />

          {/* 🎯 FILTER TOGGLE COMPONENT */}
          <ParadoxFilterToggle
            showFilters={showFilters}
            hasActiveFilters={hasActiveFilters()}
            hasSearchText={searchText.length > 0}
            onToggleFilters={handleToggleFilters}
            onClearAll={handleClearAll}
          />

          {/* 🔥 FILTERS COMPONENT - NOW WITH PROGRESS MULTI-SELECT! */}
          {showFilters && (
            <View style={[{marginHorizontal: SHAPES.standardVerticalMargin }]}>
              <ParadoxFilters
                selectedDifficulty={selectedDifficulty}
                selectedUsage={selectedUsage}
                selectedSubtlety={selectedSubtlety}
                selectedSeverity={selectedSeverity}
                selectedIntent={selectedIntent}
                selectedDefensibility={selectedDefensibility}
                selectedContexts={selectedContexts}
                // 🚨 : Pass progress filter props!
                showFavoritesOnly={showFavoritesOnly}
                showLearnedOnly={showLearnedOnly}
                showUnlearnedOnly={showUnlearnedOnly}
                favoritesCount={progressCounts.favoritesCount}
                learnedCount={progressCounts.learnedCount}
                unlearnedCount={progressCounts.unlearnedCount}
                onDifficultyChange={setSelectedDifficulty}
                onUsageChange={setSelectedUsage}
                onSubtletyChange={setSelectedSubtlety}
                onSeverityChange={setSelectedSeverityFilter}
                onIntentChange={setSelectedIntent}
                onDefensibilityChange={setSelectedDefensibility}
                onContextToggle={handleContextToggle}
                // 🚨 : Pass progress filter handlers!
                onToggleFavoritesOnly={handleToggleFavoritesOnly}
                onToggleLearnedOnly={handleToggleLearnedOnly}
                onToggleUnlearnedOnly={handleToggleUnlearnedOnly}
              />
            </View>
          )}

          {/* 📋 RESULTS COMPONENT */}
          <View style={[{marginHorizontal: SHAPES.standardVerticalMargin }]}>
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