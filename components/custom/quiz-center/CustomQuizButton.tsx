// 🏆 CUSTOM QUIZ BUTTON - Enhanced Championship Edition
// Tighter design to match the new Quiz Center layout

import Card from '@/components/custom/Card'
import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { RelativePathString, router } from 'expo-router'
import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

interface CustomQuizButtonProps {
  style?: any // Allow custom styling
}

const CustomQuizButton: React.FC<CustomQuizButtonProps> = ({ style }) => {
  const { colors } = useSystemTheme()

  const handlePress = () => {
    router.push('/(tabs)/quiz/custom-quiz-builder-screen' as RelativePathString)
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Card variant="tight" style={style}>
          <View style={styles.content}>
            <Text style={styles.emoji}>🎨</Text>
            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: colors.text }]}>
                Custom Quiz
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Create your own personalized quiz
              </Text>
            </View>
            {/* <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={styles.badgeText}>NEW</Text>
            </View> */}
          </View>
      </Card>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: SHAPES.borderRadius,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 0, // Card handles padding now
  },
  emoji: {
    fontSize: 28,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
})

export default CustomQuizButton