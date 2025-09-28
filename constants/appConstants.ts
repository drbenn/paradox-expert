const appleStoreId = "NEED!"
const googlePlayStorePackageName = "com.sparkdart.paradoxexpert"

const APP_CONSTANTS = {
  // Overview
  APP_NAME: 'Paradox Expert',
  APP_TAGLINE: 'Rational Inquiry',
  VERSION_NO: '1.0.2',

  /**
   * 
   *        WARNING!!    WARNING!!!   WARNING!!   WARNING!!!
   * 
   *    KEEP FALSE DURING BUILD FOR EXPO TESTING -   If you click an
   *    ad while testing the build on physical phone admob will fuck you
   *    over thinking i am trying to game ads and ban you.
   */
  ADS_TESTING_PHASE: true, // Set to FALSE !!only!! when submitting to App Store - 
  DEBUG_TOOLS_ACTIVE: false,
  
  // Developer
  DEVELOPER_CO: 'SparkDart',
  DEVELOPER_EMAIL: 'sparkdart.contact@gmail.com',
  DEVELOPER_WEBSITE: 'https://sparkdart.com',
  APP_WEBSITE: 'https://sparkdart.com/apps/paradox-expert',
  // APP_WEBSITE_APP_PRIVACY_POLICY: 'https://policies.sparkdart.com/paradox-expert/privacy-policy.html',
  // APP_WEBSITE_APP_TERMS_OF_SERVICE: 'https://policies.sparkdart.com/paradox-expert/terms-of-service.html',
  APP_WEBSITE_APP_PRIVACY_POLICY: 'https://sites.google.com/view/sparkdart-policies/paradox-expert-privacy-policy',
  APP_WEBSITE_APP_TERMS_OF_SERVICE: 'https://sites.google.com/view/sparkdart-policies/paradox-expert-terms-of-service',

  // App store
  APPLE_APP_STORE_REVIEW_LINK: `https://apps.apple.com/app/id${appleStoreId}?action=write-review`,
  ANDROID_APP_STORE_REVIEW_LINK: `https://play.google.com/store/apps/details?id=${googlePlayStorePackageName}&showAllReviews=true`,

  // 🏆  QUIZ CONFIGURATION - Championship Level Settings!
  QUIZ: {
    // 🎯 Question Counts
    REGULAR_QUIZ_QUESTIONS: 10,      // 10 questions per regular quiz
    UNIT_TEST_QUESTIONS: 20,         // 20 questions per unit test
    FALLACIES_PER_QUIZ: 5,          // How many paradoxes each regular quiz covers
    
    // ⏰ Timing Settings
    QUESTION_TIME_LIMIT_SECONDS: 10,     // 60 seconds per question
    REGULAR_QUIZ_TIME_LIMIT_SECONDS: 100, // 10 minutes total for regular quiz (10 questions × 60s)
    UNIT_TEST_TIME_LIMIT_SECONDS: 1200,   // 20 minutes total for unit test (20 questions × 60s)
    
    // 🎯 Scoring Settings
    REGULAR_QUIZ_PASSING_SCORE: 70,      // 70% to pass regular quizzes
    UNIT_TEST_PASSING_SCORE: 70,         // 70% to pass unit tests (higher bar!)
    
    // 🎲 Question Type Distribution (should add up to 1.0)
    QUESTION_TYPE_DISTRIBUTION: {
      example_selection: 0.4,        // 40% - "Pick the example that demonstrates..."
      true_false: 0.2,              // 20% - "True or False: This example demonstrates..."
      scenario_identification: 0.2,  // 20% - "Which paradox is described below?"
      binary_choice: 0.2            // 20% - "Which paradox does this example demonstrate?" (2 options)
    }
  },

  // 🎯  FALLACY OF THE DAY - MEGA POWERS SELECTION!
  DAILY_CHALLENGE: {
    CURRENT_TIER_PREFERENCE: 0.8,    // 80% chance to pick from current tier
    ANY_UNLOCKED_PREFERENCE: 0.2,    // 20% chance to pick from any unlocked paradox
    
    // 🏆 MAINTENANCE MODE (when all quizzes completed)
    MAINTENANCE_MODE: {
      HIGHER_TIER_PREFERENCE: 0.7,   // 70% chance for tiers 7-10
      LOWER_TIER_PREFERENCE: 0.3     // 30% chance for tiers 1-6
    }
  },

  // 📅 DAILY CHALLENGE RESET SCHEDULE
  DAILY_RESET_CONFIG: {
    // When the daily challenge resets each day
    RESET_HOUR: 0,    // 1 AM (0-23, military time)
    RESET_MINUTE: 1,  // 0 minutes (0-59)
    
    // How often to check for reset (in milliseconds)
    CHECK_INTERVAL: 5000, // Check every 5 seconds
  },






  // 🏆  WEEKLY GAUNTLET - CHAMPIONSHIP MARATHON!
  // WEEKLY_GAUNTLET: {
  //   QUESTIONS_COUNT: 50,              // 50 questions of pure endurance!
  //   BASE_POINTS: 200,                 // Base reward for completion
  //   PASSING_SCORE: 70,                // 70% to pass the gauntlet
  //   QUESTION_TIME_LIMIT: 60,          // 60 seconds per question - stay sharp!
  //   TOTAL_TIME_LIMIT: 3000,           // 50 minutes total (50 * 60 seconds)
    
  //   // 🔥 STREAK BONUS SYSTEM
  //   STREAK_BONUSES: {
  //     WEEK_2: 25,                     // +25 points for 2-week streak
  //     WEEK_3: 75,                     // +75 points for 3-week streak  
  //     WEEK_4_PLUS: 100                // +100 points for 4+ week streak (maintained)
  //   },
    
  //   // 🎯 PERFECT SCORE BONUS
  //   PERFECT_SCORE_BONUS: 50,          // +50 points for 100% score
    
  //   // 🔓 UNLOCK REQUIREMENTS
  //   UNLOCK_REQUIREMENT: 'first_unit_test', // Need to pass any unit test first
  // },

}

export default APP_CONSTANTS;
