import ActiveQuizActionButton from '@/components/custom/active-quiz/ActiveQuizActionButton'
import ActiveQuizDevToolsPanel from '@/components/custom/active-quiz/ActiveQuizDevToolsPanel'
import ActiveQuizHeader from '@/components/custom/active-quiz/ActiveQuizHeader'
import ActiveQuizAnswerOptionsPanel from '@/components/custom/active-quiz/AnswerOptionsPanel'
import QuestionDisplaySection from '@/components/custom/active-quiz/QuestionDisplaySection'
import Card from '@/components/custom/Card'
import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import { useAppState } from '@/state/useAppState'
import { QuizAnswer, QuizSession } from '@/types/quiz.types'
import { router, useFocusEffect } from 'expo-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Alert,
  BackHandler,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const { width: screenWidth } = Dimensions.get('window')

export default function QuizActiveScreen() {
  const { colors } = useSystemTheme()
  const insets = useSafeAreaInsets()
  

  //////////////////////////////////////////////////////////////
  //
  //
  //        NEW CODE
  ///
  //
  /////////////////////////////////////////////////////////////

  // Global state - just the control methods and status
  const startingQuizSession = useAppState((state) => state.startingQuizSession)
  const clearStartingQuizSession = useAppState((state) => state.clearStartingQuizSession)
  const cancelQuiz = useAppState((state) => state.cancelQuiz)
  const completeQuiz = useAppState((state) => state.completeQuiz)
  const isQuizInProgress = useAppState((state) => state.isQuizInProgress)
  const isQuizCheatsEnabled = useAppState((state) => state.isQuizCheatsEnabled)


  // Local component state - the actual quiz session data - received from state on start and updated as quiz questions progress
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(null)
  // 🎯 QUESTION STATE - Current question interaction
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState<boolean>(false)
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null)
  const [isExiting, setIsExiting] = useState(false)

  // logger.log('currentSession: ', currentSession)
  logger.log('isSubmitting: ', isSubmitting)
  logger.log('selectedAnswer: ', selectedAnswer)
  logger.log('isAnswered: ', isAnswered)
  logger.log('questionStartTime: ',questionStartTime)
  
  
  
  
  
  
  // Timer ref to allow cleanup during auto-complete
  const timerRef = useRef<NodeJS.Timeout | null>(null)


  // Quiz initialization (replaces the route params useEffect)
useEffect(() => {

  if (isExiting) return

  logger.log('📄 Active screen mount - State check:', { 
    isQuizInProgress, 
    startingQuizSession: !!startingQuizSession,
    currentSession: !!currentSession 
  })
  
  // NOTE: !isExiting added because result screen would sometimes be skipped due to race condition when using dev quiz cheat tools.
  // this forces you to use the complete button after cheating through quiz, but its ok, the results screen shows and its still incredibly fast to cheat through quiz
  if (!isQuizInProgress && !isExiting) {
    logger.log('❌ No quiz in progress, routing back')
    router.back()
    return
  }
  
  logger.log('✅ Quiz in progress confirmed, checking session handoff...')
  
  // Handle the handoff - takes starting quiz config from state to setup test locally, then clears state until quiz is complete or exited
  if (startingQuizSession && !currentSession) {
    logger.log('📄 Performing session handoff...')
    setCurrentSession(startingQuizSession)
    setQuestionStartTime(Date.now())
    clearStartingQuizSession()
    logger.log('✅ Session handoff complete')
  } else {
    logger.log('⚠️ Handoff conditions not met:', {
      hasStartingSession: !!startingQuizSession,
      hasCurrentSession: !!currentSession
    })
  }
}, [isQuizInProgress, startingQuizSession, clearStartingQuizSession, isExiting])

useEffect(() => {
  // Only cleanup if we HAD a session and quiz is no longer in progress
  if (!isQuizInProgress && currentSession && !isExiting) {
    logger.log('🧹 Quiz was canceled, cleaning up local state...')
    setCurrentSession(null)
    setQuestionStartTime(null)
    setIsAnswered(false)
    setSelectedAnswer(null)
    
    // Clear any active timers
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }
}, [isQuizInProgress]) // Remove currentSession from dependencies

  // Local session management functions
  const answerQuestion = useCallback((answerId: string) => {
    if (!currentSession?.quiz) return
    
    const currentQuestion = currentSession.quiz.questions[currentSession.currentQuestionIndex]
    const isCorrect = answerId === currentQuestion.correctAnswer
    
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer: answerId,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      timeTaken: questionStartTime ? Date.now() - questionStartTime : 0
    }
    
    setCurrentSession((prev: QuizSession | null) => {
      if (!prev) return prev
      return {
        ...prev,
        answers: [...prev.answers, newAnswer]
      }
    })
  }, [currentSession, questionStartTime])

  const nextQuestion = useCallback(() => {
    setCurrentSession((prev: QuizSession | null) => {
      if (!prev) return prev
      return {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }
    })
    
    // Reset question-level state
    setSelectedAnswer(null)
    setIsAnswered(false)
    setQuestionStartTime(Date.now())
  }, [])

