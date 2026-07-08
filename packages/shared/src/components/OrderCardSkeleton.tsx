import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useAppTheme } from '../theme/useAppTheme';

/**
 * Animated pulsing skeleton loader for OrderCards to avoid standard spinner screens
 */
export const OrderCardSkeleton: React.FC = () => {
  const { colors, spacing, borderRadius } = useAppTheme();
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const animatedStyle = {
    opacity: pulseAnim,
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          padding: spacing.lg,
          marginBottom: spacing.md,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <Animated.View
          style={[
            styles.shimmer,
            animatedStyle,
            { width: 80, height: 16, backgroundColor: colors.divider },
          ]}
        />
        <Animated.View
          style={[
            styles.shimmer,
            animatedStyle,
            { width: 60, height: 20, borderRadius: 6, backgroundColor: colors.divider },
          ]}
        />
      </View>

      <Animated.View
        style={[
          styles.shimmer,
          animatedStyle,
          { width: '60%', height: 18, marginBottom: 8, backgroundColor: colors.divider },
        ]}
      />
      <Animated.View
        style={[
          styles.shimmer,
          animatedStyle,
          { width: '90%', height: 14, marginBottom: 4, backgroundColor: colors.divider },
        ]}
      />
      <Animated.View
        style={[
          styles.shimmer,
          animatedStyle,
          { width: '80%', height: 14, marginBottom: 16, backgroundColor: colors.divider },
        ]}
      />

      <View style={styles.metaRow}>
        <View>
          <Animated.View
            style={[
              styles.shimmer,
              animatedStyle,
              { width: 50, height: 10, marginBottom: 4, backgroundColor: colors.divider },
            ]}
          />
          <Animated.View
            style={[
              styles.shimmer,
              animatedStyle,
              { width: 70, height: 16, backgroundColor: colors.divider },
            ]}
          />
        </View>
        <View style={styles.metaRight}>
          <Animated.View
            style={[
              styles.shimmer,
              animatedStyle,
              { width: 50, height: 10, marginBottom: 4, backgroundColor: colors.divider },
            ]}
          />
          <Animated.View
            style={[
              styles.shimmer,
              animatedStyle,
              { width: 80, height: 16, backgroundColor: colors.divider },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  shimmer: {
    borderRadius: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
  },
  metaRight: {
    alignItems: 'flex-end',
  },
});
