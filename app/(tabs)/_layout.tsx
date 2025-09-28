import { useSystemTheme } from '@/hooks/useSystemTheme'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { Tabs } from 'expo-router'
import React from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'

export default function TabLayout() {
  const { colors, colorScheme } = useSystemTheme()
  
  // Calculate tab bar height accounting for AdBanner
  // AdBanner is typically ~50px + safe area bottom
  // const adBannerHeight = 50 + Math.max(insets.bottom, 10)
  // const tabBarHeight = Platform.OS === 'ios' ? 90 : 70
  const tabBarHeight = Platform.OS === 'ios' ? 90 : 60

  return (
    // <OnboardingProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            // bottom: adBannerHeight, // Position above the AdBanner
            left: 0,
            right: 0,
            backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.background,
            borderTopWidth: 0.9,
            borderTopColor: colors.border,
            height: tabBarHeight,
            paddingBottom: Platform.OS === 'ios' ? 25 : 10,
            paddingTop: 8,
            elevation: 8,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
          },
          tabBarBackground: () => (
            Platform.OS === 'ios' ? (
              <BlurView
                intensity={95}
                style={StyleSheet.absoluteFillObject}
                tint={colorScheme === 'dark' ? 'dark' : 'light'}
              />
            ) : (
              <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.background }]} />
            )
          ),
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            marginTop: 4,
          },
          tabBarIconStyle: {
            marginTop: 2,
          },
        }}
        // 🏆 : TAB RESET NAVIGATION - CHAMPIONSHIP EDITION!
        screenListeners={({ route, navigation }) => ({
          tabPress: (e) => {
            // 🚨 CHAMPIONSHIP: Reset stack to index screen for all tabs except quiz
            const tabsToReset = ['index', 'library', 'progress', 'settings']
            
            if (tabsToReset.includes(route.name)) {
              // Prevent default behavior
              e.preventDefault()
              
              // Reset the stack to the first screen of this tab
              navigation.reset({
                index: 0,
                routes: [{ name: route.name }]
              })
            }
            // Let quiz tab maintain its stack for better UX during active quizzes
          }
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: '',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                icon={
                  <Ionicons 
                    name={focused ? "home" : "home-outline"}
                    size={24} 
                    color={color}
                  />
                }
                emoji="🏠" 
                color={color} 
                focused={focused}
                colors={colors}
                title='Home'
              />
            ),
          }}
        />
      <Tabs.Screen
        name="library"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={
                <Ionicons 
                  name={focused ? "library" : "library-outline"}
                  size={24} 
                  color={color}
                />
              }
              emoji="📚" 
              color={color}
              focused={focused}
              colors={colors}
              title='Library'
            />
          ),
        }}
      />
        <Tabs.Screen
          name="quiz"
          options={{
            title: '',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                icon={
                  <Ionicons 
                    name={focused ? "help-circle" : "help-circle-outline"}
                    size={24} 
                    color={color}
                  />
                }
                emoji="📝" 
                color={color} 
                focused={focused}
                colors={colors}
                title='Quiz'
              />
            ),
          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            title: '',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                icon={
                  <Ionicons 
                    name={focused ? "bar-chart" : "bar-chart-outline"}
                    size={24} 
                    color={color}
                  />
                }
                emoji="📊" 
                color={color} 
                focused={focused}
                colors={colors}
                title='Progress'
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: '',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                icon={
                  <Ionicons 
                    name={focused ? "settings" : "settings-outline"}
                    size={24} 
                    color={color}
                  />
                }
                emoji="⚙️" 
                color={color} 
                focused={focused}
                colors={colors}
                title='Settings'
              />
            ),
          }}
        />
      </Tabs>
    // </OnboardingProvider>
  )
}

interface TabIconProps {
  emoji?: string
  icon?: React.ReactNode
  color: string
  focused: boolean
  colors: any
  title?: string,
  colorScheme?: 'light' | 'dark'
}

function TabIcon({ emoji, icon, color, focused, colors, title, colorScheme }: TabIconProps) {
  return (
    <View style={[
      styles.iconContainer,
      focused && { 
        // backgroundColor: 'rgba(255, 107, 157, 0.15)',
        // backgroundColor: colorScheme === 'dark' ? '#ff6b9d3a' : '#6365f13a',
        // backgroundColor: colorScheme === 'dark' ? '#61616183' : '#a3a3a383',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        // elevation: 4,
      }
    ]}>
      <Text 
        style={[
          styles.iconEmoji,
          { 
            fontSize: focused ? 24 : 22,
            // textShadowColor: focused ? colors.primary : 'transparent',
            // textShadowOffset: { width: 0, height: 0 },
            // textShadowRadius: focused ? 18 : 0,
          }
        ]}
      >
        {icon ? (
          <Text>{icon}</Text>
        ) : emoji ? (
          <Text>{emoji}</Text>
        ) : null}
      </Text>
      <Text 
        style={[
          styles.iconEmoji,
          { 
            fontSize: focused ? 11 : 11,
            fontWeight: focused ? 500 : 400,
            color: focused ? colors.primary : colors.textSecondary,
            marginTop: 0
          }
        ]}
      >
        {title}      
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 54,
    height: 58,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    textAlign: 'center',
  },
})