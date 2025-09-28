import { useSystemTheme } from '@/hooks/useSystemTheme'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Card from '../Card'
import FavoriteStarButton from './FavoriteStarButton'
import LearnedStarButton from './LearnedStarButton'

interface AttributesCardProps {
  id: string
  difficulty: string
  type: string
  category: string
  domain: string
  presentation: string
  mindBlowFactor: string
  resolutionDifficulty: string
  prerequisites: string
}

const AttributesCard = ({ 
  id,
  difficulty,
  type,
  category,
  domain,
  presentation,
  mindBlowFactor,
  resolutionDifficulty,
  prerequisites,
}: AttributesCardProps) => {
  const { colors } = useSystemTheme()

  // Helper function to format attribute values for display
  const formatAttributeValue = (value: string) => {
    return value
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  
  return (
    <Card>
      {/* Floating Actions */}
      <View style={styles.floatingActions}>
        <FavoriteStarButton
          paradoxId={id}
        />
        <LearnedStarButton
          paradoxId={id}
        />
      </View>

      <Text style={[styles.title, {color: colors.primary}]}>
        Attributes
      </Text>

      {/* 3 Columns x 3 Rows Layout for Paradox Attributes */}
      <View style={styles.attributesGrid}>
        <View style={styles.gridColumn}>
          <View style={styles.attributeItem}>
            <Text style={[styles.attributeLabel, {color: colors.textSecondary}]}>
              Difficulty
            </Text>
            <Text style={[styles.attributeValue, {color: colors.text}]}>
              {formatAttributeValue(difficulty)}
            </Text>
          </View>
          
          <View style={styles.attributeItem}>
            <Text style={[styles.attributeLabel, {color: colors.textSecondary}]}>
              Domain
            </Text>
            <Text style={[styles.attributeValue, {color: colors.text}]}>
              {formatAttributeValue(domain)}
            </Text>
          </View>
          
          <View style={styles.attributeItem}>
            <Text style={[styles.attributeLabel, {color: colors.textSecondary}]}>
              Prerequisites
            </Text>
            <Text style={[styles.attributeValue, {color: colors.text}]}>
              {formatAttributeValue(prerequisites)}
            </Text>
          </View>
        </View>

        <View style={styles.gridColumn}>
          <View style={styles.attributeItem}>
            <Text style={[styles.attributeLabel, {color: colors.textSecondary}]}>
              Type
            </Text>
            <Text style={[styles.attributeValue, {color: colors.text}]}>
              {formatAttributeValue(type)}
            </Text>
          </View>
          
          <View style={styles.attributeItem}>
            <Text style={[styles.attributeLabel, {color: colors.textSecondary}]}>
              Presentation
            </Text>
            <Text style={[styles.attributeValue, {color: colors.text}]}>
              {formatAttributeValue(presentation)}
            </Text>
          </View>
          
          <View style={styles.attributeItem}>
            <Text style={[styles.attributeLabel, {color: colors.textSecondary}]}>
              Mind Blow Factor
            </Text>
            <Text style={[styles.attributeValue, {color: colors.text}]}>
              {formatAttributeValue(mindBlowFactor)}
            </Text>
          </View>
        </View>

        <View style={styles.gridColumn}>
          <View style={styles.attributeItem}>
            <Text style={[styles.attributeLabel, {color: colors.textSecondary}]}>
              Category
            </Text>
            <Text style={[styles.attributeValue, {color: colors.text}]}>
              {formatAttributeValue(category)}
            </Text>
          </View>
          
          <View style={styles.attributeItem}>
            <Text style={[styles.attributeLabel, {color: colors.textSecondary}]}>
              Resolution
            </Text>
            <Text style={[styles.attributeValue, {color: colors.text}]}>
              {formatAttributeValue(resolutionDifficulty)}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  
  // Floating Actions Layout
  floatingActions: {
    position: 'absolute',
    top: -16,
    right: 16,
    flexDirection: 'row',
    gap: 16,
    zIndex: 10,
  },
  
  // 3-Column Grid Layout for Paradox Attributes
  attributesGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  
  gridColumn: {
    flex: 1,
  },
  
  attributeItem: {
    marginBottom: 16,
  },
  
  attributeLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  attributeValue: {
    fontSize: 14,
    fontWeight: '600',
  },
})

export default AttributesCard