import SHAPES from '@/constants/Shapes'
import React from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface ActiveQuizActionButtonProps {
  isAnswered: boolean
  selectedAnswer: string | null
  isLastQuestion: boolean
  isSubmitting?: boolean
  onSubmitAnswer: () => void
  onNext: () => void
  colors: {
    primary: string
    border: string
    textSecondary: string
  }
}

export default function ActiveQuizActionButton({
  isAnswered,
  selectedAnswer,
  isLastQuestion,
  isSubmitting = false,
  onSubmitAnswer,
  onNext,
  colors,
}: ActiveQuizActionButtonProps) {

  return (
    <View style={[styles.container]}>
      {!isAnswered ? (
        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: selectedAnswer ? colors.primary : colors.border,
              opacity: selectedAnswer ? 1 : 0.5
            }
          ]}
          onPress={onSubmitAnswer}
          disabled={!selectedAnswer || isSubmitting}
        >
          <View style={styles.buttonContent}>
            {isSubmitting ? (
              <>
                <ActivityIndicator 
                  size="small" 
                  color="white" 
                  style={{ marginRight: 8 }} 
                />
                <Text style={styles.actionButtonText}>
                  Processing...
                </Text>
              </>
            ) : (
              <Text style={[
                styles.actionButtonText,
                { color: selectedAnswer ? 'white' : colors.textSecondary }
              ]}>
                Submit Answer
              </Text>
            )}
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[
            styles.actionButton, 
            { 
              backgroundColor: isSubmitting ? colors.border : colors.primary,
              opacity: isSubmitting ? 0.7 : 1
            }
          ]}
          onPress={onNext}
          disabled={isSubmitting}
        >
          <View style={styles.buttonContent}>
            {isSubmitting ? (
              <>
                <ActivityIndicator 
                  size="small" 
                  color="white" 
                  style={{ marginRight: 8 }} 
                />
                <Text style={styles.actionButtonText}>
                  Processing...
                </Text>
              </>
            ) : (
              <Text style={styles.actionButtonText}>
                {isLastQuestion ? 'Complete Quiz' : 'Next Question'} →
              </Text>
            )}
          </View>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: SHAPES.standardVerticalMargin,
  },
  actionButton: {
    borderRadius: SHAPES.borderRadius,
    padding: 16,
    alignItems: 'center',
    height: 64,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})