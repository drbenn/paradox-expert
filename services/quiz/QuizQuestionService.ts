import APP_CONSTANTS from '@/constants/appConstants'
import { Paradox } from '@/types/app.types'
import { QuizConfig, QuizOption, QuizQuestion } from '@/types/quiz.types'

// 🏆 QUIZ QUESTION SERVICE - THE ULTIMATE QUESTION GENERATION FACTORY!
// Pure question generation logic extracted from QuizService for better modularity
class QuizQuestionService {

  // 🎯 : Generate mixed question types based on distribution!
  generateMixedQuestions(
    quizFallacies: Paradox[], 
    allParadoxes: Paradox[], 
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
      const paradox = this.getRandomItem(quizFallacies)
      questions.push(this.generateExampleSelectionQuestion(paradox, allParadoxes, questions.length + 1, config))
    }
    
    for (let i = 0; i < trueFalseCount; i++) {
      const paradox = this.getRandomItem(quizFallacies)
      questions.push(this.generateTrueFalseQuestion(paradox, quizFallacies, questions.length + 1, config))
    }
    
    for (let i = 0; i < scenarioIdCount; i++) {
      const paradox = this.getRandomItem(quizFallacies)
      questions.push(this.generateScenarioIdentificationQuestion(paradox, quizFallacies, questions.length + 1, config))
    }
    
    for (let i = 0; i < binaryChoiceCount; i++) {
      const paradox = this.getRandomItem(quizFallacies)
      questions.push(this.generateBinaryChoiceQuestion(paradox, quizFallacies, questions.length + 1, config))
    }
    
    // logger.log(`✅ : Generated ${questions.length} mixed-type questions`)
    
