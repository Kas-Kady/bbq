import type { ReactNode } from 'react';

export type LabelProps = {
  label: string;
  children: ReactNode;
  stacked?: boolean;
  width?: string;
  textAlignment?: 'text-left' | 'text-center' | 'text-right';
  className?: string;
};

export default function Label({
  label,
  children,
  stacked = true,
  width = 'w-full',
  textAlignment = 'text-left',
  className = '',
}: LabelProps) {
  return (
    <label
      className={`flex ${width} items-start gap-2 ${
        stacked ? 'flex-col' : 'flex-col sm:flex-row'
      } ${className}`}
    >
      <p className={`${textAlignment} ${stacked ? 'mb-0 flex-1' : 'mb-2'}`}>
        {label}
      </p>
      {children}
    </label>
  );
}
