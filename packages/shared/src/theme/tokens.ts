export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const colors = {
  light: {
    primary: '#059669', // Emerald 600
    secondary: '#0284C7', // Sky 600
    background: '#F8FAFC', // Slate 50
    card: '#FFFFFF',
    textPrimary: '#0F172A', // Slate 900
    textSecondary: '#475569', // Slate 600
    border: '#E2E8F0', // Slate 200
    divider: '#F1F5F9', // Slate 100
    error: '#EF4444',
    errorBackground: '#FEF2F2',
    success: '#10B981',
    successBackground: '#ECFDF5',
    warning: '#F59E0B',
    warningBackground: '#FEF3C7',
    info: '#3B82F6',
    infoBackground: '#EFF6FF',
    shadow: '#0F172A',
  },
  dark: {
    primary: '#10B981', // Emerald 500
    secondary: '#38BDF8', // Sky 400
    background: '#0F172A', // Slate 900
    card: '#1E293B', // Slate 800
    textPrimary: '#F8FAFC', // Slate 50
    textSecondary: '#94A3B8', // Slate 400
    border: '#334155', // Slate 700
    divider: '#1E293B', // Slate 800
    error: '#F87171',
    errorBackground: '#451A03', // Dark Red
    success: '#34D399',
    successBackground: '#064E3B', // Dark Green
    warning: '#FBBF24',
    warningBackground: '#78350F', // Dark Amber
    info: '#60A5FA',
    infoBackground: '#172554', // Dark Blue
    shadow: '#000000',
  },
};

export const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
  },
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

export const shadows = {
  light: {
    shadowColor: colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  dark: {
    shadowColor: colors.dark.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
};
