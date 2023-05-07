import type { ReactNode } from 'react';

type Props = {
  label: string;
  children: ReactNode;
  flex?: boolean;
};

export default function Label({ label, children, flex = false }: Props) {
  return (
    <label
      className={`mb-5 w-full ${
        flex ? 'flex flex-col items-center gap-2 sm:flex-row' : ''
      }`}
    >
      <p className={`text-center ${flex ? 'mb-0 flex-1' : 'mb-2'}`}>{label}</p>
      {children}
    </label>
  );
}
