export const colors = {
  primary: '#FF6B00', // Bright orange for CTAs and primary actions
  primaryLight: '#FF8C3F',
  primaryDark: '#E55A00',
  secondary: '#2E4057', // Dark blue for headers and contrasts
  background: '#FFFFFF',
  card: '#F8F8F8',
  text: '#333333',
  textLight: '#666666',
  border: '#EEEEEE',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
  info: '#2196F3',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  fontSizes: {
    xs: 12,
    s: 14,
    m: 16,
    l: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontWeights: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
  lineHeights: {
    xs: 16,
    s: 20,
    m: 24,
    l: 28,
    xl: 32,
    xxl: 36,
    xxxl: 48,
  },
};

export const borderRadius = {
  s: 4,
  m: 8,
  l: 16,
  xl: 24,
  circle: 999,
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
};

export default theme; 