// Quiz completion handler
  const handleQuizComplete = useCallback(() => {
    logger.log('🏁 handleQuizComplete called')
    if (!currentSession) {
      logger.log('❌ No current session for completion')
      return
    }
    
    // Clear any active timers
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    
    // 🔍 DEBUGGING: Log session state before sending to completeQuiz
    logger.log('🔍 MANUAL COMPLETION DEBUG:')
    logger.log('  - currentSession.answers.length:', currentSession.answers.length)
    logger.log('  - currentSession.currentQuestionIndex:', currentSession.currentQuestionIndex)
    logger.log('  - currentSession.isActive:', currentSession.isActive)
    logger.log('  - Sample answers (first 2):')
    currentSession.answers.slice(0, 2).forEach((answer, i) => {
      logger.log(`    [${i}]:`, {
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: answer.correctAnswer,
        isCorrect: answer.isCorrect,
        timeTaken: answer.timeTaken
      })
    })
    logger.log('  - Total quiz questions:', currentSession.quiz.questions.length)
    
    setIsExiting(true)
    // Call global completeQuiz with the local session data
    completeQuiz(currentSession)
  }, [currentSession, completeQuiz])

  // NEW: Auto-complete handler for dev tools
// NEW: Auto-complete handler for dev tools
  const handleAutoComplete = useCallback((targetScore: number) => {
    if (!currentSession) {
      logger.log('❌ No current session for auto-complete')
      return
    }
    
    logger.log(`🛠️ Auto-completing quiz with ${targetScore}% target score`)

    // Set exiting flag to prevent cleanup useEffect interference
    setIsExiting(true)
    
    // Clear any active timers
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    
    const totalQuestions = currentSession.quiz.questions.length
    const targetCorrect = Math.round((targetScore / 100) * totalQuestions)
    
    logger.log('🔍 AUTO-COMPLETE SETUP:')
    logger.log('  - Total questions:', totalQuestions)
    logger.log('  - Target correct:', targetCorrect)
    logger.log('  - Target score:', targetScore + '%')
    
    // Randomly select which questions to get correct
    const correctQuestions = new Set<number>()
    const questionNumbers = Array.from({ length: totalQuestions }, (_, i) => i)
    const shuffled = [...questionNumbers].sort(() => Math.random() - 0.5)
    
    for (let i = 0; i < targetCorrect; i++) {
      correctQuestions.add(shuffled[i])
    }
    
    logger.log('  - Questions to get correct:', Array.from(correctQuestions).sort().join(', '))
    
    // Generate all answers
    const answers: QuizAnswer[] = currentSession.quiz.questions.map((question, index) => {
      const shouldBeCorrect = correctQuestions.has(index)
      let selectedAnswer: string
      
      if (shouldBeCorrect) {
        selectedAnswer = question.correctAnswer
      } else {
        // Generate incorrect answer
        if (question.correctAnswer === 'true') {
          selectedAnswer = 'false'
        } else if (question.correctAnswer === 'false') {
          selectedAnswer = 'true'
        } else {
          const incorrectOption = question.options.find(
            (option) => option.id !== question.correctAnswer
          )
          selectedAnswer = incorrectOption?.id || question.correctAnswer
        }
      }
      
      return {
        questionId: question.id,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect: shouldBeCorrect,
        timeTaken: 1200 // Fixed 1.2 seconds per question
      }
    })
    
    logger.log('🔍 GENERATED ANSWERS:')
    logger.log('  - Total answers generated:', answers.length)
    logger.log('  - Correct answers:', answers.filter(a => a.isCorrect).length)
    
    // Create the completed session
    const completedSession: QuizSession = {
      ...currentSession,
      answers,
      currentQuestionIndex: totalQuestions - 1
    }
    
    logger.log('🔍 COMPLETED SESSION FOR DIRECT SUBMISSION:')
    logger.log('  - completedSession.answers.length:', completedSession.answers.length)
    logger.log('  - completedSession.currentQuestionIndex:', completedSession.currentQuestionIndex)
    logger.log('  - completedSession.isActive:', completedSession.isActive)
    
    // Update local session state for UI consistency
    setCurrentSession(completedSession)
    
    // Set UI state to completed
    setIsAnswered(true)
    setSelectedAnswer(null)
    
    logger.log(`🛠️ Auto-complete calling completeQuiz directly with completed session`)
    
    // Call completeQuiz directly with the completed session data
    completeQuiz(completedSession)
  }, [currentSession, completeQuiz])

  // Answer selection handler
  const handleAnswerSelect = useCallback((optionId: string) => {
    if (isAnswered) return
    logger.log('🖱️ Answer selected:', optionId)
    setSelectedAnswer(optionId)
  }, [isAnswered])



  // Answer submission handler
  const handleSubmitAnswer = useCallback(async () => {
    if (!selectedAnswer || isAnswered || isSubmitting) return
    
    logger.log('📤 Submitting answer:', selectedAnswer)
    setIsSubmitting(true)
    try {
      answerQuestion(selectedAnswer)
      setIsAnswered(true)
    } finally {
      setIsSubmitting(false)
    }
  }, [selectedAnswer, isAnswered, isSubmitting, answerQuestion])

  // Next question handler
  const handleNext = useCallback(async () => {
    if (!currentSession?.quiz || isSubmitting) return
    
    setIsSubmitting(true)
    try {
      const isLastQuestion = currentSession.currentQuestionIndex >= currentSession.quiz.questions.length - 1
      
      if (isLastQuestion) {
        await handleQuizComplete()
      } else {
        nextQuestion()
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [currentSession, nextQuestion, handleQuizComplete, isSubmitting])  

  // ================================================================================================
  // 🚨 TIMER SYSTEM - Auto-advance when time runs out - callback from header component
  // ================================================================================================

  // Time up handler (for timer callback)
  const handleTimeUp = useCallback(() => {
    if (!currentSession?.isActive || !currentSession.quiz || isAnswered) {
      return
    }
    
    // Auto-select answer (user's selection or first option)
    if (selectedAnswer) {
      answerQuestion(selectedAnswer)
    } else {
      const firstOption = currentSession.quiz.questions[currentSession.currentQuestionIndex]?.options[0]
      if (firstOption) {
        answerQuestion(firstOption.id)
      }
    }
    setIsAnswered(true)
    
    // Auto advance after 2 seconds
    timerRef.current = setTimeout(() => {
      if (currentSession.isActive) {
        handleNext()
      }
    }, 2000) as unknown as NodeJS.Timeout
  }, [isAnswered, selectedAnswer, answerQuestion, handleNext, currentSession])

  const handleBackPress = useCallback(() => {
    logger.log('=== BACK PRESS DEBUG ===')
    logger.log('currentSession?.isActive:', currentSession?.isActive)
    logger.log('currentSession?.quiz:', !!currentSession?.quiz)
    logger.log('isQuizInProgress:', isQuizInProgress)
    
    // Only handle back press if we're actually on the active quiz screen AND have an active quiz
    if (!currentSession?.isActive || !currentSession?.quiz || !isQuizInProgress) {
      logger.log('EARLY RETURN - not handling back press')
      return false // Let the system handle the back press normally
    }
    
    logger.log('ALERT ABOUT TO SHOW!')
  
    Alert.alert(
      '⚠️ Exit Quiz',
      'Are you sure you want to exit? Your progress will be lost.',
      [
        { text: 'Continue Quiz', style: 'cancel' },
        {
          text: 'Exit Quiz',
          style: 'destructive',
          onPress: () => {
            setIsExiting(true)
            
            // CRITICAL: Clear all timers immediately
            if (timerRef.current) {
              clearTimeout(timerRef.current)
              timerRef.current = null
            }
            
            // Clear local state immediately to prevent further updates
            setCurrentSession(null)
            setQuestionStartTime(null)
            setIsAnswered(false)
            setSelectedAnswer(null)
            
            cancelQuiz()
            router.push('/(tabs)/quiz')
          }
        }
      ]
    )
    
    logger.log('RETURNING TRUE FROM BACK PRESS')
    return true
  }, [currentSession?.isActive, currentSession?.quiz, isQuizInProgress, cancelQuiz])

useFocusEffect(
  useCallback(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress)
    
    return () => {
      backHandler.remove()
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [handleBackPress])
)

  // Derived state (replace the constants)
  const currentQuestion = currentSession?.quiz?.questions[currentSession.currentQuestionIndex || 0]
  const isLastQuestion = currentSession ? 
    currentSession.currentQuestionIndex >= currentSession.quiz.questions.length - 1 : false



  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      
      { currentSession && (
        <ActiveQuizHeader
          currentQuestionIndex={currentSession.currentQuestionIndex}
          totalQuestions={currentSession.quiz.questions.length}
          isQuizActive={currentSession.isActive}
          isAnswered={isAnswered}
          onTimeUp={handleTimeUp}
          onExit={handleBackPress}
          colors={colors}
        />
      )}
          
    {isQuizCheatsEnabled && currentSession && (
      <ActiveQuizDevToolsPanel
        currentQuiz={currentSession.quiz}
        currentQuestionIndex={currentSession.currentQuestionIndex}
        isAnswered={isAnswered}
        onAnswerQuestion={answerQuestion}
        onNextQuestion={nextQuestion}
        onQuizComplete={handleQuizComplete}
        onAutoComplete={handleAutoComplete}
        setIsAnswered={setIsAnswered}
        currentSession={currentSession}
      />
    )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        { currentQuestion && (
          <Card>
            <QuestionDisplaySection 
              question={currentQuestion} 
              colors={colors} 
            />
          </Card>
        )}

        { currentQuestion && 
          <ActiveQuizAnswerOptionsPanel
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            isAnswered={isAnswered}
            onAnswerSelect={handleAnswerSelect}
            colors={colors}
          />
        }

        <View style={[{paddingTop: SHAPES.standardVerticalMargin, paddingBottom: insets.bottom + 100}]}>
          <ActiveQuizActionButton
            isAnswered={isAnswered}
            selectedAnswer={selectedAnswer}
            isLastQuestion={isLastQuestion}
            isSubmitting={isSubmitting}
            onSubmitAnswer={handleSubmitAnswer}
            onNext={handleNext}
            colors={colors}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
})