import type { V2_MetaFunction } from '@remix-run/node';

import Navigation from '~/components/Navigation';
import { useOptionalUser } from '~/utils';
import MainLayout from '~/layouts/Main';
import { getBBQs } from '~/models/bbq.server';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';

export const meta: V2_MetaFunction = () => [{ title: 'BBQ' }];

export async function loader() {
  const bbqs = await getBBQs();

  return json({ bbqs });
}

export default function Index() {
  const { bbqs } = useLoaderData<typeof loader>();

  return (
    <>
      <Navigation />

      <MainLayout>
        <h1 className="mb-5 font-handwriting text-7xl">BBQ</h1>

        {bbqs.length === 0 ? (
          <p className="text-2xl">
            Er zijn nog geen BBQ's gepland. Kijk later nog eens, of app ons
            eventjes.
          </p>
        ) : (
          <ul className="list-inside list-disc marker:text-cyan-400">
            {bbqs.map((bbq) => (
              <li key={bbq.id}>
                <Link to={`/bbq/${bbq.slug}`}>{bbq.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </MainLayout>
    </>
  );
}
