import APP_CONSTANTS from '@/constants/appConstants'
import { Fallacy } from '@/types/app.types'
import { QuizConfig, QuizOption, QuizQuestion } from '@/types/quiz.types'

// 🏆 QUIZ QUESTION SERVICE - THE ULTIMATE QUESTION GENERATION FACTORY!
// Pure question generation logic extracted from QuizService for better modularity
class QuizQuestionService {

  // 🎯 : Generate mixed question types based on distribution!
  generateMixedQuestions(
    quizFallacies: Fallacy[], 
    allFallacies: Fallacy[], 
    totalQuestions: number,
    config: QuizConfig
  ): QuizQuestion[] {
    const questions: QuizQuestion[] = []
    const distribution = config.questionTypeDistribution
    
    // Calculate how many questions of each type
    const exampleSelectionCount = Math.round(totalQuestions * distribution.example_selection)
    const trueFalseCount = Math.round(totalQuestions * distribution.true_false)
    const scenarioIdCount = Math.round(totalQuestions * distribution.scenario_identification)
    const binaryChoiceCount = totalQuestions - exampleSelectionCount - trueFalseCount - scenarioIdCount
    
    // Generate each type of question
    for (let i = 0; i < exampleSelectionCount; i++) {
      const fallacy = this.getRandomItem(quizFallacies)
      questions.push(this.generateExampleSelectionQuestion(fallacy, allFallacies, questions.length + 1, config))
    }
    
    for (let i = 0; i < trueFalseCount; i++) {
      const fallacy = this.getRandomItem(quizFallacies)
      questions.push(this.generateTrueFalseQuestion(fallacy, quizFallacies, questions.length + 1, config))
    }
    
    for (let i = 0; i < scenarioIdCount; i++) {
      const fallacy = this.getRandomItem(quizFallacies)
      questions.push(this.generateScenarioIdentificationQuestion(fallacy, quizFallacies, questions.length + 1, config))
    }
    
    for (let i = 0; i < binaryChoiceCount; i++) {
      const fallacy = this.getRandomItem(quizFallacies)
      questions.push(this.generateBinaryChoiceQuestion(fallacy, quizFallacies, questions.length + 1, config))
    }
    
    // logger.log(`✅ : Generated ${questions.length} mixed-type questions`)
    
    return questions
  }

  // 🏆 MAIN QUESTION GENERATORS - The bread and butter!

  generateExampleSelectionQuestion(
    targetFallacy: Fallacy, 
    allFallacies: Fallacy[], 
    questionNumber: number,
    config: QuizConfig
  ): QuizQuestion {
    const targetExamples = targetFallacy.examples || []
    
    if (targetExamples.length === 0) {
      throw new Error(`Fallacy ${targetFallacy.title} has no examples`)
    }

    const correctExample = this.getRandomItem(targetExamples)
    const incorrectExamples = this.getIncorrectExamples(targetFallacy, allFallacies, 3)
    
    // 🏆 : Options should be EXAMPLES, not fallacy names!
    const correctOption: QuizOption = {
      id: `option-${targetFallacy.id}-correct`,
      text: correctExample, // ← THE ACTUAL EXAMPLE TEXT
      fallacyId: targetFallacy.id
    }
    
    const incorrectOptions: QuizOption[] = incorrectExamples.map((example, index) => ({
      id: `option-${targetFallacy.id}-incorrect-${index}`,
      text: example.text, // ← OTHER FALLACY EXAMPLES
      fallacyId: example.fallacyId
    }))
    
    const allOptions = this.shuffleArray([correctOption, ...incorrectOptions])
    
    return {
      id: `question-example-${targetFallacy.id}-${questionNumber}-${Date.now()}`,
      questionNumber,
      questionType: 'example_selection',
      fallacyId: targetFallacy.id,
      fallacyName: targetFallacy.title,
      questionText: `Pick the example that demonstrates the following fallacy: "${targetFallacy.title}"`,
      options: allOptions,
      correctAnswer: correctOption.id,
      timeLimit: config.questionTimeLimitSeconds || APP_CONSTANTS.QUIZ.QUESTION_TIME_LIMIT_SECONDS
    }
  }

