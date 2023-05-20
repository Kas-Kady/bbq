import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { requireUser } from '~/session.server';
import ProfileMenu from '~/components/ProfileMenu';
import { Outlet } from '@remix-run/react';
import ProfileLayout from '~/layouts/ProfileLayout';
import Navigation from '~/components/Navigation';

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser(request);

  return json({ user });
};

export default function ProfileRoute() {
  return (
    <ProfileLayout>
      <Navigation />
      <div className="flex h-full w-full flex-col sm:h-full sm:w-full sm:flex-row">
        <ProfileMenu />

        <div className="mt-10 px-10">
          <Outlet />
        </div>
      </div>
    </ProfileLayout>
  );
}
