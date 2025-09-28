import { useSystemTheme } from '@/hooks/useSystemTheme'
import { Stack } from 'expo-router'
import React from 'react'

export default function ProgressLayout() {
  const { colors } = useSystemTheme()

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        contentStyle: { backgroundColor: colors.background },
    }}>
      <Stack.Screen 
        name="index" 
      />
      <Stack.Screen 
        name="trophy-case-screen" 
        options={{
          animation: 'slide_from_right',
      }}/>
    </Stack>
  )
}