  generateTrueFalseQuestion(
    targetFallacy: Fallacy,
    quizFallacies: Fallacy[],
    questionNumber: number,
    config: QuizConfig
  ): QuizQuestion {
    const targetExamples = targetFallacy.examples || []
    
    if (targetExamples.length === 0) {
      throw new Error(`Fallacy ${targetFallacy.title} has no examples`)
    }

    // 50/50 chance of true or false question
    let isTrue = Math.random() < 0.5
    let example: string
    
    if (isTrue) {
      // True case: Use an actual example from the target fallacy
      example = this.getRandomItem(targetExamples)
    } else {
      // False case: Use an example from a different fallacy in the quiz
      const otherFallacies = quizFallacies.filter(f => f.id !== targetFallacy.id)
      if (otherFallacies.length > 0) {
        const wrongFallacy = this.getRandomItem(otherFallacies)
        const wrongExamples = wrongFallacy.examples || []
        
        if (wrongExamples.length > 0) {
          example = this.getRandomItem(wrongExamples)
        } else {
          // Fallback to true case
          example = this.getRandomItem(targetExamples)
          isTrue = true
        }
      } else {
        // Fallback to true case
        example = this.getRandomItem(targetExamples)
        isTrue = true
      }
    }

    const trueOption: QuizOption = { id: 'true', text: 'True' }
    const falseOption: QuizOption = { id: 'false', text: 'False' }
    
    return {
      id: `question-tf-${targetFallacy.id}-${questionNumber}-${Date.now()}`,
      questionNumber,
      questionType: 'true_false',
      fallacyId: targetFallacy.id,
      fallacyName: targetFallacy.title,
      // 🏆 MACHO MAN: Show the EXAMPLE and ask if it demonstrates the fallacy!
      questionText: `True or False: The following example demonstrates the "${targetFallacy.title}" fallacy:\n\n"${example}"`,
      options: [trueOption, falseOption],
      correctAnswer: isTrue ? 'true' : 'false',
      timeLimit: config.questionTimeLimitSeconds || APP_CONSTANTS.QUIZ.QUESTION_TIME_LIMIT_SECONDS
    }
  }

  generateScenarioIdentificationQuestion(
    targetFallacy: Fallacy,
    quizFallacies: Fallacy[],
    questionNumber: number,
    config: QuizConfig
  ): QuizQuestion {
    // 🏆 : Use the fallacy DESCRIPTION, not examples!
    const description = targetFallacy.description || targetFallacy.title
    
    if (!description || description.trim().length === 0) {
      throw new Error(`Fallacy ${targetFallacy.title} has no description`)
    }
    
    // Get 3 other fallacies from the quiz for incorrect options
    const otherFallacies = quizFallacies.filter(f => f.id !== targetFallacy.id)
    const incorrectFallacies = this.shuffleArray(otherFallacies).slice(0, 3)
    
    // 🏆 MACHO MAN: Options should be FALLACY NAMES, not examples!
    const correctOption: QuizOption = {
      id: `option-${targetFallacy.id}-correct`,
      text: targetFallacy.title // ← THE FALLACY NAME
    }
    
    const incorrectOptions: QuizOption[] = incorrectFallacies.map((fallacy, index) => ({
      id: `option-${targetFallacy.id}-incorrect-${index}`,
      text: fallacy.title // ← OTHER FALLACY NAMES
    }))
    
    const allOptions = this.shuffleArray([correctOption, ...incorrectOptions])
    
    return {
      id: `question-scenario-${targetFallacy.id}-${questionNumber}-${Date.now()}`,
      questionNumber,
      questionType: 'scenario_identification',
      fallacyId: targetFallacy.id,
      fallacyName: targetFallacy.title,
      // 🏆 RICK RUDE STYLE: Show the DESCRIPTION and ask which fallacy it is!
      questionText: `Which fallacy is described below?\n\n"${description}"`,
      options: allOptions,
      correctAnswer: correctOption.id,
      timeLimit: config.questionTimeLimitSeconds || APP_CONSTANTS.QUIZ.QUESTION_TIME_LIMIT_SECONDS
    }
  }

