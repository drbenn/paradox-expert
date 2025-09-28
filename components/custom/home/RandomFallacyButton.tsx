import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { useAppState } from '@/state/useAppState'
import { Text, TouchableOpacity, View } from 'react-native'

export default function RandomParadoxButton() {
  const { colors } = useSystemTheme()
  const navigateToRandomParadox = useAppState((state) => state.navigateToRandomParadox)

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: SHAPES.borderRadius,
        backgroundColor: colors.primary + 40,
        borderWidth: SHAPES.buttonBorderWidth,
        borderColor: colors.primary,
      }}
      onPress={() => navigateToRandomParadox('push')}
    >
      <View style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primary + '60',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
      }}>
        <Text style={{ fontSize: 24 }}>🎲</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 2 }}>
          Random Paradox
        </Text>
        <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textSecondary }}>
          Surprise me
        </Text>
      </View>
    </TouchableOpacity>
  )
}