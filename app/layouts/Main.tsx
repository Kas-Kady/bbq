import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function MainLayout({ children }: Props) {
  return <main className="my-10 px-10">{children}</main>;
}
