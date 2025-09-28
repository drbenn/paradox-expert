import { useRef } from "react"
import { Animated, Dimensions, PanResponder } from "react-native"

const { width: screenWidth } = Dimensions.get('window')

// Custom hook for swipe logic (if you want even more control)
export default function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  swipeThreshold = 0.25,
  disabled = false
}: {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  swipeThreshold?: number
  disabled?: boolean
}) {
  const swipeAnimation = useRef(new Animated.Value(0)).current
  const isSwipingRef = useRef(false)
  
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (disabled) return false
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 20
      },
      onPanResponderGrant: () => {
        isSwipingRef.current = true
      },
      onPanResponderMove: (evt, gestureState) => {
        const progress = Math.max(-1, Math.min(1, gestureState.dx / (screenWidth * 0.4)))
        swipeAnimation.setValue(progress)
      },
      onPanResponderRelease: (evt, gestureState) => {
        const threshold = screenWidth * swipeThreshold
        
        if (gestureState.dx > threshold && onSwipeRight) {
          onSwipeRight()
        } else if (gestureState.dx < -threshold && onSwipeLeft) {
          onSwipeLeft()
        }
        
        Animated.spring(swipeAnimation, {
          toValue: 0,
          useNativeDriver: true,
        }).start()
        
        isSwipingRef.current = false
      },
    })
  ).current

  return {
    panHandlers: panResponder.panHandlers,
    swipeAnimation,
    isSwipingRef
  }
}


// 🔧 useSwipeGesture HOOK (Advanced/Minimal):
// - ✅ Just the gesture logic, no UI assumptions
// - ✅ You control EVERYTHING about the visual feedback
// - ✅ Lighter weight - no built-in animations
// - ✅ Perfect for custom implementations
// - ✅ Better for performance-critical scenarios
// - ❌ More work to implement visual feedback
// - ❌ You have to build your own animations

// MACHO MAN SAYS: "Advanced doesn't always mean more code - 
// sometimes it means more CONTROL! DIG IT!" 🎵
// */

// import React, { useRef } from 'react'
// import { View, Text, Animated, ScrollView } from 'react-native'


// // =================================================================
// // 🎯 WHEN TO USE THE HOOK (Advanced Control Examples)
// // =================================================================

// // Example 1: Custom visual feedback that doesn't match the default
// export function CustomSwipeFeedback() {
//   const { panHandlers, swipeAnimation, isSwipingRef } = useSwipeGesture({
//     onSwipeLeft: () => // logger.log('Custom left action'),
//     onSwipeRight: () => // logger.log('Custom right action'),
//     swipeThreshold: 0.2,
//   })

//   return (
//     <Animated.View
//       style={{
//         flex: 1,
//         // 🔥 : Your own custom transform logic
//         transform: [{
//           scale: swipeAnimation.interpolate({
//             inputRange: [-1, 0, 1],
//             outputRange: [0.95, 1, 0.95], // Scale instead of translate
//           })
//         }],
//         // 🎨 MACHO MAN: Your own color feedback
//         backgroundColor: swipeAnimation.interpolate({
//           inputRange: [-1, 0, 1],
//           outputRange: ['rgba(255,0,0,0.1)', 'transparent', 'rgba(0,255,0,0.1)'],
//         })
//       }}
//       {...panHandlers}
//     >
//       <Text>Custom swipe feedback with scaling and color!</Text>
//     </Animated.View>
//   )
// }

// // Example 2: Multiple swipe zones in one screen
// export function MultipleSwipeZones() {
//   const topSwipe = useSwipeGesture({
//     onSwipeLeft: () => // logger.log('Top area swiped left'),
//     onSwipeRight: () => // logger.log('Top area swiped right'),
//   })

//   const bottomSwipe = useSwipeGesture({
//     onSwipeLeft: () => // logger.log('Bottom area swiped left'),
//     onSwipeRight: () => // logger.log('Bottom area swiped right'),
//     swipeThreshold: 0.15, // Different threshold
//   })

//   return (
//     <View style={{ flex: 1 }}>
//       {/* Top swipe zone */}
//       <Animated.View
//         style={[
//           { flex: 1, backgroundColor: 'lightblue' },
//           { transform: [{ translateX: topSwipe.swipeAnimation }] }
//         ]}
//         {...topSwipe.panHandlers}
//       >
//         <Text>Top Swipe Zone</Text>
//       </Animated.View>

//       {/* Bottom swipe zone */}
//       <Animated.View
//         style={[
//           { flex: 1, backgroundColor: 'lightgreen' },
//           { transform: [{ translateX: bottomSwipe.swipeAnimation }] }
//         ]}
//         {...bottomSwipe.panHandlers}
//       >
//         <Text>Bottom Swipe Zone</Text>
//       </Animated.View>
//     </View>
//   )
// }