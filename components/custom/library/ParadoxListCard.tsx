import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { Paradox } from '@/types/app.types'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface ParadoxCardProps {
  paradox: Paradox
  onPress: () => void
}

const ParadoxListCard: React.FC<ParadoxCardProps> = ({ paradox, onPress }) => {
  const { colors } = useSystemTheme()
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, {backgroundColor: colors.surface,borderColor: colors.border, shadowColor: colors.text}]}
      activeOpacity={0.7}
    >
      {/* Emoji | Image placeholder */}
      <View style={[styles.imageContainer, {backgroundColor: colors.background}]}>
        {paradox.emoji_shortcode ? (
          <>
          {/* <Image 
            // TODO: need to figure out how to import using string literal
            source={require('@/assets/images/full-thumb-test-img.jpg')}
            style={styles.thumbnailImage}
            resizeMode="cover"
          /> */}
          <Text style={styles.emoji}>
            { Number(paradox.id) > 160 ? paradox.emoji_unicode: paradox.emoji_literal }
          </Text>
          </>
        ) : (
          <Text style={styles.emoji}>🧠</Text>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title, {color: colors.text}]}>
          {paradox.id + '. ' + paradox.title}
        </Text>
        <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
          {paradox.subtitle || paradox.description}
        </Text>
      </View>

      {/* Arrow */}
      <View style={styles.arrowContainer}>
        <Ionicons name="chevron-forward" size={20} color={colors.primary} />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: SHAPES.borderRadius,
    marginBottom: 12,
    borderWidth: SHAPES.buttonBorderWidth,
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    // elevation: 2,
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: SHAPES.borderRadius,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailImage: {
    width: 64,
    height: 64,
    // resizeMode="cover" handles aspect ratio and clipping
  },
  emoji: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
  },
})

export default ParadoxListCard