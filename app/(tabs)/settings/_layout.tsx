import { useSystemTheme } from '@/hooks/useSystemTheme'
import { Stack } from 'expo-router'
import React from 'react'

export default function SettingsLayout() {
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
        name="about" 
        options={{
          animation: 'slide_from_right',
      }}/>
      <Stack.Screen
        name="tutorial"
        options={{
          animation: 'slide_from_right',
      }}/>
      <Stack.Screen
        name="notification-settings"
        options={{
          animation: 'slide_from_right',
      }}/>
      <Stack.Screen
        name="developer"
        options={{
          animation: 'slide_from_right',
      }}/>
    </Stack>
  )
}