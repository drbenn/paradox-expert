import { useSystemTheme } from '@/hooks/useSystemTheme'
import { useFocusEffect } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'
import Animated, {
    FadeIn,
    FadeOut,
    SlideInRight,
    SlideInUp,
    SlideOutDown,
    SlideOutLeft,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated'

// =================================================================
// 🏆 : AnimatedTabWrapper Component
// =================================================================

interface AnimatedTabWrapperProps {
  children: React.ReactNode
  animationType?: 'fade' | 'slide' | 'scale' | 'slideUp' | 'none'
  duration?: number
  style?: any
}

function AnimatedTabWrapper({ 
  children, 
  animationType = 'fade',
  duration = 300,
  style
}: AnimatedTabWrapperProps) {
  const opacity = useSharedValue(1) // Start visible
  const scale = useSharedValue(1)
  const translateY = useSharedValue(0)

  // 🌟 MACHO MAN: Animate EVERY time tab comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Start from slightly faded/scaled down
      opacity.value = 0.6
      scale.value = 0.97
      translateY.value = 10
      
      // Animate to full visibility
      opacity.value = withTiming(1, { duration })
      scale.value = withSpring(1, { 
        damping: 15, 
        stiffness: 150,
        mass: 1 
      })
      translateY.value = withSpring(0, { 
        damping: 15, 
        stiffness: 150 
      })
      
      return () => {
        // Optional: fade out when leaving (subtle)
        opacity.value = withTiming(0.9, { duration: 100 })
      }
    }, [duration, opacity, scale, translateY]) // Include values in dependency
  )

  // 🏆 : Create animated styles based on animation type
  const animatedStyle = useAnimatedStyle(() => {
    switch (animationType) {
      case 'fade':
        return {
          opacity: opacity.value,
        }
      
      case 'scale':
        return {
          opacity: opacity.value,
          transform: [{ scale: scale.value }],
        }
      
      case 'slide':
        return {
          opacity: opacity.value,
          transform: [{ translateY: translateY.value }],
        }
      
      case 'slideUp':
        return {
          opacity: opacity.value,
          transform: [{ translateY: translateY.value }],
        }
      
      case 'none':
        return {}
      
      default:
        return {
          opacity: opacity.value,
        }
    }
  })

  // 🎯 RICK RUDE STYLE: Get entrance/exit animations
  const getEnterAnimation = () => {
    switch (animationType) {
      case 'slide':
        return SlideInRight.duration(duration).springify()
      case 'slideUp':
        return SlideInUp.duration(duration).springify()
      case 'scale':
        return FadeIn.duration(duration).withInitialValues({ 
          transform: [{ scale: 0.9 }] 
        })
      case 'fade':
        return FadeIn.duration(duration)
      case 'none':
        return undefined
      default:
        return FadeIn.duration(duration)
    }
  }

  const getExitAnimation = () => {
    switch (animationType) {
      case 'slide':
        return SlideOutLeft.duration(duration / 2)
      case 'slideUp':
        return SlideOutDown.duration(duration / 2)
      case 'scale':
        return FadeOut.duration(duration / 2)
      case 'fade':
        return FadeOut.duration(duration / 2)
      case 'none':
        return undefined
      default:
        return FadeOut.duration(duration / 2)
    }
  }

  // 🚀 MEGA POWERS: Render with or without animations
  if (animationType === 'none') {
    return (
      <View style={[{ flex: 1 }, style]}>
        {children}
      </View>
    )
  }

  return (
    <Animated.View
      style={[
        { flex: 1 },
        animatedStyle,
        style
      ]}
      // 🚨 : Remove entering/exiting - they only work once
      // entering={getEnterAnimation()}
      // exiting={getExitAnimation()}
    >
      {children}
    </Animated.View>
  )
}

// =================================================================
// 🌟 PRESET ANIMATION CONFIGURATIONS
// =================================================================

export const TabAnimationPresets = {
  // 🏆 Venice Beach Fade (Recommended!)
  veniceBeachFade: {
    animationType: 'fade' as const,
    duration: 300,
  },

  // ✨ Smooth Scale
  smoothScale: {
    animationType: 'scale' as const,
    duration: 350,
  },

  // 🎯 Gentle Slide
  gentleSlide: {
    animationType: 'slide' as const,
    duration: 250,
  },

  // 🚀 Slide Up
  slideUp: {
    animationType: 'slideUp' as const,
    duration: 300,
  },

  // 💨 Quick Fade
  quickFade: {
    animationType: 'fade' as const,
    duration: 200,
  },

  // 🎭 Dramatic Scale
  dramaticScale: {
    animationType: 'scale' as const,
    duration: 500,
  },

  // 🔇 No Animation
  none: {
    animationType: 'none' as const,
    duration: 0,
  },
}

