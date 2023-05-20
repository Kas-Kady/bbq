import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { ROLE } from '@prisma/client';
import { getBBQ } from '~/models/bbq.server';
import Navigation from '~/components/Navigation';
import Button from '~/components/Button';
import MainLayout from '~/layouts/Main';
import { formatAmountToLocale, formatDateToLocale } from '~/utils';
import { getUser } from '~/session.server';

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
          grid-rows-[auto,
          1fr,1fr]
          prose
          prose-lg
          grid
          max-w-none grid-cols-1
          gap-2
          [grid-template-areas:_'title'_'description'_'actions']
          md:grid-cols-[1.5fr,1fr]
          md:grid-rows-[auto,1fr]
          md:[grid-template-areas:_'title_title'_'description_actions']
          lg:grid-cols-[3fr,1fr]
        "
        >
          <div className="w-full flex-none [grid-area:_title]">
            <h1>{title}</h1>
            {date ? <p>Wanneer: {formatDateToLocale(date)}</p> : null}
          </div>

          <div
            className="w-full [grid-area:_description]"
            dangerouslySetInnerHTML={{ __html: description }}
          />

          <div className="w-full flex-none [grid-area:_actions]">
            <Button
              className="w-full"
              variant="primary"
              href={`/bbq/${bbq.slug}/inschrijven`}
            >
              Inschrijven
            </Button>

            {user && user.role === ROLE.ADMIN ? (
              <div className="mt-10 flex flex-col gap-2 bg-secondary-dark p-10">
                <h3 className="mt-0">Admin instellingen</h3>

                <ul className="mb-0">
                  <li className="marker:text-primary-light">
                    <Link to={`/bbq/edit/${bbq.slug}`}>Bewerken</Link>
                  </li>
                </ul>
              </div>
            ) : null}
            {!date && bbq.proposedDates.length > 0 ? (
              <>
                <h2>Voorgestelde data</h2>
                <ul className="pl-2">
                  {bbq.proposedDates.map((date) => (
                    <li className="list-item list-inside pl-0" key={date}>
                      <div className="flex flex-row justify-between gap-2">
                        {formatDateToLocale(date)}
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {bbq.upgrades.length > 0 ? (
              <>
                <h2>Upgrades</h2>
                <ul className="pl-2">
                  {bbq.upgrades.map((upgrade) => (
                    <li className="list-item list-inside pl-0" key={upgrade.id}>
                      <div className="flex flex-row justify-between gap-2">
                        <span>{upgrade.description}</span>
                        <span>{formatAmountToLocale(upgrade.amount)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </div>
      </MainLayout>
    </>
  );
}
