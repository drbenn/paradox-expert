import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import React from 'react'
import { ImageBackground, ImageSourcePropType, StyleSheet, Text, View } from 'react-native'

interface FallacyHeaderWithImageProps {
  id: string,
  title: string
  subtitle: string,
  description: string,
  emoji_literal: string,
  backgroundColor: string,
  imagePath?: ImageSourcePropType  | null,
}

// 💪  EMOJI FALLBACK FUNCTION!
const getEmojiWithFallback = (emoji: string, fallback: string = '🧠'): string => {
  // Check if emoji exists and isn't just a placeholder
  if (!emoji || emoji.trim() === '' || emoji === '?' || emoji === '□' || emoji.length === 0) {
    return fallback
  }
  
  // Check for common emoji failure patterns
  const failurePatterns = ['�', '□', '?', ' ', 'undefined', 'null']
  if (failurePatterns.some(pattern => emoji.includes(pattern))) {
    return fallback
  }
  
  // Check if emoji is just whitespace or special characters
  if (emoji.trim().length === 0 || /^[\s\u0000-\u001F\u007F-\u009F]*$/.test(emoji)) {
    return fallback
  }
  
  return emoji
}

const FallacyHeaderWithImage = ({ 
  id,
  title,
  subtitle,
  description,
  emoji_literal,
  backgroundColor,
  imagePath = null, // Pass image path to use image instead of icon
}: FallacyHeaderWithImageProps) => {
    const { colors } = useSystemTheme()
    
    // 🧠 GET EMOJI WITH BRAIN FALLBACK!
    const displayEmoji = getEmojiWithFallback(emoji_literal, '🧠')
    
    const cardContent = (
    <>
      
      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, {backgroundColor: colors.textSecondary}]}>
            <Text style={styles.emoji}>{displayEmoji}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, {color: colors.text}]}>{id + '. ' + title}</Text>
            <Text style={[styles.subtitle, {color: colors.textSecondary}]}>{subtitle}</Text>
          </View>
        </View>
        <Text style={[styles.description, {color: colors.text}]}>{description}</Text>
      </View>
    </>
  )

  if (imagePath) {
    return (
      <ImageBackground 
        source={ imagePath } 
        style={styles.card}
        imageStyle={styles.backgroundImage}
        blurRadius={2}
      >
        {cardContent}
      </ImageBackground>
    )
  }

  return (
    <View style={[styles.card, { backgroundColor }]}>
      {cardContent}
    </View>
  )
  
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  card: {
    // borderRadius: SHAPES.borderRadius,
    // marginVertical: 16,
    minHeight: 160,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.3,
    // shadowRadius: 8,
    // elevation: 8,
    // overflow: 'hidden', // Ensures background image stays within rounded corners
  },
  backgroundImage: {
    borderRadius: SHAPES.borderRadius,
    filter: 'contrast(60%), sepia(20%)'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    padding: 8,
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emoji: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    // textShadowColor: 'rgba(0, 0, 0, 0.5)',
    // textShadowOffset: { width: 1, height: 1 },
    // textShadowRadius: 1,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    // textShadowColor: 'rgba(0, 0, 0, 0.5)',
    // textShadowOffset: { width: 1, height: 1 },
    // textShadowRadius: 2,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    // textShadowColor: 'rgba(0, 0, 0, 0.5)',
    // textShadowOffset: { width: 1, height: 1 },
    // textShadowRadius: 2,
  },
})

export default FallacyHeaderWithImage