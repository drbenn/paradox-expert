// 🎯  "WHAT'S NEXT" SUGGESTIONS HELPER
// Centralized logic for post-quiz recommendations based on test type and performance

export interface NextStepsData {
  title: string
  description: string
  achievements?: string[]
  recommendations?: string[]
  primaryAction: {
    text: string
    route: string
  }
  secondaryAction: {
    text: string
    route: string
  }
}

export function getNextStepsData(
  testType: string,
  passed: boolean,
  score: number
): NextStepsData {
  
  switch (testType) {
    case 'unit_test':
      return getUnitTestNextSteps(passed, score)
    
    case 'daily_challenge':
      return getDailyChallengeNextSteps(passed, score)
    
    case 'weekly_gauntlet':
      return getWeeklyGauntletNextSteps(passed, score)
    
    case 'custom':
      return getCustomQuizNextSteps(passed, score)
    
    default: // regular quiz
      return getRegularQuizNextSteps(passed, score)
  }
}

// 🏆 UNIT TEST NEXT STEPS
function getUnitTestNextSteps(passed: boolean, score: number): NextStepsData {
  if (passed) {
    return {
      title: '🏆 Tier Mastered!',
      description: 'Outstanding! You\'ve mastered this entire tier of fallacies. You can now confidently move to the next tier or review any concepts in the library.',
      achievements: [
        '🏆 Tier comprehensively mastered',
        '🔓 Next tier unlocked',
        '📈 Achievement earned'
      ],
      primaryAction: {
        text: 'Continue to Quiz Center',
        route: '/(tabs)/quiz'
      },
      secondaryAction: {
        text: 'Review All Fallacies',
        route: '/(tabs)/library'
      }
    }
  } else {
    return {
      title: '📚 Unit Test Study Plan',
      description: 'Unit tests are challenging! Review the fallacies from this tier in the library, retake individual quizzes, then try the unit test again.',
      recommendations: [
        '📖 Review all tier fallacies in Library',
        '🔄 Retake individual quizzes in this tier',
        '🏆 Retry unit test when confident'
      ],
      primaryAction: {
        text: 'Continue to Quiz Center',
        route: '/(tabs)/quiz'
      },
      secondaryAction: {
        text: 'Review All Fallacies',
        route: '/(tabs)/library'
      }
    }
  }
}

// ⚡ DAILY CHALLENGE NEXT STEPS
function getDailyChallengeNextSteps(passed: boolean, score: number): NextStepsData {
  if (passed) {
    return {
      title: '⚡ Daily Challenge Crushed!',
      description: 'Excellent work on today\'s challenge! Your daily dedication is building real expertise. Come back tomorrow for your next challenge!',
      achievements: [
        '⚡ Daily challenge completed',
        '🔥 Streak maintained',
        '📅 Tomorrow\'s challenge unlocked'
      ],
      primaryAction: {
        text: 'Continue to Quiz Center',
        route: '/(tabs)/quiz'
      },
      secondaryAction: {
        text: 'Review All Fallacies',
        route: '/(tabs)/library'
      }
    }
  } else {
    return {
      title: '⚡ Challenge Practice Needed',
      description: 'Daily challenges focus on mastery! Review today\'s fallacy in the library, then retake the challenge. You can retry as many times as needed.',
      recommendations: [
        '📖 Study today\'s featured fallacy',
        '💡 Review examples and explanations',
        '🔄 Retake when ready - no limits!'
      ],
      primaryAction: {
        text: 'Continue to Quiz Center',
        route: '/(tabs)/quiz'
      },
      secondaryAction: {
        text: 'Review All Fallacies',
        route: '/(tabs)/library'
      }
    }
  }
}

// 🔥 WEEKLY GAUNTLET NEXT STEPS
function getWeeklyGauntletNextSteps(passed: boolean, score: number): NextStepsData {
  if (passed) {
    return {
      title: '🔥 Gauntlet Conquered!',
      description: 'INCREDIBLE endurance! You survived the ultimate weekly challenge. Your comprehensive knowledge across all unlocked fallacies is impressive!',
      achievements: [
        '🔥 Weekly gauntlet survived',
        '🏆 Endurance mastery proven',
        '📊 Comprehensive knowledge demonstrated'
      ],
      primaryAction: {
        text: 'Continue to Quiz Center',
        route: '/(tabs)/quiz'
      },
      secondaryAction: {
        text: 'Review All Fallacies',
        route: '/(tabs)/library'
      }
    }
  } else {
    return {
      title: '🔥 Gauntlet Training Needed',
      description: 'The weekly gauntlet is the ultimate endurance test! Focus on your regular quiz progression and daily challenges to build comprehensive knowledge.',
      recommendations: [
        '📈 Continue regular quiz progression',
        '⚡ Complete daily challenges consistently',
        '🔄 Try the gauntlet again next week'
      ],
      primaryAction: {
        text: 'Continue to Quiz Center',
        route: '/(tabs)/quiz'
      },
      secondaryAction: {
        text: 'Review All Fallacies',
        route: '/(tabs)/library'
      }
    }
  }
}

