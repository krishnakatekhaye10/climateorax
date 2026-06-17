import { motion } from 'framer-motion';
import { componentClasses, animationVariants } from '../../styles/utilities';

/**
 * Modern Button Component
 * Variants: primary, secondary, outline, ghost, danger
 * Sizes: sm, md, lg
 */
export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  children,
  animate = true,
  className = '',
  ...props
}) {
  const variantClasses = {
    primary: componentClasses.buttonPrimary,
    secondary: componentClasses.buttonSecondary,
    outline: componentClasses.buttonOutline,
    ghost: componentClasses.buttonGhost,
    danger: componentClasses.buttonDanger,
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
  };

  const Component = animate ? motion.button : 'button';

  return (
    <Component
      className={`${componentClasses.buttonBase} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      {...props}
    >
      {loading && (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {Icon && !loading && <Icon size={18} />}
      {children}
    </Component>
  );
}

/**
 * Modern Card Component
 * Variants: default, premium, glass
 */
export function Card({
  variant = 'default',
  children,
  className = '',
  animate = true,
  ...props
}) {
  const variantClasses = {
    default: componentClasses.card,
    premium: componentClasses.cardPremium,
    glass: componentClasses.cardGlass,
  };

  const Component = animate ? motion.div : 'div';

  return (
    <Component
      className={`${variantClasses[variant]} p-6 ${className}`}
      {...(animate ? animationVariants.slideUp : {})}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Modern Badge Component
 */
export function Badge({
  variant = 'primary',
  children,
  className = '',
  ...props
}) {
  const variantClasses = {
    primary: componentClasses.badgePrimary,
    secondary: componentClasses.badgeSecondary,
    neutral: componentClasses.badgeNeutral,
  };

  return (
    <span
      className={`${componentClasses.badge} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

/**
 * Modern Input Component
 */
export function Input({
  label,
  error,
  helperText,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
      )}
      <input
        className={`${componentClasses.inputBase} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-xs text-neutral-500">{helperText}</p>
      )}
    </div>
  );
}

/**
 * Modern KPI Card - For metrics display
 */
export function KPICard({
  label,
  value,
  unit,
  icon: Icon,
  trend,
  trendValue,
  color = 'primary',
  className = '',
}) {
  const colorClasses = {
    primary: 'from-green-500/20 to-emerald-500/20 border-green-200/30',
    secondary: 'from-teal-500/20 to-cyan-500/20 border-teal-200/30',
    accent: 'from-blue-500/20 to-cyan-500/20 border-blue-200/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-sm border rounded-xl p-6 ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
          {label}
        </p>
        {Icon && <Icon className="w-5 h-5 text-neutral-400" />}
      </div>
      <div className="flex items-end gap-2">
        <div className="text-3xl font-bold text-neutral-900 dark:text-white">
          {value}
        </div>
        {unit && <span className="text-sm text-neutral-600 dark:text-neutral-400">{unit}</span>}
      </div>
      {trend && (
        <div className={`mt-3 text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? '↑' : '↓'} {trendValue}
        </div>
      )}
    </motion.div>
  );
}

/**
 * Modern Progress Ring
 */
export function ProgressRing({
  value = 50,
  size = 120,
  strokeWidth = 8,
  color = 'primary',
  label,
}) {
  const colorMap = {
    primary: '#22C55E',
    secondary: '#14B8A6',
    accent: '#0EA5E9',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
  };

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-neutral-200 dark:text-neutral-800"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorMap[color]}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            strokeLinecap="round"
            transition={{ duration: 1, ease: 'easeInOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-neutral-900 dark:text-white">
            {Math.round(value)}%
          </span>
        </div>
      </div>
      {label && (
        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
          {label}
        </p>
      )}
    </div>
  );
}

/**
 * Modern Skeleton Loader
 */
export function Skeleton({
  count = 1,
  height = 20,
  circle = false,
  className = '',
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className={`bg-neutral-200 dark:bg-neutral-800 animate-pulse ${
            circle ? 'rounded-full' : 'rounded-lg'
          }`}
          style={{ height }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

export default {
  Button,
  Card,
  Badge,
  Input,
  KPICard,
  ProgressRing,
  Skeleton,
};
