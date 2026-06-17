import { forwardRef } from 'react';

const TextInput = forwardRef(function TextInput(
  { id, label, description, className = '', ...props },
  ref
) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-4 py-3 text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-500/20 transition"
        {...props}
      />
      {description ? <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p> : null}
    </div>
  );
});

export default TextInput;
