import { Link } from '@remix-run/react';
import type { User } from '@prisma/client';
import { useMatchesData } from '~/utils';
import { ROLE } from '@prisma/client';

export default function ProfileMenu() {
  const { user } = useMatchesData('root') as { user: User };

  return (
    <nav className="flex h-auto w-full flex-col bg-primary-light px-10 py-10 sm:h-full sm:w-1/4 sm:py-20">
      <h2 className="font-handwriting text-5xl">Menu</h2>

      <ul className="mb-0 mt-5 space-y-5 sm:mb-10">
        <li>
          <Link to="/profile/bbqs" className="text-2xl">
            Mijn BBQ's bekijken
          </Link>
        </li>
        <li>
          <Link to="/profile/settings" className="text-2xl">
            Instellingen
          </Link>
        </li>
      </ul>

      {user.role === ROLE.ADMIN ? (
        <>
          <h2 className="font-handwriting text-4xl">Admins</h2>
          <ul className="mb-10 mt-5 space-y-5">
            <li>
              <Link to="/bbq/new" className="text-2xl">
                Nieuwe BBQ aanmaken
              </Link>
            </li>
            <li>
              <Link to="/profile/inschrijvingen" className="text-2xl">
                BBQ inschrijvingen bekijken
              </Link>
            </li>
          </ul>
        </>
      ) : null}
    </nav>
  );
}
