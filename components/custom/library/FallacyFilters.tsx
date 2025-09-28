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

// Filter types -  STYLE!
export type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced' | 'expert'
export type UsageFilter = 'ubiquitous' | 'common' | 'moderate' | 'occasional' | 'rare'
export type SubtletyFilter = 'blatant' | 'obvious' | 'subtle' | 'very-subtle'
export type SeverityFilter = 'mild' | 'moderate' | 'serious' | 'toxic'
export type IntentFilter = 'defensive' | 'offensive' | 'persuasive' | 'deflective' | 'emotional'
export type DefensibilityFilter = 'easy' | 'moderate' | 'difficult'
export type ContextFilter = 'social-media' | 'politics' | 'workplace' | 'family' | 'academic' | 'marketing' | 'relationships'

const DIFFICULTY_OPTIONS: { key: DifficultyFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'beginner', label: 'Beginner' },
  { key: 'intermediate', label: 'Intermediate' },
  { key: 'advanced', label: 'Advanced' },
  { key: 'expert', label: 'Expert' }
]

const USAGE_OPTIONS: { key: UsageFilter; label: string }[] = [
  { key: 'ubiquitous', label: 'Ubiquitous' },
  { key: 'common', label: 'Common' },
  { key: 'moderate', label: 'Moderate' },
  { key: 'occasional', label: 'Occasional' },
  { key: 'rare', label: 'Rare' }
]

const SUBTLETY_OPTIONS: { key: SubtletyFilter; label: string }[] = [
  { key: 'blatant', label: 'Blatant' },
  { key: 'obvious', label: 'Obvious' },
  { key: 'subtle', label: 'Subtle' },
  { key: 'very-subtle', label: 'Very Subtle' }
]

const SEVERITY_OPTIONS: { key: SeverityFilter; label: string }[] = [
  { key: 'mild', label: 'Mild' },
  { key: 'moderate', label: 'Moderate' },
  { key: 'serious', label: 'Serious' },
  { key: 'toxic', label: 'Toxic' }
]

const INTENT_OPTIONS: { key: IntentFilter; label: string }[] = [
  { key: 'defensive', label: 'Defensive' },
  { key: 'offensive', label: 'Offensive' },
  { key: 'persuasive', label: 'Persuasive' },
  { key: 'deflective', label: 'Deflective' },
  { key: 'emotional', label: 'Emotional' }
]

const DEFENSIBILITY_OPTIONS: { key: DefensibilityFilter; label: string }[] = [
  { key: 'easy', label: 'Easy' },
  { key: 'moderate', label: 'Moderate' },
  { key: 'difficult', label: 'Difficult' }
]

