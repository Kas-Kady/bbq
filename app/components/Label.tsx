import type { ReactNode } from 'react';

type Props = {
  label: string;
  children: ReactNode;
  stacked?: boolean;
  textAlignment?: 'text-left' | 'text-center' | 'text-right';
  className?: string;
};

export default function Label({
  label,
  children,
  stacked = true,
  textAlignment = 'text-left',
  className = '',
}: Props) {
  return (
    <label
      className={`flex w-full items-start gap-2 ${
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