// 🎨 CUSTOM QUIZ NEXT STEPS
function getCustomQuizNextSteps(passed: boolean, score: number): NextStepsData {
  if (passed) {
    return {
      title: '🎨 Creative Success!',
      description: 'Fantastic work on your custom creation! You designed a personalized challenge and conquered it. Your creativity and knowledge are both impressive!',
      achievements: [
        '🎨 Custom challenge completed',
        '🧠 Personalized learning achieved',
        '🏆 Creative mastery demonstrated'
      ],
      primaryAction: {
        text: 'Continue to Quiz Center',
        route: '/(tabs)/quiz'
      },
      secondaryAction: {
        text: 'Create Another Quiz',
        route: '/(tabs)/quiz/custom-quiz-builder-screen'
      }
    }
  } else {
    return {
      title: '🎨 Custom Challenge Practice',
      description: 'Your custom quiz revealed areas for improvement! Review the fallacies you selected, adjust your quiz settings, or try with fewer fallacies.',
      recommendations: [
        '📖 Review the fallacies you selected',
        '🔧 Try with fewer fallacies or easier settings',
        '🎯 Focus on your weak areas first'
      ],
      primaryAction: {
        text: 'Create Easier Custom Quiz',
        route: '/(tabs)/quiz/custom-quiz-builder-screen'
      },
      secondaryAction: {
        text: 'Review All Fallacies',
        route: '/(tabs)/library'
      }
    }
  }
}

// 🏅 REGULAR QUIZ NEXT STEPS
function getRegularQuizNextSteps(passed: boolean, score: number): NextStepsData {
  if (passed) {
    return {
      title: '🎯 Great Progress!',
      description: 'Excellent work! You\'ve mastered this set of fallacies. Continue your learning journey with the next quiz or deepen your understanding in the library.',
      achievements: [
        '🏅 Quiz completed successfully',
        '🔓 Next quiz unlocked',
        '📈 Progress saved'
      ],
      primaryAction: {
        text: 'Continue to Quiz Center',
        route: '/(tabs)/quiz'
      },
      secondaryAction: {
        text: 'Review All Fallacies',
        route: '/(tabs)/library'
      }
    }
  } else {
    return {
      title: '📚 Keep Learning!',
      description: 'Learning logical fallacies takes practice! Review the fallacies from this quiz in the library, then give it another try when you\'re ready.',
      recommendations: [
        '💡 Review fallacies in the Library tab',
        '📖 Study the examples and explanations',
        '🔄 Retake the quiz when ready'
      ],
      primaryAction: {
        text: 'Continue to Quiz Center',
        route: '/(tabs)/quiz'
      },
      secondaryAction: {
        text: 'Review All Fallacies',
        route: '/(tabs)/library'
      }
    }
  }
}

// 🎯  USAGE INSTRUCTIONS:
/*
CHAMPIONSHIP "WHAT'S NEXT" HELPER USAGE:

🏆 HOW TO USE:
import { getNextStepsData } from '@/utils/whatsNextHelper'

const nextSteps = getNextStepsData(testType, passed, score)

// Then use the structured data:
- nextSteps.title (for section header)
- nextSteps.description (for main explanation)
- nextSteps.achievements (for success scenarios)
- nextSteps.recommendations (for failure scenarios)
- nextSteps.primaryAction (for main button)
- nextSteps.secondaryAction (for secondary button)

🎨 FEATURES:
- Centralized suggestion logic
- Test-type-specific messaging
- Consistent action patterns
- Easy to maintain and update
- Proper separation of concerns

💪 BENEFITS:
- Keep results screen clean
- Easy to update suggestions
- Consistent user experience
- Maintainable architecture

WHATCHA GONNA DO WHEN THESE SPECIALIZED SUGGESTIONS RUN WILD?! 🎵
*/

export default getNextStepsData