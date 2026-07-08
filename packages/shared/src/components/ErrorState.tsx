import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAppTheme } from '../theme/useAppTheme';
import { AppError } from '../types';

interface ErrorStateProps {
  error: AppError;
  onRetry: () => void;
  retryText?: string;
}

/**
 * Beautiful ErrorState screen mapping friendly alerts and expandable technical stack details
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  retryText = 'Try Again',
}) => {
  const { colors, spacing, typography, borderRadius } = useAppTheme();
  const [showTechnical, setShowTechnical] = useState(false);

  return (
    <View style={[styles.container, { padding: spacing.lg }]}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.error,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
          },
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: colors.errorBackground }]}>
          <Text style={styles.errorIcon}>⚠️</Text>
        </View>
        <Text
          style={[
            styles.title,
            {
              color: colors.textPrimary,
              fontSize: typography.fontSizes.lg,
              marginBottom: spacing.sm,
            },
          ]}
        >
          Oops! Something went wrong
        </Text>

        <Text
          style={[
            styles.message,
            {
              color: colors.textSecondary,
              fontSize: typography.fontSizes.sm,
              marginBottom: spacing.md,
            },
          ]}
        >
          {error.message}
        </Text>

        <View
          style={[
            styles.codeTag,
            { backgroundColor: colors.divider, borderRadius: borderRadius.sm },
          ]}
        >
          <Text style={[styles.codeText, { color: colors.textSecondary }]}>
            ERROR: {error.code}
          </Text>
        </View>

        {error.technicalMessage && (
          <View style={styles.techDetailsContainer}>
            <TouchableOpacity
              onPress={() => setShowTechnical(!showTechnical)}
              style={styles.techToggle}
            >
              <Text style={[styles.techToggleText, { color: colors.secondary }]}>
                {showTechnical ? 'Hide Technical Details' : 'Show Technical Details'}
              </Text>
            </TouchableOpacity>
            {showTechnical && (
              <ScrollView
                nestedScrollEnabled
                style={[
                  styles.techScroll,
                  { backgroundColor: colors.divider, borderRadius: borderRadius.md },
                ]}
              >
                <Text style={[styles.techText, { color: colors.textSecondary }]}>
                  {error.technicalMessage}
                </Text>
              </ScrollView>
            )}
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.error, borderRadius: borderRadius.md }]}
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel={retryText}
        >
          <Text style={styles.buttonText}>{retryText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
    width: '100%',
  },
  card: {
    borderWidth: 1,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorIcon: {
    fontSize: 28,
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    lineHeight: 20,
  },
  codeTag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  codeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  techDetailsContainer: {
    width: '100%',
    marginBottom: 16,
    alignItems: 'center',
  },
  techToggle: {
    paddingVertical: 4,
  },
  techToggleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  techScroll: {
    maxHeight: 120,
    width: '100%',
    padding: 8,
    marginTop: 8,
  },
  techText: {
    fontSize: 11,
  },
  button: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
