import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function ProfileLayout({ children }: Props) {
  return <main className="flex h-full flex-col">{children}</main>;
}