  generateBinaryChoiceQuestion(
    targetFallacy: Fallacy,
    quizFallacies: Fallacy[],
    questionNumber: number,
    config: QuizConfig
  ): QuizQuestion {
    const targetExamples = targetFallacy.examples || []
    
    if (targetExamples.length === 0) {
      throw new Error(`Fallacy ${targetFallacy.title} has no examples`)
    }

    // 🏆 : Show an EXAMPLE and ask which fallacy it demonstrates
    const example = this.getRandomItem(targetExamples)
    
    // Get one other fallacy for the incorrect option
    const otherFallacies = quizFallacies.filter(f => f.id !== targetFallacy.id)
    if (otherFallacies.length === 0) {
      throw new Error('Need at least 2 fallacies for binary choice question')
    }
    const incorrectFallacy = this.getRandomItem(otherFallacies)
    
    // 🏆 MACHO MAN: Options should be FALLACY NAMES!
    const correctOption: QuizOption = {
      id: `option-${targetFallacy.id}-correct`,
      text: targetFallacy.title // ← THE CORRECT FALLACY NAME
    }
    
    const incorrectOption: QuizOption = {
      id: `option-${targetFallacy.id}-incorrect`,
      text: incorrectFallacy.title // ← THE WRONG FALLACY NAME
    }
    
    const allOptions = this.shuffleArray([correctOption, incorrectOption])
    
    return {
      id: `question-binary-${targetFallacy.id}-${questionNumber}-${Date.now()}`,
      questionNumber,
      questionType: 'binary_choice',
      fallacyId: targetFallacy.id,
      fallacyName: targetFallacy.title,
      // 🏆 RICK RUDE STYLE: Show the EXAMPLE and ask which fallacy it demonstrates!
      questionText: `Which fallacy does this example demonstrate?\n\n"${example}"`,
      options: allOptions,
      correctAnswer: correctOption.id,
      timeLimit: config.questionTimeLimitSeconds || APP_CONSTANTS.QUIZ.QUESTION_TIME_LIMIT_SECONDS
    }
  }

  // 🆕 SPECIAL QUESTION GENERATION METHODS - For Daily Challenges (focused on single fallacy)

  generateDailyTrueFalseQuestion(targetFallacy: Fallacy, allFallacies: Fallacy[], questionNumber: number): QuizQuestion {
    const examples = targetFallacy.examples || []
    if (examples.length === 0) {
      throw new Error(`Fallacy ${targetFallacy.title} has no examples`)
    }
    
    const isTrue = Math.random() < 0.7 // 70% chance true for engagement
    const example = isTrue 
      ? examples[Math.floor(Math.random() * examples.length)]
      : this.getIncorrectExamples(targetFallacy, allFallacies, 1)[0]?.text || examples[0]
    
    return {
      id: `daily-tf-${targetFallacy.id}-${questionNumber}-${Date.now()}`,
      questionNumber,
      questionType: 'true_false' as const,
      fallacyId: targetFallacy.id,
      fallacyName: targetFallacy.title,
      questionText: `True or False: This example demonstrates "${targetFallacy.title}":\n\n"${example}"`,
      options: [
        { id: 'true', text: 'True' },
        { id: 'false', text: 'False' }
      ],
      correctAnswer: isTrue ? 'true' : 'false',
      timeLimit: 60
    }
  }

