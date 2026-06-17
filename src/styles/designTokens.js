/**
 * Design Tokens - Enterprise SaaS Style System
 * Inspired by: Vercel, Linear, Stripe, Notion
 */

export const tokens = {
  // Primary Brand Colors
  colors: {
    primary: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      200: '#BBFBCB',
      300: '#86EFAC',
      400: '#4ADE80',
      500: '#22C55E', // Primary green
      600: '#16A34A',
      700: '#15803D',
      800: '#166534',
      900: '#145231',
    },
    secondary: {
      50: '#F0FDFA',
      100: '#CCFBF1',
      200: '#99F6E4',
      300: '#5EEAD4',
      400: '#2DD4BF',
      500: '#14B8A6', // Secondary teal
      600: '#0D9488',
      700: '#0F766E',
      800: '#134E4A',
      900: '#0F2F2E',
    },
    accent: {
      50: '#F0F9FF',
      100: '#E0F2FE',
      200: '#BAE6FD',
      300: '#7DD3FC',
      400: '#38BDF8',
      500: '#0EA5E9', // Accent blue
      600: '#0284C7',
      700: '#0369A1',
      800: '#075985',
      900: '#0C3D66',
    },
    // Neutrals
    neutral: {
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
      950: '#030712',
    },
    // Status colors
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  // Typography
  typography: {
    fontFamily: {
      sans: 'system-ui, -apple-system, sans-serif',
      mono: 'ui-monospace, monospace',
      display: 'system-ui, -apple-system, sans-serif',
    },
    fontSize: {
      xs: ['12px', { lineHeight: '16px' }],
      sm: ['14px', { lineHeight: '20px' }],
      base: ['16px', { lineHeight: '24px' }],
      lg: ['18px', { lineHeight: '28px' }],
      xl: ['20px', { lineHeight: '28px' }],
      '2xl': ['24px', { lineHeight: '32px' }],
      '3xl': ['30px', { lineHeight: '36px' }],
      '4xl': ['36px', { lineHeight: '40px' }],
      '5xl': ['48px', { lineHeight: '50px' }],
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },

  // Spacing System (4px base)
  spacing: {
    0: '0px',
    0.5: '2px',
    1: '4px',
    1.5: '6px',
    2: '8px',
    2.5: '10px',
    3: '12px',
    3.5: '14px',
    4: '16px',
    5: '20px',
    6: '24px',
    7: '28px',
    8: '32px',
    9: '36px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '4px',
    base: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '20px',
    '3xl': '24px',
    full: '9999px',
  },

  // Shadows
  shadows: {
    none: 'none',
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    premium: '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
  },

  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Z-Index Scale
  zIndex: {
    hide: '-1',
    auto: 'auto',
    base: '0',
    dropdown: '1000',
    sticky: '1020',
    fixed: '1030',
    backdrop: '1040',
    offcanvas: '1050',
    modal: '1060',
    popover: '1070',
    tooltip: '1080',
  },

  // Breakpoints
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

// Utility: Get color value
export const getColor = (colorPath) => {
  const parts = colorPath.split('.');
  let current = tokens.colors;
  for (const part of parts) {
    current = current[part];
    if (!current) return null;
  }
  return current;
};

export default tokens;
