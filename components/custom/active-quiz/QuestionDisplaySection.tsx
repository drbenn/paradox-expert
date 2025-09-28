import SHAPES from '@/constants/Shapes'
import { QuizQuestion } from '@/types/quiz.types'
import { StyleSheet, Text, View } from 'react-native'

interface QuestionDisplaySectionProps {
  question: QuizQuestion
  colors: any
}

export default function QuestionDisplaySection({ question, colors }: QuestionDisplaySectionProps) {
  
  // 🚨  SAFETY CHECK: Ensure we have valid data!
  if (!question) {
    return (
      <View style={styles.questionContainer}>
        <Text style={[styles.instructionText, { color: colors?.text || '#000000' }]}>
          Loading question...
        </Text>
      </View>
    )
  }

  // 🛡️ : Safe property access with fallbacks (correct order!)
  const safeQuestion = {
    ...question, // Spread first to get all properties
    questionType: question.questionType || 'default',
    questionText: question.questionText || 'Question loading...',
    fallacyName: question.fallacyName || 'Unknown Paradox'
  }
  
  // 🏆 : Render specialized question display based on type!
  const renderQuestionByType = () => {
    switch (safeQuestion.questionType) {
      case 'example_selection':
        return renderExampleSelectionQuestion()
      
      case 'true_false':
        return renderTrueFalseQuestion()
      
      case 'scenario_identification':
        return renderScenarioIdentificationQuestion()
      
      case 'binary_choice':
        return renderBinaryChoiceQuestion()
      
      default:
        return renderDefaultQuestion()
    }
  }

  // 🎯 EXAMPLE SELECTION: Make it look like a spotlight challenge!
  const renderExampleSelectionQuestion = () => {
    return (
      <View style={styles.questionContainer}>
        {/* 🎯 MAIN INSTRUCTION */}
        <Text style={[styles.instructionText, { color: colors?.text || '#000000' }]}>
          Which example demonstrates this fallacy?
        </Text>
        
        {/* 🏆 FALLACY SPOTLIGHT */}
        <View style={[styles.fallacySpotlight, { 
          backgroundColor: (colors?.primary || '#3B82F6') + '10',
          borderColor: (colors?.primary || '#3B82F6') + '30'
        }]}>
          <Text style={[styles.fallacySpotlightLabel, { color: colors?.primary || '#3B82F6' }]}>
            TARGET FALLACY
          </Text>
          <Text style={[styles.fallacyName, { color: colors?.primary || '#3B82F6' }]}>
            &quot;{safeQuestion.fallacyName}&quot;
          </Text>
        </View>
        
        {/* 🎮 CHALLENGE PROMPT */}
        <Text style={[styles.challengePrompt, { color: colors?.textSecondary || '#666666' }]}>
          Select the example that best demonstrates this logical fallacy
        </Text>
      </View>
    )
  }

  // 🔍 TRUE/FALSE: Make it look like a fact-checking challenge!
  const renderTrueFalseQuestion = () => {
    // 🛡️ : Safe string split with fallbacks
    const questionText = safeQuestion.questionText || ''
    const parts = questionText.includes(':\n\n') ? questionText.split(':\n\n') : [questionText]
    const instruction = parts[0] || questionText
    const example = parts.length > 1 ? parts[1].replace(/"/g, '') : ''
    
    return (
      <View style={styles.questionContainer}>
        {/* 🎯 MAIN INSTRUCTION */}
        <Text style={[styles.instructionText, { color: colors?.text || '#000000' }]}>
          {instruction.replace(`"${safeQuestion.fallacyName}"`, '')}
        </Text>
        
        {/* 🏆 FALLACY CONTEXT */}
        <View style={[styles.fallacyContext, { 
          backgroundColor: '#10B981' + '10',
          borderColor: '#10B981' + '30'
        }]}>
          <Text style={[styles.fallacyContextLabel, { color: '#10B981' }]}>
            FALLACY IN QUESTION
          </Text>
          <Text style={[styles.fallacyName, { color: '#10B981' }]}>
            &quot;{safeQuestion.fallacyName}&quot;
          </Text>
        </View>
        
        {/* 📖 EXAMPLE TO ANALYZE */}
        {example && (
          <View style={[styles.exampleBox, { 
            backgroundColor: colors?.surface || '#F5F5F5',
            borderColor: colors?.border || '#E5E5E5'
          }]}>
            <Text style={[styles.exampleLabel, { color: colors?.textSecondary || '#666666' }]}>
              ANALYZE THIS EXAMPLE:
            </Text>
            <Text style={[styles.exampleText, { color: colors?.text || '#000000' }]}>
              &quot;{example}&quot;
            </Text>
          </View>
        )}
        
        {/* 🎮 CHALLENGE PROMPT */}
        <Text style={[styles.challengePrompt, { color: colors?.textSecondary || '#666666' }]}>
          Does this example demonstrate the fallacy above?
        </Text>
      </View>
    )
  }

  // 🕵️ SCENARIO IDENTIFICATION: Make it look like a detective challenge!
  const renderScenarioIdentificationQuestion = () => {
    // 🛡️ : Safe string processing with fallbacks
    const questionText = safeQuestion.questionText || ''
    const parts = questionText.includes('\n\n') ? questionText.split('\n\n') : [questionText]
    const instruction = parts[0] || 'Which fallacy is described below?'
    const description = parts.length > 1 ? parts[1].replace(/"/g, '') : questionText
    
    return (
      <View style={styles.questionContainer}>
        {/* 🎯 MAIN INSTRUCTION */}
        <Text style={[styles.instructionText, { color: colors?.text || '#000000' }]}>
          Identify the fallacy from this description
        </Text>
        
        {/* 📋 DESCRIPTION BOX */}
        <View style={[styles.descriptionBox, { 
          backgroundColor: '#F59E0B' + '10',
          borderColor: '#F59E0B' + '30'
        }]}>
          <Text style={[styles.descriptionLabel, { color: '#F59E0B' }]}>
            FALLACY DESCRIPTION
          </Text>
          <Text style={[styles.descriptionText, { color: colors?.text || '#000000' }]}>
            &quot;{description}&quot;
          </Text>
        </View>
        
        {/* 🎮 CHALLENGE PROMPT */}
        <Text style={[styles.challengePrompt, { color: colors?.textSecondary || '#666666' }]}>
          Which logical fallacy matches this description?
        </Text>
      </View>
    )
  }

  // ⚔️ BINARY CHOICE: Make it look like a head-to-head battle!
  const renderBinaryChoiceQuestion = () => {
    // 🛡️ : Safe string processing
    const questionText = safeQuestion.questionText || ''
    const parts = questionText.includes('\n\n') ? questionText.split('\n\n') : [questionText]
    const instruction = parts[0] || questionText
    const example = parts.length > 1 ? parts[1].replace(/"/g, '') : ''
    
    return (
      <View style={styles.questionContainer}>
        {/* 🎯 MAIN INSTRUCTION */}
        <Text style={[styles.instructionText, { color: colors?.text || '#000000' }]}>
          Which fallacy does this example demonstrate?
        </Text>
        
        {/* 📖 EXAMPLE TO ANALYZE */}
        {example && (
          <View style={[styles.exampleBox, { 
            backgroundColor: '#8B5CF6' + '10',
            borderColor: '#8B5CF6' + '30'
          }]}>
            <Text style={[styles.exampleLabel, { color: '#8B5CF6' }]}>
              ANALYZE THIS EXAMPLE:
            </Text>
            <Text style={[styles.exampleText, { color: colors?.text || '#000000' }]}>
              &quot;{example}&quot;
            </Text>
          </View>
        )}
        
        {/* 🎮 CHALLENGE PROMPT */}
        <Text style={[styles.challengePrompt, { color: colors?.textSecondary || '#666666' }]}>
          Choose the correct fallacy from the two options below
        </Text>
      </View>
    )
  }

  // 🔄 DEFAULT: Fallback for any unknown question types
  const renderDefaultQuestion = () => {
    return (
      <View style={styles.questionContainer}>
        <Text style={[styles.questionTitle, { color: colors?.text || '#000000' }]}>
          {safeQuestion.questionText}
        </Text>
        
        {safeQuestion.questionType === 'example_selection' && (
          <Text style={[styles.fallacyName, { color: colors?.primary || '#3B82F6' }]}>
            &quot;{safeQuestion.fallacyName}&quot;
          </Text>
        )}
      </View>
    )
  }

  return renderQuestionByType()
}

const styles = StyleSheet.create({
  questionContainer: {
    gap: 16,
  },
  
  // 🏆 QUESTION TYPE HEADERS
  questionTypeHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: SHAPES.borderRadius,
    alignItems: 'center',
  },
  questionTypeLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  
  // 🎯 MAIN INSTRUCTION TEXT
  instructionText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
  },
  
  // 🏆 FALLACY SPOTLIGHT (for example selection)
  fallacySpotlight: {
    padding: 16,
    borderRadius: SHAPES.borderRadius,
    borderWidth: 2,
    alignItems: 'center',
    gap: 8,
  },
  fallacySpotlightLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  fallacyName: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  
  // 🔍 FALLACY CONTEXT (for true/false)
  fallacyContext: {
    padding: 12,
    borderRadius: SHAPES.borderRadius,
    borderWidth: 1,
    alignItems: 'center',
    gap: 6,
  },
  fallacyContextLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  
  // 📖 EXAMPLE BOX
  exampleBox: {
    padding: 16,
    borderRadius: SHAPES.borderRadius,
    borderWidth: 2,
    gap: 8,
  },
  exampleLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  exampleText: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  
  // 📋 DESCRIPTION BOX (for scenario identification)
  descriptionBox: {
    padding: 16,
    borderRadius: SHAPES.borderRadius,
    borderWidth: 2,
    gap: 8,
  },
  descriptionLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  
  // 🎮 CHALLENGE PROMPT
  challengePrompt: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'left',
    fontStyle: 'italic',
    marginHorizontal: 20
  },
  
  // 🔄 FALLBACK STYLES
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'left',
    marginBottom: 12,
    lineHeight: 24,
  },
})

// 🏆  SAFETY CHECKLIST:
/*
✅ NULL/UNDEFINED PROTECTION: Component won't crash if question is null/undefined
✅ SAFE PROPERTY ACCESS: All question properties have fallbacks
✅ SAFE STRING OPERATIONS: split() and replace() operations are protected
✅ SAFE COLOR ACCESS: All color properties have fallbacks
✅ GRACEFUL DEGRADATION: If data is missing, shows loading state
✅ BULLETPROOF RENDERING: Each render method handles missing data gracefully

WHATCHA GONNA DO WHEN THIS BULLETPROOF QUESTION DISPLAY 
HANDLES ALL THE UNDEFINED ERRORS LIKE A CHAMPION?! 🎵
*/