import AnimatedTabWrapper, { TabAnimationPresets } from '@/components/custom/AnimatedTabWrapper'
import CompletedQuizzesSection from '@/components/custom/quiz-center/CompletedQuizzesSection'
import CustomQuizButton from '@/components/custom/quiz-center/CustomQuizButton'
import DailyChallengeQuizButton from '@/components/custom/quiz-center/DailyChallengeQuizButton'
import NextProgressionCard from '@/components/custom/quiz-center/NextProgressionCard'
import ProgressJourneySection from '@/components/custom/quiz-center/ProgressJourneySection'
import SHAPES from '@/constants/Shapes'
import { useSystemTheme } from '@/hooks/useSystemTheme'
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function QuizIndexScreen() {
  const { colors } = useSystemTheme()
  const insets = useSafeAreaInsets()

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <AnimatedTabWrapper {...TabAnimationPresets.veniceBeachFade}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContentContainer, 
            { paddingTop: insets.top, paddingBottom: insets.bottom + 80 }
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <View style={styles.headerText}>
                <Text style={[styles.title, { color: colors.text }]}>Quiz Center</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Test your knowledge of logical paradoxes
                </Text>
              </View>
            </View>
          </View>

          {/* 🏆 CHAMPIONSHIP: Daily Challenge Button - Now handles its own loading! */}
          <DailyChallengeQuizButton mode="quiz-center"/>


          <NextProgressionCard></NextProgressionCard>

          {/* Weekly Gauntlet */}
          {/* <WeeklyGauntletQuizButton /> */}

          {/* Progress Journey */}
          <ProgressJourneySection></ProgressJourneySection>

          {/* Custom Quiz */}
          <CustomQuizButton 
            style={[{
              padding: SHAPES.standardVerticalMargin,
              borderWidth: SHAPES.buttonBorderWidth,
              borderColor: colors.primary,
            }]}
          />

          {/* Completed Quizzes */}
          <CompletedQuizzesSection></CompletedQuizzesSection>
        </ScrollView>
      </AnimatedTabWrapper>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 20,
  },
  header: {
    paddingVertical: SHAPES.standardVerticalMargin,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
})