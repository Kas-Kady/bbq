import type { ReactNode } from 'react';
import { Link, NavLink, useLocation } from '@remix-run/react';
import { useMatchesData } from '~/utils';
import type { User } from '@prisma/client';
import Button from '~/components/Button';

export default function Navigation() {
  const data = useMatchesData('root') as { user: User | null } | null;
  const user = data?.user || null;
  const location = useLocation();

  return (
    <nav className="items-left flex flex-col justify-between border-b-2 border-b-cyan-500 px-10 py-5 sm:flex-row sm:items-center">
      <h1 className="font-handwriting text-3xl">
        <Link to="/">BBQ</Link>
      </h1>

      <ul className="flex flex-row items-center gap-5">
        {user ? (
          <>
            <NavigationItem to="/profile">Profiel</NavigationItem>
            <LogoutItem />
          </>
        ) : (
          <>
            <NavigationItem to={`/login?redirectTo=${location.pathname}`}>
              Inloggen
            </NavigationItem>
            <NavigationItem to={`/join?redirectTo=${location.pathname}`}>
              Aanmelden
            </NavigationItem>
          </>
        )}
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