// =================================================================
// 🎮 USAGE EXAMPLES
// =================================================================

// // Example 1: Basic usage with fade animation
// export function HomeTabScreen() {
//   return (
//     <AnimatedTabWrapper animationType="fade">
//       <View style={{ flex: 1, padding: 20 }}>
//         <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
//           Home Content
//         </Text>
//         <Text style={{ marginTop: 16, color: '#666' }}>
//           This screen fades in smoothly when the tab is selected!
//         </Text>
//       </View>
//     </AnimatedTabWrapper>
//   )
// }

// // Example 2: Using preset configuration
// export function QuizTabScreen() {
//   return (
//     <AnimatedTabWrapper {...TabAnimationPresets.veniceBeachFade}>
//       <ScrollView style={{ flex: 1 }}>
//         <Text style={{ fontSize: 24, fontWeight: 'bold', margin: 20 }}>
//           Quiz Center
//         </Text>
//         {/* Your quiz content */}
//       </ScrollView>
//     </AnimatedTabWrapper>
//   )
// }

// // Example 3: Custom animation with style
// export function ProfileTabScreen() {
//   return (
//     <AnimatedTabWrapper 
//       animationType="scale"
//       duration={400}
//       style={{ backgroundColor: '#f5f5f5' }}
//     >
//       <SafeAreaView style={{ flex: 1 }}>
//         <Text style={{ fontSize: 24, fontWeight: 'bold', margin: 20 }}>
//           Profile
//         </Text>
//         {/* Your profile content */}
//       </SafeAreaView>
//     </AnimatedTabWrapper>
//   )
// }


// =================================================================
// 🎨 ADVANCED: THEME-AWARE ANIMATIONS
// =================================================================

interface ThemeAwareTabWrapperProps {
  children: React.ReactNode
  lightAnimation?: 'fade' | 'slide' | 'scale' | 'slideUp'
  darkAnimation?: 'fade' | 'slide' | 'scale' | 'slideUp'
  duration?: number
}

export function ThemeAwareTabWrapper({
  children,
  lightAnimation = 'fade',
  darkAnimation = 'fade',
  duration = 300
}: ThemeAwareTabWrapperProps) {
  const { isDarkMode } = useSystemTheme()
  
  return (
    <AnimatedTabWrapper
      animationType={isDarkMode ? darkAnimation : lightAnimation}
      duration={duration}
    >
      {children}
    </AnimatedTabWrapper>
  )
}

// =================================================================
// 🔧 PERFORMANCE OPTIMIZED VERSION
// =================================================================

// For apps with heavy content, use this optimized version:
export const OptimizedAnimatedTabWrapper = React.memo(function OptimizedAnimatedTabWrapper({
  children,
  animationType = 'fade',
  duration = 300,
  style
}: AnimatedTabWrapperProps) {
  const opacity = useSharedValue(0)

  useFocusEffect(
    React.useCallback(() => {
      opacity.value = withTiming(1, { duration })
      
      return () => {
        opacity.value = withTiming(0.8, { duration: duration / 2 })
      }
    }, [duration])
  )

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }), [])

  if (animationType === 'none') {
    return <View style={[{ flex: 1 }, style]}>{children}</View>
  }

  return (
    <Animated.View
      style={[{ flex: 1 }, animatedStyle, style]}
      entering={FadeIn.duration(duration)}
      exiting={FadeOut.duration(duration / 2)}
    >
      {children}
    </Animated.View>
  )
})

// =================================================================
// 🏆 MEGA POWERS RECOMMENDATIONS
// =================================================================

/*
CHAMPIONSHIP USAGE RECOMMENDATIONS:

🥇 FOR MOST APPS (Recommended):
<AnimatedTabWrapper {...TabAnimationPresets.veniceBeachFade}>

🥈 FOR CONTENT-HEAVY TABS:
<OptimizedAnimatedTabWrapper animationType="fade">

🥉 FOR SPECIAL SCREENS:
<AnimatedTabWrapper animationType="scale" duration={400}>

🚫 FOR PERFORMANCE-CRITICAL TABS:
<AnimatedTabWrapper animationType="none">

 PRINCIPLES:
- Keep animations subtle (200-350ms duration)
- Use fade for most cases
- Scale for special moments
- None for heavy content tabs
- Test on slower devices

MACHO MAN SAYS: "The best animations enhance the experience 
without calling attention to themselves! DIG IT!" 🎵
*/

export default AnimatedTabWrapper