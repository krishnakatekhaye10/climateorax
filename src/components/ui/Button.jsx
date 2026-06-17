import { forwardRef } from 'react';

const VARIANT_CLASSES = {
  primary: 'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20',
  secondary: 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800',
  ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
};

const SIZE_CLASSES = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base'
};

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', className = '', children, type = 'button', ...props },
  ref
) {
  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  return (
    <button
      ref={ref}
      type={type}
      className={`inline-flex items-center justify-center rounded-2xl font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
