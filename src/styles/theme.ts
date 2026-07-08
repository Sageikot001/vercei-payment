export const theme = {
  colors: {
    primary: '#000000',
    primaryHover: '#333333',
    secondary: '#666666',
    accent: '#0070f3',
    accentHover: '#0060df',
    background: '#ffffff',
    backgroundAlt: '#fafafa',
    border: '#eaeaea',
    text: '#000000',
    textMuted: '#666666',
    success: '#0070f3',
    error: '#ee0000',
    popular: '#7c3aed',
    bestValue: '#059669',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
  },
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '24px',
    xxl: '32px',
    xxxl: '48px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
};

export type Theme = typeof theme;