  generateDailyScenarioQuestion(targetFallacy: Fallacy, allFallacies: Fallacy[], questionNumber: number): QuizQuestion {
    const description = targetFallacy.description || targetFallacy.subtitle || targetFallacy.title
    
    // Get 3 other fallacies for incorrect options
    const otherFallacies = allFallacies
      .filter(f => f.id !== targetFallacy.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
    
    return {
      id: `daily-scenario-${targetFallacy.id}-${questionNumber}-${Date.now()}`,
      questionNumber,
      questionType: 'scenario_identification' as const,
      fallacyId: targetFallacy.id,
      fallacyName: targetFallacy.title,
      questionText: `Which fallacy is described below?\n\n"${description}"`,
      options: this.shuffleArray([
        { id: 'correct', text: targetFallacy.title },
        ...otherFallacies.map((f, i) => ({ id: `incorrect-${i}`, text: f.title }))
      ]),
      correctAnswer: 'correct',
      timeLimit: 60
    }
  }

  generateDailyBinaryChoiceQuestion(targetFallacy: Fallacy, allFallacies: Fallacy[], questionNumber: number): QuizQuestion {
    const examples = targetFallacy.examples || []
    if (examples.length === 0) {
      throw new Error(`Fallacy ${targetFallacy.title} has no examples`)
    }
    
    const example = examples[Math.floor(Math.random() * examples.length)]
    const otherFallacy = allFallacies
      .filter(f => f.id !== targetFallacy.id)
      .sort(() => Math.random() - 0.5)[0]
    
    return {
      id: `daily-binary-${targetFallacy.id}-${questionNumber}-${Date.now()}`,
      questionNumber,
      questionType: 'binary_choice' as const,
      fallacyId: targetFallacy.id,
      fallacyName: targetFallacy.title,
      questionText: `Which fallacy does this example demonstrate?\n\n"${example}"`,
      options: this.shuffleArray([
        { id: 'correct', text: targetFallacy.title },
        { id: 'incorrect', text: otherFallacy.title }
      ]),
      correctAnswer: 'correct',
      timeLimit: 60
    }
  }

  // 🆕 WEEKLY GAUNTLET QUESTION GENERATION - For random variety
  // generateGauntletQuestion(
  //   targetFallacy: Fallacy, 
  //   allFallacies: Fallacy[], 
  //   questionNumber: number, 
  //   questionType: string
  // ): QuizQuestion {
  //   try {
  //     switch (questionType) {
  //       case 'example_selection':
  //         return this.generateGauntletExampleSelection(targetFallacy, allFallacies, questionNumber)
  //       case 'true_false':
  //         return this.generateGauntletTrueFalse(targetFallacy, allFallacies, questionNumber)
  //       case 'scenario_identification':
  //         return this.generateGauntletScenario(targetFallacy, allFallacies, questionNumber)
  //       case 'binary_choice':
  //         return this.generateGauntletBinaryChoice(targetFallacy, allFallacies, questionNumber)
  //       default:
  //         // Fallback to example selection
  //         return this.generateGauntletExampleSelection(targetFallacy, allFallacies, questionNumber)
  //     }
  //   } catch (error) {
  //     // logger.warn(`⚠️ Failed to generate ${questionType} question for ${targetFallacy.title}, using fallback`)
  //     // Ultimate fallback to example selection with minimal requirements
  //     return this.generateGauntletExampleSelection(targetFallacy, allFallacies, questionNumber)
  //   }
  // }

  // // 🔄 GAUNTLET-SPECIFIC QUESTION GENERATORS (with gauntlet-specific settings)

  // private generateGauntletExampleSelection(targetFallacy: Fallacy, allFallacies: Fallacy[], questionNumber: number): QuizQuestion {
  //   const config = { questionTimeLimitSeconds: APP_CONSTANTS.WEEKLY_GAUNTLET.QUESTION_TIME_LIMIT }
  //   const question = this.generateExampleSelectionQuestion(targetFallacy, allFallacies, questionNumber, config as QuizConfig)
  //   question.id = `gauntlet-example-${targetFallacy.id}-${questionNumber}-${Date.now()}`
  //   question.timeLimit = APP_CONSTANTS.WEEKLY_GAUNTLET.QUESTION_TIME_LIMIT
  //   return question
  // }

  // private generateGauntletTrueFalse(targetFallacy: Fallacy, allFallacies: Fallacy[], questionNumber: number): QuizQuestion {
  //   const config = { questionTimeLimitSeconds: APP_CONSTANTS.WEEKLY_GAUNTLET.QUESTION_TIME_LIMIT }
  //   const question = this.generateTrueFalseQuestion(targetFallacy, allFallacies, questionNumber, config as QuizConfig)
  //   question.id = `gauntlet-tf-${targetFallacy.id}-${questionNumber}-${Date.now()}`
  //   question.timeLimit = APP_CONSTANTS.WEEKLY_GAUNTLET.QUESTION_TIME_LIMIT
  //   return question
  // }

  // private generateGauntletScenario(targetFallacy: Fallacy, allFallacies: Fallacy[], questionNumber: number): QuizQuestion {
  //   const config = { questionTimeLimitSeconds: APP_CONSTANTS.WEEKLY_GAUNTLET.QUESTION_TIME_LIMIT }
  //   const question = this.generateScenarioIdentificationQuestion(targetFallacy, allFallacies, questionNumber, config as QuizConfig)
  //   question.id = `gauntlet-scenario-${targetFallacy.id}-${questionNumber}-${Date.now()}`
  //   question.timeLimit = APP_CONSTANTS.WEEKLY_GAUNTLET.QUESTION_TIME_LIMIT
  //   return question
  // }

  // private generateGauntletBinaryChoice(targetFallacy: Fallacy, allFallacies: Fallacy[], questionNumber: number): QuizQuestion {
  //   const config = { questionTimeLimitSeconds: APP_CONSTANTS.WEEKLY_GAUNTLET.QUESTION_TIME_LIMIT }
  //   const question = this.generateBinaryChoiceQuestion(targetFallacy, allFallacies, questionNumber, config as QuizConfig)
  //   question.id = `gauntlet-binary-${targetFallacy.id}-${questionNumber}-${Date.now()}`
  //   question.timeLimit = APP_CONSTANTS.WEEKLY_GAUNTLET.QUESTION_TIME_LIMIT
  //   return question
  // }

  // 🔄 UTILITY METHODS - The workhorses!

  // Get incorrect examples from other fallacies
  private getIncorrectExamples(
    targetFallacy: Fallacy, 
    allFallacies: Fallacy[], 
    count: number
  ): { text: string; fallacyId: string }[] {
    const otherFallacies = allFallacies.filter(f => f.id !== targetFallacy.id)
    const incorrectExamples: { text: string; fallacyId: string }[] = []
    
    const availableExamples: { text: string; fallacyId: string }[] = []
    otherFallacies.forEach(fallacy => {
      if (fallacy.examples) {
        fallacy.examples.forEach(example => {
          availableExamples.push({
            text: example,
            fallacyId: fallacy.id
          })
        })
      }
    })
    
    const shuffledExamples = this.shuffleArray(availableExamples)
    
    for (let i = 0; i < Math.min(count, shuffledExamples.length); i++) {
      incorrectExamples.push(shuffledExamples[i])
    }
    
    if (incorrectExamples.length < count) {
      // logger.warn(`⚠️ Could only find ${incorrectExamples.length} incorrect examples, needed ${count}`)
    }
    
    return incorrectExamples
  }

  // Utility function to shuffle an array
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Utility function to get a random item from an array
  private getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
  }

