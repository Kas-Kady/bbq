import type { LoaderArgs } from '@remix-run/node';
import { requireAdminUser } from '~/session.server';
import MainLayout from '~/layouts/Main';
import Navigation from '~/components/Navigation';
import BBQForm from '~/components/BBQForm';

export async function loader({ request }: LoaderArgs) {
  await requireAdminUser(request);
  return null;
}

export default function NewBBQRoute() {
  return (
    <>
      <Navigation />

      <MainLayout>
        <h1 className="mb-5 font-handwriting text-7xl">Nieuwe BBQ</h1>

        <BBQForm action="/api/bbq" />
      </MainLayout>
    </>
  );
}
