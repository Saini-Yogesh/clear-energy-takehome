import { useColorScheme } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from './tokens';

export const useAppTheme = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const themeColors = isDark ? colors.dark : colors.light;
  const themeShadows = isDark ? shadows.dark : shadows.light;

  return {
    isDark,
    colors: themeColors,
    spacing,
    typography,
    borderRadius,
    shadows: themeShadows,
  };
};

export type AppTheme = ReturnType<typeof useAppTheme>;
export * from './tokens';
