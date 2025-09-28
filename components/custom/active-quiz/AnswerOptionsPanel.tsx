import SHAPES from '@/constants/Shapes'
import { QuizQuestion } from '@/types/quiz.types'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface ActiveQuizAnswerOptionsPanelProps {
  question: QuizQuestion
  selectedAnswer: string | null
  isAnswered: boolean
  onAnswerSelect: (optionId: string) => void
  colors: {
    text: string
    textSecondary: string
    border: string
    surface: string
    primary: string
  }
}

export default function ActiveQuizAnswerOptionsPanel({
  question,
  selectedAnswer,
  isAnswered,
  onAnswerSelect,
  colors
}: ActiveQuizAnswerOptionsPanelProps) {
  const successColor = '#10b981'
  const errorColor = '#ef4444'

  return (
    <>
      {/* Section Header */}
      <View style={styles.cardHeader}>
        <Text style={[styles.cardHeaderText, { color: colors.text }]}>
          SELECT YOUR ANSWER
        </Text>
      </View>
      
      {/* Answer Options */}
      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option.id
          const isCorrect = option.id === question.correctAnswer
          const showResult = isAnswered
          
          let optionBorderColor: string = colors.border
          let optionBackgroundColor = colors.surface
          
          if (showResult) {
            if (isCorrect) {
              optionBorderColor = successColor
              optionBackgroundColor = successColor + '10'
            } else if (isSelected && !isCorrect) {
              optionBorderColor = errorColor
              optionBackgroundColor = errorColor + '10'
            }
          } else if (isSelected) {
            optionBorderColor = colors.primary
            optionBackgroundColor = colors.primary + '10'
          }

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.option,
                {
                  backgroundColor: optionBackgroundColor,
                  borderColor: optionBorderColor,
                  borderWidth: SHAPES.cardBorderWidth
                }
              ]}
              onPress={() => onAnswerSelect(option.id)}
              disabled={isAnswered}
            >
              <View style={styles.optionContent}>
                <View style={[
                  styles.radioButton,
                  {
                    borderColor: isSelected ? colors.primary : colors.border,
                    backgroundColor: isSelected ? colors.primary : 'transparent'
                  }
                ]}>
                  {isSelected && <View style={styles.radioButtonInner} />}
                </View>
                
                <Text style={[
                  styles.optionText,
                  { 
                    color: colors.text,
                    flex: 1
                  }
                ]}>
                  {option.text}
                </Text>
                
                {showResult && isCorrect && (
                  <Text style={[styles.resultIcon, { color: successColor }]}>
                    ✓
                  </Text>
                )}
                {showResult && isSelected && !isCorrect && (
                  <Text style={[styles.resultIcon, { color: errorColor }]}>
                    ✗
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  cardHeader: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'left',
    marginHorizontal: 5
  },
  optionsContainer: {
    gap: 16,
  },
  option: {
    borderRadius: SHAPES.borderRadius,
    padding: 18,
    borderWidth: SHAPES.buttonBorderWidth,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: SHAPES.buttonBorderWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    flex: 1,
  },
  resultIcon: {
    fontSize: 18,
    fontWeight: '800',
  },
})