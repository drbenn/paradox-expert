import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'

interface ParadoxSearchBarProps {
  searchText: string
  onSearchChange: (text: string) => void
  placeholder?: string
}

const ParadoxSearchBar: React.FC<ParadoxSearchBarProps> = ({
  searchText,
  onSearchChange,
  placeholder = "Search fallacies"
}) => {
  const { colors } = useSystemTheme()

  return (
    <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
      <TextInput
        style={[styles.searchInput, { color: colors.text }]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={searchText}
        onChangeText={onSearchChange}
        returnKeyType="search"
      />
      {searchText.length > 0 && (
        <TouchableOpacity onPress={() => onSearchChange('')}>
          <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: SHAPES.standardVerticalMargin,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: SHAPES.borderRadius,
    borderWidth: SHAPES.buttonBorderWidth,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
})

export default ParadoxSearchBar