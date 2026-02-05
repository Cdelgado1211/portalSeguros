import type { InputHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  rightElement?: ReactNode;
}

export const Input = ({ label, error, rightElement, className, id, ...rest }: InputProps) => {
  const inputId = id ?? rest.name ?? label;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-xs font-medium text-slate-700">
        {label}
      </label>
      <div className="flex items-center rounded-full border border-border bg-surface-alt px-3 py-2 text-sm focus-within:border-primary">
        <input
          {...rest}
          id={inputId}
          className={clsx(
            'w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400',
            className
          )}
        />
        {rightElement && <div className="ml-2">{rightElement}</div>}
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
};