    return questions
  }

  // 🏆 MAIN QUESTION GENERATORS - The bread and butter!

  generateExampleSelectionQuestion(
    targetParadox: Paradox, 
    allParadoxes: Paradox[], 
    questionNumber: number,
    config: QuizConfig
  ): QuizQuestion {
    const targetExamples = targetParadox.examples || []
    
    if (targetExamples.length === 0) {
      throw new Error(`Paradox ${targetParadox.title} has no examples`)
    }

    const correctExample = this.getRandomItem(targetExamples)
    const incorrectExamples = this.getIncorrectExamples(targetParadox, allParadoxes, 3)
    
    // 🏆 : Options should be EXAMPLES, not paradox names!
    const correctOption: QuizOption = {
      id: `option-${targetParadox.id}-correct`,
      text: correctExample, // ← THE ACTUAL EXAMPLE TEXT
      fallacyId: targetParadox.id
    }
    
    const incorrectOptions: QuizOption[] = incorrectExamples.map((example, index) => ({
      id: `option-${targetParadox.id}-incorrect-${index}`,
      text: example.text, // ← OTHER FALLACY EXAMPLES
      fallacyId: example.fallacyId
    }))
    
    const allOptions = this.shuffleArray([correctOption, ...incorrectOptions])
    
    return {
      id: `question-example-${targetParadox.id}-${questionNumber}-${Date.now()}`,
      questionNumber,
      questionType: 'example_selection',
      fallacyId: targetParadox.id,
      fallacyName: targetParadox.title,
      questionText: `Pick the example that demonstrates the following paradox: "${targetParadox.title}"`,
      options: allOptions,
      correctAnswer: correctOption.id,
      timeLimit: config.questionTimeLimitSeconds || APP_CONSTANTS.QUIZ.QUESTION_TIME_LIMIT_SECONDS
    }
  }

  generateTrueFalseQuestion(
    targetParadox: Paradox,
    quizFallacies: Paradox[],
    questionNumber: number,
    config: QuizConfig
  ): QuizQuestion {
    const targetExamples = targetParadox.examples || []
    
    if (targetExamples.length === 0) {
      throw new Error(`Paradox ${targetParadox.title} has no examples`)
    }

    // 50/50 chance of true or false question
    let isTrue = Math.random() < 0.5
    let example: string
    
    if (isTrue) {
      // True case: Use an actual example from the target paradox
      example = this.getRandomItem(targetExamples)
    } else {
      // False case: Use an example from a different paradox in the quiz
      const otherFallacies = quizFallacies.filter(f => f.id !== targetParadox.id)
      if (otherFallacies.length > 0) {
        const wrongParadox = this.getRandomItem(otherFallacies)
        const wrongExamples = wrongParadox.examples || []
        
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
      id: `question-tf-${targetParadox.id}-${questionNumber}-${Date.now()}`,
      questionNumber,
      questionType: 'true_false',
      fallacyId: targetParadox.id,
      fallacyName: targetParadox.title,
      // 🏆 MACHO MAN: Show the EXAMPLE and ask if it demonstrates the paradox!
      questionText: `True or False: The following example demonstrates the "${targetParadox.title}" paradox:\n\n"${example}"`,
      options: [trueOption, falseOption],
      correctAnswer: isTrue ? 'true' : 'false',
      timeLimit: config.questionTimeLimitSeconds || APP_CONSTANTS.QUIZ.QUESTION_TIME_LIMIT_SECONDS
    }
  }

  generateScenarioIdentificationQuestion(
    targetParadox: Paradox,
    quizFallacies: Paradox[],
    questionNumber: number,
    config: QuizConfig
  ): QuizQuestion {
    // 🏆 : Use the paradox DESCRIPTION, not examples!
    const description = targetParadox.description || targetParadox.title
    
    if (!description || description.trim().length === 0) {
      throw new Error(`Paradox ${targetParadox.title} has no description`)
    }
    
    // Get 3 other paradoxes from the quiz for incorrect options
    const otherFallacies = quizFallacies.filter(f => f.id !== targetParadox.id)
    const incorrectFallacies = this.shuffleArray(otherFallacies).slice(0, 3)
    
    // 🏆 MACHO MAN: Options should be FALLACY NAMES, not examples!
    const correctOption: QuizOption = {
      id: `option-${targetParadox.id}-correct`,
      text: targetParadox.title // ← THE FALLACY NAME
    }
    
    const incorrectOptions: QuizOption[] = incorrectFallacies.map((paradox, index) => ({
      id: `option-${targetParadox.id}-incorrect-${index}`,
      text: paradox.title // ← OTHER FALLACY NAMES
    }))
    
    const allOptions = this.shuffleArray([correctOption, ...incorrectOptions])
    
    return {
      id: `question-scenario-${targetParadox.id}-${questionNumber}-${Date.now()}`,
      questionNumber,
      questionType: 'scenario_identification',
      fallacyId: targetParadox.id,
      fallacyName: targetParadox.title,
      // 🏆 RICK RUDE STYLE: Show the DESCRIPTION and ask which paradox it is!
      questionText: `Which paradox is described below?\n\n"${description}"`,
      options: allOptions,
      correctAnswer: correctOption.id,
      timeLimit: config.questionTimeLimitSeconds || APP_CONSTANTS.QUIZ.QUESTION_TIME_LIMIT_SECONDS
    }
  }

  generateBinaryChoiceQuestion(
    targetParadox: Paradox,
    quizFallacies: Paradox[],
    questionNumber: number,
    config: QuizConfig
  ): QuizQuestion {
    const targetExamples = targetParadox.examples || []
    
    if (targetExamples.length === 0) {
      throw new Error(`Paradox ${targetParadox.title} has no examples`)
    }

    // 🏆 : Show an EXAMPLE and ask which paradox it demonstrates
    const example = this.getRandomItem(targetExamples)
    
    // Get one other paradox for the incorrect option
    const otherFallacies = quizFallacies.filter(f => f.id !== targetParadox.id)
    if (otherFallacies.length === 0) {
      throw new Error('Need at least 2 paradoxes for binary choice question')
    }
    const incorrectParadox = this.getRandomItem(otherFallacies)
    
    // 🏆 MACHO MAN: Options should be FALLACY NAMES!
    const correctOption: QuizOption = {
      id: `option-${targetParadox.id}-correct`,
      text: targetParadox.title // ← THE CORRECT FALLACY NAME
    }
    
    const incorrectOption: QuizOption = {
      id: `option-${targetParadox.id}-incorrect`,
      text: incorrectParadox.title // ← THE WRONG FALLACY NAME
    }
    
    const allOptions = this.shuffleArray([correctOption, incorrectOption])
    
    return {
      id: `question-binary-${targetParadox.id}-${questionNumber}-${Date.now()}`,
      questionNumber,
      questionType: 'binary_choice',
      fallacyId: targetParadox.id,
      fallacyName: targetParadox.title,
      // 🏆 RICK RUDE STYLE: Show the EXAMPLE and ask which paradox it demonstrates!
      questionText: `Which paradox does this example demonstrate?\n\n"${example}"`,
      options: allOptions,
      correctAnswer: correctOption.id,
      timeLimit: config.questionTimeLimitSeconds || APP_CONSTANTS.QUIZ.QUESTION_TIME_LIMIT_SECONDS
    }
  }

  // 🆕 SPECIAL QUESTION GENERATION METHODS - For Daily Challenges (focused on single paradox)

  generateDailyTrueFalseQuestion(targetParadox: Paradox, allParadoxes: Paradox[], questionNumber: number): QuizQuestion {
    const examples = targetParadox.examples || []
    if (examples.length === 0) {
      throw new Error(`Paradox ${targetParadox.title} has no examples`)
    }
    
    const isTrue = Math.random() < 0.7 // 70% chance true for engagement
    const example = isTrue 
      ? examples[Math.floor(Math.random() * examples.length)]
      : this.getIncorrectExamples(targetParadox, allParadoxes, 1)[0]?.text || examples[0]
    
    return {
      id: `daily-tf-${targetParadox.id}-${questionNumber}-${Date.now()}`,
      questionNumber,
      questionType: 'true_false' as const,
      fallacyId: targetParadox.id,
      fallacyName: targetParadox.title,
      questionText: `True or False: This example demonstrates "${targetParadox.title}":\n\n"${example}"`,
      options: [
        { id: 'true', text: 'True' },
        { id: 'false', text: 'False' }
      ],
      correctAnswer: isTrue ? 'true' : 'false',
      timeLimit: 60
    }
  }

  generateDailyScenarioQuestion(targetParadox: Paradox, allParadoxes: Paradox[], questionNumber: number): QuizQuestion {
    const description = targetParadox.description || targetParadox.subtitle || targetParadox.title
    
    // Get 3 other paradoxes for incorrect options
    const otherFallacies = allParadoxes
      .filter(f => f.id !== targetParadox.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
    
    return {
      id: `daily-scenario-${targetParadox.id}-${questionNumber}-${Date.now()}`,
      questionNumber,
      questionType: 'scenario_identification' as const,
      fallacyId: targetParadox.id,
      fallacyName: targetParadox.title,
      questionText: `Which paradox is described below?\n\n"${description}"`,
      options: this.shuffleArray([
        { id: 'correct', text: targetParadox.title },
        ...otherFallacies.map((f, i) => ({ id: `incorrect-${i}`, text: f.title }))
      ]),
      correctAnswer: 'correct',
      timeLimit: 60
    }
  }

  generateDailyBinaryChoiceQuestion(targetParadox: Paradox, allParadoxes: Paradox[], questionNumber: number): QuizQuestion {
    const examples = targetParadox.examples || []
    if (examples.length === 0) {
      throw new Error(`Paradox ${targetParadox.title} has no examples`)
    }
    
    const example = examples[Math.floor(Math.random() * examples.length)]
    const otherParadox = allParadoxes
      .filter(f => f.id !== targetParadox.id)
      .sort(() => Math.random() - 0.5)[0]
    
    return {
      id: `daily-binary-${targetParadox.id}-${questionNumber}-${Date.now()}`,
      questionNumber,
      questionType: 'binary_choice' as const,
      fallacyId: targetParadox.id,
      fallacyName: targetParadox.title,
      questionText: `Which paradox does this example demonstrate?\n\n"${example}"`,
      options: this.shuffleArray([
        { id: 'correct', text: targetParadox.title },
        { id: 'incorrect', text: otherParadox.title }
      ]),
      correctAnswer: 'correct',
      timeLimit: 60
    }
  }

  // 🆕 WEEKLY GAUNTLET QUESTION GENERATION - For random variety
  // generateGauntletQuestion(
  //   targetParadox: Paradox, 
  //   allParadoxes: Paradox[], 
  //   questionNumber: number, 
  //   questionType: string
  // ): QuizQuestion {
  //   try {
  //     switch (questionType) {
  //       case 'example_selection':
  //         return this.generateGauntletExampleSelection(targetParadox, allParadoxes, questionNumber)
  //       case 'true_false':
  //         return this.generateGauntletTrueFalse(targetParadox, allParadoxes, questionNumber)
  //       case 'scenario_identification':
  //         return this.generateGauntletScenario(targetParadox, allParadoxes, questionNumber)
  //       case 'binary_choice':
  //         return this.generateGauntletBinaryChoice(targetParadox, allParadoxes, questionNumber)
  //       default:
  //         // Fallback to example selection
  //         return this.generateGauntletExampleSelection(targetParadox, allParadoxes, questionNumber)
  //     }
  //   } catch (error) {
  //     // logger.warn(`⚠️ Failed to generate ${questionType} question for ${targetParadox.title}, using fallback`)
  //     // Ultimate fallback to example selection with minimal requirements
  //     return this.generateGauntletExampleSelection(targetParadox, allParadoxes, questionNumber)
  //   }
  // }

  // // 🔄 GAUNTLET-SPECIFIC QUESTION GENERATORS (with gauntlet-specific settings)

  // private generateGauntletExampleSelection(targetParadox: Paradox, allParadoxes: Paradox[], questionNumber: number): QuizQuestion {
  //   const config = { questionTimeLimitSeconds: APP_CONSTANTS.WEEKLY_GAUNTLET.QUESTION_TIME_LIMIT }
  //   const question = this.generateExampleSelectionQuestion(targetParadox, allParadoxes, questionNumber, config as QuizConfig)
  //   question.id = `gauntlet-example-${targetParadox.id}-${questionNumber}-${Date.now()}`
  //   question.timeLimit = APP_CONSTANTS.WEEKLY_GAUNTLET.QUESTION_TIME_LIMIT
  //   return question
  // }

  // private generateGauntletTrueFalse(targetParadox: Paradox, allParadoxes: Paradox[], questionNumber: number): QuizQuestion {
  //   const config = { questionTimeLimitSeconds: APP_CONSTANTS.WEEKLY_GAUNTLET.QUESTION_TIME_LIMIT }
  //   const question = this.generateTrueFalseQuestion(targetParadox, allParadoxes, questionNumber, config as QuizConfig)
  //   question.id = `gauntlet-tf-${targetParadox.id}-${questionNumber}-${Date.now()}`
  //   question.timeLimit = APP_CONSTANTS.WEEKLY_GAUNTLET.QUESTION_TIME_LIMIT
  //   return question
  // }

  // private generateGauntletScenario(targetParadox: Paradox, allParadoxes: Paradox[], questionNumber: number): QuizQuestion {
  //   const config = { questionTimeLimitSeconds: APP_CONSTANTS.WEEKLY_GAUNTLET.QUESTION_TIME_LIMIT }
  //   const question = this.generateScenarioIdentificationQuestion(targetParadox, allParadoxes, questionNumber, config as QuizConfig)
  //   question.id = `gauntlet-scenario-${targetParadox.id}-${questionNumber}-${Date.now()}`
  //   question.timeLimit = APP_CONSTANTS.WEEKLY_GAUNTLET.QUESTION_TIME_LIMIT
  //   return question
  // }

  // private generateGauntletBinaryChoice(targetParadox: Paradox, allParadoxes: Paradox[], questionNumber: number): QuizQuestion {
  //   const config = { questionTimeLimitSeconds: APP_CONSTANTS.WEEKLY_GAUNTLET.QUESTION_TIME_LIMIT }
  //   const question = this.generateBinaryChoiceQuestion(targetParadox, allParadoxes, questionNumber, config as QuizConfig)
  //   question.id = `gauntlet-binary-${targetParadox.id}-${questionNumber}-${Date.now()}`
  //   question.timeLimit = APP_CONSTANTS.WEEKLY_GAUNTLET.QUESTION_TIME_LIMIT
  //   return question
  // }

  // 🔄 UTILITY METHODS - The workhorses!

  // Get incorrect examples from other paradoxes
  private getIncorrectExamples(
    targetParadox: Paradox, 
    allParadoxes: Paradox[], 
    count: number
  ): { text: string; fallacyId: string }[] {
    const otherFallacies = allParadoxes.filter(f => f.id !== targetParadox.id)
    const incorrectExamples: { text: string; fallacyId: string }[] = []
    
    const availableExamples: { text: string; fallacyId: string }[] = []
    otherFallacies.forEach(paradox => {
      if (paradox.examples) {
        paradox.examples.forEach(example => {
          availableExamples.push({
            text: example,
            fallacyId: paradox.id
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
  generateDailyChallengeQuestions(targetParadox: Paradox, allParadoxes: Paradox[]): QuizQuestion[] {
    // logger.log(`🎮 : Generating 10-question daily challenge for "${targetParadox.title}"`)
    
    const questions = []
    const questionTypes = ['example_selection', 'true_false', 'scenario_identification', 'binary_choice']
    
    // Generate 10 questions, all focused on the target paradox
    for (let i = 0; i < 10; i++) {
      const questionType = questionTypes[i % questionTypes.length] // Cycle through types
      
      let question
      switch (questionType) {
        case 'example_selection':
          const config = { questionTimeLimitSeconds: 60 } as QuizConfig
          question = this.generateExampleSelectionQuestion(targetParadox, allParadoxes, i + 1, config)
          break
        case 'true_false':
          question = this.generateDailyTrueFalseQuestion(targetParadox, allParadoxes, i + 1)
          break
        case 'scenario_identification':
          question = this.generateDailyScenarioQuestion(targetParadox, allParadoxes, i + 1)
          break
        case 'binary_choice':
          question = this.generateDailyBinaryChoiceQuestion(targetParadox, allParadoxes, i + 1)
          break
        default:
          const defaultConfig = { questionTimeLimitSeconds: 60 } as QuizConfig
          question = this.generateExampleSelectionQuestion(targetParadox, allParadoxes, i + 1, defaultConfig)
      }
      
      // Customize for daily challenge
      question.id = `daily-${questionType}-${targetParadox.id}-${i + 1}-${Date.now()}`
      question.timeLimit = 60
      
      questions.push(question)
    }
    
    // logger.log(`✅ MEGA POWERS: Generated Paradox of the Day quiz with ${questions.length} questions`)
    return questions
  }
}

// 🏆 EXPORT THE ULTIMATE QUESTION GENERATION FACTORY!
const quizQuestionService = new QuizQuestionService()
export default quizQuestionService