  // 🏆 PUBLIC UTILITY METHODS - For external use by other services

  // Shuffle questions for variety
  shuffleQuestions(questions: QuizQuestion[]): QuizQuestion[] {
    return this.shuffleArray(questions).map((question, index) => ({
      ...question,
      questionNumber: index + 1
    }))
  }

  // Get question type distribution summary
  getQuestionTypeDistribution(totalQuestions: number, config: QuizConfig): {
    exampleSelection: number
    trueFalse: number
    scenarioIdentification: number
    binaryChoice: number
  } {
    const distribution = config.questionTypeDistribution
    
    const exampleSelection = Math.round(totalQuestions * distribution.example_selection)
    const trueFalse = Math.round(totalQuestions * distribution.true_false)
    const scenarioIdentification = Math.round(totalQuestions * distribution.scenario_identification)
    const binaryChoice = totalQuestions - exampleSelection - trueFalse - scenarioIdentification
    
    return {
      exampleSelection,
      trueFalse,
      scenarioIdentification,
      binaryChoice
    }
  }

  // Validate question structure
  validateQuestionStructure(question: QuizQuestion): boolean {
    // Basic validation for all question types
    if (!question.id || !question.questionText || !question.correctAnswer) {
      // logger.error(`❌ Question ${question.id} missing basic properties`)
      return false
    }

    // Type-specific validation
    switch (question.questionType) {
      case 'example_selection':
        if (question.options.length !== 4) {
          // logger.error(`❌ Example selection question ${question.id} should have 4 options`)
          return false
        }
        break
      
      case 'true_false':
        if (question.options.length !== 2) {
          // logger.error(`❌ True/false question ${question.id} should have 2 options`)
          return false
        }
        if (!['true', 'false'].includes(question.correctAnswer)) {
          // logger.error(`❌ True/false question ${question.id} should have 'true' or 'false' as correct answer`)
          return false
        }
        break
      
      case 'scenario_identification':
        if (question.options.length !== 4) {
          // logger.error(`❌ Scenario identification question ${question.id} should have 4 options`)
          return false
        }
        break
      
      case 'binary_choice':
        if (question.options.length !== 2) {
          // logger.error(`❌ Binary choice question ${question.id} should have 2 options`)
          return false
        }
        break
      
      default:
        // logger.error(`❌ Unknown question type: ${question.questionType}`)
        return false
    }

    // Verify correct answer exists in options
    const correctOption = question.options.find(opt => opt.id === question.correctAnswer)
    if (!correctOption) {
      // logger.error(`❌ Question ${question.id} has invalid correct answer`)
      return false
    }

    return true
  }

