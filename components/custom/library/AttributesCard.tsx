import { useSystemTheme } from '@/hooks/useSystemTheme'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Card from '../Card'
import FavoriteStarButton from './FavoriteStarButton'
import LearnedStarButton from './LearnedStarButton'

interface AttributesCardProps {
  id: string,
  difficulty: string,
  type: string,
  category: string,
  usage: string,
  subtlety: string,
  severity: string,
}

const AttributesCard = ({ 
  id,
  difficulty,
  type,
  category,
  usage,
  subtlety,
  severity,
}: AttributesCardProps) => {
  const { colors } = useSystemTheme()
  
  return (
    <Card>
      {/* 🏆 FLOATING ACTIONS - CHAMPIONSHIP BUTTON TEAM! */}
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

      {/* 📊 2 COLUMNS x 3 ROWS LAYOUT FOR PORTRAIT PERFECTION! */}
      <View style={styles.attributesGrid}>
        <View style={styles.gridColumn}>
          <View style={styles.attributeItem}>
            <Text style={[styles.attributeLabel, {color: colors.textSecondary}]}>
              Difficulty
            </Text>
            <Text style={[styles.attributeValue, {color: colors.text}]}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Text>
          </View>
          
          <View style={styles.attributeItem}>
            <Text style={[styles.attributeLabel, {color: colors.textSecondary}]}>
              Type
            </Text>
            <Text style={[styles.attributeValue, {color: colors.text}]}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </View>
          
          <View style={styles.attributeItem}>
            <Text style={[styles.attributeLabel, {color: colors.textSecondary}]}>
              Category
            </Text>
            <Text style={[styles.attributeValue, {color: colors.text}]}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.gridColumn}>
          <View style={styles.attributeItem}>
            <Text style={[styles.attributeLabel, {color: colors.textSecondary}]}>
              Usage
            </Text>
            <Text style={[styles.attributeValue, {color: colors.text}]}>
              {usage.charAt(0).toUpperCase() + usage.slice(1)}
            </Text>
          </View>
          
          <View style={styles.attributeItem}>
            <Text style={[styles.attributeLabel, {color: colors.textSecondary}]}>
              Subtlety
            </Text>
            <Text style={[styles.attributeValue, {color: colors.text}]}>
              {subtlety.charAt(0).toUpperCase() + subtlety.slice(1)}
            </Text>
          </View>
          
          <View style={styles.attributeItem}>
            <Text style={[styles.attributeLabel, {color: colors.textSecondary}]}>
              Severity
            </Text>
            <Text style={[styles.attributeValue, {color: colors.text}]}>
              {severity.charAt(0).toUpperCase() + severity.slice(1)}
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
  
  // 🏆 FLOATING ACTIONS CHAMPIONSHIP LAYOUT
  floatingActions: {
    position: 'absolute',
    top: -16,
    right: 16,
    flexDirection: 'row',
    gap: 16,
    zIndex: 10,
  },
  
  // 📊 2x3 GRID LAYOUT FOR PORTRAIT PERFECTION
  attributesGrid: {
    flexDirection: 'row',
    gap: 20,
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