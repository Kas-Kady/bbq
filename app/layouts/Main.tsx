import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function MainLayout({ children }: Props) {
  return <main className="px-10">{children}</main>;
}
