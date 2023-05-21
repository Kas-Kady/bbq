import type { LoaderArgs } from '@remix-run/node';
import { json, V2_MetaFunction } from '@remix-run/node';
import { requireUser } from '~/session.server';
import invariant from 'tiny-invariant';
import { unattendBBQ } from '~/models/bbq.server';
import Navigation from '~/components/Navigation';
import MainLayout from '~/layouts/Main';
import { Link, useLoaderData } from '@remix-run/react';

export async function loader({ request, params }: LoaderArgs) {
  const user = await requireUser(request);

  const { slug } = params;
  invariant(slug !== undefined, 'Slug needs to be set');

  const bbq = await unattendBBQ(user.id, slug);

  return json({ bbq });
}

export const meta: V2_MetaFunction = ({ data }) => [
  {
    title: data.bbq.title,
  },
];

export default function UnattendBBQRoute() {
  const { bbq } = useLoaderData<typeof loader>();

  return (
    <>
      <Navigation />

      <MainLayout>
        <h1 className="font-handwriting text-7xl">Ah, wat jammer..</h1>
        <p className="my-14 w-1/2 text-2xl">
          Je bent afgemeld voor {bbq.title}. Hopelijk zien we je een andere
          keer!
        </p>
        <Link to={`/bbq/${bbq.slug}`}>Terug naar de BBQ</Link>
      </MainLayout>
    </>
  );
}
