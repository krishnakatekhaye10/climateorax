export default function RangeInput({ id, label, value, min, max, step = 1, onChange, description }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full accent-emerald-500"
      />
      <div className="text-sm text-slate-500 dark:text-slate-400">{description}</div>
    </div>
  );
}
