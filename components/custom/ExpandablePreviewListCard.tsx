import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'
import Card from './Card'

interface ExplandablePreviewListCardProps {
  title: string
  items: string[]
  style?: ViewStyle
  previewCount?: number // Number of items to show initially
}

const ExpandablePreviewListCard: React.FC<ExplandablePreviewListCardProps> = ({
  title,
  items,
  style,
  previewCount = 2
}) => {
  const { colors } = useSystemTheme()
  
  const [expanded, setExpanded] = useState(false)
  const [contentHeight, setContentHeight] = useState(0)
  const [shuffledItems, setShuffledItems] = useState<string[]>([])
  
  // Reanimated 3 shared value
  const animationProgress = useSharedValue(0)

  const hasMoreItems = items.length > previewCount

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array: string[]) => {
    // Create a shallow copy to avoid mutating the original array
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements
    }
    return newArray;
  };

  useEffect(() => {
    // Shuffle the array when the component mounts
    setShuffledItems(shuffleArray(items));
  }, [items]); // Empty dependency array ensures this runs only once on mount

  const toggleExpanded = () => {
    const newExpandedState = !expanded
    
    // Update the animation
    animationProgress.value = withTiming(newExpandedState ? 1 : 0, {
      duration: 300,
    })
    
    // Update the state
    setExpanded(newExpandedState)
  }

  const onContentLayout = (event: any) => {
    const { height } = event.nativeEvent.layout
    if (height > 0 && contentHeight === 0) {
      setContentHeight(height)
    }
  }

  // Animated styles using Reanimated 3
  const animatedContentStyle = useAnimatedStyle(() => {
    const height = interpolate(
      animationProgress.value,
      [0, 1],
      [0, contentHeight]
    )
    
    return {
      height: height,
      overflow: 'hidden' as const,
    }
  })

  const animatedArrowStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      animationProgress.value,
      [0, 1],
      [0, 180]
    )
    
    return {
      transform: [{ rotate: `${rotation}deg` }],
    }
  })

  return (
    <Card style={style}>
      <Text style={[styles.title, {color: colors.primary}]}>
        {title}
      </Text>
      
      {/* Always visible items */}
      {items.slice(0, previewCount).map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <Text style={[styles.itemText, {color: colors.textSecondary}]}>
            • &nbsp; {item}
          </Text>
        </View>
      ))}

      {/* Expandable content for additional items */}
      {hasMoreItems && (
        <>
          <Animated.View style={animatedContentStyle}>
            <View>
              {items.slice(previewCount).map((item, index) => (
                <View key={index + previewCount} style={styles.itemContainer}>
                  <Text style={[styles.itemText, {color: colors.textSecondary}]}>
                    • &nbsp; {item}
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Always present but hidden content for height measurement */}
          <View style={styles.hiddenContent} onLayout={onContentLayout}>
            {items.slice(previewCount).map((item, index) => (
              <View key={`measure-${index + previewCount}`} style={styles.itemContainer}>
                <Text style={[styles.itemText, {color: colors.textSecondary}]}>
                  • {item}
                </Text>
              </View>
            ))}
          </View>

          {/* Show more/less button */}
          <TouchableOpacity
            onPress={toggleExpanded}
            style={styles.expandButton}
            activeOpacity={0.7}
          >
            <Text style={[styles.expandButtonText, {color: colors.primary}]}>
              {expanded ? 'Show less' : `Show ${items.length - previewCount} more`}
            </Text>
            <Animated.Text
              style={[
                styles.arrow,
                { color: colors.primary },
                animatedArrowStyle
              ]}
            >
              ▼
            </Animated.Text>
          </TouchableOpacity>
        </>
      )}
    </Card>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 0,
  },
  itemContainer: {
    marginTop: SHAPES.standardVerticalMargin,
  },
  itemText: {
    fontSize: 16,
    lineHeight: 22,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    marginTop: 8,
  },
  expandButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 6,
  },
  arrow: {
    fontSize: 14,
  },
  hiddenContent: {
    position: 'absolute',
    opacity: 0,
    zIndex: -1,
  },
})

export default ExpandablePreviewListCard