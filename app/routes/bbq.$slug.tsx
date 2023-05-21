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
import Icon from '~/components/Icon';

export async function loader({ request, params }: LoaderArgs) {
  const user = await getUser(request);
  const { slug } = params;

  invariant(slug !== undefined, 'Slug needs to be set');

  const bbq = await getBBQ(slug);

  invariant(bbq !== null, 'No BBQ found.');

  const attendee = bbq.attendees.find(
    (attendee) => attendee.userId === user?.id,
  );

  return json({ user, bbq, attendee });
}

export default function BBQRoute() {
  const { user, bbq, attendee } = useLoaderData<typeof loader>();
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
            {attendee ? (
              <div className="flex flex-col space-y-2">
                <Button
                  className="w-full"
                  variant="primary"
                  href={`/bbq/${bbq.slug}/bewerken`}
                >
                  Mijn inschrijving aanpassen
                </Button>
                <Button
                  className="w-full"
                  variant="danger"
                  href={`/bbq/${bbq.slug}/afmelden`}
                >
                  Ik kan niet meer komen
                </Button>
              </div>
            ) : (
              <Button
                className="w-full"
                variant="primary"
                href={`/bbq/${bbq.slug}/inschrijven`}
              >
                Inschrijven
              </Button>
            )}

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
                      <div className="flex flex-row gap-2">
                        {formatDateToLocale(date)}
                        {attendee && attendee.availableDates.includes(date) ? (
                          <span className="text-green-heavy">
                            <Icon name="check-circle" prefix="far" />
                          </span>
                        ) : null}
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
                        <div className="flex flex-row gap-2">
                          {attendee &&
                          attendee.chosenUpgrades.find(
                            (chosenUpgrade) => chosenUpgrade.id === upgrade.id,
                          ) ? (
                            <span className="text-green-heavy">
                              <Icon name="check-circle" prefix="far" />
                            </span>
                          ) : null}
                          {formatAmountToLocale(upgrade.amount)}
                        </div>
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
