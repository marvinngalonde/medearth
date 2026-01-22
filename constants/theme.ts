// Theme Configuration for TreatSync App
export const theme = {
  colors: {
    // Primary Colors
    primary: {
      DEFAULT: '#1E3A8A',
      light: '#3B82F6',
      dark: '#1E40AF',
    },
    secondary: {
      DEFAULT: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    accent: {
      DEFAULT: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    danger: {
      DEFAULT: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },

    // Neutral Colors
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },

    // Role-specific colors
    patient: '#1E3A8A',
    pharmacy: '#10B981',
    driver: '#F59E0B',

    // Background
    background: '#F9FAFB',
    surface: '#FFFFFF',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
  },

  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },

  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
  },
} as const;

export type Theme = typeof theme;
