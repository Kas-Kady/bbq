import type { ReactNode } from 'react';
import { Link, NavLink } from '@remix-run/react';
import { useMatchesData } from '~/utils';
import type { User } from '@prisma/client';
import Button from '~/components/Button';

export default function Navigation() {
  const { user } = useMatchesData('root') as { user: User | null };

  return (
    <nav className="mb-10 flex flex-row items-center justify-between border-b-2 border-b-cyan-500 px-10 py-5">
      <h1 className="font-handwriting text-3xl">
        <Link to="/">BBQ</Link>
      </h1>

      <ul className="flex flex-row items-center gap-5">
        {user ? (
          <>
            <NavigationItem to="/profile">Profiel</NavigationItem>
            <LogoutItem />
          </>
        ) : null}
      </ul>
    </nav>
  );
}

type NavigationItemProps = {
  to: string;
  children: ReactNode;
};

function NavigationItem({ to, children }: NavigationItemProps) {
  return (
    <li>
      <NavLink
        className={({ isActive }) =>
          `text-lg ${isActive ? 'text-cyan-500' : 'text-gray-500'}`
        }
        to={to}
      >
        {children}
      </NavLink>
    </li>
  );
}

function LogoutItem() {
  return (
    <li>
      <form method="post" action="/logout">
        <Button type="submit">Uitloggen</Button>
      </form>
    </li>
  );
}
