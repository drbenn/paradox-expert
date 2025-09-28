import { useSystemTheme } from '@/hooks/useSystemTheme'
import { Stack } from 'expo-router'

export default function LibraryLayout() {
  const { colors } = useSystemTheme()

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="index"
      />
      <Stack.Screen 
        name="paradox/[id]"
        options={{
          animation: 'fade',
      }}/>
    </Stack>
  )
}