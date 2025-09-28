import { useSystemTheme } from '@/hooks/useSystemTheme'
import { Stack } from 'expo-router'
import React from 'react'

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
        name="fallacy/[id]"
        options={{
          animation: 'fade',
      }}/>
    </Stack>
  )
}