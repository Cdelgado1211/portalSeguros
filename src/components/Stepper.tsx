import type { ReactNode } from 'react';
import clsx from 'clsx';

export interface Step {
  key: string;
  label: string;
}

interface StepperProps {
  steps: Step[];
  activeIndex: number;
}

export const Stepper = ({ steps, activeIndex }: StepperProps) => {
  return (
    <div className="mb-3 flex flex-col gap-2">
      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="bg-primary transition-all"
          style={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
        />
      </div>
      <div className="flex justify-between text-[11px] text-slate-500">
        {steps.map((step, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={step.key}
              className={clsx('flex flex-col items-center gap-0.5', {
                'text-primary font-semibold': isActive
              })}
              aria-current={isActive ? 'step' : undefined}
            >
              <span
                className={clsx(
                  'flex h-5 w-5 items-center justify-center rounded-full border text-[10px]',
                  isActive
                    ? 'border-primary bg-primary text-white'
                    : 'border-slate-300 bg-surface-alt text-slate-600'
                )}
              >
                {index + 1}
              </span>
              <span className="mt-0.5 truncate max-w-[64px] text-center">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

