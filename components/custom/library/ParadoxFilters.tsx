import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

// Filter types for paradoxes
export type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced' | 'expert'
export type MindBlowFactorFilter = 'amusing' | 'surprising' | 'mind-bending' | 'reality-questioning'
export type ResolutionDifficultyFilter = 'intuitive' | 'requires-explanation' | 'academic-debate' | 'unresolved'
export type DomainFilter = 'everyday-life' | 'mathematics' | 'physics' | 'philosophy' | 'economics' | 'psychology' | 'logic' | 'probability'
export type PresentationFilter = 'word-problem' | 'thought-experiment' | 'mathematical' | 'visual' | 'interactive' | 'scenario'
export type PrerequisitesFilter = 'none' | 'basic-logic' | 'high-school-math' | 'college-math' | 'specialized-knowledge'

const DIFFICULTY_OPTIONS: { key: DifficultyFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'beginner', label: 'Beginner' },
  { key: 'intermediate', label: 'Intermediate' },
  { key: 'advanced', label: 'Advanced' },
  { key: 'expert', label: 'Expert' }
]

const MIND_BLOW_FACTOR_OPTIONS: { key: MindBlowFactorFilter; label: string }[] = [
  { key: 'amusing', label: 'Amusing' },
  { key: 'surprising', label: 'Surprising' },
  { key: 'mind-bending', label: 'Mind-Bending' },
  { key: 'reality-questioning', label: 'Reality-Questioning' }
]

const RESOLUTION_DIFFICULTY_OPTIONS: { key: ResolutionDifficultyFilter; label: string }[] = [
  { key: 'intuitive', label: 'Intuitive' },
  { key: 'requires-explanation', label: 'Requires Explanation' },
  { key: 'academic-debate', label: 'Academic Debate' },
  { key: 'unresolved', label: 'Unresolved' }
]

const DOMAIN_OPTIONS: { key: DomainFilter; label: string; emoji: string }[] = [
  { key: 'everyday-life', label: 'Everyday Life', emoji: '🏠' },
  { key: 'mathematics', label: 'Mathematics', emoji: '🔢' },
  { key: 'physics', label: 'Physics', emoji: '⚛️' },
  { key: 'philosophy', label: 'Philosophy', emoji: '🤔' },
  { key: 'economics', label: 'Economics', emoji: '💰' },
  { key: 'psychology', label: 'Psychology', emoji: '🧠' },
  { key: 'logic', label: 'Logic', emoji: '🔬' },
  { key: 'probability', label: 'Probability', emoji: '🎲' }
]

const PRESENTATION_OPTIONS: { key: PresentationFilter; label: string; emoji: string }[] = [
  { key: 'word-problem', label: 'Word Problem', emoji: '📝' },
  { key: 'thought-experiment', label: 'Thought Experiment', emoji: '💭' },
  { key: 'mathematical', label: 'Mathematical', emoji: '📊' },
  { key: 'visual', label: 'Visual', emoji: '🎨' },
  { key: 'interactive', label: 'Interactive', emoji: '🎮' },
  { key: 'scenario', label: 'Scenario', emoji: '🎭' }
]

const PREREQUISITES_OPTIONS: { key: PrerequisitesFilter; label: string }[] = [
  { key: 'none', label: 'None' },
  { key: 'basic-logic', label: 'Basic Logic' },
  { key: 'high-school-math', label: 'High School Math' },
  { key: 'college-math', label: 'College Math' },
  { key: 'specialized-knowledge', label: 'Specialized Knowledge' }
]

interface ParadoxFiltersProps {
  selectedDifficulty: DifficultyFilter
  selectedMindBlowFactor: MindBlowFactorFilter | null
  selectedResolutionDifficulty: ResolutionDifficultyFilter | null
  selectedDomains: Set<DomainFilter>
  selectedPresentations: Set<PresentationFilter>
  selectedPrerequisites: Set<PrerequisitesFilter>
  // Progress filter props
  showFavoritesOnly: boolean
  showLearnedOnly: boolean
  showUnlearnedOnly: boolean
  favoritesCount: number
  learnedCount: number
  unlearnedCount: number
  // Handlers
  onDifficultyChange: (difficulty: DifficultyFilter) => void
  onMindBlowFactorChange: (mindBlowFactor: MindBlowFactorFilter | null) => void
  onResolutionDifficultyChange: (resolutionDifficulty: ResolutionDifficultyFilter | null) => void
  onDomainToggle: (domain: string) => void
  onPresentationToggle: (presentation: string) => void
  onPrerequisitesToggle: (prerequisites: string) => void
  // Progress handlers
  onToggleFavoritesOnly: () => void
  onToggleLearnedOnly: () => void
  onToggleUnlearnedOnly: () => void
}

