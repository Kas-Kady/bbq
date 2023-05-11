import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { useLoaderData } from '@remix-run/react';
import { getBBQ } from '~/models/bbq.server';
import Navigation from '~/components/Navigation';
import MainLayout from '~/layouts/Main';
import { formatDateToLocale } from '~/utils';

export async function loader({ params }: LoaderArgs) {
  const { slug } = params;

  invariant(slug !== undefined, 'Slug needs to be set');

  const bbq = await getBBQ(slug);

  invariant(bbq !== null, 'No BBQ found.');

  return json({ bbq });
}

export default function BBQRoute() {
  const { bbq } = useLoaderData<typeof loader>();
  const { title, description, date } = bbq;

  return (
    <>
      <Navigation />

      <MainLayout>
        <div className="prose prose-lg">
          <h1>{title}</h1>
          <p>Wanneer: {formatDateToLocale(date)}</p>
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      </MainLayout>
    </>
  );
}
