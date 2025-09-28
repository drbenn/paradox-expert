
import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { Fallacy } from '@/types/app.types'
import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import FallacyListCard from './FallacyListCard'

interface FallacyResultsProps {
  filteredFallacies: Fallacy[]
  displayedFallacies: Fallacy[]
  isLoading: boolean
  fallaciesLoaded: boolean
  onFallacyPress: (fallacy: Fallacy) => void
  onLoadMore: () => void
}

const FallacyResults: React.FC<FallacyResultsProps> = ({
  filteredFallacies,
  displayedFallacies,
  isLoading,
  fallaciesLoaded,
  onFallacyPress,
  onLoadMore
}) => {
  const { colors } = useSystemTheme()

  // Loading state while fallacies are loading
  if (!fallaciesLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading fallacies...
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.resultsContainer}>
      <View style={styles.resultsHeader}>
        <Text style={[styles.resultsTitle, { color: colors.text }]}>
          {filteredFallacies.length} Fallac{filteredFallacies.length === 1 ? 'y' : 'ies'} Found
        </Text>
        {filteredFallacies.length === 0 && (
          <Text style={[styles.noResultsText, { color: colors.textSecondary }]}>
            No fallacies match your criteria! Try adjusting your filters.
          </Text>
        )}
      </View>

      {filteredFallacies.length > 0 && (
        <View style={styles.resultsListContainer}>
          {displayedFallacies.map((item) => (
            <View key={item.id}>
              <FallacyListCard
                fallacy={item}
                onPress={() => onFallacyPress(item)}
              />
            </View>
          ))}
          
          {/* Load More Button or Loading State */}
          {displayedFallacies.length < filteredFallacies.length && (
            <TouchableOpacity
              style={[styles.loadMoreButton, { backgroundColor: colors.primary, borderColor: colors.primary }]}
              onPress={onLoadMore}
              disabled={isLoading}
            >
              <Text style={[styles.loadMoreText, { color: 'white' }]}>
                {isLoading ? 'Loading more' : `Load More (${filteredFallacies.length - displayedFallacies.length} remaining)`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  resultsContainer: {
    marginTop: SHAPES.standardVerticalMargin,
    // paddingHorizontal: SHAPES.standardBodyHorizontalMargin,
  },
  resultsHeader: {
    marginBottom: SHAPES.standardVerticalMargin,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  noResultsText: {
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  resultsListContainer: {
    gap: 0,
  },
  loadMoreButton: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: SHAPES.borderRadius,
    borderWidth: 1,
    alignItems: 'center',
  },
  loadMoreText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
})

export default FallacyResults
