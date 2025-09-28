import SHAPES from '@/constants/Shapes'
import { useAppState } from '@/state/useAppState'
import React from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { useShallow } from 'zustand/shallow'

interface TodaysChallengeCardProps {
  colors: any
  mode?: 'home' | 'quiz-center'
}

const TodaysChallengeCard = ({ colors }: TodaysChallengeCardProps) => {
  // const [isLoading, setIsLoading] = useState(true)
  // const [fallacy, setFallacy] = useState<Fallacy | null>(null)
  // const [isCompleted, setIsCompleted] = useState(false)

  const navigateToDailyChallengeFallacy = useAppState((state) => state.navigateToDailyChallengeFallacy)

  const { isCompleted, todaysFallacy, isLoading } = useAppState(
    useShallow((state) => ({
      isCompleted: state.dailyChallengeStatus?.isCompleted || false,
      todaysFallacy: state.dailyChallengeStatus?.todaysFallacy,
      isLoading: state.dailyChallengeStatus?.isLoading || false // default if optional
    }))
  )

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={navigateToDailyChallengeFallacy}
      activeOpacity={0.96}
      disabled={isLoading}
    >
      <View style={[styles.accentBar, { backgroundColor: isLoading ? '#e5e7eb' : colors.primary }]} />
      
      <View style={styles.content}>
        {isLoading ? (
          <>
            <View style={styles.header}>
              <ActivityIndicator color={colors.primary} size="small" />
              <Text style={[styles.loadingLabel, { color: colors.textSecondary }]}>
                LOADING CHALLENGE...
              </Text>
            </View>
            <View style={styles.loadingPlaceholder}>
              <View style={[styles.loadingBar, { backgroundColor: colors.background }]} />
              <View style={[styles.loadingBar, styles.loadingBarShort, { backgroundColor: colors.background }]} />
            </View>
          </>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={[styles.label, { color: colors.primary }]}>
                TODAY&apos;S CHALLENGE
              </Text>
              {isCompleted && (
                <View style={[styles.completedBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.completedText}>✓ COMPLETED</Text>
                </View>
              )}
            </View>
            
            <View style={styles.main}>
              <Text style={[styles.title, { color: colors.text }]}>
                {todaysFallacy?.title || 'Loading...'}
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {todaysFallacy?.subtitle || 'Loading subtitle...'}
              </Text>
            </View>
            
            <View style={styles.footer}>
              <View style={[styles.idBadge, { backgroundColor: colors.background }]}>
                <Text style={[styles.idText, { color: colors.textSecondary }]}>
                  #{todaysFallacy?.id || '...'}
                </Text>
              </View>
              <Text style={[styles.cta, { color: colors.primary }]}>
                Review Fallacy →
              </Text>
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    height: 200,
    borderRadius: SHAPES.borderRadius,
    marginBottom: SHAPES.standardVerticalMargin,
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  accentBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: 40,
    justifyContent: 'center',
  },
  loadingLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginLeft: 8,
  },
  loadingPlaceholder: {
    marginTop: 20,
  },
  loadingBar: {
    height: 20,
    borderRadius: 4,
    marginBottom: 8,
  },
  loadingBarShort: {
    width: '60%',
    height: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  completedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  completedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  main: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  idText: {
    fontSize: 10,
    fontWeight: '500',
  },
  cta: {
    fontSize: 14,
    fontWeight: '600',
  },
})

export default TodaysChallengeCard