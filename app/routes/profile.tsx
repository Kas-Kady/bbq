import type { LoaderArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import type { User } from '@prisma/client';
import { requireUserId } from '~/session.server';
import { useMatchesData } from '~/utils';
import Button from '~/components/Button';
import MainLayout from '~/layouts/Main';

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  if (!userId) return redirect('/login');
  return json({});
};

export default function ProfileRoute() {
  const { user } = useMatchesData('root') as { user: User };

  return (
    <MainLayout>
      <h1>Profile</h1>
      <p>Hello {user.name}!</p>
      <form method="post" action="/logout">
        <Button type="submit" variant="primary">
          Logout
        </Button>
      </form>
    </MainLayout>
  );
}
