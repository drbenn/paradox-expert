import SHAPES from '@/constants/Shapes';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface NextStepsData {
  title: string;
  description: string;
  achievements?: string[];
  recommendations?: string[];
}

interface NextStepsSectionProps {
  nextStepsData: NextStepsData;
  theme: {
    primaryColor: string;
    successColors: [string, string, ...string[]];
    failColors: [string, string, ...string[]];
    passedText: string;
    failedText: string;
    title: string;
    icon: string;
  };
  colors: {
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
  };
}

export default function NextStepsSection({ nextStepsData, theme, colors }: NextStepsSectionProps) {
  return (
    <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {nextStepsData.title}
      </Text>
      
      <View style={styles.nextStepsContent}>
        <Text style={[styles.nextStepsText, { color: colors.textSecondary }]}>
          {nextStepsData.description}
        </Text>

        {/* Achievements (for passed scenarios) */}
        {nextStepsData.achievements && (
          <View style={styles.achievements}>
            {nextStepsData.achievements.map((achievement: string, index: number) => (
              <Text key={index} style={[styles.achievementText, { color: theme.primaryColor }]}>
                {achievement}
              </Text>
            ))}
          </View>
        )}

        {/* Recommendations (for failed scenarios) */}
        {nextStepsData.recommendations && (
          <View style={styles.recommendations}>
            {nextStepsData.recommendations.map((recommendation: string, index: number) => (
              <Text key={index} style={[styles.recommendationText, { color: colors.textSecondary }]}>
                {recommendation}
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    borderRadius: SHAPES.borderRadius,
    padding: 20,
    marginBottom: SHAPES.standardVerticalMargin,
    borderWidth: SHAPES.cardBorderWidth,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  nextStepsContent: {
    gap: 16,
  },
  nextStepsText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 22,
  },
  achievements: {
    gap: 8,
  },
  achievementText: {
    fontSize: 14,
    fontWeight: '600',
  },
  recommendations: {
    gap: 8,
  },
  recommendationText: {
    fontSize: 14,
    fontWeight: '500',
  },
})