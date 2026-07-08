import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../theme/useAppTheme';

interface EmptyStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

/**
 * Standard empty state component with simple illustration, message, and retry actions
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Found',
  message,
  onRetry,
  retryText = 'Refresh',
}) => {
  const { colors, spacing, typography, borderRadius } = useAppTheme();

  return (
    <View style={[styles.container, { padding: spacing.xxl }]}>
      <View style={[styles.iconContainer, { backgroundColor: colors.divider }]}>
        <Text style={styles.illustrationIcon}>📦</Text>
      </View>
      <Text
        style={[
          styles.title,
          {
            color: colors.textPrimary,
            fontSize: typography.fontSizes.lg,
            marginBottom: spacing.sm,
            fontWeight: typography.fontWeights.bold,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.message,
          {
            color: colors.textSecondary,
            fontSize: typography.fontSizes.sm,
            marginBottom: spacing.xl,
          },
        ]}
      >
        {message}
      </Text>
      {onRetry && (
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: colors.primary,
              borderRadius: borderRadius.md,
              paddingHorizontal: spacing.xl,
            },
          ]}
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel={retryText}
        >
          <Text style={styles.buttonText}>{retryText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  illustrationIcon: {
    fontSize: 36,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  button: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
