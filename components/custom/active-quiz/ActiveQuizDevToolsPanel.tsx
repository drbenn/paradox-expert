import { Quiz, QuizSession } from '@/types/quiz.types'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface ActiveQuizDevToolsPanelProps {
  currentQuiz: Quiz
  currentQuestionIndex: number
  isAnswered: boolean
  onAnswerQuestion: (answerId: string) => void
  onNextQuestion: () => void
  onQuizComplete: () => void
  onAutoComplete: (targetScore: number) => void
  setIsAnswered: (answered: boolean) => void
  currentSession: QuizSession
}

export default function ActiveQuizDevToolsPanel({
  currentQuiz,
  currentQuestionIndex,
  isAnswered,
  onAnswerQuestion,
  onNextQuestion,
  onQuizComplete,
  onAutoComplete,
  setIsAnswered,
  currentSession,
}: ActiveQuizDevToolsPanelProps) {
  
  const currentQuestion = currentQuiz.questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex >= currentQuiz.questions.length - 1

  const handleCorrectAnswer = () => {
    if (!currentQuestion || isAnswered) return
    onAnswerQuestion(currentQuestion.correctAnswer)
    setIsAnswered(true)
  }

  const handleIncorrectAnswer = () => {
    if (!currentQuestion || isAnswered) return
    
    let incorrectAnswer: string | null = null
    
    if (currentQuestion.correctAnswer === 'true') {
      incorrectAnswer = 'false'
    } else if (currentQuestion.correctAnswer === 'false') {
      incorrectAnswer = 'true'
    } else {
      const incorrectOption = currentQuestion.options.find(
        (option: any) => option.id !== currentQuestion.correctAnswer
      )
      incorrectAnswer = incorrectOption?.id || null
    }
    
    if (incorrectAnswer) {
      onAnswerQuestion(incorrectAnswer)
      setIsAnswered(true)
    }
  }

  const handleAdvanceQuestion = () => {
    if (isLastQuestion) {
      onQuizComplete()
    } else {
      onNextQuestion()
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DEV TOOLS - Q{currentQuestionIndex + 1}/{currentQuiz.questions.length}</Text>
      
      <View style={styles.singleActionRow}>
        <TouchableOpacity
          style={[styles.button, styles.correctButton, isAnswered && styles.disabledButton]}
          onPress={handleCorrectAnswer}
          disabled={isAnswered}
        >
          <Text style={styles.buttonText}>✅ Correct</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.incorrectButton, isAnswered && styles.disabledButton]}
          onPress={handleIncorrectAnswer}
          disabled={isAnswered}
        >
          <Text style={styles.buttonText}>❌ Incorrect</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.advanceButton, !isAnswered && styles.disabledButton]}
          onPress={handleAdvanceQuestion}
          disabled={!isAnswered}
        >
          <Text style={styles.buttonText}>
            {isLastQuestion ? '🏁 Complete' : '➡️ Next'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Score-based auto-complete buttons */}
      <View style={styles.scoreRow}>
        <TouchableOpacity
          style={[styles.scoreButton, styles.perfectButton]}
          onPress={() => onAutoComplete(100)}
        >
          <Text style={styles.scoreButtonText}>100%</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.scoreButton, styles.excellentButton]}
          onPress={() => onAutoComplete(90)}
        >
          <Text style={styles.scoreButtonText}>90%</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.scoreButton, styles.goodButton]}
          onPress={() => onAutoComplete(80)}
        >
          <Text style={styles.scoreButtonText}>80%</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.scoreButton, styles.passButton]}
          onPress={() => onAutoComplete(70)}
        >
          <Text style={styles.scoreButtonText}>70%</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.scoreRow}>
        <TouchableOpacity
          style={[styles.scoreButton, styles.failButton]}
          onPress={() => onAutoComplete(Math.floor(currentQuiz.passingScore - 10))}
        >
          <Text style={styles.scoreButtonText}>Barely Fail</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.scoreButton, styles.zeroButton]}
          onPress={() => onAutoComplete(0)}
        >
          <Text style={styles.scoreButtonText}>0%</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    margin: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  title: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  singleActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  scoreButton: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  correctButton: {
    backgroundColor: '#10B981',
  },
  incorrectButton: {
    backgroundColor: '#EF4444',
  },
  advanceButton: {
    backgroundColor: '#6366F1',
  },
  perfectButton: {
    backgroundColor: '#FFD700',
  },
  excellentButton: {
    backgroundColor: '#10B981',
  },
  goodButton: {
    backgroundColor: '#3B82F6',
  },
  passButton: {
    backgroundColor: '#8B5CF6',
  },
  failButton: {
    backgroundColor: '#F59E0B',
  },
  zeroButton: {
    backgroundColor: '#DC2626',
  },
  disabledButton: {
    backgroundColor: '#6B7280',
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 11,
    textAlign: 'center',
  },
  scoreButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 9,
    textAlign: 'center',
  },
})