const CONTEXT_OPTIONS: { key: ContextFilter; label: string; emoji: string }[] = [
  { key: 'social-media', label: 'Social Media', emoji: '📱' },
  { key: 'politics', label: 'Politics', emoji: '🗳️' },
  { key: 'workplace', label: 'Workplace', emoji: '💼' },
  { key: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦' },
  { key: 'academic', label: 'Academic', emoji: '🎓' },
  { key: 'marketing', label: 'Marketing', emoji: '📈' },
  { key: 'relationships', label: 'Relationships', emoji: '💕' }
]

interface FallacyFiltersProps {
  selectedDifficulty: DifficultyFilter
  selectedUsage: UsageFilter | null
  selectedSubtlety: SubtletyFilter | null
  selectedSeverity: SeverityFilter | null
  selectedIntent: IntentFilter | null
  selectedDefensibility: DefensibilityFilter | null
  selectedContexts: Set<ContextFilter>
  // 🚨 : New progress filter props - MULTI-SELECT CHAMPION!
  showFavoritesOnly: boolean
  showLearnedOnly: boolean
  showUnlearnedOnly: boolean
  favoritesCount: number
  learnedCount: number
  unlearnedCount: number
  onDifficultyChange: (difficulty: DifficultyFilter) => void
  onUsageChange: (usage: UsageFilter | null) => void
  onSubtletyChange: (subtlety: SubtletyFilter | null) => void
  onSeverityChange: (severity: SeverityFilter | null) => void
  onIntentChange: (intent: IntentFilter | null) => void
  onDefensibilityChange: (defensibility: DefensibilityFilter | null) => void
  onContextToggle: (context: ContextFilter) => void
  // 🚨 : New progress handlers - MULTI-SELECT STYLE!
  onToggleFavoritesOnly: () => void
  onToggleLearnedOnly: () => void
  onToggleUnlearnedOnly: () => void
}

const FallacyFilters: React.FC<FallacyFiltersProps> = ({
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
  favoritesCount,
  learnedCount,
  unlearnedCount,
  onDifficultyChange,
  onUsageChange,
  onSubtletyChange,
  onSeverityChange,
  onIntentChange,
  onDefensibilityChange,
  onContextToggle,
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

  // 🏆 : Helper to show active progress filters
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
      {/* Difficulty Filter - HORIZONTAL SCROLL CHAMPION! */}
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

      {/* Advanced Filters Section - THE HEAVYWEIGHT DIVISION! */}
      {showAdvancedFilters && (
        <>
          {/* 🌟  VIP SECTION: Your Progress - MULTI-SELECT CHAMPION! */}
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
            
            {/* 🚨 : Helper text for multi-select */}
            <Text style={[styles.progressHelpText, { color: colors.textSecondary }]}>
              💡 Mix and match filters! Try &quot;Favorites + Unlearned&quot; for focused study.
            </Text>
          </View>

          {/* Usage Filter */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterTitle, { color: colors.text }]}>📊 Usage Frequency</Text>
            <View style={styles.advancedFilterContainer}>
              {USAGE_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.advancedFilterChip,
                    {
                      backgroundColor: selectedUsage === option.key ? colors.primary : colors.background,
                      borderColor: selectedUsage === option.key ? colors.primary : colors.border,
                    }
                  ]}
                  onPress={() => handleAdvancedFilterToggle(selectedUsage, option.key, onUsageChange)}
                >
                  <Text style={[
                    styles.advancedFilterText,
                    { color: selectedUsage === option.key ? 'white' : colors.text }
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Subtlety Filter */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterTitle, { color: colors.text }]}>🎭 Subtlety Level</Text>
            <View style={styles.advancedFilterContainer}>
              {SUBTLETY_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.advancedFilterChip,
                    {
                      backgroundColor: selectedSubtlety === option.key ? colors.primary : colors.background,
                      borderColor: selectedSubtlety === option.key ? colors.primary : colors.border,
                    }
                  ]}
                  onPress={() => handleAdvancedFilterToggle(selectedSubtlety, option.key, onSubtletyChange)}
                >
                  <Text style={[
                    styles.advancedFilterText,
                    { color: selectedSubtlety === option.key ? 'white' : colors.text }
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Severity Filter */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterTitle, { color: colors.text }]}>⚠️ Severity Level</Text>
            <View style={styles.advancedFilterContainer}>
              {SEVERITY_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.advancedFilterChip,
                    {
                      backgroundColor: selectedSeverity === option.key ? colors.primary : colors.background,
                      borderColor: selectedSeverity === option.key ? colors.primary : colors.border,
                    }
                  ]}
                  onPress={() => handleAdvancedFilterToggle(selectedSeverity, option.key, onSeverityChange)}
                >
                  <Text style={[
                    styles.advancedFilterText,
                    { color: selectedSeverity === option.key ? 'white' : colors.text }
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Intent Filter */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterTitle, { color: colors.text }]}>🎯 Intent Type</Text>
            <View style={styles.advancedFilterContainer}>
              {INTENT_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.advancedFilterChip,
                    {
                      backgroundColor: selectedIntent === option.key ? colors.primary : colors.background,
                      borderColor: selectedIntent === option.key ? colors.primary : colors.border,
                    }
                  ]}
                  onPress={() => handleAdvancedFilterToggle(selectedIntent, option.key, onIntentChange)}
                >
                  <Text style={[
                    styles.advancedFilterText,
                    { color: selectedIntent === option.key ? 'white' : colors.text }
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Defensibility Filter */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterTitle, { color: colors.text }]}>🛡️ Defensibility</Text>
            <View style={styles.advancedFilterContainer}>
              {DEFENSIBILITY_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.advancedFilterChip,
                    {
                      backgroundColor: selectedDefensibility === option.key ? colors.primary : colors.background,
                      borderColor: selectedDefensibility === option.key ? colors.primary : colors.border,
                    }
                  ]}
                  onPress={() => handleAdvancedFilterToggle(selectedDefensibility, option.key, onDefensibilityChange)}
                >
                  <Text style={[
                    styles.advancedFilterText,
                    { color: selectedDefensibility === option.key ? 'white' : colors.text }
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Context Filter */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterTitle, { color: colors.text }]}>🌍 Context Areas</Text>
            <View style={styles.contextContainer}>
              {CONTEXT_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.contextChip,
                    {
                      backgroundColor: selectedContexts.has(option.key) ? colors.primary : colors.background,
                      borderColor: selectedContexts.has(option.key) ? colors.primary : colors.border,
                    }
                  ]}
                  onPress={() => onContextToggle(option.key)}
                >
                  <Text style={styles.contextEmoji}>{option.emoji}</Text>
                  <Text style={[
                    styles.contextText,
                    { color: selectedContexts.has(option.key) ? 'white' : colors.text }
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
  
  // 🏆 : New progress filter styles - MULTI-SELECT CHAMPION!
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
  progressToggle: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
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
  progressTextContainer: {
    flex: 1,
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

export default FallacyFilters