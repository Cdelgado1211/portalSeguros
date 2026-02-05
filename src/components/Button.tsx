import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth,
  loading,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <button
      {...rest}
      disabled={isDisabled}
      className={clsx(
        'inline-flex items-center justify-center rounded-full text-sm font-semibold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
        {
          'px-4 py-2.5 text-sm': size === 'md',
          'px-3 py-1.5 text-xs': size === 'sm',
          'w-full': fullWidth,
          'bg-primary text-white shadow-md hover:bg-primary/90': variant === 'primary',
          'border border-border bg-surface-alt text-secondary hover:bg-primary-muted':
            variant === 'secondary',
          'text-slate-700 hover:bg-primary-muted': variant === 'ghost'
        },
        className
      )}
    >
      {loading && (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      )}
      {children}
    </button>
  );
};
