import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { Link, useLoaderData } from '@remix-run/react';
import { getBBQ } from '~/models/bbq.server';
import Navigation from '~/components/Navigation';
import MainLayout from '~/layouts/Main';
import { formatDateToLocale } from '~/utils';
import Button from '~/components/Button';
import { getUser } from '~/session.server';
import { ROLE } from '@prisma/client';
import Anchor from '~/components/Anchor';

export async function loader({ request, params }: LoaderArgs) {
  const user = await getUser(request);
  const { slug } = params;

  invariant(slug !== undefined, 'Slug needs to be set');

  const bbq = await getBBQ(slug);

  invariant(bbq !== null, 'No BBQ found.');

  return json({ user, bbq });
}

export default function BBQRoute() {
  const { user, bbq } = useLoaderData<typeof loader>();
  const { title, description, date } = bbq;

  return (
    <>
      <Navigation />

      <MainLayout>
        <div
          className="
          prose
          prose-lg
          grid
          max-w-none
          grid-cols-1
          grid-rows-3
          gap-2
          [grid-template-areas:_'title'_'information'_'upgrades']
          sm:grid-cols-[3fr,1fr]
          sm:grid-rows-2
          sm:[grid-template-areas:_'title_title'_'information_upgrades']
        "
        >
          <div className="w-full flex-none">
            <h1>{title}</h1>
            <p>Wanneer: {formatDateToLocale(date)}</p>
            <div dangerouslySetInnerHTML={{ __html: description }} />
          </div>

          <div className="w-full flex-none">
            {user && user.role === ROLE.ADMIN ? (
              <div className="flex flex-col gap-2 bg-secondary-dark p-10">
                <h3 className="mt-0">Admin instellingen</h3>

                <ul className="mb-0">
                  <li className="marker:text-primary-light">
                    <Link to={`/bbq/edit/${bbq.slug}`}>Bewerken</Link>
                  </li>
                </ul>
              </div>
            ) : null}
            {bbq.upgrades.length > 0 ? (
              <>
                <h2>Upgrades</h2>
                <ul className="list-item list-inside">
                  {bbq.upgrades.map((upgrade) => (
                    <li
                      className="flex flex-row justify-between gap-2"
                      key={upgrade.id}
                    >
                      <p>{upgrade.description}</p>
                      <p>{upgrade.amount}</p>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}

            <Button className="w-full" variant="primary">
              Inschrijven
            </Button>
          </div>
        </div>
      </MainLayout>
    </>
  );
}
