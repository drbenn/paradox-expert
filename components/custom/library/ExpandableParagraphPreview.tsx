import { useSystemTheme } from '@/hooks/useSystemTheme'
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'
import Card from '../Card'

interface ExpandableParagraphPreviewProps {
  title: string
  textParagraphs: string[]
  style?: ViewStyle
  previewParagraphs?: number // Number of paragraphs to show initially
}

const ExpandableParagraphPreview: React.FC<ExpandableParagraphPreviewProps> = ({
  title,
  textParagraphs,
  style,
  previewParagraphs = 1
}) => {
  const { colors } = useSystemTheme()
  
  const [expanded, setExpanded] = useState(false)
  const [contentHeight, setContentHeight] = useState(0)
  
  // Reanimated 3 shared values
  const animationProgress = useSharedValue(0)
  
  const hasMoreContent = textParagraphs.length > previewParagraphs

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
      
      {/* Always visible paragraphs - CHAMPIONSHIP PREVIEW! */}
      {textParagraphs.slice(0, previewParagraphs).map((paragraph, index) => (
        <View key={index} style={styles.paragraphContainer}>
          <Text style={[styles.paragraphText, {color: colors.text}]}>
            {paragraph}
          </Text>
        </View>
      ))}

      {/* Expandable content for additional paragraphs */}
      {hasMoreContent && (
        <>
          <Animated.View style={animatedContentStyle}>
            <View>
              {textParagraphs.slice(previewParagraphs).map((paragraph, index) => (
                <View key={index + previewParagraphs} style={styles.paragraphContainer}>
                  <Text style={[styles.paragraphText, {color: colors.text}]}>
                    {paragraph}
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Always present but hidden content for height measurement - MAGIC! */}
          <View style={styles.hiddenContent} onLayout={onContentLayout}>
            {textParagraphs.slice(previewParagraphs).map((paragraph, index) => (
              <View key={`measure-${index + previewParagraphs}`} style={styles.paragraphContainer}>
                <Text style={[styles.paragraphText, {color: colors.text}]}>
                  {paragraph}
                </Text>
              </View>
            ))}
          </View>

          {/* Show more/less button - CHAMPIONSHIP CONTROLS! */}
          <TouchableOpacity
            onPress={toggleExpanded}
            style={styles.expandButton}
            activeOpacity={0.7}
          >
            <Text style={[styles.expandButtonText, {color: colors.primary}]}>
              {expanded ? 'Show less' : `Show ${textParagraphs.length - previewParagraphs} more paragraph${textParagraphs.length - previewParagraphs === 1 ? '' : 's'}`}
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
    marginBottom: 16,
  },
  paragraphContainer: {
    marginBottom: 16,
  },
  paragraphText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'left',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    marginTop: 8,
    // borderTopWidth: 1,
    // borderTopColor: 'rgba(0,0,0,0.1)',
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

export default ExpandableParagraphPreview