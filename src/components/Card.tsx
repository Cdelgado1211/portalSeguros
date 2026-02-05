import type { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => {
  return (
    <div
      className={clsx(
        'rounded-[var(--atlas-radius-card)] border border-border bg-surface-alt p-4 shadow-card',
        className
      )}
    >
      {children}
    </div>
  );
};

