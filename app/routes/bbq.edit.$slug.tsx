import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { requireAdminUser } from '~/session.server';
import { getBBQ } from '~/models/bbq.server';
import { useLoaderData } from '@remix-run/react';
import Navigation from '~/components/Navigation';
import BBQForm from '~/components/BBQForm';
import MainLayout from '~/layouts/Main';
import type { BBQ, Upgrade } from '~/models/bbq.server';

type Response = {
  bbq: Omit<BBQ, 'createdAt' | 'updatedAt'> & {
    upgrades: Upgrade[];
  };
};

export async function loader({ request, params }: LoaderArgs) {
  await requireAdminUser(request);

  const bbqSlug = params.slug;

  invariant(bbqSlug, 'No bbq slug provided');

  const bbq = await getBBQ(bbqSlug);

  invariant(bbq, 'No bbq found');

  return json<Response>({
    bbq: {
      id: bbq.id,
      slug: bbq.slug,
      title: bbq.title,
      description: bbq.description,
      date: bbq.date,
      proposedDates: bbq.proposedDates,
      upgrades: bbq.upgrades,
    },
  });
}

export async function action({ request }: LoaderArgs) {
  await requireAdminUser(request);
}

export default function EditBBQRoute() {
  const { bbq } = useLoaderData<typeof loader>();

  if (!bbq) {
    return null;
  }

  return (
    <>
      <Navigation />

      <MainLayout>
        <h1 className="mb-5 font-handwriting text-7xl">Nieuwe BBQ</h1>

        <BBQForm action="/api/bbq" bbq={bbq} upgrades={bbq.upgrades} />
      </MainLayout>
    </>
  );
}
