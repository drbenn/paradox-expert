import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

interface FallacyFilterToggleProps {
  showFilters: boolean
  hasActiveFilters: boolean
  hasSearchText: boolean
  onToggleFilters: () => void
  onClearAll: () => void
}

const FallacyFilterToggle: React.FC<FallacyFilterToggleProps> = ({
  showFilters,
  hasActiveFilters,
  hasSearchText,
  onToggleFilters,
  onClearAll
}) => {
  const { colors } = useSystemTheme()

  return (
    <View style={styles.filterToggleContainer}>
      <TouchableOpacity
        style={[styles.filterToggleButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={onToggleFilters}
      >
        <Ionicons name="options" size={20} color={colors.primary} />
        <Text style={[styles.filterToggleText, { color: colors.primary }]}>
          Filters {hasActiveFilters && '●'}
        </Text>
        <Ionicons 
          name={showFilters ? "chevron-up" : "chevron-down"} 
          size={16} 
          color={colors.primary} 
        />
      </TouchableOpacity>
      
      {(hasActiveFilters || hasSearchText) && (
        <TouchableOpacity
          style={[styles.clearButton, { backgroundColor: '#dd0000' }]}
          onPress={onClearAll}
        >
          <Text style={[styles.clearButtonText, { color: 'white' }]}>Clear All</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  filterToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: SHAPES.standardVerticalMargin / 3,
    gap: 12,
  },
  filterToggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: SHAPES.borderRadius,
    borderWidth: 1,
    gap: 8,
  },
  filterToggleText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: SHAPES.borderRadius,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
})

export default FallacyFilterToggle