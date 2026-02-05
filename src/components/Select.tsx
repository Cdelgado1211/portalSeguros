import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
}

export const Select = ({ label, error, id, children, ...rest }: SelectProps) => {
  const selectId = id ?? rest.name ?? label;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={selectId} className="text-xs font-medium text-slate-700">
        {label}
      </label>
      <div className="rounded-full border border-border bg-surface-alt px-3 py-2 text-sm focus-within:border-primary">
        <select
          {...rest}
          id={selectId}
          className="w-full bg-transparent text-sm text-slate-900 outline-none"
        >
          {children}
        </select>
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
};

