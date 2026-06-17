/**
 * Design System Utilities
 * Helper functions and constants for consistent styling
 */

// Layout utilities
export const layoutClasses = {
  container: 'w-full max-w-7xl mx-auto px-4 md:px-8',
  containerSm: 'w-full max-w-2xl mx-auto px-4 md:px-8',
  containerLg: 'w-full max-w-full px-4 md:px-8',
  
  // Grid systems
  gridCols: {
    auto: 'grid-cols-1',
    sm: 'grid-cols-1 md:grid-cols-2',
    md: 'grid-cols-1 md:grid-cols-3',
    lg: 'grid-cols-1 md:grid-cols-4',
  },

  // Flexbox alignments
  centerFlex: 'flex items-center justify-center',
  centerFlexCol: 'flex flex-col items-center justify-center',
  spaceBetween: 'flex items-center justify-between',
  spaceBetweenCol: 'flex flex-col items-center justify-between',
};

// Component base styles
export const componentClasses = {
  // Cards
  card: 'rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm',
  cardPremium: 'rounded-xl border border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950 shadow-lg backdrop-blur-sm',
  cardGlass: 'rounded-xl border border-white/20 bg-white/10 dark:bg-white/5 backdrop-blur-md shadow-sm',

  // Buttons
  buttonBase: 'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
  buttonPrimary: 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md',
  buttonSecondary: 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white',
  buttonOutline: 'border border-neutral-300 dark:border-neutral-700 bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-900 dark:text-white',
  buttonGhost: 'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white',
  buttonDanger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md',

  // Input fields
  inputBase: 'w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/10',

  // Badge
  badge: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
  badgePrimary: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  badgeSecondary: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  badgeNeutral: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300',

  // Text
  textHeading1: 'text-4xl md:text-5xl font-bold tracking-tight',
  textHeading2: 'text-3xl md:text-4xl font-bold tracking-tight',
  textHeading3: 'text-2xl md:text-3xl font-bold tracking-tight',
  textHeading4: 'text-xl md:text-2xl font-semibold tracking-tight',
  textBody: 'text-base text-neutral-700 dark:text-neutral-300',
  textSmall: 'text-sm text-neutral-600 dark:text-neutral-400',
  textMuted: 'text-xs text-neutral-500 dark:text-neutral-500',

  // Sections
  section: 'py-12 md:py-20',
  sectionPadding: 'px-4 md:px-8 py-12 md:py-20',
};

// Animation utilities
export const animationVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  },
  slideLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3 },
  },
  slideRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 },
  },
  bounce: {
    animate: { y: [0, -10, 0] },
    transition: { duration: 0.6, repeat: Infinity },
  },
  pulse: {
    animate: { opacity: [1, 0.5, 1] },
    transition: { duration: 2, repeat: Infinity },
  },
};

// Color utilities
export const colorClasses = {
  // Text colors
  textPrimary: 'text-green-600 dark:text-green-400',
  textSecondary: 'text-teal-600 dark:text-teal-400',
  textAccent: 'text-blue-600 dark:text-blue-400',
  textSuccess: 'text-green-600',
  textWarning: 'text-amber-600',
  textError: 'text-red-600',
  textMuted: 'text-neutral-600 dark:text-neutral-400',

  // Background colors
  bgPrimary: 'bg-green-50 dark:bg-green-950/30',
  bgSecondary: 'bg-teal-50 dark:bg-teal-950/30',
  bgAccent: 'bg-blue-50 dark:bg-blue-950/30',
  bgSuccess: 'bg-green-50 dark:bg-green-950/30',
  bgWarning: 'bg-amber-50 dark:bg-amber-950/30',
  bgError: 'bg-red-50 dark:bg-red-950/30',

  // Border colors
  borderPrimary: 'border-green-200 dark:border-green-800',
  borderSecondary: 'border-teal-200 dark:border-teal-800',
  borderAccent: 'border-blue-200 dark:border-blue-800',
};

// Gradient utilities
export const gradients = {
  brand: 'from-green-500 to-teal-500',
  warm: 'from-amber-500 to-orange-500',
  cool: 'from-blue-500 to-cyan-500',
  sunset: 'from-orange-500 via-red-500 to-pink-500',
  aurora: 'from-purple-500 via-pink-500 to-red-500',
  greenBlue: 'from-green-400 to-blue-500',
};

// Responsive utilities
export const responsive = {
  hideOnMobile: 'hidden sm:block',
  hideOnDesktop: 'sm:hidden',
  showOnMobile: 'sm:hidden',
  showOnDesktop: 'hidden sm:block',
};

export default {
  layoutClasses,
  componentClasses,
  animationVariants,
  colorClasses,
  gradients,
  responsive,
};