const ParadoxFilters: React.FC<ParadoxFiltersProps> = ({
  selectedDifficulty,
  selectedMindBlowFactor,
  selectedResolutionDifficulty,
  selectedDomains,
  selectedPresentations,
  selectedPrerequisites,
  showFavoritesOnly,
  showLearnedOnly,
  showUnlearnedOnly,
  favoritesCount,
  learnedCount,
  unlearnedCount,
  onDifficultyChange,
  onMindBlowFactorChange,
  onResolutionDifficultyChange,
  onDomainToggle,
  onPresentationToggle,
  onPrerequisitesToggle,
  onToggleFavoritesOnly,
  onToggleLearnedOnly,
  onToggleUnlearnedOnly
}) => {
  const { colors } = useSystemTheme()
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const handleAdvancedFilterToggle = <T,>(
    currentValue: T | null,
    newValue: T,
    onChange: (value: T | null) => void
  ) => {
    onChange(currentValue === newValue ? null : newValue)
  }

  // Helper to show active progress filters
  const getActiveProgressFilters = () => {
    const active = []
    if (showFavoritesOnly) active.push('Favorites')
    if (showLearnedOnly) active.push('Learned')
    if (showUnlearnedOnly) active.push('Unlearned')
    return active
  }

  const activeProgressFilters = getActiveProgressFilters()

  return (
    <View style={[styles.filtersContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* Difficulty Filter */}
      <View style={styles.filterSection}>
        <Text style={[styles.filterTitle, { color: colors.text }]}>💪 Difficulty Level</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.difficultyScroll}>
          <View style={styles.difficultyContainer}>
            {DIFFICULTY_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.difficultyChip,
                  {
                    backgroundColor: selectedDifficulty === option.key ? colors.primary : colors.background,
                    borderColor: selectedDifficulty === option.key ? colors.primary : colors.border,
                  }
                ]}
                onPress={() => onDifficultyChange(option.key)}
              >
                <Text style={[
                  styles.difficultyText,
                  { color: selectedDifficulty === option.key ? 'white' : colors.text }
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Advanced Filters Toggle */}
      <TouchableOpacity
        style={styles.advancedToggle}
        onPress={() => setShowAdvancedFilters(!showAdvancedFilters)}
      >
        <Text style={[styles.advancedToggleText, { color: colors.primary }]}>
          🎯 Advanced Filters
        </Text>
        <Ionicons 
          name={showAdvancedFilters ? "chevron-up" : "chevron-down"} 
          size={16} 
          color={colors.primary} 
        />
      </TouchableOpacity>

      {/* Advanced Filters Section */}
      {showAdvancedFilters && (
        <>
          {/* Your Progress Section */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterTitle, { color: colors.text }]}>📚 Your Progress</Text>
            
            {/* Active Progress Filter Summary */}
            {activeProgressFilters.length > 0 && (
              <View style={styles.activeProgressSummary}>
                <Text style={[styles.activeProgressText, { color: colors.primary }]}>
                  📊 Showing: {activeProgressFilters.join(' + ')}
                </Text>
              </View>
            )}

            <View style={styles.progressFiltersContainer}>
              {/* Favorites Toggle */}
              <TouchableOpacity
                style={[
                  styles.progressToggleCompact,
                  {
                    backgroundColor: showFavoritesOnly ? colors.primary : colors.background,
                    borderColor: showFavoritesOnly ? colors.primary : colors.border,
                  }
                ]}
                onPress={onToggleFavoritesOnly}
              >
                <Text style={styles.progressEmojiCompact}>⭐</Text>
                <Text style={[
                  styles.progressToggleTextCompact,
                  { color: showFavoritesOnly ? 'white' : colors.text }
                ]}>
                  Favorites
                </Text>
                <Text style={[
                  styles.progressCountTextCompact,
                  { color: showFavoritesOnly ? 'rgba(255, 255, 255, 0.8)' : colors.textSecondary }
                ]}>
                  {favoritesCount}
                </Text>
                {showFavoritesOnly && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </TouchableOpacity>

              {/* Learned Toggle */}
              <TouchableOpacity
                style={[
                  styles.progressToggleCompact,
                  {
                    backgroundColor: showLearnedOnly ? colors.primary : colors.background,
                    borderColor: showLearnedOnly ? colors.primary : colors.border,
                  }
                ]}
                onPress={onToggleLearnedOnly}
              >
                <Text style={styles.progressEmojiCompact}>✅</Text>
                <Text style={[
                  styles.progressToggleTextCompact,
                  { color: showLearnedOnly ? 'white' : colors.text }
                ]}>
                  Learned
                </Text>
                <Text style={[
                  styles.progressCountTextCompact,
                  { color: showLearnedOnly ? 'rgba(255, 255, 255, 0.8)' : colors.textSecondary }
                ]}>
                  {learnedCount}
                </Text>
                {showLearnedOnly && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </TouchableOpacity>

              {/* Unlearned Toggle */}
              <TouchableOpacity
                style={[
                  styles.progressToggleCompact,
                  {
                    backgroundColor: showUnlearnedOnly ? colors.primary : colors.background,
                    borderColor: showUnlearnedOnly ? colors.primary : colors.border,
                  }
                ]}
                onPress={onToggleUnlearnedOnly}
              >
                <Text style={styles.progressEmojiCompact}>📖</Text>
                <Text style={[
                  styles.progressToggleTextCompact,
                  { color: showUnlearnedOnly ? 'white' : colors.text }
                ]}>
                  Unlearned
                </Text>
                <Text style={[
                  styles.progressCountTextCompact,
                  { color: showUnlearnedOnly ? 'rgba(255, 255, 255, 0.8)' : colors.textSecondary }
                ]}>
                  {unlearnedCount}
                </Text>
                {showUnlearnedOnly && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </TouchableOpacity>
            </View>
            
            {/* Helper text for multi-select */}
            <Text style={[styles.progressHelpText, { color: colors.textSecondary }]}>
              💡 Mix and match filters! Try &quot;Favorites + Unlearned&quot; for focused study.
            </Text>
          </View>

          {/* Mind Blow Factor Filter */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterTitle, { color: colors.text }]}>🤯 Mind Blow Factor</Text>
            <View style={styles.advancedFilterContainer}>
              {MIND_BLOW_FACTOR_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.advancedFilterChip,
                    {
                      backgroundColor: selectedMindBlowFactor === option.key ? colors.primary : colors.background,
                      borderColor: selectedMindBlowFactor === option.key ? colors.primary : colors.border,
                    }
                  ]}
                  onPress={() => handleAdvancedFilterToggle(selectedMindBlowFactor, option.key, onMindBlowFactorChange)}
                >
                  <Text style={[
                    styles.advancedFilterText,
                    { color: selectedMindBlowFactor === option.key ? 'white' : colors.text }
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Resolution Difficulty Filter */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterTitle, { color: colors.text }]}>🧩 Resolution Difficulty</Text>
            <View style={styles.advancedFilterContainer}>
              {RESOLUTION_DIFFICULTY_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.advancedFilterChip,
                    {
                      backgroundColor: selectedResolutionDifficulty === option.key ? colors.primary : colors.background,
                      borderColor: selectedResolutionDifficulty === option.key ? colors.primary : colors.border,
                    }
                  ]}
                  onPress={() => handleAdvancedFilterToggle(selectedResolutionDifficulty, option.key, onResolutionDifficultyChange)}
                >
                  <Text style={[
                    styles.advancedFilterText,
                    { color: selectedResolutionDifficulty === option.key ? 'white' : colors.text }
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Prerequisites Filter */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterTitle, { color: colors.text }]}>🎓 Prerequisites</Text>
            <View style={styles.advancedFilterContainer}>
              {PREREQUISITES_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.advancedFilterChip,
                    {
                      backgroundColor: selectedPrerequisites.has(option.key) ? colors.primary : colors.background,
                      borderColor: selectedPrerequisites.has(option.key) ? colors.primary : colors.border,
                    }
                  ]}
                  onPress={() => onPrerequisitesToggle(option.key)}
                >
                  <Text style={[
                    styles.advancedFilterText,
                    { color: selectedPrerequisites.has(option.key) ? 'white' : colors.text }
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Domain Filter */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterTitle, { color: colors.text }]}>🌍 Domain Areas</Text>
            <View style={styles.contextContainer}>
              {DOMAIN_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.contextChip,
                    {
                      backgroundColor: selectedDomains.has(option.key) ? colors.primary : colors.background,
                      borderColor: selectedDomains.has(option.key) ? colors.primary : colors.border,
                    }
                  ]}
                  onPress={() => onDomainToggle(option.key)}
                >
                  <Text style={styles.contextEmoji}>{option.emoji}</Text>
                  <Text style={[
                    styles.contextText,
                    { color: selectedDomains.has(option.key) ? 'white' : colors.text }
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Presentation Filter */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterTitle, { color: colors.text }]}>📋 Presentation Style</Text>
            <View style={styles.contextContainer}>
              {PRESENTATION_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.contextChip,
                    {
                      backgroundColor: selectedPresentations.has(option.key) ? colors.primary : colors.background,
                      borderColor: selectedPresentations.has(option.key) ? colors.primary : colors.border,
                    }
                  ]}
                  onPress={() => onPresentationToggle(option.key)}
                >
                  <Text style={styles.contextEmoji}>{option.emoji}</Text>
                  <Text style={[
                    styles.contextText,
                    { color: selectedPresentations.has(option.key) ? 'white' : colors.text }
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  filtersContainer: {
    padding: 16,
    borderRadius: SHAPES.borderRadius,
    borderWidth: 1,
  },
  filterSection: {
    marginVertical: SHAPES.standardVerticalMargin / 2,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  difficultyScroll: {
    flexGrow: 0,
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 20,
  },
  difficultyChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  advancedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 12,
    marginBottom: 0,
  },
  advancedToggleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Progress filter styles
  activeProgressSummary: {
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  activeProgressText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  progressFiltersContainer: {
    gap: 8,
    marginBottom: 12,
  },
  progressToggleCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  progressEmojiCompact: {
    fontSize: 16,
  },
  progressToggleTextCompact: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  progressCountTextCompact: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 20,
    textAlign: 'center',
  },
  progressHelpText: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 16,
  },
  
  advancedFilterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  advancedFilterChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  advancedFilterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  contextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  contextChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  contextEmoji: {
    fontSize: 16,
  },
  contextText: {
    fontSize: 14,
    fontWeight: '600',
  },
})

export default ParadoxFilters