import type { User } from '@prisma/client';
import { useMatchesData } from '~/utils';

export default function ProfileIndexRoute() {
  const { user } = useMatchesData('root') as { user: User };

  return (
    <div className="px-10">
      <h1 className="mb-5 font-handwriting text-7xl">Hallo {user.name}</h1>
      <p className="text-2xl">
        Dit is je profiel. Hier kan je de BBQ's zien waar je aan deelneemt (of
        deel hebt genomen) en je gegevens wijzigen. Voor komende BBQ's kan je
        ook nog je aanwezigheid en andere details wijzigen.
      </p>
    </div>
  );
}
