
import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { Paradox } from '@/types/app.types'
import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import ParadoxListCard from './ParadoxListCard'

interface ParadoxResultsProps {
  filteredFallacies: Paradox[]
  displayedFallacies: Paradox[]
  isLoading: boolean
  fallaciesLoaded: boolean
  onParadoxPress: (paradox: Paradox) => void
  onLoadMore: () => void
}

const ParadoxResults: React.FC<ParadoxResultsProps> = ({
  filteredFallacies,
  displayedFallacies,
  isLoading,
  fallaciesLoaded,
  onParadoxPress,
  onLoadMore
}) => {
  const { colors } = useSystemTheme()

  // Loading state while paradoxes are loading
  if (!fallaciesLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading paradoxes...
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
            No paradoxes match your criteria! Try adjusting your filters.
          </Text>
        )}
      </View>

      {filteredFallacies.length > 0 && (
        <View style={styles.resultsListContainer}>
          {displayedFallacies.map((item) => (
            <View key={item.id}>
              <ParadoxListCard
                paradox={item}
                onPress={() => onParadoxPress(item)}
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

export default ParadoxResults
