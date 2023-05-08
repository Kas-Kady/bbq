import type { LoaderArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { requireUserId } from '~/session.server';
import ProfileMenu from '~/components/ProfileMenu';
import { Outlet } from '@remix-run/react';
import ProfileLayout from '~/layouts/ProfileLayout';
import Navigation from '~/components/Navigation';

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  if (!userId) return redirect('/login');
  return json({});
};

export default function ProfileRoute() {
  return (
    <ProfileLayout>
      <ProfileMenu />

      <div className="w-3/4">
        <Navigation />
        <Outlet />
      </div>
    </ProfileLayout>
  );
}