  // Generate questions for daily challenge (convenience method)
  generateDailyChallengeQuestions(targetFallacy: Fallacy, allFallacies: Fallacy[]): QuizQuestion[] {
    // logger.log(`🎮 : Generating 10-question daily challenge for "${targetFallacy.title}"`)
    
    const questions = []
    const questionTypes = ['example_selection', 'true_false', 'scenario_identification', 'binary_choice']
    
    // Generate 10 questions, all focused on the target fallacy
    for (let i = 0; i < 10; i++) {
      const questionType = questionTypes[i % questionTypes.length] // Cycle through types
      
      let question
      switch (questionType) {
        case 'example_selection':
          const config = { questionTimeLimitSeconds: 60 } as QuizConfig
          question = this.generateExampleSelectionQuestion(targetFallacy, allFallacies, i + 1, config)
          break
        case 'true_false':
          question = this.generateDailyTrueFalseQuestion(targetFallacy, allFallacies, i + 1)
          break
        case 'scenario_identification':
          question = this.generateDailyScenarioQuestion(targetFallacy, allFallacies, i + 1)
          break
        case 'binary_choice':
          question = this.generateDailyBinaryChoiceQuestion(targetFallacy, allFallacies, i + 1)
          break
        default:
          const defaultConfig = { questionTimeLimitSeconds: 60 } as QuizConfig
          question = this.generateExampleSelectionQuestion(targetFallacy, allFallacies, i + 1, defaultConfig)
      }
      
      // Customize for daily challenge
      question.id = `daily-${questionType}-${targetFallacy.id}-${i + 1}-${Date.now()}`
      question.timeLimit = 60
      
      questions.push(question)
    }
    
    // logger.log(`✅ MEGA POWERS: Generated Fallacy of the Day quiz with ${questions.length} questions`)
    return questions
  }
}

// 🏆 EXPORT THE ULTIMATE QUESTION GENERATION FACTORY!
const quizQuestionService = new QuizQuestionService()
export default quizQuestionService